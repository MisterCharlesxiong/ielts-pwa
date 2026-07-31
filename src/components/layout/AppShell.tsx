import { Outlet, useMatches } from 'react-router-dom';

import { BottomNav } from '@/components/layout/BottomNav';
import { TopBar } from '@/components/layout/TopBar';
import { MusicOnboardingModal } from '@/components/music/MusicOnboardingModal';
import { ToastHost } from '@/components/ui/Toast';

/**
 * 路由 `handle` 约定。
 * 在 router.tsx 里逐条声明，AppShell 通过 useMatches 读取最深层匹配。
 */
export interface RouteHandle {
  /** 是否渲染顶栏 / 底栏。ReadingFocusPage 与 QuizRunnerPage 必须为 false */
  chrome: boolean;
  /** 顶栏标题 */
  title?: string;
  /** 是否显示返回箭头 */
  back?: boolean;
  /** 底部导航高亮项 */
  nav?: 'home' | 'progress' | 'wrongbook';
}

const DEFAULT_HANDLE: RouteHandle = { chrome: true, title: '雅思学习', back: false };

function resolveHandle(matches: ReturnType<typeof useMatches>): RouteHandle {
  for (let i = matches.length - 1; i >= 0; i -= 1) {
    const handle = matches[i]?.handle as Partial<RouteHandle> | undefined;
    if (handle && typeof handle.chrome === 'boolean') {
      return { ...DEFAULT_HANDLE, ...handle };
    }
  }
  return DEFAULT_HANDLE;
}

/**
 * 应用外壳：430px 居中容器 + 按 `handle.chrome` 决定是否渲染导航。
 *
 * 无壳页面（专注阅读 / 考试作答）直接铺满，满足 P0-07 沉浸要求。
 */
export function AppShell(): JSX.Element {
  const matches = useMatches();
  const handle = resolveHandle(matches);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-app flex-col bg-paper">
      <ToastHost />
      {handle.chrome ? <TopBar title={handle.title ?? ''} showBack={handle.back === true} /> : null}

      <main
        className="flex-1"
        style={{
          paddingBottom: handle.chrome ? 'calc(64px + env(safe-area-inset-bottom))' : 'env(safe-area-inset-bottom)',
        }}
      >
        <Outlet />
      </main>

      {handle.chrome ? <BottomNav active={handle.nav} /> : null}
      <MusicOnboardingModal />
    </div>
  );
}
