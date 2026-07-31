import type { LevelId, ModuleId } from './common';

/**
 * 所有内容包的统一信封 —— 同时也是 P2-01 的 JSON 导入规范。
 * 详见 docs/content-schema.md。
 */
export interface ContentPack<T> {
  /** 必须 === CONTENT_SCHEMA_VERSION */
  schemaVersion: number;
  level: LevelId;
  module: ModuleId;
  title: string;
  /** ISO 8601 */
  generatedAt: string;
  items: T[];
}

/** 题目类型：首版三种全部可离线判分 */
export type QuestionType = 'single' | 'boolean' | 'blank';

export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  stem: string;
  /** single 必填；boolean 由 UI 生成「对/错」；blank 不需要 */
  options?: QuestionOption[];
  /** single 存 option.key；boolean 存 'true'/'false'；blank 存 string[] 多个可接受答案 */
  answer: string | string[];
  explanation?: string;
  /** 默认 1 */
  points?: number;
  /** 测试卷中标记题目归属模块，用于分项统计 */
  moduleRef?: ModuleId;
}

/** M1 单词 —— P0-01 / P0-02 */
export interface Word {
  id: string;
  term: string;
  /** 如 /ɪnˈvaɪrənmənt/ */
  phonetic: string;
  /** n. / v. / adj. */
  pos?: string;
  meaningCn: string;
  example: string;
  exampleCn?: string;
  tags?: string[];
}

export interface GrammarExample {
  en: string;
  cn: string;
}

/** M2 语法 —— P0-04 / P0-05 */
export interface GrammarPoint {
  id: string;
  title: string;
  /** 纯文本 / 轻 markdown（仅 ** 与换行） */
  ruleText: string;
  examples: GrammarExample[];
  /** ≥3 题 */
  exercises: Question[];
}

export interface GlossaryEntry {
  term: string;
  meaningCn: string;
}

/** M3 阅读 —— P0-06 / P0-07 / P0-08（首版题型仅 single | boolean） */
export interface ReadingPassage {
  id: string;
  title: string;
  wordCount: number;
  estMinutes: number;
  /** 按段拆分，供 P1-04 段落级进度记忆 */
  paragraphs: string[];
  questions: Question[];
  /** P2-02 划词查词预留 */
  glossary?: GlossaryEntry[];
}

export interface AdvancedPattern {
  /** 如 '强调句' */
  name: string;
  /** 如 'It is ... that ...' */
  template: string;
  sample: string;
  /** 字符串形式的正则，运行时 new RegExp(regex, 'i') */
  regex?: string;
}

export interface ModelEssayParagraph {
  /** 'intro' | 'body1' | … 人读中文亦可 */
  role: string;
  en: string;
  cn?: string;
  /** 该段写作要点 */
  note?: string;
}

export interface ModelEssay {
  paragraphs: ModelEssayParagraph[];
}

/** M4 写作 —— P0-09 / P0-10 */
export interface WritingPrompt {
  id: string;
  taskType: 'task1' | 'task2' | 'general';
  prompt: string;
  /** 建议字数下限，如 150 / 250 */
  minWords: number;
  suggestedStructure: string[];
  /** 必须填实，否则批改无输出 */
  requiredConnectives: string[];
  advancedPatterns: AdvancedPattern[];
  /** 【P1 预留】首版可缺省，UI 渲染「范文即将上线」占位 */
  modelEssay?: ModelEssay;
}

/** M5 跟读 —— P0-11 / P0-12 / P0-13 */
export interface FollowReadSentence {
  id: string;
  text: string;
  translationCn?: string;
  ipa?: string;
  /** 默认 0.9 */
  speakRate?: number;
}

export interface QuizSection {
  id: string;
  title: string;
  /** 用于分项得分统计 */
  moduleRef: ModuleId;
  questions: Question[];
}

/** M6 随堂测试 —— P0-14 / P0-15 */
export interface Quiz {
  id: string;
  title: string;
  /** 计时上限（秒） */
  durationSec: number;
  sections: QuizSection[];
}

/** 模块 → 条目类型映射，使 useContent / contentLoader 可精确推导 */
export interface ContentItemMap {
  words: Word;
  grammar: GrammarPoint;
  reading: ReadingPassage;
  writing: WritingPrompt;
  speaking: FollowReadSentence;
  quiz: Quiz;
}

export type ContentItemOf<M extends ModuleId> = ContentItemMap[M];
export type ContentPackOf<M extends ModuleId> = ContentPack<ContentItemOf<M>>;
