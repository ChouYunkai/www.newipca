# 感知与控制研究所网站 CMS 使用说明

## 一、系统概述

本系统使用 Decap CMS（原 Netlify CMS）作为内容管理系统，基于 Git 进行版本控制，通过 Netlify 进行部署和托管。

### 1.1 系统架构
- 前端框架：Vue.js
- 内容管理：Decap CMS
- 部署平台：Netlify
- 代码托管：GitHub
- 图片存储：GitHub 仓库

### 1.2 重要地址
- 网站地址：https://www.newipc-zjut.com
- CMS 管理后台：https://www.newipc-zjut.com/admin
- GitHub 仓库：https://github.com/ChouYunkai/www.newipca
- Netlify 部署：https://app.netlify.com

## 二、CMS 使用指南

### 2.1 访问 CMS
1. 打开浏览器，访问 https://www.newipc-zjut.com/admin
2. 使用 Netlify Identity 账号登录
   - 首次使用需要注册账号
   - 需要管理员审核通过后才能使用

### 2.2 内容管理
CMS 支持以下内容类型的管理：

1. 首页幻灯片
   - 位置：首页轮播图
   - 支持图片上传和链接设置
   - 建议图片尺寸：1920x1080px

2. 新闻动态
   - 位置：首页新闻模块
   - 支持富文本编辑
   - 可设置发布时间和分类

3. 通知公告
   - 位置：首页通知模块
   - 支持富文本编辑
   - 可设置发布时间

4. 学术活动
   - 位置：首页学术活动模块
   - 支持富文本编辑
   - 可设置活动时间

### 2.3 图片上传
1. 在编辑器中点击图片上传按钮
2. 选择本地图片文件
3. 图片会自动上传到 GitHub 仓库的 `images/uploads` 目录
4. 建议图片大小不超过 2MB

## 三、部署说明

### 3.1 本地开发环境
1. 克隆仓库：
```bash
git clone https://github.com/ChouYunkai/www.newipca.git
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

### 3.2 部署流程
1. 代码推送到 GitHub 后，Netlify 会自动触发部署
2. 部署过程：
   - 拉取最新代码
   - 构建静态文件
   - 部署到 Netlify CDN

### 3.3 环境配置
1. Netlify 环境变量：
   - `VITE_API_URL`: API 地址
   - `VITE_BASE_URL`: 网站基础路径

2. 本地开发环境变量：
   - 复制 `.env.example` 为 `.env.local`
   - 配置相应的环境变量

## 四、注意事项

### 4.1 内容编辑
1. 编辑前先备份重要内容
2. 使用预览功能检查效果
3. 发布前确认内容格式正确

### 4.2 图片处理
1. 压缩图片后再上传
2. 使用合适的图片格式（推荐 JPG/PNG）
3. 注意图片版权问题

### 4.3 安全建议
1. 定期更改密码
2. 及时退出登录
3. 不要共享账号

## 五、常见问题

### 5.1 登录问题
- 问题：无法登录 CMS
- 解决：检查网络连接，确认账号权限

### 5.2 图片上传失败
- 问题：图片上传失败
- 解决：检查图片大小和格式，确认网络连接

### 5.3 内容不显示
- 问题：发布的内容未显示
- 解决：检查发布状态，确认内容格式正确

## 六、技术支持

如遇到问题，请联系：
- 技术支持邮箱：support@newipc-zjut.com
- 管理员：admin@newipc-zjut.com

## 七、更新日志

### v1.0.0 (2024-03-20)
- 初始版本发布
- 支持基本的内容管理功能
- 集成 Netlify CMS 