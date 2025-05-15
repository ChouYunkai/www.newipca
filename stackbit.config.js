/**
 * Stackbit配置文件
 * 使用Content Source Interface连接内容源到视觉编辑器
 */
const { GitContentSource } = require('@stackbit/cms-git');

module.exports = {
  stackbitVersion: "~0.6.0",
  ssgName: "custom",
  nodeVersion: "16",
  
  // 配置内容源
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["_data", "_news", "_members", "_publications"],
      models: [
        // 数据模型
        {
          name: "Homepage",
          type: "data",
          filePath: "_data/homepage.json",
          fields: [
            { name: "background_image", type: "image", required: true },
            { name: "announcement", type: "string" },
            { 
              name: "slides", 
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "image", type: "image", required: true },
                  { name: "title", type: "string", required: true },
                  { name: "description", type: "string" }
                ]
              }
            }
          ]
        },
        {
          name: "Contact",
          type: "data",
          filePath: "_data/contact.json",
          fields: [
            { name: "address", type: "string", required: true },
            { name: "email", type: "string", required: true },
            { name: "phone", type: "string" },
            { name: "fax", type: "string" },
            { 
              name: "social", 
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "platform", type: "string", required: true },
                  { name: "url", type: "string", required: true }
                ]
              }
            }
          ]
        },
        // 内容模型 - 新闻
        {
          name: "News",
          type: "page",
          urlPath: "/news/{slug}",
          filePath: "_news/{slug}.md",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "date", type: "date", required: true },
            { name: "description", type: "string" },
            { name: "thumbnail", type: "image" },
            { name: "body", type: "markdown", required: true }
          ]
        },
        // 内容模型 - 成员
        {
          name: "Member",
          type: "page",
          urlPath: "/members/{slug}",
          filePath: "_members/{slug}.md",
          fields: [
            { name: "name", type: "string", required: true },
            { name: "position", type: "string", required: true },
            { name: "photo", type: "image" },
            { name: "bio", type: "string" },
            { name: "order", type: "number" },
            { name: "body", type: "markdown", required: true }
          ]
        },
        // 内容模型 - 出版物
        {
          name: "Publication",
          type: "page",
          urlPath: "/publications/{slug}",
          filePath: "_publications/{slug}.md",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "authors", type: "string", required: true },
            { name: "date", type: "date", required: true },
            { name: "journal", type: "string" },
            { name: "abstract", type: "string" },
            { name: "link", type: "string" },
            { name: "pdf", type: "string" }
          ]
        }
      ]
    })
  ],
  
  // 自定义站点地图函数
  siteMap: ({ documents, models }) => {
    // 过滤出所有页面模型
    const pageModels = models.filter((model) => model.type === 'page');
    
    // 定义函数用于获取文档的slug
    const getSlug = (doc) => {
      const filePath = doc.filePath || '';
      const match = filePath.match(/\/([^\/]+)\.(md|json)$/);
      return match ? match[1] : doc.id;
    };
    
    // 构建站点地图条目
    const entries = [];
    
    // 添加首页
    entries.push({
      stableId: 'home',
      urlPath: '/',
      document: null,
      isHomePage: true,
    });
    
    // 处理所有页面文档
    documents
      .filter((doc) => pageModels.some(model => model.name === doc.modelName))
      .forEach((doc) => {
        const slug = getSlug(doc);
        let urlPath;
        
        // 根据模型类型生成URL路径
        switch (doc.modelName) {
          case 'News':
            urlPath = `/news/${slug}`;
            break;
          case 'Member':
            urlPath = `/members/${slug}`;
            break;
          case 'Publication':
            urlPath = `/publications/${slug}`;
            break;
          default:
            urlPath = `/${slug}`;
        }
        
        entries.push({
          stableId: doc.id,
          urlPath: urlPath,
          document: doc,
          isHomePage: false,
        });
      });
    
    return entries;
  }
}; 