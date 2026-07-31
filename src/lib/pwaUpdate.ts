/**
 * PWA 更新协调器。
 *
 * 【致命坑 #5】Service Worker 用 `registerType: 'autoUpdate'`，但**禁止自动 reload**：
 * 用户可能正在答题，静默刷新会丢作答。这里做三件事：
 *  1. main.tsx 注册 SW 后把 `updateSW` 回调交给本模块；
 *  2. 有新版本时通知订阅者（App.tsx）弹 Toast，由用户手势触发刷新；
 *  3. 提供 busy 闸门：作答中（QuizRunnerPage / ReadingFocusPage）挂起提示，
 *     退出作答后若仍有待更新则补提示。
 */

type UpdateSW = (reloadPage?: boolean) => Promise<void>;
type Listener = () => void;

let updateSW: UpdateSW | null = null;
let needRefresh = false;
let busyCount = 0;
const listeners = new Set<Listener>();

function emit(): void {
  listeners.forEach((fn) => fn());
}

/** main.tsx 在 registerSW 后调用，注入真正的更新函数 */
export function setUpdateSW(fn: UpdateSW): void {
  updateSW = fn;
}

/** registerSW 的 onNeedRefresh 回调里调用 */
export function markNeedRefresh(): void {
  needRefresh = true;
  emit();
}

/** 是否应当向用户展示「有新版本」提示（作答中不提示） */
export function shouldPromptUpdate(): boolean {
  return needRefresh && busyCount === 0;
}

/** 订阅状态变化，返回取消订阅函数 */
export function subscribeUpdate(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * 进入 / 退出「不可打断」场景（作答中）。
 * 组件挂载时 `setBusy(true)`，卸载时 `setBusy(false)`。用计数避免嵌套场景互相踩。
 */
export function setBusy(busy: boolean): void {
  busyCount = Math.max(0, busyCount + (busy ? 1 : -1));
  emit();
}

/** 用户点击「立即更新」——此处才允许 reload */
export async function applyUpdate(): Promise<void> {
  needRefresh = false;
  emit();
  if (updateSW) {
    await updateSW(true);
  } else {
    window.location.reload();
  }
}

/** 用户点「稍后」——本次会话不再提示 */
export function dismissUpdate(): void {
  needRefresh = false;
  emit();
}
