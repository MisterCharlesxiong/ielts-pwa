import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

export interface ABCompareProps {
  /** 我的录音 objectURL；null 表示还没录 */
  blobUrl: string | null;
  /** 示范音是否可播（TTS 可用性） */
  demoAvailable: boolean;
  demoPlaying: boolean;
  onPlayDemo: () => void;
  onStopDemo: () => void;
  className?: string;
}

/**
 * A/B 对比试听（P0-12）：示范音 ↔ 我的录音。
 * 录音只存内存 objectURL，不写 IndexedDB；播放器在 URL 变化时自动重载。
 */
export function ABCompare({
  blobUrl,
  demoAvailable,
  demoPlaying,
  onPlayDemo,
  onStopDemo,
  className = '',
}: ABCompareProps): JSX.Element {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [minePlaying, setMinePlaying] = useState(false);

  // URL 变化（重新录音）时复位播放状态
  useEffect(() => {
    setMinePlaying(false);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [blobUrl]);

  const playMine = (): void => {
    const audio = audioRef.current;
    if (!audio) return;
    onStopDemo(); // 避免两路声音叠在一起
    audio.currentTime = 0;
    void audio.play().catch(() => setMinePlaying(false));
  };

  const stopMine = (): void => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setMinePlaying(false);
  };

  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <h2 className="text-base font-semibold text-ink">对比试听</h2>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          block
          disabled={!demoAvailable}
          onClick={demoPlaying ? onStopDemo : onPlayDemo}
        >
          {demoPlaying ? '停止示范' : '听示范音'}
        </Button>
        <Button variant="ghost" block disabled={!blobUrl} onClick={minePlaying ? stopMine : playMine}>
          {minePlaying ? '停止播放' : '听我的'}
        </Button>
      </div>

      {blobUrl ? (
        <audio
          ref={audioRef}
          src={blobUrl}
          preload="metadata"
          onPlay={() => setMinePlaying(true)}
          onPause={() => setMinePlaying(false)}
          onEnded={() => setMinePlaying(false)}
          className="hidden"
        />
      ) : (
        <p className="text-xs leading-relaxed text-ink-soft">先录一段，就能和示范音来回对比了。</p>
      )}
    </Card>
  );
}
