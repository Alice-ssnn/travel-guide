#!/bin/bash

# GitHub Pages 部署脚本
# 使用方法: ./deploy-to-github.sh GITHUB_USERNAME REPO_NAME

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== GitHub Pages 部署脚本 ===${NC}"

# 检查参数
if [ $# -ne 2 ]; then
    echo -e "${RED}错误: 需要两个参数${NC}"
    echo "使用方法: $0 GITHUB_USERNAME REPO_NAME"
    echo "示例: $0 zhangshan travel-guide"
    exit 1
fi

GITHUB_USERNAME="$1"
REPO_NAME="$2"
REMOTE_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo -e "${YELLOW}配置信息:${NC}"
echo "GitHub用户名: $GITHUB_USERNAME"
echo "仓库名称: $REPO_NAME"
echo "远程URL: $REMOTE_URL"
echo "当前目录: $(pwd)"
echo ""

# 检查是否在Git仓库中
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo -e "${RED}错误: 当前目录不是Git仓库${NC}"
    exit 1
fi

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}警告: 有未提交的更改${NC}"
    read -p "是否要提交所有更改? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "chore: deploy updates"
    else
        echo -e "${RED}请先提交或暂存更改${NC}"
        exit 1
    fi
fi

# 添加远程仓库
echo -e "${GREEN}步骤1: 添加远程仓库...${NC}"
if git remote | grep -q origin; then
    echo "远程仓库origin已存在，更新URL"
    git remote set-url origin "$REMOTE_URL"
else
    echo "添加远程仓库origin"
    git remote add origin "$REMOTE_URL"
fi

# 推送代码
echo -e "${GREEN}步骤2: 推送代码到GitHub...${NC}"
echo -e "${YELLOW}注意: 如果提示输入密码，请使用GitHub Personal Access Token${NC}"
echo ""

# 尝试推送
if git push -u origin main; then
    echo -e "${GREEN}✓ 代码推送成功${NC}"
else
    echo -e "${RED}✗ 代码推送失败${NC}"
    echo "可能的原因:"
    echo "1. 远程仓库不存在 - 请先在GitHub.com创建仓库"
    echo "2. 认证失败 - 请使用Personal Access Token而不是密码"
    echo "3. 网络问题"
    exit 1
fi

# 显示部署信息
echo ""
echo -e "${GREEN}=== 部署成功 ===${NC}"
echo ""
echo -e "${YELLOW}下一步:${NC}"
echo "1. 访问 https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "2. 点击 Settings → Pages"
echo "3. 配置:"
echo "   - Source: Deploy from a branch"
echo "   - Branch: main"
echo "   - Folder: / (root)"
echo "4. 点击 Save"
echo "5. 等待几分钟，访问: https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
echo -e "${YELLOW}测试检查清单:${NC}"
echo "1. 网站可访问"
echo "2. Service Worker已注册 (检查开发者工具)"
echo "3. 地图功能正常 (可能需要输入API密钥)"
echo "4. 离线模式工作"
echo ""
echo -e "${GREEN}部署完成!${NC}"