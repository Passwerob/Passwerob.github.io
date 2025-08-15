const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// 确保上传目录存在
const uploadDir = path.join(__dirname, 'uploads');
const ensureUploadDir = async () => {
    try {
        await fs.access(uploadDir);
    } catch (error) {
        await fs.mkdir(uploadDir, { recursive: true });
        console.log('创建上传目录:', uploadDir);
    }
};

// 中间件设置
app.use(helmet({
    contentSecurityPolicy: false // 允许内联样式和脚本
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 静态文件服务
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDir));

// 配置multer用于文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // 生成唯一文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB 限制
        files: 10 // 最多10个文件
    },
    fileFilter: function (req, file, cb) {
        // 允许的文件类型
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp4|avi|mov|zip|rar|js|html|css|py|java|cpp|c|php|json|xml/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.startsWith('image/') || 
                         file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/') ||
                         file.mimetype === 'application/pdf' || file.mimetype === 'text/plain';
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('不支持的文件类型'));
        }
    }
});

// 工具函数
const getFileType = (filename) => {
    const ext = path.extname(filename).toLowerCase().substring(1);
    const typeMap = {
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
    return typeMap[ext] || 'other';
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// API 路由

// 获取文件列表
app.get('/api/files', async (req, res) => {
    try {
        const files = await fs.readdir(uploadDir);
        const fileList = await Promise.all(
            files.map(async (filename) => {
                const filepath = path.join(uploadDir, filename);
                const stats = await fs.stat(filepath);
                
                return {
                    name: filename,
                    originalName: filename.split('-').slice(0, -2).join('-') + path.extname(filename),
                    size: formatFileSize(stats.size),
                    sizeBytes: stats.size,
                    type: getFileType(filename),
                    date: formatDate(stats.mtime),
                    uploadDate: stats.birthtime.toISOString(),
                    url: `/uploads/${filename}`
                };
            })
        );
        
        // 按上传时间排序（最新的在前）
        fileList.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        
        res.json({
            success: true,
            files: fileList,
            count: fileList.length,
            totalSize: fileList.reduce((sum, file) => sum + file.sizeBytes, 0)
        });
    } catch (error) {
        console.error('获取文件列表错误:', error);
        res.status(500).json({
            success: false,
            message: '获取文件列表失败',
            error: error.message
        });
    }
});

// 文件上传
app.post('/api/upload', upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: '没有文件被上传'
            });
        }
        
        const uploadedFiles = req.files.map(file => ({
            name: file.filename,
            originalName: file.originalname,
            size: formatFileSize(file.size),
            sizeBytes: file.size,
            type: getFileType(file.filename),
            date: formatDate(new Date()),
            uploadDate: new Date().toISOString(),
            url: `/uploads/${file.filename}`
        }));
        
        res.json({
            success: true,
            message: `成功上传 ${uploadedFiles.length} 个文件`,
            files: uploadedFiles
        });
        
        console.log(`成功上传 ${uploadedFiles.length} 个文件`);
    } catch (error) {
        console.error('文件上传错误:', error);
        res.status(500).json({
            success: false,
            message: '文件上传失败',
            error: error.message
        });
    }
});

// 文件下载
app.get('/api/download/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(uploadDir, filename);
        
        // 检查文件是否存在
        await fs.access(filepath);
        
        // 获取原始文件名
        const originalName = filename.split('-').slice(0, -2).join('-') + path.extname(filename);
        
        res.download(filepath, originalName, (err) => {
            if (err) {
                console.error('文件下载错误:', err);
                res.status(500).json({
                    success: false,
                    message: '文件下载失败'
                });
            }
        });
    } catch (error) {
        console.error('文件下载错误:', error);
        res.status(404).json({
            success: false,
            message: '文件不存在'
        });
    }
});

// 文件删除
app.delete('/api/files/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(uploadDir, filename);
        
        // 检查文件是否存在
        await fs.access(filepath);
        
        // 删除文件
        await fs.unlink(filepath);
        
        res.json({
            success: true,
            message: `文件 ${filename} 已删除`
        });
        
        console.log(`删除文件: ${filename}`);
    } catch (error) {
        console.error('文件删除错误:', error);
        if (error.code === 'ENOENT') {
            res.status(404).json({
                success: false,
                message: '文件不存在'
            });
        } else {
            res.status(500).json({
                success: false,
                message: '文件删除失败',
                error: error.message
            });
        }
    }
});

// 获取文件信息
app.get('/api/files/:filename/info', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(uploadDir, filename);
        
        // 检查文件是否存在
        await fs.access(filepath);
        
        const stats = await fs.stat(filepath);
        const fileInfo = {
            name: filename,
            originalName: filename.split('-').slice(0, -2).join('-') + path.extname(filename),
            size: formatFileSize(stats.size),
            sizeBytes: stats.size,
            type: getFileType(filename),
            date: formatDate(stats.mtime),
            uploadDate: stats.birthtime.toISOString(),
            url: `/uploads/${filename}`,
            path: filepath
        };
        
        res.json({
            success: true,
            file: fileInfo
        });
    } catch (error) {
        console.error('获取文件信息错误:', error);
        res.status(404).json({
            success: false,
            message: '文件不存在'
        });
    }
});

// 批量删除文件
app.delete('/api/files', async (req, res) => {
    try {
        const { filenames } = req.body;
        
        if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
            return res.status(400).json({
                success: false,
                message: '请提供要删除的文件名列表'
            });
        }
        
        const results = await Promise.allSettled(
            filenames.map(async (filename) => {
                const filepath = path.join(uploadDir, filename);
                await fs.unlink(filepath);
                return filename;
            })
        );
        
        const successful = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
        
        const failed = results
            .filter(result => result.status === 'rejected')
            .map((result, index) => ({
                filename: filenames[index],
                error: result.reason.message
            }));
        
        res.json({
            success: true,
            message: `成功删除 ${successful.length} 个文件`,
            successful,
            failed
        });
        
        console.log(`批量删除: 成功 ${successful.length}, 失败 ${failed.length}`);
    } catch (error) {
        console.error('批量删除错误:', error);
        res.status(500).json({
            success: false,
            message: '批量删除失败',
            error: error.message
        });
    }
});

// 获取存储统计信息
app.get('/api/stats', async (req, res) => {
    try {
        const files = await fs.readdir(uploadDir);
        const fileStats = await Promise.all(
            files.map(async (filename) => {
                const filepath = path.join(uploadDir, filename);
                const stats = await fs.stat(filepath);
                return {
                    filename,
                    size: stats.size,
                    type: getFileType(filename),
                    uploadDate: stats.birthtime
                };
            })
        );
        
        const totalFiles = fileStats.length;
        const totalSize = fileStats.reduce((sum, file) => sum + file.size, 0);
        
        // 今日上传文件数
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayUploads = fileStats.filter(file => file.uploadDate >= today).length;
        
        // 按类型分组统计
        const typeStats = fileStats.reduce((acc, file) => {
            acc[file.type] = (acc[file.type] || 0) + 1;
            return acc;
        }, {});
        
        res.json({
            success: true,
            stats: {
                totalFiles,
                totalSize: formatFileSize(totalSize),
                totalSizeBytes: totalSize,
                todayUploads,
                typeStats
            }
        });
    } catch (error) {
        console.error('获取统计信息错误:', error);
        res.status(500).json({
            success: false,
            message: '获取统计信息失败',
            error: error.message
        });
    }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'TechVault API 运行正常',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('服务器错误:', error);
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: '文件大小超过限制 (100MB)'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: '文件数量超过限制 (最多10个)'
            });
        }
    }
    
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// 404 处理
app.use((req, res) => {
    if (req.url.startsWith('/api/')) {
        res.status(404).json({
            success: false,
            message: 'API 端点不存在'
        });
    } else {
        // 对于非API请求，返回主页
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('收到 SIGTERM 信号，正在关闭服务器...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('收到 SIGINT 信号，正在关闭服务器...');
    process.exit(0);
});

// 启动服务器
const startServer = async () => {
    try {
        await ensureUploadDir();
        
        app.listen(PORT, () => {
            console.log(`
┌─────────────────────────────────────────────────────────────┐
│                      TechVault 服务器                      │
├─────────────────────────────────────────────────────────────┤
│  服务器地址: http://localhost:${PORT}                      │
│  API 文档:   http://localhost:${PORT}/api/health           │
│  上传目录:   ${uploadDir}                          │
│  环境:       ${process.env.NODE_ENV || 'development'}      │
│  Node.js:    ${process.version}                            │
└─────────────────────────────────────────────────────────────┘
            `);
        });
    } catch (error) {
        console.error('启动服务器失败:', error);
        process.exit(1);
    }
};

startServer();