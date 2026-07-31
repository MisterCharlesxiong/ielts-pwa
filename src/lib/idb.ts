import { createStore, del, get, set } from 'idb-keyval';

import { DB_NAME, DB_STORE_NAME } from '@/constants/schema';

/**
 * IndexedDB 极简 KV 封装。
 *
 * Safari 无痕模式 / 存储配额耗尽时 IndexedDB 会直接抛错，
 * 这里统一 try-catch 并降级到内存 Map，保证应用不崩，只是刷新后丢进度；
 * UI 层可通过 `isStorageDegraded()` 在首页挂常驻提示。
 */

let customStore: ReturnType<typeof createStore> | null = null;
let degraded = false;
const memoryFallback = new Map<string, string>();

function getStore(): ReturnType<typeof createStore> | null {
  if (degraded) return null;
  if (customStore) return customStore;
  try {
    if (typeof indexedDB === 'undefined') {
      markDegraded('当前环境不支持 IndexedDB');
      return null;
    }
    customStore = createStore(DB_NAME, DB_STORE_NAME);
    return customStore;
  } catch (error) {
    markDegraded(error);
    return null;
  }
}

function markDegraded(reason: unknown): void {
  if (!degraded) {
    degraded = true;
    console.warn('[idb] IndexedDB 不可用，已降级为内存存储，进度将无法跨会话保存。', reason);
  }
}

/** 存储是否已降级为内存（UI 需提示用户） */
export function isStorageDegraded(): boolean {
  return degraded;
}

export async function getItem(key: string): Promise<string | null> {
  const store = getStore();
  if (!store) return memoryFallback.get(key) ?? null;
  try {
    const value = await get<string>(key, store);
    return value ?? null;
  } catch (error) {
    markDegraded(error);
    return memoryFallback.get(key) ?? null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  memoryFallback.set(key, value);
  const store = getStore();
  if (!store) return;
  try {
    await set(key, value, store);
  } catch (error) {
    markDegraded(error);
  }
}

export async function removeItem(key: string): Promise<void> {
  memoryFallback.delete(key);
  const store = getStore();
  if (!store) return;
  try {
    await del(key, store);
  } catch (error) {
    markDegraded(error);
  }
}
