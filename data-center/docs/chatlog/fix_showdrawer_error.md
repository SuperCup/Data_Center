# 修复 showDrawer 函数未定义错误

## 问题描述
用户报告 `src/pages/client/store-marketing/AllActivities.tsx` 文件第406行存在 TypeScript 错误：
```
TS2304: Cannot find name 'showDrawer'
```

## 报错信息
```
ERROR in src/pages/client/store-marketing/AllActivities.tsx:406:29 
 TS2304: Cannot find name 'showDrawer'. 
     404 |         <Space size="middle"> 
     405 |           <a onClick={() => handleActivityAnalysis(record.activityId)}>活动分析</a> 
   >  406 |           <a onClick={() => showDrawer(record)}>详情</a> 
         |                             ^^^^^^^^^^ 
     407 |         </Space> 
     408 |       ), 
     409 |     }, 
```

## 修复过程

### 1. 问题分析
- 在表格操作列中调用了 `showDrawer(record)` 函数
- 但该函数未在组件中定义
- 页面已有 `handleReceiveDetail` 和 `handleVerifyDetail` 两个抽屉相关函数
- 缺少活动详情抽屉的状态管理和函数定义

### 2. 修复步骤

#### 2.1 添加状态管理变量
```typescript
const [activityDetailVisible, setActivityDetailVisible] = useState(false);
const [selectedActivityData, setSelectedActivityData] = useState<ActivityData | null>(null);
```

#### 2.2 添加 showDrawer 函数
```typescript
const showDrawer = (record: ActivityData) => {
  setSelectedActivityData(record);
  setActivityDetailVisible(true);
};
```

#### 2.3 添加活动详情抽屉组件
- 创建了完整的活动详情抽屉
- 使用 `Descriptions` 组件展示活动信息
- 包含活动编号、名称、平台、状态、时间、金额等详细信息
- 支持平台标签的颜色区分
- 支持状态标签的颜色区分
- 显示0核销零售商列表（如果存在）

### 3. 修复内容
- **状态管理**：添加了 `activityDetailVisible` 和 `selectedActivityData` 状态
- **函数定义**：实现了 `showDrawer` 函数来处理活动详情显示
- **UI组件**：添加了完整的活动详情抽屉，包含所有活动信息的展示

### 4. 测试验证
- 开发服务器成功编译，无 TypeScript 错误
- 页面可以正常访问
- "详情"按钮功能已实现

## 修复结果
✅ 成功修复了 `showDrawer` 函数未定义的错误
✅ 添加了完整的活动详情抽屉功能
✅ 页面编译通过，无报错
✅ 功能完整，用户体验良好

## 涉及文件
- `src/pages/client/store-marketing/AllActivities.tsx`

## 经验总结
1. **函数引用检查**：在使用函数前确保已正确定义
2. **状态管理完整性**：抽屉组件需要对应的状态管理
3. **UI组件完整性**：确保所有交互功能都有对应的UI实现
4. **数据展示规范**：使用合适的组件（如 Descriptions）来展示详细信息
5. **用户体验**：提供完整的信息展示，包括标签颜色区分等细节

---
修复时间：2025-01-27
修复人员：AI助手