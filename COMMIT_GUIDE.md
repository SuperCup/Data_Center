# Git 提交代码到 GitHub 操作指南（Windows）

## 本次修改内容
- 修改 `ActivityProgress.tsx`：
  1. 将"区域筛选"改为"自定义筛选"，并添加付费开通功能（默认未开通）
  2. 全平台GMV和ROI添加付费开通功能（默认未开通）
  3. 移除方案汇总单独显示
  4. 实现点击方案名称查看方案汇总数据功能（Drawer方式）

## 操作步骤

### 1. 打开 PowerShell 或 CMD
- 按 `Win + X`，选择"Windows PowerShell"或"命令提示符"
- 或者按 `Win + R`，输入 `powershell` 或 `cmd`

### 2. 进入项目目录
```powershell
cd d:\Project\Data_Center
```

### 3. 检查当前状态
```powershell
# 查看当前分支
git branch

# 查看修改的文件
git status

# 查看具体修改内容
git diff
```

### 4. 添加修改的文件
```powershell
# 添加所有修改的文件
git add .

# 或者只添加特定文件
git add data-center/src/pages/client/instant-retail/ActivityProgress.tsx
```

### 5. 提交代码（使用以下提交备注）
```powershell
git commit -m "feat: ActivityProgress页面功能优化

- 将区域筛选改为自定义筛选，添加付费开通功能（默认未开通）
- 全平台GMV和ROI添加付费开通功能（默认未开通）
- 移除方案汇总单独显示Card
- 实现点击方案名称查看方案汇总数据功能（Drawer方式）
- 添加付费功能状态管理和UI提示（未开通标签、Modal提示）"
```

### 6. 推送到 GitHub
```powershell
# 推送到当前分支（如果是main或master分支）
git push origin main

# 或者推送到当前所在分支（自动识别）
git push

# 如果是其他分支，例如：
git push origin supermingzhao
```

### 7. 如果遇到冲突或需要设置上游分支
```powershell
# 首次推送新分支时，需要设置上游分支
git push -u origin <分支名>

# 例如：
git push -u origin supermingzhao
```

## 完整命令序列（一键执行）

```powershell
# 进入项目目录
cd d:\Project\Data_Center

# 查看状态
git status

# 添加所有修改
git add .

# 提交代码
git commit -m "feat: ActivityProgress页面功能优化

- 将区域筛选改为自定义筛选，添加付费开通功能（默认未开通）
- 全平台GMV和ROI添加付费开通功能（默认未开通）
- 移除方案汇总单独显示Card
- 实现点击方案名称查看方案汇总数据功能（Drawer方式）
- 添加付费功能状态管理和UI提示（未开通标签、Modal提示）"

# 推送到远程仓库
git push
```

## 注意事项

1. **确认分支**：推送前确认当前所在分支是否正确
2. **远程仓库**：确认已配置远程仓库地址
   ```powershell
   git remote -v
   ```
3. **权限问题**：如果推送失败，可能需要配置SSH密钥或使用Personal Access Token
4. **冲突处理**：如果远程有更新，先拉取再推送
   ```powershell
   git pull
   git push
   ```

## 提交备注说明

本次提交使用了以下格式：
- **类型**：`feat` (新功能)
- **范围**：ActivityProgress页面
- **描述**：功能优化的详细说明

## 备用提交备注（简洁版）

如果上面的备注太长，可以使用这个简洁版本：

```powershell
git commit -m "feat: ActivityProgress添加付费功能和方案汇总查看"
```
