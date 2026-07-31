import { useNavigate } from 'react-router-dom';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LEVEL_MAP } from '@/constants/levels';
import { CheckInRing } from '@/features/home/CheckInRing';
import { ContinueCard } from '@/features/home/ContinueCard';
import { ModuleGrid } from '@/features/home/ModuleGrid';
import { useAppStore } from '@/store/useAppStore';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了，轻声学一会儿';
  if (hour < 11) return '早上好，开个好头';
  if (hour < 14) return '午间小课，正合适';
  if (hour < 18) return '下午好，继续推进';
  return '晚上好，收个尾吧';
}

/** 首页（P0-17）：打卡环 + 继续学习 + 六模块入口。 */
export function HomePage(): JSX.Element {
  const currentLevel = useAppStore((s) => s.currentLevel);
  const navigate = useNavigate();
  const levelMeta = currentLevel ? LEVEL_MAP[currentLevel] : null;

  return (
    <PageContainer className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-ink-soft">{greeting()}</p>
        <h2 className="text-xl font-semibold text-ink">今天想练哪一块？</h2>
      </div>

      <CheckInRing />
      <ContinueCard />

      {levelMeta ? (
        <Card className="flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="text-xs text-ink-soft">当前难度</p>
            <p className="truncate text-base font-semibold text-ink">{levelMeta.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/levels')}>
            切换
          </Button>
        </Card>
      ) : (
        <Card highlighted className="flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="text-base font-semibold text-ink">先选一个难度</p>
            <p className="text-xs text-ink-soft">六级由浅入深，随时可切换</p>
          </div>
          <Button size="sm" onClick={() => navigate('/levels')}>
            去选择
          </Button>
        </Card>
      )}

      <ModuleGrid level={currentLevel} />

      <p className="pb-2 pt-1 text-center text-xs text-ink-soft">
        全部内容已随应用离线缓存，断网也能继续学
      </p>
    </PageContainer>
  );
}
