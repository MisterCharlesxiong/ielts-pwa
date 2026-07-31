import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cardEnter } from '@/constants/motion';
import { isLevelId, levelName } from '@/constants/levels';
import { modulePath } from '@/constants/modules';
import { useContent } from '@/hooks/useContent';
import { cn } from '@/lib/cn';
import { useProgressStore } from '@/store/useProgressStore';

/**
 * 阅读篇目列表（P0-06）。
 * 展示篇幅 / 预计时长 / 完成状态 / 上次正确率，点击进入专注阅读。
 */
export function ReadingListPage(): JSX.Element {
  const params = useParams<{ level: string }>();
  const navigate = useNavigate();
  const level = isLevelId(params.level) ? params.level : null;

  const { data, loading, error } = useContent(level, 'reading');
  const passages = data?.items ?? [];

  const finishedIds = useProgressStore((s) => (level ? (s.byLevel[level]?.reading.finishedIds ?? []) : []));
  const accuracy = useProgressStore((s) => (level ? (s.byLevel[level]?.reading.accuracy ?? {}) : {}));
  const cursors = useProgressStore((s) => (level ? (s.byLevel[level]?.reading.paragraphCursor ?? {}) : {}));

  if (!level) {
    return (
      <PageContainer>
        <EmptyState
          icon="级"
          title="难度参数无效"
          desc="请先选择一个学习难度。"
          action={<Button onClick={() => navigate('/levels')}>去选择难度</Button>}
        />
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer className="flex flex-col gap-3">
        <div className="h-24 w-full rounded-card border border-line bg-parchment" />
        <div className="h-24 w-full rounded-card border border-line bg-parchment" />
        <div className="h-24 w-full rounded-card border border-line bg-parchment" />
      </PageContainer>
    );
  }

  if (error || passages.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          icon="读"
          title="暂时没有阅读内容"
          desc={error ?? '该难度的阅读包为空，请稍后再试或切换难度。'}
          action={<Button onClick={() => navigate('/levels')}>切换难度</Button>}
        />
      </PageContainer>
    );
  }

  const finishedCount = passages.filter((item) => finishedIds.includes(item.id)).length;

  return (
    <PageContainer className="flex flex-col gap-3">
      <Card className="flex items-center justify-between py-3">
        <p className="text-xs text-ink-soft">
          {levelName(level)} · 已完成 {finishedCount}/{passages.length} 篇
        </p>
        <span className="text-xs text-ink-soft">点击进入专注阅读</span>
      </Card>

      {passages.map((passage, index) => {
        const done = finishedIds.includes(passage.id);
        const acc = accuracy[passage.id];
        const cursor = cursors[passage.id] ?? 0;
        const readRatio =
          passage.paragraphs.length === 0 ? 0 : Math.min(1, (cursor + 1) / passage.paragraphs.length);
        const started = cursor > 0 && !done;

        return (
          <motion.div key={passage.id} {...cardEnter(index)}>
            <Card
              interactive
              highlighted={done}
              className="cursor-pointer"
              onClick={() => navigate(`${modulePath(level, 'reading')}/${passage.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigate(`${modulePath(level, 'reading')}/${passage.id}`);
                }
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-medium text-ink">{passage.title}</h2>
                  <p className="mt-1 text-xs text-ink-soft">
                    {passage.wordCount} 词 · 约 {passage.estMinutes} 分钟 · {passage.questions.length} 题
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-1 text-xs',
                    done ? 'bg-moss-light text-terra' : 'bg-parchment text-ink-soft',
                  )}
                >
                  {done ? '已完成' : started ? '阅读中' : '未开始'}
                </span>
              </div>

              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                {passage.paragraphs[0] ?? ''}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <ProgressBar
                  value={done ? 1 : readRatio}
                  height={4}
                  celebrateOnFull={done}
                  className="flex-1"
                  label={`${passage.title} 阅读进度`}
                />
                {acc ? (
                  <span className="shrink-0 text-xs text-ink-soft">
                    正确率 {acc.total === 0 ? 0 : Math.round((acc.correct / acc.total) * 100)}%
                  </span>
                ) : null}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </PageContainer>
  );
}
