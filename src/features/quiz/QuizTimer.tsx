import { cn } from '@/lib/cn';
import { formatClock } from '@/lib/date';

export interface QuizTimerProps {
  /** 剩余秒数 */
  remaining: number;
  /** 总时长秒数，用于算进度 */
  total: number;
  className?: string;
}

/** 最后 60 秒进入提醒态 */
const WARNING_THRESHOLD_SEC = 60;

/**
 * 考试计时（P0-15）。
 *
 * 剩余时间由 `useCountdown` 基于**绝对截止时间戳**计算，
 * 锁屏 / 切后台被节流也不会算错，本组件只负责展示。
 * 进入最后 1 分钟用苔绿深色而非红色 —— 保持护眼与低压迫感。
 */
export function QuizTimer({ remaining, total, className = '' }: QuizTimerProps): JSX.Element {
  const warning = remaining <= WARNING_THRESHOLD_SEC;
  const ratio = total <= 0 ? 0 : Math.min(1, Math.max(0, remaining / total));

  return (
    <div className={cn('flex items-center gap-2', className)} role="timer" aria-live="off">
      <span
        className={cn(
          'rounded-full px-2 py-1 text-sm font-medium tabular-nums',
          warning ? 'bg-moss-dark text-paper' : 'bg-moss-light text-moss-dark',
        )}
      >
        {formatClock(remaining)}
      </span>
      <div className="h-1 w-16 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div
          className={cn('h-full rounded-full', warning ? 'bg-moss-dark' : 'bg-moss')}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}
