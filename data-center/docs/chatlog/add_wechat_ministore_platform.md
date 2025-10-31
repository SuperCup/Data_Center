# 添加微信小店平台类型和查看分析按钮功能

## 任务描述
用户要求在 `AllActivities.tsx` 中增加"微信小店"活动平台类型，在 `ActivityAnalysis.tsx` 中活动详情下的活动机制增加"微信小店"，机制样例为"2元乐享、新品立减2元"，并在"微信小店"机制标题后增加"查看分析"按钮，点击该按钮跳转到 `SmallStoreActivityAnalysis.tsx` 页面。

## 修改内容

### 1. AllActivities.tsx 修改
- **添加微信小店平台类型到活动数据**：为多个活动数据项的 `platforms` 数组添加了 `'微信小店'` 平台类型
- **添加平台筛选选项**：在平台筛选下拉菜单中添加了"微信小店"选项
- **添加平台标签配色**：为"微信小店"平台标签添加了青色配色方案

### 2. ActivityAnalysis.tsx 修改
- **添加微信小店活动机制**：为三个活动数据项的 `mechanisms` 对象添加了"微信小店"机制，包含"2元乐享"和"新品立减2元"样例
- **添加查看分析按钮**：在微信小店机制标题后添加了"查看分析"按钮，点击后跳转到 `/client/store-marketing/small-store-activity-analysis` 页面

## 修改步骤

### 步骤1：在AllActivities.tsx中添加微信小店平台类型
1. 为活动数据项的 `platforms` 数组添加 `'微信小店'`
2. 在平台筛选下拉选项中添加"微信小店"选项
3. 为"微信小店"平台标签添加青色配色

### 步骤2：在ActivityAnalysis.tsx中添加微信小店机制
1. 为三个活动的 `mechanisms` 对象添加"微信小店"机制
2. 添加机制样例："2元乐享"和"新品立减2元"

### 步骤3：添加查看分析按钮
1. 修改活动机制显示逻辑，为平台标题添加flex布局
2. 在微信小店机制标题后添加"查看分析"按钮
3. 设置按钮点击事件，跳转到SmallStoreActivityAnalysis.tsx页面

## 测试结果
- ✅ 页面编译成功，无错误
- ✅ AllActivities页面可以正常访问，微信小店平台类型显示正常
- ✅ ActivityAnalysis页面可以正常访问，微信小店机制和查看分析按钮显示正常
- ✅ 查看分析按钮功能正常，可以跳转到指定页面

## 影响范围
- **AllActivities.tsx**：增加了微信小店平台类型的筛选和显示功能
- **ActivityAnalysis.tsx**：增加了微信小店活动机制和查看分析按钮功能
- **用户体验**：用户现在可以查看和筛选微信小店平台的活动，并通过查看分析按钮跳转到专门的分析页面

## 涉及文件
- `d:\Project\Data_Center\data-center\src\pages\client\store-marketing\AllActivities.tsx`
- `d:\Project\Data_Center\data-center\src\pages\client\store-marketing\ActivityAnalysis.tsx`

## 经验总结
1. 在添加新的平台类型时，需要同时更新数据、筛选选项和样式配色
2. 在添加交互按钮时，需要考虑布局调整，使用flex布局确保按钮位置合理
3. 跳转功能使用 `window.location.href` 实现页面跳转
4. 测试时需要确保所有相关页面都能正常访问和显示

## 完成时间
2025年1月27日