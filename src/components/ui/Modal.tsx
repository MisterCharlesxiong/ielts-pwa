import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { backdropVariants, sheetVariants } from '@/constants/motion';
import { cn } from '@/lib/cn';

export interface ModalProps {
  open: boolean;
  /** 点遮罩 / 按 Esc 时触发；不可关闭的弹窗传 undefined */
  onClose?: () => void;
  title?: string;
  /** 是否允许点击遮罩关闭 */
  dismissable?: boolean;
  children?: ReactNode;
  /** 底部操作区 */
  footer?: ReactNode;
  className?: string;
}

/**
 * 底部抽屉式弹窗。
 * - 打开时锁 body 滚动，关闭后恢复原值（不硬写 'auto'，避免踩坏外部样式）。
 * - 内容区自身可滚动，最高 80dvh。
 */
export function Modal({
  open,
  onClose,
  title = '',
  dismissable = true,
  children = null,
  footer = null,
  className = '',
}: ModalProps): JSX.Element {
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && dismissable && onClose) onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, dismissable, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={title || '弹窗'}>
          <motion.div
            className="absolute inset-0 bg-ink/40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={dismissable && onClose ? onClose : undefined}
          />
          <motion.div
            className={cn(
              'relative w-full max-w-app rounded-t-[20px] border-t border-line bg-paper',
              'pb-[calc(16px+env(safe-area-inset-bottom))]',
              className,
            )}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-center pt-3">
              <span className="h-1 w-10 rounded-full bg-line" />
            </div>

            {title ? <h2 className="px-5 pb-1 pt-3 text-lg font-semibold text-ink">{title}</h2> : null}

            <div className="max-h-[70dvh] overflow-y-auto px-5 py-3">{children}</div>

            {footer ? <div className="border-t border-line px-5 pt-3">{footer}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
