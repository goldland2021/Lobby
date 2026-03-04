#!/usr/bin/env node

const https = require('https');

const BASE_URL = 'https://lobby-eosin.vercel.app';
const TEST_INIT_DATA = 'query_id=AAHdF6IQAAAAAN0XohC4NvB7&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%2C%22language_code%22%3A%22en%22%7D&auth_date=1641043224&hash=abc123def456';

async function testEndpoint(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'lobby-eosin.vercel.app',
      port: 443,
      path: endpoint,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Test/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : {};
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            data: parsed,
            raw: responseData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            data: null,
            raw: responseData,
            error: 'Failed to parse JSON'
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('🔍 Testing Cherry Farm Horse Racing API Endpoints\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  try {
    // 测试1: OPTIONS预检请求
    console.log('1. Testing OPTIONS preflight...');
    const optionsResult = await testEndpoint('/api/auth', 'OPTIONS');
    console.log(`   Status: ${optionsResult.status} ${optionsResult.statusText}`);
    console.log(`   CORS Headers: ${JSON.stringify({
      'access-control-allow-origin': optionsResult.headers['access-control-allow-origin'],
      'access-control-allow-methods': optionsResult.headers['access-control-allow-methods']
    }, null, 2)}`);
    console.log();

    // 测试2: POST /api/auth (认证接口)
    console.log('2. Testing POST /api/auth...');
    const authResult = await testEndpoint('/api/auth', 'POST', {
      initData: TEST_INIT_DATA
    });
    console.log(`   Status: ${authResult.status} ${authResult.statusText}`);
    
    if (authResult.status === 200) {
      console.log(`   ✅ Success! User: ${authResult.data?.user?.name || 'Unknown'}`);
      console.log(`   User ID: ${authResult.data?.user?.id}`);
      console.log(`   Session: ${authResult.data?.user?.sessionId?.substring(0, 20)}...`);
    } else {
      console.log(`   ❌ Failed: ${authResult.data?.error || 'Unknown error'}`);
      if (authResult.raw) {
        console.log(`   Response: ${authResult.raw.substring(0, 200)}...`);
      }
    }
    console.log();

    // 测试3: POST /api/play (游戏接口)
    console.log('3. Testing POST /api/play...');
    const playResult = await testEndpoint('/api/play', 'POST');
    console.log(`   Status: ${playResult.status} ${playResult.statusText}`);
    
    if (playResult.status === 200) {
      console.log(`   ✅ Success! Race ID: ${playResult.data?.result?.raceId}`);
      console.log(`   Player Position: ${playResult.data?.result?.player?.position}`);
      console.log(`   Reward: ${playResult.data?.result?.player?.reward} coins`);
    } else {
      console.log(`   ❌ Failed: ${playResult.data?.error || 'Unknown error'}`);
    }
    console.log();

    // 测试4: GET /api/leaderboard (排行榜接口)
    console.log('4. Testing GET /api/leaderboard...');
    const leaderboardResult = await testEndpoint('/api/leaderboard', 'GET');
    console.log(`   Status: ${leaderboardResult.status} ${leaderboardResult.statusText}`);
    
    if (leaderboardResult.status === 200) {
      console.log(`   ✅ Success! Total players: ${leaderboardResult.data?.stats?.totalPlayers}`);
      console.log(`   Top score: ${leaderboardResult.data?.stats?.topScore}`);
      console.log(`   Current user rank: ${leaderboardResult.data?.currentUser?.rank}`);
    } else {
      console.log(`   ❌ Failed: ${leaderboardResult.data?.error || 'Unknown error'}`);
    }
    console.log();

    // 测试5: 错误请求测试
    console.log('5. Testing error cases...');
    const errorResult = await testEndpoint('/api/auth', 'GET'); // 错误的GET方法
    console.log(`   GET /api/auth (should be 405): ${errorResult.status} ${errorResult.statusText}`);
    
    const missingDataResult = await testEndpoint('/api/auth', 'POST', {});
    console.log(`   POST /api/auth without initData: ${missingDataResult.status} ${missingDataResult.statusText}`);
    console.log();

    // 总结
    console.log('📊 Test Summary:');
    console.log('================');
    const tests = [
      { name: 'OPTIONS CORS', result: optionsResult.status === 200 },
      { name: 'POST /api/auth', result: authResult.status === 200 },
      { name: 'POST /api/play', result: playResult.status === 200 },
      { name: 'GET /api/leaderboard', result: leaderboardResult.status === 200 },
      { name: 'Error handling', result: errorResult.status === 405 }
    ];
    
    tests.forEach(test => {
      console.log(`   ${test.result ? '✅' : '❌'} ${test.name}`);
    });
    
    const passed = tests.filter(t => t.result).length;
    const total = tests.length;
    console.log(`\n   Result: ${passed}/${total} tests passed (${Math.round(passed/total*100)}%)`);
    
    if (passed === total) {
      console.log('\n🎉 All tests passed! API is ready for MVP deployment.');
    } else {
      console.log('\n⚠️ Some tests failed. Check the errors above.');
    }

  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    console.error(error.stack);
  }
}

// 运行测试
runTests().catch(console.error);