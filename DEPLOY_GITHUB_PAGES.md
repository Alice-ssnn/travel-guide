# GitHub Pages 部署指南

## 概述
本指南将帮助您将瑞士法国旅行指南应用部署到GitHub Pages。GitHub Pages提供免费的静态网站托管，自动启用HTTPS，并与Git无缝集成。

## 前提条件
1. **GitHub账户**: 如果没有，请前往 [GitHub.com](https://github.com) 注册
2. **Git已安装**: 确认本地已安装Git (`git --version`)
3. **项目代码**: 已在本地的Git仓库中

## 部署步骤

### 步骤1: 在GitHub上创建新仓库
1. 登录GitHub
2. 点击右上角 "+" 图标，选择 "New repository"
3. 填写仓库信息:
   - **Repository name**: `travel-guide` (或其他名称)
   - **Description**: 可选，如 "Switzerland France Travel Guide PWA"
   - **Visibility**: 选择 **Public** (GitHub Pages要求公开仓库)
   - **不要** 初始化README、.gitignore或license文件 (本地已有)
4. 点击 "Create repository"

### 步骤2: 添加远程仓库到本地项目
在终端中，进入项目目录并执行以下命令：

```bash
cd /Users/zsn/travel-guide-project/travel-guide

# 添加远程仓库 (替换 YOUR_USERNAME 为您的GitHub用户名)
git remote add origin https://github.com/YOUR_USERNAME/travel-guide.git

# 验证远程仓库
git remote -v
# 应该显示:
# origin  https://github.com/YOUR_USERNAME/travel-guide.git (fetch)
# origin  https://github.com/YOUR_USERNAME/travel-guide.git (push)
```

### 步骤3: 推送代码到GitHub
```bash
# 推送代码到GitHub
git push -u origin main

# 如果需要认证，会提示输入GitHub用户名和密码
# 建议使用Personal Access Token (见下文"认证问题")
```

### 步骤4: 启用GitHub Pages
1. 在GitHub仓库页面，点击 **Settings** 选项卡
2. 左侧菜单中找到 **Pages**
3. 在 "Source" 部分:
   - 选择 **Deploy from a branch**
   - 分支选择 **main** (或您使用的分支)
   - 文件夹选择 **/(root)**
   - 点击 **Save**
4. 等待几分钟，直到出现 "Your site is published at..." 消息
5. 访问提供的URL，格式为: `https://YOUR_USERNAME.github.io/travel-guide/`

### 步骤5: 配置自定义域名 (可选)
如果需要使用自定义域名:
1. 在Pages设置中，输入您的域名
2. 在您的域名注册商处配置DNS:
   - 添加CNAME记录指向 `YOUR_USERNAME.github.io`
   - 或添加A记录指向GitHub Pages IP地址
3. 等待DNS传播 (最多24小时)

## 认证问题

### 使用Personal Access Token
由于GitHub已禁用密码认证，建议使用Personal Access Token:

1. **生成Token**:
   - 点击GitHub头像 → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 填写Note: "Travel Guide Deployment"
   - 选择权限: 至少勾选 `repo`
   - 点击 "Generate token"
   - **复制token** (只显示一次)

2. **使用Token推送**:
   ```bash
   # 使用token作为密码
   git push -u origin main
   # 用户名: 您的GitHub用户名
   # 密码: 粘贴刚才复制的token
   ```

3. **保存认证** (可选):
   ```bash
   # 缓存凭证 (默认15分钟)
   git config --global credential.helper cache

   # 或永久存储 (macOS)
   git config --global credential.helper osxkeychain
   ```

## 项目特定配置

### Google Maps API密钥
由于GitHub Pages是静态托管，无法设置环境变量。您有以下选项:

#### 选项A: 使用localStorage机制 (推荐)
应用已支持用户输入API密钥:
1. 用户首次访问时，会提示输入Google Maps API密钥
2. 密钥保存在浏览器的localStorage中
3. 每个用户需要自己的API密钥

#### 选项B: 在代码中设置API密钥 (不推荐)
如果希望所有用户使用同一个密钥:
1. 修改 `js/app.js` 第30行:
   ```javascript
   const apiKey = localStorage.getItem('googleMapsApiKey') || 'YOUR_API_KEY_HERE';
   ```
2. 重新提交并推送代码
3. **注意**: 这会暴露API密钥在源代码中，请确保在Google Cloud Console中限制HTTP referrer

#### 选项C: 使用环境变量 (需要构建步骤)
如果需要，可以添加构建步骤来注入环境变量，但这需要配置GitHub Actions。

### Service Worker 注意事项
GitHub Pages完全支持Service Worker，但需要注意:
- Service Worker只能在HTTPS下注册 (GitHub Pages自动提供)
- Service Worker作用域是整个仓库
- 更新Service Worker后，用户可能需要关闭所有标签页才能获取新版本

## 测试部署

### 功能测试清单
部署后，请测试以下功能:

1. **基本访问**
   - [ ] 网站可访问: `https://YOUR_USERNAME.github.io/travel-guide/`
   - [ ] HTTPS连接正常
   - [ ] 首页加载无错误

2. **核心功能**
   - [ ] 时间轴滚动正常
   - [ ] 日期卡片点击进入详情页
   - [ ] 地图显示 (需要API密钥)
   - [ ] 搜索功能

3. **PWA功能**
   - [ ] Service Worker注册成功 (检查浏览器开发者工具 → Application → Service Workers)
   - [ ] 可添加到主屏幕 (移动端)
   - [ ] 离线访问 (关闭网络后刷新页面)
   - [ ] 离线状态组件显示

4. **Phase 3 离线优化**
   - [ ] NetworkMonitor检测网络状态
   - [ ] OfflineStatus组件显示正确
   - [ ] 离线地图回退功能
   - [ ] 后台同步注册

### Lighthouse 审计
在Chrome开发者工具中运行Lighthouse审计，确保PWA评分>90:
- **Performance**: 性能指标
- **Accessibility**: 无障碍访问
- **Best Practices**: 最佳实践
- **SEO**: 搜索引擎优化
- **PWA**: 渐进式Web应用

## 更新部署
当需要更新应用时:

```bash
# 1. 本地修改代码
# 2. 提交更改
git add .
git commit -m "feat: update description"

# 3. 推送到GitHub
git push origin main

# 4. GitHub Pages会自动重新部署 (通常1-2分钟)
```

## 故障排除

### 常见问题

#### 1. 页面显示404
- **原因**: GitHub Pages未正确配置
- **解决**: 检查Settings → Pages，确保分支和文件夹正确

#### 2. 资源加载失败 (CSS/JS 404)
- **原因**: 文件路径错误
- **解决**: 确保所有资源路径使用相对路径 (如 `js/app.js` 而不是 `/js/app.js`)

#### 3. Service Worker不注册
- **原因**: HTTPS问题或路径问题
- **解决**: 检查浏览器控制台错误，确保Service Worker文件在根目录

#### 4. 地图不显示
- **原因**: API密钥未设置或域名未授权
- **解决**: 
  1. 在Google Cloud Console中检查API密钥限制
  2. 添加GitHub Pages域名到HTTP referrer限制
  3. 或使用localStorage输入机制

#### 5. 推送代码失败
- **原因**: 认证失败
- **解决**: 使用Personal Access Token而不是密码

### 检查清单
- [ ] 仓库设置为Public
- [ ] GitHub Pages已启用并配置正确分支
- [ ] 代码已成功推送
- [ ] 网站URL可访问
- [ ] 控制台无错误
- [ ] Service Worker已注册
- [ ] HTTPS连接正常

## 高级配置

### 使用GitHub Actions自动化
可以创建GitHub Actions工作流来自动化测试和部署:

1. 创建 `.github/workflows/deploy.yml`
2. 配置测试和部署步骤
3. 添加环境变量 (如果需要)

### 自定义404页面
创建 `404.html` 文件，GitHub Pages会自动使用它作为404页面。

### 启用HTTPS强制
GitHub Pages默认启用HTTPS，可以在Pages设置中检查"Enforce HTTPS"选项。

## 支持与资源
- [GitHub Pages文档](https://docs.github.com/pages)
- [PWA最佳实践](https://web.dev/progressive-web-apps/)
- [Google Maps API文档](https://developers.google.com/maps/documentation)

## 下一步
部署完成后，建议:
1. 进行用户测试，收集反馈
2. 设置Google Analytics跟踪使用情况
3. 定期更新内容和功能
4. 监控性能指标

---
*部署指南版本: 1.0*  
*更新日期: 2026年4月6日*  
*适用于: Phase 3 PWA离线优化完成版*