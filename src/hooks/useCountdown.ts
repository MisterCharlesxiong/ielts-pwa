import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseCountdownOptions {
  /** 挂载后自动开始 */
  autoStart?: boolean;
  /** 归零回调（自动交卷） */
  onExpire?: () => void;
}

export interface UseCountdownResult {
  /** 剩余秒数 */
  remaining: number;
  running: boolean;
  expired: boolean;
  /** 已用秒数 */
  usedSec: number;
  start(): void;
  pause(): void;
  reset(seconds?: number): void;
}

/**
 * 测试计时（P0-15）。
 *
 * 用**绝对截止时间戳**而非累加 setInterval，避免手机锁屏 / 后台节流导致计时漂移。
 */
export function useCountdown(totalSeconds: number, options: UseCountdownOptions = {}): UseCountdownResult {
  const { autoStart = false, onExpire } = options;

  const [total, setTotal] = useState(totalSeconds);
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(autoStart);
  const [expired, setExpired] = useState(false);

  const deadlineRef = useRef<number>(Date.now() + totalSeconds * 1000);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // totalSeconds 变化（切换套卷）时重置
  useEffect(() => {
    setTotal(totalSeconds);
    setRemaining(totalSeconds);
    setExpired(false);
    deadlineRef.current = Date.now() + totalSeconds * 1000;
  }, [totalSeconds]);

  useEffect(() => {
    if (!running || expired) return undefined;
    const tick = (): void => {
      const left = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        setRunning(false);
        setExpired(true);
        onExpireRef.current?.();
      }
    };
    tick();
    const timer = window.setInterval(tick, 250);
    return () => window.clearInterval(timer);
  }, [running, expired]);

  const start = useCallback(() => {
    setRunning((prev) => {
      if (prev) return prev;
      deadlineRef.current = Date.now() + remaining * 1000;
      return true;
    });
  }, [remaining]);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(
    (seconds?: number) => {
      const next = seconds ?? total;
      setTotal(next);
      setRemaining(next);
      setExpired(false);
      setRunning(false);
      deadlineRef.current = Date.now() + next * 1000;
    },
    [total],
  );

  return { remaining, running, expired, usedSec: Math.max(0, total - remaining), start, pause, reset };
}
