import React from 'react';
import GameButton from '../components/GameButton';

const Home: React.FC = () => {
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

  const scrollToGames = () => {
    const gamesSection = document.getElementById('games-section');
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* 首页大屏区域 */}
      <section className="h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-8 leading-tight">
              欢迎来到
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                游戏世界
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              探索精彩的游戏体验，发现无限可能。在这里，每一个游戏都是一次全新的冒险，
              每一次点击都将开启属于您的游戏传奇！
            </p>
            
            {/* 特色介绍卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">😴</div>
                <h3 className="text-xl font-semibold mb-2">告别无聊</h3>
                <p className="text-gray-600">专为闲暇时光打造，再也不用发愁没事干</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">即点即玩</h3>
                <p className="text-gray-600">精选有趣内容，一键启动，让你快速找到乐趣</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">私人定制</h3>
                <p className="text-gray-600">根据个人喜好收集的游戏，专治选择困难症</p>
              </div>
            </div>

            {/* 向下滚动按钮 */}
            <button 
              onClick={scrollToGames}
              className="group bg-white/20 backdrop-blur-sm border border-white/30 text-gray-800 px-8 py-4 rounded-full hover:bg-white/30 transition-all duration-300 inline-flex items-center"
            >
              <span className="mr-3">开始探索游戏</span>
              <svg 
                className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 向下箭头指示器 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* 游戏列表区域 */}
      <section id="games-section" className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              精品游戏收藏
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              发现我们精心挑选的游戏收藏，每一款都承载着无限的乐趣和挑战。
              从经典怀旧到创新前沿，总有一款游戏适合您的品味。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <div 
                key={game.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="p-6">
                  <div className="text-6xl text-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {game.image}
                  </div>
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
                  <GameButton gameId={game.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
