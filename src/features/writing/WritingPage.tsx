import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from '@/components/ui/Toast';
import { isLevelId, levelName } from '@/constants/levels';
import { modulePath } from '@/constants/modules';
import { CorrectionPanel } from '@/features/writing/CorrectionPanel';
import { ModelEssayCompare } from '@/features/writing/ModelEssayCompare';
import { WritingEditor } from '@/features/writing/WritingEditor';
import { useContent } from '@/hooks/useContent';
import { cn } from '@/lib/cn';
import { countWords, writingChecker } from '@/lib/writingChecker';
import { useAppStore } from '@/store/useAppStore';
import { useProgressStore } from '@/store/useProgressStore';

const TASK_LABEL: Record<string, string> = {
  task1: 'Task 1 图表/信件',
  task2: 'Task 2 议论文',
  general: '综合写作',
};

/**
 * 写作模块（P0-09 / P0-10 / P1-05 / P1-06）。
 * 「完成一次本地批改」是本模块的打卡动作；只写草稿不批改不计入。
 */
export function WritingPage(): JSX.Element {
  const params = useParams<{ level: string }>();
  const navigate = useNavigate();
  const level = isLevelId(params.level) ? params.level : null;

  const { data, loading, error } = useContent(level, 'writing');
  const prompts = data?.items ?? [];

  const drafts = useProgressStore((s) => (level ? (s.byLevel[level]?.writing.drafts ?? {}) : {}));
  const reports = useProgressStore((s) => (level ? (s.byLevel[level]?.writing.reports ?? {}) : {}));
  const lastPromptId = useProgressStore((s) => (level ? s.byLevel[level]?.writing.lastPromptId : undefined));
  const saveDraft = useProgressStore((s) => s.saveDraft);
  const saveWritingReport = useProgressStore((s) => s.saveWritingReport);
  const recordAction = useAppStore((s) => s.recordAction);

  const [activeIndex, setActiveIndex] = useState(0);
  const [restored, setRestored] = useState(false);
  const [text, setText] = useState('');
  const [loadedPromptId, setLoadedPromptId] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);

  const active = prompts[activeIndex] ?? null;

  // 恢复上次写作的题目
  useEffect(() => {
    if (restored || prompts.length === 0) return;
    const index = lastPromptId ? prompts.findIndex((item) => item.id === lastPromptId) : -1;
    setActiveIndex(index >= 0 ? index : 0);
    setRestored(true);
  }, [restored, prompts, lastPromptId]);

  // 切题时载入对应草稿（每题独立草稿）
  useEffect(() => {
    if (!active || loadedPromptId === active.id) return;
    setText(drafts[active.id]?.text ?? '');
    setShowReport(Boolean(reports[active.id]));
    setLoadedPromptId(active.id);
  }, [active, loadedPromptId, drafts, reports]);

  const handlePersist = useCallback(
    (value: string) => {
      if (!level || !active) return;
      const existing = drafts[active.id]?.text ?? '';
      if (existing === value) return; // 无变化不写盘，避免无意义的 IndexedDB 写入
      saveDraft(level, active.id, value);
    },
    [level, active, drafts, saveDraft],
  );

  const handleCheck = useCallback(() => {
    if (!level || !active) return;
    if (countWords(text) === 0) {
      toast('先写点内容再批改吧', 'neutral');
      return;
    }
    saveDraft(level, active.id, text);
    const report = writingChecker.check(text, active);
    saveWritingReport(level, report);
    setShowReport(true);

    recordAction({
      level,
      module: 'writing',
      route: modulePath(level, 'writing'),
      itemId: active.id,
      itemIndex: activeIndex,
      label: `${levelName(level)} · 写作 ${TASK_LABEL[active.taskType] ?? active.taskType}`,
    });

    toast(`批改完成，规则分 ${report.ruleScore}`, 'success');
  }, [level, active, activeIndex, text, saveDraft, saveWritingReport, recordAction]);

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
        <div className="h-10 w-full rounded-card bg-line" />
        <div className="h-28 w-full rounded-card border border-line bg-parchment" />
        <div className="h-64 w-full rounded-card border border-line bg-parchment" />
      </PageContainer>
    );
  }

  if (error || !active) {
    return (
      <PageContainer>
        <EmptyState
          icon="写"
          title="暂时没有写作题目"
          desc={error ?? '该难度的写作包为空，请稍后再试或切换难度。'}
          action={<Button onClick={() => navigate('/levels')}>切换难度</Button>}
        />
      </PageContainer>
    );
  }

  const report = reports[active.id] ?? null;
  const draftMeta = drafts[active.id];

  return (
    <PageContainer className="flex flex-col gap-4">
      {/* 题目切换 */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {prompts.map((prompt, index) => {
          const done = Boolean(reports[prompt.id]);
          return (
            <button
              key={prompt.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'flex min-h-tap shrink-0 items-center gap-1 rounded-full border px-3 text-sm transition-colors duration-150',
                index === activeIndex ? 'border-moss bg-moss-light text-moss-dark' : 'border-line text-ink-soft',
              )}
            >
              <span>{TASK_LABEL[prompt.taskType] ?? `题目 ${index + 1}`}</span>
              {done ? <span className="text-xs text-terra">已批改</span> : null}
            </button>
          );
        })}
      </div>

      <Card className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-moss-light px-2 py-0.5 text-xs text-moss-dark">
            {TASK_LABEL[active.taskType] ?? active.taskType}
          </span>
          <span className="text-xs text-ink-soft">建议 ≥{active.minWords} 词</span>
        </div>
        <p className="read-body text-base text-ink">{active.prompt}</p>

        {active.suggestedStructure.length > 0 ? (
          <div className="mt-1 rounded-card bg-parchment px-3 py-2">
            <p className="text-xs font-medium text-ink">建议结构</p>
            <ol className="mt-1 flex list-inside list-decimal flex-col gap-1">
              {active.suggestedStructure.map((step) => (
                <li key={step} className="text-xs leading-relaxed text-ink-soft">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {active.requiredConnectives.length > 0 ? (
          <p className="text-xs leading-relaxed text-ink-soft">
            必备连接词：{active.requiredConnectives.join(' / ')}
          </p>
        ) : null}
      </Card>

      <WritingEditor
        value={text}
        onChange={setText}
        onPersist={handlePersist}
        minWords={active.minWords}
        savedAt={draftMeta?.updatedAt ?? 0}
      />

      <div className="flex items-center gap-3">
        <Button block onClick={handleCheck}>
          本地批改
        </Button>
        {report ? (
          <Button variant="ghost" block onClick={() => setShowReport((prev) => !prev)}>
            {showReport ? '收起报告' : '查看报告'}
          </Button>
        ) : null}
      </div>

      {showReport && report ? <CorrectionPanel report={report} /> : null}

      <ModelEssayCompare modelEssay={active.modelEssay} userText={text} className="pb-2" />
    </PageContainer>
  );
}
