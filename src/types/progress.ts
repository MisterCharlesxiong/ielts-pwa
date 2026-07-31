import type { LevelId, ModuleId } from './common';

/** 单词三态 */
export type WordState = 'new' | 'learning' | 'mastered';

export interface AnswerRecord {
  questionId: string;
  given: string | string[];
  correct: boolean;
  /** epoch ms */
  answeredAt: number;
}

export interface WordsProgress {
  /** wordId → 三态 */
  states: Record<string, WordState>;
  /** 断点：上次停在第几张卡 */
  lastIndex: number;
}

export interface GrammarProgress {
  visitedIds: string[];
  answers: Record<string, AnswerRecord>;
  /** P1-03 */
  wrongIds: string[];
  lastPointId?: string;
}

export interface ReadingProgress {
  finishedIds: string[];
  /** P1-04 篇目 → 段落 index */
  paragraphCursor: Record<string, number>;
  /** P0-08 篇目 → 正确率 */
  accuracy: Record<string, { correct: number; total: number }>;
  lastPassageId?: string;
}

/** 写作本地批改报告 —— P0-10 */
export interface WritingReport {
  promptId: string;
  wordCount: number;
  paragraphCount: number;
  meetsMinWords: boolean;
  structure: {
    hasIntro: boolean;
    hasBody: boolean;
    hasConclusion: boolean;
    issues: string[];
  };
  connectives: { used: string[]; missing: string[] };
  patterns: { name: string; matched: boolean; hint: string }[];
  /** 0-100，纯规则分，UI 必须注明「仅供参考」 */
  ruleScore: number;
  /** epoch ms */
  generatedAt: number;
}

export interface WritingProgress {
  /** P1-05 草稿 */
  drafts: Record<string, { text: string; updatedAt: number }>;
  reports: Record<string, WritingReport>;
  lastPromptId?: string;
}

/** 跟读成绩 —— P0-13 双模式统一结构 */
export interface SpeakingScore {
  sentenceId: string;
  mode: 'auto' | 'manual';
  /** mode === 'auto' */
  recognizedText?: string;
  /** 0-1 */
  similarity?: number;
  /** 0-100，mode === 'auto' */
  score?: number;
  /** 1-5，mode === 'manual' */
  stars?: number;
  durationMs: number;
  /** epoch ms */
  createdAt: number;
}

export interface SpeakingProgress {
  /** sentenceId → 多次记录（P2-04 趋势） */
  scores: Record<string, SpeakingScore[]>;
  lastSentenceId?: string;
}

export interface QuizAttempt {
  quizId: string;
  startedAt: number;
  submittedAt: number;
  usedSec: number;
  totalScore: number;
  fullScore: number;
  /** sectionId → 分项得分 */
  bySection: Record<string, { score: number; full: number; title: string; moduleRef: ModuleId }>;
  answers: AnswerRecord[];
}

/** 错题本条目 —— P0-16 */
export interface WrongItem {
  level: LevelId;
  module: ModuleId;
  /** quizId / grammarPointId / passageId */
  sourceId: string;
  questionId: string;
  /** 题干摘要，便于错题本离开原内容包也能展示 */
  stem: string;
  wrongCount: number;
  lastWrongAt: number;
  /** 重练答对后置 true */
  cleared: boolean;
}

export interface QuizProgress {
  /** quizId → 多次作答 */
  attempts: Record<string, QuizAttempt[]>;
  /** P0-16 */
  wrongBook: WrongItem[];
  lastQuizId?: string;
}

export interface LevelProgress {
  words: WordsProgress;
  grammar: GrammarProgress;
  reading: ReadingProgress;
  writing: WritingProgress;
  speaking: SpeakingProgress;
  quiz: QuizProgress;
}

/**
 * 打卡状态 —— 口径：当日完成 ≥1 个模块动作才算打卡（见架构 §7.6）。
 * 打开 App / 切难度 / 播 TTS / 开关音乐 均不计。
 */
export interface CheckInState {
  streak: number;
  longestStreak: number;
  /** 'YYYY-MM-DD' 本地时区 */
  lastCheckInDate: string | null;
  /** 已打卡日期，最多保留 365 条 */
  history: string[];
  /** 当日动作计数，跨天归零 */
  todayActionCount: number;
  todayDate: string | null;
}

/** 背景音乐音轨 */
export type MusicTrack = 'rain' | 'white' | 'arpeggio';

/** 专注阅读底色 */
export type ReadingTheme = 'parchment' | 'night';

/** 专注阅读字号三档 */
export type ReadingFontSize = 17 | 18 | 20;
