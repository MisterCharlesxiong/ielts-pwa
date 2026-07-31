import { motion } from 'framer-motion';

import { EASE_OUT } from '@/constants/motion';
import { cn } from '@/lib/cn';

export interface ProgressBarProps {
  /** 0-1，越界自动夹取 */
  value: number;
  /** 轨道高度，px */
  height?: number;
  /** 达成 100% 时是否切换为暖陶色（属于正反馈，允许） */
  celebrateOnFull?: boolean;
  className?: string;
  /** 无障碍标签 */
  label?: string;
}

/** 线性进度条。数值变化走 ≤300ms 缓出动效。 */
export function ProgressBar({
  value,
  height = 6,
  celebrateOnFull = false,
  className = '',
  label = '进度',
}: ProgressBarProps): JSX.Element {
  const ratio = Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
  const full = ratio >= 1;

  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-line', className)}
      style={{ height }}
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(ratio * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn('h-full rounded-full', celebrateOnFull && full ? 'bg-terra' : 'bg-moss')}
        initial={false}
        animate={{ width: `${ratio * 100}%` }}
        transition={EASE_OUT}
      />
    </div>
  );
}
