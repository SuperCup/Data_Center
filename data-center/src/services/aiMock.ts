/** AI Workbench mock engine — frontend simulation only */

export type CapabilityType = 'instant' | 'report';

export interface ChatAction {
  label: string;
  action: 'goto' | 'artifact' | 'followup';
  target?: string;
  artifactType?: string;
  text?: string;
}

/** 产物文件格式：以 html / md / xlsx 为主 */
export type ArtifactFormat = 'html' | 'md' | 'xlsx';

export const FORMAT_LABEL: Record<ArtifactFormat, string> = {
  html: 'HTML',
  md: 'Markdown',
  xlsx: 'Excel',
};

export interface ArtifactPayload {
  title: string;
  type: string;
  summary: string;
  format?: ArtifactFormat;
  /** 可预览/下载的资源路径（如 /reports/xxx.html） */
  url?: string;
  /** md 等内联内容 */
  content?: string;
}

export interface ChatReply {
  text: string;
  metrics?: { label: string; value: string }[];
  actions?: ChatAction[];
  artifact?: ArtifactPayload;
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
  /** 是否已归档 */
  archived?: boolean;
  archivedAt?: string;
  /** 是否置顶 */
  pinned?: boolean;
}

export interface ArtifactItem {
  id: string;
  title: string;
  type: string;
  source: string;
  createdAt: string;
  summary: string;
  sessionId?: string;
  format?: ArtifactFormat;
  url?: string;
  content?: string;
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
  /** 选中该服务后展示的可选提示词 */
  suggestions: string[];
}[] = [
  {
    type: 'instant',
    name: '即时零售',
    desc: '基于公司的平台运营积累，回答即时零售相关知识',
    example: '美团闪购和淘闪的投放差异有哪些？',
    suggestions: [
      '美团闪购和淘闪的投放差异有哪些？',
      '即时零售核销率一般怎么看？',
      '补贴率与 ROI 如何权衡？',
      '前置仓和便利店渠道怎么选？',
    ],
  },
  {
    type: 'report',
    name: '周报生成',
    desc: '基于提供的时间范围，按既定思维框架与内容结构，结合品牌数据，生成含结论、分析、行动建议的周报看板',
    example: '生成本周舒洁到家即时零售周报',
    suggestions: [
      '生成本周舒洁到家即时零售周报',
      '按 7/14-7/20 生成周报看板',
      '上周 vs 本周对比周报',
      '输出含结论、分析、行动建议的周报',
    ],
  },
];

export const TYPE_LABEL: Record<CapabilityType, string> = {
  instant: '即时零售',
  report: '周报生成',
};

export const TYPE_COLOR: Record<CapabilityType, string> = {
  instant: 'blue',
  report: 'geekblue',
};

const scripts: ChatScript[] = [
  {
    id: 'report_weekly',
    type: 'report',
    match: [/报告|周报|月报|生成报告|汇报材料|产出报告|周报看板|时间范围/i],
    title: '舒洁到家即时零售周报',
    userSeed: '生成本周舒洁到家即时零售周报（含结论、分析、行动建议）。',
    reply: {
      text: '已按既定周报框架，结合品牌数据生成《舒洁·到家即时零售 数据看板》（模拟）：\n\n**结论**\n- 本周全量 GMV 稳健，活动效率与补贴节奏可控\n\n**分析**\n1. 经营总览：GMV、活动 GMV、补贴率与 ROI 同环比\n2. 渠道表现：美团 / 淘闪结构与趋势\n3. 商品分析：产品系列下钻与 Size 明细\n4. 维度排行：渠道 / 零售商 / 省份 / 城市 TOP10\n\n**行动建议**\n- 强化头部爆款跨平台运营\n- 向第二梯队省份倾斜预算\n- 优化高折扣低产出机制，提升 ROI\n\n可点击下方产物预览完整周报看板。',
      metrics: [
        { label: '报告格式', value: 'HTML' },
        { label: '覆盖指标', value: '18 项' },
        { label: '行动建议', value: '3 条' },
        { label: '数据周期', value: '周维度' },
      ],
      actions: [
        { label: '预览周报看板', action: 'artifact', artifactType: 'HTML报告' },
        { label: '换个时间范围重生成', action: 'followup', text: '按上周时间范围重新生成周报看板' },
      ],
      artifact: {
        title: '舒洁·到家即时零售 数据看板',
        type: 'HTML报告',
        format: 'html',
        url: '/reports/舒洁_到家即时零售_数据看板.html',
        summary: '含结论、分析、行动建议的周报看板，可点击预览。',
      },
      context: ['即时零售 · 品牌数据', '周报思维框架'],
    },
  },
  {
    id: 'instant_retail_kb',
    type: 'instant',
    match: [/即时零售|闪购|淘闪|美团|核销|补贴|roi|渠道|前置仓|便利店|投放|运营/i],
    title: '即时零售知识问答',
    userSeed: '美团闪购和淘闪的投放差异有哪些？',
    reply: {
      text: '基于公司即时零售平台运营积累（模拟回答）：\n\n**美团闪购 vs 淘闪（饿了么）投放差异**\n1. **流量与心智**：美团到家心智更强，闪购承接本地即时需求；淘闪依托淘宝生态，适合品牌货盘与会员运营联动\n2. **费率与补贴结构**：需按活动机制拆补贴率与 ROI，避免只看 GMV\n3. **渠道结构**：大卖场 / NKA / 便利店 / 前置仓贡献差异明显，投放应匹配渠道供给能力\n4. **核销路径**：门槛过高易「领而不核」；机制档位需对齐客单中位数\n\n**常用口径提醒**\n- 补贴率 = 含税补贴 ÷ 活动 GMV\n- ROI = 活动 GMV ÷ 含税补贴\n- 周报建议按「结论 → 分析 → 行动建议」输出\n\n可继续追问具体机制、渠道或品类问题。',
      metrics: [
        { label: '知识域', value: '即时零售' },
        { label: '平台', value: '美团+淘闪' },
        { label: '关注指标', value: 'GMV/核销/ROI' },
        { label: '口径', value: '品牌手册' },
      ],
      actions: [
        { label: '生成本周周报', action: 'followup', text: '生成本周舒洁到家即时零售周报' },
        { label: '再问核销口径', action: 'followup', text: '即时零售核销率一般怎么看？' },
      ],
      context: ['平台运营知识库', '品牌指标口径手册'],
    },
  },
];

export const INITIAL_SESSIONS: SessionItem[] = [
  {
    id: 's1',
    title: '美团闪购与淘闪投放差异',
    type: 'instant',
    updatedAt: '今天 10:24',
    preview: '基于平台运营积累的即时零售知识问答…',
    pinned: true,
  },
  {
    id: 's6',
    title: '舒洁到家即时零售周报',
    type: 'report',
    updatedAt: '周一 09:00',
    preview: '已生成含结论、分析、行动建议的周报看板…',
  },
];

export const INITIAL_ARTIFACTS: ArtifactItem[] = [
  {
    id: 'a1',
    title: '舒洁·到家即时零售 数据看板',
    type: 'HTML报告',
    format: 'html',
    url: '/reports/舒洁_到家即时零售_数据看板.html',
    source: '舒洁到家即时零售周报',
    createdAt: '今天 10:26',
    summary: '含结论、分析、行动建议的周报看板 HTML，可点击预览。',
    sessionId: 's6',
  },
];

export const INITIAL_ATTACHMENTS: AttachmentItem[] = [
  {
    id: 'f1',
    name: '舒洁周报数据摘录.xlsx',
    size: '1.2 MB',
    mime: 'xlsx',
    createdAt: '今天 09:18',
    sessionId: 's6',
    sessionTitle: '舒洁到家即时零售周报',
  },
  {
    id: 'f2',
    name: '美团闪购投放说明.png',
    size: '860 KB',
    mime: 'png',
    createdAt: '今天 10:20',
    sessionId: 's1',
    sessionTitle: '美团闪购与淘闪投放差异',
  },
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
