import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 mb-8 text-center">
            关于我们
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                我们的使命
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                致力于为玩家提供最优质的游戏体验。我们相信游戏不仅仅是娱乐，
                更是连接人心、激发创造力的桥梁。
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                通过不断创新和优化，我们努力打造一个充满乐趣、公平竞争、
                友好互动的游戏社区。
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  <span className="text-gray-700">创新游戏体验</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🤝</span>
                  <span className="text-gray-700">建设友好社区</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚡</span>
                  <span className="text-gray-700">持续技术革新</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">团队数据</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-600">团队成员</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">100万+</div>
                  <div className="text-gray-600">注册用户</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
                  <div className="text-gray-600">精品游戏</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">5年+</div>
                  <div className="text-gray-600">行业经验</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 
