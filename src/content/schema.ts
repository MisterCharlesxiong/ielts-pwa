import { CONTENT_SCHEMA_VERSION } from '@/constants/schema';
import type { ContentPack, LevelId, ModuleId, Question } from '@/types';

/**
 * 内容包运行时轻量校验。
 *
 * 刻意不引入 zod（体积优先）：这里只做「必填字段存在 + 类型粗查 + 版本比对」，
 * 目标是在内容方填错时给出可定位的中文报错，而不是做完备的运行时类型系统。
 */

export interface ValidationOk<T> {
  ok: true;
  pack: ContentPack<T>;
  /** 非致命问题，仅 console.warn */
  warnings: string[];
}

export interface ValidationFail {
  ok: false;
  error: string;
}

export type ValidationResult<T> = ValidationOk<T> | ValidationFail;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/** 校验单条题目，返回错误描述数组（空数组表示通过） */
export function validateQuestion(raw: unknown, path: string): string[] {
  const errors: string[] = [];
  if (!isRecord(raw)) return [`${path} 不是对象`];
  if (!isNonEmptyString(raw.id)) errors.push(`${path}.id 缺失`);
  if (!isNonEmptyString(raw.stem)) errors.push(`${path}.stem 缺失`);
  const type = raw.type;
  if (type !== 'single' && type !== 'boolean' && type !== 'blank') {
    errors.push(`${path}.type 非法（应为 single | boolean | blank）`);
  }
  if (type === 'single') {
    if (!Array.isArray(raw.options) || raw.options.length < 2) {
      errors.push(`${path}.options 至少需要 2 个选项`);
    } else {
      raw.options.forEach((opt, i) => {
        if (!isRecord(opt) || !isNonEmptyString(opt.key) || !isNonEmptyString(opt.text)) {
          errors.push(`${path}.options[${i}] 需要 { key, text }`);
        }
      });
    }
    if (!isNonEmptyString(raw.answer)) errors.push(`${path}.answer 应为选项 key`);
  }
  if (type === 'boolean' && raw.answer !== 'true' && raw.answer !== 'false') {
    errors.push(`${path}.answer 应为 'true' 或 'false'`);
  }
  if (type === 'blank') {
    const ok = isNonEmptyString(raw.answer) || (Array.isArray(raw.answer) && raw.answer.length > 0);
    if (!ok) errors.push(`${path}.answer 应为字符串或非空字符串数组`);
  }
  return errors;
}

/** 阅读题首版限定为 single | boolean */
function validateReadingQuestionType(q: Question, path: string): string[] {
  if (q.type === 'blank') return [`${path} 阅读题首版不支持填空题（仅 single | boolean）`];
  return [];
}

interface ModuleRule {
  /** items 中每一条的必填字段 */
  requiredFields: string[];
  /** 额外校验 */
  extra?: (item: Record<string, unknown>, path: string) => string[];
}

const MODULE_RULES: Record<ModuleId, ModuleRule> = {
  words: {
    requiredFields: ['id', 'term', 'phonetic', 'meaningCn', 'example'],
  },
  grammar: {
    requiredFields: ['id', 'title', 'ruleText'],
    extra: (item, path) => {
      const errors: string[] = [];
      if (!Array.isArray(item.examples) || item.examples.length === 0) {
        errors.push(`${path}.examples 至少 1 条`);
      }
      if (!Array.isArray(item.exercises) || item.exercises.length < 3) {
        errors.push(`${path}.exercises 至少 3 题`);
      } else {
        item.exercises.forEach((q, i) => errors.push(...validateQuestion(q, `${path}.exercises[${i}]`)));
      }
      return errors;
    },
  },
  reading: {
    requiredFields: ['id', 'title'],
    extra: (item, path) => {
      const errors: string[] = [];
      if (!Array.isArray(item.paragraphs) || item.paragraphs.length === 0) {
        errors.push(`${path}.paragraphs 必须为非空字符串数组（段落级进度依赖此点）`);
      }
      if (!Array.isArray(item.questions) || item.questions.length < 4) {
        errors.push(`${path}.questions 至少 4 题`);
      } else {
        item.questions.forEach((q, i) => {
          const qPath = `${path}.questions[${i}]`;
          const errs = validateQuestion(q, qPath);
          errors.push(...errs);
          if (errs.length === 0) errors.push(...validateReadingQuestionType(q as Question, qPath));
        });
      }
      return errors;
    },
  },
  writing: {
    requiredFields: ['id', 'prompt', 'taskType'],
    extra: (item, path) => {
      const errors: string[] = [];
      if (typeof item.minWords !== 'number' || item.minWords <= 0) errors.push(`${path}.minWords 应为正数`);
      if (!Array.isArray(item.suggestedStructure)) errors.push(`${path}.suggestedStructure 应为字符串数组`);
      if (!Array.isArray(item.requiredConnectives) || item.requiredConnectives.length === 0) {
        errors.push(`${path}.requiredConnectives 不能为空（否则批改无输出）`);
      }
      if (!Array.isArray(item.advancedPatterns) || item.advancedPatterns.length === 0) {
        errors.push(`${path}.advancedPatterns 不能为空（否则批改无输出）`);
      }
      return errors;
    },
  },
  speaking: {
    requiredFields: ['id', 'text'],
  },
  quiz: {
    requiredFields: ['id', 'title'],
    extra: (item, path) => {
      const errors: string[] = [];
      if (typeof item.durationSec !== 'number' || item.durationSec <= 0) {
        errors.push(`${path}.durationSec 应为正数`);
      }
      if (!Array.isArray(item.sections) || item.sections.length === 0) {
        errors.push(`${path}.sections 至少 1 个`);
      } else {
        item.sections.forEach((sec, i) => {
          const sPath = `${path}.sections[${i}]`;
          if (!isRecord(sec)) {
            errors.push(`${sPath} 不是对象`);
            return;
          }
          if (!isNonEmptyString(sec.id)) errors.push(`${sPath}.id 缺失`);
          if (!isNonEmptyString(sec.moduleRef)) errors.push(`${sPath}.moduleRef 缺失`);
          if (!Array.isArray(sec.questions) || sec.questions.length === 0) {
            errors.push(`${sPath}.questions 至少 1 题`);
          } else {
            sec.questions.forEach((q, j) => errors.push(...validateQuestion(q, `${sPath}.questions[${j}]`)));
          }
        });
      }
      return errors;
    },
  },
};

/**
 * 校验一个内容包。
 * @param raw 从 JSON 动态 import 得到的原始对象
 * @param expectLevel 期望难度（与文件所在目录一致）
 * @param expectModule 期望模块
 */
export function validateContentPack<T>(
  raw: unknown,
  expectLevel: LevelId,
  expectModule: ModuleId,
): ValidationResult<T> {
  if (!isRecord(raw)) {
    return { ok: false, error: `内容包 ${expectLevel}/${expectModule} 不是合法对象` };
  }
  if (raw.schemaVersion !== CONTENT_SCHEMA_VERSION) {
    return {
      ok: false,
      error: `内容包 ${expectLevel}/${expectModule} 的 schemaVersion=${String(raw.schemaVersion)}，期望 ${CONTENT_SCHEMA_VERSION}`,
    };
  }
  if (raw.level !== expectLevel) {
    return { ok: false, error: `内容包 level=${String(raw.level)}，期望 ${expectLevel}` };
  }
  if (raw.module !== expectModule) {
    return { ok: false, error: `内容包 module=${String(raw.module)}，期望 ${expectModule}` };
  }
  if (!Array.isArray(raw.items)) {
    return { ok: false, error: `内容包 ${expectLevel}/${expectModule} 的 items 不是数组` };
  }

  const rule = MODULE_RULES[expectModule];
  const warnings: string[] = [];
  raw.items.forEach((item, index) => {
    const path = `${expectLevel}/${expectModule}.items[${index}]`;
    if (!isRecord(item)) {
      warnings.push(`${path} 不是对象`);
      return;
    }
    rule.requiredFields.forEach((field) => {
      if (!isNonEmptyString(item[field]) && typeof item[field] !== 'number') {
        warnings.push(`${path}.${field} 缺失`);
      }
    });
    if (rule.extra) warnings.push(...rule.extra(item, path));
  });

  return {
    ok: true,
    pack: raw as unknown as ContentPack<T>,
    warnings,
  };
}
