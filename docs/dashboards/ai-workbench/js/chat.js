/* Simulated conversation engine — 6 Agent core capabilities, no external API */
window.WB = window.WB || {};

WB.chat = (function () {
  /** Order matters: more specific matchers first */
  const scripts = [
    {
      id: "report_weekly",
      type: "report",
      match: [/报告|周报|月报|生成报告|汇报材料|产出报告/i],
      title: "即时零售周报生成",
      userSeed: "帮我生成一份即时零售近一周经营报告。",
      reply: {
        text:
          "已汇总看板与口径手册，生成《即时零售周报 · W29》（模拟）：\n\n**报告结构**\n1. 经营总览：GMV ¥1,286 万（+12.4%），核销率 68.2%\n2. 渠道表现：美团闪购贡献突出，饿了么稳健\n3. 风险与机会：华东核销承压；便利店冰品可加码\n4. 下周动作建议：三件落地项（见产出物）\n\n报告已写入产出物中心，可继续导出或追加行动建议章节。",
        metrics: [
          { label: "报告页数", value: "6 页" },
          { label: "覆盖指标", value: "18 项" },
          { label: "动作建议", value: "3 条" },
          { label: "数据截止", value: "T+1" },
        ],
        actions: [
          { label: "打开产出物", action: "artifact", artifactType: "报告" },
          { label: "补充行动建议", action: "followup", text: "基于这份周报，给出下周可执行的行动建议" },
          { label: "继续商机探索", action: "followup", text: "帮我做一版暑期饮品商机探索" },
        ],
        artifact: {
          title: "即时零售周报 · W29",
          type: "报告",
          summary: "GMV、核销、渠道结构与下周三条动作建议的一页纸摘要版。",
        },
        context: ["即时零售 · 活动进度", "知识库 · 指标口径手册", "产出物中心"],
      },
    },
    {
      id: "opportunity_summer",
      type: "opportunity",
      match: [/商机|机会|探索|暑期|增长点|加码|破圈/i],
      title: "暑期商机探索",
      userSeed: "帮我做一版暑期饮品/冰品的商机探索。",
      reply: {
        text:
          "基于近 4 周渠道 × 品类与物码互动，输出商机矩阵（模拟）：\n\n**Top 机会**\n1. **便利店 × 冰品组合** — 热度高、供给可匹配，建议「第二件半价」\n2. **闪购 × 方便面套装** — 夜间订单 34%，适合夜宵加投\n3. **瓶盖码 × 会员复购** — 转化 11.4%，可导流到店券包\n\n**谨慎项**：抖音超市香氛试用 ROI 波动大；避免竞品同框（品牌红线）。",
        metrics: [
          { label: "机会分 Top1", value: "92" },
          { label: "预估增量 GMV", value: "+¥160万" },
          { label: "建议预算", value: "¥48万" },
          { label: "周期", value: "2周" },
        ],
        actions: [
          { label: "打开物码用户分析", action: "goto", target: "dash-qr" },
          { label: "生成商机矩阵", action: "artifact", artifactType: "图表卡" },
          { label: "转成行动建议", action: "followup", text: "把 Top3 商机落成下周行动建议清单" },
        ],
        artifact: {
          title: "暑期商机矩阵",
          type: "图表卡",
          summary: "便利店冰品、闪购夜宵套装、瓶盖码会员复购为 Top3 机会。",
        },
        context: ["物码营销 · 用户分析", "即时零售 · 供给", "知识库 · 投放红线"],
      },
    },
    {
      id: "action_plan",
      type: "action",
      match: [/行动建议|怎么做|落地|下一步|动作清单|执行计划|可执行/i],
      title: "下周行动建议",
      userSeed: "基于当前经营情况，给我一份可落地的行动建议。",
      reply: {
        text:
          "结合诊断结论与商机矩阵，输出**可执行行动清单**（模拟）：\n\n**P0（本周必做）**\n1. 华东便利店机制下调至满 25 减 2.5，同步观测核销\n2. Top 200 缺货门店启动供给预警，日更跟进\n\n**P1（下周）**\n3. 闪购夜宵时段加投方便面套装，预算 ¥18 万试投\n4. 瓶盖码导流到店券包，目标拉新 3 万\n\n**验收指标**：核销率回升 ≥2pp；试投 ROI ≥ 2.8。",
        metrics: [
          { label: "P0 动作", value: "2 项" },
          { label: "P1 动作", value: "2 项" },
          { label: "建议预算", value: "¥18万" },
          { label: "验收周期", value: "7 天" },
        ],
        actions: [
          { label: "保存为建议卡", action: "artifact", artifactType: "建议卡" },
          { label: "生成完整报告", action: "followup", text: "把诊断、分析和行动建议汇总成一份经营报告" },
          { label: "回看诊断依据", action: "followup", text: "华东核销率下滑的经营诊断结论是什么？" },
        ],
        artifact: {
          title: "下周行动建议清单",
          type: "建议卡",
          summary: "P0/P1 四项动作、预算与验收指标，可直接同步运营排期。",
        },
        context: ["经营诊断结论", "商机矩阵 Top3", "记忆 · 常看指标"],
      },
    },
    {
      id: "diagnose_redeem",
      type: "diagnose",
      match: [/诊断|下滑|异常|为什么低|问题定位|根因|承压/i],
      title: "核销率下滑经营诊断",
      userSeed: "华东核销率最近下滑，帮我做经营诊断。",
      reply: {
        text:
          "完成经营诊断（模拟），结论如下：\n\n**现象**：华东核销率 64.0%，环比 -4.2pp\n\n**根因排序**\n1. 便利店「满 30 减 3」门槛高于客单中位数（¥27）→ 领而不核\n2. 周末缺货率升至 11% → 核销路径中断\n3. 费用加码侧重 GMV，未与核销机制联动\n\n**诊断置信度**：高（多源指标交叉验证）。建议下一步进入「行动建议」或「数据分析」深挖机制档位。",
        metrics: [
          { label: "华东核销率", value: "64.0%" },
          { label: "环比", value: "-4.2pp" },
          { label: "缺货率", value: "11%" },
          { label: "主因权重", value: "机制 55%" },
        ],
        actions: [
          { label: "打开到店销售分析", action: "goto", target: "dash-store" },
          { label: "保存诊断卡", action: "artifact", artifactType: "建议卡" },
          { label: "要行动建议", action: "followup", text: "基于诊断结论，给出可落地的行动建议" },
        ],
        artifact: {
          title: "核销率问题诊断卡",
          type: "建议卡",
          summary: "门槛偏高 + 缺货是主因，机制因素权重约 55%。",
        },
        context: ["到店营销 · 销售分析", "知识库 · 投放红线", "记忆 · 偏好关注华东"],
      },
    },
    {
      id: "analyze_mechanism",
      type: "analyze",
      match: [/数据分析|对比分析|趋势分析|结构分析|归因|机制对比|满减/i],
      title: "满减机制效果分析",
      userSeed: "帮我做一版到店满减机制的数据分析，看看哪个档位更好。",
      reply: {
        text:
          "完成到店满减机制**数据分析**（模拟）：\n\n**档位对比**\n1. 满20减2 — GMV ¥186万 · 核销 72% · ROI 3.8\n2. 满30减3 — GMV ¥142万 · 核销 65% · ROI 3.1\n3. 满25减2.5 — GMV ¥98万 · 核销 58% · ROI 2.7\n4. 新人立减 — GMV ¥76万 · 核销 81% · ROI 4.2\n\n**结论**：综合 GMV×核销×ROI，「满 20 减 2」性价比最优；「新人立减」核销与 ROI 最高但体量小，适合拉新池。",
        metrics: [
          { label: "最优机制", value: "满20减2" },
          { label: "综合分", value: "91" },
          { label: "样本天数", value: "28 天" },
          { label: "平台覆盖", value: "4 个" },
        ],
        actions: [
          { label: "打开到店看板", action: "goto", target: "dash-store" },
          { label: "导出分析表", action: "artifact", artifactType: "导出文件" },
          { label: "基于分析给行动建议", action: "followup", text: "基于满减机制分析，给出行动建议" },
        ],
        artifact: {
          title: "到店机制效果分析表",
          type: "导出文件",
          summary: "各满减档位订单、GMV、客单、核销与 ROI 明细。",
        },
        context: ["到店营销 · 销售分析", "知识库 · 指标口径", "记忆 · 高频提问：机制对比"],
      },
    },
    {
      id: "query_gmv",
      type: "query",
      match: [/gmv|成交|销售额|查询|查数|多少|美团|闪购|数据查询/i],
      title: "美团闪购 GMV 查询",
      userSeed: "上周美团闪购的 GMV 是多少？核销表现怎么样？",
      reply: {
        text:
          "数据查询结果（模拟，口径见品牌指标手册）：\n\n**上周美团闪购**\n- GMV：**¥428 万**，环比 +18%\n- 订单量：9.6 万单，客单 ¥44.6\n- 核销率：**71.4%**（高于大盘 68.2%）\n\n按个人记忆偏好，已附带华东：GMV 贡献 39%，核销率 74.1%。",
        metrics: [
          { label: "美团闪购 GMV", value: "¥428万" },
          { label: "核销率", value: "71.4%" },
          { label: "订单量", value: "9.6万" },
          { label: "环比", value: "+18%" },
        ],
        actions: [
          { label: "打开即时零售看板", action: "goto", target: "dash-instant" },
          { label: "做经营诊断", action: "followup", text: "美团闪购 ROI 是否异常？帮我做经营诊断" },
          { label: "生成周报", action: "followup", text: "把这些查询结果生成一份周报" },
        ],
        artifact: {
          title: "美团闪购指标摘录",
          type: "报告",
          summary: "上周 GMV 428 万、核销 71.4%，含华东对比。",
        },
        context: ["即时零售 · 活动进度", "知识库 · 品牌指标口径手册", "记忆 · 偏好关注华东"],
      },
    },
  ];

  function pickScript(text) {
    const t = text || "";
    for (const s of scripts) {
      if (s.match.some((re) => re.test(t))) return s;
    }
    return scripts[scripts.length - 1];
  }

  function scriptByType(type) {
    return scripts.find((s) => s.type === type) || scripts[scripts.length - 1];
  }

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function respond(userText, onTyping) {
    const script = pickScript(userText);
    if (onTyping) onTyping(true);
    await delay(700 + Math.random() * 500);
    if (onTyping) onTyping(false);
    return { script, reply: script.reply };
  }

  return {
    scripts,
    pickScript,
    scriptByType,
    respond,
    delay,
    capabilities: [
      { type: "query", name: "数据查询", desc: "自然语言查看板指标，返回带口径结果", example: "上周美团闪购 GMV？" },
      { type: "diagnose", name: "经营诊断", desc: "定位异常与根因，输出诊断结论", example: "华东核销率为何下滑？" },
      { type: "analyze", name: "数据分析", desc: "对比、趋势、结构与机制效果分析", example: "满减档位哪个更好？" },
      { type: "action", name: "行动建议", desc: "生成可落地的 P0/P1 动作清单", example: "下周该做什么？" },
      { type: "opportunity", name: "商机探索", desc: "渠道×品类机会矩阵与加码方向", example: "暑期冰品怎么加码？" },
      { type: "report", name: "报告生成", desc: "汇总指标与建议，生成经营报告", example: "生成即时零售周报" },
    ],
  };
})();
