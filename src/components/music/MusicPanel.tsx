import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import type { SegmentedOption } from '@/components/ui/SegmentedControl';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import type { MusicTrack } from '@/types';

export interface MusicPanelProps {
  open: boolean;
  onClose: () => void;
}

const TRACK_OPTIONS: SegmentedOption<MusicTrack>[] = [
  { value: 'rain', label: '雨声' },
  { value: 'white', label: '白噪' },
  { value: 'arpeggio', label: '琶音' },
];

const TRACK_DESC: Record<MusicTrack, string> = {
  rain: '滤波噪声模拟细雨，适合长时间背单词。',
  white: '平滑白噪，遮蔽环境杂音，适合做题。',
  arpeggio: '五声音阶轻琶音，节奏舒缓，适合阅读。',
};

/**
 * 音乐面板：三档音轨 + 音量滑杆，改动即写入 IndexedDB（store 防抖 300ms）。
 * 全部声音由 Web Audio 实时合成，无任何音频文件，离线同样可用。
 */
export function MusicPanel({ open, onClose }: MusicPanelProps): JSX.Element {
  const { enabled, track, volume, toggle, setTrack, setVolume } = useBackgroundMusic();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="背景音乐"
      footer={
        <Button block variant="ghost" onClick={onClose}>
          完成
        </Button>
      }
    >
      <div className="flex flex-col gap-5 pb-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-base font-medium text-ink">{enabled ? '正在播放' : '已关闭'}</p>
            <p className="text-sm text-ink-soft">实时合成，无需下载音频</p>
          </div>
          {/* 开启动作必须由点击事件同步触发，才能通过 iOS 的自动播放策略 */}
          <Button variant={enabled ? 'ghost' : 'primary'} onClick={toggle}>
            {enabled ? '关闭' : '开启'}
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-ink-soft">音轨</p>
          <SegmentedControl
            options={TRACK_OPTIONS}
            value={track}
            onChange={setTrack}
            label="背景音轨"
            className="w-full"
          />
          <p className="text-sm leading-relaxed text-ink-soft">{TRACK_DESC[track]}</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-soft">音量</p>
            <span className="text-sm text-ink-soft">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(volume * 100)}
            onChange={(event) => setVolume(Number(event.target.value) / 100)}
            aria-label="背景音乐音量"
            className="h-11 w-full accent-[color:var(--primary-moss)]"
          />
        </div>
      </div>
    </Modal>
  );
}
