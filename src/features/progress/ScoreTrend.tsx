import { useMemo } from 'react';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { dateKeyFromEpoch, formatDateCn } from '@/lib/date';
import { useProgressStore } from '@/store/useProgressStore';
import type { LevelId } from '@/types';

export interface ScoreTrendProps {
  level: LevelId | null;
  /** 最多展示多少次成绩 */
  limit?: number;
}

interface TrendPoint {
  x: number;
  y: number;
  ratio: number;
  submittedAt: number;
}

const WIDTH = 320;
const HEIGHT = 120;
const PADDING = 12;

/**
 * 成绩趋势（P1-07）。
 * 用原生 SVG 折线手写，不引图表库（省 40KB+，也便于跟随 CSS 变量换色）。
 */
export function ScoreTrend({ level, limit = 10 }: ScoreTrendProps): JSX.Element {
  const byLevel = useProgressStore((s) => s.byLevel);

  const points = useMemo<TrendPoint[]>(() => {
    if (!level) return [];
    const attempts = Object.values(byLevel[level]?.quiz.attempts ?? {})
      .flat()
      .filter((attempt) => attempt.fullScore > 0)
      .sort((a, b) => a.submittedAt - b.submittedAt)
      .slice(-limit);

    if (attempts.length === 0) return [];

    const innerWidth = WIDTH - PADDING * 2;
    const innerHeight = HEIGHT - PADDING * 2;
    const step = attempts.length > 1 ? innerWidth / (attempts.length - 1) : 0;

    return attempts.map((attempt, index) => {
      const ratio = Math.min(1, Math.max(0, attempt.totalScore / attempt.fullScore));
      return {
        x: PADDING + step * index,
        y: PADDING + innerHeight * (1 - ratio),
        ratio,
        submittedAt: attempt.submittedAt,
      };
    });
  }, [byLevel, level, limit]);

  if (!level || points.length === 0) {
    return (
      <Card>
        <EmptyState
          icon="趋"
          title="还没有成绩记录"
          desc="完成一次随堂测试后，这里会显示最近 10 次的得分曲线。"
        />
      </Card>
    );
  }

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  const first = points[0];

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-ink">成绩趋势</h3>
        <span className="text-[11px] text-ink-soft">最近 {points.length} 次测试</span>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label={`最近 ${points.length} 次测试正确率趋势，最新一次 ${Math.round((last?.ratio ?? 0) * 100)}%`}
      >
        {[0, 0.5, 1].map((line) => {
          const y = PADDING + (HEIGHT - PADDING * 2) * (1 - line);
          return (
            <line
              key={line}
              x1={PADDING}
              x2={WIDTH - PADDING}
              y1={y}
              y2={y}
              className="stroke-line"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
          );
        })}

        <path d={path} fill="none" className="stroke-moss" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {points.map((point) => (
          <circle key={point.submittedAt} cx={point.x} cy={point.y} r={3.2} className="fill-moss" />
        ))}
      </svg>

      <div className="flex justify-between text-[11px] text-ink-soft">
        <span>{first ? formatDateCn(dateKeyFromEpoch(first.submittedAt)) : ''}</span>
        <span className="text-ink">最新 {Math.round((last?.ratio ?? 0) * 100)}%</span>
        <span>{last ? formatDateCn(dateKeyFromEpoch(last.submittedAt)) : ''}</span>
      </div>
    </Card>
  );
}
