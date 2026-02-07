// 手写数字识别演示功能
class HandwritingDemo {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupCanvas());
        } else {
            this.setupCanvas();
        }
        
        this.initialized = true;
    }

    setupCanvas() {
        const canvasContainer = document.getElementById('handwriting-canvas');
        if (!canvasContainer) return;

        // 创建canvas元素
        const canvas = document.createElement('canvas');
        canvas.width = 280;
        canvas.height = 280;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.border = 'none';
        canvas.style.cursor = 'crosshair';
        
        // 清除容器内容并添加canvas
        canvasContainer.innerHTML = '';
        canvasContainer.appendChild(canvas);
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 设置绘制样式
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // 设置背景
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (!this.canvas) return;

        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // 触摸事件（移动端支持）
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });
    }

    getCanvasCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    startDrawing(e) {
        this.isDrawing = true;
        const coords = this.getCanvasCoordinates(e);
        this.lastX = coords.x;
        this.lastY = coords.y;
    }

    draw(e) {
        if (!this.isDrawing) return;

        const coords = this.getCanvasCoordinates(e);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();

        this.lastX = coords.x;
        this.lastY = coords.y;
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clearCanvas() {
        if (!this.ctx) return;
        
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 重置预测结果
        this.updatePrediction('?', 0);
    }

    // 模拟数字识别（实际项目中会调用深度学习模型）
    recognizeDigit() {
        if (!this.canvas) return;

        // 模拟识别过程
        const predictionElement = document.getElementById('prediction-result');
        const confidenceElement = document.getElementById('confidence-text');
        const confidenceFill = document.getElementById('confidence-fill');

        // 添加加载动画
        predictionElement.textContent = '🤖';
        confidenceElement.textContent = '识别中...';
        confidenceFill.style.width = '0%';

        // 模拟API调用延迟
        setTimeout(() => {
            // 生成随机的识别结果（实际应用中会是真实的神经网络预测）
            const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            const randomDigit = digits[Math.floor(Math.random() * digits.length)];
            const confidence = Math.floor(Math.random() * 30) + 70; // 70-99%的置信度

            this.updatePrediction(randomDigit, confidence);
        }, 1000);
    }

    updatePrediction(digit, confidence) {
        const predictionElement = document.getElementById('prediction-result');
        const confidenceElement = document.getElementById('confidence-text');
        const confidenceFill = document.getElementById('confidence-fill');

        if (predictionElement) predictionElement.textContent = digit;
        if (confidenceElement) confidenceElement.textContent = `${confidence}%`;
        if (confidenceFill) confidenceFill.style.width = `${confidence}%`;
    }

    // 生成示例数字（预绘制的数字）
    generateSample() {
        if (!this.ctx) return;

        this.clearCanvas();

        // 随机选择一个数字进行绘制
        const samples = [
            this.drawSample0, this.drawSample1, this.drawSample2,
            this.drawSample3, this.drawSample4, this.drawSample5,
            this.drawSample6, this.drawSample7, this.drawSample8, this.drawSample9
        ];

        const randomSample = samples[Math.floor(Math.random() * samples.length)];
        randomSample.call(this);
    }

    // 示例数字绘制函数
    drawSample0() {
        this.ctx.beginPath();
        this.ctx.arc(140, 140, 80, 0, 2 * Math.PI);
        this.ctx.stroke();
    }

    drawSample1() {
        this.ctx.beginPath();
        this.ctx.moveTo(140, 60);
        this.ctx.lineTo(140, 220);
        this.ctx.moveTo(100, 80);
        this.ctx.lineTo(140, 60);
        this.ctx.stroke();
    }

    drawSample2() {
        this.ctx.beginPath();
        this.ctx.moveTo(80, 100);
        this.ctx.quadraticCurveTo(140, 60, 200, 100);
        this.ctx.lineTo(200, 140);
        this.ctx.lineTo(80, 200);
        this.ctx.lineTo(200, 200);
        this.ctx.stroke();
    }

    drawSample3() {
        this.ctx.beginPath();
        this.ctx.moveTo(80, 80);
        this.ctx.lineTo(180, 80);
        this.ctx.lineTo(140, 130);
        this.ctx.lineTo(180, 130);
        this.ctx.lineTo(180, 180);
        this.ctx.quadraticCurveTo(140, 220, 80, 180);
        this.ctx.stroke();
    }

    drawSample4() {
        this.ctx.beginPath();
        this.ctx.moveTo(160, 60);
        this.ctx.lineTo(160, 220);
        this.ctx.moveTo(160, 140);
        this.ctx.lineTo(80, 140);
        this.ctx.lineTo(120, 60);
        this.ctx.stroke();
    }

    drawSample5() {
        this.ctx.beginPath();
        this.ctx.moveTo(180, 60);
        this.ctx.lineTo(80, 60);
        this.ctx.lineTo(80, 130);
        this.ctx.lineTo(160, 130);
        this.ctx.quadraticCurveTo(200, 160, 160, 200);
        this.ctx.lineTo(80, 200);
        this.ctx.stroke();
    }

    drawSample6() {
        this.ctx.beginPath();
        this.ctx.arc(140, 160, 60, 0, 2 * Math.PI);
        this.ctx.moveTo(80, 120);
        this.ctx.quadraticCurveTo(100, 60, 140, 100);
        this.ctx.stroke();
    }

    drawSample7() {
        this.ctx.beginPath();
        this.ctx.moveTo(80, 80);
        this.ctx.lineTo(200, 80);
        this.ctx.lineTo(120, 200);
        this.ctx.stroke();
    }

    drawSample8() {
        this.ctx.beginPath();
        this.ctx.arc(140, 100, 50, 0, 2 * Math.PI);
        this.ctx.moveTo(90, 140);
        this.ctx.arc(140, 180, 50, Math.PI, 2 * Math.PI);
        this.ctx.stroke();
    }

    drawSample9() {
        this.ctx.beginPath();
        this.ctx.arc(140, 120, 60, 0, 2 * Math.PI);
        this.ctx.moveTo(200, 160);
        this.ctx.quadraticCurveTo(180, 220, 140, 180);
        this.ctx.stroke();
    }
}

// 全局函数供HTML调用
let handwritingDemo = null;

function initHandwritingDemo() {
    if (!handwritingDemo) {
        handwritingDemo = new HandwritingDemo();
    }
    handwritingDemo.init();
}

function clearCanvas() {
    if (handwritingDemo) {
        handwritingDemo.clearCanvas();
    }
}

function recognizeDigit() {
    if (handwritingDemo) {
        handwritingDemo.recognizeDigit();
    }
}

function generateSample() {
    if (handwritingDemo) {
        handwritingDemo.generateSample();
    }
}

// 当页面加载时初始化
document.addEventListener('DOMContentLoaded', initHandwritingDemo);

// 当切换到项目页面时也初始化
const originalNavigateToSlide = window.navigateToSlide;
if (originalNavigateToSlide) {
    window.navigateToSlide = function(slideIndex) {
        originalNavigateToSlide(slideIndex);
        if (slideIndex === 4) { // 项目页面的索引
            setTimeout(initHandwritingDemo, 500);
        }
    };
}