import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { LEVEL_MAP } from '@/constants/levels';
import { MODULE_IDS, modulePath } from '@/constants/modules';
import { ProgressMatrix } from '@/features/progress/ProgressMatrix';
import { ScoreTrend } from '@/features/progress/ScoreTrend';
import { useCheckIn } from '@/hooks/useCheckIn';
import { useAppStore } from '@/store/useAppStore';
import { useProgressStore } from '@/store/useProgressStore';
import type { LevelId, ModuleId } from '@/types';

/** 进度页：矩阵热力 + 成绩趋势 + 关键指标。 */
export function ProgressPage(): JSX.Element {
  const currentLevel = useAppStore((s) => s.currentLevel);
  const setLevel = useAppStore((s) => s.setLevel);
  const byLevel = useProgressStore((s) => s.byLevel);
  const getModuleCompletion = useProgressStore((s) => s.getModuleCompletion);
  const { streak, longestStreak } = useCheckIn();
  const navigate = useNavigate();

  const overall = useMemo(() => {
    if (!currentLevel) return 0;
    const sum = MODULE_IDS.reduce((acc, module) => acc + getModuleCompletion(currentLevel, module), 0);
    return MODULE_IDS.length > 0 ? sum / MODULE_IDS.length : 0;
  }, [currentLevel, byLevel, getModuleCompletion]);

  const wrongCount = useMemo(() => {
    if (!currentLevel) return 0;
    return (byLevel[currentLevel]?.quiz.wrongBook ?? []).filter((item) => !item.cleared).length;
  }, [byLevel, currentLevel]);

  const handleCellClick = (level: LevelId, module: ModuleId): void => {
    setLevel(level);
    navigate(modulePath(level, module));
  };

  return (
    <PageContainer className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold text-ink">学习进度</h2>
        <p className="text-sm text-ink-soft">
          {currentLevel ? `当前难度：${LEVEL_MAP[currentLevel]?.name ?? currentLevel}` : '尚未选择难度'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="flex flex-col items-center gap-1 py-3">
          <span className="text-xl font-semibold tabular-nums text-ink">{Math.round(overall * 100)}%</span>
          <span className="text-[11px] text-ink-soft">本级完成度</span>
        </Card>
        <Card className="flex flex-col items-center gap-1 py-3">
          <span className="text-xl font-semibold tabular-nums text-ink">{streak}</span>
          <span className="text-[11px] text-ink-soft">连续天数</span>
        </Card>
        <Card className="flex flex-col items-center gap-1 py-3">
          <span className="text-xl font-semibold tabular-nums text-ink">{wrongCount}</span>
          <span className="text-[11px] text-ink-soft">待清错题</span>
        </Card>
      </div>

      <ProgressMatrix currentLevel={currentLevel} onCellClick={handleCellClick} />

      <ScoreTrend level={currentLevel} />

      <p className="pb-2 text-center text-xs text-ink-soft">历史最长连续 {longestStreak} 天 · 数据仅保存在本机</p>
    </PageContainer>
  );
}
