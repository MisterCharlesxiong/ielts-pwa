import { isTTSAvailable } from '@/lib/capability';

/**
 * SpeechSynthesis 封装。
 *
 * 两个已知坑：
 * 1. iOS / 部分 Chrome 首次 `getVoices()` 返回空数组，需要监听 `voiceschanged`；
 * 2. 连续 `speak()` 会叠音，因此每次播放前先 `cancel()`。
 */

let voices: SpeechSynthesisVoice[] = [];
let voicesBound = false;

function refreshVoices(): void {
  if (!isTTSAvailable()) return;
  try {
    voices = window.speechSynthesis.getVoices();
  } catch {
    voices = [];
  }
}

function ensureVoiceListener(): void {
  if (voicesBound || !isTTSAvailable()) return;
  voicesBound = true;
  refreshVoices();
  // Safari 不支持 addEventListener('voiceschanged') 的场景下退回 onvoiceschanged
  if (typeof window.speechSynthesis.addEventListener === 'function') {
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
  } else {
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
}

/** 当前可用语音列表 */
export function listVoices(): SpeechSynthesisVoice[] {
  ensureVoiceListener();
  if (voices.length === 0) refreshVoices();
  return voices;
}

/** 优先挑一个英语语音（en-US > en-GB > 任意 en） */
export function pickEnglishVoice(): SpeechSynthesisVoice | null {
  const all = listVoices();
  if (all.length === 0) return null;
  return (
    all.find((v) => v.lang === 'en-US') ??
    all.find((v) => v.lang === 'en-GB') ??
    all.find((v) => v.lang.toLowerCase().startsWith('en')) ??
    null
  );
}

export interface SpeakOptions {
  /** 语速，0.5 - 1.5，默认 0.9 */
  rate?: number;
  /** 音调，默认 1 */
  pitch?: number;
  /** 语言，默认 'en-US' */
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

/**
 * 朗读文本。TTS 不可用时静默走 onError，不抛异常（调用方负责隐藏按钮）。
 * @returns 是否成功发起播放
 */
export function speak(text: string, options: SpeakOptions = {}): boolean {
  if (!isTTSAvailable()) {
    options.onError?.('当前浏览器不支持语音合成');
    return false;
  }
  const trimmed = text.trim();
  if (!trimmed) return false;

  ensureVoiceListener();
  cancel();

  try {
    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.lang = options.lang ?? 'en-US';
    utterance.rate = Math.min(1.5, Math.max(0.5, options.rate ?? 0.9));
    utterance.pitch = options.pitch ?? 1;
    const voice = pickEnglishVoice();
    if (voice) utterance.voice = voice;

    utterance.onstart = () => options.onStart?.();
    utterance.onend = () => options.onEnd?.();
    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      // 主动 cancel() 触发的 'canceled'/'interrupted' 不算错误
      if (event.error === 'canceled' || event.error === 'interrupted') {
        options.onEnd?.();
        return;
      }
      options.onError?.(`语音播放失败：${event.error}`);
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    options.onError?.(String(error));
    return false;
  }
}

/** 停止一切朗读 */
export function cancel(): void {
  if (!isTTSAvailable()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* 忽略：部分浏览器在无播放时 cancel 会抛错 */
  }
}

export function isSpeaking(): boolean {
  if (!isTTSAvailable()) return false;
  try {
    return window.speechSynthesis.speaking;
  } catch {
    return false;
  }
}
