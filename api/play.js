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
    // 模拟游戏结果
    const horses = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: `Horse ${i + 1}`,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][i],
      finishTime: 4.5 + Math.random() * 2, // 4.5-6.5秒
      speed: 0.8 + Math.random() * 0.4 // 0.8-1.2
    }));

    // 按完成时间排序
    horses.sort((a, b) => a.finishTime - b.finishTime);

    // 确定玩家选择的马（随机）
    const playerHorseIndex = Math.floor(Math.random() * 6);
    const playerHorse = horses[playerHorseIndex];
    const playerPosition = playerHorseIndex + 1;

    // 计算奖励
    const baseReward = 100;
    const positionMultiplier = [2.0, 1.5, 1.2, 1.0, 0.8, 0.5][playerHorseIndex] || 1.0;
    const reward = Math.round(baseReward * positionMultiplier);

    // 返回游戏结果
    return res.status(200).json({
      success: true,
      result: {
        raceId: 'race_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        horses: horses.map((horse, index) => ({
          ...horse,
          position: index + 1,
          finishTime: parseFloat(horse.finishTime.toFixed(2))
        })),
        player: {
          horseId: playerHorse.id,
          horseName: playerHorse.name,
          position: playerPosition,
          reward: reward,
          coins: reward
        },
        stats: {
          totalPlayers: 1,
          fastestTime: parseFloat(horses[0].finishTime.toFixed(2)),
          slowestTime: parseFloat(horses[5].finishTime.toFixed(2)),
          averageTime: parseFloat((horses.reduce((sum, h) => sum + h.finishTime, 0) / 6).toFixed(2))
        }
      }
    });

  } catch (error) {
    console.error('Play API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}