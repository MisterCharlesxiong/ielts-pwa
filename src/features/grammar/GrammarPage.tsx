import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from '@/components/ui/Toast';
import { isLevelId, levelName } from '@/constants/levels';
import { modulePath } from '@/constants/modules';
import { GrammarExercise } from '@/features/grammar/GrammarExercise';
import { GrammarPointView } from '@/features/grammar/GrammarPointView';
import { useContent } from '@/hooks/useContent';
import { useTTS } from '@/hooks/useTTS';
import { cn } from '@/lib/cn';
import { useAppStore } from '@/store/useAppStore';
import { useProgressStore } from '@/store/useProgressStore';
import type { Question } from '@/types';

/**
 * 语法模块（P0-04 / P0-05 / P1-03）。
 * 「提交练习题」是本模块的打卡动作；仅浏览规则不计入。
 */
export function GrammarPage(): JSX.Element {
  const params = useParams<{ level: string }>();
  const navigate = useNavigate();
  const level = isLevelId(params.level) ? params.level : null;

  const { data, loading, error } = useContent(level, 'grammar');
  const points = data?.items ?? [];

  const visitedIds = useProgressStore((s) => (level ? (s.byLevel[level]?.grammar.visitedIds ?? []) : []));
  const lastPointId = useProgressStore((s) => (level ? s.byLevel[level]?.grammar.lastPointId : undefined));
  const recordAnswer = useProgressStore((s) => s.recordAnswer);
  const addWrongItem = useProgressStore((s) => s.addWrongItem);
  const clearWrongItem = useProgressStore((s) => s.clearWrongItem);
  const recordAction = useAppStore((s) => s.recordAction);

  const [activeIndex, setActiveIndex] = useState(0);
  const [restored, setRestored] = useState(false);
  const { available: ttsAvailable, speak } = useTTS(0.9);

  // 恢复到上次学习的语法点
  useEffect(() => {
    if (restored || points.length === 0) return;
    const index = lastPointId ? points.findIndex((point) => point.id === lastPointId) : -1;
    setActiveIndex(index >= 0 ? index : 0);
    setRestored(true);
  }, [restored, points, lastPointId]);

  const active = points[activeIndex] ?? null;

  const handleSubmit = useCallback(
    (question: Question, given: string, correct: boolean) => {
      if (!level || !active) return;

      recordAnswer(level, 'grammar', active.id, {
        questionId: question.id,
        given,
        correct,
        answeredAt: Date.now(),
      });

      if (correct) {
        clearWrongItem(level, question.id);
        toast('回答正确', 'success');
      } else {
        addWrongItem({
          level,
          module: 'grammar',
          sourceId: active.id,
          questionId: question.id,
          stem: question.stem,
        });
        toast('已收进错题本', 'neutral');
      }

      recordAction({
        level,
        module: 'grammar',
        route: modulePath(level, 'grammar'),
        itemId: active.id,
        itemIndex: activeIndex,
        label: `${levelName(level)} · 语法 ${active.title}`,
      });
    },
    [level, active, activeIndex, recordAnswer, addWrongItem, clearWrongItem, recordAction],
  );

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
        <div className="h-10 w-full rounded-card bg-line" />
        <div className="h-40 w-full rounded-card border border-line bg-parchment" />
        <div className="h-32 w-full rounded-card border border-line bg-parchment" />
      </PageContainer>
    );
  }

  if (error || !active) {
    return (
      <PageContainer>
        <EmptyState
          icon="法"
          title="暂时没有语法内容"
          desc={error ?? '该难度的语法包为空，请稍后再试或切换难度。'}
          action={<Button onClick={() => navigate('/levels')}>切换难度</Button>}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex flex-col gap-4">
      {/* 语法点横向切换：窄屏可滑动，隐藏滚动条 */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {points.map((point, index) => {
          const visited = visitedIds.includes(point.id);
          return (
            <button
              key={point.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'flex min-h-tap shrink-0 items-center gap-1 rounded-full border px-3 text-sm transition-colors duration-150',
                index === activeIndex ? 'border-moss bg-moss-light text-moss-dark' : 'border-line text-ink-soft',
              )}
            >
              <span>{index + 1}</span>
              {visited ? <span className="text-xs text-terra">已练</span> : null}
            </button>
          );
        })}
      </div>

      <Card className="flex items-center justify-between py-3">
        <p className="text-xs text-ink-soft">
          {levelName(level)} · 已练 {visitedIds.length}/{points.length} 个语法点
        </p>
        <span className="text-xs text-ink-soft">
          {activeIndex + 1}/{points.length}
        </span>
      </Card>

      <GrammarPointView point={active} onSpeak={ttsAvailable ? (text) => speak(text) : null} />

      <GrammarExercise pointId={active.id} questions={active.exercises} onSubmit={handleSubmit} />

      <div className="flex items-center gap-3 pb-2">
        <Button
          variant="ghost"
          block
          onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
          disabled={activeIndex === 0}
        >
          上一个
        </Button>
        <Button
          variant="ghost"
          block
          onClick={() => setActiveIndex((prev) => Math.min(points.length - 1, prev + 1))}
          disabled={activeIndex >= points.length - 1}
        >
          下一个
        </Button>
      </div>
    </PageContainer>
  );
}
