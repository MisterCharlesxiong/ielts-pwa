import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { LevelMeta } from '@/constants/levels';

export interface LevelCardProps {
  meta: LevelMeta;
  /** 六模块完成度均值 0-1 */
  completion: number;
  current: boolean;
  onSelect: (meta: LevelMeta) => void;
}

/** 难度卡：进度条 + 内容量清单。 */
export function LevelCard({ meta, completion, current, onSelect }: LevelCardProps): JSX.Element {
  const { counts } = meta;
  const countText = `${counts.words}词 · ${counts.grammar}语法 · ${counts.reading}阅读 · ${counts.writing}写作 · ${counts.speaking}跟读 · ${counts.quiz}测试`;

  return (
    <Card
      interactive
      highlighted={current}
      className="flex cursor-pointer flex-col gap-2"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(meta)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(meta);
        }
      }}
      aria-label={`选择难度 ${meta.name}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-ink">{meta.name}</p>
          <p className="truncate text-xs text-ink-soft">{meta.desc}</p>
        </div>
        {current ? (
          <span className="shrink-0 rounded-full bg-moss-light px-2 py-1 text-[11px] text-moss-dark">当前</span>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <ProgressBar value={completion} height={5} className="flex-1" label={`${meta.name}整体完成度`} />
        <span className="text-[11px] tabular-nums text-ink-soft">{Math.round(completion * 100)}%</span>
      </div>

      <p className="text-[11px] text-ink-soft">{countText}</p>
    </Card>
  );
}
