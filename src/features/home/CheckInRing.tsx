import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useCheckIn } from '@/hooks/useCheckIn';
import { cn } from '@/lib/cn';

const WEEK_LABEL = ['日', '一', '二', '三', '四', '五', '六'];

function weekdayOf(dateKey: string): string {
  const [year = 0, month = 1, day = 1] = dateKey.split('-').map((part) => Number(part));
  const date = new Date(year, month - 1, day);
  return WEEK_LABEL[date.getDay()] ?? '';
}

/**
 * 打卡环（P1-08）。
 *
 * 打卡口径：当日完成 ≥1 个模块动作。打开 App、切难度、听 TTS、开关音乐都不算，
 * 因此这里只读 `useCheckIn()` 的结果，不做任何写入。
 * 已完成打卡时环体转为暖陶色 —— 属于正反馈，符合配色约束。
 */
export function CheckInRing(): JSX.Element {
  const { streak, longestStreak, checkedInToday, todayActionCount, recentDays, ringRatio, nextMilestone } = useCheckIn();

  return (
    <Card className="flex items-center gap-4">
      <ProgressRing value={ringRatio} tone={checkedInToday ? 'accent' : 'moss'} size={104} stroke={8}>
        <span className="text-2xl font-semibold leading-none text-ink">{streak}</span>
        <span className="mt-1 text-xs text-ink-soft">天连续</span>
      </ProgressRing>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-sm text-ink">
          {checkedInToday ? (
            <>
              今天已完成 <span className="font-semibold text-terra">{todayActionCount}</span> 个学习动作
            </>
          ) : (
            '今天还没学，完成任意一个模块动作即可打卡'
          )}
        </p>

        <div className="flex items-center gap-1.5">
          {recentDays.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-[10px]',
                  day.done ? 'bg-terra text-paper' : 'bg-moss-light text-ink-soft',
                  day.isToday && !day.done && 'border border-moss',
                )}
                aria-label={`${day.date} ${day.done ? '已打卡' : '未打卡'}`}
              >
                {weekdayOf(day.date)}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-ink-soft">
          距离 {nextMilestone} 天里程碑还差 {Math.max(0, nextMilestone - streak)} 天 · 最长 {longestStreak} 天
        </p>
      </div>
    </Card>
  );
}
