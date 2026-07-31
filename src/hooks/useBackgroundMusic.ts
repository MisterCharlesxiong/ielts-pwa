import { useCallback, useEffect, useState } from 'react';

import { audioEngine } from '@/lib/audioEngine';
import { useMusicStore } from '@/store/useMusicStore';
import type { MusicTrack } from '@/types';

export interface UseBackgroundMusicResult {
  /** AudioContext 是否可用（不可用时应隐藏音乐入口） */
  available: boolean;
  enabled: boolean;
  track: MusicTrack;
  volume: number;
  onboarded: boolean;
  /** 引擎是否已被用户手势解锁 */
  unlocked: boolean;
  /**
   * 在用户手势的**同步调用栈**内解锁 AudioContext 并按当前偏好开始播放。
   * 必须由 onClick 直接调用，禁止放进 await 之后或 setTimeout 里（iOS 会拦截）。
   */
  unlock(): boolean;
  /** 开关音乐；开启时会自动解锁（同样需在点击同步栈内调用） */
  toggle(): void;
  setTrack(track: MusicTrack): void;
  setVolume(value: number): void;
  markOnboarded(): void;
}

/**
 * 背景音乐桥接层：把 useMusicStore 的偏好同步到 audioEngine 单例。
 */
export function useBackgroundMusic(): UseBackgroundMusicResult {
  const enabled = useMusicStore((s) => s.enabled);
  const track = useMusicStore((s) => s.track);
  const volume = useMusicStore((s) => s.volume);
  const onboarded = useMusicStore((s) => s.onboarded);
  const setEnabled = useMusicStore((s) => s.setEnabled);
  const setTrackState = useMusicStore((s) => s.setTrack);
  const setVolumeState = useMusicStore((s) => s.setVolume);
  const markOnboarded = useMusicStore((s) => s.markOnboarded);

  const [available] = useState<boolean>(() => audioEngine.available);
  const [unlocked, setUnlocked] = useState<boolean>(() => audioEngine.unlocked);

  // 偏好 → 引擎：音轨与开关
  useEffect(() => {
    if (!available || !unlocked) return;
    if (enabled) audioEngine.play(track);
    else audioEngine.stop();
  }, [available, unlocked, enabled, track]);

  // 偏好 → 引擎：音量（引擎内部用 setTargetAtTime 平滑，不会爆音）
  useEffect(() => {
    if (!available) return;
    audioEngine.setVolume(volume);
  }, [available, volume]);

  const unlock = useCallback((): boolean => {
    if (!available) return false;
    const ok = audioEngine.unlock();
    if (ok) setUnlocked(true);
    return ok;
  }, [available]);

  const toggle = useCallback(() => {
    if (!available) return;
    if (enabled) {
      setEnabled(false);
      audioEngine.stop();
      return;
    }
    // 开启：必须在当前同步栈内解锁
    const ok = audioEngine.unlock();
    if (!ok) return;
    setUnlocked(true);
    setEnabled(true);
    audioEngine.play(useMusicStore.getState().track);
  }, [available, enabled, setEnabled]);

  const setTrack = useCallback(
    (next: MusicTrack) => {
      setTrackState(next);
      if (available && audioEngine.unlocked && useMusicStore.getState().enabled) {
        audioEngine.play(next);
      }
    },
    [available, setTrackState],
  );

  const setVolume = useCallback(
    (value: number) => {
      setVolumeState(value);
    },
    [setVolumeState],
  );

  return {
    available,
    enabled,
    track,
    volume,
    onboarded,
    unlocked,
    unlock,
    toggle,
    setTrack,
    setVolume,
    markOnboarded,
  };
}
