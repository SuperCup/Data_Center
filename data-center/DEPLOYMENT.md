# 数据中心项目部署指南

## 项目打包完成 ✅

项目已成功打包，生成的文件位于 `build` 文件夹中。

### 打包信息
- 主要JS文件大小：942.64 kB (gzip压缩后)
- CSS文件大小：1.55 kB
- 打包输出目录：`build/`

## 部署方式

### 1. 本地静态服务器测试
```bash
# 安装serve工具
npm install -g serve

# 启动静态服务器
serve -s build

# 默认访问地址：http://localhost:3000
```

### 2. Netlify部署 (推荐)
项目已配置好Netlify部署文件 `netlify.toml`：

**方式一：拖拽部署**
1. 访问 [Netlify](https://www.netlify.com/)
2. 直接将 `build` 文件夹拖拽到部署区域
3. 获得临时访问链接

**方式二：Git部署**
1. 将代码推送到GitHub/GitLab
2. 在Netlify中连接仓库
3. 自动构建和部署

### 3. Vercel部署
项目已配置 `vercel.json` 文件：
1. 访问 [Vercel](https://vercel.com/)
2. 导入GitHub仓库或上传build文件夹
3. 自动部署

### 4. 其他静态托管平台
- **GitHub Pages**: 上传build文件夹内容到gh-pages分支
- **Firebase Hosting**: 使用Firebase CLI部署
- **阿里云OSS**: 上传到OSS并配置静态网站托管
- **腾讯云COS**: 配置静态网站托管

## 访问路径
部署后可通过以下路径访问不同页面：
- 首页：`/`
- 用户分析：`/client/user-analysis`
- 全量活动：`/client/all-activities`
- 活动分析：`/client/activity-analysis`
- 优惠券详情：`/client/coupon-detail`

## 注意事项
1. 项目使用React Router，需要配置服务器重定向所有路由到index.html
2. 已在netlify.toml中配置了重定向规则
3. 如使用其他平台，请确保配置SPA路由支持
4. 项目包含一些ESLint警告，但不影响功能运行

## 分享给外部用户
推荐使用Netlify拖拽部署方式，几分钟内即可获得可分享的链接。