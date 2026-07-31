import type { LevelId, ModuleId } from '@/types';

/**
 * 内容包显式注册表（6 难度 × 6 模块 = 36 条）。
 *
 * 为什么必须显式列出而不能写 `() => import(\`./${level}/${module}.json\`)`：
 *   1. Vite / Rollup 只能对**字面量**路径做静态分析，模板字符串会退化为
 *      「把整个目录打进一个 chunk」甚至直接放弃分包；
 *   2. vite-plugin-pwa 生成 precache 清单时同样依赖静态图，动态拼接会导致
 *      内容包不进预缓存 → 离线首次进入某模块直接空白（违反 PRD 离线可用）。
 *
 * 新增内容的唯一步骤：在下方对应难度里加一行。
 *
 * 注意：这里的 JSON 由 `node scripts/gen-content.mjs` 生成，
 * 不要手工编辑 `src/content/<level>/<module>.json`，否则下次生成会被覆盖。
 */

/** 单个内容包的懒加载器；返回值交由 contentLoader 用 validateContentPack 校验 */
export type ContentModuleLoader = () => Promise<{ default: unknown }>;

export type ContentRegistry = Record<LevelId, Record<ModuleId, ContentModuleLoader>>;

export const CONTENT_REGISTRY: ContentRegistry = {
  junior: {
    words: () => import('./junior/words.json'),
    grammar: () => import('./junior/grammar.json'),
    reading: () => import('./junior/reading.json'),
    writing: () => import('./junior/writing.json'),
    speaking: () => import('./junior/speaking.json'),
    quiz: () => import('./junior/quiz.json'),
  },
  senior: {
    words: () => import('./senior/words.json'),
    grammar: () => import('./senior/grammar.json'),
    reading: () => import('./senior/reading.json'),
    writing: () => import('./senior/writing.json'),
    speaking: () => import('./senior/speaking.json'),
    quiz: () => import('./senior/quiz.json'),
  },
  college: {
    words: () => import('./college/words.json'),
    grammar: () => import('./college/grammar.json'),
    reading: () => import('./college/reading.json'),
    writing: () => import('./college/writing.json'),
    speaking: () => import('./college/speaking.json'),
    quiz: () => import('./college/quiz.json'),
  },
  ielts55: {
    words: () => import('./ielts55/words.json'),
    grammar: () => import('./ielts55/grammar.json'),
    reading: () => import('./ielts55/reading.json'),
    writing: () => import('./ielts55/writing.json'),
    speaking: () => import('./ielts55/speaking.json'),
    quiz: () => import('./ielts55/quiz.json'),
  },
  ielts65: {
    words: () => import('./ielts65/words.json'),
    grammar: () => import('./ielts65/grammar.json'),
    reading: () => import('./ielts65/reading.json'),
    writing: () => import('./ielts65/writing.json'),
    speaking: () => import('./ielts65/speaking.json'),
    quiz: () => import('./ielts65/quiz.json'),
  },
  ielts7plus: {
    words: () => import('./ielts7plus/words.json'),
    grammar: () => import('./ielts7plus/grammar.json'),
    reading: () => import('./ielts7plus/reading.json'),
    writing: () => import('./ielts7plus/writing.json'),
    speaking: () => import('./ielts7plus/speaking.json'),
    quiz: () => import('./ielts7plus/quiz.json'),
  },
};

/** 该难度下已注册的模块列表（供设置页 / 内容体检使用） */
export function registeredModules(level: LevelId): ModuleId[] {
  return Object.keys(CONTENT_REGISTRY[level]) as ModuleId[];
}
