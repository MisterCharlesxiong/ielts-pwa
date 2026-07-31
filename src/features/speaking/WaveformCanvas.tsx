import { useEffect, useRef } from 'react';

import { cn } from '@/lib/cn';

export interface WaveformCanvasProps {
  /** 取样源；返回 null 表示当前设备拿不到 AnalyserNode */
  getAnalyser: () => AnalyserNode | null;
  /** 是否正在录音；false 时停止 rAF 并清空画布 */
  active: boolean;
  height?: number;
  className?: string;
}

/** 从 CSS 变量取色，避免在 canvas 里裸写十六进制（全站配色单一真源） */
function readCssColor(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * 实时波形（P0-12）。
 *
 * 硬约束：rAF 句柄必须在依赖变化 / 组件卸载时 `cancelAnimationFrame`，
 * 否则离开页面后回调仍在跑，手机持续耗电。
 */
export function WaveformCanvas({
  getAnalyser,
  active,
  height = 72,
  className = '',
}: WaveformCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const getAnalyserRef = useRef(getAnalyser);

  useEffect(() => {
    getAnalyserRef.current = getAnalyser;
  }, [getAnalyser]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cssWidth = canvas.clientWidth || 320;
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    const lineColor = readCssColor('--primary-moss', '#6b8e6b');
    const baseColor = readCssColor('--line-soft', '#e6e1d6');

    const clear = (): void => {
      ctx.clearRect(0, 0, cssWidth, height);
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(cssWidth, height / 2);
      ctx.stroke();
    };

    if (!active) {
      clear();
      return undefined;
    }

    const buffer = new Uint8Array(2048);

    const draw = (): void => {
      const analyser = getAnalyserRef.current();
      if (!analyser) {
        clear();
        rafRef.current = window.requestAnimationFrame(draw);
        return;
      }

      const size = Math.min(buffer.length, analyser.fftSize);
      const slice = buffer.subarray(0, size);
      analyser.getByteTimeDomainData(slice);

      ctx.clearRect(0, 0, cssWidth, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = lineColor;
      ctx.beginPath();

      const step = cssWidth / size;
      for (let i = 0; i < size; i += 1) {
        // 128 为静音基线，归一化到 [-1, 1]
        const v = ((slice[i] ?? 128) - 128) / 128;
        const y = height / 2 + v * (height / 2 - 4);
        const x = i * step;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      rafRef.current = window.requestAnimationFrame(draw);
    };

    rafRef.current = window.requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [active, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ height }}
      className={cn('w-full rounded-card bg-parchment', className)}
      role="img"
      aria-label={active ? '录音波形' : '波形待机'}
    />
  );
}
