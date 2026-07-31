import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { SPRING } from '@/constants/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

export interface ProgressRingProps {
  /** 0-1 */
  value: number;
  /** 直径 px */
  size?: number;
  /** 环宽 px */
  stroke?: number;
  /**
   * 进度环颜色。`accent` 为暖陶色，**仅允许在正反馈时使用**
   * （如今日已完成打卡）。默认苔绿。
   */
  tone?: 'moss' | 'accent';
  /** 环内内容 */
  children?: ReactNode;
  className?: string;
  label?: string;
}

/**
 * SVG 环形进度（打卡环 P1-08）。
 * `stroke-dashoffset` 走 Framer spring；系统开启「减弱动态效果」时直接跳变。
 */
export function ProgressRing({
  value,
  size = 108,
  stroke = 8,
  tone = 'moss',
  children = null,
  className = '',
  label = '连续打卡进度',
}: ProgressRingProps): JSX.Element {
  const reduced = useReducedMotion();
  const ratio = Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - ratio);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label} ${Math.round(ratio * 100)}%`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-line"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          className={tone === 'accent' ? 'stroke-terra' : 'stroke-moss'}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={reduced ? { duration: 0 } : SPRING}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}
