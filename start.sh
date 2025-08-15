#!/bin/bash

# TechVault 启动脚本
# 用于快速设置和启动项目

echo "================================="
echo "    TechVault 启动脚本"
echo "================================="

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "请先安装 Node.js (版本 >= 16.0.0)"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm"
    echo "请先安装 npm"
    exit 1
fi

# 显示版本信息
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo "✅ Node.js 版本: $NODE_VERSION"
echo "✅ npm 版本: $NPM_VERSION"
echo ""

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装项目依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
else
    echo "📦 依赖已安装，跳过安装步骤"
fi

# 创建上传目录
if [ ! -d "uploads" ]; then
    echo "📁 创建上传目录..."
    mkdir -p uploads
    echo "✅ 上传目录创建完成"
else
    echo "📁 上传目录已存在"
fi

echo ""
echo "🚀 启动 TechVault 服务器..."
echo "服务器将在 http://localhost:3000 启动"
echo "按 Ctrl+C 停止服务器"
echo ""

# 启动服务器
npm start