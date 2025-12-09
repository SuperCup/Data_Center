# Git 提交备注

## 功能更新：专属定制报表和文件交付页面优化

### 主要修改内容

#### 1. 专属定制报表页面重构 (CustomService.tsx)
- **UI 优化**：
  - 改为列表形式展示报表（使用 Table 组件）
  - 移除工具类型显示，仅显示报表名称、有效时间、描述
  - 描述字段单行显示，最多20个字，超出部分使用 Tooltip 显示完整内容
  - 标题样式与 ProductList.tsx 保持一致

- **功能增强**：
  - 支持按报表名称搜索筛选
  - 按报表创建时间倒序排序
  - 查看按钮直接在新浏览器标签页打开链接
  - 全屏预览功能：
    - 全屏预览按钮移至页面右侧（标题行）
    - 全屏模式下隐藏系统菜单
    - 支持通过下拉框快速切换所有报表
    - 在当前窗口内加载报表内容（iframe）
    - 添加退出全屏按钮

- **数据更新**：
  - 更新所有测试报表链接，从5个 QuickBI 链接中随机分配
  - 添加报表有效时间字段

#### 2. 文件交付页面样式优化 (FileDelivery.tsx)
- 标题样式与 ProductList.tsx 保持一致
- 使用 `<Title level={4} style={{ margin: 0 }}>`
- 外层容器 `padding: '0'`
- 标题区域 `marginBottom: 16`

#### 3. 全屏预览样式支持 (App.css)
- 添加全屏预览模式 CSS 样式
- 全屏模式下隐藏系统菜单和头部
- 优化退出全屏时的菜单恢复逻辑

#### 4. 代码优化
- 添加组件卸载时的清理逻辑，确保菜单正确恢复
- 优化全屏预览的进入和退出流程
- 修复菜单不显示的问题

### 修改文件列表
- `data-center/src/pages/client/custom-service/CustomService.tsx`
- `data-center/src/pages/client/file-delivery/FileDelivery.tsx`
- `data-center/src/App.css`

### 提交命令
```bash
git add data-center/src/pages/client/custom-service/CustomService.tsx
git add data-center/src/pages/client/file-delivery/FileDelivery.tsx
git add data-center/src/App.css
git commit -m "feat: 优化专属定制报表和文件交付页面

- 重构专属定制报表页面为列表展示形式
- 添加全屏预览功能，支持快速切换报表
- 优化文件交付页面样式，与商品清单页面保持一致
- 更新测试报表链接为 QuickBI 真实链接
- 修复全屏预览模式下菜单显示问题"
```
