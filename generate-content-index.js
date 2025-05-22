/**
 * 感知与控制研究所网站内容索引生成脚本
 * 这个脚本会读取content目录中的内容文件，生成对应的index.json文件
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 要处理的内容类型
const contentTypes = ['news', 'slides', 'members', 'research', 'publications', 'patents', 'projects'];
const contentDir = path.join(__dirname, 'content');

// 主函数
async function generateContentIndexes() {
  console.log('开始生成内容索引文件...');

  try {
    // 确保内容目录存在
    if (!fs.existsSync(contentDir)) {
      console.error(`内容目录不存在: ${contentDir}`);
      return;
    }

    // 为每种内容类型生成索引
    for (const type of contentTypes) {
      const typeDir = path.join(contentDir, type);
      
      // 如果目录不存在，则创建
      if (!fs.existsSync(typeDir)) {
        console.log(`创建目录: ${type}`);
        fs.mkdirSync(typeDir, { recursive: true });
      }

      console.log(`处理 ${type} 内容...`);
      const items = readContentFiles(typeDir);
      
      // 写入索引文件
      const indexPath = path.join(typeDir, 'index.json');
      fs.writeFileSync(indexPath, JSON.stringify(items, null, 2));
      console.log(`已生成索引文件: ${indexPath}`);
    }

    console.log('内容索引文件生成完成!');
  } catch (error) {
    console.error('生成内容索引出错:', error);
  }
}

// 读取目录中的内容文件
function readContentFiles(dir) {
  const items = [];
  
  // 如果目录不存在或为空，返回空数组
  if (!fs.existsSync(dir)) {
    return items;
  }
  
  const files = fs.readdirSync(dir);

  for (const file of files) {
    // 跳过索引文件和非markdown文件
    if (file === 'index.json' || !file.endsWith('.md')) continue;

    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    // 跳过目录
    if (stats.isDirectory()) continue;

    try {
      // 读取文件内容和前置元数据
      const content = fs.readFileSync(filePath, 'utf8');
      const { data, content: body } = matter(content);
      
      // 组合内容项
      const item = {
        ...data,
        body: body.trim(),
        slug: path.basename(file, '.md'),
        path: filePath
      };
      
      items.push(item);
    } catch (error) {
      console.error(`处理文件出错 ${filePath}:`, error);
    }
  }

  return items;
}

// 执行生成
generateContentIndexes(); 