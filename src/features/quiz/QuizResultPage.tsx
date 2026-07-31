import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import type { SegmentedOption } from '@/components/ui/SegmentedControl';
import { isLevelId, levelName } from '@/constants/levels';
import { modulePath, moduleName } from '@/constants/modules';
import { QuestionRenderer } from '@/features/quiz/QuestionRenderer';
import { useContent } from '@/hooks/useContent';
import { formatClock, formatRelative } from '@/lib/date';
import { useProgressStore } from '@/store/useProgressStore';
import type { Question } from '@/types';

type ReviewFilter = 'wrong' | 'all';

const FILTER_OPTIONS: SegmentedOption<ReviewFilter>[] = [
  { value: 'wrong', label: '只看错题' },
  { value: 'all', label: '全部题目' },
];

/** AnswerRecord.given 归一化成可展示的字符串 */
function givenToString(given: string | string[]): string {
  return Array.isArray(given) ? given.join(' ') : given;
}

/**
 * 测试结果页（P0-15 / P1-07）。
 * 展示总分环、分项得分、逐题回顾；数据取自本机最近一次作答记录。
 */
export function QuizResultPage(): JSX.Element {
  const params = useParams<{ level: string; quizId: string }>();
  const navigate = useNavigate();
  const level = isLevelId(params.level) ? params.level : null;
  const quizId = params.quizId ?? '';

  const attempts = useProgressStore((s) =>
    level ? (s.byLevel[level]?.quiz.attempts[quizId] ?? []) : [],
  );
  const attempt = attempts.length > 0 ? attempts[attempts.length - 1] : undefined;

  const { data } = useContent(level, 'quiz');
  const quiz = useMemo(() => data?.items.find((item) => item.id === quizId) ?? null, [data, quizId]);

  const questionMap = useMemo(() => {
    const map = new Map<string, Question>();
    quiz?.sections.forEach((section) => {
      section.questions.forEach((question) => map.set(question.id, question));
    });
    return map;
  }, [quiz]);

  const [filter, setFilter] = useState<ReviewFilter>('wrong');

  if (!level || !attempt) {
    return (
      <PageContainer>
        <EmptyState
          icon="测"
          title="还没有成绩记录"
          desc="先完成一次计时作答，这里就会出现你的得分与逐题回顾。"
          action={
            <Button onClick={() => navigate(level ? modulePath(level, 'quiz') : '/levels')}>
              去测试列表
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const ratio = attempt.fullScore === 0 ? 0 : attempt.totalScore / attempt.fullScore;
  const percent = Math.round(ratio * 100);
  const sections = Object.entries(attempt.bySection);
  const wrongRecords = attempt.answers.filter((record) => !record.correct);
  const visibleRecords = filter === 'wrong' ? wrongRecords : attempt.answers;
  const best = attempts.reduce((max, item) => (item.totalScore > max ? item.totalScore : max), 0);

  return (
    <PageContainer className="flex flex-col gap-4">
      <Card className="flex items-center gap-4">
        <ProgressRing value={ratio} size={96} tone={percent >= 60 ? 'accent' : 'moss'} label="本次得分率">
          <span className="text-2xl font-semibold text-ink">{attempt.totalScore}</span>
          <span className="text-xs text-ink-soft">/ {attempt.fullScore}</span>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <p className="text-base font-medium text-ink">
            {quiz?.title ?? '本次测试'} · 正确率 {percent}%
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            {levelName(level)} · 用时 {formatClock(attempt.usedSec)} · {formatRelative(attempt.submittedAt)}
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            已考 {attempts.length} 次 · 历史最佳 {best}/{attempt.fullScore}
          </p>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">分项得分</h2>
        {sections.map(([sectionId, section]) => {
          const sectionRatio = section.full === 0 ? 0 : section.score / section.full;
          return (
            <div key={sectionId} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink">
                  {section.title}
                  <span className="ml-1 text-xs text-ink-soft">（{moduleName(section.moduleRef)}）</span>
                </span>
                <span className="text-ink-soft">
                  {section.score}/{section.full}
                </span>
              </div>
              <ProgressBar
                value={sectionRatio}
                celebrateOnFull={sectionRatio >= 1}
                label={`${section.title} 得分`}
              />
            </div>
          );
        })}
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">
          逐题回顾（错 {wrongRecords.length} 题）
        </h2>
        <SegmentedControl options={FILTER_OPTIONS} value={filter} onChange={setFilter} label="回顾范围" dense />
      </div>

      {visibleRecords.length === 0 ? (
        <Card>
          <EmptyState icon="✓" title="全部答对" desc="这套卷子没有错题，保持这个手感！" />
        </Card>
      ) : (
        visibleRecords.map((record) => {
          const question = questionMap.get(record.questionId);
          if (!question) {
            return (
              <Card key={record.questionId} className="text-sm text-ink-soft">
                题目 {record.questionId} 已从内容包中移除，无法回顾。
              </Card>
            );
          }
          const given = givenToString(record.given);
          return (
            <Card key={record.questionId}>
              <QuestionRenderer
                question={question}
                value={given === '' ? null : given}
                onChange={() => undefined}
                revealed
                disabled
              />
              {given === '' ? <p className="mt-2 text-xs text-ink-soft">本题未作答</p> : null}
            </Card>
          );
        })
      )}

      <div className="flex items-center gap-3 pb-2">
        <Button variant="ghost" block onClick={() => navigate(modulePath(level, 'quiz'))}>
          返回列表
        </Button>
        <Button block onClick={() => navigate(`${modulePath(level, 'quiz')}/${quizId}`)}>
          再考一次
        </Button>
      </div>

      {wrongRecords.length > 0 ? (
        <Button variant="ghost" block className="mb-2" onClick={() => navigate('/wrongbook')}>
          去错题本重练（{wrongRecords.length}）
        </Button>
      ) : null}
    </PageContainer>
  );
}
