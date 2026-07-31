import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { LEVEL_IDS, levelCount } from '@/constants/levels';
import { DB_SCHEMA_VERSION, STORAGE_KEYS } from '@/constants/schema';
import { idbStorage } from '@/lib/zustandIdbStorage';
import type {
  AnswerRecord,
  LevelId,
  LevelProgress,
  ModuleId,
  QuizAttempt,
  SpeakingScore,
  WordState,
  WritingReport,
  WrongItem,
} from '@/types';

/**
 * 六级 × 六模块进度树。数据量最大、变更频率中等，
 * 写盘由 zustandIdbStorage 的 300ms 防抖兜底。
 */

export function createEmptyLevelProgress(): LevelProgress {
  return {
    words: { states: {}, lastIndex: 0 },
    grammar: { visitedIds: [], answers: {}, wrongIds: [] },
    reading: { finishedIds: [], paragraphCursor: {}, accuracy: {} },
    writing: { drafts: {}, reports: {} },
    speaking: { scores: {} },
    quiz: { attempts: {}, wrongBook: [] },
  };
}

export function createEmptyProgressTree(): Record<LevelId, LevelProgress> {
  return LEVEL_IDS.reduce(
    (acc, id) => {
      acc[id] = createEmptyLevelProgress();
      return acc;
    },
    {} as Record<LevelId, LevelProgress>,
  );
}

export interface WrongItemInput {
  level: LevelId;
  module: ModuleId;
  sourceId: string;
  questionId: string;
  stem: string;
}

export interface ProgressStoreState {
  schemaVersion: number;
  byLevel: Record<LevelId, LevelProgress>;
  hasHydrated: boolean;

  setWordState(level: LevelId, wordId: string, state: WordState): void;
  setWordIndex(level: LevelId, index: number): void;
  recordAnswer(level: LevelId, module: ModuleId, sourceId: string, record: AnswerRecord): void;
  setReadingCursor(level: LevelId, passageId: string, paragraphIndex: number): void;
  finishReading(level: LevelId, passageId: string, correct: number, total: number): void;
  saveDraft(level: LevelId, promptId: string, text: string): void;
  saveWritingReport(level: LevelId, report: WritingReport): void;
  addSpeakingScore(level: LevelId, score: SpeakingScore): void;
  submitQuiz(level: LevelId, attempt: QuizAttempt): void;
  addWrongItem(input: WrongItemInput): void;
  clearWrongItem(level: LevelId, questionId: string): void;
  removeWrongItem(level: LevelId, questionId: string): void;
  /** 0-1，进度矩阵与难度卡片用 */
  getModuleCompletion(level: LevelId, module: ModuleId): number;
  setHasHydrated(value: boolean): void;
}

type PersistedProgress = Pick<ProgressStoreState, 'schemaVersion' | 'byLevel'>;

/** 不可变地更新某一级的进度，缺失时自动补默认结构 */
function updateLevel(
  tree: Record<LevelId, LevelProgress>,
  level: LevelId,
  updater: (progress: LevelProgress) => LevelProgress,
): Record<LevelId, LevelProgress> {
  const current = tree[level] ?? createEmptyLevelProgress();
  return { ...tree, [level]: updater(current) };
}

export const useProgressStore = create<ProgressStoreState>()(
  persist(
    (set, get) => ({
      schemaVersion: DB_SCHEMA_VERSION,
      byLevel: createEmptyProgressTree(),
      hasHydrated: false,

      setWordState: (level, wordId, state) =>
        set((s) => ({
          byLevel: updateLevel(s.byLevel, level, (p) => ({
            ...p,
            words: { ...p.words, states: { ...p.words.states, [wordId]: state } },
          })),
        })),

      setWordIndex: (level, index) =>
        set((s) => ({
          byLevel: updateLevel(s.byLevel, level, (p) => ({
            ...p,
            words: { ...p.words, lastIndex: Math.max(0, index) },
          })),
        })),

      recordAnswer: (level, module, sourceId, record) =>
        set((s) => ({
          byLevel: updateLevel(s.byLevel, level, (p) => {
            if (module === 'grammar') {
              const wrongIds = record.correct
                ? p.grammar.wrongIds.filter((id) => id !== record.questionId)
                : Array.from(new Set([...p.grammar.wrongIds, record.questionId]));
              return {
                ...p,
                grammar: {
                  ...p.grammar,
                  visitedIds: Array.from(new Set([...p.grammar.visitedIds, sourceId])),
                  answers: { ...p.grammar.answers, [record.questionId]: record },
                  wrongIds,
                  lastPointId: sourceId,
                },
              };
            }
            if (module === 'reading') {
              return { ...p, reading: { ...p.reading, lastPassageId: sourceId } };
            }
            return p;
          }),
        })),

      setReadingCursor: (level, passageId, paragraphIndex) =>
        set((s) => {
          const current = s.byLevel[level]?.reading.paragraphCursor[passageId] ?? -1;
          if (current >= paragraphIndex) return s; // 只前进不后退，避免回滚滚动位置
          return {
            byLevel: updateLevel(s.byLevel, level, (p) => ({
              ...p,
              reading: {
                ...p.reading,
                paragraphCursor: { ...p.reading.paragraphCursor, [passageId]: paragraphIndex },
                lastPassageId: passageId,
              },
            })),
          };
        }),

      finishReading: (level, passageId, correct, total) =>
        set((s) => ({
          byLevel: updateLevel(s.byLevel, level, (p) => ({
            ...p,
            reading: {
              ...p.reading,
              finishedIds: Array.from(new Set([...p.reading.finishedIds, passageId])),
              accuracy: { ...p.reading.accuracy, [passageId]: { correct, total } },
              lastPassageId: passageId,
            },
          })),
        })),

      saveDraft: (level, promptId, text) =>
        set((s) => ({
          byLevel: updateLevel(s.byLevel, level, (p) => ({
            ...p,
            writing: {
              ...p.writing,
              drafts: { ...p.writing.drafts, [promptId]: { text, updatedAt: Date.now() } },
              lastPromptId: promptId,
            },
          })),
        })),

      saveWritingReport: (level, report) =>
        set((s) => ({
          byLevel: updateLevel(s.byLevel, level, (p) => ({
            ...p,
            writing: {
              ...p.writing,
              reports: { ...p.writing.reports, [report.promptId]: report },
              lastPromptId: report.promptId,
            },
          })),
        })),

      addSpeakingScore: (level, score) =>
        set((s) => ({
          byLevel: updateLevel(s.byLevel, level, (p) => {
            const existing = p.speaking.scores[score.sentenceId] ?? [];
            return {
              ...p,
              speaking: {
                ...p.speaking,
                // 每句最多保留最近 20 次，防止 IndexedDB 无限膨胀
                scores: { ...p.speaking.scores, [score.sentenceId]: [...existing, score].slice(-20) },
                lastSentenceId: score.sentenceId,
              },
            };
          }),
        })),

      submitQuiz: (level, attempt) =>
        set((s) => ({
          byLevel: updateLevel(s.byLevel, level, (p) => {
            const existing = p.quiz.attempts[attempt.quizId] ?? [];
            return {
              ...p,
              quiz: {
                ...p.quiz,
                attempts: { ...p.quiz.attempts, [attempt.quizId]: [...existing, attempt].slice(-10) },
                lastQuizId: attempt.quizId,
              },
            };
          }),
        })),

      addWrongItem: (input) =>
        set((s) => ({
          byLevel: updateLevel(s.byLevel, input.level, (p) => {
            const index = p.quiz.wrongBook.findIndex((w) => w.questionId === input.questionId);
            const now = Date.now();
            let wrongBook: WrongItem[];
            if (index >= 0) {
              wrongBook = p.quiz.wrongBook.map((w, i) =>
                i === index ? { ...w, wrongCount: w.wrongCount + 1, lastWrongAt: now, cleared: false } : w,
              );
            } else {
              wrongBook = [
                ...p.quiz.wrongBook,
                { ...input, wrongCount: 1, lastWrongAt: now, cleared: false },
              ];
            }
            return { ...p, quiz: { ...p.quiz, wrongBook } };
          }),
        })),

      clearWrongItem: (level, questionId) =>
        set((s) => ({
          byLevel: updateLevel(s.byLevel, level, (p) => ({
            ...p,
            quiz: {
              ...p.quiz,
              wrongBook: p.quiz.wrongBook.map((w) => (w.questionId === questionId ? { ...w, cleared: true } : w)),
            },
          })),
        })),

      removeWrongItem: (level, questionId) =>
        set((s) => ({
          byLevel: updateLevel(s.byLevel, level, (p) => ({
            ...p,
            quiz: { ...p.quiz, wrongBook: p.quiz.wrongBook.filter((w) => w.questionId !== questionId) },
          })),
        })),

      getModuleCompletion: (level, module) => {
        const progress = get().byLevel[level];
        if (!progress) return 0;
        const total = levelCount(level, module);
        if (total <= 0) return 0;
        let done = 0;
        switch (module) {
          case 'words':
            done = Object.values(progress.words.states).filter((s) => s === 'mastered').length;
            break;
          case 'grammar':
            done = progress.grammar.visitedIds.length;
            break;
          case 'reading':
            done = progress.reading.finishedIds.length;
            break;
          case 'writing':
            done = Object.keys(progress.writing.reports).length;
            break;
          case 'speaking':
            done = Object.keys(progress.speaking.scores).length;
            break;
          case 'quiz':
            done = Object.keys(progress.quiz.attempts).length;
            break;
          default:
            done = 0;
        }
        return Math.min(1, done / total);
      },

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: STORAGE_KEYS.progress,
      version: DB_SCHEMA_VERSION,
      storage: createJSONStorage(() => idbStorage),
      partialize: (state): PersistedProgress => ({
        schemaVersion: state.schemaVersion,
        byLevel: state.byLevel,
      }),
      merge: (persisted, current) => {
        // 补齐可能缺失的难度键，避免旧数据新增难度后取到 undefined
        const incoming = persisted as Partial<PersistedProgress> | undefined;
        const byLevel = { ...createEmptyProgressTree(), ...(incoming?.byLevel ?? {}) };
        return { ...current, ...incoming, byLevel };
      },
      migrate: (persisted, version) => {
        if (version !== DB_SCHEMA_VERSION) {
          console.info(`[store] progress-store 从 v${version} 迁移到 v${DB_SCHEMA_VERSION}（首版无结构变更）`);
        }
        return persisted as PersistedProgress;
      },
      onRehydrateStorage: () => (_state, error) => {
        if (error) console.warn('[store] progress-store 读取失败，使用默认值', error);
        useProgressStore.setState({ hasHydrated: true });
      },
    },
  ),
);
