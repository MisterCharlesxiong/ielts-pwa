import type { LevelId, ModuleId } from '@/types';

/** 单级内容量基线（PRD 4.10） */
export interface LevelCounts {
  words: number;
  grammar: number;
  reading: number;
  writing: number;
  speaking: number;
  quiz: number;
}

export interface LevelMeta {
  id: LevelId;
  /** 中文全名 */
  name: string;
  /** 卡片副标题 */
  desc: string;
  /** 内容 id 前缀，如 'jr' → jr-w-001 */
  idPrefix: string;
  order: number;
  counts: LevelCounts;
}

/** 六级统一内容量基线 */
export const LEVEL_COUNTS: LevelCounts = {
  words: 100,
  grammar: 8,
  reading: 4,
  writing: 3,
  speaking: 4,
  quiz: 4,
};

export const LEVELS: LevelMeta[] = [
  {
    id: 'junior',
    name: '初中',
    desc: '基础词汇与简单句，打牢地基',
    idPrefix: 'jr',
    order: 1,
    counts: LEVEL_COUNTS,
  },
  {
    id: 'senior',
    name: '高中',
    desc: '高频学术词与复合句式',
    idPrefix: 'sr',
    order: 2,
    counts: LEVEL_COUNTS,
  },
  {
    id: 'college',
    name: '大学',
    desc: '四六级核心词与论述写作',
    idPrefix: 'col',
    order: 3,
    counts: LEVEL_COUNTS,
  },
  {
    id: 'ielts55',
    name: '雅思 5.5',
    desc: '雅思入门，稳拿基础分',
    idPrefix: 'ie55',
    order: 4,
    counts: LEVEL_COUNTS,
  },
  {
    id: 'ielts65',
    name: '雅思 6.0-6.5',
    desc: '主流目标分，全面提速',
    idPrefix: 'ie65',
    order: 5,
    counts: LEVEL_COUNTS,
  },
  {
    id: 'ielts7plus',
    name: '雅思 7 分+',
    desc: '高阶表达与学术深读',
    idPrefix: 'ie7',
    order: 6,
    counts: LEVEL_COUNTS,
  },
];

export const LEVEL_IDS: LevelId[] = LEVELS.map((l) => l.id);

export const LEVEL_MAP: Record<LevelId, LevelMeta> = LEVELS.reduce(
  (acc, level) => {
    acc[level.id] = level;
    return acc;
  },
  {} as Record<LevelId, LevelMeta>,
);

/** 路由参数校验：把 string 收窄为 LevelId */
export function isLevelId(value: string | undefined): value is LevelId {
  return typeof value === 'string' && LEVEL_IDS.includes(value as LevelId);
}

/** 取难度中文名，未知时回落为原值 */
export function levelName(level: LevelId): string {
  return LEVEL_MAP[level]?.name ?? level;
}

/** 取某级某模块的内容量基线 */
export function levelCount(level: LevelId, module: ModuleId): number {
  return LEVEL_MAP[level]?.counts[module] ?? 0;
}
