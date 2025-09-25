# GitHub Pages 部署指南

本项目已配置好 GitHub Pages 静态部署，按照以下步骤即可完成部署：

## 1. 准备工作

### homepage 字段已配置
`package.json` 中的 `homepage` 字段已设置为：

```json
{
  "homepage": "https://SuperCup.github.io/Data-Center"
}
```

## 2. 推送代码到 GitHub

1. 将项目代码推送到 GitHub 仓库的 `main` 分支
2. 确保包含以下文件：
   - `.github/workflows/deploy.yml` - GitHub Actions 工作流
   - `public/404.html` - 单页应用路由支持
   - 更新后的 `package.json` 和 `public/index.html`

## 3. 启用 GitHub Pages

1. 进入 GitHub 仓库页面
2. 点击 **Settings** 选项卡
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择 **GitHub Actions**
5. 保存设置

## 4. 自动部署

推送代码到 `main` 分支后，GitHub Actions 会自动：
1. 安装依赖 (`npm ci`)
2. 构建项目 (`npm run build`)
3. 部署到 GitHub Pages

## 5. 访问网站

部署完成后，您可以通过以下地址访问网站：
```
https://SuperCup.github.io/Data-Center
```

## 配置说明

### 路由配置
- 项目使用 React Router 进行客户端路由
- 生产环境下会自动添加 `/YOUR_REPOSITORY_NAME` 作为 basename
- 包含 404.html 处理，支持直接访问子路由

### GitHub Actions 工作流
- 触发条件：推送到 `main` 分支
- 使用 Node.js 18
- 自动缓存 npm 依赖
- 使用 `peaceiris/actions-gh-pages` 进行部署

### 单页应用支持
- `public/404.html` 处理路由重定向
- `public/index.html` 包含路由恢复脚本
- 支持直接访问任意路由地址

## 故障排除

### 构建失败
- 检查 Actions 页面的构建日志
- 确保所有依赖都在 package.json 中正确声明
- 检查 TypeScript 类型错误

### 路由不工作
- 确认 homepage 字段设置正确
- 检查 404.html 文件是否存在
- 验证 basename 配置是否匹配仓库名

### 样式或资源加载失败
- 确认 PUBLIC_URL 环境变量正确设置
- 检查相对路径引用
- 验证 homepage 字段格式

## 本地测试生产构建

在部署前，可以本地测试生产构建：

```bash
# 构建项目
npm run build

# 使用 serve 工具测试（需要先安装：npm install -g serve）
serve -s build -l 3000
```

访问 `http://localhost:3000` 测试构建结果。