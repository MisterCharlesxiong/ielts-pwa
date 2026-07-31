import type { LevelId, ModuleId } from '@/types';

export interface ModuleMeta {
  id: ModuleId;
  /** 中文名 */
  name: string;
  /** 单字图标（避免引入图标库） */
  icon: string;
  desc: string;
  /** 计入打卡的「模块动作」说明（架构 §7.6） */
  actionLabel: string;
}

export const MODULES: ModuleMeta[] = [
  { id: 'words', name: '单词', icon: '词', desc: '翻牌记忆 · TTS 示范', actionLabel: '标记记忆状态' },
  { id: 'grammar', name: '语法', icon: '法', desc: '规则例句 · 即时判分', actionLabel: '提交练习题' },
  { id: 'reading', name: '阅读', icon: '读', desc: '专注模式 · 理解题', actionLabel: '完成篇目答题' },
  { id: 'writing', name: '写作', icon: '写', desc: '草稿保存 · 本地批改', actionLabel: '完成本地批改' },
  { id: 'speaking', name: '跟读', icon: '说', desc: '录音对比 · 发音评分', actionLabel: '产生跟读成绩' },
  { id: 'quiz', name: '测试', icon: '测', desc: '计时套卷 · 错题重练', actionLabel: '成功交卷' },
];

export const MODULE_IDS: ModuleId[] = MODULES.map((m) => m.id);

export const MODULE_MAP: Record<ModuleId, ModuleMeta> = MODULES.reduce(
  (acc, mod) => {
    acc[mod.id] = mod;
    return acc;
  },
  {} as Record<ModuleId, ModuleMeta>,
);

export function isModuleId(value: string | undefined): value is ModuleId {
  return typeof value === 'string' && MODULE_IDS.includes(value as ModuleId);
}

export function moduleName(module: ModuleId): string {
  return MODULE_MAP[module]?.name ?? module;
}

/** 模块入口路由 */
export function modulePath(level: LevelId, module: ModuleId): string {
  return `/learn/${level}/${module}`;
}
