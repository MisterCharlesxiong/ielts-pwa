import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'accent' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 视觉变体。
   *
   * - `primary`：苔绿实心，常规主操作（提交、下一题、开始）。
   * - `accent`：**暖陶色，全站只允许用于「正反馈」场景** ——
   *   答对、达成打卡、解锁成就、首页「继续学习」CTA。
   *   任何中性/危险/常规操作一律禁止使用本变体（架构 §7 硬约束）。
   * - `ghost`：无底色，次要操作。
   */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** 撑满父容器宽度 */
  block?: boolean;
  /** 左侧图标位（单字或 SVG，避免引入图标库） */
  leading?: ReactNode;
  children?: ReactNode;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-moss text-paper active:bg-moss-dark disabled:bg-line disabled:text-ink-soft',
  accent: 'bg-terra text-paper active:opacity-90 disabled:bg-line disabled:text-ink-soft',
  ghost: 'bg-transparent text-ink border border-line active:bg-moss-light disabled:text-ink-soft',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'min-h-tap px-3 text-sm rounded-lg',
  md: 'min-h-tap px-4 text-base rounded-card',
  lg: 'min-h-[52px] px-5 text-lg rounded-card',
};

/**
 * 通用按钮。所有可点区域最小 44×44，满足移动端点击热区要求。
 */
export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  leading = null,
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium',
        'transition-transform duration-150 active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:active:scale-100',
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {leading}
      {children}
    </button>
  );
}
