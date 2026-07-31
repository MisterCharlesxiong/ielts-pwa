import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { isAnswerCorrect, QuestionRenderer } from '@/features/quiz/QuestionRenderer';
import { cn } from '@/lib/cn';
import type { Question } from '@/types';

export interface ReadingQuestionsProps {
  passageId: string;
  questions: Question[];
  /** 单题提交（即时判分）时回调，用于写错题本 */
  onAnswer: (question: Question, given: string, correct: boolean) => void;
  /** 全部题目提交完成时回调一次，用于 finishReading + 打卡 */
  onAllAnswered: (correct: number, total: number) => void;
  className?: string;
}

/**
 * 阅读理解题（P0-08）：选择 / 判断，逐题即时判分，全部离线。
 * 「提交」后揭晓答案与解析，不可再改，避免刷分。
 */
export function ReadingQuestions({
  passageId,
  questions,
  onAnswer,
  onAllAnswered,
  className = '',
}: ReadingQuestionsProps): JSX.Element {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [reported, setReported] = useState(false);

  const answeredCount = Object.keys(revealed).length;
  const correctCount = useMemo(() => Object.values(results).filter(Boolean).length, [results]);
  const allDone = questions.length > 0 && answeredCount >= questions.length;

  const handleSubmit = useCallback(
    (question: Question) => {
      const given = drafts[question.id] ?? '';
      if (!given) return;
      if (revealed[question.id]) return;

      const correct = isAnswerCorrect(question, given);
      setRevealed((prev) => ({ ...prev, [question.id]: true }));
      setResults((prev) => ({ ...prev, [question.id]: correct }));
      onAnswer(question, given, correct);

      // 本次提交后是否恰好答完最后一题
      const nextAnswered = Object.keys({ ...revealed, [question.id]: true }).length;
      if (!reported && nextAnswered >= questions.length) {
        const nextCorrect = Object.values({ ...results, [question.id]: correct }).filter(Boolean).length;
        setReported(true);
        onAllAnswered(nextCorrect, questions.length);
      }
    },
    [drafts, revealed, results, reported, questions.length, onAnswer, onAllAnswered],
  );

  if (questions.length === 0) {
    return (
      <Card className={cn('text-sm text-ink-soft', className)}>本篇暂无配套理解题，读完即可返回列表。</Card>
    );
  }

  return (
    <section className={cn('flex flex-col gap-4', className)} aria-label="阅读理解题">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">理解自测</h2>
        <span className={cn('text-sm', allDone ? 'text-terra' : 'text-ink-soft')}>
          {allDone ? `答对 ${correctCount}/${questions.length}` : `${answeredCount}/${questions.length} 已作答`}
        </span>
      </div>

      {questions.map((question, index) => {
        const isRevealed = Boolean(revealed[question.id]);
        const given = drafts[question.id] ?? null;
        return (
          <Card key={`${passageId}-${question.id}`} className="flex flex-col gap-3">
            <QuestionRenderer
              question={question}
              value={given}
              onChange={(value) => setDrafts((prev) => ({ ...prev, [question.id]: value }))}
              revealed={isRevealed}
              disabled={isRevealed}
              order={index + 1}
            />
            {isRevealed ? null : (
              <Button block disabled={!given} onClick={() => handleSubmit(question)}>
                提交本题
              </Button>
            )}
          </Card>
        );
      })}
    </section>
  );
}
