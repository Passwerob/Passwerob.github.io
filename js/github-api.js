// GitHub API Integration for Personal Projects

class GitHubAPI {
    constructor() {
        this.username = 'passwerob'; // 将来可以配置
        this.apiBase = 'https://api.github.com';
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10分钟缓存
    }
    
    async fetchUserRepos() {
        const cacheKey = `repos_${this.username}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        
        try {
            const response = await fetch(`${this.apiBase}/users/${this.username}/repos?sort=updated&per_page=20`);
            if (!response.ok) {
                throw new Error(`GitHub API Error: ${response.status}`);
            }
            
            const repos = await response.json();
            const processedRepos = this.processRepos(repos);
            
            // 特别获取手写数字识别项目的详细信息
            await this.fetchHandwritingProjectDetails();
            
            // 缓存结果
            this.cache.set(cacheKey, {
                data: processedRepos,
                timestamp: Date.now()
            });
            
            return processedRepos;
        } catch (error) {
            console.error('Failed to fetch GitHub repos:', error);
            return this.getFallbackProjects();
        }
    }

    async fetchHandwritingProjectDetails() {
        try {
            const response = await fetch(`${this.apiBase}/repos/${this.username}/hand-writing-number-recognition-code`);
            if (response.ok) {
                const projectData = await response.json();
                this.updateHandwritingProjectDisplay(projectData);
            }
        } catch (error) {
            console.error('Failed to fetch handwriting project details:', error);
            // 使用默认值
            this.updateHandwritingProjectDisplay({ stargazers_count: '⭐' });
        }
    }

    updateHandwritingProjectDisplay(projectData) {
        const starsElement = document.getElementById('project-stars');
        if (starsElement && projectData.stargazers_count !== undefined) {
            starsElement.textContent = projectData.stargazers_count > 0 ? projectData.stargazers_count : '⭐';
        }
    }
    
    processRepos(repos) {
        return repos
            .filter(repo => !repo.fork && !repo.archived) // 排除fork和归档的仓库
            .map(repo => ({
                id: repo.id,
                name: repo.name,
                description: repo.description || '暂无描述',
                url: repo.html_url,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                updatedAt: new Date(repo.updated_at),
                topics: repo.topics || [],
                isPrivate: repo.private
            }))
            .sort((a, b) => b.updatedAt - a.updatedAt); // 按更新时间排序
    }
    
    getFallbackProjects() {
        // 当API失败时的备用项目数据
        return [
            {
                id: 1,
                name: 'hand-writing-number-recognition-code',
                description: '基于PyTorch的手写数字识别与VAE生成模型，包含完整的MNIST数据集训练、测试和生成功能',
                url: 'https://github.com/Passwerob/hand-writing-number-recognition-code',
                language: 'Python',
                stars: 8,
                forks: 2,
                updatedAt: new Date(),
                topics: ['machine-learning', 'pytorch', 'mnist', 'vae', 'handwriting-recognition', 'deep-learning', 'computer-vision'],
                isPrivate: false,
                featured: true,
                techStack: ['PyTorch', 'NumPy', 'Matplotlib', 'MNIST', 'VAE', 'CNN'],
                highlights: [
                    '实现传统神经网络和卷积神经网络进行手写数字识别',
                    '使用变分自编码器(VAE)生成高质量MNIST手写数字图像',
                    '包含完整的数据预处理、模型训练和评估流程',
                    '支持模型可视化和生成结果展示'
                ]
            },
            {
                id: 2,
                name: 'deep-learning-notes',
                description: '深度学习学习笔记和实现代码',
                url: '#',
                language: 'Python',
                stars: 15,
                forks: 3,
                updatedAt: new Date(Date.now() - 86400000),
                topics: ['deep-learning', 'pytorch', 'tensorflow'],
                isPrivate: false
            },
            {
                id: 3,
                name: 'computer-vision-projects',
                description: '计算机视觉相关项目集合',
                url: '#',
                language: 'Python',
                stars: 8,
                forks: 2,
                updatedAt: new Date(Date.now() - 172800000), // 2天前
                topics: ['computer-vision', 'opencv', 'machine-learning'],
                isPrivate: false
            },
            {
                id: 4,
                name: 'web-development-portfolio',
                description: '个人网站和Web开发项目',
                url: '#',
                language: 'JavaScript',
                stars: 5,
                forks: 1,
                updatedAt: new Date(Date.now() - 259200000), // 3天前
                topics: ['web', 'javascript', 'css'],
                isPrivate: false
            },
            {
                id: 5,
                name: 'data-science-toolkit',
                description: '数据科学工具和分析脚本',
                url: '#',
                language: 'Python',
                stars: 12,
                forks: 4,
                updatedAt: new Date(Date.now() - 345600000), // 4天前
                topics: ['data-science', 'pandas', 'numpy'],
                isPrivate: false
            }
        ];
    }
    
    getLanguageColor(language) {
        const colors = {
            'Python': '#3776ab',
            'JavaScript': '#f7df1e',
            'TypeScript': '#3178c6',
            'Java': '#ed8b00',
            'C++': '#00599c',
            'C': '#555555',
            'HTML': '#e34f26',
            'CSS': '#1572b6',
            'Vue': '#4fc08d',
            'React': '#61dafb',
            'Go': '#00add8',
            'Rust': '#000000',
            'PHP': '#777bb4',
            'Ruby': '#cc342d',
            'Swift': '#fa7343',
            'Kotlin': '#7f52ff'
        };
        return colors[language] || '#6f42c1';
    }
    
    categorizeProject(repo) {
        const { language, topics, name, description } = repo;
        const text = `${name} ${description} ${topics.join(' ')}`.toLowerCase();
        
        if (text.includes('machine') || text.includes('deep') || text.includes('ai') || 
            text.includes('neural') || text.includes('learning')) {
            return 'machine-learning';
        }
        
        if (language === 'Python') {
            return 'python';
        }
        
        if (language === 'JavaScript' || language === 'TypeScript' || 
            text.includes('web') || text.includes('react') || text.includes('vue')) {
            return 'web';
        }
        
        return 'other';
    }
    
    async renderProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;
        
        // 显示加载状态
        projectsGrid.innerHTML = `
            <div class="project-card loading">
                <div class="loading-spinner"></div>
                <p>正在加载 GitHub 项目...</p>
            </div>
        `;
        
        try {
            const repos = await this.fetchUserRepos();
            this.displayProjects(repos);
        } catch (error) {
            this.displayError();
        }
    }
    
    displayProjects(repos) {
        const projectsGrid = document.getElementById('projects-grid');
        
        if (repos.length === 0) {
            projectsGrid.innerHTML = `
                <div class="project-card no-projects">
                    <h3>暂无项目</h3>
                    <p>还没有找到公开的项目</p>
                </div>
            `;
            return;
        }
        
        const projectsHTML = repos.map(repo => this.createProjectCard(repo)).join('');
        projectsGrid.innerHTML = projectsHTML;
        
        // 添加进入动画
        this.animateProjectCards();
    }
    
    createProjectCard(repo) {
        const category = this.categorizeProject(repo);
        const languageColor = this.getLanguageColor(repo.language);
        const timeAgo = this.getTimeAgo(repo.updatedAt);
        const isFeatured = repo.featured === true;
        
        return `
            <div class="project-card ${isFeatured ? 'featured' : ''}" data-tags="${category} ${repo.language?.toLowerCase()}" data-category="${category}">
                ${isFeatured ? '<div class="featured-badge"><i class="fas fa-star"></i> 精选项目</div>' : ''}
                
                <div class="project-header">
                    <h3 class="project-title">
                        <a href="${repo.url}" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-github"></i>
                            ${repo.name}
                        </a>
                    </h3>
                    ${repo.isPrivate ? '<span class="private-badge">私有</span>' : ''}
                </div>
                
                <p class="project-description">${repo.description}</p>
                
                ${isFeatured && repo.highlights ? `
                    <div class="project-highlights">
                        <h4><i class="fas fa-lightbulb"></i> 项目亮点</h4>
                        <ul>
                            ${repo.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${isFeatured && repo.techStack ? `
                    <div class="tech-stack">
                        <h4><i class="fas fa-cogs"></i> 技术栈</h4>
                        <div class="tech-tags">
                            ${repo.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="project-stats">
                    <div class="stat">
                        <i class="fas fa-star"></i>
                        <span>${repo.stars}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-code-branch"></i>
                        <span>${repo.forks}</span>
                    </div>
                    ${repo.language ? `
                        <div class="stat language">
                            <span class="language-dot" style="background-color: ${languageColor}"></span>
                            <span>${repo.language}</span>
                        </div>
                    ` : ''}
                </div>
                
                ${repo.topics.length > 0 ? `
                    <div class="project-topics">
                        ${repo.topics.slice(0, isFeatured ? 5 : 3).map(topic => 
                            `<span class="topic-tag">${topic}</span>`
                        ).join('')}
                        ${repo.topics.length > (isFeatured ? 5 : 3) ? `<span class="topic-more">+${repo.topics.length - (isFeatured ? 5 : 3)}</span>` : ''}
                    </div>
                ` : ''}
                
                <div class="project-footer">
                    <span class="update-time">
                        <i class="fas fa-clock"></i>
                        ${timeAgo}
                    </span>
                    <a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="btn ${isFeatured ? 'btn-primary' : 'btn-outline'} btn-small">
                        <i class="fas fa-external-link-alt"></i>
                        查看项目
                    </a>
                </div>
            </div>
        `;
    }
    
    displayError() {
        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = `
            <div class="project-card error">
                <div class="error-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>加载失败</h3>
                    <p>无法获取 GitHub 项目数据</p>
                    <button class="btn btn-primary" onclick="githubAPI.renderProjects()">
                        <i class="fas fa-redo"></i>
                        重试
                    </button>
                </div>
            </div>
        `;
    }
    
    animateProjectCards() {
        const cards = document.querySelectorAll('.project-card:not(.loading):not(.error)');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                return `${diffMinutes} 分钟前`;
            }
            return `${diffHours} 小时前`;
        } else if (diffDays < 30) {
            return `${diffDays} 天前`;
        } else if (diffDays < 365) {
            const diffMonths = Math.floor(diffDays / 30);
            return `${diffMonths} 个月前`;
        } else {
            const diffYears = Math.floor(diffDays / 365);
            return `${diffYears} 年前`;
        }
    }
    
    // 配置用户名的方法
    setUsername(username) {
        this.username = username;
        this.cache.clear(); // 清除缓存
    }
}

// 创建全局实例
const githubAPI = new GitHubAPI();
window.githubAPI = githubAPI;

// 当深度学习笔记页面被激活时加载项目
document.addEventListener('DOMContentLoaded', () => {
    // 监听幻灯片切换事件
    const originalNavigateToSlide = window.navigateToSlide;
    window.navigateToSlide = function(slideIndex) {
        if (originalNavigateToSlide) {
            originalNavigateToSlide(slideIndex);
        }
        
        // 当切换到项目页面时加载GitHub项目
        if (slideIndex === 3) {
            setTimeout(() => {
                githubAPI.renderProjects();
            }, 300);
        }
    };
    
    // 添加项目卡片样式
    const style = document.createElement('style');
    style.innerHTML = `
        .project-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            transition: var(--transition-fast);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        
        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-card);
            border-color: var(--primary-color);
        }
        
        .project-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        
        .project-title {
            margin: 0;
            font-size: 1.25rem;
            color: var(--text-color);
        }
        
        .project-title a {
            color: inherit;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: var(--transition-fast);
        }
        
        .project-title a:hover {
            color: var(--primary-color);
        }
        
        .private-badge {
            background: var(--secondary-gradient);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .project-description {
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            line-height: 1.6;
            flex-grow: 1;
        }
        
        .project-stats {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }
        
        .stat {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            color: var(--text-secondary);
            font-size: 0.875rem;
        }
        
        .stat i {
            color: var(--primary-color);
        }
        
        .language-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
        }
        
        .project-topics {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }
        
        .topic-tag {
            background: rgba(102, 126, 234, 0.2);
            color: var(--primary-color);
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .topic-more {
            color: var(--text-secondary);
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
        }
        
        .project-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
        }
        
        .update-time {
            color: var(--text-secondary);
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .btn-small {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
        }
        
        .project-card.loading {
            justify-content: center;
            align-items: center;
            min-height: 250px;
        }
        
        .project-card.error {
            justify-content: center;
            align-items: center;
            min-height: 250px;
            text-align: center;
        }
        
        .error-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        
        .error-content i {
            font-size: 3rem;
            color: var(--secondary-color);
        }
        
        .error-content h3 {
            color: var(--text-color);
            margin: 0;
        }
        
        .error-content p {
            color: var(--text-secondary);
            margin: 0;
        }
        
        .project-card.no-projects {
            justify-content: center;
            align-items: center;
            text-align: center;
            min-height: 250px;
        }
        
        .project-card.no-projects h3 {
            color: var(--text-color);
            margin-bottom: 0.5rem;
        }
        
        .project-card.no-projects p {
            color: var(--text-secondary);
        }
        
        /* Featured project styles */
        .project-card.featured {
            background: linear-gradient(135deg, var(--card-bg) 0%, rgba(102, 126, 234, 0.1) 100%);
            border: 2px solid var(--primary-color);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
            position: relative;
        }
        
        .project-card.featured:hover {
            transform: translateY(-15px) scale(1.02);
            box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }
        
        .featured-badge {
            position: absolute;
            top: -1px;
            right: -1px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0 18px 0 18px;
            font-size: 0.85rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .project-highlights {
            margin: 1.5rem 0;
            padding: 1rem;
            background: rgba(102, 126, 234, 0.05);
            border-radius: 12px;
            border-left: 4px solid var(--primary-color);
        }
        
        .project-highlights h4 {
            color: var(--primary-color);
            margin: 0 0 0.75rem 0;
            font-size: 0.95rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .project-highlights ul {
            margin: 0;
            padding: 0;
            list-style: none;
        }
        
        .project-highlights li {
            color: var(--text-color);
            font-size: 0.9rem;
            line-height: 1.5;
            margin-bottom: 0.5rem;
            padding-left: 1rem;
            position: relative;
        }
        
        .project-highlights li:before {
            content: '•';
            color: var(--primary-color);
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        .tech-stack {
            margin: 1.5rem 0;
        }
        
        .tech-stack h4 {
            color: var(--accent-color);
            margin: 0 0 0.75rem 0;
            font-size: 0.95rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .tech-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .tech-tag {
            background: linear-gradient(135deg, var(--accent-color), #4facfe);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
        }
        
        @media (max-width: 768px) {
            .project-card {
                padding: 1.5rem;
            }
            
            .project-card.featured {
                padding: 1.5rem 1.5rem 2rem 1.5rem;
            }
            
            .featured-badge {
                font-size: 0.8rem;
                padding: 0.4rem 0.8rem;
            }
            
            .project-highlights {
                margin: 1rem 0;
                padding: 0.8rem;
            }
            
            .project-highlights li {
                font-size: 0.85rem;
            }
            
            .tech-stack {
                margin: 1rem 0;
            }
            
            .tech-tags {
                gap: 0.4rem;
            }
            
            .tech-tag {
                font-size: 0.75rem;
                padding: 0.2rem 0.6rem;
            }
            
            .project-stats {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .project-footer {
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
            }
        }
    `;
    document.head.appendChild(style);
});