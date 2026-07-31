import { useCallback, useEffect, useRef, useState } from 'react';

import { isTTSAvailable } from '@/lib/capability';
import { cancel as cancelSpeech, speak as speakText } from '@/lib/tts';

export interface UseTTSResult {
  /** 当前浏览器是否支持语音合成（不支持时应隐藏播放按钮） */
  available: boolean;
  speaking: boolean;
  /** 语速 0.5 - 1.5 */
  rate: number;
  setRate(rate: number): void;
  /** 是否循环播放 */
  looping: boolean;
  setLooping(value: boolean): void;
  error: string | null;
  speak(text: string): void;
  stop(): void;
}

/**
 * SpeechSynthesis 播放编排：播放状态、语速、循环。
 * 组件卸载时自动停止，避免离开页面还在念。
 */
export function useTTS(defaultRate = 0.9): UseTTSResult {
  const [available] = useState<boolean>(() => isTTSAvailable());
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(defaultRate);
  const [looping, setLooping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loopingRef = useRef(looping);
  const lastTextRef = useRef('');
  const rateRef = useRef(rate);
  const mountedRef = useRef(true);

  useEffect(() => {
    loopingRef.current = looping;
  }, [looping]);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelSpeech();
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!available) {
        setError('当前浏览器不支持语音合成');
        return;
      }
      lastTextRef.current = text;
      setError(null);
      const started = speakText(text, {
        rate: rateRef.current,
        onStart: () => {
          if (mountedRef.current) setSpeaking(true);
        },
        onEnd: () => {
          if (!mountedRef.current) return;
          if (loopingRef.current && lastTextRef.current) {
            // 循环：稍作停顿再念下一遍，避免连读听不清
            window.setTimeout(() => {
              if (mountedRef.current && loopingRef.current) speak(lastTextRef.current);
            }, 600);
            return;
          }
          setSpeaking(false);
        },
        onError: (message) => {
          if (!mountedRef.current) return;
          setSpeaking(false);
          setError(message);
        },
      });
      if (!started) setSpeaking(false);
    },
    [available],
  );

  const stop = useCallback(() => {
    loopingRef.current = false;
    setLooping(false);
    cancelSpeech();
    setSpeaking(false);
  }, []);

  return { available, speaking, rate, setRate, looping, setLooping, error, speak, stop };
}
