import { createHashRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { AppShell } from '@/components/layout/AppShell';
import type { RouteHandle } from '@/components/layout/AppShell';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { GrammarPage } from '@/features/grammar/GrammarPage';
import { HomePage } from '@/features/home/HomePage';
import { LevelSelectPage } from '@/features/level/LevelSelectPage';
import { ProgressPage } from '@/features/progress/ProgressPage';
import { QuizListPage } from '@/features/quiz/QuizListPage';
import { QuizResultPage } from '@/features/quiz/QuizResultPage';
import { QuizRunnerPage } from '@/features/quiz/QuizRunnerPage';
import { WrongBookPage } from '@/features/quiz/WrongBookPage';
import { ReadingFocusPage } from '@/features/reading/ReadingFocusPage';
import { ReadingListPage } from '@/features/reading/ReadingListPage';
import { SpeakingPage } from '@/features/speaking/SpeakingPage';
import { WordsPage } from '@/features/words/WordsPage';
import { WritingPage } from '@/features/writing/WritingPage';

/** 404 兜底 */
function NotFoundPage(): JSX.Element {
  return (
    <PageContainer>
      <EmptyState
        icon="?"
        title="页面走丢了"
        desc="这个地址不存在，可能来自旧版本的书签。"
        action={
          <Button onClick={() => { window.location.hash = '#/'; }}>回到首页</Button>
        }
      />
    </PageContainer>
  );
}

/**
 * 路由表（HashRouter —— GitHub Pages 子路径刷新不 404）。
 *
 * `handle.chrome === false` 的两条路由（专注阅读 / 考试作答）不渲染 TopBar 与 BottomNav，
 * 满足 P0-07 沉浸要求。
 */
const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <HomePage />,
        handle: { chrome: true, title: '雅思学习', nav: 'home' } satisfies RouteHandle,
      },
      {
        path: 'levels',
        element: <LevelSelectPage />,
        handle: { chrome: true, title: '选择难度', back: true, nav: 'home' } satisfies RouteHandle,
      },
      {
        path: 'learn/:level/words',
        element: <WordsPage />,
        handle: { chrome: true, title: '单词', back: true, nav: 'home' } satisfies RouteHandle,
      },
      {
        path: 'learn/:level/grammar',
        element: <GrammarPage />,
        handle: { chrome: true, title: '语法', back: true, nav: 'home' } satisfies RouteHandle,
      },
      {
        path: 'learn/:level/reading',
        element: <ReadingListPage />,
        handle: { chrome: true, title: '阅读', back: true, nav: 'home' } satisfies RouteHandle,
      },
      {
        // 专注阅读：无壳
        path: 'learn/:level/reading/:passageId',
        element: <ReadingFocusPage />,
        handle: { chrome: false } satisfies RouteHandle,
      },
      {
        path: 'learn/:level/writing',
        element: <WritingPage />,
        handle: { chrome: true, title: '写作', back: true, nav: 'home' } satisfies RouteHandle,
      },
      {
        path: 'learn/:level/speaking',
        element: <SpeakingPage />,
        handle: { chrome: true, title: '跟读口语', back: true, nav: 'home' } satisfies RouteHandle,
      },
      {
        path: 'learn/:level/quiz',
        element: <QuizListPage />,
        handle: { chrome: true, title: '随堂测试', back: true, nav: 'home' } satisfies RouteHandle,
      },
      {
        // 计时作答：无壳
        path: 'learn/:level/quiz/:quizId',
        element: <QuizRunnerPage />,
        handle: { chrome: false } satisfies RouteHandle,
      },
      {
        path: 'learn/:level/quiz/:quizId/result',
        element: <QuizResultPage />,
        handle: { chrome: true, title: '测试结果', back: true, nav: 'home' } satisfies RouteHandle,
      },
      {
        path: 'wrongbook',
        element: <WrongBookPage />,
        handle: { chrome: true, title: '错题本', nav: 'wrongbook' } satisfies RouteHandle,
      },
      {
        path: 'progress',
        element: <ProgressPage />,
        handle: { chrome: true, title: '学习进度', nav: 'progress' } satisfies RouteHandle,
      },
      {
        path: '*',
        element: <NotFoundPage />,
        handle: { chrome: true, title: '未找到', back: true } satisfies RouteHandle,
      },
    ],
  },
];

export const router = createHashRouter(routes);
