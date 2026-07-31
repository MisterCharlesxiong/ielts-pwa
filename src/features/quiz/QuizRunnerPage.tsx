import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { isLevelId, levelName } from '@/constants/levels';
import { modulePath } from '@/constants/modules';
import { isAnswerCorrect, QuestionRenderer, questionPoints } from '@/features/quiz/QuestionRenderer';
import { QuizTimer } from '@/features/quiz/QuizTimer';
import { useContent } from '@/hooks/useContent';
import { useCountdown } from '@/hooks/useCountdown';
import { cn } from '@/lib/cn';
import { setBusy } from '@/lib/pwaUpdate';
import { useAppStore } from '@/store/useAppStore';
import { useProgressStore } from '@/store/useProgressStore';
import type { AnswerRecord, LevelId, ModuleId, Question, Quiz, QuizAttempt } from '@/types';

interface FlatQuestion {
  question: Question;
  sectionId: string;
  sectionTitle: string;
  moduleRef: ModuleId;
  /** 全卷序号，从 1 开始 */
  order: number;
}

function flatten(quiz: Quiz): FlatQuestion[] {
  const list: FlatQuestion[] = [];
  quiz.sections.forEach((section) => {
    section.questions.forEach((question) => {
      list.push({
        question,
        sectionId: section.id,
        sectionTitle: section.title,
        moduleRef: section.moduleRef,
        order: list.length + 1,
      });
    });
  });
  return list;
}

interface QuizRunnerProps {
  level: LevelId;
  quiz: Quiz;
}

/**
 * 计时作答内核。
 *
 * 单独抽成子组件的原因：`useCountdown` 必须在**拿到真实 durationSec 之后**才挂载，
 * 否则初始 total=0 会在首个 tick 里立刻触发 onExpire 误判自动交卷。
 */
function QuizRunner({ level, quiz }: QuizRunnerProps): JSX.Element {
  const navigate = useNavigate();
  const flat = useMemo(() => flatten(quiz), [quiz]);

  const submitQuiz = useProgressStore((s) => s.submitQuiz);
  const addWrongItem = useProgressStore((s) => s.addWrongItem);
  const clearWrongItem = useProgressStore((s) => s.clearWrongItem);
  const recordAction = useAppStore((s) => s.recordAction);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);

  const startedAtRef = useRef<number>(Date.now());
  const submittedRef = useRef(false);
  const answersRef = useRef(answers);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // 【致命坑 #5】作答期间挂起「有新版本」提示
  useEffect(() => {
    setBusy(true);
    return () => setBusy(false);
  }, []);

  const finish = useCallback(
    (auto: boolean, usedSec: number) => {
      if (submittedRef.current) return;
      submittedRef.current = true;

      const now = Date.now();
      const given = answersRef.current;
      const records: AnswerRecord[] = [];
      const bySection: QuizAttempt['bySection'] = {};
      let totalScore = 0;
      let fullScore = 0;

      quiz.sections.forEach((section) => {
        let score = 0;
        let full = 0;
        section.questions.forEach((question) => {
          const points = questionPoints(question);
          const value = given[question.id] ?? '';
          const correct = isAnswerCorrect(question, value === '' ? null : value);
          full += points;
          if (correct) {
            score += points;
            clearWrongItem(level, question.id);
          } else {
            addWrongItem({
              level,
              module: 'quiz',
              sourceId: quiz.id,
              questionId: question.id,
              stem: question.stem,
            });
          }
          records.push({ questionId: question.id, given: value, correct, answeredAt: now });
        });
        bySection[section.id] = { score, full, title: section.title, moduleRef: section.moduleRef };
        totalScore += score;
        fullScore += full;
      });

      const attempt: QuizAttempt = {
        quizId: quiz.id,
        startedAt: startedAtRef.current,
        submittedAt: now,
        usedSec,
        totalScore,
        fullScore,
        bySection,
        answers: records,
      };

      submitQuiz(level, attempt);
      recordAction({
        level,
        module: 'quiz',
        route: `${modulePath(level, 'quiz')}/${quiz.id}/result`,
        itemId: quiz.id,
        label: `${levelName(level)} · 测试《${quiz.title}》`,
      });

      toast(auto ? '时间到，已自动交卷' : `交卷成功，得分 ${totalScore}/${fullScore}`, 'success');
      navigate(`${modulePath(level, 'quiz')}/${quiz.id}/result`, { replace: true });
    },
    [quiz, level, submitQuiz, addWrongItem, clearWrongItem, recordAction, navigate],
  );

  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);

  const countdown = useCountdown(quiz.durationSec, {
    autoStart: true,
    onExpire: () => finishRef.current(true, quiz.durationSec),
  });

  const current = flat[index];
  const answeredCount = flat.filter((item) => (answers[item.question.id] ?? '') !== '').length;

  if (!current) {
    return (
      <div className="min-h-dvh bg-paper">
        <div className="mx-auto w-full max-w-app px-4 py-6">
          <EmptyState
            icon="测"
            title="这套卷子没有题目"
            desc="内容包可能有误，请返回列表选择其他套卷。"
            action={<Button onClick={() => navigate(modulePath(level, 'quiz'))}>返回列表</Button>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-paper">
      <div className="mx-auto flex w-full max-w-app flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-2 bg-paper/95 px-4 pb-2 pt-[calc(8px+env(safe-area-inset-top))] backdrop-blur">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="min-h-tap text-sm text-ink-soft"
            aria-label="交卷"
          >
            交卷
          </button>
          <QuizTimer remaining={countdown.remaining} total={quiz.durationSec} />
          <button
            type="button"
            onClick={() => setCardOpen(true)}
            className="min-h-tap text-sm text-ink-soft"
            aria-label="答题卡"
          >
            {answeredCount}/{flat.length}
          </button>
        </header>

        <main className="flex flex-col gap-4 px-4 pb-8 pt-2">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-moss-light px-2 py-0.5 text-xs text-moss-dark">
              {current.sectionTitle}
            </span>
            <span className="text-xs text-ink-soft">
              第 {current.order} / {flat.length} 题
            </span>
          </div>

          <Card>
            <QuestionRenderer
              question={current.question}
              value={answers[current.question.id] ?? null}
              onChange={(value) =>
                setAnswers((prev) => ({ ...prev, [current.question.id]: value }))
              }
              order={current.order}
            />
          </Card>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              block
              disabled={index === 0}
              onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
            >
              上一题
            </Button>
            {index >= flat.length - 1 ? (
              <Button block onClick={() => setConfirmOpen(true)}>
                交卷
              </Button>
            ) : (
              <Button block onClick={() => setIndex((prev) => Math.min(flat.length - 1, prev + 1))}>
                下一题
              </Button>
            )}
          </div>

          <p className="text-center text-xs text-ink-soft">
            作答期间不会打断你 —— 新版本提示会等到交卷后再出现。
          </p>
        </main>
      </div>

      {/* 答题卡 */}
      <Modal open={cardOpen} onClose={() => setCardOpen(false)} title="答题卡">
        <div className="grid grid-cols-6 gap-2">
          {flat.map((item, itemIndex) => {
            const done = (answers[item.question.id] ?? '') !== '';
            return (
              <button
                key={item.question.id}
                type="button"
                onClick={() => {
                  setIndex(itemIndex);
                  setCardOpen(false);
                }}
                className={cn(
                  'flex min-h-tap items-center justify-center rounded-card border text-sm',
                  itemIndex === index
                    ? 'border-moss bg-moss-light text-moss-dark'
                    : done
                      ? 'border-moss text-ink'
                      : 'border-line text-ink-soft',
                )}
              >
                {item.order}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          已作答 {answeredCount} 题，未作答 {flat.length - answeredCount} 题。
        </p>
      </Modal>

      {/* 交卷确认 */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="确认交卷"
        footer={
          <div className="flex items-center gap-3 pb-1">
            <Button variant="ghost" block onClick={() => setConfirmOpen(false)}>
              继续作答
            </Button>
            <Button block onClick={() => finish(false, countdown.usedSec)}>
              确认交卷
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-ink">
          你已作答 {answeredCount} / {flat.length} 题
          {answeredCount < flat.length ? '，未作答的题目将按 0 分计。' : '。'}
        </p>
      </Modal>
    </div>
  );
}

/**
 * 计时作答页（P0-15）。路由 handle.chrome === false，全屏无壳。
 */
export function QuizRunnerPage(): JSX.Element {
  const params = useParams<{ level: string; quizId: string }>();
  const navigate = useNavigate();
  const level = isLevelId(params.level) ? params.level : null;
  const quizId = params.quizId ?? '';

  const { data, loading, error } = useContent(level, 'quiz');
  const quiz = useMemo(() => data?.items.find((item) => item.id === quizId) ?? null, [data, quizId]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-paper">
        <div className="mx-auto flex w-full max-w-app flex-col gap-3 px-4 py-6">
          <div className="h-8 w-1/2 rounded-card bg-line" />
          <div className="h-40 w-full rounded-card border border-line bg-parchment" />
        </div>
      </div>
    );
  }

  if (!level || error || !quiz) {
    return (
      <div className="min-h-dvh bg-paper">
        <div className="mx-auto w-full max-w-app px-4 py-6">
          <EmptyState
            icon="测"
            title="找不到这套试卷"
            desc={error ?? '试卷可能已更新，请返回列表重新选择。'}
            action={
              <Button onClick={() => navigate(level ? modulePath(level, 'quiz') : '/levels')}>
                返回测试列表
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  // key 保证换卷时整个计时内核重新挂载
  return <QuizRunner key={quiz.id} level={level} quiz={quiz} />;
}
