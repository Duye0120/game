import React, { useState } from 'react';
import MiniLoading from './MiniLoading';

interface GameButtonProps {
  gameId: number;
}

const GameButton: React.FC<GameButtonProps> = ({ gameId }) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartGame = async () => {
    setIsStarting(true);
    
    try {
      // 模拟游戏启动过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 这里可以跳转到游戏页面或者执行其他操作
      console.log(`启动游戏 ${gameId}`);
      
    } catch (error) {
      console.error('启动游戏失败:', error);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <button 
      onClick={handleStartGame}
      disabled={isStarting}
      className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${
        isStarting 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
      }`}
    >
      {isStarting ? (
        <div className="flex items-center justify-center">
          <MiniLoading size="small" text="" />
          <span className="ml-2 text-white">启动中...</span>
        </div>
      ) : (
        '开始游戏'
      )}
    </button>
  );
};

export default GameButton; 
