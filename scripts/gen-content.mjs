/**
 * T05 内容包生成器
 * ------------------------------------------------------------------
 * 输入：scripts/seeds/*.mjs（人工策展的紧凑种子数据）
 * 输出：src/content/<level>/<module>.json（6 级 × 6 模块 = 36 个）
 *
 * 为什么用生成器而不是手写 36 个 JSON：
 *   1. JSON 极其冗长（600 个单词条目手写不可维护）；
 *   2. 测试卷（quiz）本质是对 words / grammar / reading / writing 的重组，
 *      由脚本装配可保证「题目与内容永远同步」，且天然满足「每套覆盖 ≥3 个 moduleRef」；
 *   3. 生成时可做数量与极端值断言，把 PRD 4.10 的数量基线变成硬校验。
 *
 * 用法：node scripts/gen-content.mjs
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import WORDS_JUNIOR from './seeds/words.junior.mjs';
import WORDS_SENIOR from './seeds/words.senior.mjs';
import WORDS_COLLEGE from './seeds/words.college.mjs';
import WORDS_IELTS55 from './seeds/words.ielts55.mjs';
import WORDS_IELTS65 from './seeds/words.ielts65.mjs';
import WORDS_IELTS7PLUS from './seeds/words.ielts7plus.mjs';
import { GRAMMAR } from './seeds/grammar.mjs';
import { READING } from './seeds/reading.mjs';
import { WRITING } from './seeds/writing.mjs';
import { SPEAKING } from './seeds/speaking.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'src/content');

/** 与 src/constants/schema.ts 的 CONTENT_SCHEMA_VERSION 保持一致 */
const SCHEMA_VERSION = 1;
/** 固定生成时间，避免每次重跑都产生无意义 diff */
const GENERATED_AT = '2026-07-31T00:00:00.000Z';

const LEVELS = ['junior', 'senior', 'college', 'ielts55', 'ielts65', 'ielts7plus'];
const LEVEL_LABEL = {
  junior: '初中',
  senior: '高中',
  college: '大学',
  ielts55: '雅思 5.5',
  ielts65: '雅思 6.0-6.5',
  ielts7plus: '雅思 7 分+',
};

const WORDS_SEED = {
  junior: WORDS_JUNIOR,
  senior: WORDS_SENIOR,
  college: WORDS_COLLEGE,
  ielts55: WORDS_IELTS55,
  ielts65: WORDS_IELTS65,
  ielts7plus: WORDS_IELTS7PLUS,
};

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/* ------------------------------------------------------------------ */
/* 工具                                                                */
/* ------------------------------------------------------------------ */

/** 确定性伪随机（mulberry32），保证每次生成结果完全一致 */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(list, rng) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function countEnglishWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function assert(condition, message) {
  if (!condition) {
    console.error(`\n[gen-content] 断言失败：${message}\n`);
    process.exit(1);
  }
}

/* ------------------------------------------------------------------ */
/* 紧凑题目 → Question                                                 */
/* ------------------------------------------------------------------ */

/**
 * 紧凑题目格式：
 *   { t:'s', stem, opts:['A|文本', ...], a:'B', ex:'解析' }   单选
 *   { t:'b', stem, a:true|false, ex:'解析' }                  判断
 *   { t:'k', stem, a:'答案' | ['答案1','答案2'], ex:'解析' }   填空
 */
function expandQuestion(raw, id, moduleRef) {
  const base = { id, stem: raw.stem, points: raw.p ?? 1 };
  if (raw.ex) base.explanation = raw.ex;
  if (moduleRef) base.moduleRef = moduleRef;

  if (raw.t === 's') {
    const options = raw.opts.map((entry) => {
      const idx = entry.indexOf('|');
      return { key: entry.slice(0, idx), text: entry.slice(idx + 1) };
    });
    assert(options.length >= 2, `${id} 单选至少 2 个选项`);
    assert(
      options.some((o) => o.key === raw.a),
      `${id} 的 answer=${raw.a} 不在选项 key 中`,
    );
    return { ...base, type: 'single', options, answer: raw.a };
  }
  if (raw.t === 'b') {
    return { ...base, type: 'boolean', answer: raw.a ? 'true' : 'false' };
  }
  if (raw.t === 'k') {
    return { ...base, type: 'blank', answer: raw.a };
  }
  assert(false, `${id} 未知题型 ${raw.t}`);
  return null;
}

/* ------------------------------------------------------------------ */
/* 各模块构建                                                          */
/* ------------------------------------------------------------------ */

function buildWords(level) {
  const lines = WORDS_SEED[level];
  assert(Array.isArray(lines), `${level} 缺少单词种子`);
  assert(lines.length === 100, `${level} 单词数量应为 100，实际 ${lines.length}`);

  const seen = new Set();
  return lines.map((line, index) => {
    const parts = line.split('|');
    assert(parts.length === 6, `${level} 第 ${index + 1} 条单词字段数应为 6：${line}`);
    const [term, phonetic, pos, meaningCn, example, exampleCn] = parts.map((s) => s.trim());
    assert(!seen.has(term), `${level} 单词重复：${term}`);
    seen.add(term);
    assert(term && phonetic && pos && meaningCn && example && exampleCn, `${level} 第 ${index + 1} 条单词存在空字段`);
    return {
      id: `${level}-w${index + 1}`,
      term,
      phonetic: `/${phonetic}/`,
      pos,
      meaningCn,
      example,
      exampleCn,
      tags: [LEVEL_LABEL[level]],
    };
  });
}

function buildGrammar(level) {
  const seeds = GRAMMAR[level];
  assert(Array.isArray(seeds) && seeds.length === 8, `${level} 语法点应为 8 个，实际 ${seeds?.length}`);
  return seeds.map((seed, index) => {
    const id = `${level}-g${index + 1}`;
    assert(seed.examples.length >= 1, `${id} 至少 1 条例句`);
    assert(seed.exercises.length >= 3, `${id} 至少 3 道练习`);
    return {
      id,
      title: seed.title,
      ruleText: seed.ruleText,
      examples: seed.examples.map(([en, cn]) => ({ en, cn })),
      exercises: seed.exercises.map((q, i) => expandQuestion(q, `${id}-e${i + 1}`, 'grammar')),
    };
  });
}

function buildReading(level) {
  const seeds = READING[level];
  assert(Array.isArray(seeds) && seeds.length === 4, `${level} 阅读篇目应为 4 篇，实际 ${seeds?.length}`);
  return seeds.map((seed, index) => {
    const id = `${level}-r${index + 1}`;
    assert(seed.paras.length > 0, `${id} paragraphs 不能为空`);
    assert(seed.qs.length >= 4, `${id} 至少 4 题`);
    seed.qs.forEach((q) => assert(q.t === 's' || q.t === 'b', `${id} 阅读题首版仅支持 single | boolean`));
    const wordCount = seed.paras.reduce((sum, p) => sum + countEnglishWords(p), 0);
    const passage = {
      id,
      title: seed.title,
      wordCount,
      estMinutes: Math.max(2, Math.round(wordCount / 160)),
      paragraphs: seed.paras,
      questions: seed.qs.map((q, i) => expandQuestion(q, `${id}-q${i + 1}`, 'reading')),
    };
    if (seed.glossary && seed.glossary.length > 0) {
      passage.glossary = seed.glossary.map(([term, meaningCn]) => ({ term, meaningCn }));
    }
    return passage;
  });
}

function buildWriting(level) {
  const seeds = WRITING[level];
  assert(Array.isArray(seeds) && seeds.length === 3, `${level} 写作题应为 3 道，实际 ${seeds?.length}`);
  return seeds.map((seed, index) => {
    const id = `${level}-wr${index + 1}`;
    assert(seed.minWords > 0, `${id} minWords 应为正数`);
    assert(seed.structure.length >= 4, `${id} suggestedStructure 至少 4 步（测试卷需从中取题）`);
    assert(seed.connectives.length > 0, `${id} requiredConnectives 不能为空`);
    assert(seed.patterns.length > 0, `${id} advancedPatterns 不能为空`);
    const prompt = {
      id,
      taskType: seed.taskType,
      prompt: seed.prompt,
      minWords: seed.minWords,
      suggestedStructure: seed.structure,
      requiredConnectives: seed.connectives,
      advancedPatterns: seed.patterns.map(([name, template, sample, regex]) => {
        const pattern = { name, template, sample };
        if (regex) pattern.regex = regex;
        return pattern;
      }),
    };
    if (seed.model && seed.model.length > 0) {
      prompt.modelEssay = {
        paragraphs: seed.model.map(([role, en, cn, note]) => {
          const para = { role, en };
          if (cn) para.cn = cn;
          if (note) para.note = note;
          return para;
        }),
      };
    }
    return prompt;
  });
}

function buildSpeaking(level) {
  const seeds = SPEAKING[level];
  assert(Array.isArray(seeds) && seeds.length === 4, `${level} 跟读句应为 4 条，实际 ${seeds?.length}`);
  return seeds.map((seed, index) => ({
    id: `${level}-sp${index + 1}`,
    text: seed.text,
    translationCn: seed.cn,
    ipa: seed.ipa,
    speakRate: seed.rate ?? 0.9,
  }));
}

/* ------------------------------------------------------------------ */
/* 测试卷装配                                                          */
/* ------------------------------------------------------------------ */

/** 从单词表生成 N 道「释义单选」，干扰项取自同级其他单词 */
function wordSection(level, words, rng, sectionId, count, offset) {
  const questions = [];
  for (let i = 0; i < count; i += 1) {
    const word = words[(offset + i * 7) % words.length];
    const pool = words.filter((w) => w.meaningCn !== word.meaningCn && w.term !== word.term);
    const distractors = shuffle(pool, rng).slice(0, 3);
    const options = shuffle([word, ...distractors], rng).map((w, idx) => ({
      key: LETTERS[idx],
      text: w.meaningCn,
    }));
    const answer = options.find((o) => o.text === word.meaningCn).key;
    questions.push({
      id: `${sectionId}-q${i + 1}`,
      type: 'single',
      stem: `单词 “${word.term}” (${word.pos}) 的正确中文释义是？`,
      options,
      answer,
      explanation: `${word.term} ${word.phonetic} ${word.pos} ${word.meaningCn}\n例：${word.example}\n${word.exampleCn}`,
      points: 1,
      moduleRef: 'words',
    });
  }
  return { id: sectionId, title: '词汇', moduleRef: 'words', questions };
}

/** 从语法练习中抽题（保留原解析），重新编号 */
function grammarSection(points, sectionId, picks) {
  const flat = points.flatMap((p) => p.exercises);
  const questions = picks.map((idx, i) => {
    const src = flat[idx % flat.length];
    return { ...src, id: `${sectionId}-q${i + 1}`, moduleRef: 'grammar' };
  });
  return { id: sectionId, title: '语法', moduleRef: 'grammar', questions };
}

/** 从阅读题中抽题 */
function readingSection(passages, sectionId, passageIndex, count) {
  const passage = passages[passageIndex % passages.length];
  const questions = passage.questions.slice(0, count).map((q, i) => ({
    ...q,
    id: `${sectionId}-q${i + 1}`,
    stem: `（选自《${passage.title}》）${q.stem}`,
    moduleRef: 'reading',
  }));
  return { id: sectionId, title: '阅读', moduleRef: 'reading', questions };
}

/** 从写作题的建议结构与必备连接词生成题目 */
function writingSection(prompts, rng, sectionId) {
  const questions = [];
  prompts.forEach((prompt, pi) => {
    const step = 1 + (pi % Math.min(3, prompt.suggestedStructure.length));
    const correct = prompt.suggestedStructure[step];
    const pool = prompt.suggestedStructure.filter((s) => s !== correct);
    const options = shuffle([correct, ...shuffle(pool, rng).slice(0, 3)], rng).map((text, idx) => ({
      key: LETTERS[idx],
      text,
    }));
    questions.push({
      id: `${sectionId}-q${pi * 2 + 1}`,
      type: 'single',
      stem: `写作题「${prompt.prompt.slice(0, 24)}…」的建议结构中，第 ${step + 1} 步应当是？`,
      options,
      answer: options.find((o) => o.text === correct).key,
      explanation: `完整建议结构：${prompt.suggestedStructure.map((s, i) => `${i + 1}. ${s}`).join('；')}`,
      points: 1,
      moduleRef: 'writing',
    });
    questions.push({
      id: `${sectionId}-q${pi * 2 + 2}`,
      type: 'boolean',
      stem: `判断：本题要求的必备连接词中包含 “${prompt.requiredConnectives[0]}”。`,
      answer: 'true',
      explanation: `本题必备连接词：${prompt.requiredConnectives.join(' / ')}。批改时缺少任一项都会扣「连接词」维度分。`,
      points: 1,
      moduleRef: 'writing',
    });
  });
  return { id: sectionId, title: '写作', moduleRef: 'writing', questions };
}

/**
 * 情境长题干（≥120 字），用于验证极端排版不溢出、不截断。
 * 每级第 4 套模拟卷各注入一道。
 */
function longStemQuestion(level, passage, sectionId) {
  const stem =
    `在一次以「${passage.title}」为主题的班级研讨课上，老师要求同学们先在 8 分钟内通读全文，` +
    `逐段标注出作者的核心论点、两条支持性证据以及至少一处作者本人的态度用词；` +
    `随后与同桌交换笔记，互相解释自己为什么这样划分段落层次；` +
    `最后请结合你在文中读到的信息，而不是结合你自己的生活经验或常识，判断下面这句话是否与原文表达的意思一致：` +
    `「${passage.title} 一文的作者认为，读者只要记住结论就足够了，理解论证过程并不重要。」`;
  assert(stem.length >= 120, `${level} 长题干长度不足 120（实际 ${stem.length}）`);
  return {
    id: `${sectionId}-long`,
    type: 'boolean',
    stem,
    answer: 'false',
    explanation:
      '原文强调的是「理解论证过程」，仅记住结论无法迁移到新的语境中，因此该说法与原文相悖。此题同时用于验证超长题干在 375px 宽度下的换行表现。',
    points: 2,
    moduleRef: 'reading',
  };
}

function buildQuiz(level, words, grammar, reading, writing) {
  const rng = mulberry32(
    Array.from(level).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7),
  );
  const label = LEVEL_LABEL[level];

  const quiz1 = {
    id: `${level}-q1`,
    title: `${label} · 综合小测 A`,
    durationSec: 600,
    sections: [
      wordSection(level, words, rng, `${level}-q1-s1`, 6, 0),
      grammarSection(grammar, `${level}-q1-s2`, [0, 1, 2, 3]),
      readingSection(reading, `${level}-q1-s3`, 0, 4),
    ],
  };

  const quiz2 = {
    id: `${level}-q2`,
    title: `${label} · 综合小测 B`,
    durationSec: 600,
    sections: [
      wordSection(level, words, rng, `${level}-q2-s1`, 6, 31),
      grammarSection(grammar, `${level}-q2-s2`, [6, 8, 10, 12]),
      readingSection(reading, `${level}-q2-s3`, 1, 4),
    ],
  };

  const quiz3 = {
    id: `${level}-q3`,
    title: `${label} · 词汇语法专项`,
    durationSec: 480,
    sections: [
      wordSection(level, words, rng, `${level}-q3-s1`, 8, 53),
      grammarSection(grammar, `${level}-q3-s2`, [14, 15, 16, 17, 18, 19]),
      readingSection(reading, `${level}-q3-s3`, 2, 4),
    ],
  };

  const modelSection = readingSection(reading, `${level}-q4-s3`, 3, 4);
  modelSection.questions.push(longStemQuestion(level, reading[0], `${level}-q4-s3`));

  const quiz4 = {
    id: `${level}-q4`,
    title: `${label} · 全真模拟`,
    durationSec: 900,
    sections: [
      wordSection(level, words, rng, `${level}-q4-s1`, 8, 11),
      grammarSection(grammar, `${level}-q4-s2`, [4, 5, 7, 9, 11, 13]),
      modelSection,
      writingSection(writing, rng, `${level}-q4-s4`),
    ],
  };

  return [quiz1, quiz2, quiz3, quiz4];
}

/* ------------------------------------------------------------------ */
/* 写盘                                                                */
/* ------------------------------------------------------------------ */

function pack(level, module, title, items) {
  return {
    schemaVersion: SCHEMA_VERSION,
    level,
    module,
    title,
    generatedAt: GENERATED_AT,
    items,
  };
}

function writePack(level, module, data) {
  const dir = resolve(OUT_DIR, level);
  mkdirSync(dir, { recursive: true });
  const file = resolve(dir, `${module}.json`);
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return file;
}

function main() {
  const stats = [];
  let longWordCount = 0;
  let maxPassageWords = 0;
  let maxStemLength = 0;

  LEVELS.forEach((level) => {
    const label = LEVEL_LABEL[level];
    const words = buildWords(level);
    const grammar = buildGrammar(level);
    const reading = buildReading(level);
    const writing = buildWriting(level);
    const speaking = buildSpeaking(level);
    const quiz = buildQuiz(level, words, grammar, reading, writing);

    words.forEach((w) => {
      if (w.term.length >= 15) longWordCount += 1;
    });
    reading.forEach((p) => {
      maxPassageWords = Math.max(maxPassageWords, p.wordCount);
      p.questions.forEach((q) => {
        maxStemLength = Math.max(maxStemLength, q.stem.length);
      });
    });
    grammar.forEach((g) =>
      g.exercises.forEach((q) => {
        maxStemLength = Math.max(maxStemLength, q.stem.length);
      }),
    );
    quiz.forEach((qz) =>
      qz.sections.forEach((s) =>
        s.questions.forEach((q) => {
          maxStemLength = Math.max(maxStemLength, q.stem.length);
        }),
      ),
    );

    // 每套测试卷必须覆盖 ≥3 个 moduleRef
    quiz.forEach((qz) => {
      const refs = new Set(qz.sections.map((s) => s.moduleRef));
      assert(refs.size >= 3, `${level}/${qz.id} 仅覆盖 ${refs.size} 个 moduleRef，应 ≥3`);
      assert(qz.durationSec > 0, `${level}/${qz.id} durationSec 应为正数`);
    });

    writePack(level, 'words', pack(level, 'words', `${label} · 核心词汇 100`, words));
    writePack(level, 'grammar', pack(level, 'grammar', `${label} · 语法专题 8 讲`, grammar));
    writePack(level, 'reading', pack(level, 'reading', `${label} · 精读 4 篇`, reading));
    writePack(level, 'writing', pack(level, 'writing', `${label} · 写作 3 题`, writing));
    writePack(level, 'speaking', pack(level, 'speaking', `${label} · 跟读 4 句`, speaking));
    writePack(level, 'quiz', pack(level, 'quiz', `${label} · 随堂测试 4 套`, quiz));

    stats.push({
      难度: label,
      单词: words.length,
      语法: grammar.length,
      阅读: reading.length,
      写作: writing.length,
      跟读: speaking.length,
      测试: quiz.length,
      最长篇目词数: Math.max(...reading.map((p) => p.wordCount)),
    });
  });

  // 坑 #4：占位数据必须含真实极端值
  assert(longWordCount >= 5, `≥15 字符的长单词只有 ${longWordCount} 个，应 ≥5`);
  assert(maxPassageWords >= 600, `最长篇目仅 ${maxPassageWords} 词，应 ≥600`);
  assert(maxStemLength >= 120, `最长题干仅 ${maxStemLength} 字，应 ≥120`);

  console.table(stats);
  console.log(
    `\n[gen-content] 已生成 ${LEVELS.length * 6} 个内容包 → src/content/<level>/<module>.json`,
  );
  console.log(
    `[gen-content] 极端值自检：长单词(≥15字符) ${longWordCount} 个 / 最长篇目 ${maxPassageWords} 词 / 最长题干 ${maxStemLength} 字\n`,
  );
}

main();
