import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Loader2 } from 'lucide-react';

interface GameButtonProps {
  gameId: number;
}

const GameButton: React.FC<GameButtonProps> = ({ gameId }) => {
  const [isStarting, setIsStarting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStartGame = async () => {
    setIsStarting(true);
    setProgress(0);
    
    try {
      // 模拟游戏启动过程，带进度条
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // 这里可以跳转到游戏页面或者执行其他操作
      console.log(`启动游戏 ${gameId}`);
      
    } catch (error) {
      console.error('启动游戏失败:', error);
    } finally {
      setIsStarting(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-3">
      {isStarting && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
            启动中... {progress}%
          </p>
        </div>
      )}
      
      <Button 
        onClick={handleStartGame}
        disabled={isStarting}
        className="w-full"
        size="lg"
      >
        {isStarting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            启动中...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            开始游戏
          </>
        )}
      </Button>
    </div>
  );
};

export default GameButton; 
