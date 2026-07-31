import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { isLevelId, levelName } from '@/constants/levels';
import { modulePath, moduleName } from '@/constants/modules';
import { cardEnter } from '@/constants/motion';
import { useContent } from '@/hooks/useContent';
import { cn } from '@/lib/cn';
import { formatClock, formatRelative } from '@/lib/date';
import { useProgressStore } from '@/store/useProgressStore';
import type { Quiz } from '@/types';

/** 套卷总题数 */
function countQuestions(quiz: Quiz): number {
  return quiz.sections.reduce((sum, section) => sum + section.questions.length, 0);
}

/**
 * 随堂测试列表（P0-14）。
 * 展示题量 / 时长 / 历史最佳，点击进入计时作答（无壳全屏）。
 */
export function QuizListPage(): JSX.Element {
  const params = useParams<{ level: string }>();
  const navigate = useNavigate();
  const level = isLevelId(params.level) ? params.level : null;

  const { data, loading, error } = useContent(level, 'quiz');
  const quizzes = data?.items ?? [];

  const attempts = useProgressStore((s) => (level ? (s.byLevel[level]?.quiz.attempts ?? {}) : {}));
  const wrongBook = useProgressStore((s) => (level ? (s.byLevel[level]?.quiz.wrongBook ?? []) : []));

  if (!level) {
    return (
      <PageContainer>
        <EmptyState
          icon="级"
          title="难度参数无效"
          desc="请先选择一个学习难度。"
          action={<Button onClick={() => navigate('/levels')}>去选择难度</Button>}
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer className="flex flex-col gap-3">
        <div className="h-28 w-full rounded-card border border-line bg-parchment" />
        <div className="h-28 w-full rounded-card border border-line bg-parchment" />
      </PageContainer>
    );
  }

  if (error || quizzes.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          icon="测"
          title="暂时没有测试卷"
          desc={error ?? '该难度的测试包为空，请稍后再试或切换难度。'}
          action={<Button onClick={() => navigate('/levels')}>切换难度</Button>}
        />
      </PageContainer>
    );
  }

  const pendingWrong = wrongBook.filter((item) => !item.cleared).length;

  return (
    <PageContainer className="flex flex-col gap-3">
      <Card className="flex items-center justify-between py-3">
        <p className="text-xs text-ink-soft">
          {levelName(level)} · 共 {quizzes.length} 套
        </p>
        <button
          type="button"
          onClick={() => navigate('/wrongbook')}
          className="min-h-tap text-xs text-moss-dark"
        >
          错题本{pendingWrong > 0 ? `（${pendingWrong}）` : ''}
        </button>
      </Card>

      {quizzes.map((quiz, index) => {
        const history = attempts[quiz.id] ?? [];
        const best = history.reduce(
          (max, item) => (item.totalScore > max ? item.totalScore : max),
          history.length > 0 ? -1 : -1,
        );
        const last = history[history.length - 1];
        const fullScore = last?.fullScore ?? 0;

        return (
          <motion.div key={quiz.id} {...cardEnter(index)}>
            <Card highlighted={history.length > 0} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-medium text-ink">{quiz.title}</h2>
                  <p className="mt-1 text-xs text-ink-soft">
                    {countQuestions(quiz)} 题 · 限时 {formatClock(quiz.durationSec)} ·{' '}
                    {quiz.sections.map((section) => moduleName(section.moduleRef)).join(' / ')}
                  </p>
                </div>
                {history.length > 0 ? (
                  <span className="shrink-0 rounded-full bg-moss-light px-2 py-1 text-xs text-terra">
                    最佳 {best >= 0 ? best : 0}
                    {fullScore > 0 ? `/${fullScore}` : ''}
                  </span>
                ) : null}
              </div>

              {last ? (
                <p className={cn('text-xs text-ink-soft')}>
                  上次 {formatRelative(last.submittedAt)} · 用时 {formatClock(last.usedSec)} · 得分{' '}
                  {last.totalScore}/{last.fullScore}
                </p>
              ) : null}

              <div className="flex items-center gap-3">
                <Button block onClick={() => navigate(`${modulePath(level, 'quiz')}/${quiz.id}`)}>
                  {history.length > 0 ? '再考一次' : '开始测试'}
                </Button>
                {history.length > 0 ? (
                  <Button
                    variant="ghost"
                    block
                    onClick={() => navigate(`${modulePath(level, 'quiz')}/${quiz.id}/result`)}
                  >
                    查看成绩
                  </Button>
                ) : null}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </PageContainer>
  );
}
