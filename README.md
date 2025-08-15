# Passwerob 个人网站

个人网站，采用滑动窗口设计

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
