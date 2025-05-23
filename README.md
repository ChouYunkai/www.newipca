# 感知与控制研究所网站

## CMS内容管理系统使用说明

本网站使用Decap CMS进行内容管理，下面是使用流程：

### 内容更新流程

1. 在`/admin`路径访问CMS管理界面（例如 http://localhost:8080/admin 或 https://www.newipc-zjut.com/admin）
2. 登录后进行内容编辑（新闻、幻灯片、成员等）
3. 提交修改后，**必须执行构建步骤**才能将内容更新到前端网站

### 构建内容（必须步骤）

在CMS中提交修改后，您需要执行以下步骤将内容应用到网站：

1. 双击运行`构建内容.bat`批处理文件
2. 等待构建完成
3. 刷新网站页面查看更新后的内容

### 本地开发环境

1. 运行`npm install`安装依赖
2. 运行`npm run dev`启动本地开发服务器和CMS代理
3. 访问 http://localhost:8080 查看网站
4. 访问 http://localhost:8080/admin 使用CMS

### 文件结构说明

- `/content` - CMS管理的内容文件（Markdown格式）
- `/admin` - CMS管理界面及配置
- `/images` - 网站图片资源
- `cms-content.js` - 负责将CMS内容加载到前端页面
- `generate-content-index.js` - 内容构建脚本，生成索引文件

## 注意事项

- CMS修改后**必须执行构建步骤**才能更新网站内容
- 修改页面结构或样式需要单独编辑HTML/CSS文件，CMS仅管理内容
