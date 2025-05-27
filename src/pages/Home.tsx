import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            欢迎来到游戏世界
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            探索精彩的游戏体验，发现无限可能。这里是您游戏冒险的起点！
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold mb-2">经典游戏</h3>
              <p className="text-gray-600">重温经典，体验怀旧游戏的魅力</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">新游戏</h3>
              <p className="text-gray-600">最新发布的精品游戏等您体验</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-2">竞技场</h3>
              <p className="text-gray-600">与全球玩家一较高下的竞技平台</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 
