import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { EASE_OUT } from '@/constants/motion';

export interface MotionFadeProps {
  children: ReactNode;
  /** 列表项序号，用于 stagger（上限 240ms） */
  index?: number;
  className?: string;
  /** 仅淡入，不做位移 */
  plain?: boolean;
}

/**
 * 统一入场动效包装。
 * 时长固定 ≤300ms；`prefers-reduced-motion` 由外层 MotionConfig 统一降级。
 */
export function MotionFade({ children, index = 0, className = '', plain = false }: MotionFadeProps): JSX.Element {
  const delay = Math.min(index * 0.04, 0.24);

  return (
    <motion.div
      className={className}
      initial={plain ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={plain ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ ...EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
