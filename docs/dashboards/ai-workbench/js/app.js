/* AI Workbench — Ant Design / ClientLayout visual language */
window.WB = window.WB || {};

WB.state = {
  view: "home",
  dashSub: null,
  sessionId: null,
  messages: [],
  rightOpen: false,
  rightTab: "artifacts",
  selectedKnowledge: null,
  selectedMemory: null,
  selectedArtifact: null,
  artifactFilter: null,
  typing: false,
  modal: null,
  chatContext: null,
};

WB.uid = function (prefix) {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
};

WB.toast = function (msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(WB._toastTimer);
  WB._toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
};

WB.icons = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"/></svg>',
  agent: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 10h16l-1.2 10H5.2L4 10z"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>',
  instant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2 4 14h7l-1 8 10-14h-7l1-6z"/></svg>',
  qr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v6M14 20h3"/></svg>',
  knowledge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5a2 2 0 0 1 2-2h5v18H6a2 2 0 0 1-2-2V5z"/><path d="M13 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></svg>',
  memory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  artifacts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="4"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V5M4 19h16"/><path d="M8 16V9M12 16v-5M16 16V7"/></svg>',
};

WB.tagClass = function (type) {
  if (type === "query" || type === "数据查询" || type === "报告") return "tag-blue";
  if (type === "diagnose" || type === "经营诊断" || type === "analyze" || type === "数据分析") return "tag-green";
  if (type === "action" || type === "行动建议" || type === "建议卡") return "tag-gold";
  if (type === "opportunity" || type === "商机探索" || type === "图表卡") return "tag-gold";
  if (type === "report" || type === "报告生成") return "tag-blue";
  return "tag-default";
};

WB.setView = function (view, opts) {
  opts = opts || {};
  WB.state.view = view;
  if (opts.dashSub) WB.state.dashSub = opts.dashSub;
  if (opts.sessionId !== undefined) WB.state.sessionId = opts.sessionId;
  if (opts.rightOpen !== undefined) WB.state.rightOpen = opts.rightOpen;
  if (opts.chatContext !== undefined) WB.state.chatContext = opts.chatContext;
  if (view === "agent") WB.state.rightOpen = opts.rightOpen !== undefined ? opts.rightOpen : true;
  if (view.startsWith("dash-") && !WB.state.chatContext) WB.state.rightOpen = false;
  WB.render();
};

WB.startCapability = function (type) {
  const script = WB.chat.scriptByType(type);
  const id = WB.uid("s");
  WB.mock.sessions.unshift({
    id,
    title: script.title,
    type: script.type,
    updatedAt: "刚刚",
    preview: script.userSeed,
  });
  WB.state.messages = [];
  WB.state.sessionId = id;
  WB.state.view = "agent";
  WB.state.rightOpen = true;
  WB.state.rightTab = "artifacts";
  WB.state.chatContext = null;
  WB.render();
  WB.sendMessage(script.userSeed);
};

WB.openSession = function (id) {
  WB.state.sessionId = id;
  WB.state.view = "agent";
  WB.state.rightOpen = true;
  WB.state.messages = [];
  const session = WB.mock.sessions.find((s) => s.id === id);
  if (session) {
    const script = WB.chat.scriptByType(session.type);
    WB.state.messages = [
      { role: "user", text: script.userSeed },
      { role: "assistant", reply: script.reply, scriptId: script.id },
    ];
  }
  WB.render();
};

WB.newSession = function () {
  const id = WB.uid("s");
  WB.mock.sessions.unshift({
    id,
    title: "新对话",
    type: "query",
    updatedAt: "刚刚",
    preview: "等待提问…",
  });
  WB.state.sessionId = id;
  WB.state.messages = [];
  WB.state.view = "agent";
  WB.state.rightOpen = true;
  WB.render();
};

WB.sendMessage = async function (text) {
  const content = (text || "").trim();
  if (!content || WB.state.typing) return;

  if (!WB.state.sessionId) {
    const id = WB.uid("s");
    WB.state.sessionId = id;
    WB.mock.sessions.unshift({
      id,
      title: content.slice(0, 18) || "新对话",
      type: "query",
      updatedAt: "刚刚",
      preview: content,
    });
  }

  WB.state.messages.push({ role: "user", text: content });
  WB.state.typing = true;
  WB.render();
  WB.scrollChat();

  const { script, reply } = await WB.chat.respond(content);
  WB.state.typing = false;
  WB.state.messages.push({ role: "assistant", reply, scriptId: script.id });

  const session = WB.mock.sessions.find((s) => s.id === WB.state.sessionId);
  if (session) {
    session.title = script.title;
    session.type = script.type;
    session.updatedAt = "刚刚";
    session.preview = content;
  }
  if (reply.artifact) WB.ensureArtifactFromReply(reply.artifact, session && session.title);

  WB.render();
  WB.scrollChat();
};

WB.ensureArtifactFromReply = function (artifact, source) {
  if (WB.mock.artifacts.some((a) => a.title === artifact.title)) return;
  WB.mock.artifacts.unshift({
    id: WB.uid("a"),
    title: artifact.title,
    type: artifact.type,
    source: source || "当前会话",
    createdAt: "刚刚",
    summary: artifact.summary,
  });
};

WB.addArtifactManual = function (artifact) {
  WB.mock.artifacts.unshift({
    id: WB.uid("a"),
    title: artifact.title,
    type: artifact.type || "报告",
    source: artifact.source || "当前会话",
    createdAt: "刚刚",
    summary: artifact.summary || "",
  });
  WB.state.rightTab = "artifacts";
  WB.state.rightOpen = true;
  WB.toast("已生成产出物：" + artifact.title);
  WB.render();
};

WB.handleAction = function (action) {
  if (!action) return;
  if (action.action === "goto") {
    WB.setView(action.target, { chatContext: null, rightOpen: false });
  } else if (action.action === "artifact") {
    const last = [...WB.state.messages].reverse().find((m) => m.role === "assistant");
    if (last && last.reply && last.reply.artifact) {
      const art = Object.assign({}, last.reply.artifact, {
        type: action.artifactType || last.reply.artifact.type,
      });
      const existing = WB.mock.artifacts.find((a) => a.title === art.title);
      if (existing) {
        WB.toast("产出物已存在，可在右侧查看");
        WB.state.selectedArtifact = existing.id;
        WB.state.rightTab = "artifacts";
        WB.state.rightOpen = true;
        WB.render();
      } else {
        WB.addArtifactManual(art);
      }
    }
  } else if (action.action === "followup") {
    WB.sendMessage(action.text);
  }
};

WB.scrollChat = function () {
  requestAnimationFrame(() => {
    const el = document.querySelector(".chat-messages");
    if (el) el.scrollTop = el.scrollHeight;
  });
};

WB.openDashAsk = function () {
  const labels = {
    "dash-store": "到店营销",
    "dash-instant": "即时零售",
    "dash-qr": "物码营销",
  };
  WB.state.chatContext = {
    board: labels[WB.state.view],
    page: WB.state.dashSub,
    filters: "近 7 天 · 全渠道",
  };
  WB.state.view = "agent";
  WB.state.rightOpen = true;
  WB.state.rightTab = "context";
  if (!WB.state.sessionId) {
    const id = WB.uid("s");
    WB.state.sessionId = id;
    WB.mock.sessions.unshift({
      id,
      title: "看板问答",
      type: "query",
      updatedAt: "刚刚",
      preview: "基于当前看板…",
    });
  }
  WB.state.messages = [];
  WB.render();
  const seed =
    WB.state.chatContext.board === "即时零售"
      ? "基于当前即时零售看板，上周美团闪购 GMV 和核销是多少？"
      : WB.state.chatContext.board === "到店营销"
        ? "基于当前到店看板，帮我分析核销率下滑原因并给建议"
        : "基于物码看板，帮我做暑期商机探索";
  setTimeout(() => {
    const el = document.getElementById("composerInput");
    if (el) {
      el.value = seed;
      el.focus();
    }
  }, 40);
};

WB.escape = function (s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

WB.formatText = function (text) {
  return WB.escape(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^(\d+)\.\s(.+)$/gm, "<li>$2</li>")
    .replace(/(?:<li>.*?<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n/g, "<br>");
};

/* ========== RENDER ========== */

WB.render = function () {
  WB.renderSider();
  WB.renderHeader();
  WB.renderSessionPanel();
  WB.renderMain();
  WB.renderRight();
  WB.renderModal();
};

WB.renderSider = function () {
  const v = WB.state.view;
  const items = [
    { group: "AI 能力" },
    { view: "home", label: "融合首页", icon: "home" },
    { view: "agent", label: "AI 工作台", icon: "agent" },
    { view: "knowledge", label: "品牌知识库", icon: "knowledge" },
    { view: "memory", label: "个人行为记忆", icon: "memory" },
    { view: "artifacts", label: "产出物中心", icon: "artifacts" },
    { group: "到店营销" },
    { view: "dash-store", label: "销售分析", icon: "chart", dashSub: "sales-analysis" },
    { view: "dash-store", label: "活动管理", icon: "list", dashSub: "all-activities", key: "store-act" },
    { group: "即时零售" },
    { view: "dash-instant", label: "活动进度", icon: "instant", dashSub: "progress" },
    { view: "dash-instant", label: "活动日历", icon: "list", dashSub: "calendar", key: "instant-cal" },
    { group: "物码营销" },
    { view: "dash-qr", label: "全量活动", icon: "qr", dashSub: "qr-activities" },
    { view: "dash-qr", label: "用户分析", icon: "chart", dashSub: "qr-users", key: "qr-users" },
  ];

  let html = "";
  items.forEach((it) => {
    if (it.group) {
      html += `<div class="menu-group">${it.group}</div>`;
      return;
    }
    let active = false;
    if (it.view === v && !it.view.startsWith("dash-")) active = true;
    if (it.view.startsWith("dash-") && v === it.view && WB.state.dashSub === it.dashSub) active = true;
    if (it.view.startsWith("dash-") && v === it.view && !it.key && !WB.state.dashSub) active = true;
    html += `<button class="menu-item ${active ? "active" : ""}" data-view="${it.view}" data-sub="${it.dashSub || ""}">${WB.icons[it.icon] || ""}${it.label}</button>`;
  });

  const root = document.getElementById("sider-menu");
  root.innerHTML = html;
  root.querySelectorAll("[data-view]").forEach((btn) => {
    btn.onclick = () => {
      const view = btn.getAttribute("data-view");
      const sub = btn.getAttribute("data-sub");
      if (view === "agent") {
        if (WB.state.sessionId) WB.setView("agent", { rightOpen: true });
        else if (WB.mock.sessions[0]) WB.openSession(WB.mock.sessions[0].id);
        else WB.newSession();
      } else if (view.startsWith("dash-")) {
        WB.setView(view, { dashSub: sub || null, rightOpen: false, chatContext: null });
      } else {
        WB.setView(view, { rightOpen: false });
      }
    };
  });
};

WB.renderHeader = function () {
  const titles = {
    home: "融合工作台",
    agent: "AI 工作台",
    "dash-store": "到店营销",
    "dash-instant": "即时零售",
    "dash-qr": "物码营销",
    knowledge: "品牌知识库",
    memory: "个人行为记忆",
    artifacts: "产出物中心",
  };
  const subs = {
    home: "经营摘要 · AI 入口 · 固定看板",
    agent: "数据查询 · 经营诊断 · 数据分析 · 行动建议 · 商机探索 · 报告生成",
    "dash-store": "固定看板交付物",
    "dash-instant": "固定看板交付物",
    "dash-qr": "固定看板交付物",
    knowledge: "文档 · 口径 · 品牌规则",
    memory: "偏好 · 常看指标 · 浏览轨迹",
    artifacts: "报告 · 建议卡 · 导出文件",
  };
  document.getElementById("header").innerHTML = `
    <div class="header-left">
      <div class="header-title">${titles[WB.state.view] || ""}</div>
      <div class="header-sub">${subs[WB.state.view] || ""}</div>
      <span class="badge-sim">模拟对话</span>
    </div>
    <div class="header-right">
      <button class="btn btn-default btn-sm" id="btnToggleRight">${WB.state.rightOpen ? "收起右侧" : "展开右侧"}</button>
      <span class="brand-name">${WB.mock.brand}</span>
      <div class="user-area">
        <div class="avatar">${WB.mock.user.initials}</div>
        <span>${WB.mock.user.name}</span>
      </div>
    </div>
  `;
  document.getElementById("btnToggleRight").onclick = () => {
    WB.state.rightOpen = !WB.state.rightOpen;
    WB.render();
  };
};

WB.renderSessionPanel = function () {
  const panel = document.getElementById("session-panel");
  const show = WB.state.view === "agent";
  panel.hidden = !show;
  if (!show) return;

  panel.innerHTML = `
    <div class="session-head">
      <h3>会话</h3>
      <button class="btn btn-primary btn-sm" id="btnNewSession">${WB.icons.plus} 新建</button>
    </div>
    <div class="session-search"><input id="sessionSearch" placeholder="搜索会话" /></div>
    <div class="session-list" id="sessionList"></div>
  `;
  document.getElementById("btnNewSession").onclick = () => WB.newSession();

  const renderList = (q) => {
    const groups = [
      { key: "query", label: "数据查询" },
      { key: "diagnose", label: "经营诊断" },
      { key: "analyze", label: "数据分析" },
      { key: "action", label: "行动建议" },
      { key: "opportunity", label: "商机探索" },
      { key: "report", label: "报告生成" },
    ];
    let html = "";
    groups.forEach((g) => {
      const items = WB.mock.sessions.filter(
        (s) => s.type === g.key && (!q || s.title.includes(q) || s.preview.includes(q))
      );
      if (!items.length) return;
      html += `<div class="group-label">${g.label}</div>`;
      items.forEach((s) => {
        html += `
          <div class="session-item ${WB.state.sessionId === s.id && WB.state.view === "agent" ? "active" : ""}" data-sid="${s.id}">
            <div class="meta">
              <div class="title">${s.title}</div>
              <div class="sub">${s.updatedAt} · ${s.preview}</div>
            </div>
            <span class="tag ${WB.tagClass(s.type)}">${WB.typeLabel[s.type]}</span>
          </div>`;
      });
    });
    document.getElementById("sessionList").innerHTML = html || '<div class="group-label">暂无会话</div>';
    document.querySelectorAll("#sessionList [data-sid]").forEach((el) => {
      el.onclick = () => WB.openSession(el.getAttribute("data-sid"));
    });
  };
  renderList("");
  document.getElementById("sessionSearch").oninput = (e) => renderList(e.target.value.trim());
};

WB.renderMain = function () {
  const root = document.getElementById("main");
  const v = WB.state.view;
  root.classList.toggle("is-flush", v === "agent");

  if (v === "home") root.innerHTML = `<div class="content-scroll">${WB.pageHome()}</div>`;
  else if (v === "agent") root.innerHTML = WB.pageAgent();
  else if (v.startsWith("dash-")) root.innerHTML = `<div class="content-scroll">${WB.pageDash()}</div>`;
  else if (v === "knowledge") root.innerHTML = `<div class="content-scroll">${WB.pageKnowledge()}</div>`;
  else if (v === "memory") root.innerHTML = `<div class="content-scroll">${WB.pageMemory()}</div>`;
  else if (v === "artifacts") root.innerHTML = `<div class="content-scroll">${WB.pageArtifacts()}</div>`;

  WB.bindMainEvents();
};

WB.pageHome = function () {
  return `
    <div class="page-hd">
      <h1>看清经营，也能直接问 AI 要答案与动作</h1>
      <p>沿用现有数据中心版面：左侧业务导航保留到店 / 即时零售 / 物码；本页融合 KPI、Agent 入口与固定看板交付物。</p>
    </div>
    <div class="kpi-row">
      ${WB.mock.kpis
        .map(
          (k) => `
        <div class="kpi-card">
          <div class="label">${k.label}</div>
          <div class="value">${k.value}</div>
          <div class="delta ${k.up ? "up" : "down"}">${k.up ? "↑" : "↓"} ${k.delta}</div>
        </div>`
        )
        .join("")}
    </div>
    <div class="section-hd">Agent 核心能力</div>
    <div class="cap-row">
      ${WB.chat.capabilities
        .map(
          (c) => `
        <button class="cap-card" data-cap="${c.type}">
          <div class="cap-icon">${WB.icons.spark}</div>
          <h3>${c.name}</h3>
          <p>${c.desc}</p>
          <div class="example">例：${c.example}</div>
        </button>`
        )
        .join("")}
    </div>
    <div class="two-col">
      <div class="panel">
        <div class="panel-hd">最近会话 <span class="more" data-go="agent">全部</span></div>
        <div class="panel-bd">
          ${WB.mock.sessions
            .slice(0, 4)
            .map(
              (s) => `
            <div class="list-row" data-sid="${s.id}">
              <span class="tag ${WB.tagClass(s.type)}">${WB.typeLabel[s.type]}</span>
              <div class="title">${s.title}</div>
              <div class="time">${s.updatedAt}</div>
            </div>`
            )
            .join("")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-hd">最近产出物 <span class="more" data-go="artifacts">全部</span></div>
        <div class="panel-bd">
          ${WB.mock.artifacts
            .slice(0, 4)
            .map(
              (a) => `
            <div class="list-row" data-aid="${a.id}">
              <span class="tag ${WB.tagClass(a.type)}">${a.type}</span>
              <div class="title">${a.title}</div>
              <div class="time">${a.createdAt}</div>
            </div>`
            )
            .join("")}
        </div>
      </div>
    </div>
    <div class="section-hd">固定看板交付物</div>
    <div class="biz-row">
      <button class="biz-card" data-go="dash-store">
        <h3>到店营销</h3>
        <p>活动管理 · 销售分析 · 行为分析</p>
        <div class="count">进入看板</div>
      </button>
      <button class="biz-card" data-go="dash-instant">
        <h3>即时零售</h3>
        <p>活动日历 · 进度 · RTB / 供给</p>
        <div class="count">进入看板</div>
      </button>
      <button class="biz-card" data-go="dash-qr">
        <h3>物码营销</h3>
        <p>全量活动 · 用户分析 · 专属定制</p>
        <div class="count">进入看板</div>
      </button>
    </div>
  `;
};

WB.pageAgent = function () {
  const hasMsgs = WB.state.messages.length > 0;
  let body = "";
  if (!hasMsgs && !WB.state.typing) {
    body = `
      <div class="empty-chat">
        <h2>Agent 六大核心能力</h2>
        <p>数据查询、经营诊断、数据分析、行动建议、商机探索、报告生成。当前为前端模拟脚本，用于演示完整交互流。</p>
        <div class="suggest-grid suggest-grid-6">
          <button class="suggest-btn" data-suggest="上周美团闪购的 GMV 是多少？核销表现怎么样？">数据查询 · GMV</button>
          <button class="suggest-btn" data-suggest="华东核销率最近下滑，帮我做经营诊断。">经营诊断 · 核销</button>
          <button class="suggest-btn" data-suggest="帮我做一版到店满减机制的数据分析，看看哪个档位更好。">数据分析 · 机制</button>
          <button class="suggest-btn" data-suggest="基于当前经营情况，给我一份可落地的行动建议。">行动建议 · 清单</button>
          <button class="suggest-btn" data-suggest="帮我做一版暑期饮品/冰品的商机探索。">商机探索 · 暑期</button>
          <button class="suggest-btn" data-suggest="帮我生成一份即时零售近一周经营报告。">报告生成 · 周报</button>
        </div>
      </div>`;
  } else {
    body =
      `<div class="chat-messages">` +
      WB.state.messages
        .map((m) => {
          if (m.role === "user") {
            return `<div class="msg user"><div class="msg-avatar">${WB.mock.user.initials}</div><div class="msg-body">${WB.escape(m.text).replace(/\n/g, "<br>")}</div></div>`;
          }
          return WB.renderAssistantMsg(m);
        })
        .join("") +
      (WB.state.typing
        ? `<div class="msg assistant"><div class="msg-avatar">AI</div><div class="msg-body"><div class="typing"><span></span><span></span><span></span></div></div></div>`
        : "") +
      `</div>`;
  }

  const ctxHint = WB.state.chatContext
    ? `上下文：${WB.state.chatContext.board} / ${WB.state.chatContext.page} / ${WB.state.chatContext.filters}`
    : "可引用看板指标 · 知识库口径 · 个人记忆";

  return `
    <div class="chat-shell">
      ${body}
      <div class="composer">
        <div class="composer-hints">
          <button class="btn btn-default btn-sm" data-suggest="上周美团闪购的 GMV 是多少？">数据查询</button>
          <button class="btn btn-default btn-sm" data-suggest="华东核销率最近下滑，帮我做经营诊断。">经营诊断</button>
          <button class="btn btn-default btn-sm" data-suggest="帮我做一版到店满减机制的数据分析，看看哪个档位更好。">数据分析</button>
          <button class="btn btn-default btn-sm" data-suggest="基于当前经营情况，给我一份可落地的行动建议。">行动建议</button>
          <button class="btn btn-default btn-sm" data-suggest="帮我做一版暑期饮品/冰品的商机探索。">商机探索</button>
          <button class="btn btn-default btn-sm" data-suggest="帮我生成一份即时零售近一周经营报告。">报告生成</button>
        </div>
        <div class="composer-box">
          <textarea id="composerInput" placeholder="试试：查数、诊断、分析、要行动建议、探商机或生成报告…" rows="2"></textarea>
          <div class="composer-bar">
            <div class="ctx">${ctxHint}</div>
            <button class="send-btn" id="btnSend" ${WB.state.typing ? "disabled" : ""}>${WB.icons.send}</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

WB.renderAssistantMsg = function (m) {
  const r = m.reply;
  const metrics = (r.metrics || [])
    .map(
      (x) =>
        `<div class="metric-chip"><div class="m-label">${x.label}</div><div class="m-value">${x.value}</div></div>`
    )
    .join("");
  const actions = (r.actions || [])
    .map(
      (a) =>
        `<button class="btn btn-default btn-sm" data-act='${JSON.stringify(a).replace(/'/g, "&#39;")}'>${a.label}</button>`
    )
    .join("");
  const art = r.artifact
    ? `<div class="artifact-preview" data-open-art="${WB.escape(r.artifact.title)}"><div class="ap-label">产出物 · ${r.artifact.type}</div><div class="ap-title">${r.artifact.title}</div></div>`
    : "";
  return `
    <div class="msg assistant">
      <div class="msg-avatar">AI</div>
      <div class="msg-body">
        ${WB.formatText(r.text)}
        ${metrics ? `<div class="metric-grid">${metrics}</div>` : ""}
        ${art}
        ${actions ? `<div class="action-row">${actions}</div>` : ""}
      </div>
    </div>`;
};

WB.pageDash = function () {
  const key = WB.state.view === "dash-store" ? "store" : WB.state.view === "dash-instant" ? "instant" : "qr";
  const titleMap = { store: "到店营销", instant: "即时零售", qr: "物码营销" };
  const menus = WB.mock.dashMenus[key];
  const sub = menus.find((m) => m.id === WB.state.dashSub) || menus[0];
  if (!WB.state.dashSub) WB.state.dashSub = sub.id;
  const heads =
    key === "store"
      ? ["机制", "平台", "GMV", "核销率", "ROI"]
      : key === "instant"
        ? ["平台", "活动", "GMV", "环比", "ROI"]
        : ["玩法", "大区", "扫码次数", "转化率", "获客成本"];
  const rows = WB.mock.dashTables[key];
  const bars = [72, 88, 64, 95, 78, 86, 70];
  const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  return `
    <div class="dash-toolbar">
      <button class="filter-chip active">近 7 天</button>
      <button class="filter-chip">近 30 天</button>
      <button class="filter-chip">本月</button>
      <button class="filter-chip">全渠道</button>
      <button class="btn btn-primary dash-ask" id="btnDashAsk">${WB.icons.spark} 基于本看板问 AI</button>
    </div>
    <div class="section-hd">${titleMap[key]} · ${sub.label}<span class="more" style="color:var(--text-secondary);cursor:default">固定交付物（原型简化视图）</span></div>
    <div class="kpi-row">
      ${WB.mock.kpis
        .map(
          (k) => `
        <div class="kpi-card">
          <div class="label">${k.label}</div>
          <div class="value">${k.value}</div>
          <div class="delta ${k.up ? "up" : "down"}">${k.delta}</div>
        </div>`
        )
        .join("")}
    </div>
    <div class="chart-grid">
      <div class="chart-card">
        <h4>趋势（模拟）</h4>
        <div class="fake-chart">
          ${bars
            .map(
              (h, i) =>
                `<div class="bar" style="height:${h}%"><span class="bar-label">${days[i]}</span></div>`
            )
            .join("")}
        </div>
      </div>
      <div class="chart-card">
        <h4>结构占比</h4>
        <div class="donut-wrap">
          <div class="donut"></div>
          <div class="legend">
            <div class="legend-item"><span class="dot" style="background:#1890ff"></span>主渠道 42%</div>
            <div class="legend-item"><span class="dot" style="background:#40a9ff"></span>次渠道 26%</div>
            <div class="legend-item"><span class="dot" style="background:#faad14"></span>新兴 20%</div>
            <div class="legend-item"><span class="dot" style="background:#d9d9d9"></span>其他 12%</div>
          </div>
        </div>
      </div>
    </div>
    <div class="table-card">
      <table>
        <thead><tr>${heads.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>
  `;
};

WB.pageKnowledge = function () {
  return `
    <div class="mgmt-toolbar">
      <input id="kwSearch" placeholder="搜索知识库" style="flex:1;min-width:180px" />
      <select id="kwKind">
        <option value="">全部类型</option>
        <option>指标口径</option>
        <option>品牌规则</option>
        <option>FAQ</option>
        <option>文档</option>
      </select>
      <button class="btn btn-primary" id="btnAddKnowledge">新增知识</button>
    </div>
    <div class="mgmt-grid">
      ${WB.mock.knowledge
        .map(
          (k) => `
        <button class="mgmt-item ${WB.state.selectedKnowledge === k.id ? "selected" : ""}" data-kid="${k.id}">
          <h4>${k.title}</h4>
          <p>${k.content}</p>
          <div class="foot">
            <span class="status-dot ${k.status === "enabled" ? "" : "off"}"></span>
            ${k.status === "enabled" ? "启用" : "停用"} · ${k.kind} · 引用 ${k.refs} 次
          </div>
        </button>`
        )
        .join("")}
    </div>
  `;
};

WB.pageMemory = function () {
  return `
    <div class="mgmt-toolbar">
      <button class="btn btn-primary" id="btnAddMemory">新增记忆</button>
      <span style="font-size:12px;color:var(--text-secondary)">记忆会影响 Agent 默认范围与回复侧重点（模拟）</span>
    </div>
    <div class="mgmt-grid">
      ${WB.mock.memories
        .map(
          (m) => `
        <button class="mgmt-item ${WB.state.selectedMemory === m.id ? "selected" : ""}" data-mid="${m.id}">
          <h4>${m.pinned ? "📌 " : ""}${m.title}</h4>
          <p>${m.content}</p>
          <div class="foot">${m.kind} · ${m.updatedAt}</div>
        </button>`
        )
        .join("")}
    </div>
  `;
};

WB.pageArtifacts = function () {
  const filter = WB.state.artifactFilter;
  const list = WB.mock.artifacts.filter((a) => !filter || a.type === filter);
  return `
    <div class="mgmt-toolbar">
      ${["全部", "报告", "建议卡", "图表卡", "导出文件"]
        .map((t) => {
          const active = (!filter && t === "全部") || filter === t;
          return `<button class="filter-chip ${active ? "active" : ""}" data-af="${t}">${t}</button>`;
        })
        .join("")}
      <span style="font-size:12px;color:var(--text-secondary);margin-left:8px">与「文件交付」并存</span>
    </div>
    <div class="mgmt-grid">
      ${list
        .map(
          (a) => `
        <button class="mgmt-item ${WB.state.selectedArtifact === a.id ? "selected" : ""}" data-aid="${a.id}">
          <h4>${a.title}</h4>
          <p>${a.summary}</p>
          <div class="foot">${a.type} · 来自「${a.source}」 · ${a.createdAt}</div>
        </button>`
        )
        .join("")}
    </div>
  `;
};

WB.renderRight = function () {
  const root = document.getElementById("right-panel");
  root.hidden = !WB.state.rightOpen;
  if (!WB.state.rightOpen) {
    root.innerHTML = "";
    return;
  }

  const tabs = [
    { id: "artifacts", label: "产出物" },
    { id: "context", label: "上下文" },
    { id: "memory", label: "记忆" },
  ];

  let body = "";
  if (WB.state.rightTab === "artifacts") {
    body =
      WB.mock.artifacts
        .slice(0, 6)
        .map(
          (a) => `
      <div class="ctx-card" data-aid="${a.id}" style="cursor:pointer">
        <h5>${a.title}</h5>
        <div class="muted">${a.type} · ${a.createdAt}<br>${a.summary}</div>
      </div>`
        )
        .join("") || '<div class="muted">暂无产出物</div>';
  } else if (WB.state.rightTab === "context") {
    const last = [...WB.state.messages].reverse().find((m) => m.role === "assistant");
    const ctxList = (last && last.reply && last.reply.context) || [];
    const kw = WB.mock.knowledge.find((k) => k.id === WB.state.selectedKnowledge);
    if (WB.state.chatContext) {
      body += `<div class="ctx-card"><h5>当前看板上下文</h5><div class="muted">${WB.state.chatContext.board}<br>页面：${WB.state.chatContext.page}<br>筛选：${WB.state.chatContext.filters}</div></div>`;
    }
    if (kw) {
      body += `<div class="ctx-card"><h5>知识库选中</h5><div class="muted"><strong>${kw.title}</strong><br>${kw.content}</div>
        <div class="action-row" style="margin-top:8px">
          <button class="btn btn-default btn-sm" data-toggle-kw="${kw.id}">${kw.status === "enabled" ? "停用" : "启用"}</button>
          <button class="btn btn-default btn-sm" data-del-kw="${kw.id}">删除</button>
        </div></div>`;
    }
    body += ctxList.map((c) => `<div class="ctx-card"><h5>引用</h5><div class="muted">${c}</div></div>`).join("");
    if (!body) body = '<div class="muted" style="color:var(--text-secondary);font-size:12px;padding:8px">对话或选择知识条目后，这里显示引用上下文。</div>';
  } else {
    body = WB.mock.memories
      .slice(0, 4)
      .map(
        (m) => `
      <div class="ctx-card" data-mid="${m.id}" style="cursor:pointer;${WB.state.selectedMemory === m.id ? "border-color:#1890ff" : ""}">
        <h5>${m.pinned ? "📌 " : ""}${m.title}</h5>
        <div class="muted">${m.content}</div>
      </div>`
      )
      .join("");
    const mem = WB.mock.memories.find((m) => m.id === WB.state.selectedMemory) || WB.mock.memories[0];
    if (mem) {
      body += `<div class="detail-block"><h5>记忆如何影响回复</h5>Agent 会优先采用「${mem.title}」中的范围与指标偏好（模拟说明）。</div>`;
    }
  }

  root.innerHTML = `
    <div class="right-head">
      <h3>辅助面板</h3>
      <button class="icon-btn" id="btnCloseRight">${WB.icons.close}</button>
    </div>
    <div class="right-tabs">
      ${tabs
        .map(
          (t) =>
            `<button class="right-tab ${WB.state.rightTab === t.id ? "active" : ""}" data-rtab="${t.id}">${t.label}</button>`
        )
        .join("")}
    </div>
    <div class="right-scroll">${body}</div>
  `;

  document.getElementById("btnCloseRight").onclick = () => {
    WB.state.rightOpen = false;
    WB.render();
  };
  root.querySelectorAll("[data-rtab]").forEach((el) => {
    el.onclick = () => {
      WB.state.rightTab = el.getAttribute("data-rtab");
      WB.renderRight();
      WB.renderHeader();
    };
  });
  root.querySelectorAll("[data-aid]").forEach((el) => {
    el.onclick = () => {
      WB.state.selectedArtifact = el.getAttribute("data-aid");
      WB.setView("artifacts", { rightOpen: true });
    };
  });
  root.querySelectorAll("[data-mid]").forEach((el) => {
    el.onclick = () => {
      WB.state.selectedMemory = el.getAttribute("data-mid");
      WB.renderRight();
    };
  });
  root.querySelectorAll("[data-toggle-kw]").forEach((el) => {
    el.onclick = (e) => {
      e.stopPropagation();
      const k = WB.mock.knowledge.find((x) => x.id === el.getAttribute("data-toggle-kw"));
      if (k) {
        k.status = k.status === "enabled" ? "disabled" : "enabled";
        WB.toast(k.status === "enabled" ? "已启用" : "已停用");
        WB.render();
      }
    };
  });
  root.querySelectorAll("[data-del-kw]").forEach((el) => {
    el.onclick = (e) => {
      e.stopPropagation();
      const id = el.getAttribute("data-del-kw");
      WB.mock.knowledge = WB.mock.knowledge.filter((k) => k.id !== id);
      WB.state.selectedKnowledge = null;
      WB.toast("已删除知识条目");
      WB.render();
    };
  });
};

WB.bindMainEvents = function () {
  document.querySelectorAll("[data-cap]").forEach((el) => {
    el.onclick = () => WB.startCapability(el.getAttribute("data-cap"));
  });
  document.querySelectorAll("[data-go]").forEach((el) => {
    el.onclick = () => {
      const v = el.getAttribute("data-go");
      if (v.startsWith("dash-")) {
        const key = v.replace("dash-", "");
        const menus = WB.mock.dashMenus[key === "store" ? "store" : key === "instant" ? "instant" : "qr"];
        WB.setView(v, { dashSub: menus[0].id, rightOpen: false });
      } else if (v === "agent") {
        if (WB.mock.sessions[0]) WB.openSession(WB.mock.sessions[0].id);
        else WB.newSession();
      } else WB.setView(v);
    };
  });
  document.querySelectorAll("#main [data-sid]").forEach((el) => {
    el.onclick = () => WB.openSession(el.getAttribute("data-sid"));
  });
  document.querySelectorAll("#main [data-aid]").forEach((el) => {
    el.onclick = () => {
      WB.state.selectedArtifact = el.getAttribute("data-aid");
      WB.setView("artifacts", { rightOpen: true });
    };
  });
  document.querySelectorAll("[data-kid]").forEach((el) => {
    el.onclick = () => {
      WB.state.selectedKnowledge = el.getAttribute("data-kid");
      WB.state.rightOpen = true;
      WB.state.rightTab = "context";
      WB.render();
    };
  });
  document.querySelectorAll("[data-mid]").forEach((el) => {
    el.onclick = () => {
      WB.state.selectedMemory = el.getAttribute("data-mid");
      WB.state.rightOpen = true;
      WB.state.rightTab = "memory";
      WB.render();
    };
  });
  document.querySelectorAll("[data-af]").forEach((el) => {
    el.onclick = () => {
      const t = el.getAttribute("data-af");
      WB.state.artifactFilter = t === "全部" ? null : t;
      WB.render();
    };
  });
  document.querySelectorAll("[data-suggest]").forEach((el) => {
    el.onclick = () => WB.sendMessage(el.getAttribute("data-suggest"));
  });
  document.querySelectorAll("[data-act]").forEach((el) => {
    el.onclick = () => {
      try {
        WB.handleAction(JSON.parse(el.getAttribute("data-act")));
      } catch (e) {}
    };
  });
  document.querySelectorAll("[data-open-art]").forEach((el) => {
    el.onclick = () => {
      const title = el.getAttribute("data-open-art");
      const a = WB.mock.artifacts.find((x) => x.title === title);
      if (a) {
        WB.state.selectedArtifact = a.id;
        WB.setView("artifacts", { rightOpen: true });
      }
    };
  });

  const send = document.getElementById("btnSend");
  const input = document.getElementById("composerInput");
  if (send && input) {
    send.onclick = () => WB.sendMessage(input.value);
    input.onkeydown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        WB.sendMessage(input.value);
      }
    };
  }
  const ask = document.getElementById("btnDashAsk");
  if (ask) ask.onclick = () => WB.openDashAsk();
  const addKw = document.getElementById("btnAddKnowledge");
  if (addKw) addKw.onclick = () => WB.openKnowledgeModal();
  const addMem = document.getElementById("btnAddMemory");
  if (addMem) addMem.onclick = () => WB.openMemoryModal();
};

WB.openKnowledgeModal = function () {
  WB.state.modal = { type: "knowledge" };
  WB.renderModal();
};

WB.openMemoryModal = function () {
  WB.state.modal = { type: "memory" };
  WB.renderModal();
};

WB.renderModal = function () {
  const root = document.getElementById("modal-root");
  if (!WB.state.modal) {
    root.innerHTML = "";
    return;
  }
  const isKw = WB.state.modal.type === "knowledge";
  root.innerHTML = `
    <div class="form-modal-backdrop">
      <div class="form-modal">
        <h3>${isKw ? "新增品牌知识" : "新增个人记忆"}</h3>
        <div class="form-field"><label>标题</label><input id="fTitle" /></div>
        <div class="form-field"><label>类型</label>
          <select id="fKind">${
            isKw
              ? "<option>指标口径</option><option>品牌规则</option><option>FAQ</option><option>文档</option>"
              : "<option>偏好</option><option>常看指标</option><option>历史提问</option><option>浏览轨迹</option>"
          }</select>
        </div>
        <div class="form-field"><label>内容</label><textarea id="fContent"></textarea></div>
        <div class="form-actions">
          <button class="btn btn-default" id="fCancel">取消</button>
          <button class="btn btn-primary" id="fSave">保存</button>
        </div>
      </div>
    </div>`;
  document.getElementById("fCancel").onclick = () => {
    WB.state.modal = null;
    WB.renderModal();
  };
  document.getElementById("fSave").onclick = () => {
    const title = document.getElementById("fTitle").value.trim();
    const kind = document.getElementById("fKind").value;
    const content = document.getElementById("fContent").value.trim() || "（无详细内容）";
    if (!title) return WB.toast("请填写标题");
    if (isKw) {
      const id = WB.uid("k");
      WB.mock.knowledge.unshift({
        id,
        title,
        kind,
        status: "enabled",
        updatedAt: "今天",
        refs: 0,
        content,
      });
      WB.state.selectedKnowledge = id;
      WB.toast("知识已添加");
    } else {
      const id = WB.uid("m");
      WB.mock.memories.unshift({
        id,
        title,
        kind,
        pinned: false,
        content,
        updatedAt: "今天",
      });
      WB.state.selectedMemory = id;
      WB.toast("记忆已添加");
    }
    WB.state.modal = null;
    WB.render();
  };
};

document.addEventListener("DOMContentLoaded", () => WB.render());
