/**
 * 内容包体检脚本（离线复刻 src/content/schema.ts 的校验规则）
 * ------------------------------------------------------------------
 * 目的：在 `npm run build` 之前就把内容问题暴露出来。
 * 运行时校验只会 console.warn，浏览器里很容易被忽略；这里直接以退出码报错。
 *
 * 用法：node scripts/check-content.mjs
 */

import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LEVELS = ['junior', 'senior', 'college', 'ielts55', 'ielts65', 'ielts7plus'];
const MODULES = ['words', 'grammar', 'reading', 'writing', 'speaking', 'quiz'];
const EXPECT_COUNT = { words: 100, grammar: 8, reading: 4, writing: 3, speaking: 4, quiz: 4 };

const issues = [];
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;

function checkQuestion(q, path) {
  const errs = [];
  if (!q || typeof q !== 'object') return [`${path} 不是对象`];
  if (!isStr(q.id)) errs.push(`${path}.id 缺失`);
  if (!isStr(q.stem)) errs.push(`${path}.stem 缺失`);
  if (!['single', 'boolean', 'blank'].includes(q.type)) errs.push(`${path}.type 非法`);
  if (q.type === 'single') {
    if (!Array.isArray(q.options) || q.options.length < 2) {
      errs.push(`${path}.options 至少 2 项`);
    } else {
      q.options.forEach((o, i) => {
        if (!o || !isStr(o.key) || !isStr(o.text)) errs.push(`${path}.options[${i}] 需要 {key,text}`);
      });
      const keys = q.options.map((o) => o.key);
      if (new Set(keys).size !== keys.length) errs.push(`${path}.options key 重复`);
      if (!keys.includes(q.answer)) errs.push(`${path}.answer 不在选项 key 中`);
    }
  }
  if (q.type === 'boolean' && q.answer !== 'true' && q.answer !== 'false') {
    errs.push(`${path}.answer 应为字符串 'true' / 'false'`);
  }
  if (q.type === 'blank') {
    const ok = isStr(q.answer) || (Array.isArray(q.answer) && q.answer.length > 0);
    if (!ok) errs.push(`${path}.answer 非法`);
  }
  return errs;
}

const CHECKERS = {
  words: (item, path) => {
    const errs = [];
    ['id', 'term', 'phonetic', 'meaningCn', 'example'].forEach((k) => {
      if (!isStr(item[k])) errs.push(`${path}.${k} 缺失`);
    });
    if (isStr(item.phonetic) && !/^\/.+\/$/.test(item.phonetic)) errs.push(`${path}.phonetic 应以斜杠包裹`);
    return errs;
  },
  grammar: (item, path) => {
    const errs = [];
    ['id', 'title', 'ruleText'].forEach((k) => {
      if (!isStr(item[k])) errs.push(`${path}.${k} 缺失`);
    });
    if (!Array.isArray(item.examples) || item.examples.length === 0) errs.push(`${path}.examples 至少 1 条`);
    if (!Array.isArray(item.exercises) || item.exercises.length < 3) {
      errs.push(`${path}.exercises 至少 3 题`);
    } else {
      item.exercises.forEach((q, i) => errs.push(...checkQuestion(q, `${path}.exercises[${i}]`)));
    }
    return errs;
  },
  reading: (item, path) => {
    const errs = [];
    ['id', 'title'].forEach((k) => {
      if (!isStr(item[k])) errs.push(`${path}.${k} 缺失`);
    });
    if (!Array.isArray(item.paragraphs) || item.paragraphs.length === 0) errs.push(`${path}.paragraphs 为空`);
    if (!Array.isArray(item.questions) || item.questions.length < 4) {
      errs.push(`${path}.questions 至少 4 题`);
    } else {
      item.questions.forEach((q, i) => {
        const qPath = `${path}.questions[${i}]`;
        const e = checkQuestion(q, qPath);
        errs.push(...e);
        if (e.length === 0 && q.type === 'blank') errs.push(`${qPath} 阅读题首版不支持填空`);
      });
    }
    return errs;
  },
  writing: (item, path) => {
    const errs = [];
    ['id', 'prompt', 'taskType'].forEach((k) => {
      if (!isStr(item[k])) errs.push(`${path}.${k} 缺失`);
    });
    if (!['task1', 'task2', 'general'].includes(item.taskType)) errs.push(`${path}.taskType 非法`);
    if (typeof item.minWords !== 'number' || item.minWords <= 0) errs.push(`${path}.minWords 应为正数`);
    if (!Array.isArray(item.suggestedStructure) || item.suggestedStructure.length < 4) {
      errs.push(`${path}.suggestedStructure 至少 4 步`);
    }
    if (!Array.isArray(item.requiredConnectives) || item.requiredConnectives.length === 0) {
      errs.push(`${path}.requiredConnectives 为空`);
    }
    if (!Array.isArray(item.advancedPatterns) || item.advancedPatterns.length === 0) {
      errs.push(`${path}.advancedPatterns 为空`);
    } else {
      item.advancedPatterns.forEach((p, i) => {
        if (!isStr(p.name) || !isStr(p.template) || !isStr(p.sample)) {
          errs.push(`${path}.advancedPatterns[${i}] 需要 name/template/sample`);
        }
        if (p.regex !== undefined) {
          try {
            const re = new RegExp(p.regex, 'i');
            // 样例句必须能被自己的正则命中，否则批改永远给不出分
            if (!re.test(p.sample)) errs.push(`${path}.advancedPatterns[${i}] regex 匹配不上 sample`);
          } catch {
            errs.push(`${path}.advancedPatterns[${i}] regex 非法`);
          }
        }
      });
    }
    return errs;
  },
  speaking: (item, path) => {
    const errs = [];
    ['id', 'text'].forEach((k) => {
      if (!isStr(item[k])) errs.push(`${path}.${k} 缺失`);
    });
    if (isStr(item.text) && /\d/.test(item.text)) errs.push(`${path}.text 含阿拉伯数字，识别打分会抖动`);
    if (item.speakRate !== undefined && (typeof item.speakRate !== 'number' || item.speakRate <= 0)) {
      errs.push(`${path}.speakRate 非法`);
    }
    return errs;
  },
  quiz: (item, path) => {
    const errs = [];
    ['id', 'title'].forEach((k) => {
      if (!isStr(item[k])) errs.push(`${path}.${k} 缺失`);
    });
    if (typeof item.durationSec !== 'number' || item.durationSec <= 0) errs.push(`${path}.durationSec 应为正数`);
    if (!Array.isArray(item.sections) || item.sections.length === 0) {
      errs.push(`${path}.sections 为空`);
      return errs;
    }
    const refs = new Set();
    item.sections.forEach((sec, i) => {
      const sPath = `${path}.sections[${i}]`;
      if (!sec || typeof sec !== 'object') {
        errs.push(`${sPath} 不是对象`);
        return;
      }
      if (!isStr(sec.id)) errs.push(`${sPath}.id 缺失`);
      if (!isStr(sec.moduleRef)) errs.push(`${sPath}.moduleRef 缺失`);
      refs.add(sec.moduleRef);
      if (!Array.isArray(sec.questions) || sec.questions.length === 0) {
        errs.push(`${sPath}.questions 为空`);
      } else {
        sec.questions.forEach((q, j) => errs.push(...checkQuestion(q, `${sPath}.questions[${j}]`)));
      }
    });
    if (refs.size < 3) errs.push(`${path} 仅覆盖 ${refs.size} 个 moduleRef，应 ≥3`);
    return errs;
  },
};

let packCount = 0;
let itemCount = 0;
const globalIds = new Set();

LEVELS.forEach((level) => {
  MODULES.forEach((module) => {
    const file = join(ROOT, 'src/content', level, `${module}.json`);
    let pack;
    try {
      pack = JSON.parse(readFileSync(file, 'utf8'));
    } catch (error) {
      issues.push(`${level}/${module}.json 读取或解析失败：${String(error)}`);
      return;
    }
    packCount += 1;
    if (pack.schemaVersion !== 1) issues.push(`${level}/${module} schemaVersion 应为 1`);
    if (pack.level !== level) issues.push(`${level}/${module} level 字段不匹配`);
    if (pack.module !== module) issues.push(`${level}/${module} module 字段不匹配`);
    if (!isStr(pack.title)) issues.push(`${level}/${module} title 缺失`);
    if (Number.isNaN(Date.parse(pack.generatedAt))) issues.push(`${level}/${module} generatedAt 非法`);
    if (!Array.isArray(pack.items)) {
      issues.push(`${level}/${module} items 不是数组`);
      return;
    }
    if (pack.items.length !== EXPECT_COUNT[module]) {
      issues.push(`${level}/${module} 条目数 ${pack.items.length}，应为 ${EXPECT_COUNT[module]}`);
    }
    pack.items.forEach((item, index) => {
      itemCount += 1;
      const path = `${level}/${module}.items[${index}]`;
      if (!item || typeof item !== 'object') {
        issues.push(`${path} 不是对象`);
        return;
      }
      if (isStr(item.id)) {
        const key = `${module}:${item.id}`;
        if (globalIds.has(key)) issues.push(`${path} id 重复：${item.id}`);
        globalIds.add(key);
      }
      issues.push(...CHECKERS[module](item, path));
    });
  });
});

if (issues.length > 0) {
  console.error(`\n[check-content] 发现 ${issues.length} 个问题：`);
  issues.slice(0, 40).forEach((msg) => console.error(`  - ${msg}`));
  if (issues.length > 40) console.error(`  … 其余 ${issues.length - 40} 条省略`);
  process.exit(1);
}

console.log(`[check-content] 通过：${packCount} 个内容包 / ${itemCount} 个条目，未发现问题。`);
