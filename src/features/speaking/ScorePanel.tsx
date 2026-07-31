import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { StarRating } from '@/components/ui/StarRating';
import { cn } from '@/lib/cn';
import { formatRelative } from '@/lib/date';
import { scoreComment } from '@/lib/speechScore';
import type { SpeakingMode } from '@/lib/capability';
import type { SpeakingScore } from '@/types';

export interface ScorePanelProps {
  mode: SpeakingMode;
  /** 降级原因，模式A 为 null */
  reason: string | null;
  /** 本次刚产生的成绩，null 表示尚未评分 */
  latest: SpeakingScore | null;
  /** 该句历史成绩（最新在后） */
  history: SpeakingScore[];
  /** 模式B 自评：选择星级后回调 */
  onSelfRate: (stars: number) => void;
  /** 是否允许自评（录完音或听完示范音之后） */
  canSelfRate: boolean;
  className?: string;
}

/**
 * 成绩面板（P0-13）。
 *
 * 双模式统一展示：
 * - 模式A：Web Speech 识别文本 + 相似度 0-100 分；
 * - 模式B：1-5 星自评（离线 / iOS / 不支持识别时自动降级）。
 */
export function ScorePanel({
  mode,
  reason,
  latest,
  history,
  onSelfRate,
  canSelfRate,
  className = '',
}: ScorePanelProps): JSX.Element {
  const currentStars = latest?.stars ?? 0;
  const recentHistory = history.slice(-5).reverse();

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {reason ? (
        <Card className="py-3">
          <p className="text-xs leading-relaxed text-ink-soft">{reason}</p>
        </Card>
      ) : null}

      {mode === 'auto' ? (
        <Card className="flex items-center gap-4">
          <ProgressRing
            value={(latest?.score ?? 0) / 100}
            size={84}
            tone={(latest?.score ?? 0) >= 60 ? 'accent' : 'moss'}
            label="发音相似度"
          >
            <span className="text-xl font-semibold text-ink">{latest?.score ?? '--'}</span>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <p className="text-base font-medium text-ink">
              {latest ? scoreComment(latest.score ?? 0) : '录一段，看看和示范音有多接近'}
            </p>
            {latest?.recognizedText ? (
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                识别到：{latest.recognizedText}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-ink-soft">相似度分数由本机比对算法给出，仅供参考。</p>
          </div>
        </Card>
      ) : (
        <Card className="flex flex-col items-center gap-2">
          <h2 className="text-base font-semibold text-ink">发音自评</h2>
          <p className="text-xs leading-relaxed text-ink-soft">听完对比后，给这次跟读打个星。</p>
          <StarRating
            value={currentStars}
            onChange={canSelfRate ? onSelfRate : undefined}
            readOnly={!canSelfRate}
            className="mt-1"
          />
          {!canSelfRate ? <p className="text-xs text-ink-soft">先录一段或听一遍示范音再评分。</p> : null}
        </Card>
      )}

      {recentHistory.length > 0 ? (
        <Card className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-ink">最近记录</h3>
          <ul className="flex flex-col gap-1.5">
            {recentHistory.map((item) => (
              <li key={item.createdAt} className="flex items-center justify-between text-xs text-ink-soft">
                <span>{formatRelative(item.createdAt)}</span>
                <span className="text-ink">
                  {item.mode === 'auto' ? `${item.score ?? 0} 分` : `${item.stars ?? 0} 星`}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
