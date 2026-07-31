import { useEffect, useState } from 'react';

import { useAppStore } from '@/store/useAppStore';
import { useMusicStore } from '@/store/useMusicStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useReadingPrefStore } from '@/store/useReadingPrefStore';

/** IndexedDB 异常挂起时的兜底放行时间：超过则直接渲染，用默认值 */
const HYDRATION_TIMEOUT_MS = 2500;

/**
 * 聚合 4 个 store 的 rehydrate 完成信号。
 * 全部就绪（或超时兜底）前，App 渲染 SplashScreen，避免首页闪现空数据。
 */
export function useHydrated(): boolean {
  const appReady = useAppStore((s) => s.hasHydrated);
  const progressReady = useProgressStore((s) => s.hasHydrated);
  const musicReady = useMusicStore((s) => s.hasHydrated);
  const readingReady = useReadingPrefStore((s) => s.hasHydrated);
  const [timedOut, setTimedOut] = useState(false);

  const allReady = appReady && progressReady && musicReady && readingReady;

  useEffect(() => {
    if (allReady) return undefined;
    const timer = window.setTimeout(() => {
      console.warn('[store] 持久化恢复超时，已使用默认值继续渲染');
      setTimedOut(true);
    }, HYDRATION_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [allReady]);

  return allReady || timedOut;
}
