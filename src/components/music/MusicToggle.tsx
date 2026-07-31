import { useState } from 'react';

import { MusicPanel } from '@/components/music/MusicPanel';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { cn } from '@/lib/cn';

/**
 * 顶栏音乐图标。
 * 点击打开音乐面板（面板内的开关按钮同样在点击同步栈里解锁 AudioContext）。
 * AudioContext 完全不可用的环境直接隐藏入口，不留死按钮。
 */
export function MusicToggle(): JSX.Element | null {
  const { available, enabled } = useBackgroundMusic();
  const [open, setOpen] = useState(false);

  if (!available) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={enabled ? '背景音乐已开启，点击调整' : '背景音乐已关闭，点击开启'}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-full active:bg-moss-light',
          enabled ? 'text-moss-dark' : 'text-ink-soft',
        )}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 18V6l10-2v12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17" cy="16" r="2.4" stroke="currentColor" strokeWidth="1.6" />
          {enabled ? null : (
            <path d="M4 20L20 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          )}
        </svg>
      </button>

      <MusicPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
