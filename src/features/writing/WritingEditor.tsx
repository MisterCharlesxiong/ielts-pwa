import { useEffect, useMemo, useRef, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/cn';
import { formatRelative } from '@/lib/date';
import { countWords, splitParagraphs } from '@/lib/writingChecker';

export interface WritingEditorProps {
  /** 受控文本 */
  value: string;
  onChange: (value: string) => void;
  /** 防抖后触发持久化（P1-05 草稿自动保存） */
  onPersist: (value: string) => void;
  minWords: number;
  /** 上次草稿保存时间（epoch ms），0 表示尚未保存 */
  savedAt?: number;
  disabled?: boolean;
  className?: string;
}

/** 草稿写盘防抖，与 store 的 300ms IndexedDB 防抖叠加，避免逐字写库 */
const DRAFT_DEBOUNCE_MS = 800;

/**
 * 作文编辑器（P0-09 / P1-05）。
 * 实时字数与段落数、达标进度条、离开页面前兜底落盘。
 */
export function WritingEditor({
  value,
  onChange,
  onPersist,
  minWords,
  savedAt = 0,
  disabled = false,
  className = '',
}: WritingEditorProps): JSX.Element {
  const [focused, setFocused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const latestRef = useRef(value);
  const persistRef = useRef(onPersist);

  useEffect(() => {
    latestRef.current = value;
  }, [value]);

  useEffect(() => {
    persistRef.current = onPersist;
  }, [onPersist]);

  // 防抖落盘
  useEffect(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      persistRef.current(latestRef.current);
      timerRef.current = null;
    }, DRAFT_DEBOUNCE_MS);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [value]);

  // 卸载兜底：把最后一次输入写回，防止用户切页丢草稿
  useEffect(
    () => () => {
      persistRef.current(latestRef.current);
    },
    [],
  );

  const wordCount = useMemo(() => countWords(value), [value]);
  const paragraphCount = useMemo(() => splitParagraphs(value).length, [value]);
  const ratio = minWords <= 0 ? 1 : Math.min(1, wordCount / minWords);
  const reached = wordCount >= minWords;

  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">我的作文</h2>
        <span className={cn('text-sm', reached ? 'text-terra' : 'text-ink-soft')}>
          {wordCount} / {minWords} 词
        </span>
      </div>

      <ProgressBar value={ratio} celebrateOnFull={reached} label="字数进度" />

      <textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onPersist(latestRef.current);
        }}
        placeholder={'在这里写作文。用空行分段，例如：\n\nIn recent years, ...\n\nFirstly, ...\n\nIn conclusion, ...'}
        aria-label="作文正文"
        spellCheck={false}
        className={cn(
          'min-h-[280px] w-full resize-y rounded-card border bg-parchment px-3 py-3 text-base leading-relaxed text-ink',
          'placeholder:text-ink-soft focus:outline-none',
          focused ? 'border-moss' : 'border-line',
        )}
      />

      <div className="flex items-center justify-between text-xs text-ink-soft">
        <span>{paragraphCount} 段</span>
        <span>{savedAt > 0 ? `草稿已保存 · ${formatRelative(savedAt)}` : '草稿会自动保存到本机'}</span>
      </div>
    </Card>
  );
}
