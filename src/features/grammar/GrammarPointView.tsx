import { Card } from '@/components/ui/Card';
import type { GrammarPoint } from '@/types';

export interface GrammarPointViewProps {
  point: GrammarPoint;
  /** 播放例句；TTS 不可用时传 null */
  onSpeak: ((text: string) => void) | null;
}

/** 把轻量 markdown（仅 ** 加粗）转成片段，避免引入 markdown 解析库 */
function renderRuleText(text: string): JSX.Element {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, lineIndex) => (
        <p key={`${lineIndex}-${line.slice(0, 8)}`} className="text-base leading-relaxed text-ink">
          {line.split(/(\*\*[^*]+\*\*)/g).map((chunk, chunkIndex) => {
            if (chunk.startsWith('**') && chunk.endsWith('**') && chunk.length > 4) {
              return (
                <strong key={chunkIndex} className="font-semibold text-moss-dark">
                  {chunk.slice(2, -2)}
                </strong>
              );
            }
            return <span key={chunkIndex}>{chunk}</span>;
          })}
        </p>
      ))}
    </>
  );
}

/** 语法点：规则与例句同屏（P0-04）。 */
export function GrammarPointView({ point, onSpeak }: GrammarPointViewProps): JSX.Element {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-ink">{point.title}</h3>

      <div className="flex flex-col gap-1.5">{renderRuleText(point.ruleText)}</div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-ink-soft">例句</p>
        {point.examples.map((example, index) => (
          <div key={`${point.id}-ex-${index}`} className="rounded-lg bg-parchment px-3 py-2">
            <div className="flex items-start gap-2">
              <p className="flex-1 break-words text-base leading-relaxed text-ink">{example.en}</p>
              {onSpeak ? (
                <button
                  type="button"
                  onClick={() => onSpeak(example.en)}
                  aria-label="朗读例句"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft active:bg-moss-light"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 9v6h4l5 4V5L8 9H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : null}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{example.cn}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
