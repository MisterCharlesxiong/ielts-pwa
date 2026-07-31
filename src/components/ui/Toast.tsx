import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { toastVariants } from '@/constants/motion';
import { cn } from '@/lib/cn';

/**
 * 轻提示。
 *
 * 用极小的模块级发布订阅实现，避免为一个 Toast 再引 Context/Provider 嵌套；
 * 任何模块 `import { toast } from '@/components/ui/Toast'` 即可调用。
 */

export type ToastTone = 'neutral' | 'success' | 'warning';

export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
  duration: number;
}

type Listener = (items: ToastItem[]) => void;

let queue: ToastItem[] = [];
let seed = 0;
const listeners = new Set<Listener>();

function emit(): void {
  listeners.forEach((listener) => listener(queue));
}

function remove(id: number): void {
  queue = queue.filter((item) => item.id !== id);
  emit();
}

/**
 * 弹出一条轻提示。
 * `tone='success'` 使用暖陶色 —— 仅限答对 / 达成等正反馈场景。
 */
export function toast(message: string, tone: ToastTone = 'neutral', duration = 2200): void {
  seed += 1;
  const item: ToastItem = { id: seed, message, tone, duration };
  // 同屏最多 3 条，超出丢弃最早的
  queue = [...queue, item].slice(-3);
  emit();
  window.setTimeout(() => remove(item.id), duration);
}

const TONE_CLASS: Record<ToastTone, string> = {
  neutral: 'bg-ink text-paper',
  success: 'bg-terra text-paper',
  warning: 'bg-moss-dark text-paper',
};

/** 全局挂载点，放在 AppShell 顶层，只需一个实例。 */
export function ToastHost(): JSX.Element {
  const [items, setItems] = useState<ToastItem[]>(queue);

  useEffect(() => {
    const listener: Listener = (next) => setItems([...next]);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(8px+env(safe-area-inset-top))] z-[60] flex flex-col items-center gap-2 px-4">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn('max-w-app rounded-full px-4 py-2 text-sm shadow-sm', TONE_CLASS[item.tone])}
            role="status"
          >
            {item.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
