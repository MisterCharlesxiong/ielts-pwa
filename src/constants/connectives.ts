import type { AdvancedPattern } from '@/types';

/**
 * 写作本地批改用的连接词库与高分句式规则。
 * 纯静态数据，`src/lib/writingChecker.ts` 消费。
 */

export interface ConnectiveGroup {
  /** 逻辑功能中文名 */
  label: string;
  /** 该组连接词（小写，比对时统一小写） */
  items: string[];
}

export const CONNECTIVE_GROUPS: ConnectiveGroup[] = [
  {
    label: '递进/补充',
    items: ['in addition', 'furthermore', 'moreover', 'besides', 'what is more', 'additionally'],
  },
  {
    label: '转折/让步',
    items: ['however', 'nevertheless', 'nonetheless', 'on the contrary', 'although', 'even though', 'whereas'],
  },
  {
    label: '因果',
    items: ['therefore', 'thus', 'consequently', 'as a result', 'hence', 'because of this'],
  },
  {
    label: '举例',
    items: ['for example', 'for instance', 'such as', 'to illustrate', 'namely'],
  },
  {
    label: '对比',
    items: ['by contrast', 'in comparison', 'similarly', 'likewise', 'on the other hand'],
  },
  {
    label: '总结',
    items: ['in conclusion', 'to sum up', 'overall', 'in summary', 'all things considered'],
  },
];

/** 扁平连接词表（全部小写） */
export const ALL_CONNECTIVES: string[] = CONNECTIVE_GROUPS.flatMap((g) => g.items);

/** 结论段常见信号词，用于结构检测 */
export const CONCLUSION_SIGNALS: string[] = [
  'in conclusion',
  'to sum up',
  'to conclude',
  'overall',
  'in summary',
  'all things considered',
  'in short',
];

/** 引言段常见信号词 */
export const INTRO_SIGNALS: string[] = [
  'nowadays',
  'in recent years',
  'it is often argued',
  'some people believe',
  'there is a debate',
  'this essay will',
];

/**
 * 高分句式预设。
 * 内容包里的 `WritingPrompt.advancedPatterns` 若未填，批改时回落到这份预设，
 * 保证批改一定有输出。
 */
export const DEFAULT_ADVANCED_PATTERNS: AdvancedPattern[] = [
  {
    name: '强调句',
    template: 'It is ... that ...',
    sample: 'It is education that shapes a nation’s future.',
    regex: '\\bit\\s+(is|was)\\b[^.]{3,60}\\bthat\\b',
  },
  {
    name: '定语从句',
    template: '... which / who ...',
    sample: 'Policies which encourage recycling have proved effective.',
    regex: '\\b(which|who|whom|whose)\\b',
  },
  {
    name: '虚拟语气',
    template: 'If ... were / would ...',
    sample: 'If governments were to invest more, the problem would ease.',
    regex: '\\bif\\b[^.]{3,60}\\b(were|would|could|should)\\b',
  },
  {
    name: '倒装句',
    template: 'Not only ... but also ...',
    sample: 'Not only does it save money, but it also protects the planet.',
    regex: '\\bnot only\\b[^.]{0,60}\\bbut\\b',
  },
  {
    name: '名词性从句',
    template: 'What ... is that ...',
    sample: 'What matters most is that citizens change their habits.',
    regex: '^\\s*what\\b[^.]{3,60}\\bis\\s+that\\b|\\bwhat\\b[^.]{3,60}\\bis\\s+that\\b',
  },
];

/** 句式未命中时给出的中文提示模板 */
export function patternHint(pattern: AdvancedPattern, matched: boolean): string {
  return matched
    ? `已用到${pattern.name}，继续保持`
    : `可尝试${pattern.name}：${pattern.template}（例：${pattern.sample}）`;
}
