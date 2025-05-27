import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl mb-8">🎮</div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">页面未找到</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          抱歉，您访问的页面似乎迷失在了游戏世界的某个角落...
        </p>
        <div className="space-y-4">
          <Link 
            to="/" 
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            返回首页
          </Link>
          <div className="mt-4">
            <Link 
              to="/games" 
              className="inline-block text-blue-600 hover:text-blue-800 font-medium underline"
            >
              或者去看看我们的游戏
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 
