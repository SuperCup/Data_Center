# 标准业务流程管理系统开发规范

## 项目概述
定位：面向客户（品牌方）展示和分析活动数据的对客产品，兼具公司内部的管理与权限控制功能。
目标：
1、对外：展示公司数据产品的能力，让客户能清晰掌握活动进展、预算和效果。
2、对内：数据源维护、报表分配权限、客户需求管理。

## 开发指导原则

### 核心理念
- 只做前端代码开发，所有内容呈现均使用模拟数据。
- 仔细且严格地遵循用户的要求。
- 首先要逐步思考——用伪代码详细描述你要构建内容的计划。
- 确认计划后，再编写代码！
- 始终编写正确的、符合最佳实践的、遵循DRY原则（不要重复自己）的、无错误的、功能完备且能正常运行的代码，同时代码应符合下面“代码实现指南”中列出的规则。
- 相比于追求性能，更要专注于编写简洁易读的代码。
- 完整实现所有要求的功能。
- 不要留下待办事项、占位符或缺失的部分。
- 确保代码是完整的！要彻底检查并最终确定。
- 包含所有必需的导入，并确保关键组件的命名恰当。
- 简洁明了，尽量减少其他不必要的文字表述。
- 如果你认为可能不存在正确答案，要如实说明。
- 如果你不知道答案，直接说明，而不要猜测。
- 专注于业务流程的标准化和可视化
- 提供清晰的管理界面
- 确保系统的可扩展性和维护性
- 遵循现代Web开发最佳实践

### 技术栈要求

框架：React 18（推荐 Ant Design Pro） / Vue 3（推荐 Element Plus）

构建工具：Vite（推荐） 或 Webpack 5

语言：TypeScript（必须，保证类型安全）

状态管理：

React：Redux Toolkit / Zustand

Vue：Pinia

路由管理：React Router v6 / Vue Router 4

数据请求：Axios + 拦截器（统一处理错误 & 鉴权）

可视化：ECharts / AntV G2Plot / AntV S2

样式方案：

CSS Modules / Tailwind CSS / Less

禁止内联样式（除非动态计算）。

### 代码规范

遵循 Airbnb JavaScript/TypeScript 风格规范

使用 ESLint + Prettier + Husky 强制规范：

eslint:recommended

plugin:@typescript-eslint/recommended

prettier 统一格式化

Git 提交规范：Commitlint + Conventional Commits

feat: 新功能

fix: 修复问题

refactor: 代码重构

style: 格式调整

docs: 文档更新

chore: 工具/依赖变更

组件/函数：单一职责，最大 300 行代码，超出必须拆分。

API 调用必须有 错误处理 & 超时机制。

### 结构规范

UI 与逻辑分离：UI 组件只负责展示，业务逻辑在 hooks/services。

页面与组件分离：页面负责布局和调用组件，组件负责复用。

状态与数据分离：全局状态存储在 store，页面本地状态存储在组件内。

API 与视图分离：所有接口封装在 /services，不可直接在组件中写 Axios 请求。

### 代码分离规范

组件拆分原则：

可复用 → 放入 components

特定业务页面专用 → 放入 pages/xxx/components

按功能模块分离（业务维度）：

activity（活动）

report（报表）

auth（权限/登录）

dashboard（看板）

按层级分离（技术维度）：

api → 请求封装

services → 业务逻辑

hooks → 自定义逻辑

components → 公共 UI

### 文件结构规范
src/
├── api/                  # 接口定义层（axios 封装 + API 方法）
│   └── activity.ts
│   └── report.ts
│
├── assets/               # 静态资源（图片、字体、样式）
│   └── images/
│   └── styles/
│
├── components/           # 公共组件（跨业务复用）
│   └── ChartCard/
│   └── DataTable/
│
├── hooks/                # 自定义 React Hooks / Vue Composables
│   └── useAuth.ts
│   └── useChartResize.ts
│
├── layouts/              # 页面整体布局（导航栏、侧边栏、页脚）
│   └── BasicLayout.tsx
│
├── pages/                # 页面级组件
│   └── dashboard/
│       ├── index.tsx
│       ├── components/   # 页面私有组件
│   └── activity/
│   └── report/
│   └── auth/
│
├── services/             # 业务逻辑层（对 API 封装，供页面调用）
│   └── activityService.ts
│   └── reportService.ts
│
├── store/                # 状态管理
│   └── index.ts
│   └── activitySlice.ts
│   └── reportSlice.ts
│
├── utils/                # 工具函数（格式化、时间处理、下载等）
│   └── date.ts
│   └── download.ts
│
├── App.tsx               # 应用入口
├── main.tsx              # 入口文件
└── router/               # 路由管理
    └── index.tsx

### 文件命名规范

统一使用 kebab-case（短横线） 命名文件：

页面文件：dashboard-page.tsx

组件文件：chart-card.tsx

服务文件：activity-service.ts

目录：全小写 + 短横线，如 user-profile

组件：PascalCase（大驼峰），如 ChartCard.tsx

Hooks：必须以 use 开头，如 useAuth.ts

样式文件：与组件同名，如 chart-card.module.less

### 分离原则

视图层与逻辑层分离：组件只做展示，逻辑放到 hooks/services。

通用与业务分离：通用组件放在 /components，业务组件放在 /pages。

API 与业务逻辑分离：API 在 /api，二次封装在 /services。

样式与组件分离：采用 CSS Modules/Tailwind，禁止全局污染。

路由与组件分离：路由配置集中管理在 /router。

### 扩展性设计规范（增补）
- 配置驱动：所有可变项统一由 `src/config` 与 `.env` 管理，页面与组件不得硬编码常量或枚举。
- 模块化边界：按功能模块拆分，模块对外仅暴露公共接口；禁止跨模块直接导入对方的内部文件。
- 可插拔数据源：定义统一的数据源适配接口（如 `DataSourceAdapter`），不同平台通过适配器实现并在注册表中启用/禁用。
- 依赖倒置：UI 组件依赖抽象接口与类型，具体实现通过工厂或依赖注入在 `services` 层选择。
- 路由级代码分割：对页面使用 `dynamic import` 分割包体；长列表采用虚拟化减少渲染负担。
- 主题与样式：统一 `ThemeToken`/Design Token；组件仅使用变量，不得引入全局样式污染。
- 国际化：文案集中管理（如 `src/utils/i18n.ts`），禁止将文案硬编码在业务逻辑中。
- 常量与类型：枚举/常量集中在 `src/utils/constants.ts`，领域类型放在 `src/types/`，避免交叉依赖。
- 单元测试：核心 hooks/services 需具备基本测试；模拟数据应使用固定 seed 保持可复现。
- 性能守则：避免在渲染中创建新函数；对频繁交互使用节流/防抖；必要位置加 memo 与选择器。

### 模拟数据与展示规则（通用）
- 数据生成：模拟数据使用固定随机种子（如 `src/mock/seed.ts`）与生成器，确保每次构建一致。
- 时间格式：日期 `YYYY-MM-DD`，时间 `YYYY-MM-DD HH:mm:ss`；统一时区 `Asia/Shanghai`。
- 数值格式：金额单位为“元”，保留两位小数；千分位分隔；百分比统一为 `xx.xx%`。
- 列表展示：默认分页 `pageSize=10`；支持升/降序排序与基础筛选；空值展示为 `—`。
- 图表规范：坐标轴标题与单位必填；颜色方案统一；图例可折叠；>1000 数据点需抽样或聚合。
- 可访问性：交互元素提供 `aria-label`；图表提供可切换的表格视图数据。
- 免责声明：所有展示均基于模拟数据，不暗示真实业务指标与结论。

### 默认样例配置（仅示例，可替换）
- 客户列表：`['康师傅','伊利','嘉士伯','统一']`
- 数据来源平台：`['微信','支付宝','抖音']`
- 放置位置建议：在 `src/mock/config.ts` 导出 `clients` 与 `platforms`，作为可替换的默认配置。
- 使用方式：页面/服务仅从 `services/mockService` 或配置模块读取，不得在组件中直接硬编码数组。

### 目录与文件建议（增补）
- `src/types/adapters.ts`：定义 `DataSourceAdapter`、`Client`、`Platform` 等通用类型。
- `src/services/adapterRegistry.ts`：注册不同平台的适配器（启用/禁用、优先级）。
- `src/mock/config.ts`、`src/mock/seed.ts`、`src/mock/generators/*.ts`：模拟数据的配置、种子与生成器。
- 环境变量：`.env` 管理 `FEATURE_*`、`API_BASE_URL`、`APP_BRAND_NAME` 等。

### 提交与质量（补充）
- 提交规范：遵循 Conventional Commits（feat/fix/refactor/style/docs/chore）。
- CI 检查：lint、type-check、build 必须通过后方可合并。
- 代码评审：关注模块边界、类型完整性与配置驱动是否落实。
