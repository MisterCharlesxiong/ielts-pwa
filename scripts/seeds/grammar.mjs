/**
 * 语法种子：6 级 × 8 讲，每讲 ≥1 例句、≥3 练习。
 *
 * 紧凑题目格式：
 *   { t:'s', stem, opts:['A|文本', ...], a:'B', ex:'解析' }
 *   { t:'b', stem, a:true|false, ex:'解析' }
 *   { t:'k', stem, a:'答案' 或 ['答案1','答案2'], ex:'解析' }
 *
 * ruleText 支持轻 markdown（仅 ** 加粗与换行），与 GrammarPointView 渲染约定一致。
 */

export const GRAMMAR = {
  /* ------------------------------ 初中 ------------------------------ */
  junior: [
    {
      title: '一般现在时',
      ruleText:
        '表示**经常发生的动作**或**客观事实**。\n主语为第三人称单数时，动词加 -s / -es；\n否定用 don\'t / doesn\'t，疑问用 do / does 提问。',
      examples: [
        ['She goes to school by bike every day.', '她每天骑自行车上学。'],
        ['Water boils at 100 degrees Celsius.', '水在一百摄氏度时沸腾。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'My sister ______ English every morning.',
          opts: ['A|study', 'B|studies', 'C|studying'],
          a: 'B',
          ex: '主语 My sister 是第三人称单数，动词用 studies（辅音字母 + y 变 ies）。',
        },
        {
          t: 'b',
          stem: '判断：一般现在时可以用来描述“太阳从东边升起”这样的客观事实。',
          a: true,
          ex: '客观真理、自然规律一律用一般现在时。',
        },
        {
          t: 'k',
          stem: '填空：He ______ (not like) sweet food.',
          a: ["doesn't like", 'does not like'],
          ex: '第三人称单数否定用 doesn\'t + 动词原形。',
        },
      ],
    },
    {
      title: '一般过去时',
      ruleText:
        '表示**过去某个时间发生并已结束**的动作。\n规则动词加 -ed，不规则动词需单独记忆；\n否定与疑问借助助动词 did，其后动词回归原形。',
      examples: [
        ['We visited the science museum last Friday.', '上周五我们参观了科学博物馆。'],
        ['He did not finish his homework yesterday.', '他昨天没有做完作业。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'They ______ a wonderful film last night.',
          opts: ['A|watch', 'B|watched', 'C|watches'],
          a: 'B',
          ex: 'last night 是过去时间标志，用过去式 watched。',
        },
        {
          t: 's',
          stem: 'Did you ______ your keys at home?',
          opts: ['A|left', 'B|leave', 'C|leaves'],
          a: 'B',
          ex: '助动词 did 之后动词一律用原形。',
        },
        {
          t: 'b',
          stem: '判断：“I goed to the park.” 是正确的一般过去时表达。',
          a: false,
          ex: 'go 的过去式是不规则形式 went，不能加 -ed。',
        },
      ],
    },
    {
      title: '现在进行时',
      ruleText:
        '结构为 **be + 现在分词**，表示说话时正在发生的动作，\n也可表示**已确定的近期安排**（常与 tomorrow / tonight 连用）。',
      examples: [
        ['Listen! The birds are singing outside.', '听！鸟儿正在外面唱歌。'],
        ['We are leaving for Beijing tomorrow.', '我们明天动身去北京。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'Look! The children ______ football on the playground.',
          opts: ['A|play', 'B|are playing', 'C|played'],
          a: 'B',
          ex: 'Look! 提示动作正在进行，用现在进行时。',
        },
        {
          t: 'k',
          stem: '填空：I ______ (write) a letter to my pen friend now.',
          a: ['am writing'],
          ex: '第一人称单数用 am + 现在分词。',
        },
        {
          t: 'b',
          stem: '判断：know、like、belong 这类表示状态的动词通常不用于现在进行时。',
          a: true,
          ex: '静态动词一般不用进行时，这是初中阶段的高频考点。',
        },
      ],
    },
    {
      title: '一般将来时',
      ruleText:
        '两种常见形式：**will + 动词原形**（临时决定、预测）与 **be going to + 动词原形**（计划、有迹象的推测）。',
      examples: [
        ['I will help you with the boxes.', '我来帮你搬箱子。'],
        ['Look at the clouds — it is going to rain.', '看那些云——要下雨了。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'The phone is ringing. I ______ answer it.',
          opts: ['A|will', 'B|am going to', 'C|was'],
          a: 'A',
          ex: '说话瞬间做出的决定用 will。',
        },
        {
          t: 's',
          stem: 'She has bought the tickets. She ______ travel to Xi an.',
          opts: ['A|will', 'B|is going to', 'C|went'],
          a: 'B',
          ex: '已有安排、有明显迹象，用 be going to。',
        },
        {
          t: 'b',
          stem: '判断：在 if 引导的条件状语从句中，将来的动作要用一般现在时表示。',
          a: true,
          ex: '主将从现：If it rains tomorrow, we will stay at home.',
        },
      ],
    },
    {
      title: '可数名词与不可数名词',
      ruleText:
        '可数名词有单复数，可用 a / an / many / a few 修饰；\n不可数名词无复数，用 much / a little / a piece of 等量词修饰。\n**some 与 any** 既可修饰可数复数也可修饰不可数名词。',
      examples: [
        ['There are a few apples in the basket.', '篮子里有几个苹果。'],
        ['We need a little more information.', '我们需要多一点信息。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'How ______ water do you drink every day?',
          opts: ['A|many', 'B|much', 'C|few'],
          a: 'B',
          ex: 'water 不可数，用 much 提问。',
        },
        {
          t: 's',
          stem: 'I bought two ______ of bread this morning.',
          opts: ['A|piece', 'B|pieces', 'C|breads'],
          a: 'B',
          ex: 'bread 不可数，用 two pieces of bread。',
        },
        {
          t: 'b',
          stem: '判断：advice、news、homework 都是不可数名词。',
          a: true,
          ex: '这三个词在英语中均不可数，是中考高频陷阱。',
        },
      ],
    },
    {
      title: '形容词与副词的比较级、最高级',
      ruleText:
        '单音节词加 -er / -est；多音节词用 more / most。\n比较级常与 **than** 连用，最高级前通常加 **the** 并限定范围。\n注意不规则形式：good→better→best，bad→worse→worst。',
      examples: [
        ['This road is wider than that one.', '这条路比那条宽。'],
        ['He runs the fastest in our class.', '他在我们班跑得最快。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'Your handwriting is much ______ than mine.',
          opts: ['A|good', 'B|better', 'C|best'],
          a: 'B',
          ex: 'than 前用比较级；much 用于修饰比较级表示程度。',
        },
        {
          t: 's',
          stem: 'Of the three plans, this one is ______ .',
          opts: ['A|practical', 'B|more practical', 'C|the most practical'],
          a: 'C',
          ex: '三者以上比较用最高级，前面加 the。',
        },
        {
          t: 'k',
          stem: '填空：The film was ______ (interesting) than I expected.',
          a: ['more interesting'],
          ex: 'interesting 为多音节形容词，比较级用 more interesting。',
        },
      ],
    },
    {
      title: '情态动词 can / must / should',
      ruleText:
        'can 表示**能力或许可**；must 表示**必须或强烈推测**；should 表示**建议**。\n情态动词后一律接动词原形，本身没有人称变化。',
      examples: [
        ['You should drink more water in summer.', '夏天你应该多喝水。'],
        ['She must be at home; her bike is here.', '她一定在家，她的自行车在这儿。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'You ______ swim here; the water is too deep.',
          opts: ['A|must not', 'B|need not', 'C|may not'],
          a: 'A',
          ex: 'must not 表示“禁止”，语气最强，符合危险提示语境。',
        },
        {
          t: 's',
          stem: '— Whose umbrella is this? — It ______ be Tom s; he was the only one out.',
          opts: ['A|can', 'B|must', 'C|should'],
          a: 'B',
          ex: 'must 在肯定句中表示很有把握的推测。',
        },
        {
          t: 'b',
          stem: '判断：情态动词后面必须接动词原形，不能接 to do。',
          a: true,
          ex: 'can / must / should 后接动词原形；ought 是例外，需接 to do。',
        },
      ],
    },
    {
      title: 'There be 句型',
      ruleText:
        '**There be + 名词 + 地点/时间**，表示“某处有某物”。\nbe 动词与**紧跟其后的第一个名词**保持数的一致（就近原则）。',
      examples: [
        ['There is a library and two labs in our school.', '我们学校有一个图书馆和两个实验室。'],
        ['There were many people at the concert.', '音乐会上有很多人。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'There ______ a pen and three books on the desk.',
          opts: ['A|is', 'B|are', 'C|have'],
          a: 'A',
          ex: '就近原则：紧跟 be 的是单数 a pen，故用 is。',
        },
        {
          t: 's',
          stem: '______ any milk in the fridge?',
          opts: ['A|Is there', 'B|Are there', 'C|Does there have'],
          a: 'A',
          ex: 'milk 不可数，用 Is there；There be 句型不能用 have。',
        },
        {
          t: 'b',
          stem: '判断：“Our school has a big playground.” 与 “There is a big playground in our school.” 都成立。',
          a: true,
          ex: '两种说法都正确，但 There be 强调“存在”，have 强调“所属”。',
        },
      ],
    },
  ],

  /* ------------------------------ 高中 ------------------------------ */
  senior: [
    {
      title: '现在完成时',
      ruleText:
        '结构 **have / has + 过去分词**，强调过去动作对**现在造成的影响**或**持续到现在**的状态。\n常与 already / yet / ever / never / since / for 连用。',
      examples: [
        ['I have known him since we were children.', '我从小就认识他。'],
        ['She has already submitted her application.', '她已经提交了申请。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'We ______ in this city for over ten years.',
          opts: ['A|live', 'B|have lived', 'C|lived'],
          a: 'B',
          ex: 'for + 一段时间，强调持续到现在，用现在完成时。',
        },
        {
          t: 's',
          stem: '______ you ever ______ a live concert?',
          opts: ['A|Did … attend', 'B|Have … attended', 'C|Are … attending'],
          a: 'B',
          ex: 'ever 表示“曾经”，与现在完成时搭配。',
        },
        {
          t: 'b',
          stem: '判断：“I have finished my homework yesterday.” 是正确的句子。',
          a: false,
          ex: '现在完成时不能与 yesterday 等明确的过去时间状语连用，应改为一般过去时。',
        },
      ],
    },
    {
      title: '过去进行时与时间背景',
      ruleText:
        '**was / were + 现在分词**，描写过去某一时刻正在进行的动作，\n常与 when / while 搭配：**while + 进行时**作背景，**when + 一般过去时**作突发事件。',
      examples: [
        ['While I was cooking, the doorbell rang.', '我做饭的时候，门铃响了。'],
        ['They were arguing when the teacher came in.', '老师进来时他们正在争论。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'I ______ my notes when the lights suddenly went out.',
          opts: ['A|reviewed', 'B|was reviewing', 'C|have reviewed'],
          a: 'B',
          ex: '被打断的背景动作用过去进行时。',
        },
        {
          t: 's',
          stem: '______ she was waiting for the bus, she read a whole chapter.',
          opts: ['A|When', 'B|While', 'C|As soon as'],
          a: 'B',
          ex: 'while 引导延续性背景动作。',
        },
        {
          t: 'k',
          stem: '填空：At nine o clock last night, we ______ (discuss) the project.',
          a: ['were discussing'],
          ex: '过去某一具体时刻正在进行，用过去进行时。',
        },
      ],
    },
    {
      title: '被动语态',
      ruleText:
        '结构 **be + 过去分词**，强调动作的承受者。\n当施动者不明、不重要或不便提及时优先使用；需要点明时用 **by + 施动者**。',
      examples: [
        ['The bridge was built in 1998.', '这座桥建于 1998 年。'],
        ['New rules are being introduced this term.', '本学期正在推行新规定。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'The results ______ next Monday.',
          opts: ['A|will announce', 'B|will be announced', 'C|are announcing'],
          a: 'B',
          ex: 'results 是动作承受者，用将来时被动 will be announced。',
        },
        {
          t: 's',
          stem: 'This kind of paper ______ from recycled wood.',
          opts: ['A|makes', 'B|is made', 'C|is making'],
          a: 'B',
          ex: 'be made from 表示“由……制成”（原料发生化学变化）。',
        },
        {
          t: 'b',
          stem: '判断：happen、appear、belong to 这类不及物动词没有被动语态。',
          a: true,
          ex: '不及物动词无宾语，因此不能变被动。',
        },
      ],
    },
    {
      title: '定语从句（关系代词）',
      ruleText:
        '用 who / whom / which / that / whose 引导，修饰前面的先行词。\n**先行词是人**用 who / that；**是物**用 which / that；\n表示所属关系用 whose。关系代词在从句中作宾语时可省略。',
      examples: [
        ['The student who won the prize is my cousin.', '获奖的那名学生是我表弟。'],
        ['This is the book (which) I told you about.', '这就是我跟你说过的那本书。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'The house ______ roof is red belongs to my aunt.',
          opts: ['A|which', 'B|whose', 'C|that'],
          a: 'B',
          ex: 'whose 表示所属，修饰 roof。',
        },
        {
          t: 's',
          stem: 'This is the only method ______ works in practice.',
          opts: ['A|which', 'B|that', 'C|what'],
          a: 'B',
          ex: '先行词被 the only 修饰时，关系代词只能用 that。',
        },
        {
          t: 'b',
          stem: '判断：非限制性定语从句可以用 that 引导。',
          a: false,
          ex: '非限制性定语从句（有逗号）不能用 that，只能用 which / who。',
        },
      ],
    },
    {
      title: '宾语从句',
      ruleText:
        '由 that / whether / if 或疑问词引导，充当及物动词或介词的宾语。\n三要素：**引导词、语序（陈述语序）、时态呼应**。\n主句为过去时，从句时态一般相应后移（客观真理除外）。',
      examples: [
        ['She asked whether the library was still open.', '她问图书馆是否还开着。'],
        ['He told me that light travels faster than sound.', '他告诉我光比声音传播得快。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'Could you tell me ______ ?',
          opts: ['A|where is the station', 'B|where the station is', 'C|where is station'],
          a: 'B',
          ex: '宾语从句必须用陈述语序。',
        },
        {
          t: 's',
          stem: 'The teacher explained that the earth ______ around the sun.',
          opts: ['A|moved', 'B|moves', 'C|had moved'],
          a: 'B',
          ex: '客观真理不受主句时态影响，仍用一般现在时。',
        },
        {
          t: 'k',
          stem: '填空：I wonder ______ he will accept the offer.（填一个引导词）',
          a: ['whether', 'if'],
          ex: '表示“是否”，可用 whether 或 if。',
        },
      ],
    },
    {
      title: '状语从句（时间与条件）',
      ruleText:
        '时间状语从句常用 when / while / as soon as / until；\n条件状语从句常用 if / unless / as long as。\n**主将从现**：主句用将来时，从句用一般现在时表将来。',
      examples: [
        ['I will call you as soon as I arrive.', '我一到就给你打电话。'],
        ['Unless you practise daily, progress will be slow.', '除非每天练习，否则进步会很慢。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'We will start the meeting when everyone ______ here.',
          opts: ['A|will be', 'B|is', 'C|was'],
          a: 'B',
          ex: '主将从现，从句用一般现在时。',
        },
        {
          t: 's',
          stem: '______ you leave now, you will miss the train.',
          opts: ['A|If', 'B|Unless', 'C|Although'],
          a: 'B',
          ex: 'Unless = if…not，符合“除非现在走，否则赶不上”的逻辑。',
        },
        {
          t: 'b',
          stem: '判断：until 引导的从句中，主句若为否定，常译作“直到……才”。',
          a: true,
          ex: 'not … until 是固定的“直到……才”结构。',
        },
      ],
    },
    {
      title: '非谓语动词：不定式与动名词',
      ruleText:
        '不定式 **to do** 多表示具体的、将来的动作；动名词 **doing** 多表示抽象的、习惯性的动作。\n注意固定搭配：enjoy / avoid / suggest + doing；decide / hope / manage + to do。\n**stop / remember / forget** 后接两者含义不同。',
      examples: [
        ['He stopped smoking last year.', '他去年戒烟了。'],
        ['He stopped to smoke outside the building.', '他停下来到楼外抽烟。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'She avoided ______ the same mistake twice.',
          opts: ['A|to make', 'B|making', 'C|make'],
          a: 'B',
          ex: 'avoid 后接动名词。',
        },
        {
          t: 's',
          stem: 'Remember ______ the door when you leave.',
          opts: ['A|locking', 'B|to lock', 'C|locked'],
          a: 'B',
          ex: 'remember to do 表示“记得去做（尚未做）”。',
        },
        {
          t: 'b',
          stem: '判断：“I am looking forward to hear from you.” 语法正确。',
          a: false,
          ex: 'look forward to 中 to 是介词，后接动名词 hearing。',
        },
      ],
    },
    {
      title: '虚拟语气入门',
      ruleText:
        '与**现在**事实相反：if + 过去式，主句 would / could + 动词原形；\n与**过去**事实相反：if + had done，主句 would have done。\nI wish 后的从句同样使用虚拟形式。',
      examples: [
        ['If I were you, I would apologise first.', '如果我是你，我会先道歉。'],
        ['I wish I had started earlier.', '我真希望当初早点开始。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'If I ______ more time, I would learn a second language.',
          opts: ['A|have', 'B|had', 'C|will have'],
          a: 'B',
          ex: '与现在事实相反，条件句用过去式。',
        },
        {
          t: 's',
          stem: 'If she had left earlier, she ______ the flight.',
          opts: ['A|would catch', 'B|would have caught', 'C|caught'],
          a: 'B',
          ex: '与过去事实相反，主句用 would have + 过去分词。',
        },
        {
          t: 'k',
          stem: '填空：I wish it ______ (stop) raining now.',
          a: ['would stop'],
          ex: 'wish 后表示对将来的愿望，用 would + 动词原形。',
        },
      ],
    },
  ],

  /* ------------------------------ 大学 ------------------------------ */
  college: [
    {
      title: '完成进行时的语用价值',
      ruleText:
        '**have been doing** 同时强调“持续”与“未完成”，常用于说明**过程本身**而非结果。\n学术写作中用于描述一段时间以来学界的持续关注。',
      examples: [
        ['Researchers have been debating this issue for two decades.', '研究者就这一议题争论了二十年。'],
        ['The team had been collecting data before the funding ended.', '资金结束前团队一直在收集数据。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'Scholars ______ this phenomenon since the 1990s.',
          opts: ['A|study', 'B|have been studying', 'C|studied'],
          a: 'B',
          ex: 'since + 时间点，强调持续过程，用现在完成进行时。',
        },
        {
          t: 's',
          stem: 'By 2020 the group ______ the survey for five years.',
          opts: ['A|had been running', 'B|has been running', 'C|is running'],
          a: 'A',
          ex: 'By 2020 是过去时间基准，用过去完成进行时。',
        },
        {
          t: 'b',
          stem: '判断：完成进行时既可强调动作持续，也可暗示动作可能尚未结束。',
          a: true,
          ex: '这正是它与完成时的核心区别。',
        },
      ],
    },
    {
      title: '名词性从句总览',
      ruleText:
        '名词性从句包括**主语从句、宾语从句、表语从句、同位语从句**。\n引导词 that 在同位语从句中不可省略，在宾语从句中常可省略。\n主语从句冗长时常用 **It is … that …** 后置。',
      examples: [
        ['It is widely accepted that early feedback improves learning.', '人们普遍认为及时反馈有助于学习。'],
        ['The fact that she declined surprised everyone.', '她拒绝这一事实让所有人吃惊。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '______ he will accept the post remains unclear.',
          opts: ['A|That', 'B|Whether', 'C|If'],
          a: 'B',
          ex: '主语从句表示“是否”时只能用 whether，不能用 if。',
        },
        {
          t: 's',
          stem: 'The idea ______ money guarantees happiness is questionable.',
          opts: ['A|which', 'B|that', 'C|what'],
          a: 'B',
          ex: '同位语从句解释 idea 的内容，用 that 引导且不作成分。',
        },
        {
          t: 'b',
          stem: '判断：同位语从句中的 that 可以像宾语从句一样省略。',
          a: false,
          ex: '同位语从句的 that 不可省略。',
        },
      ],
    },
    {
      title: '倒装结构',
      ruleText:
        '否定副词（never / seldom / hardly / not only）置于句首时需**部分倒装**。\nonly + 状语置于句首同样倒装。\n倒装的作用是**强调**并调整信息重心。',
      examples: [
        ['Never have I seen such a clear explanation.', '我从未见过如此清晰的解释。'],
        ['Only after the trial did the pattern become obvious.', '直到试验之后规律才变得明显。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'Not until the deadline ______ the seriousness of the task.',
          opts: ['A|they realised', 'B|did they realise', 'C|they did realise'],
          a: 'B',
          ex: 'Not until 置于句首，主句部分倒装。',
        },
        {
          t: 's',
          stem: 'Seldom ______ such a well-organised report.',
          opts: ['A|we read', 'B|do we read', 'C|we do read'],
          a: 'B',
          ex: 'Seldom 为否定副词，句首触发部分倒装。',
        },
        {
          t: 'b',
          stem: '判断：Not only 位于句首时，只需前半句倒装，后半句保持正常语序。',
          a: true,
          ex: 'Not only did he …, but he also … 是标准形式。',
        },
      ],
    },
    {
      title: '强调句 It is … that …',
      ruleText:
        '结构 **It is / was + 被强调成分 + that / who + 其余部分**。\n可强调主语、宾语、状语，但**不能强调谓语动词**。\n判断方法：去掉 It is … that 后句子依然完整。',
      examples: [
        ['It was in 2015 that the policy took effect.', '正是在 2015 年该政策开始生效。'],
        ['It is the method, not the tool, that matters.', '重要的是方法，而不是工具。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'It was her attitude ______ impressed the interviewers most.',
          opts: ['A|which', 'B|that', 'C|what'],
          a: 'B',
          ex: '强调句固定用 that（强调人时可用 who）。',
        },
        {
          t: 's',
          stem: '选出属于强调句的一项：',
          opts: [
            'A|It is obvious that he is tired.',
            'B|It was yesterday that she handed in the form.',
            'C|It seems that nobody knows.',
          ],
          a: 'B',
          ex: '去掉 It was … that 后 “She handed in the form yesterday.” 依然成立，故为强调句。',
        },
        {
          t: 'b',
          stem: '判断：强调句可以用来强调句中的谓语动词。',
          a: false,
          ex: '强调谓语需借助 do / does / did，而非 It is … that 结构。',
        },
      ],
    },
    {
      title: '独立主格结构',
      ruleText:
        '**名词 / 代词 + 分词、形容词、介词短语**构成独立主格，作状语，\n其逻辑主语与主句主语**不一致**，书面语中用于压缩信息。',
      examples: [
        ['All things considered, the plan is workable.', '综合考虑，该计划可行。'],
        ['The experiment finished, the team wrote up the results.', '实验结束后，团队撰写了结果。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '______ , we set off before dawn.',
          opts: ['A|The weather being fine', 'B|The weather is fine', 'C|Being fine weather'],
          a: 'A',
          ex: '独立主格：名词 + 现在分词。',
        },
        {
          t: 's',
          stem: 'He sat by the window, ______ in his hand.',
          opts: ['A|a book', 'B|with a book', 'C|holding a book'],
          a: 'B',
          ex: 'with 复合结构是独立主格的常见变体。',
        },
        {
          t: 'b',
          stem: '判断：独立主格的逻辑主语必须与主句主语一致。',
          a: false,
          ex: '恰恰相反，逻辑主语不一致才使用独立主格。',
        },
      ],
    },
    {
      title: '分词作状语与悬垂修饰',
      ruleText:
        '现在分词表**主动/同时**，过去分词表**被动/完成**。\n分词的逻辑主语必须是主句主语，否则构成**悬垂修饰**（dangling modifier），属学术写作硬伤。',
      examples: [
        ['Written in plain English, the guide reaches a wide audience.', '该指南以浅白英语写成，读者面很广。'],
        ['Having reviewed the data, the author revised two claims.', '查阅数据后，作者修改了两处论断。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '选出没有悬垂修饰错误的一句：',
          opts: [
            'A|Walking into the lab, the samples were already prepared.',
            'B|Walking into the lab, we found the samples prepared.',
            'C|Walking into the lab, it was noticed the samples were ready.',
          ],
          a: 'B',
          ex: '只有 B 的分词逻辑主语 we 与主句主语一致。',
        },
        {
          t: 's',
          stem: '______ by strong evidence, the argument convinced the panel.',
          opts: ['A|Supporting', 'B|Supported', 'C|To support'],
          a: 'B',
          ex: 'argument 与 support 是被动关系，用过去分词。',
        },
        {
          t: 'b',
          stem: '判断：分词短语作状语时可以省略逻辑主语，只要读者能猜到即可。',
          a: false,
          ex: '读者“能猜到”不构成语法正确，悬垂修饰在学术写作中会被判为错误。',
        },
      ],
    },
    {
      title: '虚拟语气进阶：建议、要求与 should 省略',
      ruleText:
        'suggest / demand / insist / recommend / propose 等词后的从句用 **(should) + 动词原形**。\n形容词结构 It is essential / necessary / vital that … 同理。',
      examples: [
        ['The board recommended that the report be revised.', '董事会建议修改该报告。'],
        ['It is essential that every student attend the briefing.', '每位学生都必须参加说明会。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'The committee insisted that the deadline ______ extended.',
          opts: ['A|is', 'B|be', 'C|was'],
          a: 'B',
          ex: 'insist 表“坚持要求”时从句用 (should) be。',
        },
        {
          t: 's',
          stem: 'It is vital that the sample ______ representative.',
          opts: ['A|is', 'B|be', 'C|will be'],
          a: 'B',
          ex: 'It is vital that + (should) + 动词原形。',
        },
        {
          t: 'b',
          stem: '判断：insist 表示“坚持说（陈述事实）”时，从句用陈述语气而非虚拟语气。',
          a: true,
          ex: 'He insisted that he was innocent. 此处为陈述事实。',
        },
      ],
    },
    {
      title: '语篇衔接：连接副词与指代',
      ruleText:
        '连接副词（however / therefore / moreover / nevertheless）连接**两个独立句**，\n前用句号或分号，后加逗号；不能像 but 那样直接连接两个分句。\n代词指代必须唯一明确，避免 this / it 指代模糊。',
      examples: [
        ['The costs rose sharply; however, demand remained stable.', '成本急剧上升；然而需求保持稳定。'],
        ['Two factors explain this trend. The first is demographic.', '两个因素解释了这一趋势，第一个是人口因素。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '选出标点正确的一项：',
          opts: [
            'A|The data were limited, however the conclusion holds.',
            'B|The data were limited; however, the conclusion holds.',
            'C|The data were limited however; the conclusion holds.',
          ],
          a: 'B',
          ex: 'however 作连接副词时，前分号后逗号。',
        },
        {
          t: 's',
          stem: '______ , the sample size was small; the findings are therefore tentative.',
          opts: ['A|Moreover', 'B|Admittedly', 'C|Consequently'],
          a: 'B',
          ex: 'Admittedly 引出让步，与后文的谨慎结论呼应。',
        },
        {
          t: 'b',
          stem: '判断：学术写作中应尽量避免用 this 单独指代前一整句的复杂内容。',
          a: true,
          ex: '应写作 this trend / this finding 等“this + 名词”形式，保证指代明确。',
        },
      ],
    },
  ],

  /* ---------------------------- 雅思 5.5 ---------------------------- */
  ielts55: [
    {
      title: '主谓一致高频陷阱',
      ruleText:
        '就近原则（there be、or、either…or）、就远原则（as well as、together with）、\n集体名词（the number of + 单数 / a number of + 复数）是三大常考点。',
      examples: [
        ['The number of applicants has risen sharply.', '申请人数量急剧上升。'],
        ['A number of students were absent.', '不少学生缺席了。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'The manager, together with two assistants, ______ attending the fair.',
          opts: ['A|are', 'B|is', 'C|were'],
          a: 'B',
          ex: 'together with 不改变主语单复数，主语是 The manager。',
        },
        {
          t: 's',
          stem: 'Neither the teachers nor the head ______ aware of the change.',
          opts: ['A|were', 'B|was', 'C|have been'],
          a: 'B',
          ex: 'neither…nor 遵循就近原则，靠近 the head（单数）。',
        },
        {
          t: 'b',
          stem: '判断：“Twenty kilometres is a long way to walk.” 主谓一致正确。',
          a: true,
          ex: '表示度量、时间、金钱的复数名词作主语时视为整体，用单数。',
        },
      ],
    },
    {
      title: '冠词 a / an / the / 零冠词',
      ruleText:
        '首次提及用 a / an，再次提及或双方已知用 the；\n表示**类指**可用 the + 单数、a + 单数或复数零冠词；\n抽象名词、学科名、三餐、交通方式（by bus）一般不加冠词。',
      examples: [
        ['The computer has transformed modern work.', '计算机改变了现代工作。'],
        ['She goes to work by bus.', '她乘公交上班。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'He plays ______ piano but does not play ______ football.',
          opts: ['A|the / the', 'B|the / 零冠词', 'C|零冠词 / the'],
          a: 'B',
          ex: '乐器前加 the，球类运动前不加冠词。',
        },
        {
          t: 's',
          stem: 'Water is ______ essential resource for every city.',
          opts: ['A|a', 'B|an', 'C|the'],
          a: 'B',
          ex: 'essential 以元音音素开头，用 an。',
        },
        {
          t: 'b',
          stem: '判断：在 Task 1 描述图表时，“the highest figure” 中的 the 不能省略。',
          a: true,
          ex: '最高级前必须加定冠词。',
        },
      ],
    },
    {
      title: '常用介词搭配',
      ruleText:
        '时间：in + 年/月，on + 具体日期，at + 时刻。\n趋势：increase **by** 5%（增幅）／increase **to** 50%（增至）。\n对比：compared **with / to**；原因：due **to**。',
      examples: [
        ['Sales rose by 12% in 2022.', '2022 年销售额增长了 12%。'],
        ['Attendance fell to just 40 people.', '出席人数降至仅 40 人。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'The figure increased ______ 30% over the decade.',
          opts: ['A|by', 'B|to', 'C|at'],
          a: 'A',
          ex: 'by 表示变化的幅度。',
        },
        {
          t: 's',
          stem: 'The delay was due ______ heavy rain.',
          opts: ['A|of', 'B|to', 'C|for'],
          a: 'B',
          ex: 'due to 是固定搭配。',
        },
        {
          t: 'k',
          stem: '填空：The workshop takes place ______ 3 p.m. on Friday.',
          a: ['at'],
          ex: '具体时刻用 at。',
        },
      ],
    },
    {
      title: '比较结构与数据对比',
      ruleText:
        '常用句式：**A is twice as high as B**、**A is three times higher than B**、\n**the gap between A and B narrowed**。\n注意倍数表达的位置：twice / three times 置于 as … as 之前。',
      examples: [
        ['Spending on housing was twice as high as that on food.', '住房支出是食品支出的两倍。'],
        ['The gap between the two groups narrowed after 2015.', '2015 年后两组差距缩小。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'The output in 2020 was ______ that in 2010.',
          opts: ['A|three times as much as', 'B|as three times much as', 'C|much three times as'],
          a: 'A',
          ex: '倍数词放在 as … as 结构之前。',
        },
        {
          t: 's',
          stem: 'City A recorded ______ visitors than City B.',
          opts: ['A|far more', 'B|far many', 'C|much many'],
          a: 'A',
          ex: 'far 修饰比较级 more。',
        },
        {
          t: 'b',
          stem: '判断：在图表作文中用 “compared to the year before” 表达同比是可接受的。',
          a: true,
          ex: 'compared to / with 均可用于同比表述。',
        },
      ],
    },
    {
      title: 'Task 1 时态选择',
      ruleText:
        '图表若标明**过去年份**，主体用一般过去时；\n若为**预测年份**，用一般将来时或 be expected to；\n无时间标注的流程图 / 地图用一般现在时（流程常用被动）。',
      examples: [
        ['Between 1990 and 2000, car ownership doubled.', '1990 至 2000 年间汽车拥有量翻倍。'],
        ['The raw material is first washed and then dried.', '原料先被清洗，然后烘干。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '图表标注 2005–2015，主体描述应使用：',
          opts: ['A|一般现在时', 'B|一般过去时', 'C|现在完成时'],
          a: 'B',
          ex: '明确的过去区间用一般过去时。',
        },
        {
          t: 's',
          stem: '流程图描述中最常用的语态是：',
          opts: ['A|主动语态', 'B|被动语态', 'C|虚拟语气'],
          a: 'B',
          ex: '流程图强调步骤本身，施动者不重要，用被动语态。',
        },
        {
          t: 'b',
          stem: '判断：预测到 2035 年的数据可以用 “is projected to reach” 表达。',
          a: true,
          ex: 'be projected / expected to 是描述预测数据的标准表达。',
        },
      ],
    },
    {
      title: '并列连词与从属连词',
      ruleText:
        '并列连词（and / but / or / so）连接**同等成分**；\n从属连词（although / because / while）引导**从句**。\n**不能**同时使用 although 与 but，这是中式英语高频错误。',
      examples: [
        ['Although the cost rose, demand stayed strong.', '尽管成本上升，需求依然强劲。'],
        ['The service is cheap, so many students use it.', '这项服务便宜，所以很多学生使用。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '选出正确的一句：',
          opts: [
            'A|Although it rained, but we continued.',
            'B|Although it rained, we continued.',
            'C|Although it rained, and we continued.',
          ],
          a: 'B',
          ex: 'although 与 but 不能连用。',
        },
        {
          t: 's',
          stem: '______ the policy is popular, it is expensive to run.',
          opts: ['A|Because', 'B|While', 'C|So'],
          a: 'B',
          ex: 'While 在此表示让步“虽然”。',
        },
        {
          t: 'b',
          stem: '判断：“Because he was late, so he missed the bus.” 是正确英语。',
          a: false,
          ex: 'because 与 so 不能同时出现。',
        },
      ],
    },
    {
      title: '代词指代清晰',
      ruleText:
        '每个代词都应有**唯一且就近**的先行词。\n避免用 it / they 指代整段内容；改用“this + 概括名词”，如 this approach、these findings。',
      examples: [
        ['The council rejected the plan. This decision angered residents.', '议会否决了该计划，这一决定激怒了居民。'],
        ['Students value feedback because it guides revision.', '学生重视反馈，因为它指导修改。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '选出指代更清晰的一句：',
          opts: [
            'A|Tourism grew and the airport expanded, which helped the economy.',
            'B|Tourism grew and the airport expanded. These two changes helped the economy.',
            'C|Tourism grew and the airport expanded, and it helped the economy.',
          ],
          a: 'B',
          ex: '用“these two changes”明确概括，避免 which / it 指代模糊。',
        },
        {
          t: 's',
          stem: '“The report criticised the school and the council, but ______ denied the claims.” 最佳填空是：',
          opts: ['A|it', 'B|they', 'C|the council'],
          a: 'C',
          ex: '前文有两个可能先行词，需直接点名以消除歧义。',
        },
        {
          t: 'b',
          stem: '判断：在雅思写作中，反复使用 “this” 而不带名词会降低连贯性得分。',
          a: true,
          ex: '考官评分标准中的 Coherence and Cohesion 明确关注指代清晰度。',
        },
      ],
    },
    {
      title: '常见中式英语纠错',
      ruleText:
        '典型问题：**动词冗余**（make a discussion → discuss）、\n**范畴词冗余**（in the field of education → in education）、\n**主语缺失**（因中文无主句直译）以及**形容词与副词误用**。',
      examples: [
        ['We discussed the plan. （不写 We made a discussion about the plan.）', '我们讨论了该计划。'],
        ['Prices rose sharply. （不写 Prices rose in a sharp way.）', '价格急剧上涨。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '选出更地道的表达：',
          opts: [
            'A|We should pay attention on the environment problem.',
            'B|We should pay attention to environmental problems.',
            'C|We should pay attention for environment problem.',
          ],
          a: 'B',
          ex: 'pay attention to；且应使用形容词 environmental 修饰名词。',
        },
        {
          t: 's',
          stem: '“With the development of society, people s life becomes better.” 的主要问题是：',
          opts: ['A|时态错误', 'B|套话且主谓搭配生硬', 'C|拼写错误'],
          a: 'B',
          ex: '这是典型模板套话，考官会判定为记忆性语言，宜改写为具体表述。',
        },
        {
          t: 'b',
          stem: '判断：“According to my opinion” 是正确的英语表达。',
          a: false,
          ex: '应为 In my opinion 或 According to + 他人/资料。',
        },
      ],
    },
  ],

  /* --------------------------- 雅思 6.0-6.5 --------------------------- */
  ielts65: [
    {
      title: '介词 + 关系代词的定语从句',
      ruleText:
        '结构 **介词 + which / whom**，多见于正式书面语。\n介词的选择取决于从句中动词或名词的固定搭配，\n如 the extent **to which**、the rate **at which**、the way **in which**。',
      examples: [
        ['The extent to which media shapes opinion is debated.', '媒体影响舆论的程度仍有争议。'],
        ['The speed at which glaciers retreat has increased.', '冰川退缩的速度加快了。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'This is the framework ______ the analysis is based.',
          opts: ['A|on which', 'B|which', 'C|in that'],
          a: 'A',
          ex: 'be based on → on which。',
        },
        {
          t: 's',
          stem: 'She described the manner ______ the interviews were conducted.',
          opts: ['A|which', 'B|in which', 'C|of which'],
          a: 'B',
          ex: 'in the manner → in which。',
        },
        {
          t: 'b',
          stem: '判断：“the reason of which” 是描述原因时的标准搭配。',
          a: false,
          ex: '应为 the reason for which 或直接用 why。',
        },
      ],
    },
    {
      title: '让步状语从句的多种表达',
      ruleText:
        '除 although / though 外，可用 **even if / even though / while / whereas**，\n以及倒装让步 **Adjective + as + 主语 + be**。\nDespite / In spite of 后接**名词或动名词**，不接从句。',
      examples: [
        ['Difficult as the task was, the team completed it.', '尽管任务艰巨，团队还是完成了。'],
        ['Despite the delay, the outcome remained positive.', '尽管有延误，结果依然积极。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '______ the evidence is limited, the argument is persuasive.',
          opts: ['A|Despite', 'B|Although', 'C|In spite of'],
          a: 'B',
          ex: '后接完整从句，只能用 Although。',
        },
        {
          t: 's',
          stem: '______ as it seems, the method works reliably.',
          opts: ['A|Simple', 'B|Simply', 'C|A simple'],
          a: 'A',
          ex: '倒装让步结构：形容词 + as + 主语 + 系动词。',
        },
        {
          t: 'b',
          stem: '判断：“Despite of the rain, the event went ahead.” 语法正确。',
          a: false,
          ex: 'despite 后不加 of，应为 Despite the rain 或 In spite of the rain。',
        },
      ],
    },
    {
      title: '结果与目的状语',
      ruleText:
        '结果：**so + 形容词 + that**、**such + 名词短语 + that**、so as to（否定用 so as not to）。\n目的：**in order that + 从句**、**in order to / so as to + 动词原形**。\n注意 so as to 不能置于句首。',
      examples: [
        ['The instructions were so clear that no one asked questions.', '说明极其清楚，没人提问。'],
        ['In order to reduce waste, the café stopped using plastic cups.', '为减少浪费，咖啡馆停用塑料杯。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'It was ______ a convincing study that policy changed within a year.',
          opts: ['A|so', 'B|such', 'C|very'],
          a: 'B',
          ex: 'such + a/an + 形容词 + 名词 + that。',
        },
        {
          t: 's',
          stem: '______ avoid misunderstanding, define your terms early.',
          opts: ['A|So as to', 'B|In order to', 'C|For to'],
          a: 'B',
          ex: 'so as to 不能置于句首，故选 In order to。',
        },
        {
          t: 'b',
          stem: '判断：so…that 与 such…that 中的 that 引导的是结果状语从句。',
          a: true,
          ex: '两者均为结果状语从句的标志结构。',
        },
      ],
    },
    {
      title: '名词化与学术语域',
      ruleText:
        '名词化把动词或形容词转为名词（analyse→analysis、able→ability），\n可提高信息密度与客观性，但**过度使用**会造成句子笨重、可读性下降。\n雅思写作建议：关键论点用动词，背景信息可名词化。',
      examples: [
        ['The introduction of the scheme reduced congestion.', '该方案的实施减少了拥堵。'],
        ['A rapid decline in bird populations followed.', '随后鸟类数量迅速下降。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '把 “They decided quickly.” 名词化后最自然的一项是：',
          opts: ['A|Their quick decision', 'B|Their decide quickly', 'C|The deciding of them'],
          a: 'A',
          ex: 'decide → decision，副词 quickly → 形容词 quick。',
        },
        {
          t: 's',
          stem: '下列哪一句名词化过度、可读性最差？',
          opts: [
            'A|The council improved the service.',
            'B|An improvement in the provision of the service by the council took place.',
            'C|The council made improvements to the service.',
          ],
          a: 'B',
          ex: 'B 层层名词化，主语冗长，动词被弱化为 took place。',
        },
        {
          t: 'b',
          stem: '判断：名词化越多，雅思写作词汇分越高。',
          a: false,
          ex: '评分关注准确与自然，过度名词化反而损害连贯与可读性。',
        },
      ],
    },
    {
      title: '被动语态与信息结构',
      ruleText:
        '英语句子倾向**已知信息在前、新信息在后**。\n被动语态常用于把已知信息提到主语位置，从而衔接上下文，\n而非单纯为了“显得正式”。',
      examples: [
        ['These findings were confirmed by a later study.', '这些发现被后来的研究证实。'],
        ['Three factors are considered below.', '下文将讨论三个因素。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '上文刚讨论过 the proposal，下句衔接最好的写法是：',
          opts: [
            'A|The committee rejected the proposal.',
            'B|The proposal was rejected by the committee.',
            'C|There was a rejection of the proposal.',
          ],
          a: 'B',
          ex: '已知信息 the proposal 置于主语位置，衔接最自然。',
        },
        {
          t: 's',
          stem: '学术写作中使用被动的主要理由是：',
          opts: ['A|显得更长', 'B|调整信息重心并弱化施动者', 'C|避免使用动词'],
          a: 'B',
          ex: '被动的核心功能是信息结构调整。',
        },
        {
          t: 'b',
          stem: '判断：全篇使用被动语态可以提升语法多样性得分。',
          a: false,
          ex: '单一句式会降低 Grammatical Range 分数，应主被动交替。',
        },
      ],
    },
    {
      title: '条件句三型与混合条件',
      ruleText:
        '真实条件：if + 现在时，主句 will；\n非真实（现在）：if + 过去时，主句 would；\n非真实（过去）：if + had done，主句 would have done。\n**混合条件**：过去的条件 + 现在的结果。',
      examples: [
        ['If they had invested earlier, they would be profitable now.', '如果他们早些投资，现在就盈利了。'],
        ['If the data were reliable, the conclusion would hold.', '如果数据可靠，结论就能成立。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'If the city had built the line in 2010, traffic ______ far lighter today.',
          opts: ['A|would be', 'B|would have been', 'C|will be'],
          a: 'A',
          ex: '混合条件：过去条件 + 现在结果，主句用 would + 动词原形。',
        },
        {
          t: 's',
          stem: 'If sea levels ______ rising, coastal cities will face serious risks.',
          opts: ['A|keep', 'B|kept', 'C|had kept'],
          a: 'A',
          ex: '真实条件句，从句用一般现在时。',
        },
        {
          t: 'b',
          stem: '判断：Were it not for the subsidy, the service would close. 是正确的倒装虚拟句。',
          a: true,
          ex: 'if 省略后 were 提前，构成正式倒装虚拟条件句。',
        },
      ],
    },
    {
      title: '同位语从句与信息补充',
      ruleText:
        '同位语从句用 that / whether / 疑问词引导，**解释抽象名词的具体内容**，\n常见先行名词：fact、idea、belief、evidence、possibility、conclusion。\n与定语从句的区别：同位语从句中 that 不作句子成分。',
      examples: [
        ['The evidence that pollution harms health is overwhelming.', '污染危害健康的证据非常充分。'],
        ['The question whether the policy works remains open.', '该政策是否有效仍是未解问题。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '下列哪句中的 that 引导同位语从句？',
          opts: [
            'A|The report that arrived yesterday is detailed.',
            'B|The claim that the method is flawed needs testing.',
            'C|The book that she wrote sold well.',
          ],
          a: 'B',
          ex: 'B 中 that 从句解释 claim 的内容，不作成分。',
        },
        {
          t: 's',
          stem: 'The possibility ______ the trend reverses cannot be ruled out.',
          opts: ['A|which', 'B|that', 'C|what'],
          a: 'B',
          ex: '同位语从句用 that 引导。',
        },
        {
          t: 'b',
          stem: '判断：同位语从句中的引导词在从句中不充当主语或宾语。',
          a: true,
          ex: '这正是它与定语从句最关键的区别。',
        },
      ],
    },
    {
      title: '模糊限制语（Hedging）',
      ruleText:
        '学术英语避免绝对化。常用手段：情态动词（may / might / could）、\n频度与程度副词（often / largely / to some extent）、\n动词（suggest / indicate / tend to）与句式（It appears that…）。',
      examples: [
        ['The results suggest that early intervention may help.', '结果表明早期干预可能有帮助。'],
        ['This factor is, to some extent, beyond individual control.', '这一因素在某种程度上超出个人控制。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '选出学术语域最恰当的一句：',
          opts: [
            'A|Social media definitely destroys teenagers concentration.',
            'B|Social media may reduce teenagers concentration in some contexts.',
            'C|Everyone knows social media ruins concentration.',
          ],
          a: 'B',
          ex: 'B 使用 may 与 in some contexts 做适度限定。',
        },
        {
          t: 's',
          stem: '“The data prove that…” 更严谨的改写是：',
          opts: ['A|The data show that…', 'B|The data must be that…', 'C|The data totally prove that…'],
          a: 'A',
          ex: 'prove 语气过强，show / indicate / suggest 更稳妥。',
        },
        {
          t: 'b',
          stem: '判断：过度使用 hedging 也可能使论点显得模糊无力。',
          a: true,
          ex: '限定要适度：既不能绝对化，也不能立场不明。',
        },
      ],
    },
  ],

  /* --------------------------- 雅思 7 分+ --------------------------- */
  ielts7plus: [
    {
      title: '前置强调与全部倒装',
      ruleText:
        '介词短语或表语置于句首可触发**全部倒装**（主语与谓语完全颠倒），\n常用于描写与文学化叙述；否定副词前置则为**部分倒装**。\n两者的共同功能是重新分配信息焦点。',
      examples: [
        ['Among the exhibits stood a replica of the first printing press.', '展品中矗立着第一台印刷机的复制品。'],
        ['So compelling was the evidence that the panel voted unanimously.', '证据如此有力，以致评审团一致通过。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'On the far side of the valley ______ a small research station.',
          opts: ['A|lies', 'B|it lies', 'C|does lie'],
          a: 'A',
          ex: '地点状语前置引发全部倒装，谓语直接跟在状语后。',
        },
        {
          t: 's',
          stem: 'Rarely ______ such a decisive shift in public attitude.',
          opts: ['A|we have seen', 'B|have we seen', 'C|we did see'],
          a: 'B',
          ex: 'Rarely 前置触发部分倒装。',
        },
        {
          t: 'b',
          stem: '判断：全部倒装只发生在主语为代词的句子中。',
          a: false,
          ex: '恰恰相反，主语为代词时通常不倒装（Here it comes.）。',
        },
      ],
    },
    {
      title: '分裂句（Cleft Sentences）',
      ruleText:
        'It-cleft：**It is X that/who …**；\nWh-cleft（伪分裂句）：**What … is X**；\nAll-cleft：**All (that) … is X**。三者都用于突出新信息、制造对比。',
      examples: [
        ['What the study challenges is the assumption of linear growth.', '这项研究挑战的是线性增长的假设。'],
        ['All the policy achieved was a temporary dip in demand.', '该政策取得的只是需求的短暂下滑。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '把 “The design matters most.” 改为 Wh-cleft，最佳的一项是：',
          opts: [
            'A|What matters most is the design.',
            'B|It is matters most the design.',
            'C|What is the design matters most.',
          ],
          a: 'A',
          ex: 'Wh-cleft 结构为 What + 从句 + is + 被强调成分。',
        },
        {
          t: 's',
          stem: '下列哪一句最能突出“时间”这一信息？',
          opts: [
            'A|The committee approved the plan in March.',
            'B|It was in March that the committee approved the plan.',
            'C|The plan was approved by the committee.',
          ],
          a: 'B',
          ex: 'It-cleft 将 in March 置于焦点位置。',
        },
        {
          t: 'b',
          stem: '判断：分裂句的主要作用是增加句子长度。',
          a: false,
          ex: '其核心功能是信息聚焦与对比，而非拉长句子。',
        },
      ],
    },
    {
      title: '非限制性从句的信息层次',
      ruleText:
        '非限制性定语从句提供**补充信息**，删去后主句仍成立，需用逗号隔开且不可用 that。\nwhich 可指代**前面整个分句**，此时须确保指代明确，避免歧义。',
      examples: [
        ['The trial lasted six months, which allowed seasonal effects to emerge.', '试验持续六个月，这使季节性效应得以显现。'],
        ['The author, whose earlier work was ignored, is now widely cited.', '这位作者早期作品曾被忽视，如今被广泛引用。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '选出标点与引导词都正确的一项：',
          opts: [
            'A|The scheme, that began in 2018, has expanded.',
            'B|The scheme, which began in 2018, has expanded.',
            'C|The scheme which began in 2018, has expanded.',
          ],
          a: 'B',
          ex: '非限制性从句用 which 且前后都要有逗号。',
        },
        {
          t: 's',
          stem: '“Costs fell sharply, which surprised analysts.” 中 which 指代：',
          opts: ['A|Costs', 'B|前面整个分句', 'C|analysts'],
          a: 'B',
          ex: '非限制性 which 可指代整个前置分句。',
        },
        {
          t: 'b',
          stem: '判断：限制性定语从句删去后，句子的指称范围会发生改变。',
          a: true,
          ex: '限制性从句起限定作用，删去会改变句意范围。',
        },
      ],
    },
    {
      title: '抽象度控制：名词化与去名词化',
      ruleText:
        '高分写作需在**抽象概括**与**具体证据**之间灵活切换：\n段落主题句可名词化以概括，支撑句应回到动词与具体主语，\n避免整段皆为抽象名词堆叠。',
      examples: [
        ['The proliferation of low-cost sensors transformed field research.', '低成本传感器的激增改变了野外研究。'],
        ['Teams now collect data hourly instead of once a week.', '团队如今每小时采集数据，而非每周一次。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '一段中最适合放置高度名词化句子的位置通常是：',
          opts: ['A|主题句', 'B|举例句', 'C|细节数据句'],
          a: 'A',
          ex: '主题句需要概括性，抽象名词恰当；细节句应具体。',
        },
        {
          t: 's',
          stem: '把 “There was a significant reduction in the utilisation of private vehicles.” 改写得更清晰的是：',
          opts: [
            'A|Private vehicle use fell significantly.',
            'B|A significant reduction of private vehicle utilisation occurred.',
            'C|The utilisation reduction was significant.',
          ],
          a: 'A',
          ex: '把名词化还原为动词，主语具体，句子更有力。',
        },
        {
          t: 'b',
          stem: '判断：整篇文章保持同一抽象层级有利于连贯性。',
          a: false,
          ex: '优秀写作在概括与具体之间有节奏地切换，形成论证层次。',
        },
      ],
    },
    {
      title: '平行结构（Parallelism）',
      ruleText:
        '并列成分应保持**语法形式一致**：动词对动词、名词短语对名词短语、从句对从句。\n关联词 not only…but also、either…or、both…and 两侧结构必须对称。',
      examples: [
        ['The course develops reading, writing, and critical thinking.', '这门课培养阅读、写作与批判性思维。'],
        ['She is respected not only for her research but also for her teaching.', '她不仅因研究受人尊敬，也因教学受人尊敬。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '选出平行结构正确的一项：',
          opts: [
            'A|The plan aims to cut costs, raising quality, and it improves access.',
            'B|The plan aims to cut costs, raise quality, and improve access.',
            'C|The plan aims cutting costs, to raise quality and improvement of access.',
          ],
          a: 'B',
          ex: '三个不定式动词原形并列，形式一致。',
        },
        {
          t: 's',
          stem: 'Not only ______ the budget cut, but the timeline was also shortened.',
          opts: ['A|was', 'B|it was', 'C|being'],
          a: 'A',
          ex: 'Not only 置于句首触发部分倒装，且两侧结构对称。',
        },
        {
          t: 'b',
          stem: '判断：平行结构只影响文体美观，不影响语法正确性。',
          a: false,
          ex: '并列成分形式不一致属于语法错误，会直接影响评分。',
        },
      ],
    },
    {
      title: '省略与替代',
      ruleText:
        '为避免重复，英语常用**省略**（The first option is cheaper than the second [option]）\n与**替代词**（do so、one、that of、such）。\n使用前提是被替代成分**清晰可复原**。',
      examples: [
        ['The climate of Spain is milder than that of Norway.', '西班牙的气候比挪威温和。'],
        ['If you wish to withdraw, please do so in writing.', '如需退出，请以书面形式提出。'],
      ],
      exercises: [
        {
          t: 's',
          stem: 'The population of Tokyo is larger than ______ of Seoul.',
          opts: ['A|that', 'B|it', 'C|those'],
          a: 'A',
          ex: '替代单数不可数概念 the population，用 that。',
        },
        {
          t: 's',
          stem: 'He promised to revise the draft and he ______ within a day.',
          opts: ['A|did so', 'B|made it', 'C|did it so'],
          a: 'A',
          ex: 'do so 替代前面的完整动词短语。',
        },
        {
          t: 'b',
          stem: '判断：替代词 those 用于替代可数复数名词。',
          a: true,
          ex: 'those of + 名词用于复数比较对象。',
        },
      ],
    },
    {
      title: '长句节奏与标点',
      ruleText:
        '分号连接**两个关系紧密的独立句**；冒号引出**解释、清单或引语**；\n破折号用于**插入或强调**，正式写作中不宜频繁。\n长短句交替是高分写作的重要特征。',
      examples: [
        ['The trial failed; the design, however, proved valuable.', '试验失败了，但设计本身证明有价值。'],
        ['Three constraints emerged: cost, time, and staffing.', '出现了三项制约：成本、时间与人力。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '选出标点使用正确的一项：',
          opts: [
            'A|We tested three materials: steel, aluminium and carbon fibre.',
            'B|We tested three materials, steel; aluminium; carbon fibre.',
            'C|We tested three materials — steel: aluminium: carbon fibre.',
          ],
          a: 'A',
          ex: '冒号引出清单，清单内部用逗号分隔。',
        },
        {
          t: 's',
          stem: '分号最恰当的用法是：',
          opts: [
            'A|连接两个独立且语义相关的句子',
            'B|连接主句与从句',
            'C|替代所有逗号',
          ],
          a: 'A',
          ex: '分号连接的两侧都必须能独立成句。',
        },
        {
          t: 'b',
          stem: '判断：连续使用五个以上的长句有助于展示语法多样性。',
          a: false,
          ex: '语法多样性体现在句式变化，长短交替比一味堆长句更有效。',
        },
      ],
    },
    {
      title: '语域与学术措辞',
      ruleText:
        '学术语域回避缩略（don t → do not）、口语短语动词（find out → identify）、\n绝对化词（always、never）与情绪化形容词。\n同时避免过度浮夸：措辞应**精确**而非**华丽**。',
      examples: [
        ['The study identifies three underlying mechanisms.', '该研究识别出三种潜在机制。'],
        ['The results do not support the original hypothesis.', '结果不支持最初的假设。'],
      ],
      exercises: [
        {
          t: 's',
          stem: '把 “The researchers found out a lot of stuff about it.” 改写为学术语域，最佳的是：',
          opts: [
            'A|The researchers identified several relevant factors.',
            'B|The researchers found out many things regarding it.',
            'C|The researchers discovered tons of information.',
          ],
          a: 'A',
          ex: '替换短语动词与口语量词，明确所指。',
        },
        {
          t: 's',
          stem: '下列哪一项最不符合学术语域？',
          opts: [
            'A|It is widely acknowledged that…',
            'B|Everybody knows for sure that…',
            'C|Evidence from three studies indicates that…',
          ],
          a: 'B',
          ex: '绝对化 + 口语化，属于典型低分表达。',
        },
        {
          t: 'b',
          stem: '判断：使用生僻词越多，Lexical Resource 分数越高。',
          a: false,
          ex: '评分强调准确与自然搭配，误用生僻词反而扣分。',
        },
      ],
    },
  ],
};
