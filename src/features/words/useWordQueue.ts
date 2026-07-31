import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { Word, WordState } from '@/types';

export interface UseWordQueueResult {
  queue: Word[];
  index: number;
  current: Word | null;
  total: number;
  masteredCount: number;
  /** 已掌握 / 总数 0-1 */
  ratio: number;
  goNext(): void;
  goPrev(): void;
  goTo(index: number): void;
  /** 按最新三态重排队列（复习轮换），回到第一张 */
  reshuffle(): void;
}

const ORDER_WEIGHT: Record<WordState, number> = {
  learning: 0, // 学习中优先复现
  new: 1,
  mastered: 2, // 已掌握沉到队尾
};

function stateOf(states: Record<string, WordState>, id: string): WordState {
  return states[id] ?? 'new';
}

/**
 * 复习轮换队列（P1-02）。
 *
 * 排序：学习中 → 生词 → 已掌握，同权重内保持内容包原始顺序（保证可预期）。
 *
 * 关键设计：排序只在 `words` 变化或显式 `reshuffle()` 时重算。
 * 若跟随 `states` 实时重排，用户刚点「已掌握」当前卡就会瞬间跳走，体验很差。
 */
export function useWordQueue(
  words: Word[],
  states: Record<string, WordState>,
  initialIndex = 0,
): UseWordQueueResult {
  const statesRef = useRef(states);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    statesRef.current = states;
  }, [states]);

  const queue = useMemo(() => {
    const snapshot = statesRef.current;
    return words
      .map((word, originalIndex) => ({ word, originalIndex }))
      .sort((a, b) => {
        const wa = ORDER_WEIGHT[stateOf(snapshot, a.word.id)];
        const wb = ORDER_WEIGHT[stateOf(snapshot, b.word.id)];
        if (wa !== wb) return wa - wb;
        return a.originalIndex - b.originalIndex;
      })
      .map((entry) => entry.word);
    // generation 参与依赖以支持手动重排
  }, [words, generation]);

  const [index, setIndex] = useState(() => Math.min(Math.max(0, initialIndex), Math.max(0, words.length - 1)));

  // 内容包换级时把游标夹回合法范围
  useEffect(() => {
    setIndex((prev) => Math.min(Math.max(0, prev), Math.max(0, queue.length - 1)));
  }, [queue.length]);

  const goTo = useCallback(
    (next: number) => {
      setIndex(() => {
        if (queue.length === 0) return 0;
        const clamped = Math.min(Math.max(0, next), queue.length - 1);
        return clamped;
      });
    },
    [queue.length],
  );

  const goNext = useCallback(() => {
    setIndex((prev) => (queue.length === 0 ? 0 : Math.min(prev + 1, queue.length - 1)));
  }, [queue.length]);

  const goPrev = useCallback(() => {
    setIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const reshuffle = useCallback(() => {
    setGeneration((prev) => prev + 1);
    setIndex(0);
  }, []);

  const masteredCount = useMemo(
    () => words.filter((word) => stateOf(states, word.id) === 'mastered').length,
    [words, states],
  );

  return {
    queue,
    index,
    current: queue[index] ?? null,
    total: queue.length,
    masteredCount,
    ratio: words.length > 0 ? masteredCount / words.length : 0,
    goNext,
    goPrev,
    goTo,
    reshuffle,
  };
}
