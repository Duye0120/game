import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Home } from 'lucide-react';
import SnakeGame from '../lib/three-snake/SnakeGame';
import { GameState, GameEvent } from '../lib/three-snake/types';

const Snake3D: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<SnakeGame | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    isPlaying: false,
    isPaused: false,
    gameOver: false
  });
  const [selectedPalette, setSelectedPalette] = useState('orange');
  const [isMuted, setIsMuted] = useState(false);
 
  const palettes = [
    { name: 'green', label: '森林绿', color: '#4caf50' },
    { name: 'orange', label: '夕阳橙', color: '#ff9800' },
    { name: 'lilac', label: '梦幻紫', color: '#9c27b0' }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const handleGameEvent = (event: GameEvent) => {
      switch (event.type) {
        case 'score':
          setGameState(prev => ({ ...prev, score: event.data.score }));
          break;
        case 'gameOver':
          setGameState(prev => ({ ...prev, gameOver: true, isPlaying: false }));
          break;
        case 'start':
          setGameState(prev => ({ ...prev, isPlaying: true, gameOver: false, isPaused: false }));
          break;
        case 'pause':
          setGameState(prev => ({ ...prev, isPaused: true }));
          break;
        case 'resume':
          setGameState(prev => ({ ...prev, isPaused: false }));
          break;
      }
    };

    gameRef.current = new SnakeGame(containerRef.current, handleGameEvent);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy();
      }
    };
  }, []);

  const handleStartGame = () => {
    if (gameRef.current) {
      gameRef.current.startGame();
    }
  };

  const handlePauseGame = () => {
    if (gameRef.current) {
      gameRef.current.togglePause();
    }
  };

  const handleResetGame = () => {
    if (gameRef.current) {
      gameRef.current.resetGame();
    }
  };

  const handlePaletteChange = (paletteName: string) => {
    setSelectedPalette(paletteName);
    if (gameRef.current) {
      gameRef.current.applyPalette(paletteName);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    // 这里可以添加音频控制逻辑
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const getGameStatusText = () => {
    if (gameState.gameOver) return '游戏结束';
    if (gameState.isPaused) return '游戏暂停';
    if (gameState.isPlaying) return '游戏中';
    return '准备开始';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-300 via-orange-400 to-yellow-500">
      {/* 游戏容器 */}
      <div className="relative w-full h-screen">
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{ background: 'transparent' }}
        />

        {/* 游戏UI覆盖层 */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 右上角返回首页按钮 */}
          <div className="absolute top-4 right-4 pointer-events-auto z-50">
            <Button
              onClick={handleBackToHome}
              variant="outline"
              size="icon"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
              title="返回首页"
            >
              <Home className="h-4 w-4" />
            </Button>
          </div>

          {/* 左侧控制区域 */}
          <div className="absolute left-4 top-4 pointer-events-auto z-50">
            <div className="flex flex-col space-y-3">
              {/* 相机控制按钮 */}
              <Button
                variant="outline"
                size="icon"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                title="重置视角"
                onClick={() => {
                  // 重置相机视角的逻辑
                }}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </Button>
              
              {/* 暂停/快进控制 */}
              <Button
                onClick={handlePauseGame}
                variant="outline"
                size="icon"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                title={gameState.isPaused ? '继续游戏' : '暂停游戏'}
                disabled={!gameState.isPlaying}
              >
                {gameState.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>

              {/* 重置按钮 */}
              <Button
                onClick={handleResetGame}
                variant="outline"
                size="icon"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                title="重置游戏"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              {/* 音频控制 */}
              <Button
                onClick={toggleMute}
                variant="outline"
                size="icon"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                title={isMuted ? '取消静音' : '静音'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* 左下角色彩主题选择器 */}
          <div className="absolute left-4 bottom-4 pointer-events-auto z-50">
            <div className="flex flex-col space-y-2">
              {palettes.map((palette) => (
                <button
                  key={palette.name}
                  onClick={() => handlePaletteChange(palette.name)}
                  className={`w-12 h-12 rounded-full border-3 transition-all duration-200 hover:scale-110 ${
                    selectedPalette === palette.name
                      ? 'border-white shadow-lg scale-110'
                      : 'border-white/50'
                  }`}
                  style={{ backgroundColor: palette.color }}
                  title={palette.label}
                />
              ))}
            </div>
          </div>

          {/* 顶部分数显示 */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="text-white text-center">
                <div className="text-3xl font-bold">{gameState.score}</div>
                <div className="text-sm opacity-75">分数</div>
              </div>
            </div>
          </div>

          {/* 中央游戏控制 - 当游戏未开始时显示大型PLAY按钮 */}
          {!gameState.isPlaying && !gameState.gameOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
              <Button
                onClick={handleStartGame}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <Play className="w-8 h-8 mr-3" />
                PLAY
                <Volume2 className="w-6 h-6 ml-3" />
              </Button>
            </div>
          )}

          {/* 游戏中的控制面板 */}
          {gameState.isPlaying && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="flex items-center space-x-4 text-white">
                  <div className="text-sm">
                    状态: {getGameStatusText()}
                  </div>
                  <div className="w-px h-6 bg-white/30" />
                  <div className="text-sm">
                    使用 WASD 或方向键控制
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 游戏结束弹窗 */}
          {gameState.gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
                <div className="text-2xl font-bold text-gray-800 mb-4">游戏结束!</div>
                <div className="text-6xl font-bold text-orange-500 mb-2">{gameState.score}</div>
                <div className="text-gray-600 mb-6">最终分数</div>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={handleStartGame}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    再玩一次
                  </Button>
                  <Button
                    onClick={handleResetGame}
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-100 px-8 py-3 rounded-full"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    重置
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Snake3D; 
