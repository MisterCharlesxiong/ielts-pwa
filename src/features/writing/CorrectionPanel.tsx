import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { cn } from '@/lib/cn';
import { formatRelative } from '@/lib/date';
import type { WritingReport } from '@/types';

export interface CorrectionPanelProps {
  report: WritingReport;
  className?: string;
}

interface CheckRowProps {
  ok: boolean;
  label: string;
}

/** 单条检查项：命中用暖陶（正反馈），未命中保持中性墨色，不用红色施压 */
function CheckRow({ ok, label }: CheckRowProps): JSX.Element {
  return (
    <li className="flex items-start gap-2 text-sm leading-relaxed">
      <span
        className={cn(
          'mt-[2px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]',
          ok ? 'bg-terra text-paper' : 'bg-line text-ink-soft',
        )}
        aria-hidden="true"
      >
        {ok ? '✓' : '·'}
      </span>
      <span className={ok ? 'text-ink' : 'text-ink-soft'}>{label}</span>
    </li>
  );
}

/**
 * 本地批改报告（P0-10）。
 *
 * 分数为**纯规则分**，界面必须显式注明「仅供参考，不代表雅思分数」。
 */
export function CorrectionPanel({ report, className = '' }: CorrectionPanelProps): JSX.Element {
  const { structure, connectives, patterns } = report;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Card className="flex items-center gap-4">
        <ProgressRing
          value={report.ruleScore / 100}
          size={84}
          tone={report.ruleScore >= 60 ? 'accent' : 'moss'}
          label="写作规则分"
        >
          <span className="text-xl font-semibold text-ink">{report.ruleScore}</span>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <p className="text-base font-medium text-ink">规则分 {report.ruleScore} / 100</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            由本机规则引擎离线计算（字数 35% · 结构 25% · 连接词 25% · 句式 15%），
            <span className="text-ink">仅供参考，不代表雅思分数</span>。
          </p>
          <p className="mt-1 text-xs text-ink-soft">生成于 {formatRelative(report.generatedAt)}</p>
        </div>
      </Card>

      <Card className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-ink">篇幅与结构</h3>
        <ul className="flex flex-col gap-1.5">
          <CheckRow ok={report.meetsMinWords} label={`字数 ${report.wordCount} 词，共 ${report.paragraphCount} 段`} />
          <CheckRow ok={structure.hasIntro} label="引言段完整（改写题目 + 亮明立场）" />
          <CheckRow ok={structure.hasBody} label="主体段论证展开充分" />
          <CheckRow ok={structure.hasConclusion} label="结论段收束全文" />
        </ul>
        {structure.issues.length > 0 ? (
          <div className="mt-1 rounded-card bg-parchment px-3 py-2">
            <p className="text-xs font-medium text-ink">改进建议</p>
            <ul className="mt-1 flex list-inside list-disc flex-col gap-1">
              {structure.issues.map((issue) => (
                <li key={issue} className="text-xs leading-relaxed text-ink-soft">
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>

      <Card className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-ink">
          连接词 {connectives.used.length}/{connectives.used.length + connectives.missing.length}
        </h3>
        {connectives.used.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {connectives.used.map((word) => (
              <span key={word} className="rounded-full bg-moss-light px-2 py-1 text-xs text-terra">
                {word}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-ink-soft">还没有用到必备连接词，试着加入逻辑衔接。</p>
        )}
        {connectives.missing.length > 0 ? (
          <p className="text-xs leading-relaxed text-ink-soft">
            尚未使用：{connectives.missing.join(' / ')}
          </p>
        ) : null}
      </Card>

      <Card className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-ink">高分句式</h3>
        <ul className="flex flex-col gap-1.5">
          {patterns.map((pattern) => (
            <li key={pattern.name} className="flex flex-col gap-0.5">
              <CheckRow ok={pattern.matched} label={pattern.name} />
              <span className="pl-6 text-xs leading-relaxed text-ink-soft">{pattern.hint}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
