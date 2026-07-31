import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/Button';
import { toastVariants } from '@/constants/motion';
import { applyUpdate, dismissUpdate, shouldPromptUpdate, subscribeUpdate } from '@/lib/pwaUpdate';

/**
 * 新版本提示条。
 *
 * 【致命坑 #5】Service Worker 是 autoUpdate，但**绝不自动 reload**：
 * 刷新时机完全交给用户；且作答中（busy）由 pwaUpdate 闸门挂起，不打断答题。
 */
export function UpdatePrompt(): JSX.Element {
  const [visible, setVisible] = useState<boolean>(() => shouldPromptUpdate());

  useEffect(() => subscribeUpdate(() => setVisible(shouldPromptUpdate())), []);

  const handleApply = (): void => {
    void applyUpdate();
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-x-0 bottom-[calc(72px+env(safe-area-inset-bottom))] z-[70] mx-auto flex w-[calc(100%-32px)] max-w-app items-center gap-3 rounded-card border border-line bg-paper px-4 py-3"
          role="status"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink">有新版本可用</p>
            <p className="text-xs text-ink-soft">刷新后生效，学习进度不受影响</p>
          </div>
          <Button size="sm" variant="ghost" onClick={dismissUpdate}>
            稍后
          </Button>
          <Button size="sm" onClick={handleApply}>
            刷新
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
