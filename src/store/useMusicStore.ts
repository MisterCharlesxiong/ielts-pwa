import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DB_SCHEMA_VERSION, STORAGE_KEYS } from '@/constants/schema';
import { idbStorage } from '@/lib/zustandIdbStorage';
import type { MusicTrack } from '@/types';

/**
 * 背景音乐偏好。数据极小但变更极频繁（拖音量滑杆），
 * 单独切一个 store，避免连带整棵进度树反复写盘。
 */
export interface MusicStoreState {
  enabled: boolean;
  track: MusicTrack;
  /** 0-1，默认 0.35 */
  volume: number;
  /** 是否已弹过首次引导 */
  onboarded: boolean;
  hasHydrated: boolean;

  setEnabled(value: boolean): void;
  setTrack(track: MusicTrack): void;
  setVolume(value: number): void;
  markOnboarded(): void;
  setHasHydrated(value: boolean): void;
}

type PersistedMusic = Pick<MusicStoreState, 'enabled' | 'track' | 'volume' | 'onboarded'>;

export const useMusicStore = create<MusicStoreState>()(
  persist(
    (set) => ({
      enabled: false,
      track: 'rain',
      volume: 0.35,
      onboarded: false,
      hasHydrated: false,

      setEnabled: (value) => set({ enabled: value }),
      setTrack: (track) => set({ track }),
      setVolume: (value) => set({ volume: Math.min(1, Math.max(0, value)) }),
      markOnboarded: () => set({ onboarded: true }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: STORAGE_KEYS.music,
      version: DB_SCHEMA_VERSION,
      storage: createJSONStorage(() => idbStorage),
      partialize: (state): PersistedMusic => ({
        enabled: state.enabled,
        track: state.track,
        volume: state.volume,
        onboarded: state.onboarded,
      }),
      migrate: (persisted, version) => {
        if (version !== DB_SCHEMA_VERSION) {
          console.info(`[store] music-store 从 v${version} 迁移到 v${DB_SCHEMA_VERSION}（首版无结构变更）`);
        }
        return persisted as PersistedMusic;
      },
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.warn('[store] music-store 读取失败，使用默认值', error);
        useMusicStore.setState({ hasHydrated: true });
      },
    },
  ),
);
