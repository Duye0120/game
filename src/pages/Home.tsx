import React from 'react';
import GameButton from '../components/GameButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Star, Clock } from 'lucide-react';

const Home: React.FC = () => {
  const games = [
    {
      id: 1,
      title: "舒尔特方格",
      description: "经典的注意力训练游戏，按数字顺序依次点击方格，提升专注力和视觉搜索能力",
      image: "🎯",
      category: "益智",
      players: "单人",
      difficulty: "简单",
      rating: 4.8,
      duration: "2-5分钟"
    }
  ];

  const scrollToGames = () => {
    const gamesSection = document.getElementById('games-section');
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case '简单': return 'default';
      case '中等': return 'secondary';
      case '困难': return 'destructive';
      default: return 'outline';
    }
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case '冒险': return 'default';
      case 'RPG': return 'secondary';
      case '竞速': return 'outline';
      case '策略': return 'default';
      case '动作': return 'destructive';
      case '益智': return 'default';
      default: return 'secondary';
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
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4 text-center">😴</div>
                  <CardTitle className="text-xl mb-2 text-center">告别无聊</CardTitle>
                  <CardDescription className="text-center">专为闲暇时光打造，再也不用发愁没事干</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4 text-center">⚡</div>
                  <CardTitle className="text-xl mb-2 text-center">即点即玩</CardTitle>
                  <CardDescription className="text-center">精选有趣内容，一键启动，让你快速找到乐趣</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4 text-center">🎯</div>
                  <CardTitle className="text-xl mb-2 text-center">私人定制</CardTitle>
                  <CardDescription className="text-center">根据个人喜好收集的游戏，专治选择困难症</CardDescription>
                </CardContent>
              </Card>
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
              <Card key={game.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {game.image}
                  </div>
                  <CardTitle className="text-2xl">{game.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {game.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* 游戏标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant={getCategoryVariant(game.category)}>
                      {game.category}
                    </Badge>
                    <Badge variant={getDifficultyVariant(game.difficulty)}>
                      {game.difficulty}
                    </Badge>
                  </div>
                  
                  {/* 游戏信息 */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">玩家:</span>
                      </div>
                      <span>{game.players}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">时长:</span>
                      </div>
                      <span>{game.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">评分:</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{game.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <GameButton gameId={game.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
