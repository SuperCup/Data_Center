# 删除详情按钮和模态窗

## 任务描述
用户要求删除 `AllActivities.tsx` 文件中列表的详情按钮以及对应的详情模态窗。

## 删除内容

### 1. 删除表格操作列中的详情按钮
**位置**：表格列定义中的操作列
**删除内容**：
```typescript
<a onClick={() => showDrawer(record)}>详情</a>
```

**修改后**：操作列只保留"活动分析"按钮

### 2. 删除活动详情抽屉组件
**位置**：组件末尾的 JSX 部分
**删除内容**：整个活动详情抽屉组件，包括：
- 抽屉容器 (`Drawer` 组件)
- 详情展示 (`Descriptions` 组件)
- 所有活动信息字段的展示
- 平台标签和状态标签的渲染
- 0核销零售商列表的展示

### 3. 删除详情相关的状态管理变量
**删除的状态变量**：
```typescript
const [activityDetailVisible, setActivityDetailVisible] = useState(false);
const [selectedActivityData, setSelectedActivityData] = useState<ActivityData | null>(null);
```

**保留的状态变量**：
- `receiveDetailVisible` - 领券明细抽屉状态
- `verifyDetailVisible` - 核销明细抽屉状态
- `selectedActivityId` - 选中的活动ID

### 4. 删除 showDrawer 函数
**删除的函数**：
```typescript
const showDrawer = (record: ActivityData) => {
  setSelectedActivityData(record);
  setActivityDetailVisible(true);
};
```

## 删除步骤
1. ✅ 删除表格操作列中的详情按钮
2. ✅ 删除活动详情抽屉组件
3. ✅ 删除详情相关的状态管理变量
4. ✅ 删除 showDrawer 函数
5. ✅ 测试删除后的页面功能

## 测试结果
- ✅ 代码编译成功，无错误
- ✅ 页面可以正常访问
- ✅ 表格操作列只显示"活动分析"按钮
- ✅ 不再有详情相关的功能和UI组件

## 影响范围
- **UI变化**：表格操作列减少了"详情"按钮
- **功能变化**：用户无法通过点击详情按钮查看活动的详细信息
- **代码简化**：移除了不需要的状态管理和组件代码

## 涉及文件
- `src/pages/client/store-marketing/AllActivities.tsx`

## 经验总结
1. **完整性删除**：删除功能时需要同时删除相关的状态、函数和UI组件
2. **依赖检查**：确保删除的代码没有被其他地方引用
3. **测试验证**：删除后及时测试确保页面功能正常
4. **代码清理**：删除不必要的导入和变量，保持代码整洁

---
删除时间：2025-01-27
操作人员：AI助手