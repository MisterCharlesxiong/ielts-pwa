import { isMediaRecorderAvailable } from '@/lib/capability';

/**
 * MediaRecorder 封装。
 *
 * 【致命坑 #7】`stop()` 必须遍历 `stream.getTracks()` 逐个 `track.stop()`，
 * 否则麦克风不会释放，手机状态栏会常驻红色录音指示。
 */

const MIME_CANDIDATES = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus'];

/** 探测当前浏览器支持的录音容器格式，全都不支持时返回空串（交给浏览器默认） */
export function pickMimeType(): string {
  if (typeof window === 'undefined' || typeof window.MediaRecorder !== 'function') return '';
  for (const type of MIME_CANDIDATES) {
    try {
      if (MediaRecorder.isTypeSupported(type)) return type;
    } catch {
      /* 某些实现没有 isTypeSupported */
    }
  }
  return '';
}

export interface RecordingSession {
  readonly mimeType: string;
  readonly startedAt: number;
  /** 供 WaveformCanvas 实时取样；AudioContext 不可用时为 null */
  getAnalyser(): AnalyserNode | null;
  /** 停止录音并释放麦克风，返回音频 Blob */
  stop(): Promise<Blob>;
  /** 是否仍在录制 */
  isActive(): boolean;
}

/**
 * 开始录音。
 * 权限被拒 / 不支持时 **抛出带中文描述的 Error**，调用方需 catch 后 Toast 提示且不阻断页面。
 */
export async function startRecording(): Promise<RecordingSession> {
  if (!isMediaRecorderAvailable()) {
    throw new Error('当前浏览器不支持录音');
  }

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  } catch (error) {
    const name = error instanceof DOMException ? error.name : '';
    if (name === 'NotAllowedError' || name === 'SecurityError') {
      throw new Error('麦克风权限被拒绝，可仅听示范音');
    }
    if (name === 'NotFoundError') {
      throw new Error('未检测到麦克风设备，可仅听示范音');
    }
    throw new Error('麦克风不可用，可仅听示范音');
  }

  const mimeType = pickMimeType();
  let recorder: MediaRecorder;
  try {
    recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  } catch {
    stream.getTracks().forEach((t) => t.stop());
    throw new Error('录音初始化失败，可仅听示范音');
  }

  // 波形分析链路（独立于背景音乐的 AudioContext，互不干扰）
  let audioCtx: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let source: MediaStreamAudioSourceNode | null = null;
  try {
    const Ctor = window.AudioContext ?? window.webkitAudioContext;
    if (Ctor) {
      audioCtx = new Ctor();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.75;
      source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      // 注意：不连到 destination，避免自己听到自己（回声）
    }
  } catch {
    analyser = null;
  }

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (event: BlobEvent) => {
    if (event.data && event.data.size > 0) chunks.push(event.data);
  };

  let stopped = false;
  const startedAt = Date.now();

  const releaseHardware = (): void => {
    // 【致命坑 #7】释放麦克风
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch {
        /* ignore */
      }
    });
    try {
      source?.disconnect();
      analyser?.disconnect();
    } catch {
      /* ignore */
    }
    if (audioCtx && audioCtx.state !== 'closed') {
      void audioCtx.close().catch(() => undefined);
    }
    audioCtx = null;
    analyser = null;
    source = null;
  };

  recorder.start(100);

  return {
    mimeType: recorder.mimeType || mimeType,
    startedAt,
    getAnalyser: () => analyser,
    isActive: () => !stopped && recorder.state === 'recording',
    stop(): Promise<Blob> {
      if (stopped) {
        return Promise.resolve(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }));
      }
      stopped = true;
      return new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: recorder.mimeType || mimeType || 'audio/webm' });
          releaseHardware();
          resolve(blob);
        };
        try {
          if (recorder.state !== 'inactive') recorder.stop();
          else {
            releaseHardware();
            resolve(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }));
          }
        } catch {
          releaseHardware();
          resolve(new Blob(chunks, { type: 'audio/webm' }));
        }
      });
    },
  };
}
