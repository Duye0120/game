import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="relative">
          {/* 旋转的游戏手柄 */}
          <div className="text-8xl mb-6 animate-bounce">🎮</div>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">加载中...</h2>
        <p className="text-gray-600">正在为您准备精彩内容</p>
        
        {/* 进度条动画 */}
        <div className="mt-6 w-64 mx-auto">
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 
