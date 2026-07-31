import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import type { SegmentedOption } from '@/components/ui/SegmentedControl';
import { toast } from '@/components/ui/Toast';
import { LEVEL_IDS, levelName } from '@/constants/levels';
import { moduleName, modulePath } from '@/constants/modules';
import { isAnswerCorrect, QuestionRenderer } from '@/features/quiz/QuestionRenderer';
import { useContent } from '@/hooks/useContent';
import { cn } from '@/lib/cn';
import { formatRelative } from '@/lib/date';
import { useAppStore } from '@/store/useAppStore';
import { useProgressStore } from '@/store/useProgressStore';
import type { ContentItemOf, ModuleId, Question, WrongItem } from '@/types';

type WrongFilter = 'pending' | 'all';

const FILTER_OPTIONS: SegmentedOption<WrongFilter>[] = [
  { value: 'pending', label: '待攻克' },
  { value: 'all', label: '全部' },
];

/**
 * 在内容包里按 sourceId + questionId 定位原题。
 * 三个来源结构不同：语法点有 `exercises`，阅读篇目有 `questions`，测试卷有 `sections`。
 */
function findQuestion(
  items: ContentItemOf<ModuleId>[],
  sourceId: string,
  questionId: string,
): Question | null {
  for (const item of items) {
    if (item.id !== sourceId) continue;
    if ('exercises' in item) {
      return item.exercises.find((question) => question.id === questionId) ?? null;
    }
    if ('questions' in item) {
      return item.questions.find((question) => question.id === questionId) ?? null;
    }
    if ('sections' in item) {
      for (const section of item.sections) {
        const found = section.questions.find((question) => question.id === questionId);
        if (found) return found;
      }
    }
  }
  return null;
}

interface WrongItemPracticeProps {
  item: WrongItem;
  /** 提交一次作答后回调（无论对错） */
  onSubmitted: (correct: boolean) => void;
}

/**
 * 错题重练（P1-03）。
 * 内容按需加载：只有打开弹窗时才实例化本组件，避免列表页一次性拉六个内容包。
 */
function WrongItemPractice({ item, onSubmitted }: WrongItemPracticeProps): JSX.Element {
  const { data, loading, error } = useContent(item.level, item.module);
  const question = useMemo(
    () => (data ? findQuestion(data.items, item.sourceId, item.questionId) : null),
    [data, item.sourceId, item.questionId],
  );

  const [value, setValue] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  if (loading) {
    return <div className="h-32 w-full rounded-card border border-line bg-parchment" />;
  }

  if (error || !question) {
    return (
      <EmptyState
        icon="题"
        title="原题已不可用"
        desc={error ?? '这道题所属的内容包已更新，你可以直接把它移出错题本。'}
      />
    );
  }

  const handleSubmit = (): void => {
    if (revealed || value === null || value === '') return;
    setRevealed(true);
    onSubmitted(isAnswerCorrect(question, value));
  };

  return (
    <div className="flex flex-col gap-3">
      <QuestionRenderer
        question={question}
        value={value}
        onChange={setValue}
        revealed={revealed}
        disabled={revealed}
      />
      {revealed ? null : (
        <Button block disabled={value === null || value === ''} onClick={handleSubmit}>
          提交答案
        </Button>
      )}
    </div>
  );
}

/**
 * 错题本（P0-16 / P1-03）。
 * 汇总六个难度的错题，答对一次即标记为已攻克（保留记录，可切「全部」回看）。
 */
export function WrongBookPage(): JSX.Element {
  const navigate = useNavigate();
  const byLevel = useProgressStore((s) => s.byLevel);
  const clearWrongItem = useProgressStore((s) => s.clearWrongItem);
  const removeWrongItem = useProgressStore((s) => s.removeWrongItem);
  const recordAction = useAppStore((s) => s.recordAction);

  const [filter, setFilter] = useState<WrongFilter>('pending');
  const [activeItem, setActiveItem] = useState<WrongItem | null>(null);

  const allItems = useMemo(() => {
    const list: WrongItem[] = [];
    LEVEL_IDS.forEach((levelId) => {
      const bucket = byLevel[levelId]?.quiz.wrongBook ?? [];
      bucket.forEach((entry) => list.push(entry));
    });
    return list.sort((a, b) => b.lastWrongAt - a.lastWrongAt);
  }, [byLevel]);

  const pendingCount = allItems.filter((entry) => !entry.cleared).length;
  const visible = filter === 'pending' ? allItems.filter((entry) => !entry.cleared) : allItems;

  const handleSubmitted = useCallback(
    (item: WrongItem, correct: boolean) => {
      if (correct) {
        clearWrongItem(item.level, item.questionId);
        toast('答对了，已移出待攻克', 'success');
      } else {
        toast('再看看解析，稍后重练', 'neutral');
      }
      // 错题重练属于所属模块的学习动作，计入当日打卡
      recordAction({
        level: item.level,
        module: item.module,
        route: '/wrongbook',
        itemId: item.questionId,
        label: `${levelName(item.level)} · ${moduleName(item.module)}错题重练`,
      });
    },
    [clearWrongItem, recordAction],
  );

  if (allItems.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          icon="错"
          title="错题本是空的"
          desc="做语法练习、阅读理解或随堂测试时答错的题会自动收进来。"
          action={<Button onClick={() => navigate('/')}>回首页学习</Button>}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex flex-col gap-3">
      <Card className="flex items-center justify-between py-3">
        <p className="text-xs text-ink-soft">
          共 {allItems.length} 题 · 待攻克 {pendingCount} 题
        </p>
        <SegmentedControl options={FILTER_OPTIONS} value={filter} onChange={setFilter} label="错题范围" dense />
      </Card>

      {visible.length === 0 ? (
        <Card>
          <EmptyState icon="✓" title="全部攻克完了" desc="切到「全部」可以回看做对过的错题。" />
        </Card>
      ) : (
        visible.map((item) => (
          <Card key={`${item.level}-${item.questionId}`} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-moss-light px-2 py-0.5 text-xs text-moss-dark">
                  {levelName(item.level)}
                </span>
                <span className="rounded-full bg-parchment px-2 py-0.5 text-xs text-ink-soft">
                  {moduleName(item.module)}
                </span>
              </div>
              <span className={cn('text-xs', item.cleared ? 'text-terra' : 'text-ink-soft')}>
                {item.cleared ? '已攻克' : `错 ${item.wrongCount} 次`}
              </span>
            </div>

            <p className="line-clamp-3 text-sm leading-relaxed text-ink">{item.stem}</p>
            <p className="text-xs text-ink-soft">最近错于 {formatRelative(item.lastWrongAt)}</p>

            <div className="flex items-center gap-3">
              <Button block onClick={() => setActiveItem(item)}>
                {item.cleared ? '再练一次' : '重练本题'}
              </Button>
              <Button
                variant="ghost"
                block
                onClick={() => {
                  removeWrongItem(item.level, item.questionId);
                  toast('已移出错题本', 'neutral');
                }}
              >
                移除
              </Button>
            </div>

            <button
              type="button"
              className="min-h-tap text-left text-xs text-moss-dark"
              onClick={() => navigate(modulePath(item.level, item.module))}
            >
              前往{moduleName(item.module)}模块 →
            </button>
          </Card>
        ))
      )}

      <Modal open={activeItem !== null} onClose={() => setActiveItem(null)} title="错题重练">
        {activeItem ? (
          <WrongItemPractice
            key={`${activeItem.level}-${activeItem.questionId}`}
            item={activeItem}
            onSubmitted={(correct) => handleSubmitted(activeItem, correct)}
          />
        ) : null}
      </Modal>
    </PageContainer>
  );
}
