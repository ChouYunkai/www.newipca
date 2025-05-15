// 简单的身份验证模拟函数
exports.handler = async (event) => {
  // 允许跨域请求
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  // 模拟认证用户
  if (event.httpMethod === 'POST') {
    const requestBody = JSON.parse(event.body || '{}');
    
    // 检查是否匹配我们的简单用户名和密码
    if (requestBody.username === 'ipca' && requestBody.password === '1234') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          user: {
            id: 'user-1234',
            email: 'ipca@example.com',
            name: 'IPCA Admin',
            roles: ['admin']
          },
          token: 'fake-jwt-token-for-testing'
        })
      };
    } else {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: '用户名或密码不正确' })
      };
    }
  }
  
  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }
  
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: '不支持的方法' })
  };
}; 