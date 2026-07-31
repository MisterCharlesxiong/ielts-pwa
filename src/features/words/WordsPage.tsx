import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { toast } from '@/components/ui/Toast';
import { isLevelId, levelName } from '@/constants/levels';
import { modulePath } from '@/constants/modules';
import { WordCard } from '@/features/words/WordCard';
import { WordStateSwitch } from '@/features/words/WordStateSwitch';
import { useWordQueue } from '@/features/words/useWordQueue';
import { useContent } from '@/hooks/useContent';
import { useTTS } from '@/hooks/useTTS';
import { useAppStore } from '@/store/useAppStore';
import { useProgressStore } from '@/store/useProgressStore';
import type { WordState } from '@/types';

/**
 * 单词模块（P0-01 / P0-02 / P0-03 / P1-01 / P1-02）。
 *
 * 打卡口径：只有「标记记忆状态」才调用 `recordAction()`；
 * 翻牌、听发音、左右切卡都不计入打卡。
 */
export function WordsPage(): JSX.Element {
  const params = useParams<{ level: string }>();
  const navigate = useNavigate();
  const level = isLevelId(params.level) ? params.level : null;

  const { data, loading, error } = useContent(level, 'words');
  const words = data?.items ?? [];

  const wordStates = useProgressStore((s) => (level ? (s.byLevel[level]?.words.states ?? {}) : {}));
  const lastIndex = useProgressStore((s) => (level ? (s.byLevel[level]?.words.lastIndex ?? 0) : 0));
  const setWordState = useProgressStore((s) => s.setWordState);
  const setWordIndex = useProgressStore((s) => s.setWordIndex);
  const recordAction = useAppStore((s) => s.recordAction);

  const { queue, index, current, total, masteredCount, ratio, goNext, goPrev, goTo, reshuffle } = useWordQueue(
    words,
    wordStates,
    lastIndex,
  );

  const [flipped, setFlipped] = useState(false);
  const { available: ttsAvailable, speaking, speak } = useTTS(0.9);

  // 内容就绪后把断点恢复到上次位置（只做一次）
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    if (restored || queue.length === 0) return;
    goTo(Math.min(lastIndex, queue.length - 1));
    setRestored(true);
  }, [restored, queue.length, lastIndex, goTo]);

  // 换卡时收起背面
  useEffect(() => {
    setFlipped(false);
  }, [index]);

  const handleMark = useCallback(
    (state: WordState) => {
      if (!level || !current) return;
      setWordState(level, current.id, state);
      setWordIndex(level, index);
      recordAction({
        level,
        module: 'words',
        route: modulePath(level, 'words'),
        itemId: current.id,
        itemIndex: index,
        label: `${levelName(level)} · 单词 ${current.term}`,
      });
      if (state === 'mastered') toast('已掌握，继续保持', 'success');
      // 标记后自动进入下一张，减少一次点击
      if (index < total - 1) goNext();
    },
    [level, current, index, total, setWordState, setWordIndex, recordAction, goNext],
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
      <PageContainer className="flex flex-col gap-4">
        <div className="h-4 w-32 rounded-full bg-line" />
        <div className="h-[260px] w-full rounded-card border border-line bg-parchment" />
        <div className="h-11 w-full rounded-card bg-line" />
      </PageContainer>
    );
  }

  if (error || !current) {
    return (
      <PageContainer>
        <EmptyState
          icon="词"
          title="暂时没有单词内容"
          desc={error ?? '该难度的单词包为空，请稍后再试或切换难度。'}
          action={<Button onClick={() => navigate('/levels')}>切换难度</Button>}
        />
      </PageContainer>
    );
  }

  const currentState: WordState = wordStates[current.id] ?? 'new';

  return (
    <PageContainer className="flex flex-col gap-4">
      <Card className="flex items-center gap-3 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-ink-soft">
            {levelName(level)} · 已掌握 {masteredCount}/{words.length}
          </p>
          <ProgressBar value={ratio} height={5} className="mt-1.5" label="单词掌握度" celebrateOnFull />
        </div>
        <span className="shrink-0 text-sm tabular-nums text-ink-soft">
          {index + 1}/{total}
        </span>
      </Card>

      <WordCard
        word={current}
        flipped={flipped}
        onFlip={() => setFlipped((prev) => !prev)}
        onSpeak={ttsAvailable ? () => speak(current.term) : null}
        speaking={speaking}
      />

      <WordStateSwitch value={currentState} onChange={handleMark} />

      <div className="flex items-center gap-3">
        <Button variant="ghost" block onClick={goPrev} disabled={index === 0}>
          上一张
        </Button>
        <Button variant="ghost" block onClick={goNext} disabled={index >= total - 1}>
          下一张
        </Button>
      </div>

      <div className="flex items-center justify-between pb-2">
        <button type="button" onClick={reshuffle} className="min-h-tap text-sm text-ink-soft underline">
          按记忆状态重排队列
        </button>
        {ttsAvailable ? null : <span className="text-xs text-ink-soft">当前设备不支持语音合成</span>}
      </div>
    </PageContainer>
  );
}
