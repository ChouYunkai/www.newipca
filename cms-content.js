/**
 * 感知与控制研究所网站 CMS 内容管理脚本
 * 用于从CMS生成的内容文件加载数据到网站前端
 */

// 读取后台 CMS 生成的 JSON 内容
async function loadContentFromCMS() {
  try {
    // 加载新闻列表内容
    loadNewsContent();
    
    // 可在此处添加其他内容类型的加载（如幻灯片、研究方向等）
  } catch(error) {
    console.error('加载 CMS 内容时出错:', error);
  }
}

// 加载新闻内容到新闻区域
async function loadNewsContent() {
  try {
    // 获取新闻列表区域元素
    const newsContainer = document.querySelector('.news-list');
    if (!newsContainer) return;
    
    // 从news文件夹加载内容（未来会由CMS生成index.json）
    // 此处为临时方案，实际部署时应该从CMS生成的JSON文件读取
    const newsItems = await fetchNewsItems();
    
    if (newsItems && newsItems.length) {
      // 清空容器
      //newsContainer.innerHTML = '';
      
      // 按日期排序并获取前14条显示在首页
      const sortedNews = newsItems
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 14);
      
      // 临时隐藏注释 - 实际使用时取消此注释
      /*
      // 循环渲染新闻项
      sortedNews.forEach(news => {
        const newsItem = document.createElement('a');
        newsItem.href = news.link || `#`;
        newsItem.className = 'news-item';
        newsItem.target = '_blank';
        
        newsItem.innerHTML = `
          <div class="news-image">
            <img src="${news.image}" alt="${news.alt || news.title}">
          </div>
          <div class="news-content">
            <span class="news-title">${news.title}</span>
            <div class="news-meta">
              <span class="news-source">${news.source}</span>
              <span class="news-time">${news.date}</span>
            </div>
          </div>
        `;
        
        newsContainer.appendChild(newsItem);
      });
      */
    }
  } catch(error) {
    console.error('加载新闻内容出错:', error);
  }
}

// 临时方法：获取模拟的新闻数据
// 未来会从 CMS 生成的 JSON 文件读取
async function fetchNewsItems() {
  // 这里返回的是模拟数据，实际使用时应从CMS生成的JSON文件读取
  return [
    {
      title: '【喜讯】我院24届博士毕业生金哲豪入选欧盟"玛丽·居里学者"人才计划',
      image: "images/news_images/JinZheHao.jpg",
      alt: '我院24届博士毕业生金哲豪入选欧盟"玛丽·居里学者"人才计划',
      source: "e之蓝",
      date: "2025-04-02",
      link: "https://mp.weixin.qq.com/s/Aq-aP21595RzNSpU0GptxQ",
      featured: true
    },
    {
      title: "感知与控制研究所学术报告预告",
      image: "images/news_images/25.4.2yugao.png",
      alt: "感知与控制研究所学术报告预告",
      source: "信息工程学院",
      date: "2025-04-02",
      link: "http://www.newipc-zjut.com/index.html",
      featured: true
    }
  ];
}

// 添加页面加载事件监听
document.addEventListener('DOMContentLoaded', loadContentFromCMS); 