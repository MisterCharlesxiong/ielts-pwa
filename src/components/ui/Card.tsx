import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 是否作为可点击卡片（增加按压反馈与热区） */
  interactive?: boolean;
  /** 苔绿描边强调（如「当前难度」卡片） */
  highlighted?: boolean;
  children?: ReactNode;
}

/**
 * 纸感卡片：米白底 + 柔和描边，禁止使用阴影堆叠制造层级（护眼低对比原则）。
 */
export function Card({
  interactive = false,
  highlighted = false,
  className = '',
  children,
  ...rest
}: CardProps): JSX.Element {
  return (
    <div
      className={cn(
        'rounded-card border bg-paper p-4',
        highlighted ? 'border-moss' : 'border-line',
        interactive && 'transition-transform duration-150 active:scale-[0.99]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
