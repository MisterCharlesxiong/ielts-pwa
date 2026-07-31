import {
  ALL_CONNECTIVES,
  CONCLUSION_SIGNALS,
  DEFAULT_ADVANCED_PATTERNS,
  patternHint,
} from '@/constants/connectives';
import type { AdvancedPattern, WritingPrompt, WritingReport } from '@/types';

/**
 * 写作本地规则批改（纯函数，无网络、无 key）。
 *
 * 算法（架构 §4.3 步骤 1–5）：
 *   1. 分词计数 wordCount（/[A-Za-z']+/g）
 *   2. 空行切段 → paragraphCount + 首尾段结构判定
 *   3. 比对 requiredConnectives → used / missing
 *   4. 逐条 AdvancedPattern.regex 匹配 → matched / hint
 *   5. 加权计 ruleScore(0-100)
 *
 * 注意：ruleScore 仅为规则分，UI 必须注明「仅供参考，不代表雅思分数」。
 */

const WORD_RE = /[A-Za-z']+/g;

/** 英文单词数（中文字符不计入，符合雅思字数口径） */
export function countWords(text: string): number {
  const matched = text.match(WORD_RE);
  return matched ? matched.length : 0;
}

/** 按空行切段；没有空行时退化为按换行切 */
export function splitParagraphs(text: string): string[] {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];
  const byBlank = normalized
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (byBlank.length > 1) return byBlank;
  return normalized
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function includesPhrase(haystack: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // 词边界匹配，避免 'thus' 命中 'enthusiasm'
  const re = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, 'i');
  return re.test(haystack);
}

function matchPattern(text: string, pattern: AdvancedPattern): boolean {
  if (pattern.regex) {
    try {
      return new RegExp(pattern.regex, 'i').test(text);
    } catch {
      /* 正则非法则退回关键词匹配 */
    }
  }
  // 退化策略：把 template 里的实词当关键词，全部出现才算命中
  const keywords = pattern.template
    .toLowerCase()
    .split(/\.{2,}|\s+/)
    .map((k) => k.replace(/[^a-z]/g, ''))
    .filter((k) => k.length > 1);
  if (keywords.length === 0) return false;
  return keywords.every((k) => includesPhrase(text, k));
}

/**
 * 执行批改。
 * @param text 用户作文原文
 * @param prompt 题目（提供 minWords / requiredConnectives / advancedPatterns）
 */
export function check(text: string, prompt: WritingPrompt): WritingReport {
  const raw = text ?? '';
  const lower = raw.toLowerCase();
  const wordCount = countWords(raw);
  const paragraphs = splitParagraphs(raw);
  const paragraphCount = paragraphs.length;
  const minWords = prompt.minWords > 0 ? prompt.minWords : 150;
  const meetsMinWords = wordCount >= minWords;

  // ---- 结构判定 ----
  const first = paragraphs[0] ?? '';
  const last = paragraphs[paragraphCount - 1] ?? '';
  const firstWords = countWords(first);
  const lastWords = countWords(last);
  const hasIntro = paragraphCount >= 1 && firstWords >= 15;
  const hasBody = paragraphCount >= 3 || (paragraphCount === 2 && wordCount >= minWords);
  const hasConclusion =
    paragraphCount >= 2 &&
    (CONCLUSION_SIGNALS.some((sig) => includesPhrase(last.toLowerCase(), sig)) || lastWords >= 25);

  const issues: string[] = [];
  if (paragraphCount === 0) {
    issues.push('还没有内容，先写下第一段吧');
  } else {
    if (paragraphCount < 3) issues.push(`当前 ${paragraphCount} 段，建议至少 3 段（引言 / 主体 / 结论）`);
    if (!hasIntro) issues.push('引言段过短，建议改写题目并亮明立场（≥15 词）');
    if (!hasBody) issues.push('主体论证不足，建议展开 1-2 个分论点并各配例证');
    if (!hasConclusion) issues.push('结论段缺失或过短，可用 In conclusion / Overall 收束全文');
    if (!meetsMinWords) issues.push(`字数 ${wordCount}，距建议下限 ${minWords} 还差 ${minWords - wordCount} 词`);
  }

  // ---- 连接词 ----
  const required = prompt.requiredConnectives.length > 0 ? prompt.requiredConnectives : ALL_CONNECTIVES.slice(0, 6);
  const used: string[] = [];
  const missing: string[] = [];
  required.forEach((c) => {
    if (includesPhrase(lower, c.toLowerCase())) used.push(c);
    else missing.push(c);
  });
  // 额外统计用户自发使用、但不在必备清单里的连接词，作为加分项
  const bonusConnectives = ALL_CONNECTIVES.filter(
    (c) => !required.some((r) => r.toLowerCase() === c) && includesPhrase(lower, c),
  );

  // ---- 高分句式 ----
  const patternSource = prompt.advancedPatterns.length > 0 ? prompt.advancedPatterns : DEFAULT_ADVANCED_PATTERNS;
  const patterns = patternSource.map((p) => {
    const matched = matchPattern(raw, p);
    return { name: p.name, matched, hint: patternHint(p, matched) };
  });

  // ---- 规则分（0-100）----
  const wordScore = Math.min(1, minWords === 0 ? 1 : wordCount / minWords) * 35;
  const structureHits = [hasIntro, hasBody, hasConclusion].filter(Boolean).length;
  const structureScore = (structureHits / 3) * 25;
  const connectiveBase = required.length === 0 ? 1 : used.length / required.length;
  const connectiveScore = Math.min(1, connectiveBase + Math.min(bonusConnectives.length, 3) * 0.05) * 25;
  const matchedPatterns = patterns.filter((p) => p.matched).length;
  const patternScore = (patterns.length === 0 ? 0 : matchedPatterns / patterns.length) * 15;
  const ruleScore = wordCount === 0 ? 0 : Math.round(wordScore + structureScore + connectiveScore + patternScore);

  return {
    promptId: prompt.id,
    wordCount,
    paragraphCount,
    meetsMinWords,
    structure: { hasIntro, hasBody, hasConclusion, issues },
    connectives: { used, missing },
    patterns,
    ruleScore: Math.min(100, Math.max(0, ruleScore)),
    generatedAt: Date.now(),
  };
}

/** 与架构类图 `WritingChecker.check()` 同源的具名导出 */
export const writingChecker = { check };
