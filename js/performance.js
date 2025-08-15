// 网站性能优化相关功能

class PerformanceOptimizer {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.lazyElements = [];
        this.intersectionObserver = null;
        this.init();
    }

    init() {
        this.hidePreloader();
        this.setupLazyLoading();
        this.optimizeImages();
        this.enableCaching();
    }

    // 隐藏预加载器
    hidePreloader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (this.preloader) {
                    this.preloader.classList.add('hidden');
                    // 1秒后完全移除预加载器
                    setTimeout(() => {
                        this.preloader.style.display = 'none';
                    }, 500);
                }
            }, 500); // 最少显示500ms
        });
    }

    // 设置懒加载
    setupLazyLoading() {
        // 配置Intersection Observer
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    this.intersectionObserver.unobserve(entry.target);
                }
            });
        }, options);

        // 观察所有懒加载元素
        this.observeLazyElements();
    }

    observeLazyElements() {
        // 观察图片
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            this.intersectionObserver.observe(img);
        });

        // 观察其他元素
        const lazyElements = document.querySelectorAll('.lazy-load');
        lazyElements.forEach(element => {
            this.intersectionObserver.observe(element);
        });
    }

    loadElement(element) {
        if (element.tagName === 'IMG') {
            // 加载图片
            const src = element.getAttribute('data-src');
            if (src) {
                element.src = src;
                element.removeAttribute('data-src');
                element.classList.add('loaded');
            }
        } else {
            // 加载其他元素
            element.classList.add('loaded');
        }
    }

    // 优化图片
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // 如果支持WebP格式，优先使用WebP
            if (this.supportsWebP()) {
                const src = img.src;
                if (src && !src.includes('.webp')) {
                    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                    // 检查WebP版本是否存在
                    this.checkImageExists(webpSrc).then(exists => {
                        if (exists) {
                            img.src = webpSrc;
                        }
                    });
                }
            }

            // 添加加载失败处理
            img.addEventListener('error', () => {
                img.style.display = 'none';
            });
        });
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    async checkImageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    // 启用缓存策略
    enableCaching() {
        // 缓存关键资源
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }

        // 预加载关键资源
        this.preloadCriticalResources();
    }

    registerServiceWorker() {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/css/modern-styles.css',
            '/js/modern-main.js',
            '/js/github-api.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    // 防抖函数，优化滚动和resize事件
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数，优化高频事件
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // 压缩和优化JavaScript执行
    optimizeScripts() {
        // 延迟执行非关键脚本
        const deferredScripts = document.querySelectorAll('script[data-defer]');
        deferredScripts.forEach(script => {
            setTimeout(() => {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                document.head.appendChild(newScript);
            }, 1000);
        });
    }

    // 监控性能指标
    monitorPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const timing = performance.timing;
                    const loadTime = timing.loadEventEnd - timing.navigationStart;
                    console.log(`页面加载时间: ${loadTime}ms`);

                    // 报告核心Web指标
                    if ('PerformanceObserver' in window) {
                        this.observeWebVitals();
                    }
                }, 0);
            });
        }
    }

    observeWebVitals() {
        // 观察Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('LCP:', entry.startTime);
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // 观察First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
        }).observe({ entryTypes: ['first-input'] });

        // 观察Cumulative Layout Shift (CLS)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    console.log('CLS:', entry.value);
                }
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }

    // 优化字体加载
    optimizeFonts() {
        // 预加载关键字体
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        fontPreload.as = 'style';
        fontPreload.onload = function() { this.rel = 'stylesheet'; };
        document.head.appendChild(fontPreload);
    }
}

// 初始化性能优化器
document.addEventListener('DOMContentLoaded', () => {
    const performanceOptimizer = new PerformanceOptimizer();
    
    // 监控性能
    performanceOptimizer.monitorPerformance();
    
    // 优化字体
    performanceOptimizer.optimizeFonts();
    
    // 优化脚本执行
    performanceOptimizer.optimizeScripts();
});

// 导出供其他模块使用
window.PerformanceOptimizer = PerformanceOptimizer;