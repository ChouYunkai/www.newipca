/**
 * 感知与控制研究所网站 CMS 内容管理脚本
 * 用于从CMS生成的内容文件加载数据到网站前端
 */

// 读取后台 CMS 生成的 JSON 内容
async function loadContentFromCMS() {
  try {
    // 加载幻灯片内容
    loadSlidesContent();
    
    // 加载新闻列表内容
    loadNewsContent();
    
    // 加载研究成员内容
    loadMembersContent();
    
    // 加载学术成果内容
    loadPublicationsContent();
    
    // 加载新闻页面专用内容
    loadNewsPageContent();
    
    // 可在此处添加其他内容类型的加载（如幻灯片、研究方向等）
  } catch(error) {
    console.error('加载 CMS 内容时出错:', error);
  }
}

// 加载幻灯片内容到首页幻灯片区域
async function loadSlidesContent() {
  try {
    // 检查是否在首页
    const isHomePage = window.location.pathname.toLowerCase().includes('index.html') || 
                     window.location.pathname.endsWith('/') || 
                     window.location.pathname.endsWith('/index');
    
    if (!isHomePage) return;
    
    console.debug('加载幻灯片内容，当前页面:', window.location.pathname);
    
    // 获取幻灯片容器
    const slidesContainer = document.querySelector('.slides');
    if (!slidesContainer) {
      console.log('未找到幻灯片容器');
      return;
    }
    
    // 获取幻灯片数据
    const slideItems = await fetchSlidesItems();
    if (!slideItems || !slideItems.length) {
      console.log('没有获取到幻灯片数据或数据为空');
      return;
    }
    
    console.debug('获取到幻灯片数据:', slideItems);
    
    // 过滤需要显示的幻灯片
    const visibleSlides = slideItems.filter(slide => slide.display === true);
    
    // 按order排序
    const sortedSlides = visibleSlides.sort((a, b) => (a.order || 999) - (b.order || 999));
    
    if (sortedSlides.length > 0) {
      // 清空当前内容
      slidesContainer.innerHTML = '';
      
      // 创建幻灯片指示器容器
      const dotsContainer = document.querySelector('.slider-dots');
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
      }
      
      // 添加幻灯片
      sortedSlides.forEach((slide, index) => {
        console.debug(`添加幻灯片 ${index+1}:`, slide.title);
        
        // 创建幻灯片元素
        const slideElement = document.createElement('div');
        slideElement.className = `slide${index === 0 ? ' active' : ''}`;
        
        // 设置幻灯片内容
        slideElement.innerHTML = `
          <img src="${slide.image}" alt="${slide.alt || slide.title}">
          <div class="slide-caption">
            <h3>${slide.title}</h3>
            <div class="slide-info">
              <span class="slide-source">${slide.source}</span>
              <span class="slide-time">${formatDate(slide.date)}</span>
            </div>
          </div>
        `;
        
        // 如果有链接，添加点击事件
        if (slide.link) {
          slideElement.style.cursor = 'pointer';
          slideElement.addEventListener('click', () => {
            window.open(slide.link, '_blank');
          });
        }
        
        // 添加到容器
        slidesContainer.appendChild(slideElement);
        
        // 添加指示器
        if (dotsContainer) {
          const dot = document.createElement('span');
          dot.className = `dot${index === 0 ? ' active' : ''}`;
          dot.addEventListener('click', function() {
            goToSlide(index);
          });
          dotsContainer.appendChild(dot);
        }
      });
      
      console.log('幻灯片加载完成');
      
      // 重新初始化幻灯片轮播逻辑
      // 如果全局变量slideInterval存在，先清除之前的自动轮播
      if (window.slideInterval) {
        clearInterval(window.slideInterval);
      }
      
      // 重新初始化轮播变量和功能
      window.currentSlide = 0;
      window.slides = document.querySelectorAll('.slide');
      window.dots = document.querySelectorAll('.dot');
      
      // 重新启动自动轮播
      if (typeof window.startAutoSlide === 'function') {
        window.startAutoSlide();
      } else {
        // 如果原有函数不存在，提供一个基本的轮播功能
        window.slideInterval = setInterval(() => {
          let nextSlide = window.currentSlide + 1;
          if (nextSlide >= window.slides.length) {
            nextSlide = 0;
          }
          
          // 移除当前幻灯片的active类
          window.slides[window.currentSlide].classList.remove('active');
          if (window.dots[window.currentSlide]) {
            window.dots[window.currentSlide].classList.remove('active');
          }
          
          // 更新当前幻灯片索引
          window.currentSlide = nextSlide;
          
          // 添加新幻灯片的active类
          window.slides[window.currentSlide].classList.add('active');
          if (window.dots[window.currentSlide]) {
            window.dots[window.currentSlide].classList.add('active');
          }
        }, 5000);
      }
    }
  } catch(error) {
    console.error('加载幻灯片内容出错:', error);
  }
}

// 加载新闻内容到新闻区域
async function loadNewsContent() {
  try {
    // 获取新闻列表区域元素
    const newsContainer = document.querySelector('.news-list');
    if (!newsContainer) return;
    
    // 判断是否在首页
    const isHomePage = window.location.pathname.toLowerCase().includes('index.html') || 
                     window.location.pathname.endsWith('/') || 
                     window.location.pathname.endsWith('/index');
    
    // 如果不在首页而是在新闻页面，则不在这里处理
    if (!isHomePage && window.location.pathname.toLowerCase().includes('news.html')) {
      return;
    }
    
    console.debug('当前页面:', window.location.pathname, '是否首页:', isHomePage);
    
    // 从news文件夹加载内容
    const newsItems = await fetchNewsItems();
    
    if (newsItems && newsItems.length) {
      // 过滤首页新闻或设置为featured的新闻
      const homeNews = newsItems.filter(item => 
        item.category === 'home' || item.featured === true
      );
      
      console.debug('首页新闻数据:', homeNews);
      
      // 按日期排序并获取前14条显示在首页
      const sortedNews = homeNews
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 14);
      
      // 清空容器内现有内容
      newsContainer.innerHTML = '';
      
      // 循环渲染新闻项
      sortedNews.forEach(news => {
        const newsItem = document.createElement('a');
        newsItem.href = news.link || `#`;
        newsItem.className = 'news-item';
        newsItem.target = '_blank';
        
        // 使用图片如果有，否则使用默认布局
        if (news.image) {
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
        } else {
          newsItem.innerHTML = `
            <div class="news-content full-width">
              <span class="news-title">${news.title}</span>
              <div class="news-meta">
                <span class="news-source">${news.source}</span>
                <span class="news-time">${news.date}</span>
              </div>
            </div>
          `;
        }
        
        // 将新闻项添加到容器
        newsContainer.prepend(newsItem);
      });
    }
  } catch(error) {
    console.error('加载新闻内容出错:', error);
  }
}

// 加载新闻页面内容
async function loadNewsPageContent() {
  try {
    // 检查是否在新闻页面
    const currentPath = window.location.pathname.toLowerCase();
    const isOnNewsPage = currentPath.includes('news.html') || 
                        currentPath.endsWith('/news') ||
                        currentPath.endsWith('/news/');
    
    console.log('当前路径:', currentPath);
    console.log('是否在新闻页面:', isOnNewsPage);
    
    if (!isOnNewsPage) return;
    
    // 加载置顶学术新闻（Academic News）和研究所动态（Institute News）
    await Promise.all([
      loadAcademicNews(),
      loadInstituteNews()
    ]);
    
    console.log('新闻页面更新完成');
  } catch(error) {
    console.error('加载新闻页面内容出错:', error);
  }
}

// 加载学术动态（置顶新闻）
async function loadAcademicNews() {
  try {
    // 获取置顶新闻容器
    const topNewsContainer = document.querySelector('.top-news-grid');
    if (!topNewsContainer) {
      console.log('未找到置顶新闻容器');
      return;
    }
    
    console.debug('加载学术动态，当前页面:', window.location.pathname);
    
    // 获取新闻数据
    const newsItems = await fetchNewsItems();
    if (!newsItems || !newsItems.length) {
      console.log('没有获取到新闻数据或数据为空');
      return;
    }
    
    // 过滤出标记为学术新闻和推荐的新闻
    const academicNews = newsItems.filter(item => 
      item.category === 'academic' && item.image // 确保有图片
    );
    
    console.debug('获取到学术新闻数据:', academicNews);
    
    if (academicNews.length >= 4) {
      // 清空当前内容
      topNewsContainer.innerHTML = '';
      
      // 按featured和order排序
      const sortedNews = academicNews.sort((a, b) => {
        // 首先按featured排序
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        // 然后按order排序
        if (a.order !== b.order) return (a.order || 999) - (b.order || 999);
        
        // 最后按日期排序
        return new Date(b.date) - new Date(a.date);
      });
      
      console.debug('排序后的学术新闻数据:', sortedNews);
      
      // 添加前3个普通学术新闻
      sortedNews.slice(0, 3).forEach((news, index) => {
        console.debug(`添加学术新闻项 ${index+1}:`, news.title);
        const newsItem = document.createElement('a');
        newsItem.href = news.link || '#';
        newsItem.className = 'top-news-item';
        newsItem.target = '_blank';
        
        newsItem.innerHTML = `
          <img src="${news.image}" alt="${news.alt || news.title}">
          <div class="top-news-caption">
            <h3>${news.title}</h3>
            <p>${news.summary || news.body.substring(0, 100)}${news.body && news.body.length > 100 ? '...' : ''}</p>
          </div>
        `;
        
        topNewsContainer.appendChild(newsItem);
      });
      
      // 添加大型学术新闻（第一个排名最高的新闻）
      const featuredNews = sortedNews[0];
      console.debug('添加特色学术新闻:', featuredNews.title);
      const featuredItem = document.createElement('div');
      featuredItem.className = 'top-news-item large';
      
      featuredItem.innerHTML = `
        <img src="${featuredNews.image}" alt="${featuredNews.alt || featuredNews.title}">
        <div class="top-news-caption">
          <h3>${featuredNews.title}</h3>
          <p>${featuredNews.summary || (featuredNews.body ? featuredNews.body.substring(0, 200) : '')}${featuredNews.body && featuredNews.body.length > 200 ? '...' : ''}</p>
        </div>
      `;
      
      topNewsContainer.appendChild(featuredItem);
    } else {
      console.log('学术新闻数量不足，保留原有内容');
    }
  } catch(error) {
    console.error('加载学术新闻内容出错:', error);
  }
}

// 加载研究所动态
async function loadInstituteNews() {
  try {
    // 获取研究所动态新闻容器
    const newsList = document.getElementById('newsList');
    if (!newsList) {
      console.log('未找到研究所动态新闻容器');
      return;
    }
    
    console.debug('加载研究所动态，当前页面:', window.location.pathname);
    
    // 获取新闻数据
    const newsItems = await fetchNewsItems();
    if (!newsItems || !newsItems.length) {
      console.log('没有获取到新闻数据或数据为空');
      return;
    }
    
    // 过滤出研究所动态新闻
    const instituteNews = newsItems.filter(item => 
      item.category === 'institute'
    );
    
    console.debug('获取到研究所动态数据:', instituteNews);
    
    if (instituteNews.length > 0) {
      // 分页相关逻辑
      const newsPerPage = 8; // 每页显示8条新闻
      const totalPages = Math.ceil(instituteNews.length / newsPerPage);
      
      // 清除原有内容，包括分页控件
      newsList.innerHTML = '';
      
      // 排序新闻（按日期降序）
      const sortedNews = instituteNews.sort((a, b) => {
        // 首先按order排序
        if (a.order !== b.order) return (a.order || 999) - (b.order || 999);
        // 然后按日期排序
        return new Date(b.date) - new Date(a.date);
      });
      
      console.debug('排序后的研究所动态数据:', sortedNews);
      
      // 创建加载页面的函数
      const pageNav = document.querySelector('.page-navigation');
      if (pageNav) {
        pageNav.innerHTML = '';
        
        // 创建页码按钮
        for (let i = 1; i <= totalPages; i++) {
          const pageBtn = document.createElement('button');
          pageBtn.className = 'page-number' + (i === 1 ? ' active' : '');
          pageBtn.textContent = i;
          pageBtn.addEventListener('click', () => loadNewsPage(i));
          pageNav.appendChild(pageBtn);
        }
      }
      
      // 加载第一页新闻
      loadNewsPage(1);
      
      // 定义加载特定页面的函数
      function loadNewsPage(pageNum) {
        console.debug(`加载研究所动态第${pageNum}页`);
        newsList.innerHTML = '';
        
        const start = (pageNum - 1) * newsPerPage;
        const end = Math.min(start + newsPerPage, sortedNews.length);
        
        for (let i = start; i < end; i++) {
          const news = sortedNews[i];
          console.debug(`添加研究所动态项 ${i+1}:`, news.title);
          const newsItem = document.createElement('a');
          newsItem.className = 'news-item';
          newsItem.href = news.link || '#';
          newsItem.target = "_blank";
          
          const formattedDate = news.date ? formatDate(news.date) : '';
          
          newsItem.innerHTML = `
            <span class="date">${formattedDate}</span>
            <p>${news.content || news.body}</p>
          `;
          
          newsList.appendChild(newsItem);
        }
        
        // 更新页码状态
        if (pageNav) {
          document.querySelectorAll('.page-number').forEach((btn, index) => {
            btn.classList.toggle('active', index + 1 === pageNum);
          });
        }
        
        // 控制置顶新闻区域和学术标题的显示
        const topNews = document.getElementById('topNews');
        const academicTitle = document.querySelector('.title-container:first-of-type');
        
        if (topNews && academicTitle) {
          if (pageNum === 1) {
            topNews.style.display = 'block';
            academicTitle.style.display = 'block';
          } else {
            topNews.style.display = 'none';
            academicTitle.style.display = 'none';
          }
        }
      }
    }
  } catch(error) {
    console.error('加载研究所动态内容出错:', error);
  }
}

// 加载研究成员内容到成员页面
async function loadMembersContent() {
  try {
    // 检查是否在成员页面 - 更灵活的检测，匹配多种可能的URL格式
    const currentPath = window.location.pathname.toLowerCase();
    const isOnMembersPage = currentPath.includes('members.html') || 
                           currentPath.endsWith('/members') ||
                           currentPath.endsWith('/members/');
    
    console.log('当前路径:', currentPath);
    console.log('是否在成员页面:', isOnMembersPage);
    
    if (!isOnMembersPage) return;
    
    // 获取成员数据
    console.log('开始获取成员数据...');
    const members = await fetchMembersItems();
    console.log('获取到成员数据:', members);
    
    if (members && members.length) {
      // 查找页面上现有的成员部分
      const teacherSection = findExistingSection('教师队伍/Teachers');
      const postdocSection = findExistingSection('博士后研究员/Postdoctoral Researchers');
      
      console.log('找到教师部分:', !!teacherSection);
      console.log('找到博士后部分:', !!postdocSection);
      
      if (teacherSection && postdocSection) {
        // 分类成员
        const teacherMembers = members.filter(member => member.type === '教师');
        const postdocMembers = members.filter(member => member.type !== '教师');
        
        // 获取现有的成员网格
        const teacherGrid = teacherSection.querySelector('.member-grid');
        const postdocGrid = postdocSection.querySelector('.member-grid');
        
        if (teacherGrid) {
          // 添加CMS中的教师成员
          console.log(`添加 ${teacherMembers.length} 个教师成员`);
          teacherMembers.forEach(member => {
            const memberCard = createMemberCard(member);
            teacherGrid.appendChild(memberCard);
          });
        }
        
        if (postdocGrid) {
          // 添加CMS中的博士后成员
          console.log(`添加 ${postdocMembers.length} 个博士后/其他成员`);
          postdocMembers.forEach(member => {
            const memberCard = createMemberCard(member);
            postdocGrid.appendChild(memberCard);
          });
        }
        
        console.log('成员页面更新完成');
      } else {
        console.log('未找到现有的成员部分');
      }
    } else {
      console.log('没有获取到成员数据或数据为空');
    }
  } catch(error) {
    console.error('加载成员内容出错:', error);
  }
}

// 加载学术成果内容到publications页面
async function loadPublicationsContent() {
  try {
    // 检查是否在学术成果页面
    const currentPath = window.location.pathname.toLowerCase();
    const isOnPublicationsPage = currentPath.includes('publications.html') || 
                                currentPath.endsWith('/publications') ||
                                currentPath.endsWith('/publications/');
    
    console.log('当前路径:', currentPath);
    console.log('是否在学术成果页面:', isOnPublicationsPage);
    
    if (!isOnPublicationsPage) return;
    
    // 加载所有三种学术成果
    await Promise.all([
      loadPublications(),
      loadPatents(),
      loadProjects()
    ]);
    
    console.log('学术成果页面更新完成');
  } catch(error) {
    console.error('加载学术成果内容出错:', error);
  }
}

// 加载论文内容
async function loadPublications() {
  try {
    // 获取论文数据
    console.log('开始获取论文数据...');
    const publications = await fetchPublicationsItems();
    console.log('获取到论文数据:', publications);
    
    if (!publications || !publications.length) {
      console.log('没有获取到论文数据或数据为空');
      return;
    }
    
    // 按年份分类论文
    const publicationsByYear = groupByYear(publications);
    console.log('按年份分类的论文:', publicationsByYear);
    
    // 更新论文部分
    for (const year in publicationsByYear) {
      // 查找对应年份的部分
      const yearSection = document.getElementById(year);
      if (!yearSection) {
        console.log(`未找到${year}年的论文部分`);
        continue;
      }
      
      // 获取论文列表容器
      const publicationList = yearSection.querySelector('.publication-list');
      if (!publicationList) {
        console.log(`未找到${year}年的论文列表容器`);
        continue;
      }
      
      // 按索引排序论文
      const sortedPublications = publicationsByYear[year]
        .sort((a, b) => (a.index || 999) - (b.index || 999));
      
      // 添加CMS中的论文
      sortedPublications.forEach(pub => {
        const pubItem = createPublicationItem(pub);
        publicationList.appendChild(pubItem);
      });
      
      console.log(`${year}年的论文加载完成`);
    }
  } catch(error) {
    console.error('加载论文内容出错:', error);
  }
}

// 加载专利内容
async function loadPatents() {
  try {
    // 获取专利数据
    console.log('开始获取专利数据...');
    const patents = await fetchPatentsItems();
    console.log('获取到专利数据:', patents);
    
    if (!patents || !patents.length) {
      console.log('没有获取到专利数据或数据为空');
      return;
    }
    
    // 按年份分类专利
    const patentsByYear = groupByYear(patents);
    console.log('按年份分类的专利:', patentsByYear);
    
    // 更新专利部分
    for (const year in patentsByYear) {
      // 查找对应年份的部分
      const yearSection = document.getElementById(`patent-${year}`);
      if (!yearSection) {
        console.log(`未找到${year}年的专利部分`);
        continue;
      }
      
      // 获取专利列表容器
      const patentList = yearSection.querySelector('.patent-list');
      if (!patentList) {
        console.log(`未找到${year}年的专利列表容器`);
        continue;
      }
      
      // 按索引排序专利
      const sortedPatents = patentsByYear[year]
        .sort((a, b) => (a.index || 999) - (b.index || 999));
      
      // 添加CMS中的专利
      sortedPatents.forEach(patent => {
        const patentItem = createPatentItem(patent);
        patentList.appendChild(patentItem);
      });
      
      console.log(`${year}年的专利加载完成`);
    }
  } catch(error) {
    console.error('加载专利内容出错:', error);
  }
}

// 加载项目内容
async function loadProjects() {
  try {
    // 获取项目数据
    console.log('开始获取项目数据...');
    const projects = await fetchProjectsItems();
    console.log('获取到项目数据:', projects);
    
    if (!projects || !projects.length) {
      console.log('没有获取到项目数据或数据为空');
      return;
    }
    
    // 按年份分类项目
    const projectsByYear = groupByYear(projects);
    console.log('按年份分类的项目:', projectsByYear);
    
    // 更新项目部分
    for (const year in projectsByYear) {
      // 查找对应年份的部分
      const yearSection = document.getElementById(`project-${year}`);
      if (!yearSection) {
        console.log(`未找到${year}年的项目部分`);
        continue;
      }
      
      // 获取项目列表容器
      const projectList = yearSection.querySelector('.project-list');
      if (!projectList) {
        console.log(`未找到${year}年的项目列表容器`);
        continue;
      }
      
      // 按索引排序项目
      const sortedProjects = projectsByYear[year]
        .sort((a, b) => (a.index || 999) - (b.index || 999));
      
      // 添加CMS中的项目
      sortedProjects.forEach(project => {
        const projectItem = createProjectItem(project);
        projectList.appendChild(projectItem);
      });
      
      console.log(`${year}年的项目加载完成`);
    }
  } catch(error) {
    console.error('加载项目内容出错:', error);
  }
}

// 将数据按年份分组
function groupByYear(items) {
  const groupedItems = {};
  
  items.forEach(item => {
    const year = item.year || new Date(item.date).getFullYear() || '未知';
    if (!groupedItems[year]) {
      groupedItems[year] = [];
    }
    groupedItems[year].push(item);
  });
  
  return groupedItems;
}

// 创建论文项目元素
function createPublicationItem(publication) {
  const pubItem = document.createElement('div');
  pubItem.className = 'publication-item';
  
  const pdfLink = publication.pdf_link ? 
    `[ <a href="${publication.pdf_link}" class="pdf-link" target="_blank" rel="noopener">PDF</a> ]` : '';
  
  pubItem.innerHTML = `
    <div class="pub-index">${publication.index || ''}</div>
    <div class="pub-content">
      <div class="pub-authors">${publication.authors || ''}</div>
      <div class="pub-title">${publication.title || ''}</div>
      <div class="pub-venue">${publication.venue || ''} ${pdfLink}</div>
    </div>
  `;
  
  return pubItem;
}

// 创建专利项目元素
function createPatentItem(patent) {
  const patentItem = document.createElement('div');
  patentItem.className = 'patent-item';
  
  patentItem.innerHTML = `
    <div class="patent-index">${patent.index || ''}</div>
    <div class="patent-content">
      <div class="patent-title">${patent.title || ''}</div>
      <div class="patent-info">
        <span class="inventors">发明人：${patent.inventors || ''}</span>
        <span class="application">申请号：${patent.application || ''}</span>
        <span class="app-date">申请日期：${formatDate(patent.app_date) || ''}</span>
        <span class="grant-date">授权日期：${formatDate(patent.grant_date) || ''}</span>
        <span class="patent-number">授权公告号：${patent.patent_number || ''}</span>
        <span class="applicant">申请人：${patent.applicant || '浙江工业大学'}</span>
      </div>
    </div>
  `;
  
  return patentItem;
}

// 创建项目项目元素
function createProjectItem(project) {
  const projectItem = document.createElement('div');
  projectItem.className = 'project-item';
  
  const projectNumber = project.project_number ? 
    `<span class="project-number">项目编号：${project.project_number}</span>` : 
    '<span class="project-number">项目编号：</span>';
  
  projectItem.innerHTML = `
    <div class="project-index">${project.index || ''}</div>
    <div class="project-content">
      <div class="project-title">${project.title || ''}</div>
      <div class="project-info">
        <span class="project-type">项目类型：${project.project_type || ''}</span>
        ${projectNumber}
        <span class="project-period">执行期：${project.period || ''}</span>
      </div>
    </div>
  `;
  
  return projectItem;
}

// 创建成员卡片
function createMemberCard(member) {
  const memberCard = document.createElement('div');
  memberCard.className = 'member-card';
  
  // 如果有照片，添加照片
  let photoHtml = '';
  if (member.photo) {
    photoHtml = `<img src="${member.photo}" alt="${member.name}照片">`;
  } else {
    photoHtml = `<img src="/images/members/placeholder.jpg" alt="placeholder">`;
  }
  
  // 添加成员信息
  memberCard.innerHTML = `
    ${photoHtml}
    <div class="member-info">
      <h3>${member.name}</h3>
      <p>${member.title || ''}</p>
      ${member.email ? `<a href="mailto:${member.email}">${member.email}</a>` : ''}
    </div>
  `;
  
  return memberCard;
}

// 查找现有的成员部分
function findExistingSection(titleText) {
  const sections = document.querySelectorAll('.member-section');
  for (const section of sections) {
    const h2 = section.querySelector('h2');
    if (h2 && h2.textContent.includes(titleText)) {
      return section;
    }
  }
  return null;
}

// 格式化日期
function formatDate(dateStr) {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`;
  } catch (e) {
    return dateStr;
  }
}

// 从CMS内容目录读取新闻文件
async function fetchNewsItems() {
  try {
    // 添加时间戳防止缓存
    const timestamp = new Date().getTime();
    // 获取content/news目录下的所有md/json文件
    const response = await fetch(`content/news/index.json?t=${timestamp}`);
    
    // 如果找不到index.json，尝试读取目录中的单独文件
    if (!response.ok) {
      console.log('未找到新闻索引文件，尝试读取单独内容文件...');
      return []; // 如果找不到索引文件，返回空数组
    }
    
    // 如果找到了index.json，解析并返回
    console.log('成功获取到新闻索引文件');
    const newsData = await response.json();
    console.log(`成功解析新闻数据，共${newsData.length}条`);
    return newsData;
  } catch (error) {
    console.error('获取新闻内容出错:', error);
    return [];
  }
}

// 从CMS内容目录读取成员数据
async function fetchMembersItems() {
  try {
    console.log('尝试获取成员数据...');
    // 添加时间戳防止缓存
    const timestamp = new Date().getTime();
    // 获取content/members目录下的json数据
    const response = await fetch(`content/members/index.json?t=${timestamp}`);
    console.log('成员数据请求状态:', response.status, response.statusText);
    
    // 如果找不到index.json，返回空数组
    if (!response.ok) {
      console.log('未找到成员索引文件');
      return [];
    }
    
    // 解析并返回成员数据
    const membersData = await response.json();
    console.log('成员数据解析成功:', membersData);
    return membersData;
  } catch (error) {
    console.error('获取成员数据出错:', error);
    return [];
  }
}

// 从CMS内容目录读取论文数据
async function fetchPublicationsItems() {
  try {
    console.log('尝试获取论文数据...');
    // 添加时间戳防止缓存
    const timestamp = new Date().getTime();
    // 获取content/publications目录下的json数据
    const response = await fetch(`content/publications/index.json?t=${timestamp}`);
    console.log('论文数据请求状态:', response.status, response.statusText);
    
    // 如果找不到index.json，返回空数组
    if (!response.ok) {
      console.log('未找到论文索引文件');
      return [];
    }
    
    // 解析并返回论文数据
    const publicationsData = await response.json();
    console.log('论文数据解析成功:', publicationsData);
    return publicationsData;
  } catch (error) {
    console.error('获取论文数据出错:', error);
    return [];
  }
}

// 从CMS内容目录读取专利数据
async function fetchPatentsItems() {
  try {
    console.log('尝试获取专利数据...');
    // 添加时间戳防止缓存
    const timestamp = new Date().getTime();
    // 获取content/patents目录下的json数据
    const response = await fetch(`content/patents/index.json?t=${timestamp}`);
    console.log('专利数据请求状态:', response.status, response.statusText);
    
    // 如果找不到index.json，返回空数组
    if (!response.ok) {
      console.log('未找到专利索引文件');
      return [];
    }
    
    // 解析并返回专利数据
    const patentsData = await response.json();
    console.log('专利数据解析成功:', patentsData);
    return patentsData;
  } catch (error) {
    console.error('获取专利数据出错:', error);
    return [];
  }
}

// 从CMS内容目录读取项目数据
async function fetchProjectsItems() {
  try {
    console.log('尝试获取项目数据...');
    // 添加时间戳防止缓存
    const timestamp = new Date().getTime();
    // 获取content/projects目录下的json数据
    const response = await fetch(`content/projects/index.json?t=${timestamp}`);
    console.log('项目数据请求状态:', response.status, response.statusText);
    
    // 如果找不到index.json，返回空数组
    if (!response.ok) {
      console.log('未找到项目索引文件');
      return [];
    }
    
    // 解析并返回项目数据
    const projectsData = await response.json();
    console.log('项目数据解析成功:', projectsData);
    return projectsData;
  } catch (error) {
    console.error('获取项目数据出错:', error);
    return [];
  }
}

// 从CMS内容目录读取幻灯片数据
async function fetchSlidesItems() {
  try {
    console.log('尝试获取幻灯片数据...');
    // 添加时间戳防止缓存
    const timestamp = new Date().getTime();
    const response = await fetch(`content/slides/index.json?t=${timestamp}`);
    console.log('幻灯片数据请求状态:', response.status, response.statusText);
    
    // 如果找不到index.json，返回空数组
    if (!response.ok) {
      console.log('未找到幻灯片索引文件');
      return [];
    }
    
    // 解析并返回幻灯片数据
    const slidesData = await response.json();
    console.log('幻灯片数据解析成功:', slidesData);
    return slidesData;
  } catch (error) {
    console.error('获取幻灯片数据出错:', error);
    return [];
  }
}

// 添加页面加载事件监听
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM加载完成，立即开始加载CMS内容...');
  
  // 首先加载幻灯片内容，不延迟
  loadSlidesContent();
  
  // 其他内容加载可以短暂延迟
  setTimeout(function() {
    loadNewsContent();
    loadMembersContent();
    loadPublicationsContent();
    loadNewsPageContent();
  }, 100);
  
  // 将幻灯片相关函数暴露到全局作用域
  window.slides = document.querySelectorAll('.slide');
  window.dots = document.querySelectorAll('.dot');
  window.currentSlide = 0;
  window.slideInterval = null;
});

// 确保幻灯片加载完成后重新初始化轮播
window.addEventListener('load', function() {
  // 如果页面上有initSlider函数，则在页面完全加载后再次调用
  if (typeof window.initSlider === 'function') {
    console.log('页面完全加载，再次初始化轮播...');
    window.initSlider();
  }
}); 