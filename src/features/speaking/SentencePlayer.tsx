import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import type { SegmentedOption } from '@/components/ui/SegmentedControl';
import { cn } from '@/lib/cn';
import type { FollowReadSentence } from '@/types';

export interface SentencePlayerProps {
  sentence: FollowReadSentence;
  /** TTS 是否可用；不可用时隐藏播放控件并给出说明 */
  available: boolean;
  speaking: boolean;
  rate: number;
  onRateChange: (rate: number) => void;
  looping: boolean;
  onLoopingChange: (value: boolean) => void;
  onPlay: () => void;
  onStop: () => void;
  className?: string;
}

const RATE_OPTIONS: SegmentedOption<number>[] = [
  { value: 0.7, label: '0.7×', ariaLabel: '语速 0.7 倍' },
  { value: 0.9, label: '0.9×', ariaLabel: '语速 0.9 倍' },
  { value: 1, label: '1.0×', ariaLabel: '语速 1 倍' },
];

/**
 * 示范音播放（P0-11）：SpeechSynthesis 朗读句子，支持慢速与循环。
 * 播 TTS **不算模块动作**，不参与打卡。
 */
export function SentencePlayer({
  sentence,
  available,
  speaking,
  rate,
  onRateChange,
  looping,
  onLoopingChange,
  onPlay,
  onStop,
  className = '',
}: SentencePlayerProps): JSX.Element {
  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <p className="read-body text-lg text-ink">{sentence.text}</p>

      {sentence.ipa ? <p className="text-sm text-ink-soft">{sentence.ipa}</p> : null}
      {sentence.translationCn ? (
        <p className="text-sm leading-relaxed text-ink-soft">{sentence.translationCn}</p>
      ) : null}

      {available ? (
        <>
          <div className="flex items-center gap-3">
            <Button block onClick={speaking ? onStop : onPlay}>
              {speaking ? '停止示范音' : '播放示范音'}
            </Button>
            <button
              type="button"
              onClick={() => onLoopingChange(!looping)}
              aria-pressed={looping}
              className={cn(
                'min-h-tap shrink-0 rounded-card border px-3 text-sm',
                looping ? 'border-moss bg-moss-light text-moss-dark' : 'border-line text-ink-soft',
              )}
            >
              循环
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="shrink-0 text-sm text-ink-soft">语速</span>
            <SegmentedControl options={RATE_OPTIONS} value={rate} onChange={onRateChange} label="示范音语速" dense />
          </div>
        </>
      ) : (
        <p className="rounded-card bg-parchment px-3 py-2 text-xs leading-relaxed text-ink-soft">
          当前浏览器不支持语音合成，暂无法播放示范音，你仍可按音标自行朗读并录音自评。
        </p>
      )}
    </Card>
  );
}
