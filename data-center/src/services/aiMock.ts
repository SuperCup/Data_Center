/** AI Workbench mock engine — frontend simulation only */

export type CapabilityType =
  | 'query'
  | 'diagnose'
  | 'analyze'
  | 'action'
  | 'opportunity'
  | 'report';

export interface ChatAction {
  label: string;
  action: 'goto' | 'artifact' | 'followup';
  target?: string;
  artifactType?: string;
  text?: string;
}

export interface ChatReply {
  text: string;
  metrics?: { label: string; value: string }[];
  actions?: ChatAction[];
  artifact?: { title: string; type: string; summary: string };
  context?: string[];
}

export interface ChatScript {
  id: string;
  type: CapabilityType;
  match: RegExp[];
  title: string;
  userSeed: string;
  reply: ChatReply;
}

export interface SessionItem {
  id: string;
  title: string;
  type: CapabilityType;
  updatedAt: string;
  preview: string;
}

export interface ArtifactItem {
  id: string;
  title: string;
  type: string;
  source: string;
  createdAt: string;
  summary: string;
  sessionId?: string;
}

export interface AttachmentItem {
  id: string;
  name: string;
  size: string;
  mime: string;
  createdAt: string;
  sessionId?: string;
  sessionTitle?: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  kind: string;
  status: 'enabled' | 'disabled';
  updatedAt: string;
  refs: number;
  content: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  kind: string;
  pinned: boolean;
  content: string;
  updatedAt: string;
}

export const CAPABILITIES: {
  type: CapabilityType;
  name: string;
  desc: string;
  example: string;
}[] = [
  { type: 'query', name: '数据查询', desc: '自然语言查看板指标，返回带口径结果', example: '上周美团闪购 GMV？' },
  { type: 'diagnose', name: '经营诊断', desc: '定位异常与根因，输出诊断结论', example: '华东核销率为何下滑？' },
  { type: 'analyze', name: '数据分析', desc: '对比、趋势、结构与机制效果分析', example: '满减档位哪个更好？' },
  { type: 'action', name: '行动建议', desc: '生成可落地的 P0/P1 动作清单', example: '下周该做什么？' },
  { type: 'opportunity', name: '商机探索', desc: '渠道×品类机会矩阵与加码方向', example: '暑期冰品怎么加码？' },
  { type: 'report', name: '报告生成', desc: '汇总指标与建议，生成经营报告', example: '生成即时零售周报' },
];

export const TYPE_LABEL: Record<CapabilityType, string> = {
  query: '数据查询',
  diagnose: '经营诊断',
  analyze: '数据分析',
  action: '行动建议',
  opportunity: '商机探索',
  report: '报告生成',
};

export const TYPE_COLOR: Record<CapabilityType, string> = {
  query: 'blue',
  diagnose: 'orange',
  analyze: 'cyan',
  action: 'gold',
  opportunity: 'purple',
  report: 'geekblue',
};

const scripts: ChatScript[] = [
  {
    id: 'report_weekly',
    type: 'report',
    match: [/报告|周报|月报|生成报告|汇报材料|产出报告/i],
    title: '即时零售周报生成',
    userSeed: '帮我生成一份即时零售近一周经营报告。',
    reply: {
      text: '已汇总看板与口径手册，生成《即时零售周报 · W29》（模拟）：\n\n**报告结构**\n1. 经营总览：GMV ¥1,286 万（+12.4%），核销率 68.2%\n2. 渠道表现：美团闪购贡献突出，饿了么稳健\n3. 风险与机会：华东核销承压；便利店冰品可加码\n4. 下周动作建议：三件落地项（见产出物）\n\n报告已写入产出物中心，可继续导出或追加行动建议章节。',
      metrics: [
        { label: '报告页数', value: '6 页' },
        { label: '覆盖指标', value: '18 项' },
        { label: '动作建议', value: '3 条' },
        { label: '数据截止', value: 'T+1' },
      ],
      actions: [
        { label: '查看产出物', action: 'artifact', artifactType: '报告' },
        { label: '补充行动建议', action: 'followup', text: '基于这份周报，给出下周可执行的行动建议' },
      ],
      artifact: {
        title: '即时零售周报 · W29',
        type: '报告',
        summary: 'GMV、核销、渠道结构与下周三条动作建议的摘要版。',
      },
      context: ['即时零售 · 活动进度', '知识库 · 指标口径手册'],
    },
  },
  {
    id: 'opportunity_summer',
    type: 'opportunity',
    match: [/商机|机会|探索|暑期|增长点|加码|破圈/i],
    title: '暑期商机探索',
    userSeed: '帮我做一版暑期饮品/冰品的商机探索。',
    reply: {
      text: '基于近 4 周渠道 × 品类与物码互动，输出商机矩阵（模拟）：\n\n**Top 机会**\n1. **便利店 × 冰品组合** — 热度高、供给可匹配，建议「第二件半价」\n2. **闪购 × 方便面套装** — 夜间订单 34%，适合夜宵加投\n3. **瓶盖码 × 会员复购** — 转化 11.4%，可导流到店券包\n\n**谨慎项**：抖音超市香氛试用 ROI 波动大；避免竞品同框（品牌红线）。',
      metrics: [
        { label: '机会分 Top1', value: '92' },
        { label: '预估增量 GMV', value: '+¥160万' },
        { label: '建议预算', value: '¥48万' },
        { label: '周期', value: '2周' },
      ],
      actions: [
        { label: '生成商机矩阵', action: 'artifact', artifactType: '图表卡' },
        { label: '转成行动建议', action: 'followup', text: '把 Top3 商机落成下周行动建议清单' },
      ],
      artifact: {
        title: '暑期商机矩阵',
        type: '图表卡',
        summary: '便利店冰品、闪购夜宵套装、瓶盖码会员复购为 Top3 机会。',
      },
      context: ['物码营销 · 用户分析', '知识库 · 投放红线'],
    },
  },
  {
    id: 'action_plan',
    type: 'action',
    match: [/行动建议|怎么做|落地|下一步|动作清单|执行计划|可执行/i],
    title: '下周行动建议',
    userSeed: '基于当前经营情况，给我一份可落地的行动建议。',
    reply: {
      text: '结合诊断结论与商机矩阵，输出**可执行行动清单**（模拟）：\n\n**P0（本周必做）**\n1. 华东便利店机制下调至满 25 减 2.5，同步观测核销\n2. Top 200 缺货门店启动供给预警，日更跟进\n\n**P1（下周）**\n3. 闪购夜宵时段加投方便面套装，预算 ¥18 万试投\n4. 瓶盖码导流到店券包，目标拉新 3 万\n\n**验收指标**：核销率回升 ≥2pp；试投 ROI ≥ 2.8。',
      metrics: [
        { label: 'P0 动作', value: '2 项' },
        { label: 'P1 动作', value: '2 项' },
        { label: '建议预算', value: '¥18万' },
        { label: '验收周期', value: '7 天' },
      ],
      actions: [
        { label: '保存为建议卡', action: 'artifact', artifactType: '建议卡' },
        { label: '生成完整报告', action: 'followup', text: '把诊断、分析和行动建议汇总成一份经营报告' },
      ],
      artifact: {
        title: '下周行动建议清单',
        type: '建议卡',
        summary: 'P0/P1 四项动作、预算与验收指标。',
      },
      context: ['经营诊断结论', '商机矩阵 Top3'],
    },
  },
  {
    id: 'diagnose_redeem',
    type: 'diagnose',
    match: [/诊断|下滑|异常|为什么低|问题定位|根因|承压/i],
    title: '核销率下滑经营诊断',
    userSeed: '华东核销率最近下滑，帮我做经营诊断。',
    reply: {
      text: '完成经营诊断（模拟），结论如下：\n\n**现象**：华东核销率 64.0%，环比 -4.2pp\n\n**根因排序**\n1. 便利店「满 30 减 3」门槛高于客单中位数（¥27）→ 领而不核\n2. 周末缺货率升至 11% → 核销路径中断\n3. 费用加码侧重 GMV，未与核销机制联动\n\n**诊断置信度**：高。建议下一步进入「行动建议」或「数据分析」。',
      metrics: [
        { label: '华东核销率', value: '64.0%' },
        { label: '环比', value: '-4.2pp' },
        { label: '缺货率', value: '11%' },
        { label: '主因权重', value: '机制 55%' },
      ],
      actions: [
        { label: '保存诊断卡', action: 'artifact', artifactType: '建议卡' },
        { label: '要行动建议', action: 'followup', text: '基于诊断结论，给出可落地的行动建议' },
      ],
      artifact: {
        title: '核销率问题诊断卡',
        type: '建议卡',
        summary: '门槛偏高 + 缺货是主因，机制因素权重约 55%。',
      },
      context: ['到店营销 · 销售分析', '知识库 · 投放红线'],
    },
  },
  {
    id: 'analyze_mechanism',
    type: 'analyze',
    match: [/数据分析|对比分析|趋势分析|结构分析|归因|机制对比|满减/i],
    title: '满减机制效果分析',
    userSeed: '帮我做一版到店满减机制的数据分析，看看哪个档位更好。',
    reply: {
      text: '完成到店满减机制**数据分析**（模拟）：\n\n**档位对比**\n1. 满20减2 — GMV ¥186万 · 核销 72% · ROI 3.8\n2. 满30减3 — GMV ¥142万 · 核销 65% · ROI 3.1\n3. 满25减2.5 — GMV ¥98万 · 核销 58% · ROI 2.7\n4. 新人立减 — GMV ¥76万 · 核销 81% · ROI 4.2\n\n**结论**：「满 20 减 2」性价比最优；「新人立减」适合拉新池。',
      metrics: [
        { label: '最优机制', value: '满20减2' },
        { label: '综合分', value: '91' },
        { label: '样本天数', value: '28 天' },
        { label: '平台覆盖', value: '4 个' },
      ],
      actions: [
        { label: '导出分析表', action: 'artifact', artifactType: '导出文件' },
        { label: '基于分析给行动建议', action: 'followup', text: '基于满减机制分析，给出行动建议' },
      ],
      artifact: {
        title: '到店机制效果分析表',
        type: '导出文件',
        summary: '各满减档位订单、GMV、客单、核销与 ROI 明细。',
      },
      context: ['到店营销 · 销售分析', '知识库 · 指标口径'],
    },
  },
  {
    id: 'query_gmv',
    type: 'query',
    match: [/gmv|成交|销售额|查询|查数|多少|美团|闪购|数据查询/i],
    title: '美团闪购 GMV 查询',
    userSeed: '上周美团闪购的 GMV 是多少？核销表现怎么样？',
    reply: {
      text: '数据查询结果（模拟，口径见品牌指标手册）：\n\n**上周美团闪购**\n- GMV：**¥428 万**，环比 +18%\n- 订单量：9.6 万单，客单 ¥44.6\n- 核销率：**71.4%**（高于大盘 68.2%）\n\n已按记忆偏好附带华东：GMV 贡献 39%，核销率 74.1%。',
      metrics: [
        { label: '美团闪购 GMV', value: '¥428万' },
        { label: '核销率', value: '71.4%' },
        { label: '订单量', value: '9.6万' },
        { label: '环比', value: '+18%' },
      ],
      actions: [
        { label: '做经营诊断', action: 'followup', text: '美团闪购 ROI 是否异常？帮我做经营诊断' },
        { label: '生成周报', action: 'followup', text: '把这些查询结果生成一份周报' },
      ],
      artifact: {
        title: '美团闪购指标摘录',
        type: '报告',
        summary: '上周 GMV 428 万、核销 71.4%，含华东对比。',
      },
      context: ['即时零售 · 活动进度', '知识库 · 品牌指标口径手册'],
    },
  },
];

export const INITIAL_SESSIONS: SessionItem[] = [
  { id: 's1', title: '美团闪购 GMV 查询', type: 'query', updatedAt: '今天 10:24', preview: '美团闪购上周 GMV 为 428 万…' },
  { id: 's2', title: '核销率下滑经营诊断', type: 'diagnose', updatedAt: '昨天 16:08', preview: '华东区核销率环比下降 4.2pp…' },
  { id: 's3', title: '满减机制效果分析', type: 'analyze', updatedAt: '昨天 11:20', preview: '满 20 减 2 综合分最优…' },
  { id: 's4', title: '下周行动建议', type: 'action', updatedAt: '昨天 09:40', preview: 'P0 两项 + P1 两项…' },
  { id: 's5', title: '暑期饮品商机探索', type: 'opportunity', updatedAt: '周一 11:30', preview: '建议加码便利店冰品…' },
  { id: 's6', title: '即时零售周报生成', type: 'report', updatedAt: '周一 09:00', preview: '已生成 W29 经营报告…' },
];

export const INITIAL_ARTIFACTS: ArtifactItem[] = [
  { id: 'a1', title: '即时零售周报 · W29', type: '报告', source: '即时零售周报生成', createdAt: '今天 10:26', summary: 'GMV、订单、核销与渠道结构一周摘要。', sessionId: 's6' },
  { id: 'a2', title: '核销率问题诊断卡', type: '建议卡', source: '核销率下滑经营诊断', createdAt: '昨天 16:12', summary: '定位华东便利店券门槛偏高。', sessionId: 's2' },
  { id: 'a3', title: '暑期商机矩阵', type: '图表卡', source: '暑期饮品商机探索', createdAt: '周一 11:35', summary: '渠道 × 品类机会评分 Top3。', sessionId: 's5' },
  { id: 'a4', title: '到店机制效果导出.xlsx', type: '导出文件', source: '满减机制效果分析', createdAt: '上周', summary: '各满减档位明细。', sessionId: 's3' },
];

export const INITIAL_ATTACHMENTS: AttachmentItem[] = [
  { id: 'f1', name: '华东核销明细_W29.xlsx', size: '1.2 MB', mime: 'xlsx', createdAt: '今天 09:18', sessionId: 's2', sessionTitle: '核销率下滑经营诊断' },
  { id: 'f2', name: '美团闪购周报截图.png', size: '860 KB', mime: 'png', createdAt: '今天 10:20', sessionId: 's1', sessionTitle: '美团闪购 GMV 查询' },
  { id: 'f3', name: '暑期活动brief.pdf', size: '2.4 MB', mime: 'pdf', createdAt: '周一 10:05', sessionId: 's5', sessionTitle: '暑期饮品商机探索' },
];

export const INITIAL_KNOWLEDGE: KnowledgeItem[] = [
  { id: 'k1', title: '品牌指标口径手册 v2.3', kind: '指标口径', status: 'enabled', updatedAt: '2026-07-12', refs: 18, content: 'GMV：实付成交额，不含退款；核销率 = 核销张数 / 领取张数；ROI = GMV / 营销费用。' },
  { id: 'k2', title: '舒洁即时零售投放红线', kind: '品牌规则', status: 'enabled', updatedAt: '2026-06-28', refs: 9, content: '单券面额不超过客单 15%；禁止与竞品同框曝光。' },
  { id: 'k3', title: '到店活动 FAQ', kind: 'FAQ', status: 'enabled', updatedAt: '2026-07-01', refs: 24, content: '活动排期以品牌日历为准；预算冻结后不可跨平台挪用。' },
  { id: 'k4', title: '历史竞品监测备忘（停用）', kind: '文档', status: 'disabled', updatedAt: '2026-03-15', refs: 2, content: '2025 Q4 竞品价格带与机制对照，已过期。' },
];

export const INITIAL_MEMORIES: MemoryItem[] = [
  { id: 'm1', title: '偏好关注华东大区', kind: '偏好', pinned: true, content: '默认分析范围优先华东；对比时附带华南作参照。', updatedAt: '2026-07-20' },
  { id: 'm2', title: '常看指标：GMV / 核销率 / ROI', kind: '常看指标', pinned: true, content: '查数与摘要优先返回这三项。', updatedAt: '2026-07-18' },
  { id: 'm3', title: '高频提问：机制效果对比', kind: '历史提问', pinned: false, content: '近 30 天 11 次询问满减档位对比。', updatedAt: '2026-07-15' },
  { id: 'm4', title: '浏览轨迹：即时零售活动进度', kind: '浏览轨迹', pinned: false, content: '本周 6 次进入活动进度（定制）。', updatedAt: '2026-07-22' },
];

export function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function scriptByType(type: CapabilityType): ChatScript {
  return scripts.find((s) => s.type === type) || scripts[scripts.length - 1];
}

export function pickScript(text: string): ChatScript {
  const t = text || '';
  for (const s of scripts) {
    if (s.match.some((re) => re.test(t))) return s;
  }
  return scripts[scripts.length - 1];
}

export async function respond(userText: string): Promise<{ script: ChatScript; reply: ChatReply }> {
  await new Promise((r) => setTimeout(r, 650 + Math.random() * 450));
  const script = pickScript(userText);
  return { script, reply: script.reply };
}

export function formatReplyText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}
