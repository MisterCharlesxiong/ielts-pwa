/**
 * 写作种子（6 级 × 3 题）
 * ------------------------------------------------------------------
 * 单题结构：
 *   {
 *     taskType   : 'task1' | 'task2' | 'general'
 *     prompt     : 题干
 *     minWords   : 字数下限（本地批改「字数」维度以此为基准）
 *     structure  : 建议结构，≥4 步（测试卷会从中出题，故必须 ≥4）
 *     connectives: 必备连接词，>0（批改「连接词」维度按命中率给分）
 *     patterns   : [[name, template, sample, regex?], ...]，>0
 *     model?     : [[role, en, cn?, note?], ...]  可缺省，缺省时 UI 显示「范文即将上线」
 *   }
 *
 * 注意：requiredConnectives 与 advancedPatterns 必须填实，
 * 否则 lib/writingGrader.ts 的「连接词 25%」与「句式 15%」两个维度恒为 0 分。
 */

export const WRITING = {
  /* ================================ 初中 ================================ */
  junior: [
    {
      taskType: 'general',
      prompt:
        '你的英国笔友 Tom 想了解中国中学生的一天。请以 "My School Day" 为题写一篇短文，介绍你从早到晚的主要安排，并说明你最喜欢哪一段时间以及原因。',
      minWords: 80,
      structure: [
        '开头一句点明主题：介绍自己就读的年级与学校类型',
        '按时间顺序描述上午的安排（起床、早读、上午的课）',
        '描述中午与下午的安排（午餐、社团、体育活动）',
        '说明晚上如何复习与休息',
        '结尾说明你最喜欢的时段并给出一条理由',
      ],
      connectives: ['First', 'Then', 'After that', 'Finally', 'because'],
      patterns: [
        [
          '时间状语前置',
          'At + 时间, 主语 + 谓语.',
          'At seven in the morning, I read English aloud with my classmates.',
          '^at\\s+\\w+',
        ],
        [
          'not only ... but also ...',
          'not only + A + but also + B',
          'We not only study hard but also play basketball together.',
          'not only[\\s\\S]{0,60}but also',
        ],
        [
          '原因状语从句',
          '..., because + 主谓',
          'I like the afternoon best because we have art class then.',
          '\\bbecause\\b',
        ],
      ],
      model: [
        [
          'intro',
          'My name is Li Hua and I am a Grade Eight student in a middle school in Nanjing. My school day is busy but happy.',
          '我叫李华，是南京一所中学八年级的学生。我的校园生活忙碌而快乐。',
          '开头交代身份与总体感受，为下文定基调。',
        ],
        [
          'body1',
          'First, I get up at six thirty and arrive at school before seven twenty. Then we have morning reading, and after that four classes begin.',
          '首先，我六点半起床，七点二十前到校。接着是早读，之后开始上四节课。',
          '用 First / Then / After that 串起上午时间线。',
        ],
        [
          'body2',
          'At noon I have lunch with my friends in the dining hall. In the afternoon we not only study science but also join club activities such as football and painting.',
          '中午我和朋友在食堂吃饭。下午我们不仅学习科学，还参加足球、绘画等社团活动。',
          '使用 not only ... but also ... 提升句式分。',
        ],
        [
          'conclusion',
          'Finally, I review my lessons for an hour in the evening. I like the afternoon best because I can do sports with my classmates then.',
          '最后，晚上我复习一小时功课。我最喜欢下午，因为那时可以和同学一起运动。',
          '结尾用 Finally 收束并给出理由。',
        ],
      ],
    },
    {
      taskType: 'general',
      prompt:
        '学校英语角正在征集主题为 "A Person I Admire" 的短文。请介绍一位你敬佩的人（可以是家人、老师或身边的普通人），写出他/她做过的一件具体的事，以及这件事对你的影响。',
      minWords: 80,
      structure: [
        '开门见山点出这个人是谁以及你们的关系',
        '用两三句描述他/她的外貌或性格特点',
        '完整叙述一件具体的事（时间、地点、发生了什么）',
        '说明这件事让你学到了什么',
        '结尾表达你希望成为怎样的人',
      ],
      connectives: ['One day', 'However', 'so', 'In my opinion'],
      patterns: [
        [
          'who 引导的定语从句',
          '名词 + who + 谓语',
          'My grandmother is a person who never gives up.',
          '\\bwho\\b',
        ],
        [
          'so ... that ...',
          'so + 形容词 + that + 主谓',
          'She was so patient that I finally learned to ride a bike.',
          'so\\s+\\w+\\s+that',
        ],
      ],
    },
    {
      taskType: 'general',
      prompt:
        '你所在的城市正在推广垃圾分类。请写一封给校长的英文建议信，提出两条在校园内推广垃圾分类的具体做法，并说明这样做的好处。',
      minWords: 90,
      structure: [
        '写明写信目的：为校园垃圾分类提出建议',
        '提出第一条建议并说明如何执行',
        '提出第二条建议并说明如何执行',
        '概括这两条建议能带来的好处',
        '礼貌收尾，表达希望被采纳的意愿',
      ],
      connectives: ['To begin with', "What's more", 'As a result', 'Therefore'],
      patterns: [
        [
          '虚拟建议句',
          'I suggest that + 主语 + (should) + 动词原形',
          'I suggest that every classroom should have four coloured bins.',
          'I suggest that',
        ],
        [
          'It is + 形容词 + to do',
          'It is + adj. + to + 动词原形',
          'It is important to teach students how to sort rubbish correctly.',
          'It is \\w+ to ',
        ],
        [
          '被动语态',
          'be + 过去分词',
          'Waste paper can be collected once a week by the class monitor.',
          '\\b(is|are|can be|will be)\\s+\\w+ed\\b',
        ],
      ],
    },
  ],

  /* ================================ 高中 ================================ */
  senior: [
    {
      taskType: 'general',
      prompt:
        '假定你是校英文报的学生记者。近期学校计划把每周三下午改为"无作业日"，请写一篇短评，说明你对这一安排的看法，并给出两条支持你观点的理由。',
      minWords: 120,
      structure: [
        '简述背景：学校拟设立无作业日',
        '亮明立场：赞成或反对',
        '给出第一条理由并配一个具体例子',
        '给出第二条理由并配一个具体例子',
        '承认一种可能的反对意见并作出回应',
        '重申立场并提出一句可执行的建议',
      ],
      connectives: ['To begin with', 'Furthermore', 'Admittedly', 'In conclusion'],
      patterns: [
        [
          '强调句',
          'It is ... that ...',
          'It is the freedom to explore that makes Wednesday afternoon valuable.',
          'It is [\\s\\S]{1,60} that',
        ],
        [
          '现在分词作状语',
          'Doing ..., 主语 + 谓语.',
          'Spending the afternoon in the library, students learn to manage their own time.',
          '^\\w+ing\\b[\\s\\S]{0,60},',
        ],
        [
          'the more ... the more ...',
          'The + 比较级 ..., the + 比较级 ...',
          'The more choices students have, the more responsible they become.',
          'the more[\\s\\S]{0,60}the more',
        ],
      ],
      model: [
        [
          'intro',
          'Our school is considering turning every Wednesday afternoon into a homework-free session. In my view, this is a change worth making.',
          '学校正考虑把每周三下午改为无作业时段。在我看来，这个改变值得推行。',
          '两句话完成背景与立场，避免拖沓。',
        ],
        [
          'body1',
          'To begin with, the arrangement protects time for deep reading. Last term I finished only two novels; in a homework-free afternoon I could finish one every fortnight.',
          '首先，这一安排为深度阅读留出时间。上学期我只读完两本小说；如果有无作业下午，我大约两周就能读完一本。',
          '理由 + 自身数据，比空谈有说服力。',
        ],
        [
          'body2',
          'Furthermore, it is the freedom to explore that helps us discover real interests. Students could join a robotics club or simply rest, and both choices are valuable.',
          '其次，正是这种自由探索让我们发现真正的兴趣。同学可以参加机器人社团，也可以单纯休息，两种选择都有价值。',
          '使用强调句拿句式分。',
        ],
        [
          'concession',
          'Admittedly, some parents worry that grades may drop. However, research on our own grade shows that rest improves concentration rather than harming it.',
          '诚然，有家长担心成绩下滑。然而，本年级的数据表明休息提升了专注度而非损害成绩。',
          '让步 + 反驳，体现思辨。',
        ],
        [
          'conclusion',
          'In conclusion, I support the plan, and I suggest the school publish a short guide on how to use the free afternoon well.',
          '总之，我支持这一计划，并建议学校发布一份如何善用该时段的简短指南。',
          '结尾落到可执行建议。',
        ],
      ],
    },
    {
      taskType: 'general',
      prompt:
        '越来越多的高中生使用人工智能工具完成作业。请写一篇议论文，讨论这一现象的利与弊，并给出你自己的建议。',
      minWords: 130,
      structure: [
        '描述现象并交代讨论范围',
        '分析积极影响，至少举一个学习场景',
        '分析潜在风险，至少举一个学习场景',
        '比较两方面，指出关键取决于什么',
        '给出面向学生个人的具体建议',
      ],
      connectives: ['On the one hand', 'On the other hand', 'Nevertheless', 'Overall'],
      patterns: [
        [
          'while 引导的对比状语从句',
          'While + 主谓, 主谓.',
          'While AI can explain a formula instantly, it cannot replace the struggle that builds understanding.',
          '^while\\b',
        ],
        [
          'those who ...',
          'Those who + 谓语 + 主句',
          'Those who copy answers directly lose the chance to find their own mistakes.',
          'those who',
        ],
      ],
    },
    {
      taskType: 'general',
      prompt:
        '你的外教 Mr. Green 即将回国。请写一封告别信，回顾一件你们之间印象最深的事，表达感谢，并邀请他将来再次访问中国。',
      minWords: 110,
      structure: [
        '说明写信缘由并表达不舍',
        '回忆一件具体的往事，写清起因与细节',
        '说明这件事对你英语学习或人生态度的影响',
        '表达真诚的感谢',
        '发出再次来访的邀请并祝福',
      ],
      connectives: ['I still remember', 'Thanks to', 'Above all', 'Once again'],
      patterns: [
        [
          '强调过去习惯',
          'would + 动词原形',
          'You would always stay after class to answer our silly questions.',
          '\\bwould always\\b',
        ],
        [
          'It was ... that ...（强调过去）',
          'It was ... that ...',
          'It was that rainy afternoon that changed my attitude towards speaking English.',
          'It was [\\s\\S]{1,60} that',
        ],
      ],
    },
  ],

  /* ================================ 大学 ================================ */
  college: [
    {
      taskType: 'general',
      prompt:
        'Some universities require every student to take at least one course outside their own discipline. Write an essay discussing whether this requirement benefits students, and support your view with reasons and examples.',
      minWords: 180,
      structure: [
        '改写题目并明确本文的核心论点',
        '第一段论证：跨学科课程如何改善思维方式',
        '第二段论证：跨学科课程如何影响就业与协作能力',
        '让步段：承认时间成本或课程质量的问题并回应',
        '结论段：重申论点并指出实施的关键条件',
      ],
      connectives: ['Firstly', 'Moreover', 'Admittedly', 'Consequently', 'In summary'],
      patterns: [
        [
          '名词化主语',
          'The + 名词化 + of ... + 谓语',
          'The integration of statistics into a history degree sharpens evidential reasoning.',
          '^the \\w+ion of',
        ],
        [
          'not merely ... but rather ...',
          'not merely + A + but rather + B',
          'Universities should aim not merely at employability but rather at intellectual flexibility.',
          'not merely[\\s\\S]{0,80}but rather',
        ],
        [
          '倒装强调',
          'Only when ..., + 倒装',
          'Only when students leave their comfort zone do they notice the limits of their own field.',
          'only when[\\s\\S]{0,80}\\bdo\\b',
        ],
      ],
      model: [
        [
          'intro',
          'A growing number of universities now oblige undergraduates to study at least one module beyond their major. I believe this requirement is justified, provided that the extra module is properly designed.',
          '越来越多的大学要求本科生至少修一门专业以外的课程。我认为只要这门课设计得当，这一要求就是合理的。',
          '开头改写题目并给出带条件的立场。',
        ],
        [
          'body1',
          'Firstly, cross-disciplinary study reshapes how students reason. The integration of statistics into a history degree, for instance, forces a student to ask how reliable a source really is rather than accepting a narrative.',
          '首先，跨学科学习重塑学生的推理方式。例如把统计学引入历史学位，会迫使学生追问史料到底有多可靠，而不是接受既有叙事。',
          '名词化主语 + 具体案例。',
        ],
        [
          'body2',
          'Moreover, employers increasingly value graduates who can talk across professional boundaries. Only when students leave their comfort zone do they learn the vocabulary of another field.',
          '其次，雇主越来越看重能跨专业沟通的毕业生。只有当学生走出舒适区，才会学到另一个领域的话语体系。',
          '倒装句提升句式分。',
        ],
        [
          'concession',
          'Admittedly, poorly taught elective courses can waste time. Consequently, the value of the policy depends on whether departments design genuine introductory pathways rather than diluted lectures.',
          '诚然，教学质量差的选修课会浪费时间。因此该政策的价值取决于院系是否设计了真正的入门路径，而非注水课程。',
          '让步不空泛，指向落地条件。',
        ],
        [
          'conclusion',
          'In summary, compulsory cross-disciplinary study is worthwhile, because it aims not merely at employability but rather at intellectual flexibility.',
          '总之，强制性跨学科学习是值得的，因为它追求的不只是就业力，而是思维的灵活性。',
          '结尾复用 not merely ... but rather 句式。',
        ],
      ],
    },
    {
      taskType: 'general',
      prompt:
        'Remote internships have become common. Write an essay explaining the main advantages and drawbacks of remote internships for university students, and state which format you would choose.',
      minWords: 180,
      structure: [
        '交代远程实习兴起的背景',
        '论述远程实习的主要优势',
        '论述远程实习的主要不足',
        '比较两者对不同专业学生的影响差异',
        '给出个人选择及其理由',
      ],
      connectives: ['To begin with', 'By contrast', 'Nonetheless', 'On balance'],
      patterns: [
        [
          'whereas 对比',
          'A ..., whereas B ...',
          'Remote roles remove commuting costs, whereas on-site roles offer incidental learning.',
          '\\bwhereas\\b',
        ],
        [
          '定语从句 + which',
          '..., which + 谓语',
          'Interns miss corridor conversations, which often reveal how decisions are really made.',
          ', which ',
        ],
      ],
    },
    {
      taskType: 'general',
      prompt:
        'Your university library plans to replace half of its printed collection with digital resources. Write a report to the library committee evaluating this plan and making two recommendations.',
      minWords: 170,
      structure: [
        '说明报告目的与评估范围',
        '陈述该计划的可预期收益（成本、可达性）',
        '陈述该计划的风险（阅读体验、特殊学科需求）',
        '提出第一条可执行建议',
        '提出第二条可执行建议并说明评估指标',
      ],
      connectives: ['This report aims to', 'However', 'It is recommended that', 'Finally'],
      patterns: [
        [
          '正式建议句',
          'It is recommended that + 主语 + (should) + 动词原形',
          'It is recommended that the committee run a one-year pilot in two departments.',
          'It is recommended that',
        ],
        [
          '数据表述',
          'approximately + 数字 + of ...',
          'Approximately 40 per cent of borrowings come from three subject areas.',
          'approximately \\d+',
        ],
      ],
    },
  ],

  /* ============================== 雅思 5.5 ============================== */
  ielts55: [
    {
      taskType: 'task2',
      prompt:
        'Some people think that children should start learning a foreign language at primary school, while others believe it is better to start at secondary school. Discuss both views and give your own opinion.',
      minWords: 250,
      structure: [
        'Paraphrase the question and state that both sides will be examined',
        'Body 1: explain why an early start helps pronunciation and confidence',
        'Body 2: explain why a later start suits learners with stronger literacy in their first language',
        'Compare the two positions and state which is more convincing',
        'Conclusion: restate the position in different wording',
      ],
      connectives: ['On the one hand', 'On the other hand', 'For example', 'In my opinion', 'In conclusion'],
      patterns: [
        [
          'Those who ... argue that ...',
          'Those who + 观点动词 + argue that + 主谓',
          'Those who support an early start argue that young children imitate sounds effortlessly.',
          'those who[\\s\\S]{0,60}argue that',
        ],
        [
          'There is no doubt that ...',
          'There is no doubt that + 主谓',
          'There is no doubt that motivation matters more than starting age.',
          'there is no doubt that',
        ],
        [
          '条件句',
          'If + 主谓, 主语 + would + 动词原形',
          'If lessons were taught by trained teachers, primary pupils would progress quickly.',
          '^if\\b[\\s\\S]{0,80}would',
        ],
      ],
      model: [
        [
          'intro',
          'Opinions differ as to whether foreign language teaching should begin in primary school or be delayed until secondary school. This essay will examine both positions before explaining why an early but carefully staffed start is preferable.',
          '关于外语教学应从小学开始还是推迟到中学，人们看法不一。本文将先讨论两种立场，再说明为何配备合格师资的早期起步更可取。',
          '改写题目 + 预告结构，避免抄题。',
        ],
        [
          'body1',
          'On the one hand, those who support an early start argue that young children imitate sounds effortlessly. For example, pupils who begin English at the age of seven often acquire a more natural rhythm than teenagers who begin at thirteen.',
          '一方面，支持早学的人认为幼儿模仿语音毫不费力。例如，七岁开始学英语的学生往往比十三岁才开始的青少年获得更自然的语流。',
          '观点句 + example 展开。',
        ],
        [
          'body2',
          'On the other hand, a later start has practical advantages. Secondary students already understand grammatical terms in their first language, so they can grasp tenses and clauses far more quickly.',
          '另一方面，晚学也有现实优势。中学生已在母语中理解语法术语，因此掌握时态和从句要快得多。',
          '给对立方同等篇幅，符合 discuss both views。',
        ],
        [
          'opinion',
          'In my opinion, the early approach is more convincing, provided that schools employ trained language teachers. If lessons were delivered by untrained staff, an early start would simply create bad habits.',
          '在我看来，只要学校聘用受过训练的语言教师，早学更有说服力。若由未受训教师授课，早学只会造成不良习惯。',
          '带条件的立场比绝对化更安全。',
        ],
        [
          'conclusion',
          'In conclusion, although both starting points have merit, beginning in primary school offers greater long-term benefits as long as teaching quality is guaranteed.',
          '总之，两种起点各有道理，但只要教学质量有保障，从小学开始能带来更大的长期收益。',
          '换词重述，不重复 intro 原句。',
        ],
      ],
    },
    {
      taskType: 'task2',
      prompt:
        'In many cities, public transport is cheaper than driving a private car, yet many people still drive to work. What are the reasons for this, and what can be done to encourage people to use public transport?',
      minWords: 250,
      structure: [
        'Paraphrase the problem and outline the two questions to be answered',
        'Cause 1: comfort, flexibility and door-to-door convenience',
        'Cause 2: unreliable timetables and crowded services',
        'Solution 1: improve frequency and reliability with measurable targets',
        'Solution 2: use pricing and workplace incentives',
        'Conclusion: link causes to solutions',
      ],
      connectives: ['One reason is that', 'Another factor is', 'To tackle this', 'Overall'],
      patterns: [
        [
          '目的状语',
          'in order to + 动词原形',
          'Cities could extend bus lanes in order to cut journey times.',
          'in order to',
        ],
        [
          '被动 + by',
          'be + 过去分词 + by',
          'Delays are largely caused by shared road space rather than by old vehicles.',
          '\\b(is|are|was|were)\\s+(\\w+ly\\s+)?\\w+ed by\\b',
        ],
      ],
    },
    {
      taskType: 'task1',
      prompt:
        'The chart below shows the number of hours per week that students in four countries spent on part-time work in 2015 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. (Data: Country A 6 to 11; Country B 12 to 9; Country C 4 to 4; Country D 9 to 15)',
      minWords: 150,
      structure: [
        'Paraphrase the chart description without copying the wording',
        'Write an overview sentence covering the overall trend and the biggest change',
        'Detail paragraph 1: countries where working hours rose',
        'Detail paragraph 2: countries where hours fell or stayed level',
        'Close with a comparison of the highest and lowest figures',
      ],
      connectives: ['Overall', 'In contrast', 'while', 'respectively'],
      patterns: [
        [
          '趋势动词 + 幅度',
          '主语 + rose/fell + by + 数字',
          'Working hours in Country D rose by six hours over the period.',
          '\\b(rose|fell|increased|decreased|climbed|dropped)\\s+by\\b',
        ],
        [
          'remain 表持平',
          '主语 + remained + 形容词/数值',
          'Country C remained unchanged at four hours per week.',
          'remained (unchanged|stable|constant)',
        ],
        [
          'whereas 对比',
          'A ..., whereas B ...',
          'Country A saw a steady rise, whereas Country B experienced a clear decline.',
          '\\bwhereas\\b',
        ],
      ],
    },
  ],

  /* ============================ 雅思 6.0-6.5 ============================ */
  ielts65: [
    {
      taskType: 'task2',
      prompt:
        'Some people believe that governments should invest heavily in public art such as sculptures and murals, while others argue that this money would be better spent on essential services. Discuss both views and give your own opinion.',
      minWords: 250,
      structure: [
        'Paraphrase the debate and preview the line of argument',
        'Body 1: the cultural and economic case for public art, with a concrete mechanism',
        'Body 2: the opportunity-cost case for spending on essential services',
        'Evaluate which argument is stronger and under what conditions',
        'Conclusion: restate the balanced position without new information',
      ],
      connectives: ['Advocates argue that', 'Critics counter that', 'Crucially', 'On balance'],
      patterns: [
        [
          '让步倒装',
          'Although ..., it is arguable that ...',
          'Although budgets are limited, it is arguable that culture is not a luxury.',
          'although[\\s\\S]{0,80}arguable',
        ],
        [
          'the extent to which',
          'the extent to which + 主谓',
          'The real question is the extent to which public art delivers measurable benefits.',
          'the extent to which',
        ],
        [
          '虚拟条件',
          'Were + 主语 + to + 动词原形, ...',
          'Were councils to publish evaluation data, the debate would become far less speculative.',
          '^were \\w+ to ',
        ],
      ],
      model: [
        [
          'intro',
          'Public spending on sculptures and murals attracts persistent criticism whenever hospitals and schools are under strain. This essay considers both positions and argues that public art deserves funding, but only where its benefits are evaluated as rigorously as those of any other project.',
          '每当医院与学校资源紧张，公共雕塑与壁画的开支就会招致批评。本文考察双方立场，认为公共艺术值得投入，但前提是其收益须与其他项目一样接受严格评估。',
          '开头即抛出带限定条件的论点，避免骑墙。',
        ],
        [
          'body1',
          'Advocates argue that public art generates value that ordinary services cannot. A mural commissioned in a declining district can raise footfall for local shops, and the extent to which such regeneration succeeds is documented in several European city audits.',
          '支持者认为公共艺术创造了普通服务无法提供的价值。在衰落街区委托创作的壁画可以提升本地商铺人流，多份欧洲城市审计报告记录了此类更新的成效。',
          '用 the extent to which 提高学术性，并给出证据来源。',
        ],
        [
          'body2',
          'Critics counter that every pound spent on a sculpture is a pound not spent on ambulances. This opportunity-cost argument is powerful precisely because the trade-off is immediate and measurable, whereas cultural returns unfold slowly.',
          '批评者反驳说，花在雕塑上的每一英镑都是没花在救护车上的一英镑。这一机会成本论之所以有力，正因为取舍是即时且可量化的，而文化回报却缓慢显现。',
          '解释对方论证为何有力，体现思辨深度。',
        ],
        [
          'evaluation',
          'Crucially, the two positions are not symmetrical. Were councils to publish evaluation data alongside each commission, the debate would become far less speculative and funding decisions could be defended on evidence.',
          '关键在于，双方并不对称。若市政当局在每次委托创作时同步公布评估数据，争论将大为减少臆测，资金决策也能以证据辩护。',
          '虚拟语气 + 提出可操作机制。',
        ],
        [
          'conclusion',
          'On balance, therefore, I support continued investment in public art, conditional on transparent evaluation rather than on the assumption that culture justifies itself.',
          '因此综合来看，我支持持续投资公共艺术，但以透明评估为条件，而非假定文化能自证其价值。',
          '结论呼应 intro 的限定条件。',
        ],
      ],
    },
    {
      taskType: 'task2',
      prompt:
        'Many employees now work from home for part of the week. Do the advantages of this arrangement outweigh the disadvantages for both employers and employees?',
      minWords: 250,
      structure: [
        'Paraphrase the trend and declare the overall judgement',
        'Advantage paragraph: focus on one benefit for employees and one for employers',
        'Disadvantage paragraph: focus on collaboration and career development',
        'Weigh the two sides and identify the decisive factor',
        'Conclusion: restate the judgement with the qualifying condition',
      ],
      connectives: ['A clear benefit is that', 'Conversely', 'Nevertheless', 'Ultimately'],
      patterns: [
        [
          'not only 倒装',
          'Not only + 助动词 + 主语 + 动词',
          'Not only do hybrid workers save commuting time, but firms also reduce office costs.',
          '^not only (do|does|did|is|are)',
        ],
        [
          'far from 表否定',
          'Far from + 动名词, 主谓',
          'Far from harming output, flexible hours often raise it.',
          '^far from \\w+ing',
        ],
      ],
    },
    {
      taskType: 'task1',
      prompt:
        'The table below shows household recycling rates in three cities between 2010 and 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. (City X 18% to 52%; City Y 41% to 47%; City Z 35% to 22%)',
      minWords: 150,
      structure: [
        'Paraphrase the table description in your own words',
        'Give an overview naming the fastest riser and the only decline',
        'Describe City X in detail with figures and rate of change',
        'Contrast City Y and City Z within one paragraph',
        'Finish with the gap between the highest and lowest final figures',
      ],
      connectives: ['Overall', 'By comparison', 'whereas', 'By the end of the period'],
      patterns: [
        [
          '倍数比较',
          'nearly + 数字 + times as + adj. + as',
          'City X recycled nearly three times as much waste in 2022 as in 2010.',
          '\\b(\\d+|two|three|four|five|six|seven|eight|nine|ten|several)\\s+times as\\b',
        ],
        [
          '分词后置修饰',
          '..., reaching + 数字',
          'The rate climbed steadily, reaching 52 per cent in 2022.',
          ', reaching \\d+',
        ],
        [
          'the only + 名词 + to do',
          'the only + 名词 + to + 动词原形',
          'City Z was the only city to record a fall over the whole period.',
          'the only \\w+ to ',
        ],
      ],
    },
  ],

  /* ============================= 雅思 7 分+ ============================= */
  ielts7plus: [
    {
      taskType: 'task2',
      prompt:
        'Some commentators claim that the internationalisation of higher education mainly benefits wealthy institutions rather than the countries that send students abroad. To what extent do you agree or disagree?',
      minWords: 250,
      structure: [
        'Reframe the claim precisely and state the degree of agreement',
        'Concede the strongest version of the opposing case before answering it',
        'Argument 1: analyse the financial asymmetry with a causal mechanism',
        'Argument 2: analyse knowledge transfer and returnee networks',
        'Qualify the position by identifying the conditions that change the outcome',
        'Conclusion: restate the qualified judgement in fresh wording',
      ],
      connectives: [
        'It would be simplistic to suggest that',
        'Granted',
        'The crux of the matter is',
        'Consequently',
        'In the final analysis',
      ],
      patterns: [
        [
          '名词化 + 因果',
          'The + 名词化 + of ... has led to ...',
          'The commodification of degrees has led to admissions policies driven by revenue targets.',
          'has led to',
        ],
        [
          '双重让步',
          'While it is true that ..., this does not mean that ...',
          'While it is true that fees flow outwards, this does not mean that sending countries gain nothing.',
          'while it is true that[\\s\\S]{0,120}does not mean',
        ],
        [
          '插入语式评注',
          '..., and this is the decisive point, ...',
          'Returnees carry tacit knowledge, and this is the decisive point, which no textbook transfers.',
          ', and this is the decisive point,',
        ],
        [
          '虚拟倒装',
          'Had + 主语 + 过去分词, ... would have ...',
          'Had governments negotiated research partnerships earlier, the balance would have shifted.',
          '^had \\w+ \\w+ed',
        ],
      ],
      model: [
        [
          'intro',
          'The claim that internationalisation enriches host universities at the expense of sending countries is intuitively appealing, yet it collapses several distinct flows into a single ledger. I agree with it only in part: the financial asymmetry is real, but the human capital account is far less one-sided.',
          '认为国际化让接收方大学获益而牺牲输出国的说法直觉上很有吸引力，但它把若干不同的流动混为一本账。我只部分同意：财务上的不对称确实存在，但人力资本这本账远没有那么一边倒。',
          '开头精确重述对方主张并给出「部分同意」的分寸。',
        ],
        [
          'concession',
          'Granted, the commodification of degrees has led to admissions policies driven by revenue targets. Institutions in a handful of English-speaking countries now depend on international fees to cross-subsidise domestic teaching, which is hardly an equitable arrangement.',
          '诚然，学位的商品化催生了以收入指标为导向的招生政策。少数英语国家的高校如今依赖国际学费来交叉补贴本国教学，这显然算不上公平安排。',
          '先把对方最强论证说透，避免稻草人。',
        ],
        [
          'body1',
          'The crux of the matter, however, is what returns home. While it is true that fees flow outwards, this does not mean that sending countries gain nothing: graduates carry tacit knowledge, and this is the decisive point, which no textbook transfers.',
          '然而问题的关键在于什么回流了。学费外流确属事实，但这并不意味着输出国一无所获：毕业生带回的是隐性知识，而这正是决定性的一点，是任何教科书都无法传递的。',
          '双重让步 + 插入语，密度高但不堆砌。',
        ],
        [
          'body2',
          'Empirically, the outcome depends on retention policy rather than on the direction of tuition payments. Countries that built research posts for returnees converted an apparent loss into a durable gain; those that did not simply exported talent.',
          '从经验上看，结果取决于人才留用政策，而非学费流向。为归国者设立研究岗位的国家把表面损失转化为持久收益；没有这样做的国家则只是输出了人才。',
          '引入决定性变量，把论证从立场之争推进到条件分析。',
        ],
        [
          'conclusion',
          'In the final analysis, the imbalance is a policy failure rather than an inevitable feature of internationalisation. Had governments negotiated research partnerships alongside student mobility, the ledger would look very different today.',
          '归根结底，这种失衡是政策失灵，而非国际化的必然特征。倘若各国政府在推动学生流动的同时谈成研究伙伴关系，今天的账本会大不相同。',
          '结论用虚拟语气收束，避免复述。',
        ],
      ],
    },
    {
      taskType: 'task2',
      prompt:
        'Artificial intelligence is increasingly used to make decisions that affect individuals, such as loan approvals and job shortlisting. Some argue that such systems should be banned from these areas entirely. To what extent do you agree or disagree?',
      minWords: 250,
      structure: [
        'Define the scope of the decisions under discussion and state the position',
        'Steelman the case for a ban: opacity, bias and the absence of redress',
        'Explain why an outright ban misdiagnoses the problem',
        'Propose the distinction that does the real work, such as advisory versus determinative use',
        'Address the strongest objection to that distinction',
        'Conclusion: restate the calibrated position',
      ],
      connectives: [
        'At first sight',
        'The stronger objection is that',
        'What follows from this is',
        'Even so',
        'Taken together',
      ],
      patterns: [
        [
          '条件让步',
          'Even if ..., it remains the case that ...',
          'Even if an algorithm outperforms humans on average, it remains the case that its errors are correlated.',
          'even if[\\s\\S]{0,120}remains the case',
        ],
        [
          'far less / still less 递进',
          '..., still less ...',
          'Applicants cannot inspect the model, still less contest its weighting.',
          'still less',
        ],
        [
          '分裂句强调对象',
          'What ... is ...',
          'What ought to be regulated is not the technology but the finality of the decision.',
          '^what [\\s\\S]{0,60} is not',
        ],
      ],
    },
    {
      taskType: 'task1',
      prompt:
        'The diagram below shows two processes for producing drinking water from seawater: thermal distillation and reverse osmosis. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. (Distillation: intake, heating, evaporation, condensation, mineral dosing, storage. Osmosis: intake, pre-filtration, high-pressure membrane, brine discharge, mineral dosing, storage.)',
      minWords: 150,
      structure: [
        'Paraphrase the diagram description and name both processes',
        'Give an overview stating the number of stages and the point of divergence',
        'Describe the distillation sequence in order using passive verbs',
        'Describe the osmosis sequence and highlight the brine by-product',
        'Compare the two routes at the stage where they reconverge',
      ],
      connectives: ['Initially', 'Subsequently', 'At this stage', 'Whereas', 'Finally'],
      patterns: [
        [
          '流程被动语态',
          'be + 过去分词 + before + 动名词',
          'Seawater is drawn into the plant before being heated to boiling point.',
          '\\bbefore being \\w+ed\\b',
        ],
        [
          '结果分词状语',
          '..., resulting in + 名词',
          'The vapour is cooled, resulting in a stream of nearly pure water.',
          ', resulting in ',
        ],
        [
          '对比连接',
          'Whereas + A, + B',
          'Whereas distillation relies on heat, osmosis depends on pressure.',
          '^whereas\\b',
        ],
      ],
    },
  ],
};

export default WRITING;
