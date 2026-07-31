import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  /** 单字图标，避免引入图标库 */
  icon?: string;
  title: string;
  desc?: string;
  /** 操作区（如「去学习」按钮） */
  action?: ReactNode;
  className?: string;
}

/**
 * 通用空态。「范文即将上线」「错题本为空」「内容加载失败」等均复用本组件。
 */
export function EmptyState({ icon = '空', title, desc = '', action = null, className = '' }: EmptyStateProps): JSX.Element {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-10 text-center', className)}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-moss-light text-base text-moss-dark">
        {icon}
      </span>
      <p className="text-base font-medium text-ink">{title}</p>
      {desc ? <p className="max-w-[280px] text-sm leading-relaxed text-ink-soft">{desc}</p> : null}
      {action}
    </div>
  );
}
