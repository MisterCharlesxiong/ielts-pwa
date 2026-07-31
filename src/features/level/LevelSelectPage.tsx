import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { MotionFade } from '@/components/common/MotionFade';
import { PageContainer } from '@/components/layout/PageContainer';
import { toast } from '@/components/ui/Toast';
import { LEVELS } from '@/constants/levels';
import type { LevelMeta } from '@/constants/levels';
import { MODULE_IDS } from '@/constants/modules';
import { LevelCard } from '@/features/level/LevelCard';
import { useAppStore } from '@/store/useAppStore';
import { useProgressStore } from '@/store/useProgressStore';
import type { LevelId } from '@/types';

/**
 * 难度选择页（P0-17）。
 * 切换难度**不算学习动作**，因此只调 `setLevel()`，绝不调 `recordAction()`。
 */
export function LevelSelectPage(): JSX.Element {
  const currentLevel = useAppStore((s) => s.currentLevel);
  const setLevel = useAppStore((s) => s.setLevel);
  const byLevel = useProgressStore((s) => s.byLevel);
  const getModuleCompletion = useProgressStore((s) => s.getModuleCompletion);
  const navigate = useNavigate();

  const completions = useMemo<Record<LevelId, number>>(() => {
    const result = {} as Record<LevelId, number>;
    LEVELS.forEach((level) => {
      const sum = MODULE_IDS.reduce((acc, module) => acc + getModuleCompletion(level.id, module), 0);
      result[level.id] = MODULE_IDS.length > 0 ? sum / MODULE_IDS.length : 0;
    });
    return result;
  }, [byLevel, getModuleCompletion]);

  const handleSelect = (meta: LevelMeta): void => {
    setLevel(meta.id);
    toast(`已切换到「${meta.name}」`, 'neutral');
    navigate('/');
  };

  return (
    <PageContainer className="flex flex-col gap-3">
      <div>
        <h2 className="text-xl font-semibold text-ink">选择难度</h2>
        <p className="text-sm text-ink-soft">六级内容量一致，随时可切换，进度分别保存</p>
      </div>

      {LEVELS.map((meta, index) => (
        <MotionFade key={meta.id} index={index}>
          <LevelCard
            meta={meta}
            completion={completions[meta.id] ?? 0}
            current={meta.id === currentLevel}
            onSelect={handleSelect}
          />
        </MotionFade>
      ))}
    </PageContainer>
  );
}
