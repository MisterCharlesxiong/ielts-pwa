import { motion } from 'framer-motion';

import { SPRING } from '@/constants/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import type { Word } from '@/types';

export interface WordCardProps {
  word: Word;
  flipped: boolean;
  onFlip: () => void;
  /** 播放示范音；TTS 不可用时传 null 以隐藏按钮 */
  onSpeak: (() => void) | null;
  speaking?: boolean;
}

/**
 * 单词卡（P0-01 / P1-01 翻牌）。
 *
 * 正面：单词 + 音标；背面：释义 + 例句。
 * 长单词（如 environmentally / internationalization）用 `break-words` + 自适应字号，
 * 保证 375px 窄屏不撑破卡片。
 */
export function WordCard({ word, flipped, onFlip, onSpeak, speaking = false }: WordCardProps): JSX.Element {
  const reduced = useReducedMotion();
  // 超长单词降字号，避免窄屏溢出
  const termClass = word.term.length >= 15 ? 'text-2xl' : word.term.length >= 11 ? 'text-3xl' : 'text-4xl';

  const face =
    'absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-card border border-line bg-paper px-5 py-6 backface-hidden';

  return (
    <div className="relative h-[260px] w-full [perspective:1200px]">
      <motion.div
        className="preserve-3d relative h-full w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduced ? { duration: 0 } : SPRING}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        aria-label={flipped ? `${word.term} 释义，点击返回` : `${word.term}，点击查看释义`}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onFlip();
          }
        }}
      >
        {/* 正面 */}
        <div className={face}>
          <p className={cn('break-words text-center font-semibold text-ink', termClass)}>{word.term}</p>
          <p className="text-sm text-ink-soft">{word.phonetic}</p>
          {word.pos ? (
            <span className="rounded-full bg-moss-light px-2 py-0.5 text-xs text-moss-dark">{word.pos}</span>
          ) : null}

          {onSpeak ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSpeak();
              }}
              aria-label="播放示范发音"
              className={cn(
                'mt-1 flex min-h-tap min-w-tap items-center justify-center gap-2 rounded-full border px-4',
                speaking ? 'border-moss text-moss-dark' : 'border-line text-ink-soft',
              )}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 9v6h4l5 4V5L8 9H4z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path d="M16.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="text-sm">{speaking ? '播放中' : '听发音'}</span>
            </button>
          ) : null}

          <p className="absolute bottom-3 text-xs text-ink-soft">点击卡片看释义</p>
        </div>

        {/* 背面 */}
        <div className={cn(face, 'items-start justify-start [transform:rotateY(180deg)]')}>
          <p className="break-words text-lg font-semibold text-ink">{word.term}</p>
          <p className="text-base leading-relaxed text-ink">{word.meaningCn}</p>
          <div className="mt-1 w-full rounded-lg bg-parchment px-3 py-2">
            <p className="break-words text-sm leading-relaxed text-ink">{word.example}</p>
            {word.exampleCn ? <p className="mt-1 text-sm leading-relaxed text-ink-soft">{word.exampleCn}</p> : null}
          </div>
          {word.tags && word.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1 pt-1">
              {word.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-moss-light px-2 py-0.5 text-[11px] text-moss-dark">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
