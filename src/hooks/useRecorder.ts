import { useCallback, useEffect, useRef, useState } from 'react';

import { isMediaRecorderAvailable } from '@/lib/capability';
import { startRecording, type RecordingSession } from '@/lib/recorder';

export interface UseRecorderResult {
  supported: boolean;
  recording: boolean;
  /** 录音结果的 objectURL（仅内存，不入库） */
  blobUrl: string | null;
  durationMs: number;
  error: string | null;
  /** 供波形组件取样 */
  getAnalyser(): AnalyserNode | null;
  start(): Promise<void>;
  stop(): Promise<void>;
  reset(): void;
}

/**
 * 录音编排。
 * 录音 Blob 首版**不入 IndexedDB**，仅内存 objectURL，卸载即 revoke，避免存储膨胀。
 */
export function useRecorder(): UseRecorderResult {
  const [supported] = useState<boolean>(() => isMediaRecorderAvailable());
  const [recording, setRecording] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<RecordingSession | null>(null);
  const urlRef = useRef<string | null>(null);

  const revoke = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      // 卸载：确保麦克风被释放且 URL 被回收
      const session = sessionRef.current;
      if (session) void session.stop().catch(() => undefined);
      sessionRef.current = null;
      revoke();
    },
    [revoke],
  );

  const start = useCallback(async () => {
    if (!supported) {
      setError('当前浏览器不支持录音，可仅听示范音');
      return;
    }
    if (sessionRef.current) return;
    setError(null);
    try {
      const session = await startRecording();
      sessionRef.current = session;
      setRecording(true);
      setDurationMs(0);
    } catch (err) {
      sessionRef.current = null;
      setRecording(false);
      setError(err instanceof Error ? err.message : '麦克风不可用，可仅听示范音');
    }
  }, [supported]);

  const stop = useCallback(async () => {
    const session = sessionRef.current;
    if (!session) return;
    sessionRef.current = null;
    try {
      const blob = await session.stop();
      revoke();
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setBlobUrl(url);
      setDurationMs(Date.now() - session.startedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : '录音保存失败');
    } finally {
      setRecording(false);
    }
  }, [revoke]);

  const reset = useCallback(() => {
    revoke();
    setBlobUrl(null);
    setDurationMs(0);
    setError(null);
  }, [revoke]);

  const getAnalyser = useCallback(() => sessionRef.current?.getAnalyser() ?? null, []);

  return { supported, recording, blobUrl, durationMs, error, getAnalyser, start, stop, reset };
}
