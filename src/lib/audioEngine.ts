import { isAudioContextAvailable } from '@/lib/capability';
import type { MusicTrack } from '@/types';

/**
 * Web Audio 实时合成背景音乐引擎（单例）。
 *
 * 三档音轨全部实时合成，零音频文件：
 * - rain：白噪 → lowpass（缓慢扫频）→ 轻微 highpass，模拟雨声
 * - white：循环噪声 buffer + 温和 lowpass，柔化的白噪
 * - arpeggio：正弦振荡器按五声音阶琶音，长 attack/release 包络
 *
 * 【致命坑 #2】`AudioContext` 只能在**用户手势的同步调用栈内**创建 / resume。
 * 因此 `unlock()` 必须由 onClick 直接调用，禁止放在 await 之后或 setTimeout 里。
 */

const CROSSFADE_SEC = 0.2;
const VOLUME_SMOOTH_SEC = 0.08;
const NOISE_SECONDS = 3;

interface TrackHandle {
  output: GainNode;
  dispose(): void;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private current: { track: MusicTrack; handle: TrackHandle } | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private volume = 0.35;
  private hiddenDim = false;
  private visibilityBound = false;

  /** 引擎是否已经被用户手势解锁过 */
  get unlocked(): boolean {
    return this.ctx !== null && this.ctx.state === 'running';
  }

  get available(): boolean {
    return isAudioContextAvailable();
  }

  /**
   * 在用户手势中同步创建并 resume AudioContext。
   * 必须由 onClick 直接调用！
   */
  unlock(): boolean {
    if (!this.available) return false;
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? window.webkitAudioContext;
        if (!Ctor) return false;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0;
        this.master.connect(this.ctx.destination);
        this.bindVisibility();
      }
      if (this.ctx.state === 'suspended') {
        // 不 await：保持在同步栈内，iOS 才会认这次手势
        void this.ctx.resume().catch(() => undefined);
      }
      // 播一段极短静音，进一步保证 iOS 解锁
      const silent = this.ctx.createBufferSource();
      silent.buffer = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
      silent.connect(this.ctx.destination);
      silent.start(0);
      return true;
    } catch (error) {
      console.warn('[audio] AudioContext 初始化失败，已隐藏音乐功能', error);
      return false;
    }
  }

  /** 播放指定音轨；若引擎未解锁则返回 false，调用方需先 unlock() */
  play(track: MusicTrack): boolean {
    if (!this.ctx || !this.master) return false;
    if (this.current?.track === track) {
      this.applyMasterGain();
      return true;
    }
    const next = this.createTrack(track);
    if (!next) return false;

    const now = this.ctx.currentTime;
    next.output.gain.cancelScheduledValues(now);
    next.output.gain.setValueAtTime(0, now);
    next.output.gain.linearRampToValueAtTime(1, now + CROSSFADE_SEC);

    const previous = this.current;
    if (previous) {
      const prevGain = previous.handle.output.gain;
      prevGain.cancelScheduledValues(now);
      prevGain.setValueAtTime(prevGain.value, now);
      prevGain.linearRampToValueAtTime(0, now + CROSSFADE_SEC);
      window.setTimeout(() => previous.handle.dispose(), CROSSFADE_SEC * 1000 + 120);
    }

    this.current = { track, handle: next };
    this.applyMasterGain();
    return true;
  }

  /** 停止播放（淡出后断开） */
  stop(): void {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + CROSSFADE_SEC);
    const previous = this.current;
    this.current = null;
    if (previous) {
      window.setTimeout(() => previous.handle.dispose(), CROSSFADE_SEC * 1000 + 120);
    }
  }

  /** 设置音量 0-1。用 setTargetAtTime 平滑，直接赋值会爆音 */
  setVolume(value: number): void {
    this.volume = Math.min(1, Math.max(0, value));
    this.applyMasterGain();
  }

  getVolume(): number {
    return this.volume;
  }

  isPlaying(): boolean {
    return this.current !== null;
  }

  private applyMasterGain(): void {
    if (!this.ctx || !this.master) return;
    const target = this.current && !this.hiddenDim ? this.volume : 0;
    this.master.gain.setTargetAtTime(target, this.ctx.currentTime, VOLUME_SMOOTH_SEC);
  }

  /**
   * 页面隐藏时把主增益渐降到 0（不 suspend，避免回来还要重新解锁）。
   */
  private bindVisibility(): void {
    if (this.visibilityBound || typeof document === 'undefined') return;
    this.visibilityBound = true;
    document.addEventListener('visibilitychange', () => {
      this.hiddenDim = document.visibilityState === 'hidden';
      this.applyMasterGain();
    });
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const length = ctx.sampleRate * NOISE_SECONDS;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // 粉噪近似（Voss-McCartney 简化版），比纯白噪更耐听
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.963 * b1 + white * 0.2965164;
      b2 = 0.57555 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.22;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  private createTrack(track: MusicTrack): TrackHandle | null {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return null;
    switch (track) {
      case 'rain':
        return this.createRain(ctx, master);
      case 'white':
        return this.createWhite(ctx, master);
      case 'arpeggio':
        return this.createArpeggio(ctx, master);
      default:
        return null;
    }
  }

  private createRain(ctx: AudioContext, master: GainNode): TrackHandle {
    const output = ctx.createGain();
    output.gain.value = 0;
    output.connect(master);

    const source = ctx.createBufferSource();
    source.buffer = this.getNoiseBuffer(ctx);
    source.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1400;
    lowpass.Q.value = 0.6;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 320;

    // 极慢的扫频 LFO，模拟雨势起伏（周期 ~23s，非视觉动画，不违反动效时长约束）
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.043;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 520;
    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);

    source.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(output);
    source.start(0);
    lfo.start(0);

    return {
      output,
      dispose: () => {
        try {
          source.stop();
          lfo.stop();
        } catch {
          /* ignore */
        }
        source.disconnect();
        lfo.disconnect();
        lfoGain.disconnect();
        highpass.disconnect();
        lowpass.disconnect();
        output.disconnect();
      },
    };
  }

  private createWhite(ctx: AudioContext, master: GainNode): TrackHandle {
    const output = ctx.createGain();
    output.gain.value = 0;
    output.connect(master);

    const source = ctx.createBufferSource();
    source.buffer = this.getNoiseBuffer(ctx);
    source.loop = true;

    const shelf = ctx.createBiquadFilter();
    shelf.type = 'lowpass';
    shelf.frequency.value = 5200;
    shelf.Q.value = 0.4;

    source.connect(shelf);
    shelf.connect(output);
    source.start(0);

    return {
      output,
      dispose: () => {
        try {
          source.stop();
        } catch {
          /* ignore */
        }
        source.disconnect();
        shelf.disconnect();
        output.disconnect();
      },
    };
  }

  private createArpeggio(ctx: AudioContext, master: GainNode): TrackHandle {
    const output = ctx.createGain();
    output.gain.value = 0;
    output.connect(master);

    const reverbish = ctx.createBiquadFilter();
    reverbish.type = 'lowpass';
    reverbish.frequency.value = 2200;
    reverbish.connect(output);

    // 五声音阶（C-D-E-G-A），柔和不刺耳
    const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
    const stepSec = 1.1;
    let index = 0;
    let disposed = false;

    const playNote = (): void => {
      if (disposed) return;
      const freq = notes[index % notes.length] ?? 329.63;
      index += 1;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const env = ctx.createGain();
      const now = ctx.currentTime;
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(0.16, now + 0.5); // 长 attack
      env.gain.exponentialRampToValueAtTime(0.0008, now + stepSec * 2.4); // 长 release

      osc.connect(env);
      env.connect(reverbish);
      osc.start(now);
      osc.stop(now + stepSec * 2.5);
      osc.onended = () => {
        osc.disconnect();
        env.disconnect();
      };
    };

    playNote();
    const timer = window.setInterval(playNote, stepSec * 1000);

    return {
      output,
      dispose: () => {
        disposed = true;
        window.clearInterval(timer);
        reverbish.disconnect();
        output.disconnect();
      },
    };
  }
}

/** 全局单例：路由切换不重建 */
export const audioEngine = new AudioEngine();
