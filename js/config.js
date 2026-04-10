// 网站配置文件 - 请根据您的个人信息进行修改

const WEBSITE_CONFIG = {
    // 个人信息
    personal: {
        name: 'Yingtao Li',
        title: 'Undergraduate Student | Dalian University of Technology',
        description: 'Interested in Deep Learning, Computer Vision & 3D Reconstruction',
        email: 'yingtaoli38@gmail.com',
        location: 'Dalian, China',
        avatar: '',
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
                '• AE（自编码器）',
                '• VAE（变分自编码器）',
                '• Generation（生成模型）'
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
    
    skills: [
        'Python', 'C/C++', 'MATLAB', 'LaTeX',
        'PyTorch', 'Hydra', 'Accelerate', 'DDP/FSDP',
        'Transformer', 'Cross-Attention', '3D Gaussian Splatting',
        'Linux', 'Git/GitHub', 'tmux'
    ],
    
    stats: {
        papers: '2',
        projects: '5+',
        gpa: '3.9/5.0',
        rank: '11/312'
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
            name: 'kiiye9697',
            description: '一个计算机图形学朋友的博客网站',
            url: 'https://kiiye9697.cn/',
            avatar: '', // 可选：朋友网站logo
            enabled: true // 设置为true来显示
        }
    ],
    
    // 网站主题配置
    theme: {
        primaryColor: '#1a365d',
        secondaryColor: '#2c5282',
        accentColor: '#b7312c',
        darkMode: false,
        particlesEnabled: false,
        animationsEnabled: true
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
        title: 'Yingtao Li - DUT | Deep Learning & Computer Vision',
        description: 'Personal academic page of Yingtao Li (李英韬), undergraduate at Dalian University of Technology. Research interests: deep learning, computer vision, 3D reconstruction.',
        keywords: 'Yingtao Li,李英韬,Deep Learning,Computer Vision,3D Gaussian Splatting,DUT,大连理工大学,PyTorch',
        author: 'Yingtao Li',
        ogImage: '',
        favicon: ''
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
    const { name } = WEBSITE_CONFIG.personal;
    
    const logoElement = document.querySelector('.logo-text');
    if (logoElement) {
        logoElement.textContent = name;
    }
}

function updateSocialLinks() {
    // 更新联系信息
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        const icon = item.querySelector('i');
        const link = item.querySelector('a');
        
        if (icon.classList.contains('fa-github') && link) {
            if (WEBSITE_CONFIG.social.github.url) {
                link.href = WEBSITE_CONFIG.social.github.url;
                link.textContent = `@${WEBSITE_CONFIG.social.github.username}`;
            }
        } else if (icon.classList.contains('fa-envelope') && link) {
            if (WEBSITE_CONFIG.social.email.url) {
                link.href = WEBSITE_CONFIG.social.email.url;
                link.textContent = WEBSITE_CONFIG.social.email.address;
            }
        } else if (icon.classList.contains('fa-blog') && link) {
            if (WEBSITE_CONFIG.social.csdn.url) {
                link.href = WEBSITE_CONFIG.social.csdn.url;
                link.textContent = WEBSITE_CONFIG.social.csdn.username;
            }
        }
    });
    
    // 更新位置信息（如果页面上有显示的话）
    const locationElements = document.querySelectorAll('.location-info, .personal-location');
    locationElements.forEach(element => {
        if (WEBSITE_CONFIG.personal.location) {
            element.textContent = WEBSITE_CONFIG.personal.location;
        }
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
