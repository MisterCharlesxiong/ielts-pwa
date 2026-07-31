import { cn } from '@/lib/cn';
import { normalizeText } from '@/lib/speechScore';
import type { Question } from '@/types';

export interface QuestionRendererProps {
  question: Question;
  /** 当前作答；未作答为 null */
  value: string | null;
  onChange: (value: string) => void;
  /** 是否已揭晓答案（即时判分模式下提交后为 true） */
  revealed?: boolean;
  disabled?: boolean;
  /** 题号，从 1 开始 */
  order?: number;
}

const BOOLEAN_OPTIONS = [
  { key: 'true', text: '正确 True' },
  { key: 'false', text: '错误 False' },
];

/** 把 answer 归一化成可比较的字符串数组 */
function acceptableAnswers(question: Question): string[] {
  const raw = Array.isArray(question.answer) ? question.answer : [question.answer];
  return raw.map((item) => String(item));
}

/**
 * 判分（离线纯函数）。
 * - single：选项 key 全等
 * - boolean：'true' / 'false' 全等
 * - blank：归一化后命中任一可接受答案即算对
 */
export function isAnswerCorrect(question: Question, given: string | null): boolean {
  if (given === null || given === '') return false;
  const answers = acceptableAnswers(question);
  if (question.type === 'blank') {
    const normalizedGiven = normalizeText(given);
    return answers.some((answer) => normalizeText(answer) === normalizedGiven);
  }
  return answers.some((answer) => answer === given);
}

/** 题目满分，缺省 1 分 */
export function questionPoints(question: Question): number {
  return typeof question.points === 'number' && question.points > 0 ? question.points : 1;
}

/**
 * 题型分发渲染：单选 / 判断 / 填空。
 * 三种题型全部可离线判分，不依赖任何服务端。
 */
export function QuestionRenderer({
  question,
  value,
  onChange,
  revealed = false,
  disabled = false,
  order,
}: QuestionRendererProps): JSX.Element {
  const correct = isAnswerCorrect(question, value);
  const answers = acceptableAnswers(question);
  const options = question.type === 'boolean' ? BOOLEAN_OPTIONS : (question.options ?? []);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-base leading-relaxed text-ink">
        {typeof order === 'number' ? <span className="mr-1 text-ink-soft">{order}.</span> : null}
        {question.stem}
      </p>

      {question.type === 'blank' ? (
        <input
          type="text"
          value={value ?? ''}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder="填入答案"
          aria-label="填空作答"
          className={cn(
            'min-h-tap w-full rounded-card border bg-paper px-3 text-base text-ink placeholder:text-ink-soft',
            revealed ? (correct ? 'border-terra' : 'border-moss-dark') : 'border-line',
          )}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {options.map((option) => {
            const selected = value === option.key;
            const isRight = revealed && answers.includes(option.key);
            const isWrongPick = revealed && selected && !answers.includes(option.key);
            return (
              <button
                key={option.key}
                type="button"
                disabled={disabled}
                onClick={() => onChange(option.key)}
                aria-pressed={selected}
                className={cn(
                  'flex min-h-tap items-center gap-2 rounded-card border px-3 py-2 text-left text-base transition-colors duration-150',
                  'disabled:cursor-not-allowed',
                  isRight
                    ? 'border-terra bg-moss-light text-ink'
                    : isWrongPick
                      ? 'border-moss-dark bg-paper text-ink'
                      : selected
                        ? 'border-moss bg-moss-light text-ink'
                        : 'border-line bg-paper text-ink',
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs',
                    selected || isRight ? 'border-moss text-moss-dark' : 'border-line text-ink-soft',
                  )}
                >
                  {question.type === 'boolean' ? (option.key === 'true' ? 'T' : 'F') : option.key.toUpperCase()}
                </span>
                <span className="flex-1 leading-relaxed">{option.text}</span>
                {isRight ? <span className="text-xs text-terra">正确答案</span> : null}
              </button>
            );
          })}
        </div>
      )}

      {revealed ? (
        <div className="rounded-card bg-moss-light px-3 py-2">
          <p className={cn('text-sm font-medium', correct ? 'text-terra' : 'text-ink')}>
            {correct ? '回答正确' : `正确答案：${answers.join(' / ')}`}
          </p>
          {question.explanation ? (
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{question.explanation}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
