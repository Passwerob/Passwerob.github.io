// Modern Sliding Website Main JavaScript

class ModernWebsite {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.slide').length;
        this.isScrolling = false;
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupSlideIndicators();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
        this.startAnimations();
        this.handleResize();
        this.setupDeepLinking();
    }
    
    setupEventListeners() {
        // 滚轮事件
        window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        
        // 导航链接点击
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = parseInt(link.dataset.section);
                this.navigateToSlide(section);
            });
        });
        
        // 移动端菜单
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }
        
        // 窗口调整大小
        window.addEventListener('resize', () => this.handleResize());
        
        // 阻止在输入框等可编辑元素上触发全屏切换
        document.addEventListener('wheel', (e) => {
            const target = e.target;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
                e.stopPropagation();
            }
        }, { passive: false, capture: true });
    }
    
    setupNavigation() {
        // 更新活跃导航项
        this.updateActiveNavigation();
    }
    
    setupSlideIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.navigateToSlide(index);
            });
        });
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isScrolling) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowDown':
                case 'PageDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.navigateToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.navigateToSlide(this.totalSlides - 1);
                    break;
            }
        });
    }
    
    setupTouchNavigation() {
        const container = document.getElementById('slider-container');
        
        container.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].clientY;
            this.handleTouch();
        }, { passive: true });
    }
    
    handleWheel(e) {
        const activeSlide = document.querySelectorAll('.slide')[this.currentSlide];
        if (!activeSlide) return;

        // 忽略缩放手势
        if (e.ctrlKey) return;

        if (this.isScrolling) {
            e.preventDefault();
            return;
        }

        const isScrollable = this.isElementScrollable(activeSlide);
        const scrollingDown = e.deltaY > 0;

        if (isScrollable) {
            const atTop = this.isAtTop(activeSlide);
            const atBottom = this.isAtBottom(activeSlide);

            if (scrollingDown && !atBottom) {
                e.preventDefault();
                this.scrollElement(activeSlide, e.deltaY);
                return;
            } else if (!scrollingDown && !atTop) {
                e.preventDefault();
                this.scrollElement(activeSlide, e.deltaY);
                return;
            }
        }

        e.preventDefault();
        if (scrollingDown) {
            this.nextSlide();
        } else {
            this.previousSlide();
        }
    }
    
    handleTouch() {
        const touchDiff = this.touchStartY - this.touchEndY;
        const minSwipeDistance = 50;
        
        if (Math.abs(touchDiff) < minSwipeDistance) return;
        
        const activeSlide = document.querySelectorAll('.slide')[this.currentSlide];
        const isScrollable = this.isElementScrollable(activeSlide);
        const swipingDown = touchDiff > 0; // 手指向上滑动，页面向下滚动

        if (isScrollable) {
            const atTop = this.isAtTop(activeSlide);
            const atBottom = this.isAtBottom(activeSlide);

            if (swipingDown && !atBottom) {
                return; // 交给原生滚动
            } else if (!swipingDown && !atTop) {
                return; // 交给原生滚动
            }
        }
        
        if (swipingDown) {
            this.nextSlide();
        } else {
            this.previousSlide();
        }
    }

    // 判断元素是否可滚动
    isElementScrollable(element) {
        return !!element && element.scrollHeight > element.clientHeight + 1;
    }

    // 判断是否在顶部
    isAtTop(element) {
        return element.scrollTop <= 0;
    }

    // 判断是否在底部
    isAtBottom(element) {
        return element.scrollTop + element.clientHeight >= element.scrollHeight - 1;
    }

    // 在当前slide内滚动一定距离
    scrollElement(element, delta) {
        element.scrollTop += delta;
    }
    
    navigateToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= this.totalSlides || this.isScrolling) return;
        
        this.isScrolling = true;
        
        const slides = document.querySelectorAll('.slide');
        const currentSlideEl = slides[this.currentSlide];
        const targetSlideEl = slides[slideIndex];
        
        // 移除所有活跃状态
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        
        // 设置动画方向
        if (slideIndex > this.currentSlide) {
            currentSlideEl.classList.add('prev');
        }
        
        // 激活目标幻灯片
        targetSlideEl.classList.add('active');
        
        // 更新当前索引
        this.currentSlide = slideIndex;
        
        // 更新导航和指示器
        this.updateActiveNavigation();
        this.updateSlideIndicators();
        
        // 触发页面特定的动画
        this.triggerSlideAnimations(slideIndex);
        
        // 更新地址栏hash以支持直达
        const targetId = targetSlideEl.getAttribute('id');
        if (targetId) {
            try {
                if (history.replaceState) {
                    history.replaceState(null, '', `#${targetId}`);
                } else {
                    window.location.hash = targetId;
                }
            } catch (_) {}
        }
        
        // 切换时将目标slide滚动到顶部
        try {
            targetSlideEl.scrollTo({ top: 0, behavior: 'auto' });
        } catch (err) {
            targetSlideEl.scrollTop = 0;
        }
        
        // 重置滚动状态
        setTimeout(() => {
            this.isScrolling = false;
        }, 600);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.navigateToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.navigateToSlide(prevIndex);
    }
    
    updateActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        
        const activeLink = document.querySelector(`[data-section="${this.currentSlide}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    updateSlideIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        const activeIndicator = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        if (activeIndicator) {
            activeIndicator.classList.add('active');
        }
    }
    
    triggerSlideAnimations(slideIndex) {
        const slideElement = document.querySelectorAll('.slide')[slideIndex];
        
        // 为每个页面添加特定的进入动画
        switch(slideIndex) {
            case 0: // 主页
                this.animateHomeElements();
                break;
            case 1: // 关于页面
                this.animateAboutElements();
                break;
            case 2: // 深度学习笔记
                this.animateNotesElements();
                break;
            case 3: // 项目页面
                this.animateProjectsElements();
                break;
            case 4: // 联系页面
                this.animateContactElements();
                break;
        }
    }
    
    animateHomeElements() {
        const titleLines = document.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            line.style.animation = 'none';
            line.offsetHeight; // 触发重排
            line.style.animation = `slideUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
            line.style.animationDelay = `${0.2 + index * 0.2}s`;
        });
        
        const floatingElements = document.querySelectorAll('.float-element');
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.5}s`;
        });
    }
    
    animateAboutElements() {
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        const skillTags = document.querySelectorAll('.skill-tag');
        skillTags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                tag.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                tag.style.opacity = '1';
                tag.style.transform = 'scale(1)';
            }, 500 + index * 100);
        });
    }
    
    animateNotesElements() {
        const noteCards = document.querySelectorAll('.note-card');
        noteCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) rotateX(10deg)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) rotateX(0deg)';
            }, index * 300);
        });
        
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 800 + index * 200);
        });
    }
    
    animateProjectsElements() {
        const projectCards = document.querySelectorAll('.project-card:not(.loading)');
        projectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.9)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 150);
        });
    }
    
    animateContactElements() {
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }
    
    startAnimations() {
        // 启动主页动画
        this.animateHomeElements();
    }
    
    setupDeepLinking() {
        const getIndexByHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (!hash) return 0;
            const slides = Array.from(document.querySelectorAll('.slide'));
            const targetIndex = slides.findIndex(s => s.id === hash);
            return targetIndex >= 0 ? targetIndex : 0;
        };
        
        // 初始根据hash定位
        try {
            const initialIndex = getIndexByHash();
            if (initialIndex !== this.currentSlide) {
                this.navigateToSlide(initialIndex);
            }
        } catch (_) {}
        
        // 监听hash变化（如用户手动修改或浏览器前进后退）
        window.addEventListener('hashchange', () => {
            const targetIndex = getIndexByHash();
            if (targetIndex !== this.currentSlide && !this.isScrolling) {
                this.navigateToSlide(targetIndex);
            }
        });
    }
    
    handleResize() {
        // 处理窗口大小变化
        const isMobile = window.innerWidth <= 768;
        const slideIndicators = document.querySelector('.slide-indicators');
        
        if (isMobile) {
            slideIndicators.style.display = 'none';
        } else {
            slideIndicators.style.display = 'flex';
        }
    }
}

// 全局函数供 HTML 调用
function navigateToSlide(slideIndex) {
    if (window.modernWebsite) {
        window.modernWebsite.navigateToSlide(slideIndex);
    }
}

function nextSlide() {
    if (window.modernWebsite) {
        window.modernWebsite.nextSlide();
    }
}

function previousSlide() {
    if (window.modernWebsite) {
        window.modernWebsite.previousSlide();
    }
}

// 深度学习笔记相关函数
function previewFeishu() {
    const previewArea = document.getElementById('feishu-preview');
    const feishuConfig = WEBSITE_CONFIG.notes.feishu;
    
    if (feishuConfig.enabled) {
        previewArea.innerHTML = `
            <div class="preview-content">
                <h4>${feishuConfig.title}</h4>
                <p>${feishuConfig.description}</p>
                ${feishuConfig.previewContent.map(item => `<p>${item}</p>`).join('')}
                <p class="preview-note">预览内容 - 完整版请访问飞书文档</p>
            </div>
        `;
        previewArea.style.border = '1px solid var(--primary-color)';
    } else {
        previewArea.innerHTML = '<div class="preview-content"><p>飞书文档暂未配置</p></div>';
    }
}

function openFeishu() {
    const feishuConfig = WEBSITE_CONFIG.notes.feishu;
    if (feishuConfig.enabled && feishuConfig.documentUrl) {
        window.open(feishuConfig.documentUrl, '_blank');
    } else {
        alert('飞书文档链接暂未配置');
    }
}

function previewCSDN() {
    const previewArea = document.getElementById('csdn-preview');
    const csdnConfig = WEBSITE_CONFIG.notes.csdn;
    
    if (csdnConfig.enabled) {
        previewArea.innerHTML = `
            <div class="preview-content">
                <h4>${csdnConfig.title}</h4>
                <p>${csdnConfig.description}</p>
                ${csdnConfig.previewContent.map(item => `<p>${item}</p>`).join('')}
                <p class="preview-note">预览内容 - 完整版请访问CSDN博客</p>
            </div>
        `;
        previewArea.style.border = '1px solid var(--primary-color)';
    } else {
        previewArea.innerHTML = '<div class="preview-content"><p>CSDN博客暂未配置</p></div>';
    }
}

function openCSDN() {
    const csdnConfig = WEBSITE_CONFIG.notes.csdn;
    if (csdnConfig.enabled && csdnConfig.blogUrl) {
        window.open(csdnConfig.blogUrl, '_blank');
    } else {
        alert('CSDN博客链接暂未配置');
    }
}

// 友情链接管理 - 已隐藏添加功能
// function addFriendLink() {
//     const friendsGrid = document.getElementById('friends-grid');
//     const newLink = document.createElement('div');
//     newLink.className = 'friend-link';
//     newLink.innerHTML = `
//         <div class="friend-link-item">
//             <h4>新朋友网站</h4>
//             <p>网站描述</p>
//             <a href="#" target="_blank">访问网站</a>
//         </div>
//     `;
//     
//     // 在占位符之前插入
//     const placeholder = friendsGrid.querySelector('.friend-link-placeholder');
//     friendsGrid.insertBefore(newLink, placeholder);
// }

// 项目过滤功能
function setupProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有活跃状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    const projectCards = document.querySelectorAll('.project-card:not(.loading)');
    projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.tags?.includes(filter)) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 400);
        }
    });
}

// 初始化网站
document.addEventListener('DOMContentLoaded', () => {
    window.modernWebsite = new ModernWebsite();
    setupProjectFilters();
    
    // 添加一些额外的样式
    const style = document.createElement('style');
    style.innerHTML = `
        .preview-content {
            text-align: left;
            color: var(--text-color);
        }
        
        .preview-content h4 {
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        
        .preview-content p {
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
        }
        
        .preview-note {
            font-style: italic;
            color: var(--accent-color) !important;
            margin-top: 1rem;
            font-size: 0.9rem;
        }
        
        .friend-link {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 15px;
            padding: 1.5rem;
            backdrop-filter: blur(10px);
            transition: var(--transition-fast);
        }
        
        .friend-link:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-card);
        }
        
        .friend-link h4 {
            color: var(--text-color);
            margin-bottom: 0.5rem;
        }
        
        .friend-link p {
            color: var(--text-secondary);
            margin-bottom: 1rem;
        }
        
        .friend-link a {
            color: var(--primary-color);
            text-decoration: none;
        }
    `;
    document.head.appendChild(style);
});