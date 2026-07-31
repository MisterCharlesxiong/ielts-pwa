import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatRelative } from '@/lib/date';
import { useAppStore } from '@/store/useAppStore';

/**
 * 断点续学入口（P0-18）。
 *
 * `resume` 由 `recordAction()` 唯一维护，这里只负责跳转到 `resume.route`。
 * 「继续学习」是正反馈型主 CTA，允许使用暖陶色 accent 变体。
 */
export function ContinueCard(): JSX.Element | null {
  const resume = useAppStore((s) => s.resume);
  const navigate = useNavigate();

  if (!resume) return null;

  const handleContinue = (): void => {
    navigate(resume.route);
  };

  const positionText =
    typeof resume.itemIndex === 'number' && resume.itemIndex >= 0 ? `第 ${resume.itemIndex + 1} 项` : '上次位置';

  return (
    <Card highlighted className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-ink-soft">上次学到</p>
        <p className="truncate text-base font-semibold text-ink">{resume.label}</p>
        <p className="mt-0.5 text-xs text-ink-soft">
          {positionText} · {formatRelative(resume.updatedAt)}
        </p>
      </div>
      <Button variant="accent" onClick={handleContinue}>
        继续学习
      </Button>
    </Card>
  );
}
