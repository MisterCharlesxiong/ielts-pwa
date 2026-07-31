/**
 * 平台能力检测。
 *
 * 约定（架构 §7.3）：
 * - 全部惰性求值且 SSR 安全；
 * - 检测结果由组件在**挂载时算一次**存入 state，禁止在 render 里反复调用；
 * - 任何能力不可用都必须**降级而非报错**。
 */

export const isBrowser = (): boolean => typeof window !== 'undefined';

/** iOS Safari（含 iPadOS 桌面模式）—— 用于跟读降级与音频解锁策略 */
export function isIOSSafari(): boolean {
  if (!isBrowser()) return false;
  const ua = window.navigator.userAgent;
  const isIOSDevice =
    /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS 13+ 默认桌面模式：伪装成 Mac，但有触摸点
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
  if (!isIOSDevice) return false;
  // iOS 上所有浏览器都是 WebKit 内核，Chrome(CriOS)/Edge(EdgiOS) 同样没有 SpeechRecognition
  return true;
}

/** window.SpeechRecognition || window.webkitSpeechRecognition */
export function isSpeechRecognitionAvailable(): boolean {
  if (!isBrowser()) return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isTTSAvailable(): boolean {
  if (!isBrowser()) return false;
  return 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
}

export function isMediaRecorderAvailable(): boolean {
  if (!isBrowser()) return false;
  return (
    typeof window.MediaRecorder === 'function' &&
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia)
  );
}

export function isAudioContextAvailable(): boolean {
  if (!isBrowser()) return false;
  return typeof window.AudioContext === 'function' || typeof window.webkitAudioContext === 'function';
}

/** 当前是否在线。Web Speech 识别走云端，离线时必须降级（架构 §8 风险 2） */
export function isOnline(): boolean {
  if (!isBrowser()) return true;
  return navigator.onLine !== false;
}

/** 跟读模式：'auto'（模式A，Web Speech 自动打分）/ 'manual'（模式B，手动打星） */
export type SpeakingMode = 'auto' | 'manual';

export interface SpeakingModeResult {
  mode: SpeakingMode;
  /** 降级原因，模式A 时为 null */
  reason: string | null;
}

/**
 * 跟读模式判定。
 *
 * 【致命坑 #1】Chrome 的 SpeechRecognition 走云端，断网时会静默失败/卡死，
 * 因此 `navigator.onLine === false` 必须直接退化为模式B 并明确提示。
 */
export function resolveSpeakingMode(): SpeakingModeResult {
  if (!isSpeechRecognitionAvailable()) {
    return { mode: 'manual', reason: '当前浏览器不支持语音识别，已切换为自评模式' };
  }
  if (isIOSSafari()) {
    return { mode: 'manual', reason: 'iOS 浏览器不支持语音识别，已切换为自评模式' };
  }
  if (!isOnline()) {
    return { mode: 'manual', reason: '离线状态下改为自评模式' };
  }
  return { mode: 'auto', reason: null };
}
