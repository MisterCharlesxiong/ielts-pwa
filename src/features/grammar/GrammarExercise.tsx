import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { isAnswerCorrect, QuestionRenderer } from '@/features/quiz/QuestionRenderer';
import type { Question } from '@/types';

export interface GrammarExerciseProps {
  /** 所属语法点 id，用于进度归档 */
  pointId: string;
  questions: Question[];
  /** 提交单题后的回调：写进度 + 错题 + 打卡 */
  onSubmit: (question: Question, given: string, correct: boolean) => void;
}

/**
 * 语法练习：逐题即时判分（P0-05），答错自动进错题（P1-03，由父级写入）。
 * 同一题重复提交只在首次调用 onSubmit，避免刷打卡。
 */
export function GrammarExercise({ pointId, questions, onSubmit }: GrammarExerciseProps): JSX.Element {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  // 切换语法点时清空本地作答态
  useEffect(() => {
    setAnswers({});
    setRevealed({});
  }, [pointId]);

  const handleSubmit = (question: Question): void => {
    const given = answers[question.id] ?? '';
    if (!given) return;
    if (revealed[question.id]) return;
    setRevealed((prev) => ({ ...prev, [question.id]: true }));
    onSubmit(question, given, isAnswerCorrect(question, given));
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-ink-soft">练习 {questions.length} 题 · 提交后立即显示答案与解析</p>

      {questions.map((question, index) => {
        const given = answers[question.id] ?? null;
        const isRevealed = revealed[question.id] === true;
        return (
          <Card key={question.id} className="flex flex-col gap-3">
            <QuestionRenderer
              question={question}
              value={given}
              onChange={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
              revealed={isRevealed}
              disabled={isRevealed}
              order={index + 1}
            />
            {isRevealed ? null : (
              <Button block onClick={() => handleSubmit(question)} disabled={!given}>
                提交本题
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}
