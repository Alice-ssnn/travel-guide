# 瑞士法国旅行指南 PWA 应用

## 项目概述

将瑞士·南法·巴黎12日深度游完整攻略转换为交互式旅行指南应用，提供行程可视化、预算管理、地图集成和离线访问功能。

**线上地址**: https://alice-ssnn.github.io/travel-guide/
**部署日期**: 2026年4月6日
**项目状态**: Phase 3 PWA离线优化完成

## 核心功能

- ✅ 12天完整行程展示（包含详细时间轴）
- ✅ 地图集成（Google Maps API + 离线回退）
- ✅ 离线访问支持（PWA Service Worker）
- ✅ 移动端优化响应式设计
- ✅ 网络状态监控和智能缓存
- ✅ 搜索功能和费用统计

## 技术架构

### 前端技术
- **语言**: 原生JavaScript (ES6+), HTML5, CSS3
- **PWA特性**: Service Worker, Web App Manifest, Cache API, IndexedDB
- **UI组件**: 自定义CSS组件系统
- **响应式**: 移动优先，自适应各种屏幕

### 部署
- **托管**: GitHub Pages (静态托管)
- **构建**: 无构建步骤，纯前端应用
- **HTTPS**: GitHub Pages自动提供

## 实现阶段

### Phase 1: 基础框架
- 项目结构搭建，数据模型定义
- 基础页面布局，时间轴组件开发

### Phase 2: 核心功能  
- 行程详情页面，地图集成框架
- 搜索功能，响应式设计优化

### Phase 3: PWA离线优化
- 网络质量监控 (NetworkMonitor)
- 智能缓存策略 (CacheStrategy)
- 离线同步管理器 (OfflineSyncManager)
- 离线地图服务 (OfflineMapService)
- 离线状态组件 (OfflineStatus)

## 部署验证

### 测试链接
1. **首页**: https://alice-ssnn.github.io/travel-guide/
2. **第9天**: https://alice-ssnn.github.io/travel-guide/day.html?day=9
3. **第10天**: https://alice-ssnn.github.io/travel-guide/day.html?day=10  
4. **第11天**: https://alice-ssnn.github.io/travel-guide/day.html?day=11
5. **第12天**: https://alice-ssnn.github.io/travel-guide/day.html?day=12

### 最近修复 (2026-04-06)
- **行程数据修复**: 第9-12天详细行程数据更新
- **移动端UI修复**: 时间轴显示比例优化（70px → 50px）

## 项目文档

详细项目文档位于 `docs/` 目录：
- `旅行指南项目总结文档.md` - 完整项目概述、技术架构、部署状态
- `旅行指南项目设计文档.md` - 项目设计和需求分析
- `DEPLOYMENT_CHECKLIST.md` - 部署检查清单
- `DEPLOY_GITHUB_PAGES.md` - GitHub Pages部署指南

## 本地开发

```bash
# 克隆项目
git clone https://github.com/Alice-ssnn/travel-guide.git

# 启动本地服务器（需要Python）
python3 -m http.server 8000

# 访问 http://localhost:8000
```

## Google Maps API 配置

应用支持两种方式配置API密钥：

1. **用户输入**（默认）：首次访问时提示用户输入API密钥，存储在localStorage
2. **代码配置**（开发）：修改 `js/app.js` 第30行设置默认API密钥

## 项目结构

```
travel-guide-project/
├── index.html          # 主页面
├── day.html           # 单日行程详情页
├── css/               # 样式文件
├── js/                # JavaScript代码
│   ├── data.js        # 行程数据（12天完整行程）
│   ├── app.js         # 主应用逻辑
│   ├── timeline.js    # 时间轴组件
│   ├── map.js         # 地图管理
│   └── service-worker.js # Service Worker
├── docs/              # 项目文档
└── 部署脚本和配置
```

## Obsidian 文档整合

项目总结文档已创建为 Markdown 格式，可轻松导入 Obsidian：
- `docs/旅行指南项目总结文档.md` 包含完整项目信息
- 文件已使用标准的 frontmatter 格式 (tags, category)
- 可复制到 Obsidian vault 或通过 Obsidian MCP 工具导入

## 维护信息

- **项目维护者**: Claude Code
- **最后更新**: 2026年4月6日
- **版本**: Phase 3 完成版
- **许可证**: MIT