/**
 * CMS辅助脚本 - 用于处理CMS内容
 */

// 当CMS内容发生变化时更新索引文件
document.addEventListener('DOMContentLoaded', function() {
  if (window.CMS) {
    // 监听内容变化
    window.CMS.registerEventListener({
      name: 'postPublish',
      handler: function(data) {
        console.log('内容已发布:', data);
        alert('内容已成功发布！注意：在测试模式下，内容保存在浏览器存储中，刷新后可能会丢失。');
      }
    });
    
    // 直接检查后端类型并显示提示
    setTimeout(function() {
      if (window.CMS && window.CMS.getBackend && window.CMS.getBackend().options) {
        const backendName = window.CMS.getBackend().options.name;
        
        if (backendName === 'test-repo') {
          console.log('使用测试库模式 - 内容将保存在浏览器中');
          
          // 添加帮助提示
          const helpText = document.createElement('div');
          helpText.style.padding = '10px';
          helpText.style.margin = '10px 0';
          helpText.style.backgroundColor = '#f8f9fa';
          helpText.style.border = '1px solid #e9ecef';
          helpText.style.borderRadius = '4px';
          helpText.innerHTML = `
            <h4 style="margin-top:0;">测试模式说明</h4>
            <p>当前CMS运行在"测试模式"下，所有的内容更改仅保存在浏览器本地存储中，不会实际提交到服务器或修改文件。</p>
            <p>这些更改在关闭或刷新浏览器后可能会丢失。如需保存到GitHub仓库，请联系管理员更改CMS配置。</p>
          `;
          
          // 将提示添加到界面
          const mainContainer = document.querySelector('.css-vyh0qp');
          if (mainContainer) {
            mainContainer.insertBefore(helpText, mainContainer.firstChild);
          }
        }
      }
    }, 2000); // 延迟2秒以确保CMS已初始化
    
    // 使用预保存事件代替init事件
    window.CMS.registerEventListener({
      name: 'preSave',
      handler: function() {
        console.log('内容即将保存');
      }
    });
  }
}); 