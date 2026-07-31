import { useState } from 'react';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/cn';
import type { ModelEssay } from '@/types';

export interface ModelEssayCompareProps {
  /** 首版内容可缺省 —— 缺省时渲染「范文即将上线」占位 */
  modelEssay?: ModelEssay;
  /** 用户自己的作文，用于左右/上下对照 */
  userText: string;
  className?: string;
}

/**
 * 范文对照（P1-06）。
 *
 * 约定：`modelEssay` 为可选字段，缺省时不报错、不留白，
 * 统一渲染 EmptyState「范文即将上线」。
 */
export function ModelEssayCompare({ modelEssay, userText, className = '' }: ModelEssayCompareProps): JSX.Element {
  const [showMine, setShowMine] = useState(false);
  const [showCn, setShowCn] = useState(false);

  if (!modelEssay || modelEssay.paragraphs.length === 0) {
    return (
      <Card className={className}>
        <EmptyState
          icon="范"
          title="范文即将上线"
          desc="本题的参考范文正在打磨中，可先按上方结构提示自行组织成文。"
        />
      </Card>
    );
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">参考范文</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCn((prev) => !prev)}
            aria-pressed={showCn}
            className={cn(
              'min-h-tap rounded-full border px-3 text-xs',
              showCn ? 'border-moss bg-moss-light text-moss-dark' : 'border-line text-ink-soft',
            )}
          >
            译文
          </button>
          <button
            type="button"
            onClick={() => setShowMine((prev) => !prev)}
            aria-pressed={showMine}
            className={cn(
              'min-h-tap rounded-full border px-3 text-xs',
              showMine ? 'border-moss bg-moss-light text-moss-dark' : 'border-line text-ink-soft',
            )}
          >
            对照我的
          </button>
        </div>
      </div>

      {modelEssay.paragraphs.map((paragraph, index) => (
        <Card key={`${paragraph.role}-${index}`} className="flex flex-col gap-2">
          <span className="w-fit rounded-full bg-moss-light px-2 py-0.5 text-xs text-moss-dark">{paragraph.role}</span>
          <p className="read-body text-base text-ink">{paragraph.en}</p>
          {showCn && paragraph.cn ? <p className="text-sm leading-relaxed text-ink-soft">{paragraph.cn}</p> : null}
          {paragraph.note ? (
            <p className="rounded-card bg-parchment px-3 py-2 text-xs leading-relaxed text-ink-soft">
              写作要点：{paragraph.note}
            </p>
          ) : null}
        </Card>
      ))}

      {showMine ? (
        <Card className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-ink">我的作文</h3>
          {userText.trim() ? (
            <p className="read-body whitespace-pre-wrap text-sm text-ink-soft">{userText}</p>
          ) : (
            <p className="text-sm text-ink-soft">你还没有写内容。</p>
          )}
        </Card>
      ) : null}
    </div>
  );
}
