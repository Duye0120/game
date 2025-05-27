import React from 'react';

const Games: React.FC = () => {
  const games = [
    {
      id: 1,
      title: "太空探险",
      description: "在浩瀚宇宙中探索未知星球，体验刺激的太空冒险",
      image: "🚀",
      category: "冒险",
      players: "1-4人",
      difficulty: "中等"
    },
    {
      id: 2,
      title: "魔法世界",
      description: "使用神奇魔法，在奇幻世界中展开史诗般的冒险",
      image: "🧙‍♂️",
      category: "RPG",
      players: "单人",
      difficulty: "困难"
    },
    {
      id: 3,
      title: "赛车竞速",
      description: "驾驶超级跑车，在各种赛道上挑战速度极限",
      image: "🏎️",
      category: "竞速",
      players: "1-8人",
      difficulty: "简单"
    },
    {
      id: 4,
      title: "建造帝国",
      description: "建设城市，管理资源，打造属于你的文明帝国",
      image: "🏰",
      category: "策略",
      players: "1-6人",
      difficulty: "中等"
    },
    {
      id: 5,
      title: "海盗宝藏",
      description: "成为海盗船长，寻找传说中的宝藏和失落的岛屿",
      image: "🏴‍☠️",
      category: "冒险",
      players: "2-4人",
      difficulty: "中等"
    },
    {
      id: 6,
      title: "机器人大战",
      description: "操控机甲战士，在未来战场上展开激烈的战斗",
      image: "🤖",
      category: "动作",
      players: "1-2人",
      difficulty: "困难"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            精品游戏
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            发现我们精心挑选的游戏收藏，每一款都承载着无限的乐趣和挑战
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <div key={game.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="p-6">
                <div className="text-6xl text-center mb-4">{game.image}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  {game.title}
                </h3>
                <p className="text-gray-600 mb-4 text-center leading-relaxed">
                  {game.description}
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">类型:</span>
                    <span className="text-sm text-gray-700">{game.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">玩家:</span>
                    <span className="text-sm text-gray-700">{game.players}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">难度:</span>
                    <span className={`text-sm font-medium ${
                      game.difficulty === '简单' ? 'text-green-600' :
                      game.difficulty === '中等' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {game.difficulty}
                    </span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                  开始游戏
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games; 
