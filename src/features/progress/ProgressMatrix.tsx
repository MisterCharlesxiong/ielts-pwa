import { useMemo } from 'react';

import { Card } from '@/components/ui/Card';
import { LEVELS } from '@/constants/levels';
import { MODULES } from '@/constants/modules';
import { useProgressStore } from '@/store/useProgressStore';
import type { LevelId, ModuleId } from '@/types';

export interface ProgressMatrixProps {
  /** 当前难度所在行高亮 */
  currentLevel: LevelId | null;
  onCellClick?: (level: LevelId, module: ModuleId) => void;
}

/** 完成度 → 苔绿深浅（用透明度模拟热力，避免新增色值 token） */
function heatOpacity(ratio: number): number {
  if (ratio <= 0) return 0.08;
  return 0.18 + Math.min(1, ratio) * 0.82;
}

/**
 * 模块 × 难度热力矩阵（6×6）。
 * 颜色只用苔绿主色 + 透明度，不引入新色值，也不使用暖陶色（非正反馈场景）。
 */
export function ProgressMatrix({ currentLevel, onCellClick }: ProgressMatrixProps): JSX.Element {
  const byLevel = useProgressStore((s) => s.byLevel);
  const getModuleCompletion = useProgressStore((s) => s.getModuleCompletion);

  const grid = useMemo(
    () =>
      LEVELS.map((level) => ({
        level,
        cells: MODULES.map((mod) => ({
          module: mod,
          ratio: getModuleCompletion(level.id, mod.id),
        })),
      })),
    [byLevel, getModuleCompletion],
  );

  return (
    <Card className="flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink">模块 × 难度</h3>
        <span className="text-[11px] text-ink-soft">颜色越深完成度越高</span>
      </div>

      <div className="grid grid-cols-[52px_repeat(6,1fr)] gap-1">
        <span aria-hidden="true" />
        {MODULES.map((mod) => (
          <span key={mod.id} className="text-center text-[11px] text-ink-soft">
            {mod.name}
          </span>
        ))}

        {grid.map((row) => (
          <div key={row.level.id} className="contents">
            <span
              className={
                row.level.id === currentLevel
                  ? 'flex items-center text-[11px] font-medium text-moss-dark'
                  : 'flex items-center text-[11px] text-ink-soft'
              }
            >
              {row.level.name}
            </span>
            {row.cells.map((cell) => (
              <button
                key={`${row.level.id}-${cell.module.id}`}
                type="button"
                onClick={() => onCellClick?.(row.level.id, cell.module.id)}
                aria-label={`${row.level.name} ${cell.module.name} 完成度 ${Math.round(cell.ratio * 100)}%`}
                className="h-8 rounded-md border border-line bg-moss"
                style={{ opacity: heatOpacity(cell.ratio) }}
              />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
