/* Mock data for AI Workbench prototype — pure simulation, no API */
window.WB = window.WB || {};

WB.mock = {
  brand: "康师傅",
  user: { name: "张明", initials: "ZM", role: "品牌运营" },

  kpis: [
    { label: "本周 GMV", value: "¥1,286万", delta: "+12.4%", up: true },
    { label: "核销率", value: "68.2%", delta: "+3.1pp", up: true },
    { label: "活动 ROI", value: "3.4", delta: "-0.2", up: false },
    { label: "活跃门店", value: "12,480", delta: "+5.6%", up: true },
  ],

  sessions: [
    {
      id: "s1",
      title: "上周美团闪购 GMV 查询",
      type: "query",
      updatedAt: "今天 10:24",
      preview: "美团闪购上周 GMV 为 428 万…",
    },
    {
      id: "s2",
      title: "核销率下滑经营诊断",
      type: "diagnose",
      updatedAt: "昨天 16:08",
      preview: "华东区核销率环比下降 4.2pp…",
    },
    {
      id: "s3",
      title: "满减机制效果分析",
      type: "analyze",
      updatedAt: "昨天 11:20",
      preview: "满 20 减 2 综合分最优…",
    },
    {
      id: "s4",
      title: "下周行动建议",
      type: "action",
      updatedAt: "昨天 09:40",
      preview: "P0 两项 + P1 两项动作清单…",
    },
    {
      id: "s5",
      title: "暑期饮品商机探索",
      type: "opportunity",
      updatedAt: "周一 11:30",
      preview: "建议加码便利店渠道冰品组合…",
    },
    {
      id: "s6",
      title: "即时零售周报生成",
      type: "report",
      updatedAt: "周一 09:00",
      preview: "已生成 W29 经营报告…",
    },
  ],

  artifacts: [
    {
      id: "a1",
      title: "即时零售周报 · W29",
      type: "报告",
      source: "上周美团闪购 GMV 复盘",
      createdAt: "今天 10:26",
      summary: "GMV、订单、核销与渠道结构一周摘要，含下钻建议。",
    },
    {
      id: "a2",
      title: "核销率问题诊断卡",
      type: "建议卡",
      source: "核销率下滑诊断",
      createdAt: "昨天 16:12",
      summary: "定位华东便利店券门槛偏高，给出三档机制调整建议。",
    },
    {
      id: "a3",
      title: "暑期商机矩阵",
      type: "图表卡",
      source: "暑期饮品商机探索",
      createdAt: "周一 11:35",
      summary: "渠道 × 品类机会评分，标注 Top 3 可落地动作。",
    },
    {
      id: "a4",
      title: "到店机制效果导出.xlsx",
      type: "导出文件",
      source: "到店满减机制对比",
      createdAt: "上周",
      summary: "各满减档位订单、GMV、客单与预算消耗明细。",
    },
  ],

  knowledge: [
    {
      id: "k1",
      title: "品牌指标口径手册 v2.3",
      kind: "指标口径",
      status: "enabled",
      updatedAt: "2026-07-12",
      refs: 18,
      content:
        "GMV：实付成交额，不含退款；核销率 = 核销张数 / 领取张数；ROI = GMV / 营销费用。",
    },
    {
      id: "k2",
      title: "康师傅即时零售投放红线",
      kind: "品牌规则",
      status: "enabled",
      updatedAt: "2026-06-28",
      refs: 9,
      content:
        "单券面额不超过客单 15%；禁止与竞品同框曝光；暑期冰品活动需先过品控清单。",
    },
    {
      id: "k3",
      title: "到店活动 FAQ",
      kind: "FAQ",
      status: "enabled",
      updatedAt: "2026-07-01",
      refs: 24,
      content:
        "活动排期以品牌日历为准；预算冻结后不可跨平台挪用；专属定制报表 T+1 更新。",
    },
    {
      id: "k4",
      title: "历史竞品监测备忘（停用）",
      kind: "文档",
      status: "disabled",
      updatedAt: "2026-03-15",
      refs: 2,
      content: "2025 Q4 竞品价格带与机制对照，已过期，仅作归档。",
    },
  ],

  memories: [
    {
      id: "m1",
      title: "偏好关注华东大区",
      kind: "偏好",
      pinned: true,
      content: "默认分析范围优先华东；对比时附带华南作参照。",
      updatedAt: "2026-07-20",
    },
    {
      id: "m2",
      title: "常看指标：GMV / 核销率 / ROI",
      kind: "常看指标",
      pinned: true,
      content: "查数与摘要优先返回这三项，其次订单量与客单。",
      updatedAt: "2026-07-18",
    },
    {
      id: "m3",
      title: "高频提问：机制效果对比",
      kind: "历史提问",
      pinned: false,
      content: "近 30 天 11 次询问满减档位对比，回复时主动附带机制表。",
      updatedAt: "2026-07-15",
    },
    {
      id: "m4",
      title: "浏览轨迹：即时零售活动进度",
      kind: "浏览轨迹",
      pinned: false,
      content: "本周 6 次进入「活动进度（定制）」，对闪购进度敏感。",
      updatedAt: "2026-07-22",
    },
  ],

  dashMenus: {
    store: [
      { id: "all-activities", label: "活动管理" },
      { id: "sales-analysis", label: "销售分析" },
      { id: "user-analysis", label: "行为分析" },
      { id: "custom-store", label: "专属定制" },
    ],
    instant: [
      { id: "calendar", label: "活动日历" },
      { id: "progress", label: "活动进度" },
      { id: "rtb", label: "RTB 分析" },
      { id: "supply", label: "供给分析" },
      { id: "custom-instant", label: "专属定制" },
    ],
    qr: [
      { id: "qr-activities", label: "全量活动" },
      { id: "qr-users", label: "用户分析" },
      { id: "custom-qr", label: "专属定制" },
    ],
  },

  dashTables: {
    store: [
      ["满20减2", "微信", "¥186万", "72%", "3.8"],
      ["满30减3", "支付宝", "¥142万", "65%", "3.1"],
      ["满25减2.5", "抖音到店", "¥98万", "58%", "2.7"],
      ["新人立减", "美团到店", "¥76万", "81%", "4.2"],
    ],
    instant: [
      ["美团闪购", "冰品组合", "¥428万", "+18%", "2.9"],
      ["饿了么", "方便面套装", "¥312万", "+9%", "3.3"],
      ["京东到家", "饮料满赠", "¥186万", "-4%", "2.1"],
      ["抖音超市", "香氛试用", "¥94万", "+22%", "3.6"],
    ],
    qr: [
      ["瓶盖码抽奖", "华东", "128万次", "6.2%", "¥0.38"],
      ["箱内码领券", "华南", "86万次", "9.1%", "¥0.52"],
      ["货架码导购", "华北", "54万次", "4.8%", "¥0.29"],
      ["会员码复购", "西南", "41万次", "11.4%", "¥0.61"],
    ],
  },
};

WB.typeLabel = {
  query: "数据查询",
  diagnose: "经营诊断",
  analyze: "数据分析",
  action: "行动建议",
  opportunity: "商机探索",
  report: "报告生成",
};
