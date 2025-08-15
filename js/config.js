// 网站配置文件 - 请根据您的个人信息进行修改

const WEBSITE_CONFIG = {
    // 个人信息
    personal: {
        name: 'Passwerob',
        title: '深度学习与人工智能学习者',
        description: '一个专注于深度学习的个人空间',
        email: 'yingtaoli38@gmail.com',
        location: '中国~大连',
        avatar: '', // 可以添加头像图片URL
    },
    
    // 社交媒体链接
    social: {
        github: {
            username: 'Passwerob', // 替换为您的GitHub用户名
            url: 'https://github.com/passwerob'
        },
        csdn: {
            username: 'Passwerob', // 替换为您的CSDN用户名
            url: 'https://blog.csdn.net/2401_86810419?spm=1000.2115.3001.5343'
        },
        email: {
            address: 'yingtaoli38@gmail.com',
            url: 'mailto:yingtaoli38@gmail.com'
        },
        linkedin: {
            username: '', // 可选：LinkedIn用户名
            url: ''
        },
        twitter: {
            username: '', // 可选：Twitter用户名
            url: ''
        },
        wechat: {
            qrcode: '', // 可选：微信二维码图片URL
            name: ''
        }
    },
    
    // 深度学习笔记配置
    notes: {
        feishu: {
            enabled: true,
            documentUrl: 'https://ccncszsi2pdq.feishu.cn/wiki/XEl4wLYHGiwH40kgb1ycEIzmnDg?from=from_copylink', // 请添加您的飞书文档分享链接
            title: '3D Gaussian Splatting',
            description: '详细的3DGS理论笔记入门理解',
            previewContent: [
                '• 3DGS',
                '• 计算机图形学',
                '• NeRF',
                '• 三维重建',
                '• 深度学习'
            ]
        },
        csdn: {
            enabled: true,
            blogUrl: 'https://blog.csdn.net/2401_86810419/article/details/149483782?spm=1001.2014.3001.5501', // 请添加您的CSDN博客链接
            title: 'CSDN 技术博客',
            description: '技术文章和项目分享',
            previewContent: [
                '• AE',
                '• VAE'
                '• Generation'
            ]
        }
    },
    
    // GitHub项目配置
    github: {
        username: 'passwerob', // GitHub用户名，用于API调用
        excludeRepos: [], // 要排除的仓库名称列表
        pinnedRepos: [], // 置顶的仓库名称列表（优先显示）
        showPrivateRepos: false, // 是否显示私有仓库（需要token）
        apiToken: '' // 可选：GitHub API token（用于访问私有仓库或提高API限制）
    },
    
    // 技能标签
    skills: [
        'Python',
        'TensorFlow',
        'PyTorch',
        '深度学习',
        '计算机视觉',
        '自然语言处理',
        '机器学习',
        '数据科学',
        'JavaScript',
        'Web开发',
        'React',
        'Vue.js',
        'Node.js'
    ],
    
    // 统计数据
    stats: {
        notes: '20+',
        projects: '5+',
        experience: '1年+',
        publications: 'will be increasing' // 可选：发表文章数
    },
    
    // 学习进度时间线
    timeline: [
        {
            title: '神经网络基础',
            description: '完成基础理论学习',
            completed: true
        },
        {
            title: '卷积神经网络',
            description: 'CNN结构与应用',
            completed: true
        },
        {
            title: '循环神经网络',
            description: 'RNN、LSTM、GRU',
            completed: true
        },
        {
            title: 'Transformer',
            description: '注意力机制与现代NLP',
            completed: false
        },
        {
            title: '强化学习',
            description: 'DQN、Policy Gradient',
            completed: false
        }
    ],
    
    // 友情链接
    friendLinks: [
        // 示例友情链接，请根据实际情况修改
        {
            name: '友情网站',
            description: '网站描述',
            url: 'https://kiiye9697.cn/',
            avatar: '', // 可选：朋友网站logo
            enabled: false // 设置为true来显示
        },
        {
            name: '朋友网站2',
            description: '网站描述',
            url: '#',
            avatar: '',
            enabled: false
        }
    ],
    
    // 网站主题配置
    theme: {
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        accentColor: '#4facfe',
        darkMode: true, // 是否默认使用暗色模式
        particlesEnabled: true, // 是否启用粒子背景效果
        animationsEnabled: true // 是否启用动画效果
    },
    
    // 页面配置
    pages: {
        home: {
            showTypingEffect: true, // 首页标题打字效果
            showFloatingElements: true // 浮动元素动画
        },
        about: {
            showStats: true,
            showSkills: true
        },
        notes: {
            showTimeline: true,
            showPreview: true
        },
        projects: {
            showFilters: true,
            projectsPerPage: 12
        },
        contact: {
            showFriendLinks: true,
            enableContactForm: false // 是否启用联系表单
        }
    },
    
    // SEO配置
    seo: {
        title: 'Passwerob - 深度学习与AI开发者',
        description: 'Passwerob的个人网站，专注于深度学习、机器学习和人工智能技术分享',
        keywords: '深度学习,机器学习,人工智能,PyTorch,TensorFlow,Python,Passwerob',
        author: 'Passwerob',
        ogImage: '', // Open Graph图片URL
        favicon: '' // 网站图标URL
    },
    
    // 网站功能开关
    features: {
        googleAnalytics: '', // Google Analytics ID
        baiduTongji: '', // 百度统计ID
        enableComments: false, // 是否启用评论系统
        enableSearch: false, // 是否启用搜索功能
        enableRSS: false, // 是否启用RSS订阅
        enablePWA: false, // 是否启用PWA功能
        enableI18n: false // 是否启用多语言支持
    }
};

// 应用配置到网站
function applyConfig() {
    // 更新页面标题
    document.title = WEBSITE_CONFIG.seo.title;
    
    // 更新meta标签
    updateMetaTags();
    
    // 更新个人信息
    updatePersonalInfo();
    
    // 更新社交链接
    updateSocialLinks();
    
    // 更新GitHub配置
    updateGitHubConfig();
    
    // 更新技能标签
    updateSkills();
    
    // 更新统计数据
    updateStats();
    
    // 更新时间线
    updateTimeline();
    
    // 更新友情链接
    updateFriendLinks();
    
    // 应用主题配置
    applyThemeConfig();
}

function updateMetaTags() {
    const { description, keywords, author } = WEBSITE_CONFIG.seo;
    
    // 更新或创建meta标签
    updateOrCreateMeta('description', description);
    updateOrCreateMeta('keywords', keywords);
    updateOrCreateMeta('author', author);
}

function updateOrCreateMeta(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
    }
    meta.content = content;
}

function updatePersonalInfo() {
    const { name, title, description } = WEBSITE_CONFIG.personal;
    
    // 更新logo
    const logoElement = document.querySelector('.logo-text');
    if (logoElement) {
        logoElement.textContent = name;
    }
    
    // 更新主页标题
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.innerHTML = `
            <span class="title-line">欢迎来到</span>
            <span class="title-line highlight">${name}</span>
            <span class="title-line">的世界</span>
        `;
    }
    
    // 更新副标题
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.textContent = description;
    }
}

function updateSocialLinks() {
    // 更新联系信息
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        const icon = item.querySelector('i');
        if (icon.classList.contains('fa-github')) {
            const link = item.querySelector('a');
            if (link && WEBSITE_CONFIG.social.github.url) {
                link.href = WEBSITE_CONFIG.social.github.url;
                link.textContent = `@${WEBSITE_CONFIG.social.github.username}`;
            }
        }
        // 其他社交链接的更新...
    });
}

function updateGitHubConfig() {
    if (window.githubAPI) {
        githubAPI.setUsername(WEBSITE_CONFIG.github.username);
    }
}

function updateSkills() {
    const skillsCloud = document.querySelector('.skills-cloud');
    if (skillsCloud && WEBSITE_CONFIG.skills.length > 0) {
        skillsCloud.innerHTML = WEBSITE_CONFIG.skills
            .map(skill => `<span class="skill-tag">${skill}</span>`)
            .join('');
    }
}

function updateStats() {
    const stats = document.querySelectorAll('.stat-item');
    const statsData = Object.values(WEBSITE_CONFIG.stats);
    
    stats.forEach((stat, index) => {
        if (statsData[index]) {
            const numberElement = stat.querySelector('.stat-number');
            if (numberElement) {
                numberElement.textContent = statsData[index];
            }
        }
    });
}

function updateTimeline() {
    const timeline = document.querySelector('.timeline');
    if (timeline && WEBSITE_CONFIG.timeline.length > 0) {
        timeline.innerHTML = WEBSITE_CONFIG.timeline
            .map(item => `
                <div class="timeline-item ${item.completed ? 'completed' : ''}">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                    </div>
                </div>
            `)
            .join('');
    }
}

function updateFriendLinks() {
    const friendsGrid = document.getElementById('friends-grid');
    const enabledLinks = WEBSITE_CONFIG.friendLinks.filter(link => link.enabled);
    
    if (friendsGrid && enabledLinks.length > 0) {
        const linksHTML = enabledLinks
            .map(link => `
                <div class="friend-link">
                    <div class="friend-link-item">
                        <h4>${link.name}</h4>
                        <p>${link.description}</p>
                        <a href="${link.url}" target="_blank">访问网站</a>
                    </div>
                </div>
            `)
            .join('');
        
        friendsGrid.innerHTML = linksHTML + friendsGrid.innerHTML;
    }
}

function applyThemeConfig() {
    const { theme } = WEBSITE_CONFIG;
    
    // 应用自定义颜色
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    
    // 控制粒子效果
    if (!theme.particlesEnabled) {
        const particlesContainer = document.getElementById('particles');
        if (particlesContainer) {
            particlesContainer.style.display = 'none';
        }
    }
    
    // 控制动画效果
    if (!theme.animationsEnabled) {
        document.body.classList.add('no-animations');
    }
}

// 在页面加载时应用配置
document.addEventListener('DOMContentLoaded', () => {
    applyConfig();
});

// 导出配置对象供其他脚本使用
window.WEBSITE_CONFIG = WEBSITE_CONFIG;
