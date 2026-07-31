import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { toast } from '@/components/ui/Toast';
import { isLevelId, levelName } from '@/constants/levels';
import { modulePath } from '@/constants/modules';
import { ReadingControls } from '@/features/reading/ReadingControls';
import { ReadingQuestions } from '@/features/reading/ReadingQuestions';
import { useContent } from '@/hooks/useContent';
import { cn } from '@/lib/cn';
import { setBusy } from '@/lib/pwaUpdate';
import { useAppStore } from '@/store/useAppStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useReadingPrefStore } from '@/store/useReadingPrefStore';
import type { Question, ReadingFontSize } from '@/types';

/** 字号三档 → Tailwind 阅读字号类（行高恒定 1.9） */
const FONT_CLASS: Record<ReadingFontSize, string> = {
  17: 'text-read-s',
  18: 'text-read-m',
  20: 'text-read-l',
};

/**
 * 专注阅读（P0-07 / P0-08 / P1-04）。
 *
 * - 路由 handle.chrome === false，本页不渲染 TopBar / BottomNav，全屏沉浸；
 * - 挂载即 `setBusy(true)`，作答中不弹「有新版本」提示（致命坑 #5）；
 * - 段落游标由 IntersectionObserver 记录，store 内部只前进不后退，避免回滚。
 */
export function ReadingFocusPage(): JSX.Element {
  const params = useParams<{ level: string; passageId: string }>();
  const navigate = useNavigate();
  const level = isLevelId(params.level) ? params.level : null;
  const passageId = params.passageId ?? '';

  const { data, loading, error } = useContent(level, 'reading');
  const passage = useMemo(
    () => data?.items.find((item) => item.id === passageId) ?? null,
    [data, passageId],
  );

  const theme = useReadingPrefStore((s) => s.theme);
  const setTheme = useReadingPrefStore((s) => s.setTheme);
  const fontSize = useReadingPrefStore((s) => s.fontSize);
  const setFontSize = useReadingPrefStore((s) => s.setFontSize);

  const savedCursor = useProgressStore((s) =>
    level ? (s.byLevel[level]?.reading.paragraphCursor[passageId] ?? 0) : 0,
  );
  const finishedIds = useProgressStore((s) => (level ? (s.byLevel[level]?.reading.finishedIds ?? []) : []));
  const setReadingCursor = useProgressStore((s) => s.setReadingCursor);
  const finishReading = useProgressStore((s) => s.finishReading);
  const recordAnswer = useProgressStore((s) => s.recordAnswer);
  const addWrongItem = useProgressStore((s) => s.addWrongItem);
  const clearWrongItem = useProgressStore((s) => s.clearWrongItem);
  const recordAction = useAppStore((s) => s.recordAction);

  const [controlsOpen, setControlsOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  /** 只在首次进入时提示一次「继续上次位置」，避免读到一半反复弹 */
  const [resumeHint, setResumeHint] = useState(0);
  const [resumeConsumed, setResumeConsumed] = useState(false);

  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const questionsRef = useRef<HTMLDivElement | null>(null);

  // 【致命坑 #5】阅读作答期间挂起更新提示
  useEffect(() => {
    setBusy(true);
    return () => setBusy(false);
  }, []);

  // 首次拿到进度时决定是否展示「继续上次位置」
  useEffect(() => {
    if (resumeConsumed || !passage) return;
    setResumeConsumed(true);
    if (savedCursor > 0 && savedCursor < passage.paragraphs.length) {
      setResumeHint(savedCursor);
      setCursor(savedCursor);
    }
  }, [resumeConsumed, passage, savedCursor]);

  // 段落级进度：可见段落中取最大 index 上报
  useEffect(() => {
    if (!passage || !level) return undefined;
    const nodes = paragraphRefs.current.filter((node): node is HTMLParagraphElement => node !== null);
    if (nodes.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxIndex = -1;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const raw = entry.target.getAttribute('data-index');
          const index = raw === null ? -1 : Number.parseInt(raw, 10);
          if (Number.isFinite(index) && index > maxIndex) maxIndex = index;
        });
        if (maxIndex < 0) return;
        setCursor((prev) => (maxIndex > prev ? maxIndex : prev));
        setReadingCursor(level, passage.id, maxIndex);
      },
      { threshold: 0.5 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [passage, level, setReadingCursor]);

  const scrollToParagraph = useCallback((index: number) => {
    const node = paragraphRefs.current[index];
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleAnswer = useCallback(
    (question: Question, given: string, correct: boolean) => {
      if (!level || !passage) return;
      recordAnswer(level, 'reading', passage.id, {
        questionId: question.id,
        given,
        correct,
        answeredAt: Date.now(),
      });
      if (correct) {
        clearWrongItem(level, question.id);
      } else {
        addWrongItem({
          level,
          module: 'reading',
          sourceId: passage.id,
          questionId: question.id,
          stem: question.stem,
        });
      }
    },
    [level, passage, recordAnswer, addWrongItem, clearWrongItem],
  );

  const handleAllAnswered = useCallback(
    (correct: number, total: number) => {
      if (!level || !passage) return;
      finishReading(level, passage.id, correct, total);
      recordAction({
        level,
        module: 'reading',
        route: `${modulePath(level, 'reading')}/${passage.id}`,
        itemId: passage.id,
        label: `${levelName(level)} · 阅读《${passage.title}》`,
      });
      toast(`本篇完成，答对 ${correct}/${total}`, 'success');
    },
    [level, passage, finishReading, recordAction],
  );

  const exit = useCallback(() => {
    if (level) navigate(modulePath(level, 'reading'));
    else navigate('/levels');
  }, [level, navigate]);

  const shellClass = cn('min-h-dvh w-full bg-paper', theme === 'night' && 'theme-night');

  if (loading) {
    return (
      <div className={shellClass}>
        <div className="mx-auto flex w-full max-w-app flex-col gap-3 px-4 py-6">
          <div className="h-8 w-2/3 rounded-card bg-line" />
          <div className="h-4 w-full rounded bg-line" />
          <div className="h-4 w-full rounded bg-line" />
          <div className="h-4 w-5/6 rounded bg-line" />
        </div>
      </div>
    );
  }

  if (!level || error || !passage) {
    return (
      <div className={shellClass}>
        <div className="mx-auto w-full max-w-app px-4 py-6">
          <EmptyState
            icon="读"
            title="找不到这篇文章"
            desc={error ?? '篇目可能已更新，请返回列表重新选择。'}
            action={<Button onClick={exit}>返回阅读列表</Button>}
          />
        </div>
      </div>
    );
  }

  const total = passage.paragraphs.length;
  const ratio = total === 0 ? 0 : Math.min(1, (cursor + 1) / total);
  const finished = finishedIds.includes(passage.id);

  return (
    <div className={shellClass}>
      <div className="mx-auto w-full max-w-app">
        {/* 极简顶栏：退出 + 阅读设置，不使用全局 TopBar */}
        <header className="sticky top-0 z-20 bg-paper/95 px-4 pb-2 pt-[calc(8px+env(safe-area-inset-top))] backdrop-blur">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={exit}
              aria-label="退出专注阅读"
              className="flex min-h-tap min-w-tap items-center text-sm text-ink-soft"
            >
              退出
            </button>
            <span className="truncate px-2 text-sm text-ink-soft">
              {cursor + 1}/{total} 段
            </span>
            <button
              type="button"
              onClick={() => setControlsOpen(true)}
              aria-label="阅读设置"
              className="flex min-h-tap min-w-tap items-center justify-end text-base font-semibold text-ink-soft"
            >
              Aa
            </button>
          </div>
          <ProgressBar value={ratio} height={3} className="mt-2" label="阅读进度" />
        </header>

        <article className="px-4 pb-10 pt-2">
          <h1 className="text-xl font-semibold leading-snug text-ink">{passage.title}</h1>
          <p className="mt-1 text-xs text-ink-soft">
            {levelName(level)} · {passage.wordCount} 词 · 约 {passage.estMinutes} 分钟
            {finished ? ' · 已完成' : ''}
          </p>

          {resumeHint > 0 ? (
            <button
              type="button"
              onClick={() => {
                scrollToParagraph(resumeHint);
                setResumeHint(0);
              }}
              className="mt-3 flex w-full min-h-tap items-center justify-between rounded-card border border-line bg-parchment px-3 text-sm text-ink"
            >
              <span>上次读到第 {resumeHint + 1} 段</span>
              <span className="text-moss-dark">继续</span>
            </button>
          ) : null}

          <div className={cn('mt-4 flex flex-col gap-4 font-serifRead text-ink', FONT_CLASS[fontSize])}>
            {passage.paragraphs.map((paragraph, index) => (
              <p
                key={`${passage.id}-p${index}`}
                data-index={index}
                ref={(node) => {
                  paragraphRefs.current[index] = node;
                }}
                className="read-body"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {passage.glossary && passage.glossary.length > 0 ? (
            <section className="mt-6 rounded-card border border-line bg-parchment p-4" aria-label="重点词汇">
              <h2 className="text-sm font-semibold text-ink">重点词汇</h2>
              <ul className="mt-2 flex flex-col gap-1">
                {passage.glossary.map((entry) => (
                  <li key={entry.term} className="text-sm leading-relaxed text-ink-soft">
                    <span className="font-medium text-ink">{entry.term}</span> — {entry.meaningCn}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div ref={questionsRef} className="mt-8">
            <ReadingQuestions
              passageId={passage.id}
              questions={passage.questions}
              onAnswer={handleAnswer}
              onAllAnswered={handleAllAnswered}
            />
          </div>

          <Button variant="ghost" block className="mt-8" onClick={exit}>
            返回阅读列表
          </Button>
        </article>
      </div>

      <Modal open={controlsOpen} onClose={() => setControlsOpen(false)} title="阅读设置">
        <ReadingControls
          theme={theme}
          onThemeChange={setTheme}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />
      </Modal>
    </div>
  );
}
