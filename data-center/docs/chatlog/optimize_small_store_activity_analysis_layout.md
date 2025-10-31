# 优化小店活动分析页面布局

## 对话时间
2025年1月26日

## 任务概述
用户要求对小店活动分析页面进行布局优化，主要包括：
1. 修改核心指标为一行显示
2. 修改折线图指标与核心指标对应
3. 删除批次对比模块
4. 删除商品分析模块

## 具体修改内容

### 1. 修改核心指标一行显示
- **文件**: `SmallStoreActivityAnalysis.tsx`
- **修改内容**: 
  - 将核心指标的 `Row` 组件的 `gutter` 属性从 `0` 修改为 `16`
  - 将所有 `Col` 组件的 `style` 属性从 `width: 'calc(20% - 8px)'` 修改为 `flex="1"`
- **效果**: 核心指标（报名门店数、动销门店数、销售额、核销金额、核销份数、店均日产出）在一行中平均分布显示

### 2. 修改折线图指标与核心指标对应
- **文件**: `SmallStoreActivityAnalysis.tsx`
- **修改内容**:
  - 更新 `mockTrends` 数据，添加与核心指标对应的字段：
    - `registeredStores` (报名门店数)
    - `activeStores` (动销门店数)
    - `gmv` (销售额)
    - `redeemAmount` (核销金额)
    - `redeemCount` (核销份数)
    - `avgDailyOutput` (店均日产出)
  - 更新折线图指标选择器，替换原有指标为新的核心指标
  - 更新 Tooltip 配置，添加正确的指标名称和单位显示
  - 更新折线图的 `RechartsLine` 组件配置，对应新的指标
  - 更新 `visibleLines` 初始状态，将 `registeredStores` 设置为默认显示

### 3. 删除批次对比模块
- **文件**: `SmallStoreActivityAnalysis.tsx`
- **删除内容**: 
  - 批次对比 `Card` 组件（包含散点图）
  - 时段分析 `Card` 组件（包含热力图）
- **效果**: 移除了批次对比和时段分析功能模块

### 4. 删除商品分析模块
- **文件**: `SmallStoreActivityAnalysis.tsx`
- **删除内容**:
  - 商品分析 `Card` 组件（包含商品列表表格和分页）
  - 零售商趋势弹窗 `Modal` 组件
  - 商品趋势弹窗 `Modal` 组件
- **效果**: 移除了商品分析功能模块

## 测试结果
- 开发服务器运行正常
- 预览页面成功打开，没有发现浏览器错误
- 页面布局优化完成，符合用户需求

## 技术细节
- 使用 Ant Design 的 `Row` 和 `Col` 组件进行布局调整
- 使用 Recharts 库的 `LineChart` 和 `RechartsLine` 组件实现折线图
- 保持了原有的数据结构和状态管理逻辑
- 确保了代码的可维护性和一致性

## 文件修改列表
- `src/pages/client/store-marketing/SmallStoreActivityAnalysis.tsx` - 主要修改文件

## 完成状态
✅ 所有任务已完成，页面布局优化成功