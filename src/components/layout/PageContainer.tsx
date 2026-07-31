import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { fadeUp } from '@/constants/motion';
import { cn } from '@/lib/cn';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
  /** 取消默认左右内边距（全幅页面用） */
  flush?: boolean;
}

/** 页面级容器：统一内边距 + 入场动效。 */
export function PageContainer({ children, className = '', flush = false }: PageContainerProps): JSX.Element {
  return (
    <motion.div
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={fadeUp.transition}
      className={cn('w-full', flush ? '' : 'px-4 py-4', className)}
    >
      {children}
    </motion.div>
  );
}
