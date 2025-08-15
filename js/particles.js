// Modern Particle Background Effect

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.particleCount = 100;
        this.container = null;
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        this.container = document.getElementById('particles');
        if (!this.container) {
            console.warn('Particles container not found');
            return;
        }
        
        this.createParticles();
        this.start();
    }
    
    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机位置和属性
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = Math.random() * 3 + 1;
        const speed = Math.random() * 2 + 0.5;
        const opacity = Math.random() * 0.5 + 0.3;
        
        // 随机颜色（使用主题色调）
        const colors = [
            '#667eea',
            '#764ba2',
            '#4facfe',
            '#00f2fe',
            '#f093fb',
            '#f5576c'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            opacity: ${opacity};
            animation: particleFloat ${20 + Math.random() * 20}s linear infinite;
            animation-delay: ${Math.random() * 20}s;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.container.appendChild(particle);
        
        return {
            element: particle,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * speed,
            vy: -speed,
            size: size,
            opacity: opacity,
            color: color,
            life: 1
        };
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isRunning = false;
    }
    
    animate() {
        this.updateParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 边界检查和重置
            if (particle.y < -10 || particle.x < -10 || particle.x > window.innerWidth + 10) {
                this.resetParticle(particle);
            }
            
            // 更新DOM元素
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        });
    }
    
    resetParticle(particle) {
        particle.x = Math.random() * window.innerWidth;
        particle.y = window.innerHeight + 10;
        particle.vx = (Math.random() - 0.5) * 2;
        particle.vy = -(Math.random() * 2 + 0.5);
        particle.life = 1;
    }
    
    resize() {
        // 窗口大小改变时重新初始化
        this.particles.forEach(particle => {
            if (particle.x > window.innerWidth) {
                particle.x = window.innerWidth;
            }
        });
    }
    
    destroy() {
        this.stop();
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.particles = [];
    }
}

// 交互式粒子效果
class InteractiveParticles {
    constructor() {
        this.mouse = { x: 0, y: 0 };
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.createInteractiveParticles();
        this.start();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.6;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // 将canvas添加到粒子容器
        const particlesContainer = document.getElementById('particles');
        if (particlesContainer) {
            particlesContainer.appendChild(this.canvas);
        }
    }
    
    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createInteractiveParticles() {
        const count = 50;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 2 + 1,
                color: `hsla(${240 + Math.random() * 60}, 70%, 60%, 0.8)`,
                connections: []
            });
        }
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isRunning = false;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // 鼠标吸引效果
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.vx += (dx / distance) * force * 0.1;
                particle.vy += (dy / distance) * force * 0.1;
            }
            
            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 边界反弹
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // 限制在画布内
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // 减速
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (100 - distance) / 100;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(102, 126, 234, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// 全局实例
let particleSystem = null;
let interactiveParticles = null;

// 初始化粒子系统
function initParticles() {
    // 检查是否支持现代浏览器特性
    if (!window.requestAnimationFrame) {
        console.warn('Browser does not support requestAnimationFrame');
        return;
    }
    
    // 检查设备性能（移动设备使用简化版本）
    const isMobile = window.innerWidth <= 768;
    const isLowPerformance = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    if (isMobile || isLowPerformance) {
        // 移动设备或低性能设备只使用简单粒子
        particleSystem = new ParticleSystem();
        particleSystem.particleCount = 30; // 减少粒子数量
    } else {
        // 桌面设备使用完整效果
        particleSystem = new ParticleSystem();
        interactiveParticles = new InteractiveParticles();
    }
}

// 清理粒子系统
function destroyParticles() {
    if (particleSystem) {
        particleSystem.destroy();
        particleSystem = null;
    }
    
    if (interactiveParticles) {
        interactiveParticles.destroy();
        interactiveParticles = null;
    }
}

// 控制粒子系统的显示/隐藏
function toggleParticles(show = true) {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        particlesContainer.style.display = show ? 'block' : 'none';
    }
    
    if (show) {
        if (particleSystem) particleSystem.start();
        if (interactiveParticles) interactiveParticles.start();
    } else {
        if (particleSystem) particleSystem.stop();
        if (interactiveParticles) interactiveParticles.stop();
    }
}

// 响应式处理
function handleParticleResize() {
    if (particleSystem) {
        particleSystem.resize();
    }
    
    if (interactiveParticles) {
        interactiveParticles.resize();
    }
}

// 页面可见性API - 当页面隐藏时暂停动画
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        toggleParticles(false);
    } else {
        toggleParticles(true);
    }
});

// 窗口大小改变时调整
window.addEventListener('resize', handleParticleResize);

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化以确保页面完全加载
    setTimeout(initParticles, 1000);
    
    // 添加粒子动画的CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) translateX(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-10vh) translateX(200px) rotate(360deg);
                opacity: 0;
            }
        }
        
        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        }
        
        .particle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            will-change: transform, opacity;
        }
        
        /* 减少移动设备上的粒子效果 */
        @media (max-width: 768px) {
            .particles {
                opacity: 0.3;
            }
        }
        
        /* 尊重用户的减少动画偏好 */
        @media (prefers-reduced-motion: reduce) {
            .particles {
                display: none;
            }
            
            .particle {
                animation: none;
            }
        }
    `;
    document.head.appendChild(style);
});

// 页面卸载时清理
window.addEventListener('beforeunload', destroyParticles);