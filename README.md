# 雅思 PWA 英语学习应用

手机优先、护眼、可断点续学的**纯前端离线** 雅思备考 PWA。
无后端、无 API key、无第三方账号；所有进度写本地 IndexedDB，断网可完整使用。

线上地址：<https://mistercharlesxiong.github.io/ielts-pwa/>

---

## 功能总览

| 模块 | 能力 |
|---|---|
| M1 单词 | 100 词/级，翻牌卡 + TTS 示范音 + 已掌握/学习中/未学三态，复习队列优先未掌握词 |
| M2 语法 | 8 语法点/级，规则与例句同屏，练习即时判分，错题自动入错题本 |
| M3 阅读 | 4 篇/级，专注模式（隐藏导航 / 行高 1.9 / 字号三档 / 羊皮纸·夜间墨屏），段落级进度记忆，选择题与判断题即时判分 |
| M4 写作 | 3 题/级，草稿自动保存，**本地规则批改**（字数 / 段落结构 / 连接词 / 高分句式），范文逐段对照接口已就绪 |
| M5 跟读 | 4 句/级，TTS 示范 + 录音 + AB 对比 + 实时波形；支持 Web Speech 时自动打分，否则降级为手动打星 |
| M6 测试 | 4 套/级，倒计时答题、自动交卷、总分与分项、错题本与一键重练 |
| 平台 | 六级难度、断点续学、连续打卡进度环、进度矩阵与成绩趋势、Web Audio 实时合成背景音乐（雨声/白噪/柔和琶音）、PWA 离线安装 |

## 技术栈

- **Vite 5 + React 18 + TypeScript（strict）**
- **Tailwind CSS**（设计 token 走 CSS 变量）+ **Framer Motion**（动效统一 ≤300ms，尊重「减弱动态效果」）
- **React Router `HashRouter`**（GitHub Pages 子路径刷新不 404）
- **Zustand + persist → IndexedDB**（`idb-keyval` 自定义 `StateStorage`，写入 300ms 防抖）
- **vite-plugin-pwa（Workbox）**：`autoUpdate` 预缓存 App Shell 与全部内容包
- 语音：`SpeechSynthesis` / `MediaRecorder` / `Web Speech API`（全部能力检测降级）
- 音乐：`Web Audio API` **实时合成**，零音频文件

> 明确不引入：MUI / Ant Design / 任何图表库 / zod / dexie / localforage / 音频素材包。

## 本地启动

```bash
npm install
npm run dev        # http://localhost:5173/ielts-pwa/
```

## 构建与本地预览

```bash
npm run build      # tsc -b && vite build
npm run preview    # 预览 dist，含 Service Worker
```

构建后请确认 `dist/index.html` 中所有资源路径均以 `/ielts-pwa/` 开头。

## 目录结构

```
src/
├── components/   # layout / ui / common / music 通用组件
├── constants/    # 难度、模块、动效预设、schema 版本、连接词库
├── content/      # 6 级 × 6 模块 = 36 个内容 JSON + 注册表 + 运行时校验
├── features/     # home / level / progress + 六大学习模块
├── hooks/        # TTS、录音、背景音乐、内容加载、打卡、倒计时
├── lib/          # 浏览器 API 与纯函数封装（表现层不直接碰 Web API）
├── store/        # 4 个 Zustand store（按变更频率切分）
├── styles/       # Tailwind 指令 + CSS 变量 token
└── types/        # 全量 TS 类型定义
```

## 部署

推送 `main` 分支即触发 `.github/workflows/deploy.yml`：
`npm ci` → `npm run build` → `upload-pages-artifact(dist)` → `deploy-pages`。

> **首次部署需手动操作一次**：仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**，否则 workflow 会 403。

## 内容扩充

内容包为纯 JSON，结构说明见 [`docs/content-schema.md`](docs/content-schema.md)。
新增内容只需把文件放进 `src/content/<level>/` 并在 `src/content/index.ts` 注册表加一行。

## 浏览器兼容与降级

| 能力 | 不支持时的表现 |
|---|---|
| SpeechSynthesis | 隐藏朗读按钮，其余功能不受影响 |
| MediaRecorder / 麦克风权限 | 保留示范音与手动打星自评 |
| Web Speech 识别（iOS Safari 无 / **离线时不可用**） | 自动降级为手动打星，并提示「离线状态下改为自评模式」 |
| AudioContext | 隐藏音乐入口 |
| IndexedDB（Safari 无痕模式） | 降级内存存储，首页顶部常驻提示「当前浏览器无法保存进度」 |
