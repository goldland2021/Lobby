// 本地测试Telegram验签逻辑
const crypto = require('crypto');

const BOT_TOKEN = '8657390040:AAHzow6PnRaWgUrR1fyDtOoVOxyvWCxQB4s';

// 测试Telegram initData验证
function testTelegramValidation() {
  console.log('🔍 测试Telegram验签逻辑\n');
  
  // 模拟Telegram initData（来自官方文档示例）
  const testInitData = 'query_id=AAHdF6IQAAAAAN0XohC4NvB7&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%2C%22language_code%22%3A%22en%22%7D&auth_date=1641043224&hash=abc123def456';
  
  console.log('1. 解析initData:');
  const params = new URLSearchParams(testInitData);
  console.log('   query_id:', params.get('query_id'));
  console.log('   user:', params.get('user'));
  console.log('   auth_date:', params.get('auth_date'));
  console.log('   hash:', params.get('hash'));
  
  console.log('\n2. 用户信息解析:');
  const userStr = params.get('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    console.log('   ID:', user.id);
    console.log('   姓名:', `${user.first_name} ${user.last_name || ''}`.trim());
    console.log('   用户名:', user.username);
    console.log('   语言:', user.language_code);
  }
  
  console.log('\n3. 验证数据检查字符串生成:');
  params.delete('hash');
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
  console.log('   数据检查字符串:');
  console.log('   ' + dataCheckString.replace(/\n/g, '\n   '));
  
  console.log('\n4. HMAC-SHA256计算:');
  const secretKey = crypto.createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN)
    .digest();
  console.log('   密钥长度:', secretKey.length, 'bytes');
  
  const calculatedHash = crypto.createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  console.log('   计算出的hash:', calculatedHash);
  
  console.log('\n✅ Telegram验签逻辑测试完成');
  console.log('📝 注意: 真实hash需要从Telegram获取，这里只是验证计算过程');
}

// 测试用户信息解析
function testUserParsing() {
  console.log('\n\n👤 测试用户信息解析\n');
  
  const testCases = [
    {
      name: '完整用户信息',
      initData: 'user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22John%22%2C%22last_name%22%3A%22Doe%22%2C%22username%22%3A%22johndoe%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%7D&auth_date=1641043224'
    },
    {
      name: '只有first_name',
      initData: 'user=%7B%22id%22%3A987654321%2C%22first_name%22%3A%22Alice%22%7D&auth_date=1641043224'
    },
    {
      name: '空用户信息',
      initData: 'auth_date=1641043224'
    }
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`${index + 1}. ${testCase.name}:`);
    const params = new URLSearchParams(testCase.initData);
    const userStr = params.get('user');
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('   ID:', user.id);
        console.log('   姓名:', `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A');
        console.log('   用户名:', user.username || 'N/A');
        console.log('   Premium:', user.is_premium || false);
      } catch (error) {
        console.log('   ❌ JSON解析错误:', error.message);
      }
    } else {
      console.log('   ℹ️ 无用户信息，生成匿名用户');
      console.log('   匿名ID: anonymous_' + Date.now());
    }
    console.log();
  });
}

// 测试API响应格式
function testApiResponse() {
  console.log('\n\n📡 测试API响应格式\n');
  
  const mockResponse = {
    success: true,
    user: {
      id: 'telegram_123456789',
      name: 'John Doe',
      telegramId: 123456789,
      username: 'johndoe',
      sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      authenticatedAt: new Date().toISOString(),
      authMethod: 'telegram'
    }
  };
  
  console.log('1. 成功响应:');
  console.log(JSON.stringify(mockResponse, null, 2));
  
  console.log('\n2. 错误响应:');
  const errorResponse = {
    success: false,
    error: 'Invalid Telegram signature',
    message: 'The initData signature could not be verified'
  };
  console.log(JSON.stringify(errorResponse, null, 2));
  
  console.log('\n3. 缺少initData错误:');
  const missingDataResponse = {
    success: false,
    error: 'initData is required'
  };
  console.log(JSON.stringify(missingDataResponse, null, 2));
}

// 运行所有测试
console.log('🚀 Cherry Farm Horse Racing API 本地测试\n');
console.log('=' .repeat(50));

testTelegramValidation();
testUserParsing();
testApiResponse();

console.log('\n' + '=' .repeat(50));
console.log('✅ 所有本地测试完成');
console.log('\n下一步:');
console.log('1. 运行 `vercel --prod` 部署到生产环境');
console.log('2. 在Vercel设置环境变量 BOT_TOKEN');
console.log('3. 测试线上API: https://lobby-eosin.vercel.app/api/auth');
console.log('4. 更新Telegram Bot WebApp URL');