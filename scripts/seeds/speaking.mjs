/**
 * 跟读种子（6 级 × 4 句）
 * ------------------------------------------------------------------
 * 单句结构：{ text, cn?, ipa?, rate? }
 *   text : 朗读文本（SpeechSynthesis 朗读 + Web Speech 识别比对的基准）
 *   cn   : 中文参考
 *   ipa  : 音标串（无 Web Speech 时仍可做「看音标自评」）
 *   rate : SpeechSynthesis rate，缺省 0.9；难度越高语速越接近自然语速
 *
 * 设计约束：
 *   1. 句子必须能被 lib/similarity.ts 的规范化流程稳定处理 ——
 *      因此不使用数字（如 "2020"）与缩写点号（如 "e.g."），
 *      识别引擎对这两类输出差异极大，会造成分数抖动；
 *   2. 每级 4 句覆盖不同韵律难点：连读、弱读、重音转移、长句断句；
 *   3. 长度递增，初中 8~12 词，雅思 7 分+ 可到 30 词以上，
 *      用于验证跟读页在长文本下的排版与录音时长控制。
 */

export const SPEAKING = {
  /* ================================ 初中 ================================ */
  junior: [
    {
      text: 'Could you tell me how to get to the nearest bus stop?',
      cn: '你能告诉我怎么去最近的公交车站吗？',
      ipa: '/kʊd juː tel miː haʊ tə ɡet tə ðə ˈnɪərɪst bʌs stɒp/',
      rate: 0.85,
    },
    {
      text: 'I usually walk to school with my best friend in the morning.',
      cn: '我早上通常和最好的朋友一起走路去学校。',
      ipa: '/aɪ ˈjuːʒuəli wɔːk tə skuːl wɪð maɪ best frend ɪn ðə ˈmɔːnɪŋ/',
      rate: 0.85,
    },
    {
      text: 'My favourite subject is science because the experiments are really fun.',
      cn: '我最喜欢的科目是科学，因为实验非常有趣。',
      ipa: '/maɪ ˈfeɪvərɪt ˈsʌbdʒɪkt ɪz ˈsaɪəns bɪˈkɒz ði ɪkˈsperɪmənts ə ˈrɪəli fʌn/',
      rate: 0.9,
    },
    {
      text: 'Would you like to join our reading club after class this Friday afternoon?',
      cn: '这周五下午课后你愿意加入我们的阅读社团吗？',
      ipa: '/wʊd juː laɪk tə dʒɔɪn ˈaʊə ˈriːdɪŋ klʌb ˈɑːftə klɑːs ðɪs ˈfraɪdeɪ ˌɑːftəˈnuːn/',
      rate: 0.9,
    },
  ],

  /* ================================ 高中 ================================ */
  senior: [
    {
      text: 'I would rather spend my weekend outdoors than stay at home all day.',
      cn: '我宁愿周末待在户外，也不想整天待在家里。',
      ipa: '/aɪ wʊd ˈrɑːðə spend maɪ ˌwiːkˈend ˌaʊtˈdɔːz ðən steɪ ət həʊm ɔːl deɪ/',
      rate: 0.9,
    },
    {
      text: 'The teacher suggested that we should read the whole article before the discussion.',
      cn: '老师建议我们在讨论之前读完整篇文章。',
      ipa: '/ðə ˈtiːtʃə səˈdʒestɪd ðət wi ʃəd riːd ðə həʊl ˈɑːtɪkl bɪˈfɔː ðə dɪˈskʌʃn/',
      rate: 0.9,
    },
    {
      text: 'Although the task looked difficult at first, we finished it ahead of schedule.',
      cn: '尽管这项任务起初看起来很难，我们还是提前完成了。',
      ipa: '/ɔːlˈðəʊ ðə tɑːsk lʊkt ˈdɪfɪkəlt ət fɜːst wi ˈfɪnɪʃt ɪt əˈhed əv ˈʃedjuːl/',
      rate: 0.95,
    },
    {
      text: 'What impressed me most was the way she explained a complex idea in plain words.',
      cn: '最让我印象深刻的是她用浅显的语言解释复杂观点的方式。',
      ipa: '/wɒt ɪmˈprest miː məʊst wɒz ðə weɪ ʃi ɪkˈspleɪnd ə ˈkɒmpleks aɪˈdɪə ɪn pleɪn wɜːdz/',
      rate: 0.95,
    },
  ],

  /* ================================ 大学 ================================ */
  college: [
    {
      text: 'The research suggests a strong correlation between sleep quality and academic performance.',
      cn: '该研究表明睡眠质量与学业表现之间存在很强的相关性。',
      ipa: '/ðə rɪˈsɜːtʃ səˈdʒests ə strɒŋ ˌkɒrəˈleɪʃn bɪˈtwiːn sliːp ˈkwɒləti ənd ˌækəˈdemɪk pəˈfɔːməns/',
      rate: 0.9,
    },
    {
      text: 'Before drawing any conclusion, we need to examine whether the sample was truly representative.',
      cn: '在得出任何结论之前，我们需要检查样本是否真正具有代表性。',
      ipa: '/bɪˈfɔː ˈdrɔːɪŋ ˈeni kənˈkluːʒn wi niːd tu ɪɡˈzæmɪn ˈweðə ðə ˈsɑːmpl wɒz ˈtruːli ˌreprɪˈzentətɪv/',
      rate: 0.9,
    },
    {
      text: 'Collaboration across departments often produces insights that no single team could reach alone.',
      cn: '跨部门协作常常产生任何单个团队都无法独立获得的洞见。',
      ipa: '/kəˌlæbəˈreɪʃn əˈkrɒs dɪˈpɑːtmənts ˈɒfn ˈprɒdjuːsɪz ˈɪnsaɪts ðət nəʊ ˈsɪŋɡl tiːm kʊd riːtʃ əˈləʊn/',
      rate: 0.95,
    },
    {
      text: 'I would argue that the benefits of the policy outweigh its short term costs for most students.',
      cn: '我认为对大多数学生而言，这项政策的收益超过其短期成本。',
      ipa: '/aɪ wʊd ˈɑːɡjuː ðət ðə ˈbenɪfɪts əv ðə ˈpɒləsi ˌaʊtˈweɪ ɪts ʃɔːt tɜːm kɒsts fə məʊst ˈstjuːdnts/',
      rate: 0.95,
    },
  ],

  /* ============================== 雅思 5.5 ============================== */
  ielts55: [
    {
      text: 'In my hometown, public transport is convenient, so most people do not need to drive every day.',
      cn: '在我的家乡，公共交通很方便，所以大多数人不需要每天开车。',
      ipa: '/ɪn maɪ ˈhəʊmtaʊn ˈpʌblɪk ˈtrænspɔːt ɪz kənˈviːniənt səʊ məʊst ˈpiːpl duː nɒt niːd tə draɪv ˈevri deɪ/',
      rate: 0.9,
    },
    {
      text: 'I have been learning English for several years, and speaking is still the part I find hardest.',
      cn: '我学英语已经好几年了，口语仍然是我觉得最难的部分。',
      ipa: '/aɪ həv biːn ˈlɜːnɪŋ ˈɪŋɡlɪʃ fə ˈsevrəl jɪəz ənd ˈspiːkɪŋ ɪz stɪl ðə pɑːt aɪ faɪnd ˈhɑːdɪst/',
      rate: 0.95,
    },
    {
      text: 'One thing I really enjoy about weekends is having enough time to cook a proper meal.',
      cn: '周末让我特别享受的一点是有足够时间做一顿像样的饭。',
      ipa: '/wʌn θɪŋ aɪ ˈrɪəli ɪnˈdʒɔɪ əˈbaʊt ˌwiːkˈendz ɪz ˈhævɪŋ ɪˈnʌf taɪm tə kʊk ə ˈprɒpə miːl/',
      rate: 0.95,
    },
    {
      text: 'If I had the chance to study abroad, I would definitely choose a city near the sea.',
      cn: '如果有机会出国留学，我一定会选一座靠海的城市。',
      ipa: '/ɪf aɪ hæd ðə tʃɑːns tə ˈstʌdi əˈbrɔːd aɪ wʊd ˈdefɪnətli tʃuːz ə ˈsɪti nɪə ðə siː/',
      rate: 0.95,
    },
  ],

  /* ============================ 雅思 6.0-6.5 ============================ */
  ielts65: [
    {
      text: 'While remote work saves commuting time, it can also blur the boundary between office hours and private life.',
      cn: '远程工作虽然节省了通勤时间，但也可能模糊工作时间与私人生活的界限。',
      ipa: '/waɪl rɪˈməʊt wɜːk seɪvz kəˈmjuːtɪŋ taɪm ɪt kən ˈɔːlsəʊ blɜː ðə ˈbaʊndri bɪˈtwiːn ˈɒfɪs ˈaʊəz ənd ˈpraɪvət laɪf/',
      rate: 0.95,
    },
    {
      text: 'What I find particularly interesting is how quickly people adapt to a technology they once resisted.',
      cn: '我觉得特别有意思的是，人们适应曾经抗拒的技术竟然如此之快。',
      ipa: '/wɒt aɪ faɪnd pəˈtɪkjələli ˈɪntrəstɪŋ ɪz haʊ ˈkwɪkli ˈpiːpl əˈdæpt tu ə tekˈnɒlədʒi ðeɪ wʌns rɪˈzɪstɪd/',
      rate: 0.95,
    },
    {
      text: 'To be honest, I used to believe that talent mattered most, but experience has changed my mind completely.',
      cn: '说实话，我以前认为天赋最重要，但经历彻底改变了我的看法。',
      ipa: '/tə bi ˈɒnɪst aɪ juːst tə bɪˈliːv ðət ˈtælənt ˈmætəd məʊst bət ɪkˈspɪəriəns həz tʃeɪndʒd maɪ maɪnd kəmˈpliːtli/',
      rate: 1,
    },
    {
      text: 'Rather than banning the practice outright, I think regulators should focus on making the process transparent.',
      cn: '与其彻底禁止这种做法，我认为监管者更应致力于让流程变得透明。',
      ipa: '/ˈrɑːðə ðən ˈbænɪŋ ðə ˈpræktɪs ˈaʊtraɪt aɪ θɪŋk ˈreɡjuleɪtəz ʃəd ˈfəʊkəs ɒn ˈmeɪkɪŋ ðə ˈprəʊses trænsˈpærənt/',
      rate: 1,
    },
  ],

  /* ============================= 雅思 7 分+ ============================= */
  ielts7plus: [
    {
      text: 'The internationalisation of higher education has undoubtedly reshaped university funding, yet its long term effect on sending countries remains genuinely contested.',
      cn: '高等教育的国际化无疑重塑了大学的经费结构，但它对生源国的长期影响仍然存在真正的争议。',
      ipa: '/ði ˌɪntəˌnæʃnəlaɪˈzeɪʃn əv ˈhaɪər ˌedʒuˈkeɪʃn həz ʌnˈdaʊtɪdli ˌriːˈʃeɪpt ˌjuːnɪˈvɜːsəti ˈfʌndɪŋ jet ɪts lɒŋ tɜːm ɪˈfekt ɒn ˈsendɪŋ ˈkʌntriz rɪˈmeɪnz ˈdʒenjuɪnli kənˈtestɪd/',
      rate: 0.95,
    },
    {
      text: 'What ought to be regulated is not the technology itself but the finality of the decisions it is allowed to make.',
      cn: '应当受到监管的不是技术本身，而是它被允许作出的决定的终局性。',
      ipa: '/wɒt ɔːt tə bi ˈreɡjuleɪtɪd ɪz nɒt ðə tekˈnɒlədʒi ɪtˈself bət ðə faɪˈnæləti əv ðə dɪˈsɪʒnz ɪt ɪz əˈlaʊd tə meɪk/',
      rate: 1,
    },
    {
      text: 'Even if an algorithm outperforms human assessors on average, it remains the case that its errors tend to be systematically correlated.',
      cn: '即便算法平均表现优于人类评估者，其错误仍然倾向于系统性地相互关联。',
      ipa: '/ˈiːvn ɪf ən ˈælɡərɪðəm ˌaʊtpəˈfɔːmz ˈhjuːmən əˈsesəz ɒn ˈævərɪdʒ ɪt rɪˈmeɪnz ðə keɪs ðət ɪts ˈerəz tend tə bi ˌsɪstəˈmætɪkli ˈkɒrəleɪtɪd/',
      rate: 1,
    },
    {
      text: 'Had policymakers negotiated genuine research partnerships alongside student mobility, the balance of benefit would look considerably less lopsided today.',
      cn: '倘若决策者在推动学生流动的同时谈成了实质性的研究伙伴关系，今天的收益格局会远没有这么失衡。',
      ipa: '/həd ˈpɒləsimeɪkəz nɪˈɡəʊʃieɪtɪd ˈdʒenjuɪn rɪˈsɜːtʃ ˈpɑːtnəʃɪps əˈlɒŋsaɪd ˈstjuːdnt məʊˈbɪləti ðə ˈbæləns əv ˈbenɪfɪt wʊd lʊk kənˈsɪdərəbli les ˈlɒpsaɪdɪd təˈdeɪ/',
      rate: 1,
    },
  ],
};

export default SPEAKING;
