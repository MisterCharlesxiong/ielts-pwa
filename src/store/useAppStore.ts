import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CHECKIN_HISTORY_LIMIT, DB_SCHEMA_VERSION, STORAGE_KEYS } from '@/constants/schema';
import { isPreviousDay, todayKey } from '@/lib/date';
import { idbStorage } from '@/lib/zustandIdbStorage';
import type { CheckInState, LevelId, ResumePointer } from '@/types';

/**
 * 全局轻量状态：当前难度、断点续学指针、打卡。
 * 数据量小、变更频率低，与「进度树」分开持久化，避免互相拖累写盘。
 */

export interface AppStoreState {
  schemaVersion: number;
  currentLevel: LevelId | null;
  resume: ResumePointer | null;
  checkIn: CheckInState;
  /** 不持久化：persist rehydrate 完成信号 */
  hasHydrated: boolean;

  setLevel(level: LevelId): void;
  /**
   * 唯一的「学习动作」入口：更新 resume + 触发打卡判定。
   * 打卡口径（架构 §7.6）：当日完成 ≥1 个模块动作才算打卡；
   * 打开 App / 切难度 / 播 TTS / 开关音乐 一律不得调用本方法。
   */
  recordAction(pointer: Omit<ResumePointer, 'updatedAt'>): void;
  clearResume(): void;
  setHasHydrated(value: boolean): void;
}

export const INITIAL_CHECK_IN: CheckInState = {
  streak: 0,
  longestStreak: 0,
  lastCheckInDate: null,
  history: [],
  todayActionCount: 0,
  todayDate: null,
};

type PersistedApp = Pick<AppStoreState, 'schemaVersion' | 'currentLevel' | 'resume' | 'checkIn'>;

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      schemaVersion: DB_SCHEMA_VERSION,
      currentLevel: null,
      resume: null,
      checkIn: INITIAL_CHECK_IN,
      hasHydrated: false,

      setLevel: (level) => set({ currentLevel: level }),

      recordAction: (pointer) =>
        set((state) => {
          const today = todayKey();
          const previous = state.checkIn;
          const sameDay = previous.todayDate === today;

          let { streak, longestStreak, lastCheckInDate, history } = previous;

          // 当日首个模块动作 → 计一次打卡
          if (lastCheckInDate !== today) {
            if (lastCheckInDate && isPreviousDay(lastCheckInDate, today)) {
              streak += 1; // 昨天也学了 → 连续 +1
            } else {
              streak = 1; // 首次或断签 → 重置为 1
            }
            lastCheckInDate = today;
            longestStreak = Math.max(longestStreak, streak);
            history = [...history.filter((d) => d !== today), today].slice(-CHECKIN_HISTORY_LIMIT);
          }

          return {
            currentLevel: pointer.level,
            resume: { ...pointer, updatedAt: Date.now() },
            checkIn: {
              streak,
              longestStreak,
              lastCheckInDate,
              history,
              todayActionCount: (sameDay ? previous.todayActionCount : 0) + 1,
              todayDate: today,
            },
          };
        }),

      clearResume: () => set({ resume: null }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: STORAGE_KEYS.app,
      version: DB_SCHEMA_VERSION,
      storage: createJSONStorage(() => idbStorage),
      partialize: (state): PersistedApp => ({
        schemaVersion: state.schemaVersion,
        currentLevel: state.currentLevel,
        resume: state.resume,
        checkIn: state.checkIn,
      }),
      migrate: (persisted, version) => {
        // 首版仅打日志；真正的迁移脚本列入 P2
        if (version !== DB_SCHEMA_VERSION) {
          console.info(`[store] app-store 从 v${version} 迁移到 v${DB_SCHEMA_VERSION}（首版无结构变更）`);
        }
        return persisted as PersistedApp;
      },
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.warn('[store] app-store 读取失败，使用默认值', error);
        useAppStore.setState({ hasHydrated: true });
      },
    },
  ),
);
