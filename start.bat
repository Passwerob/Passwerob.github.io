@echo off
chcp 65001 >nul
title TechVault 启动脚本

echo =================================
echo     TechVault 启动脚本
echo =================================

:: 检查 Node.js 是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js
    echo 请先安装 Node.js (版本 ^>= 16.0.0^)
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: 检查 npm 是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 npm
    echo 请先安装 npm
    pause
    exit /b 1
)

:: 显示版本信息
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%
echo ✅ npm 版本: %NPM_VERSION%
echo.

:: 检查是否已安装依赖
if not exist "node_modules" (
    echo 📦 正在安装项目依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo 📦 依赖已安装，跳过安装步骤
)

:: 创建上传目录
if not exist "uploads" (
    echo 📁 创建上传目录...
    mkdir uploads
    echo ✅ 上传目录创建完成
) else (
    echo 📁 上传目录已存在
)

echo.
echo 🚀 启动 TechVault 服务器...
echo 服务器将在 http://localhost:3000 启动
echo 按 Ctrl+C 停止服务器
echo.

:: 启动服务器
npm start

pause