# Passwerob 个人网站

一个现代前卫的个人网站，采用滑动窗口设计，专为深度学习开发者和研究者打造。

## ✨ 特性

- 🎨 **现代前卫设计** - 滑动窗口界面，渐变色彩，粒子背景效果
- 📱 **完全响应式** - 适配桌面、平板和移动设备
- 🚀 **高性能动画** - 流畅的页面切换和元素动画
- 📚 **深度学习笔记集成** - 支持飞书文档和CSDN博客预览
- 🐙 **GitHub项目展示** - 自动获取并展示GitHub仓库
- 🤝 **友情链接管理** - 便于与朋友网站互联
- ⚙️ **高度可配置** - 通过配置文件轻松定制

## 🌟 页面结构

1. **主页** - 欢迎页面，浮动元素动画
2. **关于** - 个人介绍、技能展示、统计数据
3. **深度学习笔记** - 飞书文档和CSDN博客集成，学习时间线
4. **个人项目** - GitHub API集成，项目筛选功能
5. **联系** - 社交媒体链接，友情链接区域

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd passwerob-website
```

### 2. 配置个人信息

编辑 `js/config.js` 文件，更新以下信息：

```javascript
const WEBSITE_CONFIG = {
    personal: {
        name: '您的姓名',
        title: '您的职业/标题',
        description: '个人描述',
        email: '您的邮箱'
    },
    social: {
        github: {
            username: '您的GitHub用户名',
            url: 'https://github.com/您的用户名'
        },
        csdn: {
            username: '您的CSDN用户名',
            url: 'https://blog.csdn.net/您的用户名'
        }
    },
    // ... 更多配置选项
};
```

### 3. 配置深度学习笔记

在 `js/config.js` 中设置您的笔记链接：

```javascript
notes: {
    feishu: {
        enabled: true,
        documentUrl: '您的飞书文档分享链接',
        // ...
    },
    csdn: {
        enabled: true,
        blogUrl: '您的CSDN博客链接',
        // ...
    }
}
```

### 4. 配置GitHub集成

更新GitHub用户名以自动展示项目：

```javascript
github: {
    username: '您的GitHub用户名',
    apiToken: '', // 可选：提高API限制
    excludeRepos: ['要排除的仓库名'], // 可选
    pinnedRepos: ['置顶的仓库名'] // 可选
}
```

### 5. 启动网站

您可以使用任何静态文件服务器：

```bash
# 使用Python
python -m http.server 8000

# 使用Node.js http-server
npx http-server

# 使用PHP
php -S localhost:8000
```

然后在浏览器中访问 `http://localhost:8000`

## 📁 项目结构

```
passwerob-website/
├── index.html              # 主页面
├── css/
│   ├── styles.css          # 原始样式（已弃用）
│   └── modern-styles.css   # 现代滑动窗口样式
├── js/
│   ├── main.js            # 原始脚本（已弃用）
│   ├── modern-main.js     # 主要JavaScript功能
│   ├── github-api.js      # GitHub API集成
│   ├── particles.js       # 粒子背景效果
│   └── config.js          # 网站配置文件
├── images/                # 图片资源
├── deep-learning/         # 深度学习相关页面
├── github/               # GitHub项目页面
├── leetcode/             # LeetCode笔记页面
└── README.md             # 说明文档
```

## 🎨 自定义主题

### 颜色配置

在 `js/config.js` 中修改主题颜色：

```javascript
theme: {
    primaryColor: '#667eea',     // 主色调
    secondaryColor: '#764ba2',   // 辅助色
    accentColor: '#4facfe',      // 强调色
    darkMode: true,              // 暗色模式
    particlesEnabled: true,      // 粒子效果
    animationsEnabled: true      // 动画效果
}
```

### CSS自定义

主要样式变量定义在 `css/modern-styles.css` 的 `:root` 选择器中：

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    /* ... 更多变量 */
}
```

## 🔧 功能配置

### 深度学习笔记

1. **飞书文档集成**
   - 在飞书中创建文档并获取分享链接
   - 将链接添加到配置文件的 `notes.feishu.documentUrl`
   - 自定义预览内容

2. **CSDN博客集成**
   - 获取您的CSDN博客链接
   - 更新配置文件的 `notes.csdn.blogUrl`
   - 自定义预览内容

### GitHub项目展示

GitHub API会自动获取您的公开仓库。您可以：

- 设置要排除的仓库
- 设置置顶显示的仓库
- 添加GitHub Token以提高API限制
- 控制是否显示私有仓库（需要Token）

### 友情链接

在配置文件中添加友情链接：

```javascript
friendLinks: [
    {
        name: '朋友网站名称',
        description: '网站描述',
        url: 'https://friend-website.com',
        enabled: true // 设置为true来显示
    }
]
```

## 📱 响应式设计

网站针对不同屏幕尺寸进行了优化：

- **桌面端** (>1024px): 完整功能，包括粒子效果和交互动画
- **平板端** (768px-1024px): 简化布局，保留主要功能
- **移动端** (<768px): 精简界面，优化触摸操作

## 🚀 性能优化

- **懒加载** - GitHub项目在切换到对应页面时才加载
- **缓存机制** - GitHub API响应缓存10分钟
- **动画优化** - 使用CSS3硬件加速
- **移动端优化** - 在低性能设备上减少粒子数量
- **可见性API** - 页面隐藏时暂停动画

## 🌍 SEO优化

网站包含完整的SEO配置：

```javascript
seo: {
    title: '页面标题',
    description: '页面描述',
    keywords: '关键词',
    author: '作者',
    ogImage: 'Open Graph图片URL'
}
```

## 🎯 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

不支持IE浏览器。

## 📈 功能扩展

### 添加新页面

1. 在HTML中添加新的slide section
2. 更新导航菜单
3. 在 `modern-main.js` 中添加对应的动画函数
4. 更新slide指示器

### 集成第三方服务

配置文件支持多种第三方服务：

- Google Analytics
- 百度统计
- 评论系统
- RSS订阅

## 🛠️ 故障排除

### GitHub API问题

如果GitHub项目无法加载：

1. 检查网络连接
2. 确认GitHub用户名正确
3. 考虑添加GitHub Token以避免API限制
4. 查看浏览器控制台的错误信息

### 动画性能问题

如果动画卡顿：

1. 在配置文件中禁用粒子效果
2. 关闭动画效果
3. 检查浏览器是否支持硬件加速

### 响应式问题

确保：

1. viewport meta标签正确设置
2. CSS媒体查询正常工作
3. 图片使用响应式尺寸

## 📄 许可证

MIT License - 可自由使用和修改

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📞 联系方式

如有问题，请通过以下方式联系：

- GitHub: [@passwerob](https://github.com/passwerob)
- Email: contact@passwerob.com
- CSDN: [Passwerob](https://blog.csdn.net/passwerob)

---

**享受您的现代个人网站！** 🎉
