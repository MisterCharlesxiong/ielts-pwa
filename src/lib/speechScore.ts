import { isSpeechRecognitionAvailable } from '@/lib/capability';

/**
 * Web Speech 识别 + 文本相似度打分。
 *
 * 打分口径：归一化（去标点、小写、压空格）后，
 * 词级 Levenshtein 相似度占 60%，字符级占 40%，输出 0-1，再乘 100 取整。
 */

/** 去掉标点与多余空格，统一小写；用于比对而非展示 */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 通用 Levenshtein 距离（对任意可比较序列） */
export function levenshtein<T>(a: readonly T[], b: readonly T[]): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = new Array<number>(n + 1);
  let curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j += 1) prev[j] = j;

  for (let i = 1; i <= m; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, (prev[j] ?? 0) + 1, (prev[j - 1] ?? 0) + cost);
    }
    const swap = prev;
    prev = curr;
    curr = swap;
  }
  return prev[n] ?? 0;
}

function ratio<T>(a: readonly T[], b: readonly T[]): number {
  const longest = Math.max(a.length, b.length);
  if (longest === 0) return 1;
  return Math.max(0, 1 - levenshtein(a, b) / longest);
}

/** 两段文本的相似度，0-1 */
export function similarity(a: string, b: string): number {
  const na = normalizeText(a);
  const nb = normalizeText(b);
  if (!na && !nb) return 1;
  if (!na || !nb) return 0;
  const wordRatio = ratio(na.split(' '), nb.split(' '));
  const charRatio = ratio(Array.from(na), Array.from(nb));
  return Math.min(1, Math.max(0, wordRatio * 0.6 + charRatio * 0.4));
}

/** 相似度 → 0-100 分 */
export function scoreFromSimilarity(sim: number): number {
  return Math.round(Math.min(1, Math.max(0, sim)) * 100);
}

/** 分数 → 中文评语 */
export function scoreComment(score: number): string {
  if (score >= 90) return '非常接近示范音，保持！';
  if (score >= 80) return '发音清晰，个别词可再打磨';
  if (score >= 60) return '大体正确，注意连读与词尾';
  if (score >= 40) return '部分词未识别，放慢速度再试';
  return '识别度较低，建议先跟读示范音';
}

export interface RecognitionSession {
  /** 识别结果文本；失败时 reject 带中文原因 */
  readonly promise: Promise<string>;
  /** 提前结束识别（用户点停止时调用） */
  stop(): void;
  /** 放弃识别，不产生结果 */
  abort(): void;
}

/**
 * 发起一次语音识别。
 *
 * 注意：调用方必须先用 `resolveSpeakingMode()` 判定模式A 才调用本函数，
 * 尤其是离线场景（Chrome 的识别走云端，断网会静默卡死）。
 */
export function recognizeOnce(lang = 'en-US'): RecognitionSession {
  if (!isSpeechRecognitionAvailable()) {
    return {
      promise: Promise.reject(new Error('当前浏览器不支持语音识别')),
      stop: () => undefined,
      abort: () => undefined,
    };
  }

  const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  if (!Ctor) {
    return {
      promise: Promise.reject(new Error('当前浏览器不支持语音识别')),
      stop: () => undefined,
      abort: () => undefined,
    };
  }

  const recognition = new Ctor();
  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let settled = false;
  let transcript = '';

  const promise = new Promise<string>((resolve, reject) => {
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let text = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result && result[0]) text += `${result[0].transcript} `;
      }
      transcript = text.trim();
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (settled) return;
      settled = true;
      if (event.error === 'no-speech') {
        reject(new Error('没有听到声音，请再试一次'));
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        reject(new Error('麦克风权限被拒绝'));
      } else if (event.error === 'network') {
        reject(new Error('语音识别需要联网，已改为自评模式'));
      } else if (event.error === 'aborted') {
        reject(new Error('识别已取消'));
      } else {
        reject(new Error(`语音识别失败：${event.error}`));
      }
    };

    recognition.onend = () => {
      if (settled) return;
      settled = true;
      if (transcript) resolve(transcript);
      else reject(new Error('没有识别到内容，请再试一次'));
    };

    try {
      recognition.start();
    } catch {
      if (!settled) {
        settled = true;
        reject(new Error('语音识别启动失败'));
      }
    }
  });

  return {
    promise,
    stop: () => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
    },
    abort: () => {
      settled = true;
      try {
        recognition.abort();
      } catch {
        /* ignore */
      }
    },
  };
}
