/**
 * Stackbit 浏览器端集成脚本
 * 帮助 Stackbit 识别和集成网站内容
 */

(function() {
    // 检测环境
    const isInStackbitEditor = window.location.hostname.includes('stackbit') || 
                               window.location.hostname.includes('netlify.app') ||
                               window.location.search.includes('stackbit-preview');
    
    // 仅在 Stackbit 编辑器环境中执行
    if (!isInStackbitEditor) return;
    
    // 当 Stackbit SDK 加载完成后执行
    function initStackbit() {
        if (!window.Stackbit) {
            setTimeout(initStackbit, 100);
            return;
        }
        
        // 初始化 Stackbit
        window.Stackbit.init({
            // 配置选项
            developerMode: true,
            // 标记内容区域
            contentReady: function() {
                markStackbitSections();
            }
        });
    }
    
    // 标记可编辑内容区域
    function markStackbitSections() {
        // 标记新闻内容
        document.querySelectorAll('.news-item').forEach(function(item) {
            item.setAttribute('data-sb-object-id', item.id || 'news-' + Math.random().toString(36).substr(2, 9));
            item.setAttribute('data-sb-field-path', '_news');
        });
        
        // 标记成员内容
        document.querySelectorAll('.member-item').forEach(function(item) {
            item.setAttribute('data-sb-object-id', item.id || 'member-' + Math.random().toString(36).substr(2, 9));
            item.setAttribute('data-sb-field-path', '_members');
        });
        
        // 标记出版物内容
        document.querySelectorAll('.publication-item').forEach(function(item) {
            item.setAttribute('data-sb-object-id', item.id || 'publication-' + Math.random().toString(36).substr(2, 9));
            item.setAttribute('data-sb-field-path', '_publications');
        });
    }
    
    // 启动集成
    if (document.readyState === 'complete') {
        initStackbit();
    } else {
        window.addEventListener('load', initStackbit);
    }
})(); 