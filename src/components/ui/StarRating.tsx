import { cn } from '@/lib/cn';

export interface StarRatingProps {
  /** 1-5，0 表示未评分 */
  value: number;
  onChange?: (value: number) => void;
  /** 只读展示（历史成绩） */
  readOnly?: boolean;
  size?: number;
  className?: string;
  label?: string;
}

const STARS = [1, 2, 3, 4, 5];

/**
 * 1-5 星评分（跟读自评 P0-13）。
 * 点亮态使用暖陶色 —— 属于「用户自我肯定」的正反馈，符合配色约束。
 */
export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 32,
  className = '',
  label = '发音自评',
}: StarRatingProps): JSX.Element {
  const current = Math.min(5, Math.max(0, Math.round(value)));

  return (
    <div
      className={cn('inline-flex items-center gap-1', className)}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={`${label} ${current} 星`}
    >
      {STARS.map((star) => {
        const filled = star <= current;
        const content = (
          <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2.6l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.4l-5.8 3.06 1.11-6.46-4.7-4.58 6.49-.94L12 2.6z"
              className={filled ? 'fill-terra' : 'fill-line'}
            />
          </svg>
        );

        if (readOnly || !onChange) {
          return (
            <span key={star} className="inline-flex items-center justify-center" style={{ width: size, height: size }}>
              {content}
            </span>
          );
        }

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === current}
            aria-label={`${star} 星`}
            onClick={() => onChange(star)}
            className="inline-flex items-center justify-center transition-transform duration-150 active:scale-90"
            style={{ width: Math.max(size, 44), height: Math.max(size, 44) }}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
