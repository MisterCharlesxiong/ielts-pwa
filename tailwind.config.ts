import type { Config } from 'tailwindcss';

/**
 * 护眼设计 token 主题扩展。
 *
 * 硬约束：
 * 1. 全站禁止裸写十六进制色值，一律用这里声明的 token 类名
 *    （paper / parchment / night / ink / ink-soft / moss / terra / line）。
 * 2. `terra`（暖陶色）只允许用于正反馈：答对 / 达成打卡 / 解锁 / 继续学习主 CTA。
 * 3. 阅读行高恒定 1.9，字号仅 17 / 18 / 20 三档。
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--bg-paper)',
        parchment: 'var(--bg-parchment)',
        night: 'var(--bg-night)',
        ink: 'var(--text-ink)',
        'ink-soft': 'var(--text-ink-soft)',
        moss: {
          DEFAULT: 'var(--primary-moss)',
          dark: 'var(--primary-moss-dk)',
          light: 'var(--primary-moss-lt)',
        },
        terra: 'var(--accent-terra)',
        line: 'var(--line-soft)',
      },
      fontSize: {
        'read-s': ['17px', { lineHeight: '1.9' }],
        'read-m': ['18px', { lineHeight: '1.9' }],
        'read-l': ['20px', { lineHeight: '1.9' }],
      },
      lineHeight: {
        read: 'var(--lh-read)',
      },
      maxWidth: {
        app: '430px',
      },
      spacing: {
        'safe-b': 'env(safe-area-inset-bottom)',
        'safe-t': 'env(safe-area-inset-top)',
      },
      transitionDuration: {
        spring: 'var(--dur-spring)',
      },
      borderRadius: {
        card: '14px',
      },
      minHeight: {
        tap: '44px',
      },
      minWidth: {
        tap: '44px',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        serifRead: ['Georgia', '"Times New Roman"', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
