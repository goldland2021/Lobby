// 模拟排行榜数据
const mockLeaderboard = [
  { rank: 1, userId: 'user_001', name: '冠军王', score: 12500, gamesPlayed: 42, winRate: '68%', avatar: '👑' },
  { rank: 2, userId: 'user_002', name: '闪电侠', score: 11200, gamesPlayed: 38, winRate: '61%', avatar: '⚡' },
  { rank: 3, userId: 'user_003', name: '幸运星', score: 9800, gamesPlayed: 35, winRate: '57%', avatar: '⭐' },
  { rank: 4, userId: 'user_004', name: '赛马高手', score: 8450, gamesPlayed: 31, winRate: '52%', avatar: '🏇' },
  { rank: 5, userId: 'user_005', name: '黄金骑士', score: 7200, gamesPlayed: 28, winRate: '48%', avatar: '🛡️' },
  { rank: 6, userId: 'user_006', name: '疾风之影', score: 6100, gamesPlayed: 25, winRate: '44%', avatar: '🌪️' },
  { rank: 7, userId: 'user_007', name: '不败神话', score: 5300, gamesPlayed: 22, winRate: '41%', avatar: '💎' },
  { rank: 8, userId: 'user_008', name: '追风少年', score: 4700, gamesPlayed: 20, winRate: '38%', avatar: '🌬️' },
  { rank: 9, userId: 'user_009', name: '彩虹骑士', score: 4200, gamesPlayed: 18, winRate: '35%', avatar: '🌈' },
  { rank: 10, userId: 'user_010', name: '新手玩家', score: 3800, gamesPlayed: 15, winRate: '32%', avatar: '🐴' }
];

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

  // 只处理GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.'
    });
  }

  try {
    const { limit = 10, offset = 0 } = req.query;
    
    // 模拟分页
    const start = parseInt(offset) || 0;
    const end = start + (parseInt(limit) || 10);
    const paginatedData = mockLeaderboard.slice(start, end);

    // 添加当前用户排名（模拟）
    const currentUser = {
      rank: 15,
      userId: 'current_user',
      name: '当前玩家',
      score: 2500,
      gamesPlayed: 12,
      winRate: '42%',
      avatar: '😎',
      isCurrentUser: true
    };

    return res.status(200).json({
      success: true,
      leaderboard: paginatedData,
      currentUser: currentUser,
      pagination: {
        total: mockLeaderboard.length,
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0,
        hasMore: end < mockLeaderboard.length
      },
      stats: {
        totalPlayers: 156,
        averageScore: 5200,
        topScore: 12500,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}