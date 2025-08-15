// ========== 全局变量和配置 ==========
let files = [];
let currentView = 'grid';
let currentFilter = 'all';
let uploadedFiles = new Set();

// 文件类型映射
const fileTypeMap = {
    // 图片
    'jpg': 'image', 'jpeg': 'image', 'png': 'image', 'gif': 'image', 'webp': 'image', 'svg': 'image', 'bmp': 'image',
    // 文档
    'pdf': 'document', 'doc': 'document', 'docx': 'document', 'txt': 'document', 'rtf': 'document', 'odt': 'document',
    'xls': 'document', 'xlsx': 'document', 'ppt': 'document', 'pptx': 'document', 'ods': 'document', 'odp': 'document',
    // 视频
    'mp4': 'video', 'avi': 'video', 'mov': 'video', 'wmv': 'video', 'flv': 'video', 'webm': 'video', 'mkv': 'video',
    // 音频
    'mp3': 'audio', 'wav': 'audio', 'flac': 'audio', 'aac': 'audio', 'ogg': 'audio', 'm4a': 'audio',
    // 代码
    'js': 'code', 'html': 'code', 'css': 'code', 'py': 'code', 'java': 'code', 'cpp': 'code', 'c': 'code', 'php': 'code',
    // 压缩包
    'zip': 'archive', 'rar': 'archive', '7z': 'archive', 'tar': 'archive', 'gz': 'archive'
};

// 文件图标映射
const fileIconMap = {
    'image': 'fas fa-image',
    'document': 'fas fa-file-alt',
    'video': 'fas fa-video',
    'audio': 'fas fa-music',
    'code': 'fas fa-code',
    'archive': 'fas fa-archive',
    'other': 'fas fa-file'
};

// ========== DOM 操作工具函数 ==========
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadMockData();
    setupEventListeners();
    updateStats();
});

function initializeApp() {
    // 导航高亮
    setupNavigation();
    
    // 设置视图控制
    setupViewControls();
    
    // 设置文件过滤
    setupFileFilters();
    
    // 设置上传功能
    setupFileUpload();
    
    // 设置搜索功能
    setupFileSearch();
    
    console.log('TechVault 应用初始化完成');
}

// ========== 导航功能 ==========
function setupNavigation() {
    const navLinks = $$('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 移除所有活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            
            // 添加当前活动状态
            link.classList.add('active');
            
            // 平滑滚动到目标区域
            const target = link.getAttribute('href');
            scrollToSection(target.substring(1));
        });
    });
}

function scrollToSection(sectionId) {
    const section = $(`#${sectionId}`);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ========== 文件管理功能 ==========
function setupViewControls() {
    const viewBtns = $$('.view-btn');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentView = btn.getAttribute('data-view');
            renderFiles();
        });
    });
}

function setupFileFilters() {
    const filterBtns = $$('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilter = btn.getAttribute('data-filter');
            renderFiles();
        });
    });
}

function setupFileSearch() {
    const searchInput = $('#searchFiles');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        renderFiles(searchTerm);
    });
}

function getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    return fileTypeMap[extension] || 'other';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function renderFiles(searchTerm = '') {
    const filesGrid = $('#filesGrid');
    
    // 过滤文件
    let filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchTerm);
        const matchesFilter = currentFilter === 'all' || file.type === currentFilter;
        return matchesSearch && matchesFilter;
    });
    
    // 清空容器
    filesGrid.innerHTML = '';
    
    if (filteredFiles.length === 0) {
        filesGrid.innerHTML = `
            <div class="no-files">
                <i class="fas fa-folder-open" style="font-size: 4rem; color: var(--text-gray); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-gray);">没有找到文件</p>
            </div>
        `;
        return;
    }
    
    // 根据视图模式渲染文件
    if (currentView === 'grid') {
        filesGrid.className = 'files-grid';
        filteredFiles.forEach((file, index) => {
            const fileElement = createFileGridItem(file, index);
            filesGrid.appendChild(fileElement);
        });
    } else {
        filesGrid.className = 'files-list';
        filteredFiles.forEach((file, index) => {
            const fileElement = createFileListItem(file, index);
            filesGrid.appendChild(fileElement);
        });
    }
}

function createFileGridItem(file, index) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item fade-in';
    fileItem.style.animationDelay = `${index * 0.1}s`;
    
    const iconClass = fileIconMap[file.type] || fileIconMap['other'];
    
    fileItem.innerHTML = `
        <div class="file-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="file-name">${file.name}</div>
        <div class="file-size">${file.size}</div>
        <div class="file-date">${file.date}</div>
    `;
    
    fileItem.addEventListener('click', () => openFileModal(file));
    
    return fileItem;
}

function createFileListItem(file, index) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item-list fade-in';
    fileItem.style.animationDelay = `${index * 0.05}s`;
    
    const iconClass = fileIconMap[file.type] || fileIconMap['other'];
    
    fileItem.innerHTML = `
        <div class="file-list-content">
            <div class="file-icon-small">
                <i class="${iconClass}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-meta">
                    <span class="file-size">${file.size}</span>
                    <span class="file-date">${file.date}</span>
                </div>
            </div>
            <div class="file-actions">
                <button class="action-btn" onclick="downloadFile('${file.name}')">
                    <i class="fas fa-download"></i>
                </button>
                <button class="action-btn delete" onclick="deleteFile('${file.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return fileItem;
}

// ========== 文件上传功能 ==========
function setupFileUpload() {
    const uploadZone = $('#uploadZone');
    const fileInput = $('#fileInput');
    
    // 拖拽上传
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        handleFileUpload(files);
    });
    
    // 文件选择上传
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileUpload(files);
        e.target.value = ''; // 清空输入
    });
}

function handleFileUpload(fileList) {
    if (fileList.length === 0) return;
    
    showLoading();
    
    // 模拟上传过程
    let uploadedCount = 0;
    const totalFiles = fileList.length;
    
    fileList.forEach((file, index) => {
        setTimeout(() => {
            uploadFile(file).then(() => {
                uploadedCount++;
                
                if (uploadedCount === totalFiles) {
                    hideLoading();
                    showNotification(`成功上传 ${totalFiles} 个文件`, 'success');
                    updateStats();
                    renderFiles();
                }
            });
        }, index * 500); // 错开上传时间
    });
}

async function uploadFile(file) {
    return new Promise((resolve) => {
        // 显示上传进度
        showUploadProgress();
        
        // 模拟上传进度
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                // 添加文件到列表
                const newFile = {
                    name: file.name,
                    size: formatFileSize(file.size),
                    type: getFileType(file.name),
                    date: formatDate(new Date()),
                    uploadDate: new Date().toISOString()
                };
                
                files.unshift(newFile);
                uploadedFiles.add(file.name);
                
                // 隐藏进度条
                setTimeout(() => {
                    hideUploadProgress();
                    resolve();
                }, 500);
            }
            
            updateUploadProgress(progress);
        }, 100);
    });
}

function showUploadProgress() {
    const uploadProgress = $('#uploadProgress');
    uploadProgress.style.display = 'block';
}

function hideUploadProgress() {
    const uploadProgress = $('#uploadProgress');
    uploadProgress.style.display = 'none';
}

function updateUploadProgress(progress) {
    const progressFill = $('#progressFill');
    const progressText = $('#progressText');
    
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
}

// ========== 文件操作功能 ==========
function openFileModal(file) {
    const modal = $('#fileModal');
    const modalFileName = $('#modalFileName');
    const modalBody = $('#modalBody');
    const downloadBtn = $('#downloadBtn');
    const deleteBtn = $('#deleteBtn');
    
    modalFileName.textContent = file.name;
    
    // 设置文件预览
    modalBody.innerHTML = getFilePreview(file);
    
    // 设置按钮事件
    downloadBtn.onclick = () => downloadFile(file.name);
    deleteBtn.onclick = () => {
        closeModal();
        showDeleteConfirmation(file.name);
    };
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function getFilePreview(file) {
    const iconClass = fileIconMap[file.type] || fileIconMap['other'];
    
    return `
        <div class="file-preview">
            <div class="preview-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="file-details">
                <div class="detail-row">
                    <span class="detail-label">文件名:</span>
                    <span class="detail-value">${file.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">大小:</span>
                    <span class="detail-value">${file.size}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">类型:</span>
                    <span class="detail-value">${file.type}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">上传时间:</span>
                    <span class="detail-value">${file.date}</span>
                </div>
            </div>
        </div>
    `;
}

function closeModal() {
    const modal = $('#fileModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function downloadFile(fileName) {
    showLoading();
    
    // 模拟下载
    setTimeout(() => {
        hideLoading();
        showNotification(`开始下载: ${fileName}`, 'info');
        
        // 在实际应用中，这里会触发真实的文件下载
        console.log(`下载文件: ${fileName}`);
    }, 1000);
}

function showDeleteConfirmation(fileName) {
    const deleteModal = $('#deleteModal');
    const confirmDeleteBtn = $('#confirmDeleteBtn');
    
    confirmDeleteBtn.onclick = () => {
        closeDeleteModal();
        confirmDeleteFile(fileName);
    };
    
    deleteModal.style.display = 'block';
}

function closeDeleteModal() {
    const deleteModal = $('#deleteModal');
    deleteModal.style.display = 'none';
}

function confirmDeleteFile(fileName) {
    showLoading();
    
    // 模拟删除过程
    setTimeout(() => {
        // 从文件列表中删除
        files = files.filter(file => file.name !== fileName);
        uploadedFiles.delete(fileName);
        
        hideLoading();
        showNotification(`已删除: ${fileName}`, 'success');
        updateStats();
        renderFiles();
    }, 1000);
}

function deleteFile(fileName) {
    showDeleteConfirmation(fileName);
}

// ========== 统计更新 ==========
function updateStats() {
    const fileCount = $('#fileCount');
    const totalSize = $('#totalSize');
    const uploadToday = $('#uploadToday');
    
    // 计算文件总数
    fileCount.textContent = files.length;
    
    // 计算总大小（模拟）
    let totalBytes = files.length * 2.5 * 1024 * 1024; // 假设平均每个文件2.5MB
    totalSize.textContent = formatFileSize(totalBytes);
    
    // 计算今日上传
    const today = new Date().toDateString();
    const todayUploads = files.filter(file => {
        if (file.uploadDate) {
            return new Date(file.uploadDate).toDateString() === today;
        }
        return false;
    }).length;
    
    uploadToday.textContent = todayUploads;
    
    // 添加动画效果
    animateStats();
}

function animateStats() {
    const statNumbers = $$('.stat-number');
    
    statNumbers.forEach(stat => {
        stat.style.transform = 'scale(1.1)';
        stat.style.color = 'var(--primary-color)';
        
        setTimeout(() => {
            stat.style.transform = 'scale(1)';
        }, 200);
    });
}

// ========== 通知系统 ==========
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // 添加样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '10px',
        padding: '1rem 1.5rem',
        color: 'var(--text-light)',
        zIndex: '4000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transform: 'translateX(400px)',
        transition: 'var(--transition-smooth)'
    });
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || icons['info'];
}

// ========== 加载动画 ==========
function showLoading() {
    const loading = $('#loading');
    loading.style.display = 'flex';
}

function hideLoading() {
    const loading = $('#loading');
    loading.style.display = 'none';
}

// ========== 事件监听器设置 ==========
function setupEventListeners() {
    // 模态框关闭
    window.addEventListener('click', (e) => {
        const fileModal = $('#fileModal');
        const deleteModal = $('#deleteModal');
        
        if (e.target === fileModal) {
            closeModal();
        }
        
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeDeleteModal();
        }
    });
    
    // 滚动导航高亮
    window.addEventListener('scroll', updateNavigationHighlight);
    
    // 移动端导航切换
    const navToggle = $('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }
}

function updateNavigationHighlight() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function toggleMobileNav() {
    const navLinks = $('.nav-links');
    const navToggle = $('.nav-toggle');
    
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// ========== 模拟数据加载 ==========
function loadMockData() {
    // 添加一些示例文件
    const mockFiles = [
        {
            name: 'presentation.pdf',
            size: '2.5 MB',
            type: 'document',
            date: '2024-01-15 14:30',
            uploadDate: '2024-01-15T14:30:00Z'
        },
        {
            name: 'vacation_photo.jpg',
            size: '1.8 MB',
            type: 'image',
            date: '2024-01-14 09:15',
            uploadDate: '2024-01-14T09:15:00Z'
        },
        {
            name: 'project_demo.mp4',
            size: '15.2 MB',
            type: 'video',
            date: '2024-01-13 16:45',
            uploadDate: '2024-01-13T16:45:00Z'
        },
        {
            name: 'script.js',
            size: '45 KB',
            type: 'code',
            date: '2024-01-12 11:20',
            uploadDate: '2024-01-12T11:20:00Z'
        },
        {
            name: 'backup.zip',
            size: '8.7 MB',
            type: 'archive',
            date: '2024-01-11 13:00',
            uploadDate: '2024-01-11T13:00:00Z'
        }
    ];
    
    files = [...mockFiles];
    renderFiles();
}

// ========== 性能优化 ==========
// 防抖函数
function debounce(func, wait) {
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

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 应用防抖到搜索功能
const debouncedSearch = debounce((searchTerm) => {
    renderFiles(searchTerm);
}, 300);

// 应用节流到滚动事件
const throttledScroll = throttle(updateNavigationHighlight, 100);

// ========== 错误处理 ==========
window.addEventListener('error', (e) => {
    console.error('应用错误:', e.error);
    showNotification('发生了一个错误，请刷新页面重试', 'error');
});

// ========== 动画和特效 ==========
function addVisibilityAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });
    
    // 观察所有需要动画的元素
    $$('.stat-item, .tech-item, .file-item').forEach(el => {
        observer.observe(el);
    });
}

// 页面加载完成后启动动画
setTimeout(addVisibilityAnimation, 500);

// ========== 导出函数（供HTML调用）==========
// 将必要的函数暴露到全局作用域
window.scrollToSection = scrollToSection;
window.downloadFile = downloadFile;
window.deleteFile = deleteFile;
window.closeModal = closeModal;
window.closeDeleteModal = closeDeleteModal;