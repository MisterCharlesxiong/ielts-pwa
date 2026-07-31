import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { MotionFade } from '@/components/common/MotionFade';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { MODULES, modulePath } from '@/constants/modules';
import { useProgressStore } from '@/store/useProgressStore';
import type { LevelId, ModuleId } from '@/types';

export interface ModuleGridProps {
  /** 当前难度；为空时点击模块先去选难度 */
  level: LevelId | null;
}

/** 2×3 模块卡。未选难度时统一跳 `/levels`，避免出现无难度上下文的模块页。 */
export function ModuleGrid({ level }: ModuleGridProps): JSX.Element {
  const navigate = useNavigate();
  const byLevel = useProgressStore((s) => s.byLevel);
  const getModuleCompletion = useProgressStore((s) => s.getModuleCompletion);

  const completions = useMemo<Record<ModuleId, number>>(() => {
    const result = {} as Record<ModuleId, number>;
    MODULES.forEach((mod) => {
      result[mod.id] = level ? getModuleCompletion(level, mod.id) : 0;
    });
    return result;
  }, [level, byLevel, getModuleCompletion]);

  const handleClick = (module: ModuleId): void => {
    if (!level) {
      navigate('/levels');
      return;
    }
    navigate(modulePath(level, module));
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {MODULES.map((mod, index) => (
        <MotionFade key={mod.id} index={index}>
          <Card
            interactive
            className="flex h-full cursor-pointer flex-col gap-2 p-3"
            role="button"
            tabIndex={0}
            onClick={() => handleClick(mod.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleClick(mod.id);
              }
            }}
            aria-label={`${mod.name}：${mod.desc}`}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-moss-light text-sm font-medium text-moss-dark">
                {mod.icon}
              </span>
              <span className="text-base font-semibold text-ink">{mod.name}</span>
            </div>
            <p className="text-xs leading-relaxed text-ink-soft">{mod.desc}</p>
            <div className="mt-auto flex items-center gap-2 pt-1">
              <ProgressBar value={completions[mod.id]} height={4} className="flex-1" label={`${mod.name}完成度`} />
              <span className="text-[11px] tabular-nums text-ink-soft">
                {Math.round(completions[mod.id] * 100)}%
              </span>
            </div>
          </Card>
        </MotionFade>
      ))}
    </div>
  );
}
