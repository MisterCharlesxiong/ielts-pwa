import { MotionConfig } from 'framer-motion';
import { RouterProvider } from 'react-router-dom';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { UpdatePrompt } from '@/components/common/UpdatePrompt';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { router } from '@/router';
import { useHydrated } from '@/store/hydration';

/**
 * 应用根组件。
 *
 * 职责：
 * 1. Hydration 门闸 —— 4 个 store 全部从 IndexedDB 恢复完成（或 2.5s 超时兜底）
 *    后才渲染路由，避免首页先闪一帧空进度再跳变；
 * 2. `<MotionConfig reducedMotion="user">` —— 系统开启「减弱动态效果」时，
 *    Framer 自动把位移/缩放降级为透明度渐变（架构 §7 共享约定）；
 * 3. 顶层 ErrorBoundary 与 PWA 更新提示的挂载点。
 */
export default function App(): JSX.Element {
  const hydrated = useHydrated();

  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        {hydrated ? (
          <>
            <RouterProvider router={router} />
            <UpdatePrompt />
          </>
        ) : (
          <SplashScreen />
        )}
      </MotionConfig>
    </ErrorBoundary>
  );
}
