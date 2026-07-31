/**
 * 日期与时间工具。
 *
 * 硬约定（架构 §7.6 / §7.7）：
 * - 一切时间戳存 epoch ms，只在展示层格式化；
 * - 日期键一律用**本地时区** `YYYY-MM-DD`，禁止 UTC（否则半夜学习会算错天）。
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** 本地时区日期键 'YYYY-MM-DD' */
export function toDateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** 今天的日期键 */
export function todayKey(): string {
  return toDateKey(new Date());
}

/** epoch ms → 本地日期键 */
export function dateKeyFromEpoch(ms: number): string {
  return toDateKey(new Date(ms));
}

/** 日期键 → 本地 Date（当天 00:00） */
export function dateFromKey(key: string): Date {
  const [y, m, d] = key.split('-').map((s) => Number.parseInt(s, 10));
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

/** 日期键加减天数 */
export function addDays(key: string, delta: number): string {
  const date = dateFromKey(key);
  date.setDate(date.getDate() + delta);
  return toDateKey(date);
}

/** a 与 b 相差的自然天数（a - b） */
export function diffDays(a: string, b: string): number {
  return Math.round((dateFromKey(a).getTime() - dateFromKey(b).getTime()) / MS_PER_DAY);
}

/** candidate 是否恰好是 reference 的前一天 */
export function isPreviousDay(candidate: string, reference: string): boolean {
  return diffDays(reference, candidate) === 1;
}

/** 最近 n 天的日期键，从最早到今天 */
export function recentDateKeys(n: number, endKey: string = todayKey()): string[] {
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) keys.push(addDays(endKey, -i));
  return keys;
}

/** 'YYYY-MM-DD' → 'M月D日' */
export function formatDateCn(key: string): string {
  const parts = key.split('-');
  const m = Number.parseInt(parts[1] ?? '1', 10);
  const d = Number.parseInt(parts[2] ?? '1', 10);
  return `${m}月${d}日`;
}

/** 秒 → 'mm:ss' */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

/** epoch ms → 相对时间中文描述 */
export function formatRelative(ms: number, now: number = Date.now()): string {
  const delta = now - ms;
  if (delta < 60_000) return '刚刚';
  if (delta < 3_600_000) return `${Math.floor(delta / 60_000)} 分钟前`;
  const key = dateKeyFromEpoch(ms);
  const today = dateKeyFromEpoch(now);
  const dayGap = diffDays(today, key);
  if (dayGap === 0) return `今天 ${pad2(new Date(ms).getHours())}:${pad2(new Date(ms).getMinutes())}`;
  if (dayGap === 1) return '昨天';
  if (dayGap < 7) return `${dayGap} 天前`;
  return formatDateCn(key);
}
