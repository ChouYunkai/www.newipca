const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');
const debounce = require('lodash.debounce');

// 配置项
const config = {
  contentDir: path.join(__dirname, '../content'), // 监听的内容目录
  scriptPath: path.join(__dirname, '../generate-content-index.js'), // 脚本路径
  debounceTime: 5000, // 防抖时间(毫秒)，防止短时间内多次触发
  ignored: /(^|[\/\\])\../, // 忽略隐藏文件
  watchOptions: {
    persistent: true, // 持续监听
    ignoreInitial: true // 忽略初始扫描时的事件
  }
};

// 日志函数
function log(message, type = 'info') {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m'
  };
  const reset = '\x1b[0m';
  console.log(`${colors[type]}[${timestamp}] ${message}${reset}`);
}

// 执行脚本函数(带防抖)
const executeScript = debounce(() => {
  log('检测到内容变化，正在执行命令...', 'warning');
  
  exec(`node ${config.scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      log(`执行失败: ${error.message}`, 'error');
      log(stderr, 'error');
      return;
    }
    
    log('命令执行完成', 'success');
    if (stdout) log(stdout.trim());
  });
}, config.debounceTime);

// 创建文件监听器
const watcher = chokidar.watch(config.contentDir, {
  ...config.watchOptions,
  ignored: config.ignored
});

// 监听文件变化事件
watcher
  .on('add', path => log(`新增文件: ${path}`))
  .on('change', path => {
    log(`文件修改: ${path}`);
    executeScript();
  })
  .on('unlink', path => {
    log(`文件删除: ${path}`);
    executeScript();
  })
  .on('addDir', path => log(`新增目录: ${path}`))
  .on('unlinkDir', path => log(`删除目录: ${path}`))
  .on('error', error => log(`监听错误: ${error}`, 'error'))
  .on('ready', () => log(`开始监听 ${config.contentDir} 目录...`));

// 优雅处理程序退出
process.on('SIGINT', () => {
  log('停止监听...');
  watcher.close().then(() => process.exit(0));
});    