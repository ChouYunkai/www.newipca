/**
 * 感知与控制研究所网站成员数据索引生成脚本
 * 这个脚本专门处理content/members目录中的内容文件，生成index.json文件
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 成员目录
const membersDir = path.join(__dirname, 'content', 'members');

// 主函数
async function generateMembersIndex() {
  console.log('开始生成成员索引文件...');

  try {
    // 确保成员目录存在
    if (!fs.existsSync(membersDir)) {
      console.error(`成员目录不存在: ${membersDir}`);
      return;
    }

    console.log(`处理成员内容...`);
    const items = readContentFiles(membersDir);
    
    // 写入索引文件
    const indexPath = path.join(membersDir, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(items, null, 2));
    console.log(`已生成成员索引文件: ${indexPath}`);
    console.log(`共处理了 ${items.length} 个成员数据`);

    console.log('成员索引文件生成完成!');
  } catch (error) {
    console.error('生成成员索引出错:', error);
  }
}

// 读取目录中的内容文件
function readContentFiles(dir) {
  const items = [];
  const files = fs.readdirSync(dir);

  console.log(`成员目录中共有 ${files.length} 个文件`);
  
  for (const file of files) {
    // 跳过索引文件和非markdown文件
    if (file === 'index.json' || !file.endsWith('.md')) {
      console.log(`跳过文件: ${file}`);
      continue;
    }

    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    // 跳过目录
    if (stats.isDirectory()) {
      console.log(`跳过目录: ${file}`);
      continue;
    }

    try {
      console.log(`处理文件: ${file}`);
      // 读取文件内容和前置元数据
      const content = fs.readFileSync(filePath, 'utf8');
      const { data, content: body } = matter(content);
      
      console.log(`文件 ${file} 的元数据:`, data);
      
      // 组合内容项
      const item = {
        ...data,
        body: body.trim(),
        slug: path.basename(file, '.md'),
        path: filePath
      };
      
      items.push(item);
      console.log(`成功添加成员: ${data.name || 'unknown'}`);
    } catch (error) {
      console.error(`处理文件出错 ${filePath}:`, error);
    }
  }

  return items;
}

// 执行生成
generateMembersIndex(); 