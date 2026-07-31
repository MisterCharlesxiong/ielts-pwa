/** 六级难度 */
export type LevelId =
  | 'junior' // 初中
  | 'senior' // 高中
  | 'college' // 大学
  | 'ielts55' // 雅思 5.5
  | 'ielts65' // 雅思 6.0-6.5
  | 'ielts7plus'; // 雅思 7 分+

/** 六大学习模块 */
export type ModuleId = 'words' | 'grammar' | 'reading' | 'writing' | 'speaking' | 'quiz';

/**
 * 断点续学指针（P0-18）。
 * 由 `useAppStore.recordAction()` 唯一写入。
 */
export interface ResumePointer {
  level: LevelId;
  module: ModuleId;
  /** 完整 hash 路由，如 '/learn/senior/reading/r3' */
  route: string;
  /** 具体条目（词 id / 篇目 id / 题 id） */
  itemId?: string;
  /** 序号，用于「12/100」展示 */
  itemIndex?: number;
  /** 人读标签，如 '高中 · 阅读 L3' */
  label: string;
  /** epoch ms */
  updatedAt: number;
}

/** 异步数据统一三态（useContent 等） */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
