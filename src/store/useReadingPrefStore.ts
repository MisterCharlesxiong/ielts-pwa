import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DB_SCHEMA_VERSION, STORAGE_KEYS } from '@/constants/schema';
import { idbStorage } from '@/lib/zustandIdbStorage';
import type { ReadingFontSize, ReadingTheme } from '@/types';

/**
 * 专注阅读偏好。变更频繁（拖字号），单独持久化。
 * 行高恒定 1.9，不提供调节。
 */
export interface ReadingPrefState {
  theme: ReadingTheme;
  fontSize: ReadingFontSize;
  focusMode: boolean;
  hasHydrated: boolean;

  setTheme(theme: ReadingTheme): void;
  setFontSize(size: ReadingFontSize): void;
  toggleFocus(): void;
  setFocus(value: boolean): void;
  setHasHydrated(value: boolean): void;
}

type PersistedReadingPref = Pick<ReadingPrefState, 'theme' | 'fontSize' | 'focusMode'>;

export const READING_FONT_SIZES: ReadingFontSize[] = [17, 18, 20];

export const useReadingPrefStore = create<ReadingPrefState>()(
  persist(
    (set) => ({
      theme: 'parchment',
      fontSize: 18,
      focusMode: true,
      hasHydrated: false,

      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      toggleFocus: () => set((s) => ({ focusMode: !s.focusMode })),
      setFocus: (value) => set({ focusMode: value }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: STORAGE_KEYS.readingPref,
      version: DB_SCHEMA_VERSION,
      storage: createJSONStorage(() => idbStorage),
      partialize: (state): PersistedReadingPref => ({
        theme: state.theme,
        fontSize: state.fontSize,
        focusMode: state.focusMode,
      }),
      migrate: (persisted, version) => {
        if (version !== DB_SCHEMA_VERSION) {
          console.info(`[store] reading-pref-store 从 v${version} 迁移到 v${DB_SCHEMA_VERSION}（首版无结构变更）`);
        }
        return persisted as PersistedReadingPref;
      },
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.warn('[store] reading-pref-store 读取失败，使用默认值', error);
        useReadingPrefStore.setState({ hasHydrated: true });
      },
    },
  ),
);
