import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { WaveformCanvas } from '@/features/speaking/WaveformCanvas';
import { cn } from '@/lib/cn';

export interface RecorderControlsProps {
  supported: boolean;
  recording: boolean;
  /** 正在等待语音识别结果 */
  scoring: boolean;
  getAnalyser: () => AnalyserNode | null;
  onStart: () => void;
  onStop: () => void;
  error?: string | null;
  className?: string;
}

/**
 * 录音控制 + 实时波形（P0-12）。
 * 录音必须由用户手势启动，浏览器才会弹麦克风授权。
 */
export function RecorderControls({
  supported,
  recording,
  scoring,
  getAnalyser,
  onStart,
  onStop,
  error = null,
  className = '',
}: RecorderControlsProps): JSX.Element {
  if (!supported) {
    return (
      <Card className={cn('flex flex-col gap-2', className)}>
        <h2 className="text-base font-semibold text-ink">跟读录音</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          当前浏览器不支持录音，可以只听示范音跟读，并在下方直接自评打星。
        </p>
      </Card>
    );
  }

  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">跟读录音</h2>
        <span className={cn('text-xs', recording ? 'text-terra' : 'text-ink-soft')}>
          {recording ? '录音中…' : scoring ? '正在评分…' : '待开始'}
        </span>
      </div>

      <WaveformCanvas getAnalyser={getAnalyser} active={recording} />

      <Button block disabled={scoring} onClick={recording ? onStop : onStart}>
        {recording ? '停止并评分' : scoring ? '评分中…' : '开始跟读'}
      </Button>

      {error ? (
        <p className="rounded-card bg-parchment px-3 py-2 text-xs leading-relaxed text-ink-soft">{error}</p>
      ) : null}
    </Card>
  );
}
