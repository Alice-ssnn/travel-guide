# Obsidian 导入指南 - 旅行指南项目文档

## 概述
本文档说明如何将旅行指南项目文档导入 Obsidian 知识库。

## 文档文件

以下项目文档已准备好导入 Obsidian：

1. **项目总结文档**: `docs/旅行指南项目总结文档.md`
   - 包含完整项目概述、技术架构、实现阶段、部署状态
   - 使用标准的 frontmatter 格式，已包含 tags 和 category

2. **项目设计文档**: `旅行指南项目设计文档.md`  
   - 项目设计和需求分析文档

3. **部署文档**: 
   - `DEPLOYMENT_CHECKLIST.md` - 部署检查清单
   - `DEPLOY_GITHUB_PAGES.md` - GitHub Pages部署指南

## 导入方法

### 方法一：手动复制
1. 在 Obsidian 中创建新 vault 或打开现有 vault
2. 将上述 markdown 文件复制到 vault 目录中
3. 在 Obsidian 中刷新文件列表

### 方法二：使用 Obsidian MCP (推荐)
如果已配置 Obsidian MCP 服务器，可通过以下方式导入：

1. **配置 MCP 服务器**:
   ```bash
   # 安装 Obsidian MCP
   npm install -g obsidian-notes-mcp
   
   # 启动服务器
   obsidian-notes-mcp
   ```

2. **通过 Claude Code 导入**:
   - 使用 `mcp__obsidian__create_note` 工具创建新笔记
   - 或使用 `mcp__obsidian__update_note` 工具更新现有笔记

### 方法三：使用技能自动化
配置 `obsidian-note-workflow` skill 实现自动导入：

1. 在 `.claude.json` 中配置 Obsidian MCP:
   ```json
   {
     "mcpServers": {
       "obsidian": {
         "command": "npx",
         "args": ["-y", "obsidian-notes-mcp"]
       }
     }
   }
   ```

2. 设置环境变量:
   ```bash
   export OBSIDIAN_VAULT_PATH="/path/to/your/vault"
   ```

3. 使用技能命令:
   ```
   记录：旅行指南项目文档更新 - [内容]
   ```

## 文档结构

导入后建议的文档结构：

```
旅行指南项目/
├── 项目总结文档.md
├── 技术架构.md
├── 部署指南.md
├── 修复记录.md
└── 未来规划.md
```

## Frontmatter 格式

项目总结文档已使用标准 frontmatter：

```yaml
---
tags: [travel-guide, pwa, github-pages, web-app, project-documentation, 瑞士旅行, 法国旅行, 离线应用, 响应式设计]
created: 2026-04-06T15:00:00Z
updated: 2026-04-06T15:00:00Z
category: 工作记录
---
```

## 标签系统

建议在 Obsidian 中使用的标签：

- `#travel-guide` - 旅行指南项目
- `#pwa` - 渐进式Web应用
- `#github-pages` - GitHub Pages部署
- `#web-app` - Web应用开发
- `#project-documentation` - 项目文档
- `#瑞士旅行` - 瑞士旅行主题
- `#法国旅行` - 法国旅行主题
- `#离线应用` - 离线功能
- `#响应式设计` - 响应式设计

## 双向链接建议

在 Obsidian 中可以创建以下双向链接：

- `[[Web开发]]` - 关联到Web开发相关笔记
- `[[PWA开发]]` - 关联到PWA开发笔记
- `[[GitHub Pages部署]]` - 关联到部署相关笔记
- `[[旅行规划]]` - 关联到旅行规划相关笔记

## 模板使用

如果需要批量导入多个项目文档，可以创建 Obsidian 模板：

```markdown
---
tags: [{{tags}}]
created: {{date}}
updated: {{date}}
category: {{category}}
---

# {{title}}

{{content}}
```

## 故障排除

### 问题：Obsidian MCP 连接失败
**解决方案**:
1. 检查 MCP 服务器是否运行: `ps aux | grep obsidian-notes-mcp`
2. 检查环境变量: `OBSIDIAN_API_KEY` 和 `OBSIDIAN_REJECT_UNAUTHORIZED`
3. 重启 MCP 服务器: `npx -y obsidian-notes-mcp`

### 问题：文件权限问题
**解决方案**:
1. 检查 vault 目录是否可写
2. 检查文件锁（如果 Obsidian 正在编辑该文件）

### 问题：中文文件名显示异常
**解决方案**:
1. 确保 Obsidian 使用 UTF-8 编码
2. 或在导入前将文件名改为英文

## 自动化建议

### 每日同步
可以配置 cron 任务每日同步项目文档：

```bash
# 每天凌晨同步文档
0 2 * * * cd /Users/zsn/travel-guide-project && cp docs/*.md /path/to/obsidian/vault/projects/
```

### Git 集成
将 Obsidian vault 与 Git 集成，实现版本控制：

```bash
cd /path/to/obsidian/vault
git init
git add .
git commit -m "添加旅行指南项目文档"
```

## 维护说明

- 项目文档位于 `docs/` 目录
- 主要文档更新时应同步到 Obsidian
- 定期检查文档链接有效性
- 更新标签系统以保持一致性

---
*创建日期: 2026年4月6日*
*最后更新: 2026年4月6日*
*适用于: 旅行指南项目文档管理*