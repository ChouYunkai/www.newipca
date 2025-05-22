/**
 * CMS WebSocket热更新服务启动脚本
 * 用于监控content目录下的变化并通知前端更新
 */

// 引入WebSocket服务端
require('./server/ws-server');

console.log('CMS热更新WebSocket服务已启动，监听端口: 8085');
console.log('监控目录: ./content');
console.log('按Ctrl+C退出服务'); 