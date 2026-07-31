import { useNavigate } from 'react-router-dom';

import { MusicToggle } from '@/components/music/MusicToggle';

export interface TopBarProps {
  title: string;
  showBack?: boolean;
}

/**
 * 顶栏：返回 + 标题 + 音乐开关。
 * 使用 sticky 而非 fixed，避免 iOS 键盘弹起时顶栏漂移。
 */
export function TopBar({ title, showBack = false }: TopBarProps): JSX.Element {
  const navigate = useNavigate();

  const handleBack = (): void => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  return (
    <header
      className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex h-[52px] items-center gap-1 px-2">
        {showBack ? (
          <button
            type="button"
            onClick={handleBack}
            aria-label="返回"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink active:bg-moss-light"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <span className="w-2" />
        )}

        <h1 className="flex-1 truncate px-1 text-base font-semibold text-ink">{title}</h1>

        <MusicToggle />
      </div>
    </header>
  );
}
