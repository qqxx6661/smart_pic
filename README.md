# SmartPic - 智能图片处理工具

功能强大的在线图片处理工具，支持独立静态部署。基于现代 Web 技术构建，提供丰富的图片编辑功能，所有处理都在浏览器本地完成，保护用户隐私安全。

## 功能特点

### 核心功能
- ✅ **图片上传与预览** - 支持拖拽上传，实时预览
- ✅ **格式转换** - 支持 JPG、PNG、WebP 等主流格式互转
- ✅ **图片压缩** - 可调节质量参数，智能压缩文件大小
- ✅ **裁剪功能** - 可视化裁剪工具，精确控制裁剪区域
- ✅ **缩放功能** - 自定义图片尺寸，保持比例缩放
- ✅ **旋转功能** - 支持 90° 增量旋转
- ✅ **亮度/对比度调整** - 实时调整图片亮度和对比度
- ✅ **本地下载** - 处理后的图片可直接保存到本地

### 技术特点
- 🚀 **纯前端处理** - 所有图片处理在浏览器本地完成，无需上传到服务器
- 📱 **移动端适配** - 响应式设计，支持桌面端和移动端设备
- 🎨 **现代化界面** - 基于 Ant Design 的简洁易用界面
- ⚡ **快速部署** - 静态网页应用，可部署到任何静态托管服务
- 🔒 **隐私安全** - 图片不会离开用户设备，完全保护隐私

## 技术架构

- **前端框架**: React 18
- **UI 组件库**: Ant Design 5
- **构建工具**: Vite
- **图片处理**: HTML5 Canvas API + CSS Filters
- **文件下载**: file-saver

## 快速开始

### 开发环境

```bash
# 克隆项目
git clone https://github.com/qqxx6661/smart_pic.git
cd smart_pic

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

构建完成后，`dist` 目录包含所有静态文件，可直接部署到任何静态托管服务。

## 部署选项

### GitHub Pages 自动部署

本项目已配置 GitHub Actions 自动部署到 GitHub Pages：

1. 将代码合并到 `main` 分支
2. GitHub Actions 会自动构建并部署到 GitHub Pages
3. 访问地址：`https://qqxx6661.github.io/smart_pic/`

### 其他部署选项

- **Vercel**: 推荐，零配置部署
- **Netlify**: 简单快速部署
- **阿里云/腾讯云**: 国内用户推荐

## 浏览器支持

- Chrome 88+
- Firefox 84+
- Safari 14+
- Edge 88+

## 开源协议

本项目采用 [Apache License 2.0](LICENSE) 开源协议。

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

## 截图预览

### 桌面端界面
![主页](https://github.com/user-attachments/assets/cec6d020-6154-48c6-9e06-60318ea3d34a)

### 图片编辑器
![编辑器](https://github.com/user-attachments/assets/f443876e-18b4-440a-86fe-c3fedd1375ff)

### 移动端适配
![移动端](https://github.com/user-attachments/assets/a7f50f54-930c-404c-823a-933291096e07)
