import type { StateStorage } from 'zustand/middleware';

import { IDB_WRITE_DEBOUNCE_MS } from '@/constants/schema';
import { getItem, removeItem, setItem } from '@/lib/idb';

/**
 * Zustand persist 的 IndexedDB 适配器。
 *
 * 为什么要防抖：persist 每次 setState 都会序列化并写盘。拖音量滑杆、
 * 打字存草稿这类高频动作若逐次落盘，移动端会明显卡顿。这里按 key 做
 * 300ms 尾部防抖，只写最后一次值。
 *
 * 为什么要 flush：防抖窗口内用户可能直接切后台或杀进程，
 * 因此在 `pagehide` / `visibilitychange(hidden)` 时强制冲刷未落盘的值。
 */

interface PendingWrite {
  timer: ReturnType<typeof setTimeout>;
  value: string;
}

const pending = new Map<string, PendingWrite>();

function flushKey(key: string): void {
  const item = pending.get(key);
  if (!item) return;
  clearTimeout(item.timer);
  pending.delete(key);
  void setItem(key, item.value);
}

/** 立即冲刷所有待写入的 key */
export function flushPendingWrites(): void {
  Array.from(pending.keys()).forEach(flushKey);
}

let listenersBound = false;
function bindFlushListeners(): void {
  if (listenersBound || typeof window === 'undefined') return;
  listenersBound = true;
  window.addEventListener('pagehide', flushPendingWrites);
  window.addEventListener('beforeunload', flushPendingWrites);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushPendingWrites();
  });
}

export const idbStorage: StateStorage = {
  async getItem(name: string): Promise<string | null> {
    bindFlushListeners();
    // 若该 key 尚有未落盘的值，优先返回它，避免读到旧数据
    const inFlight = pending.get(name);
    if (inFlight) return inFlight.value;
    return getItem(name);
  },

  setItem(name: string, value: string): void {
    bindFlushListeners();
    const existing = pending.get(name);
    if (existing) clearTimeout(existing.timer);
    const timer = setTimeout(() => flushKey(name), IDB_WRITE_DEBOUNCE_MS);
    pending.set(name, { timer, value });
  },

  async removeItem(name: string): Promise<void> {
    const existing = pending.get(name);
    if (existing) {
      clearTimeout(existing.timer);
      pending.delete(name);
    }
    await removeItem(name);
  },
};
