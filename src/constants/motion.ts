import type { Transition, Variants } from 'framer-motion';

/**
 * Framer Motion 统一动效预设。
 *
 * 硬约束：
 * - 所有动效时长 ≤300ms；
 * - 禁止无限循环装饰动画（耗电 + 干扰阅读）；
 * - 全局在 App.tsx 外层包 <MotionConfig reducedMotion="user">，
 *   系统开启「减弱动态效果」时 Framer 会自动把位移/缩放降级为透明度渐变。
 */

/** 弹性预设，稳定时间 ≈280ms */
export const SPRING: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 26,
  mass: 0.7,
};

/** 缓出预设，220ms */
export const EASE_OUT: Transition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
};

/** 更短的缓出，用于高频微交互（按钮按下等），140ms */
export const EASE_QUICK: Transition = {
  duration: 0.14,
  ease: [0.22, 1, 0.36, 1],
};

/** 页面/区块通用入场：上浮淡入 */
export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: EASE_OUT,
} as const;

/** 纯淡入淡出 */
export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: EASE_OUT,
} as const;

/**
 * 列表卡片依次入场。
 * stagger 上限 240ms，避免长列表末尾等待过久。
 */
export const cardEnter = (index: number) =>
  ({
    initial: { opacity: 0, y: 16, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { ...SPRING, delay: Math.min(index * 0.04, 0.24) },
  }) as const;

/** 单词卡翻牌 */
export const flipCard = { transition: SPRING } as const;

/** 底部抽屉弹窗 */
export const sheetVariants: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: SPRING },
  exit: { y: '100%', transition: EASE_OUT },
};

/** 遮罩 */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: EASE_OUT },
  exit: { opacity: 0, transition: EASE_QUICK },
};

/** Toast 从顶部落下 */
export const toastVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: SPRING },
  exit: { opacity: 0, y: -12, transition: EASE_QUICK },
};
