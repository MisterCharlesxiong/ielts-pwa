/**
 * 阅读种子：6 级 × 4 篇，每篇 ≥4 题。
 * 首版题型**仅 single | boolean**（与 content/schema.ts 的校验一致）。
 *
 * 坑 #4：junior/r1 为 ≥600 词长文，用于验证段落级进度、长文滚动与字号切换。
 * paras 为逐段字符串数组，IntersectionObserver 依赖它上报阅读游标。
 */

export const READING = {
  /* ------------------------------ 初中 ------------------------------ */
  junior: [
    {
      title: "The School Recycling Project",
      paras: [
        "Two years ago, the students of Green Hill Middle School noticed a problem. Every afternoon, the bins near the canteen were full of paper cups, plastic bottles and half-eaten sandwiches. By Friday the bins were so full that rubbish fell onto the ground. When the wind blew, plastic bags flew across the playground and got stuck in the trees. Nobody liked the mess, but nobody knew exactly what to do about it, so the problem simply continued week after week.",
        "One morning, a Year Eight student called Lin Xia decided to count the rubbish. With three friends, she spent a whole lunch break sorting the contents of a single bin onto a plastic sheet. The result surprised everyone. Nearly two thirds of the rubbish was paper or plastic that could be recycled. Only a small part was real waste. Lin Xia took photographs, made a simple poster and asked her class teacher whether she could show the poster at the Monday assembly.",
        "The teacher agreed, and the assembly changed everything. When six hundred students saw the photographs on the big screen, the hall went quiet. Lin Xia did not give a long speech. She said only one sentence: 'We throw away enough paper every week to fill this stage.' Then she invited anyone who wanted to help to meet her in Room 12 after school. She expected five or six people. Thirty-two students came, and four teachers came with them.",
        "The group called itself the Green Team. Their first plan was simple. They asked the school to buy three coloured bins for every floor: blue for paper, yellow for plastic and grey for everything else. The head teacher liked the idea but explained that the school budget was already fixed for that year. Instead of giving up, the Green Team wrote letters to six local companies. Two of them replied, and one printing company agreed to pay for twenty-four bins.",
        "Buying bins turned out to be the easy part. In the first month, many students still put their rubbish in the wrong bin. Sandwich boxes went into the paper bin; clean paper went into the grey bin. The Green Team realised that colours alone were not enough. They printed clear pictures and stuck them above each bin, showing exactly what could go inside. They also asked two volunteers from each class to stand near the bins during the first week of every term.",
        "Slowly, the habit changed. By the end of the second month, the amount of general waste had fallen by about forty per cent. The school sold the collected paper to a recycling centre and earned a small amount of money. The Green Team used it to buy seeds, soil and simple tools, and turned an unused corner of the playground into a small vegetable garden. Classes took turns to water the plants, and the first harvest was a box of tomatoes.",
        "Not everything went perfectly. During the winter, the recycling centre stopped collecting soft plastic, so the yellow bins filled up quickly and had to be emptied into general waste. Some students said the whole project was pointless. Lin Xia disagreed. She explained that a temporary problem is not the same as a failure, and that the school could store the soft plastic until the centre started collecting it again in the spring. Most students accepted her explanation.",
        "Today the Green Team has more than eighty members, and other schools in the city have asked for advice. Lin Xia, who is now in Year Nine, says the most important lesson was not about rubbish at all. 'At the beginning we thought we needed money and permission,' she says. 'In fact we needed information first. Once people could see the numbers, they wanted to help.' The bins are still there, and the trees no longer catch plastic bags.",
      ],
      glossary: [
        ["canteen", "食堂"],
        ["assembly", "全校集会"],
        ["general waste", "其他垃圾（不可回收）"],
        ["harvest", "收成"],
      ],
      qs: [
        {
          t: 's',
          stem: "What convinced other students that the rubbish problem was serious?",
          opts: [
            "A|A long speech given by a teacher",
            "B|Photographs and the results of counting the rubbish",
            "C|A letter from a local company",
          ],
          a: 'B',
          ex: "第二、三段说明林霞先统计垃圾成分并拍照，集会上的照片让全场安静下来。",
        },
        {
          t: 'b',
          stem: "The school paid for the twenty-four new bins out of its own budget.",
          a: false,
          ex: "第四段明确说校方预算已定，最终由一家印刷公司出资购买。",
        },
        {
          t: 's',
          stem: "Why did the Green Team put pictures above each bin?",
          opts: [
            "A|Because the bins were too small",
            "B|Because colours alone did not tell students what to put inside",
            "C|Because the head teacher asked them to",
          ],
          a: 'B',
          ex: "第五段指出仅靠颜色不够，于是贴上图片说明可投放物品。",
        },
        {
          t: 'b',
          stem: "In winter the recycling centre stopped taking soft plastic.",
          a: true,
          ex: "第七段直接说明冬季回收中心暂停收取软塑料。",
        },
        {
          t: 's',
          stem: "According to Lin Xia, what did the team need most at the beginning?",
          opts: ["A|Money", "B|Permission", "C|Information"],
          a: 'C',
          ex: "最后一段引语指出他们最初以为需要钱和许可，其实首先需要的是信息。",
        },
      ],
    },
    {
      title: "Why Sleep Matters for Students",
      paras: [
        "Most teenagers need between eight and ten hours of sleep each night, but many get far less. Homework, screens and early school start times all take time away from rest. Some students believe they can catch up at the weekend, yet research suggests that sleeping late on Saturday does not fully repair the damage done from Monday to Friday.",
        "Sleep is not simply a pause. While you sleep, the brain sorts through what happened during the day and stores the most useful information. This is one reason why reviewing new words before bed often works better than reviewing them at noon. A tired brain can still read, but it stores far less.",
        "Short sleep also affects mood and body. Students who sleep less than seven hours report more arguments with friends, more headaches and more colds. Reaction time slows down, which matters for anyone who cycles to school in heavy traffic.",
        "The good news is that small changes help. Keeping the same bedtime every day, dimming lights an hour before sleep and leaving the phone outside the bedroom are simple steps. None of them costs money, and most students notice a difference within two weeks.",
      ],
      glossary: [
        ["reaction time", "反应时间"],
        ["dim", "调暗"],
      ],
      qs: [
        {
          t: 's',
          stem: "How much sleep do most teenagers need?",
          opts: ["A|Six to seven hours", "B|Eight to ten hours", "C|Eleven to twelve hours"],
          a: 'B',
          ex: "第一段第一句给出数据。",
        },
        {
          t: 'b',
          stem: "Sleeping late at the weekend completely makes up for a short night on weekdays.",
          a: false,
          ex: "第一段末句指出周末补觉并不能完全修复损害。",
        },
        {
          t: 's',
          stem: "Why is reviewing words before bed useful?",
          opts: [
            "A|Because the room is quiet at night",
            "B|Because the brain sorts and stores information during sleep",
            "C|Because teachers recommend it",
          ],
          a: 'B',
          ex: "第二段解释睡眠期间大脑整理并储存信息。",
        },
        {
          t: 'b',
          stem: "The article says the suggested changes are expensive.",
          a: false,
          ex: "最后一段明确说这些改变不花钱。",
        },
      ],
    },
    {
      title: "The Bicycle That Changed a Village",
      paras: [
        "Before 2008, children in the village of Tanpo walked two hours each way to reach the nearest secondary school. Many of them stopped studying after primary school, not because they disliked lessons, but because four hours of walking left no time for homework.",
        "A retired mechanic named Mr Zhou noticed something in the city: hundreds of old bicycles were left rusting outside apartment blocks. He asked the residents whether he could take them, and within a year he had collected more than ninety bikes.",
        "Repairing them was slow work. Mr Zhou trained six teenagers to change tyres, fix brakes and oil chains. The training had a second purpose. Once the students could repair their own bikes, the project no longer depended on one person.",
        "Ten years later, the number of Tanpo students finishing secondary school has more than doubled. Mr Zhou is careful about claiming credit. 'The bikes only removed one obstacle,' he says. 'The families did the rest.'",
      ],
      qs: [
        {
          t: 's',
          stem: "Why did many Tanpo children leave school early before 2008?",
          opts: [
            "A|They did not enjoy studying",
            "B|The journey left them no time to study",
            "C|The school charged high fees",
          ],
          a: 'B',
          ex: "第一段说明并非不喜欢上课，而是四小时步行没有时间做作业。",
        },
        {
          t: 'b',
          stem: "Mr Zhou bought new bicycles for the students.",
          a: false,
          ex: "第二段说明他收集的是城市里废弃的旧自行车。",
        },
        {
          t: 's',
          stem: "What was the second purpose of training the teenagers?",
          opts: [
            "A|To make the project independent of one person",
            "B|To help them find jobs in the city",
            "C|To reduce the cost of tyres",
          ],
          a: 'A',
          ex: "第三段指出学生学会修车后项目不再依赖一个人。",
        },
        {
          t: 'b',
          stem: "Mr Zhou believes the bicycles alone explain the improvement.",
          a: false,
          ex: "最后一段引语说自行车只是移除了一个障碍，其余靠家庭。",
        },
      ],
    },
    {
      title: "A Weekend on the City Farm",
      paras: [
        "On Saturday mornings, a piece of land behind the railway station turns into a farm. Twenty families share thirty small plots, and each plot is about the size of a parking space. Nobody grows enough to live on, but that is not the point.",
        "Mrs Ali, who has been coming for six years, says the farm taught her children where food comes from. Her youngest son once believed that carrots grew on trees. After a season of digging, he can name eight vegetables and knows which ones need the most water.",
        "The farm also solves a quieter problem. Many people in the neighbourhood live alone. On the farm they talk to their neighbours about soil, rain and slugs, and those conversations continue outside the gate.",
        "There is a waiting list of more than fifty families. The council has promised a second site next year, though nobody is sure whether the promise will survive the next budget.",
      ],
      qs: [
        {
          t: 's',
          stem: "How large is each plot on the city farm?",
          opts: ["A|About the size of a parking space", "B|About the size of a football pitch", "C|About the size of a classroom"],
          a: 'A',
          ex: "第一段给出明确比喻。",
        },
        {
          t: 'b',
          stem: "Families on the farm grow enough food to live on.",
          a: false,
          ex: "第一段说明没人靠这些菜生活。",
        },
        {
          t: 's',
          stem: "What is the 'quieter problem' mentioned in the text?",
          opts: ["A|Noise from the railway", "B|Loneliness among neighbours", "C|A shortage of water"],
          a: 'B',
          ex: "第三段说明许多人独居，农场提供了交谈机会。",
        },
        {
          t: 'b',
          stem: "The council has already built the second site.",
          a: false,
          ex: "最后一段说只是承诺明年建，且能否兑现尚不确定。",
        },
      ],
    },
  ],

  /* ------------------------------ 高中 ------------------------------ */
  senior: [
    {
      title: "The Quiet Return of the Night Train",
      paras: [
        "For most of the last twenty years, the night train looked like a relic. Budget airlines were cheaper and faster, and one by one European operators closed their sleeper services. Between 2000 and 2018, the number of night routes fell by roughly two thirds.",
        "The reversal began for reasons that had little to do with romance. Rising fuel taxes on short flights, growing awareness of aviation emissions and, later, a period when air travel became unpredictable all pushed passengers to reconsider the overnight option.",
        "Operators also changed what they were selling. Older sleepers offered shared compartments with limited privacy. Newer carriages provide single pods with a door, a reading light and a socket, which appeals to travellers who would otherwise pay for a hotel room.",
        "Economics remains difficult. A sleeper carriage carries far fewer passengers than a daytime coach of the same length, and the train occupies a track slot all night. Without public support, several routes would close again within a season.",
        "Supporters argue that the comparison with flying is unfair, because aviation benefits from tax exemptions on fuel. Critics reply that subsidising a comfortable service for relatively wealthy travellers is a poor use of public money. Both arguments rest on assumptions about who actually travels at night, and reliable passenger data are surprisingly scarce.",
      ],
      glossary: [
        ["relic", "遗留物，过时之物"],
        ["compartment", "车厢包间"],
        ["track slot", "线路时刻资源"],
      ],
      qs: [
        {
          t: 's',
          stem: "What mainly caused night trains to decline before 2018?",
          opts: [
            "A|Poor track maintenance",
            "B|Cheaper and faster budget flights",
            "C|A shortage of drivers",
          ],
          a: 'B',
          ex: "第一段指出廉价航空更便宜更快，导致夜车线路减少约三分之二。",
        },
        {
          t: 'b',
          stem: "The writer says the revival of night trains was mainly driven by nostalgia.",
          a: false,
          ex: "第二段明确说复兴的原因与浪漫情怀关系不大。",
        },
        {
          t: 's',
          stem: "Why do newer sleeper carriages attract passengers?",
          opts: [
            "A|They are cheaper than shared compartments",
            "B|They offer private pods comparable to a hotel room",
            "C|They travel faster than older trains",
          ],
          a: 'B',
          ex: "第三段说明单人舱带门、灯与插座，可替代酒店。",
        },
        {
          t: 'b',
          stem: "According to the text, reliable data about night-train passengers are limited.",
          a: true,
          ex: "最后一句指出可靠的乘客数据出奇地稀少。",
        },
        {
          t: 's',
          stem: "Which statement best describes the writer's attitude?",
          opts: [
            "A|Enthusiastic and certain",
            "B|Balanced and cautious",
            "C|Dismissive and negative",
          ],
          a: 'B',
          ex: "作者同时呈现支持与批评两方，并指出双方都建立在假设上，属于平衡谨慎的态度。",
        },
      ],
    },
    {
      title: "Learning a Language After Thirty",
      paras: [
        "A common belief holds that adults cannot learn languages well. The evidence is more interesting than that. Adults usually acquire vocabulary and grammar faster than children, because they can use explicit rules and prior knowledge. Where they fall behind is pronunciation and, sometimes, willingness to sound foolish.",
        "One study followed 120 adult learners for eighteen months. Those who spoke aloud for at least fifteen minutes a day improved measurably more than those who studied twice as long in silence. The advantage did not come from talent; it came from feedback.",
        "Motivation matters, but not in the way many people assume. Learners who wanted to pass an exam often stopped soon after passing it. Learners who wanted to talk to a specific person kept going for years.",
        "The practical conclusion is unglamorous. Regular, slightly uncomfortable speaking practice beats occasional intensive study, and a concrete social reason beats a general wish to improve.",
      ],
      qs: [
        {
          t: 's',
          stem: "In what area do adult learners typically lag behind children?",
          opts: ["A|Vocabulary", "B|Grammar rules", "C|Pronunciation"],
          a: 'C',
          ex: "第一段指出成年人在发音方面落后。",
        },
        {
          t: 'b',
          stem: "In the study, learners who studied silently for longer made greater progress.",
          a: false,
          ex: "第二段说明每天出声练习十五分钟的人进步更明显。",
        },
        {
          t: 's',
          stem: "Which type of motivation lasted longest?",
          opts: [
            "A|Passing an examination",
            "B|Talking to a particular person",
            "C|Improving general ability",
          ],
          a: 'B',
          ex: "第三段指出为了与特定的人交流而学习的人坚持数年。",
        },
        {
          t: 'b',
          stem: "The writer describes the conclusion as exciting and dramatic.",
          a: false,
          ex: "最后一段用 unglamorous 形容结论，意为平淡无奇。",
        },
      ],
    },
    {
      title: "When Cities Cool Themselves",
      paras: [
        "On a hot afternoon, the centre of a large city can be six degrees warmer than the fields around it. Concrete and asphalt absorb heat during the day and release it slowly at night, so the city never fully cools down. Planners call this the urban heat island effect.",
        "Trees help, but not equally. A single street tree provides shade for a small area, while a continuous canopy along a road can lower the surface temperature by several degrees. The difference lies in coverage rather than in the number of trees planted.",
        "Materials matter too. Light-coloured roofs reflect more sunlight than dark ones, and permeable paving allows water to evaporate, taking heat with it. Neither solution is expensive when applied during normal repairs, yet both are often skipped because the benefit is invisible on the day of installation.",
        "The clearest lesson from recent projects is that cooling measures work best in combination. A city that plants trees but keeps black roofs will see modest gains; a city that changes both may reduce peak temperatures enough to cut hospital admissions during heatwaves.",
      ],
      qs: [
        {
          t: 's',
          stem: "What is the urban heat island effect?",
          opts: [
            "A|Cities being cooler than surrounding areas at night",
            "B|Cities staying warmer because hard surfaces store and release heat",
            "C|Islands becoming hotter than the mainland",
          ],
          a: 'B',
          ex: "第一段解释混凝土与沥青白天吸热、夜间缓慢释放。",
        },
        {
          t: 'b',
          stem: "According to the text, the number of trees matters more than continuous coverage.",
          a: false,
          ex: "第二段强调关键在连续覆盖，而非种树数量。",
        },
        {
          t: 's',
          stem: "Why are light roofs and permeable paving often skipped?",
          opts: [
            "A|They are extremely expensive",
            "B|Their benefit is not visible immediately",
            "C|They damage the road surface",
          ],
          a: 'B',
          ex: "第三段指出成本不高，但收益当天看不见，因而常被跳过。",
        },
        {
          t: 'b',
          stem: "The text suggests combining several cooling measures is more effective than using one.",
          a: true,
          ex: "最后一段直接说明组合措施效果最好。",
        },
      ],
    },
    {
      title: "The Museum That Lends Objects",
      paras: [
        "Most museums keep the majority of their collection in storage. In one regional museum, ninety-four per cent of objects had not been displayed for a decade. The director decided to try something unusual: lending everyday historical objects to local residents.",
        "The rules were strict. Only robust items were included, each borrower attended a short handling session, and every object was photographed before and after loan. In three years, 1,800 loans produced eleven minor damages and no losses.",
        "The unexpected result was not about objects at all. Borrowers wrote about the items, and their notes became part of the museum record. A 1950s kitchen scale, previously catalogued in one line, now carries four pages of family memories.",
        "Critics warn that the scheme depends on a small, trusting community and might not transfer to a large city. The director agrees, and points out that the scheme was never designed as a national model, only as a way to make a specific collection useful again.",
      ],
      qs: [
        {
          t: 's',
          stem: "What problem was the director trying to solve?",
          opts: [
            "A|A shortage of visitors",
            "B|Most of the collection was never displayed",
            "C|The building needed repairs",
          ],
          a: 'B',
          ex: "第一段指出九成四的藏品十年未展出。",
        },
        {
          t: 'b',
          stem: "Several objects were lost during the three-year scheme.",
          a: false,
          ex: "第二段说明有十一件轻微损坏，但没有丢失。",
        },
        {
          t: 's',
          stem: "What was the unexpected benefit of the scheme?",
          opts: [
            "A|The objects were repaired for free",
            "B|Borrowers added personal records to the collection",
            "C|Ticket sales increased sharply",
          ],
          a: 'B',
          ex: "第三段说明借用者的记述成为馆藏记录的一部分。",
        },
        {
          t: 'b',
          stem: "The director claims the scheme should be adopted nationally.",
          a: false,
          ex: "最后一段说明该方案从未被设计为全国模式。",
        },
      ],
    },
  ],

  /* ------------------------------ 大学 ------------------------------ */
  college: [
    {
      title: "Replication and the Credibility of Research",
      paras: [
        "A finding that cannot be reproduced is, at best, a hypothesis. Over the past fifteen years, several large replication projects have tried to repeat well-known studies under similar conditions. In psychology, roughly forty per cent of attempted replications produced results consistent with the originals; in cancer biology, the figure was lower still.",
        "These numbers are often reported as a scandal, but the interpretation is not straightforward. A failed replication may indicate that the original result was a false positive, that the replication was underpowered, or that an unrecognised variable differs between the two settings. Distinguishing among these explanations requires further work, which is rarely funded.",
        "Incentives explain much of the problem. Journals have historically preferred novel, positive findings, and academic careers depend on publication. A researcher who spends two years confirming someone else's result gains little professional credit, even though the contribution to collective knowledge may be substantial.",
        "Reforms have followed. Pre-registration requires researchers to state hypotheses and analysis plans before collecting data, which limits the flexibility that allows weak findings to appear strong. Registered reports go further: journals accept the study on the basis of its design, before results exist.",
        "Sceptics note that these mechanisms add administrative burden and may discourage exploratory research, which has its own value. The reasonable position is not that exploration is bad, but that exploratory and confirmatory work should be labelled honestly and evaluated by different standards.",
      ],
      glossary: [
        ["replication", "重复验证"],
        ["false positive", "假阳性"],
        ["underpowered", "统计效力不足的"],
        ["pre-registration", "预注册"],
      ],
      qs: [
        {
          t: 's',
          stem: "According to the passage, what does a failed replication NOT necessarily prove?",
          opts: [
            "A|That the original finding was false",
            "B|That replication is a useful method",
            "C|That journals prefer novel results",
          ],
          a: 'A',
          ex: "第二段列出三种可能解释，失败并不必然说明原结果为假。",
        },
        {
          t: 'b',
          stem: "The passage states that confirming another researcher's result usually brings strong career rewards.",
          a: false,
          ex: "第三段明确说这类工作几乎得不到职业认可。",
        },
        {
          t: 's',
          stem: "What is the purpose of pre-registration?",
          opts: [
            "A|To guarantee positive results",
            "B|To limit analytic flexibility after data collection",
            "C|To speed up peer review",
          ],
          a: 'B',
          ex: "第四段说明预注册限制了让弱结果显得强的灵活性。",
        },
        {
          t: 'b',
          stem: "The writer argues that exploratory research should be abandoned.",
          a: false,
          ex: "最后一段明确说探索性研究有其价值，关键在于诚实标注。",
        },
        {
          t: 's',
          stem: "Which best summarises the writer's overall stance?",
          opts: [
            "A|Research is fundamentally untrustworthy",
            "B|Structural incentives, not individual dishonesty, drive the problem",
            "C|Replication projects are a waste of resources",
          ],
          a: 'B',
          ex: "第三段将问题归因于激励结构，全文并未指控个人不诚实。",
        },
      ],
    },
    {
      title: "The Economics of Free Software",
      paras: [
        "Software given away without charge should, by simple reasoning, attract no investment. In practice, some of the most heavily used code in the world is free, maintained by companies that compete fiercely elsewhere.",
        "One explanation is complementarity. A firm selling servers benefits when the operating system running on them is free, reliable and widely understood. The free component increases demand for the paid one.",
        "A second explanation concerns cost sharing. When five companies each need the same underlying library, maintaining five private versions is wasteful. A shared public version reduces duplicated effort even if it also helps competitors.",
        "The model has a well-documented weakness. Widely used components are sometimes maintained by one or two unpaid volunteers, and the burden becomes visible only when a serious flaw appears. Recent funding initiatives attempt to address this, though coverage remains uneven.",
      ],
      qs: [
        {
          t: 's',
          stem: "What does 'complementarity' mean in this context?",
          opts: [
            "A|Free software raises demand for related paid products",
            "B|Companies praise each other publicly",
            "C|Volunteers complete each other's work",
          ],
          a: 'A',
          ex: "第二段解释免费组件提升了付费产品的需求。",
        },
        {
          t: 'b',
          stem: "The passage argues that sharing a library helps competitors and is therefore avoided.",
          a: false,
          ex: "第三段承认会帮到竞争者，但仍指出共享减少了重复劳动。",
        },
        {
          t: 's',
          stem: "When does the maintenance problem usually become visible?",
          opts: ["A|During annual audits", "B|When a serious flaw appears", "C|When volunteers request payment"],
          a: 'B',
          ex: "第四段说明只有出现严重漏洞时负担才被看见。",
        },
        {
          t: 'b',
          stem: "According to the passage, recent funding initiatives have solved the problem completely.",
          a: false,
          ex: "最后一句指出覆盖仍不均衡。",
        },
      ],
    },
    {
      title: "Reading a Landscape as a Document",
      paras: [
        "Field boundaries, road curves and the position of old trees record decisions taken centuries ago. A landscape historian reads these features much as a textual scholar reads a manuscript, looking for layers written at different times.",
        "Consider a road that bends sharply for no visible reason. The bend may follow the edge of a field that disappeared two hundred years ago, or avoid a marsh that has since been drained. The obstacle is gone; the response to it remains.",
        "This method has limits. Physical evidence rarely dates itself precisely, and similar patterns can arise from unrelated causes. Careful practitioners therefore combine field observation with maps, tax records and, where available, aerial photography.",
        "The wider value of the approach is not antiquarian. Understanding why a settlement grew where it did often explains present-day problems, such as why a particular junction floods or why one district has almost no public open space.",
      ],
      qs: [
        {
          t: 's',
          stem: "What comparison does the writer make in the first paragraph?",
          opts: [
            "A|Landscapes are compared to manuscripts with several layers",
            "B|Historians are compared to farmers",
            "C|Roads are compared to rivers",
          ],
          a: 'A',
          ex: "第一段把景观史学者比作解读手稿的文本学者。",
        },
        {
          t: 'b',
          stem: "The passage says that a road bend always indicates a drained marsh.",
          a: false,
          ex: "第二段给出两种可能，并非唯一解释。",
        },
        {
          t: 's',
          stem: "Why do practitioners combine methods?",
          opts: [
            "A|Because field observation is illegal alone",
            "B|Because physical evidence is hard to date and can be ambiguous",
            "C|Because maps are always more accurate",
          ],
          a: 'B',
          ex: "第三段指出物证难以精确断代且相似形态可能成因不同。",
        },
        {
          t: 'b',
          stem: "The writer believes the approach has practical present-day value.",
          a: true,
          ex: "最后一段说明它能解释当下的积水与公共空间等问题。",
        },
      ],
    },
    {
      title: "Attention as a Scarce Resource",
      paras: [
        "Information is abundant; attention is not. This asymmetry, first described in the 1970s, has become the organising principle of much of the digital economy. Services that appear free are financed by the sale of the audience's time.",
        "The design consequences are systematic rather than accidental. Infinite scrolling removes natural stopping points, variable rewards encourage repeated checking, and notifications convert idle moments into engagement. None of these features is inherently malicious, and each solves a genuine usability problem.",
        "Individual remedies, such as deleting applications or setting timers, have modest and short-lived effects in most studies. This is unsurprising: an individual acting alone is competing against systems refined through continuous experimentation on millions of users.",
        "Structural proposals include default settings that favour the user, restrictions on design patterns aimed at children, and transparency about experiments. Each raises difficult questions about who defines the user's interest, and about the risk of entrenching large firms that can afford compliance.",
      ],
      qs: [
        {
          t: 's',
          stem: "What is the central asymmetry described?",
          opts: [
            "A|Information is scarce while attention is abundant",
            "B|Information is abundant while attention is scarce",
            "C|Both information and attention are scarce",
          ],
          a: 'B',
          ex: "第一句即点明信息充裕而注意力稀缺。",
        },
        {
          t: 'b',
          stem: "The writer claims the design features discussed are deliberately malicious.",
          a: false,
          ex: "第二段明确说这些特性并非天生恶意，且各自解决了真实的可用性问题。",
        },
        {
          t: 's',
          stem: "Why are individual remedies described as limited?",
          opts: [
            "A|Users lack self-control",
            "B|Individuals compete against systems optimised on millions of users",
            "C|Timers are technically unreliable",
          ],
          a: 'B',
          ex: "第三段解释个体在与持续实验优化的系统对抗。",
        },
        {
          t: 'b',
          stem: "The passage notes that regulation could unintentionally favour large firms.",
          a: true,
          ex: "最后一段提到合规成本可能强化大公司地位。",
        },
      ],
    },
  ],

  /* ---------------------------- 雅思 5.5 ---------------------------- */
  ielts55: [
    {
      title: "Working from Home: Three Years On",
      paras: [
        "When large numbers of office staff began working from home, most employers expected the arrangement to be temporary. Three years later, surveys in several countries show that around a quarter of professional employees still work remotely for at least two days a week.",
        "The reported benefits are consistent. Employees save commuting time, which averages nearly an hour a day in large cities, and report better control over their schedules. Employers, meanwhile, have reduced spending on office space.",
        "The drawbacks are also consistent, though less easy to measure. New staff learn more slowly without informal contact, and managers report difficulty in noticing early signs that a colleague is struggling. Some employees describe a blurred boundary between work and rest.",
        "Hybrid arrangements are now the most common compromise, but they create their own problems. If half the team is in the office and half at home, meetings favour those in the room unless the organisation deliberately changes its habits.",
        "The pattern that emerges is not a simple victory for either side. Remote work suits experienced staff doing focused tasks, while office presence remains valuable for training, negotiation and the early stages of a project.",
      ],
      glossary: [
        ["remotely", "远程地"],
        ["hybrid", "混合式的"],
        ["blurred boundary", "模糊的界线"],
      ],
      qs: [
        {
          t: 's',
          stem: "What proportion of professional employees still work remotely at least twice a week?",
          opts: ["A|About a tenth", "B|About a quarter", "C|About a half"],
          a: 'B',
          ex: "第一段给出约四分之一。",
        },
        {
          t: 'b',
          stem: "The passage says commuting in large cities averages nearly an hour a day.",
          a: true,
          ex: "第二段直接给出该数据。",
        },
        {
          t: 's',
          stem: "Which group is said to suffer most from a lack of informal contact?",
          opts: ["A|Senior managers", "B|New staff", "C|Part-time workers"],
          a: 'B',
          ex: "第三段指出新员工在缺乏非正式接触时学习更慢。",
        },
        {
          t: 'b',
          stem: "According to the passage, hybrid meetings automatically treat everyone equally.",
          a: false,
          ex: "第四段说明除非组织刻意改变习惯，否则会议偏向在场者。",
        },
        {
          t: 's',
          stem: "What is the writer's overall conclusion?",
          opts: [
            "A|Remote work is better in every respect",
            "B|Office work should be restored fully",
            "C|Each mode suits different tasks and stages",
          ],
          a: 'C',
          ex: "最后一段说明远程适合有经验员工的专注任务，办公室适合培训与项目初期。",
        },
      ],
    },
    {
      title: "Food Waste in the Supply Chain",
      paras: [
        "Roughly one third of food produced for human consumption is never eaten. The loss is spread unevenly along the chain. In lower-income countries, most waste occurs before food reaches the shop, because of storage and transport problems. In higher-income countries, most waste occurs in shops and homes.",
        "Supermarkets have received much of the public criticism, yet their share of total waste is smaller than that of households. Cosmetic standards, which reject oddly shaped vegetables, remain a genuine problem, but relaxing them affects only part of the picture.",
        "Household waste is harder to address because it results from many small decisions. Buying in bulk saves money but increases the risk that food expires. Confusion between 'best before' and 'use by' labels leads to edible food being discarded.",
        "Several cities have tested simple interventions: clearer labels, smaller default portion sizes in canteens, and apps that connect shops with nearby residents. Results are promising but modest, and most studies are too short to show whether behaviour change lasts.",
      ],
      qs: [
        {
          t: 's',
          stem: "Where does most food waste occur in lower-income countries?",
          opts: ["A|In homes", "B|Before food reaches the shop", "C|In restaurants"],
          a: 'B',
          ex: "第一段说明低收入国家的浪费主要发生在储运环节。",
        },
        {
          t: 'b',
          stem: "The passage states that supermarkets waste more food than households.",
          a: false,
          ex: "第二段说明超市所占份额小于家庭。",
        },
        {
          t: 's',
          stem: "Why is household waste difficult to reduce?",
          opts: [
            "A|It results from many small everyday decisions",
            "B|Households are not interested in saving money",
            "C|There are no labels on food",
          ],
          a: 'A',
          ex: "第三段指出家庭浪费源于许多细小决策。",
        },
        {
          t: 'b',
          stem: "Most studies of the interventions are long enough to prove lasting change.",
          a: false,
          ex: "最后一句说明多数研究时间太短。",
        },
      ],
    },
    {
      title: "Public Libraries in the Digital Age",
      paras: [
        "Predictions that libraries would close as books moved online have not been fulfilled. Visits fell in the early 2000s, then stabilised, and in several countries have risen again. What changed was the reason people came.",
        "Borrowing remains important, but libraries now provide free internet access, quiet study space, language classes and help with official forms. In areas with low household connectivity, the library is often the only reliable place to complete a job application.",
        "This shift creates tension. Staff trained as librarians increasingly perform social work for which they were not prepared, and budgets have not grown to match. Some authorities have responded by placing libraries inside larger community hubs.",
        "Whether that model succeeds appears to depend on a detail that is easy to overlook: whether the library keeps a separate, quiet area. Where it does, usage grows. Where the space becomes entirely open-plan, regular users often drift away.",
      ],
      qs: [
        {
          t: 's',
          stem: "What happened to library visits after the early 2000s?",
          opts: ["A|They continued to fall", "B|They stabilised and later rose in some countries", "C|They doubled immediately"],
          a: 'B',
          ex: "第一段说明先下降后稳定，部分国家再度上升。",
        },
        {
          t: 'b',
          stem: "The passage says libraries now offer services beyond lending books.",
          a: true,
          ex: "第二段列出上网、自习、语言课与表格协助等服务。",
        },
        {
          t: 's',
          stem: "What tension is described in the third paragraph?",
          opts: [
            "A|Librarians doing social work without training or extra budget",
            "B|Readers arguing about noise",
            "C|Publishers refusing to supply books",
          ],
          a: 'A',
          ex: "第三段明确指出这一矛盾。",
        },
        {
          t: 'b',
          stem: "According to the passage, fully open-plan community hubs always increase library use.",
          a: false,
          ex: "最后一段说明完全开放式空间会让常客流失。",
        },
      ],
    },
    {
      title: "The Return of the Tram",
      paras: [
        "Many cities removed their tram networks in the mid-twentieth century to make room for cars. Since 1990, more than a hundred cities have built new lines, often along the same streets.",
        "Trams are expensive to build but cheap to run, and they carry more passengers per driver than buses. Their fixed route is sometimes described as a disadvantage; supporters argue it is the main benefit, because businesses and housing developers can rely on the line still being there in twenty years.",
        "Construction is disruptive. Shops along the route typically lose trade for a year or more, and compensation schemes vary widely between cities. Where compensation is generous, opposition tends to fade quickly.",
        "Evidence on car use is mixed. Some new lines mainly attract former bus passengers rather than drivers. The strongest reductions in car traffic occur where the tram is introduced together with parking restrictions, which suggests the vehicle itself is only part of the explanation.",
      ],
      qs: [
        {
          t: 's',
          stem: "Why do supporters see a fixed route as an advantage?",
          opts: [
            "A|It allows higher speeds",
            "B|It gives long-term certainty to businesses and developers",
            "C|It reduces construction costs",
          ],
          a: 'B',
          ex: "第二段说明固定线路带来二十年的确定性。",
        },
        {
          t: 'b',
          stem: "The passage says shops along a tram route usually benefit during construction.",
          a: false,
          ex: "第三段说明施工期间商铺通常损失生意一年以上。",
        },
        {
          t: 's',
          stem: "When are reductions in car traffic strongest?",
          opts: [
            "A|When trams replace buses entirely",
            "B|When trams are combined with parking restrictions",
            "C|When ticket prices are lowest",
          ],
          a: 'B',
          ex: "最后一段指出与停车限制配合时效果最强。",
        },
        {
          t: 'b',
          stem: "The writer concludes that building a tram alone guarantees fewer cars.",
          a: false,
          ex: "最后一句说明电车本身只是解释的一部分。",
        },
      ],
    },
  ],

  /* --------------------------- 雅思 6.0-6.5 --------------------------- */
  ielts65: [
    {
      title: "Rewilding: Ambition and Its Limits",
      paras: [
        "Rewilding proposes that ecosystems recover most effectively when natural processes, rather than detailed human management, are allowed to determine outcomes. In its strongest form it involves reintroducing large herbivores or predators whose grazing and hunting shape vegetation across wide areas.",
        "Advocates point to measurable results. In one long-running Dutch reserve, free-roaming herbivores produced a mosaic of grassland and scrub that supported a wider range of birds than the uniform reed bed it replaced. Comparable effects have been recorded following the return of beavers to river catchments, where dams slow water and reduce downstream flood peaks.",
        "Critics raise two distinct objections. The first is practical: many landscapes are too fragmented for large-scale processes to operate, and reintroduced animals inevitably encounter farms and roads. The second is conceptual. If the aim is to remove human influence, which historical baseline should be restored, given that people have shaped these landscapes for millennia?",
        "The debate is complicated by animal welfare. In severe winters, free-roaming herds may starve. Managers who intervene are accused of abandoning the principle; those who do not are accused of cruelty. Neither position is comfortable, and public reaction is often decisive.",
        "A more modest interpretation has gained ground. Rather than pursuing wilderness, some projects aim to restore specific processes — natural grazing pressure, river dynamics, decaying wood — within landscapes that remain populated. This version is less dramatic, but it is easier to defend when the funding is public and the neighbours are farmers.",
      ],
      glossary: [
        ["herbivore", "食草动物"],
        ["catchment", "流域"],
        ["baseline", "基准状态"],
        ["scrub", "灌木丛"],
      ],
      qs: [
        {
          t: 's',
          stem: "What is the central claim of rewilding in its strongest form?",
          opts: [
            "A|Ecosystems recover best under detailed human management",
            "B|Natural processes should determine outcomes, including through reintroduced animals",
            "C|All farmland should be converted to forest",
          ],
          a: 'B',
          ex: "第一段定义了自然过程主导与大型动物重引入。",
        },
        {
          t: 'b',
          stem: "The Dutch reserve example shows that a uniform reed bed supported more bird species.",
          a: false,
          ex: "第二段说明镶嵌式草地与灌丛支持的鸟类比原先的芦苇地更多。",
        },
        {
          t: 's',
          stem: "What is described as the conceptual objection?",
          opts: [
            "A|Landscapes are fragmented by roads",
            "B|There is no obvious historical baseline to restore",
            "C|Beaver dams increase flooding",
          ],
          a: 'B',
          ex: "第三段第二项反对意见即基准状态难以界定。",
        },
        {
          t: 'b',
          stem: "According to the passage, managers face criticism whether or not they intervene in severe winters.",
          a: true,
          ex: "第四段说明干预与不干预都会受到指责。",
        },
        {
          t: 's',
          stem: "Why has the more modest interpretation gained support?",
          opts: [
            "A|It produces faster ecological change",
            "B|It is easier to justify to the public and to neighbouring farmers",
            "C|It requires no funding",
          ],
          a: 'B',
          ex: "最后一段指出在公共资金与农民邻居的现实下更易辩护。",
        },
      ],
    },
    {
      title: "Measuring What Schools Actually Add",
      paras: [
        "League tables built on raw examination results measure intake as much as teaching. A school selecting the highest-attaining pupils will appear excellent even if its teaching is ordinary. Value-added models attempt to correct this by comparing each pupil's outcome with the outcome predicted from prior attainment.",
        "The correction is real but incomplete. Prior attainment does not capture everything that families provide, and the models are sensitive to the choice of variables. Two defensible models applied to the same data can rank the same school in the top fifth and the middle fifth respectively.",
        "There is also a behavioural response. When a single measure carries high stakes, institutions optimise for it. Schools may concentrate resources on pupils near a grade boundary, because moving those pupils changes the published figure most efficiently.",
        "None of this means measurement should be abandoned. Unmeasured systems are not neutral; they simply shift judgement to reputation, which correlates strongly with wealth. The realistic aim is a small set of imperfect indicators, published with their uncertainty, and read alongside inspection evidence rather than instead of it.",
      ],
      qs: [
        {
          t: 's',
          stem: "What is the main weakness of raw examination league tables?",
          opts: [
            "A|They are published too late",
            "B|They largely reflect which pupils a school admits",
            "C|They ignore examination results entirely",
          ],
          a: 'B',
          ex: "第一段指出原始成绩排名反映的是生源。",
        },
        {
          t: 'b',
          stem: "The passage says two reasonable value-added models always produce the same ranking.",
          a: false,
          ex: "第二段说明两个合理模型可能给出显著不同的排名。",
        },
        {
          t: 's',
          stem: "What behavioural response is described?",
          opts: [
            "A|Schools focus on pupils close to a grade boundary",
            "B|Schools reduce examination entries to zero",
            "C|Schools publish their own tables",
          ],
          a: 'A',
          ex: "第三段明确说明资源集中在分数线附近的学生。",
        },
        {
          t: 'b',
          stem: "The writer concludes that measurement should be abandoned.",
          a: false,
          ex: "最后一段明确反对放弃测量，主张少量指标并标注不确定性。",
        },
      ],
    },
    {
      title: "Antibiotic Resistance and Collective Action",
      paras: [
        "Antibiotic resistance is often presented as a scientific problem awaiting a technical solution. It is more accurately a problem of incentives. Each individual prescription is rational for the patient in front of the doctor; the cost falls on future patients who are not in the room.",
        "Development economics offers an uncomfortable parallel. New antibiotics are most valuable when used least, which inverts the usual commercial model. A company that invests a decade in a novel compound is then asked to keep it in reserve, generating almost no revenue.",
        "Proposed remedies separate payment from volume. Subscription models pay a fixed annual sum for guaranteed access, regardless of how many doses are used. Early pilots suggest the approach can work, though the sums involved are small relative to the estimated need.",
        "Agricultural use complicates matters further. In several countries, more antibiotics are given to livestock than to people, often to promote growth rather than to treat disease. Restrictions have reduced use substantially where they have been enforced, which suggests the barrier is political rather than technical.",
      ],
      qs: [
        {
          t: 's',
          stem: "Why does the writer call resistance a problem of incentives?",
          opts: [
            "A|Because doctors lack training",
            "B|Because the cost of each prescription falls on future patients",
            "C|Because patients refuse treatment",
          ],
          a: 'B',
          ex: "第一段解释个体处方理性而成本外部化到未来患者。",
        },
        {
          t: 'b',
          stem: "The passage says new antibiotics are most valuable when they are used as often as possible.",
          a: false,
          ex: "第二段指出新抗生素用得越少价值越高。",
        },
        {
          t: 's',
          stem: "What is the key feature of subscription payment models?",
          opts: [
            "A|Payment is separated from the number of doses sold",
            "B|Payment depends on patient recovery rates",
            "C|Payment is made only after ten years",
          ],
          a: 'A',
          ex: "第三段说明按固定年费购买可及性，与用量脱钩。",
        },
        {
          t: 'b',
          stem: "The writer suggests that reducing agricultural antibiotic use is mainly a political challenge.",
          a: true,
          ex: "最后一句指出障碍是政治性的而非技术性的。",
        },
      ],
    },
    {
      title: "Why Forecasts Fail Gracefully",
      paras: [
        "Long-range forecasts are frequently wrong, yet they are not therefore useless. The value of a forecast lies less in its central number than in the range it defines and the assumptions it makes explicit.",
        "Consider population projections. Demographers rarely claim to know the exact figure for 2070; they publish scenarios based on stated fertility and migration assumptions. When the outcome differs, the informative question is which assumption failed, not whether the number matched.",
        "Problems arise when a projection is reported as a prediction. A range becomes a headline figure, uncertainty disappears, and the forecaster is later accused of error. Media incentives play a part, but so do forecasters who present single numbers because they attract attention.",
        "The most useful discipline is to state in advance what evidence would count as falsifying the model. Forecasters who do this build credibility slowly; those who do not are eventually indistinguishable from commentators, however sophisticated their methods.",
      ],
      qs: [
        {
          t: 's',
          stem: "Where does the writer locate the main value of a forecast?",
          opts: [
            "A|In its central figure",
            "B|In its range and explicit assumptions",
            "C|In the reputation of the forecaster",
          ],
          a: 'B',
          ex: "第一段明确指出价值在于区间与显性假设。",
        },
        {
          t: 'b',
          stem: "According to the passage, demographers usually claim to know exact future figures.",
          a: false,
          ex: "第二段说明人口学家发布的是基于假设的情景。",
        },
        {
          t: 's',
          stem: "Who does the writer hold responsible for turning ranges into headline numbers?",
          opts: [
            "A|Only journalists",
            "B|Both media incentives and forecasters seeking attention",
            "C|Only government agencies",
          ],
          a: 'B',
          ex: "第三段同时指出媒体激励与预测者的责任。",
        },
        {
          t: 'b',
          stem: "The writer recommends stating in advance what would count as evidence against a model.",
          a: true,
          ex: "最后一段提出这是最有用的自律做法。",
        },
      ],
    },
  ],

  /* --------------------------- 雅思 7 分+ --------------------------- */
  ielts7plus: [
    {
      title: "The Uneasy Case for Technological Optimism",
      paras: [
        "Arguments about technology tend to divide into two familiar postures. Optimists observe that predicted catastrophes have repeatedly failed to materialise and infer that alarm is systematically overdone. Pessimists observe that past success is a poor guide when the mechanism of risk changes, and infer that the absence of previous disaster proves little. Both inferences are defensible; neither settles the question.",
        "A more productive framing distinguishes between risks that are reversible and those that are not. Where a mistake can be corrected within a generation, iterative deployment and rapid feedback are reasonable. Where the plausible worst case forecloses future options, the asymmetry between the cost of caution and the cost of error justifies a slower approach even under considerable uncertainty about probabilities.",
        "This distinction cuts across the usual political alignments. It implies tolerance for experimentation in domains such as materials science, where failures are contained and informative, and correspondingly greater restraint in domains where systems are tightly coupled and errors propagate before they are noticed.",
        "The framing is not without difficulties. Reversibility is itself uncertain, and there is a temptation to classify any disliked technology as irreversible in order to justify prohibition. Guarding against that requires specifying, in advance and in concrete terms, what evidence would move a technology from one category to the other.",
        "Perhaps the most consequential objection is that the distinction does nothing to address distribution. A risk that is reversible at the level of a society may be permanent for a particular community, and aggregate reasoning conceals this. A defensible framework must therefore ask not only whether a mistake can be undone, but for whom, and on what timescale.",
      ],
      glossary: [
        ["posture", "立场，姿态"],
        ["iterative", "迭代式的"],
        ["foreclose", "排除（未来选择）"],
        ["tightly coupled", "强耦合的"],
      ],
      qs: [
        {
          t: 's',
          stem: "What does the writer say about the two familiar postures?",
          opts: [
            "A|Both inferences are defensible but neither resolves the question",
            "B|The optimists are demonstrably correct",
            "C|The pessimists rely on no evidence at all",
          ],
          a: 'A',
          ex: "第一段末句明确指出两种推论都站得住，但都不能定论。",
        },
        {
          t: 'b',
          stem: "The writer proposes distinguishing risks by whether they are reversible.",
          a: true,
          ex: "第二段提出可逆与不可逆的区分。",
        },
        {
          t: 's',
          stem: "In which kind of domain does the framing support greater restraint?",
          opts: [
            "A|Domains where failures are contained and informative",
            "B|Domains where systems are tightly coupled and errors spread unnoticed",
            "C|Domains with the largest commercial value",
          ],
          a: 'B',
          ex: "第三段指出强耦合、错误快速传播的领域需要更多克制。",
        },
        {
          t: 'b',
          stem: "The writer acknowledges that the reversibility criterion could be misused.",
          a: true,
          ex: "第四段承认存在把不喜欢的技术归为不可逆以支持禁令的诱惑。",
        },
        {
          t: 's',
          stem: "What does the writer identify as the most consequential objection?",
          opts: [
            "A|That reversibility is expensive to measure",
            "B|That aggregate reasoning hides unequal distribution of harm",
            "C|That politicians will ignore the framework",
          ],
          a: 'B',
          ex: "最后一段指出总量推理掩盖了特定群体承受的永久性损害。",
        },
      ],
    },
    {
      title: "Translation and the Illusion of Equivalence",
      paras: [
        "The everyday model of translation assumes a message that exists independently of language and can be transferred intact between codes. Practising translators rarely recognise this description. What they encounter is a text whose meaning is partly constituted by the resources of its own language, including rhythm, register and the associations that particular words carry.",
        "Consider terms of address. A language that grammaticalises social distance forces a choice at every turn; a language that does not obliges the translator either to omit the information or to add material that the original never made explicit. Neither option is neutral, and the second risks over-specifying what the author left implicit.",
        "Literary translators have developed a vocabulary for these trade-offs, distinguishing between fluency, which conceals the translator's intervention, and visibility, which acknowledges it. The dominance of fluent translation in some markets has been criticised on the grounds that it presents the foreign text as if it had been written locally, quietly erasing difference.",
        "Machine translation has changed the practical landscape without resolving the theoretical problem. Systems trained on parallel corpora reproduce the conventions of previous human translations, including their omissions. Fluency has improved dramatically; the question of what should be preserved has not become any easier to answer.",
      ],
      qs: [
        {
          t: 's',
          stem: "What assumption does the writer attribute to the everyday model of translation?",
          opts: [
            "A|That meaning exists independently of language and transfers intact",
            "B|That translation is impossible",
            "C|That only literary texts can be translated",
          ],
          a: 'A',
          ex: "第一段开头即描述这一日常模型。",
        },
        {
          t: 'b',
          stem: "The writer argues that adding explicit information about social distance is a neutral solution.",
          a: false,
          ex: "第二段明确说两种选择都不中立，且补充信息有过度specify的风险。",
        },
        {
          t: 's',
          stem: "What criticism is made of fluent translation?",
          opts: [
            "A|It is too slow to produce",
            "B|It hides the translator and erases foreignness",
            "C|It cannot handle poetry",
          ],
          a: 'B',
          ex: "第三段指出流畅译文让外语文本看似本地写成，抹去差异。",
        },
        {
          t: 'b',
          stem: "According to the passage, machine translation has resolved the theoretical problem.",
          a: false,
          ex: "最后一段说明它改变了实践格局但未解决理论问题。",
        },
      ],
    },
    {
      title: "Infrastructure and the Politics of Maintenance",
      paras: [
        "Public debate about infrastructure concentrates almost entirely on construction. Ribbon-cutting is visible, attributable and photogenic; maintenance is none of these things. The predictable consequence is a stock of assets built with enthusiasm and sustained with reluctance.",
        "The accounting treatment reinforces the bias. Capital expenditure is frequently financed by borrowing and recorded as investment, whereas maintenance appears as current spending and competes directly with services that have organised constituencies. A bridge that is neglected does not lobby.",
        "Deferred maintenance is not merely delayed maintenance. Deterioration is typically non-linear: a surface that is resealed on schedule may last decades, while the same surface left for a few additional years may require full reconstruction at many times the cost. Postponement therefore converts a small predictable expense into a large unpredictable one.",
        "Reform proposals include ring-fenced maintenance budgets, statutory condition reporting and contracts that bundle construction with long-term upkeep. Each has documented weaknesses. Bundled contracts, for example, transfer risk to the contractor but reduce flexibility and can prove costly when requirements change.",
        "What unites successful jurisdictions is less a particular instrument than a habit of publishing asset condition in a form that citizens can interpret. Visibility does not guarantee funding, but invisibility very nearly guarantees its absence.",
      ],
      qs: [
        {
          t: 's',
          stem: "Why does the writer say maintenance is politically neglected?",
          opts: [
            "A|It is technically difficult",
            "B|It is invisible and cannot be attributed to a politician",
            "C|It is prohibited by accounting rules",
          ],
          a: 'B',
          ex: "第一段指出维护不可见、不可归功、不上镜。",
        },
        {
          t: 'b',
          stem: "The passage claims that deterioration proceeds at a steady, linear rate.",
          a: false,
          ex: "第三段明确说劣化通常是非线性的。",
        },
        {
          t: 's',
          stem: "What weakness of bundled contracts is mentioned?",
          opts: [
            "A|They eliminate contractor risk entirely",
            "B|They reduce flexibility and can be costly when requirements change",
            "C|They prevent any condition reporting",
          ],
          a: 'B',
          ex: "第四段指出捆绑合同降低灵活性、需求变化时代价高。",
        },
        {
          t: 'b',
          stem: "The writer concludes that publishing asset condition guarantees adequate funding.",
          a: false,
          ex: "最后一句说可见性不保证资金，但不可见几乎保证没有资金。",
        },
      ],
    },
    {
      title: "Expertise, Judgement and the Limits of Rules",
      paras: [
        "Checklists have transformed safety in aviation and surgery, and their success has encouraged wider adoption. The underlying insight is that experts reliably fail at routine steps under time pressure, and that a simple external memory aid removes a large class of errors at negligible cost.",
        "Enthusiasm has, however, outrun the evidence in some settings. Checklists work best where the task is well specified, the failure modes are known and the environment is comparatively stable. Where problems are ill-structured, the same instrument can substitute compliance for thought, producing documentation that certifies attention rather than delivering it.",
        "The distinction matters because the two regimes require different professional cultures. Rule-following rewards conscientiousness; judgement under uncertainty rewards the willingness to depart from procedure when the situation does not fit. An organisation that punishes every deviation will get the first and lose the second.",
        "Attempts to reconcile the two often take the form of graded protocols: mandatory steps for well-understood risks, and explicit permission to deviate, with a requirement to record the reasoning. Evaluations suggest such schemes work only where the recorded reasoning is actually reviewed and where deviation, when justified, carries no penalty. Without those conditions, staff simply learn to comply on paper.",
      ],
      qs: [
        {
          t: 's',
          stem: "What is the underlying insight behind checklists?",
          opts: [
            "A|Experts lack knowledge of their field",
            "B|Experts fail at routine steps under pressure, and a memory aid removes such errors",
            "C|Novices should replace experts",
          ],
          a: 'B',
          ex: "第一段明确说明专家在时间压力下会遗漏常规步骤。",
        },
        {
          t: 'b',
          stem: "The passage says checklists are equally effective for ill-structured problems.",
          a: false,
          ex: "第二段指出在结构不良的问题中，清单可能以合规取代思考。",
        },
        {
          t: 's',
          stem: "What risk does the writer see in punishing every deviation?",
          opts: [
            "A|The organisation loses the capacity for judgement",
            "B|The organisation becomes less conscientious",
            "C|Checklists become longer",
          ],
          a: 'A',
          ex: "第三段说明惩罚一切偏离会得到尽责但失去判断力。",
        },
        {
          t: 'b',
          stem: "According to the passage, graded protocols work only if recorded reasoning is genuinely reviewed.",
          a: true,
          ex: "最后一段给出这一条件，否则员工只会在纸面上合规。",
        },
      ],
    },
  ],
};
