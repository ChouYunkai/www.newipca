/**
 * 自定义站点地图函数
 * 用于生成网站的URL结构，便于可视化编辑器导航
 */
module.exports = function siteMap({ documents, models }) {
    // 1. 过滤出所有页面模型
    const pageModels = models.filter((model) => model.type === 'page');
    
    // 2. 定义一个函数用于获取文档的slug
    const getSlug = (doc) => {
        // 从文件路径中提取slug
        const filePath = doc.filePath || '';
        const match = filePath.match(/\/([^\/]+)\.(md|json)$/);
        return match ? match[1] : doc.id;
    };
    
    // 3. 首页特殊处理
    const entries = [];
    
    // 添加首页
    entries.push({
        stableId: 'home',
        urlPath: '/',
        document: null,
        isHomePage: true,
    });
    
    // 4. 处理所有页面文档
    documents
        .filter((doc) => pageModels.some(model => model.name === doc.modelName))
        .forEach((doc) => {
            const slug = getSlug(doc);
            let urlPath;
            
            // 根据模型类型生成不同的URL路径
            switch (doc.modelName) {
                case 'news':
                    urlPath = `/news/${slug}`;
                    break;
                case 'member':
                    urlPath = `/members/${slug}`;
                    break;
                case 'publication':
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
}; 