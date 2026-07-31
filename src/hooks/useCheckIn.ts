import { useMemo } from 'react';

import { recentDateKeys, todayKey } from '@/lib/date';
import { useAppStore } from '@/store/useAppStore';

export interface CheckInView {
  streak: number;
  longestStreak: number;
  /** 今天是否已完成 ≥1 个模块动作 */
  checkedInToday: boolean;
  todayActionCount: number;
  /** 最近 7 天打卡情况，从最早到今天 */
  recentDays: { date: string; done: boolean; isToday: boolean }[];
  /** 当前连续天数在「下一个里程碑」中的完成比例 0-1，供打卡环使用 */
  ringRatio: number;
  /** 下一个里程碑天数 */
  nextMilestone: number;
}

/** 打卡环里程碑：7 / 14 / 30 / 60 / 100 / 365 天 */
const MILESTONES = [7, 14, 30, 60, 100, 365];

function nextMilestoneOf(streak: number): number {
  return MILESTONES.find((m) => streak < m) ?? MILESTONES[MILESTONES.length - 1] ?? 365;
}

/** 打卡环数据与今日是否已打卡（P1-08） */
export function useCheckIn(): CheckInView {
  const checkIn = useAppStore((s) => s.checkIn);

  return useMemo(() => {
    const today = todayKey();
    const historySet = new Set(checkIn.history);
    const checkedInToday = checkIn.lastCheckInDate === today;
    const nextMilestone = nextMilestoneOf(checkIn.streak);
    const previousMilestone = MILESTONES.filter((m) => m <= checkIn.streak).pop() ?? 0;
    const span = Math.max(1, nextMilestone - previousMilestone);
    const ringRatio =
      checkIn.streak >= nextMilestone ? 1 : Math.min(1, Math.max(0, (checkIn.streak - previousMilestone) / span));

    return {
      streak: checkIn.streak,
      longestStreak: checkIn.longestStreak,
      checkedInToday,
      todayActionCount: checkIn.lastCheckInDate === today ? checkIn.todayActionCount : 0,
      recentDays: recentDateKeys(7, today).map((date) => ({
        date,
        done: historySet.has(date),
        isToday: date === today,
      })),
      ringRatio,
      nextMilestone,
    };
  }, [checkIn]);
}
