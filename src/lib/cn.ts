import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 条件类名合并。
 * clsx 负责条件拼接，tailwind-merge 负责解决同类工具类的覆盖冲突
 * （例如 `px-3` 与 `px-5` 同时出现时保留后者）。
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
