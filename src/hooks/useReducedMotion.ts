import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * 是否应减弱动态效果。
 *
 * 视觉动效由 App.tsx 的 `<MotionConfig reducedMotion="user">` 全局处理；
 * 本 hook 供**逻辑层**判断（如波形 rAF 循环、自动滚动）——返回 true 时应跳过。
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() === true;
}
