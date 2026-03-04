import crypto from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN || '';

/**
 * 验证Telegram Mini App initData签名
 * @param {string} initData - Telegram WebApp.initData字符串
 * @returns {boolean} 签名是否有效
 */
function validateTelegramInitData(initData) {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    
    if (!hash) {
      console.error('No hash found in initData');
      return false;
    }
    
    // 删除hash参数并按字母顺序排序
    params.delete('hash');
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');
    
    // 计算HMAC-SHA256签名
    const secretKey = crypto.createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest();
    
    const calculatedHash = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    
    const isValid = calculatedHash === hash;
    
    if (!isValid) {
      console.error('Telegram signature validation failed');
      console.error('Expected hash:', hash);
      console.error('Calculated hash:', calculatedHash);
      console.error('Data check string:', dataCheckString);
    }
    
    return isValid;
  } catch (error) {
    console.error('Error validating Telegram initData:', error);
    return false;
  }
}

/**
 * 从initData解析用户信息
 * @param {string} initData - Telegram WebApp.initData字符串
 * @returns {object} 用户信息
 */
function parseUserFromInitData(initData) {
  try {
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    
    if (!userStr) {
      return {
        id: 'anonymous_' + Date.now(),
        name: 'Anonymous Player',
        telegramId: null,
        username: null
      };
    }
    
    const user = JSON.parse(userStr);
    return {
      id: `telegram_${user.id}`,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Telegram User',
      telegramId: user.id,
      username: user.username,
      languageCode: user.language_code,
      isPremium: user.is_premium || false
    };
  } catch (error) {
    console.error('Error parsing user from initData:', error);
    return {
      id: 'error_' + Date.now(),
      name: 'Error User',
      telegramId: null,
      username: null
    };
  }
}

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只处理POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    if (!BOT_TOKEN) {
      return res.status(500).json({
        success: false,
        error: 'Server misconfigured: BOT_TOKEN is missing'
      });
    }

    const { initData } = req.body;

    if (!initData) {
      return res.status(400).json({
        success: false,
        error: 'initData is required'
      });
    }

    // 验证Telegram签名
    const isValid = validateTelegramInitData(initData);
    
    if (!isValid) {
      // 开发环境下，可以暂时跳过验证用于测试
      const isDevelopment = process.env.NODE_ENV === 'development';
      if (isDevelopment) {
        console.warn('⚠️ Development mode: Skipping Telegram signature validation');
      } else {
        return res.status(401).json({
          success: false,
          error: 'Invalid Telegram signature'
        });
      }
    }

    // 解析用户信息
    const user = parseUserFromInitData(initData);

    // 返回成功响应
    return res.status(200).json({
      success: true,
      user: {
        ...user,
        sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        authenticatedAt: new Date().toISOString(),
        authMethod: 'telegram'
      }
    });

  } catch (error) {
    console.error('Auth API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
