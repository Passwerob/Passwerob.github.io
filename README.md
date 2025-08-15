# TechVault - 未来文件管理平台

<div align="center">

![TechVault Logo](https://img.shields.io/badge/TechVault-未来文件管理-00f5ff?style=for-the-badge)

[![Node.js](https://img.shields.io/badge/Node.js->=16.0.0-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**一个采用前沿技术构建的现代化文件管理平台**

</div>

## 🚀 项目简介

TechVault 是一个科技前卫的文件管理平台，专注于提供简洁、高效、美观的用户体验。采用现代化的UI设计和先进的前后端技术，为用户提供完整的文件管理解决方案。

### ✨ 核心特性

- 🎨 **科技前卫设计** - 毛玻璃效果、霓虹灯光、Glitch动画
- 📱 **响应式布局** - 完美适配桌面、平板、手机设备
- 🚀 **拖拽上传** - 支持文件拖拽上传，操作简单直观
- 🔍 **智能搜索** - 实时搜索文件，支持类型过滤
- 📊 **统计面板** - 实时显示文件数量、存储大小等统计信息
- ⚡ **高性能** - 采用现代化技术栈，确保流畅体验
- 🔒 **安全可靠** - 文件类型验证、大小限制、错误处理

### 🛠️ 技术栈

**前端技术:**
- HTML5 + CSS3 + JavaScript ES6+
- CSS Grid + Flexbox 布局
- CSS动画和过渡效果
- Font Awesome 图标库
- Google Fonts 字体

**后端技术:**
- Node.js + Express.js
- Multer 文件上传中间件
- CORS 跨域支持
- Helmet 安全防护
- Compression 压缩中间件

## 📦 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yourusername/techvault.git
cd techvault
```

2. **安装依赖**
```bash
npm run setup
```

3. **启动服务器**
```bash
# 开发模式（推荐）
npm run dev

# 生产模式
npm start
```

4. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 🎯 功能介绍

### 📁 文件管理

- **文件上传**: 支持拖拽上传和点击选择上传
- **文件删除**: 单个删除和批量删除
- **文件下载**: 一键下载文件到本地
- **文件预览**: 查看文件详细信息和元数据

### 🔍 搜索与过滤

- **实时搜索**: 根据文件名即时搜索
- **类型过滤**: 按图片、文档、视频、代码等分类
- **视图切换**: 网格视图和列表视图自由切换

### 📊 数据统计

- **文件总数**: 实时显示已上传文件数量
- **存储空间**: 显示总占用空间大小
- **今日上传**: 统计当日上传文件数量

## 🎨 UI/UX 特性

### 视觉设计
- **霓虹色彩**: 青色、紫色、粉色的科技配色方案
- **毛玻璃效果**: 现代化的半透明背景效果
- **Glitch动画**: 标题文字故障艺术效果
- **浮动元素**: 3D立方体和网格背景动画

### 交互体验
- **平滑过渡**: 所有交互都有流畅的动画效果
- **响应式反馈**: 按钮悬停、点击等状态变化
- **通知系统**: 操作成功/失败的即时反馈
- **加载状态**: 操作进行中的可视化反馈

## 🔧 API 接口

### 文件操作

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/files` | 获取文件列表 |
| POST | `/api/upload` | 上传文件 |
| GET | `/api/download/:filename` | 下载文件 |
| DELETE | `/api/files/:filename` | 删除文件 |
| GET | `/api/files/:filename/info` | 获取文件信息 |

### 统计信息

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/stats` | 获取存储统计 |
| GET | `/api/health` | 健康检查 |

## 📋 配置说明

### 服务器配置

```javascript
const PORT = process.env.PORT || 3000;  // 服务器端口
const uploadDir = './uploads';          // 上传目录
const maxFileSize = 100 * 1024 * 1024;  // 最大文件大小 (100MB)
const maxFiles = 10;                    // 最大文件数量
```

### 支持的文件类型

- **图片**: jpg, jpeg, png, gif, webp, svg, bmp
- **文档**: pdf, doc, docx, txt, rtf, xls, xlsx, ppt, pptx
- **视频**: mp4, avi, mov, wmv, flv, webm, mkv
- **音频**: mp3, wav, flac, aac, ogg, m4a
- **代码**: js, html, css, py, java, cpp, c, php, json, xml
- **压缩包**: zip, rar, 7z, tar, gz

## 🚀 部署指南

### 本地部署

```bash
# 安装依赖
npm install

# 启动服务
npm start
```

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### 云平台部署

支持部署到各大云平台：
- **Heroku**: 添加 Procfile
- **Vercel**: 配置 vercel.json
- **Railway**: 直接连接 GitHub 仓库
- **Render**: 使用 Docker 镜像部署

## 🔒 安全特性

- **文件类型验证**: 严格限制允许上传的文件类型
- **文件大小限制**: 防止过大文件占用存储空间
- **CORS 配置**: 跨域请求安全控制
- **Helmet 防护**: HTTP 头部安全防护
- **错误处理**: 完善的错误捕获和处理机制

## 🛠️ 开发指南

### 项目结构

```
techvault/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 前端脚本
├── server.js           # 后端服务器
├── package.json        # 依赖配置
├── README.md           # 项目说明
└── uploads/            # 文件上传目录
```

### 开发命令

```bash
npm run dev       # 开发模式（自动重启）
npm start         # 生产模式
npm run setup     # 项目初始化
```

### 代码规范

- 使用 ES6+ 语法
- 采用模块化设计
- 注释完整清晰
- 错误处理完善

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Font Awesome](https://fontawesome.com/) - 图标库
- [Google Fonts](https://fonts.google.com/) - 字体服务
- [Express.js](https://expressjs.com/) - Web 框架
- [Multer](https://github.com/expressjs/multer) - 文件上传中间件

## 📞 联系方式

- 项目主页: [https://github.com/yourusername/techvault](https://github.com/yourusername/techvault)
- 问题反馈: [Issues](https://github.com/yourusername/techvault/issues)
- 邮箱: your.email@example.com

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给它一个星标！⭐**

Made with ❤️ by TechVault Team

</div>
