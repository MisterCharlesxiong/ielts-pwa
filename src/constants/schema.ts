/**
 * Schema 版本与持久化常量。
 *
 * 两套版本号并存，各司其职：
 * - `DB_SCHEMA_VERSION`：Zustand persist 的 version，用于结构迁移（migrate 钩子）。
 * - `CONTENT_SCHEMA_VERSION`：内容包 JSON 的信封版本，用于内容结构大改时的业务级校验。
 */

/** 内容包信封版本，所有 src/content/**.json 的 schemaVersion 必须与之相等 */
export const CONTENT_SCHEMA_VERSION = 1;

/** 持久化状态版本，四个 store 的 persist.version */
export const DB_SCHEMA_VERSION = 1;

/** IndexedDB 数据库名 */
export const DB_NAME = 'ielts-pwa-db';

/** IndexedDB object store 名 */
export const DB_STORE_NAME = 'kv';

/** 四个 store 的持久化 key */
export const STORAGE_KEYS = {
  app: 'app-store',
  progress: 'progress-store',
  music: 'music-store',
  readingPref: 'reading-pref-store',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/** IndexedDB 写入防抖窗口（毫秒） */
export const IDB_WRITE_DEBOUNCE_MS = 300;

/** 写作草稿输入防抖窗口（毫秒） */
export const DRAFT_DEBOUNCE_MS = 800;

/** 打卡历史最多保留天数 */
export const CHECKIN_HISTORY_LIMIT = 365;
