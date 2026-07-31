import { CONTENT_REGISTRY } from '@/content';
import { validateContentPack } from '@/content/schema';
import type { ContentItemOf, ContentPack, ContentPackOf, LevelId, ModuleId } from '@/types';

/**
 * 内容包加载器。
 *
 * 为什么用显式注册表而不是字符串拼接的 `import(\`./content/${level}/${module}.json\`)`：
 * Vite 无法对完全动态的路径做静态分析，会导致内容包不被分包 / 不进预缓存清单。
 * 注册表见 `src/content/index.ts`，新增内容只需加一行。
 */

const cache = new Map<string, ContentPack<unknown>>();
const inflight = new Map<string, Promise<ContentPack<unknown>>>();

function cacheKey(level: LevelId, module: ModuleId): string {
  return `${level}/${module}`;
}

function emptyPack<M extends ModuleId>(level: LevelId, module: M): ContentPackOf<M> {
  return {
    schemaVersion: 0,
    level,
    module,
    title: '',
    generatedAt: new Date(0).toISOString(),
    items: [],
  };
}

/**
 * 加载指定难度 + 模块的内容包。
 * 校验失败时 console.error 并返回 items 为空的包（页面渲染 EmptyState，不崩）。
 */
export async function load<M extends ModuleId>(level: LevelId, module: M): Promise<ContentPackOf<M>> {
  const key = cacheKey(level, module);
  const cached = cache.get(key);
  if (cached) return cached as ContentPackOf<M>;

  const running = inflight.get(key);
  if (running) return (await running) as ContentPackOf<M>;

  const loader = CONTENT_REGISTRY[level]?.[module];
  if (!loader) {
    console.error(`[content] 注册表中找不到 ${key}，请检查 src/content/index.ts`);
    return emptyPack(level, module);
  }

  const task = (async (): Promise<ContentPack<unknown>> => {
    try {
      const mod = await loader();
      const result = validateContentPack<ContentItemOf<M>>(mod.default, level, module);
      if (!result.ok) {
        console.error(`[content] ${result.error}`);
        return emptyPack(level, module);
      }
      if (result.warnings.length > 0) {
        console.warn(`[content] ${key} 存在 ${result.warnings.length} 处内容问题：`, result.warnings.slice(0, 10));
      }
      return result.pack;
    } catch (error) {
      console.error(`[content] 加载 ${key} 失败`, error);
      return emptyPack(level, module);
    }
  })();

  inflight.set(key, task);
  try {
    const pack = await task;
    cache.set(key, pack);
    return pack as ContentPackOf<M>;
  } finally {
    inflight.delete(key);
  }
}

/**
 * P2-01 导入接口：把外部 JSON 直接注入内存缓存，无需改代码即可扩充内容。
 * @returns 成功时返回内容包，失败时返回错误描述
 */
export function importPack(json: unknown): { ok: true; pack: ContentPack<unknown> } | { ok: false; error: string } {
  if (typeof json !== 'object' || json === null) {
    return { ok: false, error: '导入内容不是合法 JSON 对象' };
  }
  const record = json as Record<string, unknown>;
  const level = record.level as LevelId | undefined;
  const module = record.module as ModuleId | undefined;
  if (!level || !module) {
    return { ok: false, error: '导入内容缺少 level 或 module 字段' };
  }
  const result = validateContentPack<unknown>(json, level, module);
  if (!result.ok) return { ok: false, error: result.error };
  if (result.warnings.length > 0) {
    console.warn('[content] 导入内容存在告警：', result.warnings.slice(0, 10));
  }
  cache.set(cacheKey(level, module), result.pack);
  return { ok: true, pack: result.pack };
}

/** 清空内存缓存（内容热替换 / 测试用） */
export function clearContentCache(): void {
  cache.clear();
}

/** 同步读取已缓存的内容包，未加载时返回 null */
export function peek<M extends ModuleId>(level: LevelId, module: M): ContentPackOf<M> | null {
  return (cache.get(cacheKey(level, module)) as ContentPackOf<M> | undefined) ?? null;
}

export const contentLoader = { load, importPack, clearContentCache, peek };
