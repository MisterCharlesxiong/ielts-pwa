# 内容包 Schema 说明（v1）

> 面向对象：内容编辑 / 教研同学。
> 目标：不看代码也能写出一份能被 App 正确加载的 JSON。
>
> 代码对应关系：
> - 类型定义 `src/types/content.ts`
> - 运行时校验 `src/content/schema.ts`（`validateContentPack`）
> - 加载注册表 `src/content/index.ts`
> - 生成脚本 `scripts/gen-content.mjs` + `scripts/seeds/*.mjs`

---

## 0. 一分钟速览

| 项 | 值 |
| --- | --- |
| 当前 schemaVersion | `1`（常量 `CONTENT_SCHEMA_VERSION`） |
| 文件路径 | `src/content/<level>/<module>.json` |
| 难度 level | `junior` `senior` `college` `ielts55` `ielts65` `ielts7plus` |
| 模块 module | `words` `grammar` `reading` `writing` `speaking` `quiz` |
| 文件总数 | 6 × 6 = 36 |
| 编码 | UTF-8，无 BOM，2 空格缩进 |

**重要**：`src/content/<level>/<module>.json` 由 `node scripts/gen-content.mjs` 生成，
**不要手工编辑**，否则下次生成会被覆盖。要改内容请改 `scripts/seeds/*.mjs` 后重新生成。
外部投稿的 JSON 走「设置 → 导入内容包」（`contentLoader.importPack`），不落盘、只进内存缓存。

---

## 1. 统一信封

每个 JSON 文件的顶层结构完全一致：

```json
{
  "schemaVersion": 1,
  "level": "junior",
  "module": "words",
  "title": "初中 · 核心词汇 100",
  "generatedAt": "2026-07-31T00:00:00.000Z",
  "items": []
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `schemaVersion` | number | 是 | 必须 **等于** `1`，不等直接判定加载失败 |
| `level` | string | 是 | 必须与所在目录名一致，否则加载失败 |
| `module` | string | 是 | 必须与文件名（去掉 `.json`）一致，否则加载失败 |
| `title` | string | 是 | 展示在模块首页顶部 |
| `generatedAt` | string | 是 | ISO 8601。生成器写死为固定值，避免每次重跑产生无意义 diff |
| `items` | array | 是 | 条目数组，元素结构见第 3 节 |

### 校验的严重级别

- **致命（加载失败，页面显示 EmptyState）**：`schemaVersion` / `level` / `module` 不匹配，或 `items` 不是数组。
- **告警（照常加载，控制台 `console.warn`）**：单条 item 缺字段。
  设计意图是「一条脏数据不能拖垮整个模块」。

---

## 2. 数量基线（PRD 4.10）

| module | 每级条目数 | 附加要求 |
| --- | --- | --- |
| `words` | 100 | term 在同一级内不得重复 |
| `grammar` | 8 | 每讲 ≥1 例句、≥3 练习 |
| `reading` | 4 | 每篇 ≥4 题；题型仅 `single` / `boolean` |
| `writing` | 3 | `requiredConnectives`、`advancedPatterns` 必须填实 |
| `speaking` | 4 | — |
| `quiz` | 4 | 每套至少覆盖 3 个不同 `moduleRef` |

### 极端值要求（必须真实存在，不是「以后补」）

全量内容中必须包含：

1. **≥5 个长度 ≥15 字符的单词**（验证卡片不溢出、不截断）；
   当前实际 7 个，例如 `internationalisation`(20)、`interdisciplinary`(17)、
   `counterproductive`(17)、`differentiation`(15)。
2. **≥1 篇 ≥600 词的长文**（验证段落级进度与滚动性能）；
   当前 `junior/reading` 首篇 *The School Recycling Project* 为 640 词。
3. **≥1 道 ≥120 字的长题干**（验证 375px 窄屏换行）；
   当前每级第 4 套模拟卷各注入 1 道，最长 274 字。

以上三条在 `scripts/gen-content.mjs` 的 `main()` 末尾用断言硬校验，不满足直接 `exit 1`。

---

## 3. 各模块条目结构

### 3.1 题目通用结构 `Question`

三种题型全部可离线判分。

```json
{
  "id": "junior-r1-q1",
  "type": "single",
  "stem": "题干文本",
  "options": [{ "key": "A", "text": "选项文本" }],
  "answer": "A",
  "explanation": "解析，答题后展示",
  "points": 1,
  "moduleRef": "reading"
}
```

| 字段 | 必填 | 规则 |
| --- | --- | --- |
| `id` | 是 | 全局唯一，建议 `<level>-<模块缩写><序号>` |
| `type` | 是 | `single`（单选）/ `boolean`（判断）/ `blank`（填空） |
| `stem` | 是 | 非空字符串 |
| `options` | `single` 必填 | ≥2 项，每项 `{ key, text }`；`key` 用 A/B/C/D |
| `answer` | 是 | `single` → 选项 key；`boolean` → 字符串 `"true"` / `"false"`（**不是布尔值**）；`blank` → 字符串或非空字符串数组（数组表示多个可接受答案） |
| `explanation` | 否 | 建议写，答题反馈的主要价值来源 |
| `points` | 否 | 默认 1 |
| `moduleRef` | 测试卷内必填 | 用于成绩页分项统计 |

> ⚠️ `boolean` 的 `answer` 写成 `true`（布尔）会被判为非法。必须是字符串 `"true"`。

### 3.2 `words` — 单词

```json
{
  "id": "junior-w1",
  "term": "environment",
  "phonetic": "/ɪnˈvaɪrənmənt/",
  "pos": "n.",
  "meaningCn": "环境",
  "example": "We should protect the environment.",
  "exampleCn": "我们应该保护环境。",
  "tags": ["初中"]
}
```

必填：`id` `term` `phonetic` `meaningCn` `example`。
`phonetic` 请带上首尾斜杠；`pos` 用 `n.` `v.` `adj.` `adv.` `n./v.` 这类缩写。

### 3.3 `grammar` — 语法

```json
{
  "id": "junior-g1",
  "title": "一般现在时",
  "ruleText": "表示**经常性、习惯性**的动作。\n第三人称单数要加 -s / -es。",
  "examples": [{ "en": "She goes to school by bike.", "cn": "她骑自行车上学。" }],
  "exercises": [{ "id": "junior-g1-e1", "type": "single", "stem": "…", "options": [], "answer": "A" }]
}
```

必填：`id` `title` `ruleText`，`examples` ≥1，`exercises` ≥3。
`ruleText` 只支持 **轻 markdown**：`**加粗**` 与换行 `\n`，其余标记会被原样显示。

### 3.4 `reading` — 阅读

```json
{
  "id": "junior-r1",
  "title": "The School Recycling Project",
  "wordCount": 640,
  "estMinutes": 4,
  "paragraphs": ["第一段…", "第二段…"],
  "questions": [],
  "glossary": [{ "term": "recycle", "meaningCn": "回收利用" }]
}
```

必填：`id` `title`，`paragraphs` 非空，`questions` ≥4。

- `paragraphs` **必须按段拆分**：段落级阅读进度（读到第几段）直接依赖数组下标，
  把整篇塞进一个字符串会导致「继续阅读」永远从头开始。
- `wordCount` / `estMinutes` 由生成器按 160 wpm 自动计算，手写时请保持自洽。
- `glossary` 可选，为「划词查词」预留。
- **首版阅读题不支持 `blank`**，只能用 `single` / `boolean`。

### 3.5 `writing` — 写作

```json
{
  "id": "ielts55-wr1",
  "taskType": "task2",
  "prompt": "题目正文…",
  "minWords": 250,
  "suggestedStructure": ["第 1 步…", "第 2 步…", "第 3 步…", "第 4 步…"],
  "requiredConnectives": ["On the one hand", "In conclusion"],
  "advancedPatterns": [
    {
      "name": "强调句",
      "template": "It is ... that ...",
      "sample": "It is motivation that matters most.",
      "regex": "It is [\\s\\S]{1,60} that"
    }
  ],
  "modelEssay": {
    "paragraphs": [{ "role": "intro", "en": "…", "cn": "…", "note": "该段写作要点" }]
  }
}
```

| 字段 | 必填 | 规则 |
| --- | --- | --- |
| `taskType` | 是 | `task1` / `task2` / `general` |
| `minWords` | 是 | 正整数。本地批改「字数」维度（占 35%）以此为基准线 |
| `suggestedStructure` | 是 | 字符串数组，**建议 ≥4 步**（测试卷会从中抽题，少于 4 步生成不了干扰项） |
| `requiredConnectives` | 是 | **不能为空**。为空时「连接词」维度（25%）恒为 0 分 |
| `advancedPatterns` | 是 | **不能为空**。为空时「句式」维度（15%）恒为 0 分 |
| `modelEssay` | 否 | 缺省时 UI 渲染「范文即将上线」占位，不报错 |

`advancedPatterns[].regex` 是**字符串形式**的正则（运行时 `new RegExp(regex, 'i')`）：

- JSON 里反斜杠要转义两次：正则 `\s` 在 JSON 中写作 `"\\s"`；
- 不写 `regex` 时，批改器退化为对 `template` 做去符号的子串匹配，准确率更低，建议尽量写；
- 不要写会灾难性回溯的模式（如 `(a+)+`），批改是在主线程同步跑的。

### 3.6 `speaking` — 跟读

```json
{
  "id": "junior-sp1",
  "text": "Could you tell me how to get to the nearest bus stop?",
  "translationCn": "你能告诉我怎么去最近的公交车站吗？",
  "ipa": "/kʊd juː tel miː …/",
  "speakRate": 0.85
}
```

必填：`id` `text`。`speakRate` 缺省 0.9（SpeechSynthesis 语速）。

内容撰写约定：

- **不要出现阿拉伯数字**（如 `2020`）和**带点缩写**（如 `e.g.`）。
  语音识别对这两类的输出形式差异极大（`2020` 可能被识别为 `twenty twenty`），
  会导致相似度打分剧烈抖动。
- `ipa` 建议填写：在不支持 Web Speech 识别的浏览器（如 iOS Safari、离线状态）下，
  App 会降级为「自评模式」，此时音标是用户唯一的对照依据。

### 3.7 `quiz` — 测试卷

```json
{
  "id": "junior-q1",
  "title": "初中 · 综合小测 A",
  "durationSec": 600,
  "sections": [
    {
      "id": "junior-q1-s1",
      "title": "词汇",
      "moduleRef": "words",
      "questions": []
    }
  ]
}
```

必填：`id` `title`，`durationSec` > 0，`sections` 非空；
每个 section 必须有 `id` / `moduleRef` / 非空 `questions`。

- `moduleRef` 取值同 module 名，用于成绩页的分项雷达统计；
- **每套卷至少覆盖 3 个不同 `moduleRef`**（生成器硬校验）；
- `durationSec` 是计时上限，倒计时归零自动交卷。

---

## 4. 新增 / 修改内容的完整流程

1. 编辑 `scripts/seeds/` 下对应的种子文件：
   - `words.<level>.mjs` — 一行一个词，`term|phonetic|pos|meaningCn|example|exampleCn`
     （`phonetic` **不带**斜杠，生成器自动补 `/.../`）；
   - `grammar.mjs` / `reading.mjs` / `writing.mjs` / `speaking.mjs` — 按各自导出的对象填写；
   - `quiz` **没有种子文件**：测试卷由脚本从其余四个模块自动装配，保证题目与内容永远同步。
2. 运行 `node scripts/gen-content.mjs`。脚本会：
   - 校验数量基线与字段完整性，任何一条不满足直接报错退出；
   - 输出 6×6 统计表与极端值自检结果。
3. 如果新增了一整个难度或模块，**必须**在 `src/content/index.ts` 的
   `CONTENT_REGISTRY` 里补上对应的一行 `() => import('./<level>/<module>.json')`。
   这里必须是**字面量路径**，不能用模板字符串拼接 —— 否则 Vite 无法静态分析，
   内容包既不会被正确分包，也不会进入 PWA 预缓存清单，离线首次访问会白屏。
4. 运行 `npm run build` 确认类型与构建通过。

---

## 5. 常见错误对照表

| 控制台信息 | 原因 | 修复 |
| --- | --- | --- |
| `内容包 x/y 的 schemaVersion=…，期望 1` | 顶层版本号写错 | 改为 `1` |
| `内容包 level=…，期望 junior` | 文件放错目录 | 让 `level` 与目录名一致 |
| `注册表中找不到 x/y` | 忘了改 `src/content/index.ts` | 补注册表 |
| `…answer 应为 'true' 或 'false'` | 判断题答案写成了布尔 `true` | 改成字符串 `"true"` |
| `…questions 至少 4 题` | 阅读篇目题量不足 | 补题 |
| `…阅读题首版不支持填空题` | 阅读题用了 `blank` | 改成 `single` / `boolean` |
| `…requiredConnectives 不能为空` | 写作题连接词留空 | 至少填 1 个 |
| 页面显示 EmptyState 且无报错 | `items` 为空数组 | 检查生成脚本是否真的写了内容 |
