import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, RotateCcw, Trophy, Timer, Target, Settings, Star, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 游戏配置类型
type GridSize = 3 | 5 | 9;
type Difficulty = 'easy' | 'normal' | 'hard';

interface GameConfig {
  gridSize: GridSize;
  difficulty: Difficulty;
}

// 游戏记录类型
interface GameRecord {
  gridSize: GridSize;
  difficulty: Difficulty;
  time: number;
  mistakes: number;
  date: string;
  score: number; // 综合评分
}

// 最高记录类型
interface BestRecords {
  [key: string]: GameRecord; // key 格式: "gridSize-difficulty"
}

const SchulteGrid: React.FC = () => {
  const navigate = useNavigate();
  
  // 游戏配置状态
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    gridSize: 5,
    difficulty: 'easy'
  });
  
  // 游戏状态
  const [grid, setGrid] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [clickedNumbers, setClickedNumbers] = useState<Set<number>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSettings, setShowSettings] = useState(true);
  
  // 记录相关状态
  const [bestRecords, setBestRecords] = useState<BestRecords>({});
  const [isNewRecord, setIsNewRecord] = useState(false);

  // 本地存储key
  const STORAGE_KEY = 'schulte-grid-records';

  // 加载本地记录
  const loadBestRecords = useCallback(() => {
    try {
      const savedRecords = localStorage.getItem(STORAGE_KEY);
      if (savedRecords) {
        const records = JSON.parse(savedRecords) as BestRecords;
        setBestRecords(records);
      }
    } catch (error) {
      console.error('加载记录失败:', error);
    }
  }, []);

  // 保存记录到本地存储
  const saveBestRecords = useCallback((records: BestRecords) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      setBestRecords(records);
    } catch (error) {
      console.error('保存记录失败:', error);
    }
  }, []);

  // 计算游戏得分 (时间越短、错误越少得分越高)
  const calculateScore = (time: number, mistakes: number, gridSize: GridSize) => {
    const baseScore = 10000;
    const timePenalty = time * (gridSize * 2); // 根据网格大小调整时间惩罚
    const mistakePenalty = mistakes * 100;
    return Math.max(baseScore - timePenalty - mistakePenalty, 0);
  };

  // 获取记录键
  const getRecordKey = (gridSize: GridSize, difficulty: Difficulty) => {
    return `${gridSize}-${difficulty}`;
  };

  // 检查并更新最高记录
  const checkAndUpdateRecord = useCallback((time: number, mistakes: number) => {
    const recordKey = getRecordKey(gameConfig.gridSize, gameConfig.difficulty);
    const currentRecord = bestRecords[recordKey];
    const score = calculateScore(time, mistakes, gameConfig.gridSize);
    
    let shouldUpdate = false;
    
    if (!currentRecord) {
      // 没有记录，直接保存
      shouldUpdate = true;
    } else {
      // 比较得分，得分更高则更新记录
      if (score > currentRecord.score) {
        shouldUpdate = true;
      }
    }
    
    if (shouldUpdate) {
      const newRecord: GameRecord = {
        gridSize: gameConfig.gridSize,
        difficulty: gameConfig.difficulty,
        time,
        mistakes,
        date: new Date().toLocaleDateString('zh-CN'),
        score
      };
      
      const updatedRecords = {
        ...bestRecords,
        [recordKey]: newRecord
      };
      
      saveBestRecords(updatedRecords);
      setIsNewRecord(true);
      return true;
    }
    
    return false;
  }, [bestRecords, gameConfig, saveBestRecords]);

  // 获取当前配置的最高记录
  const getCurrentBestRecord = () => {
    const recordKey = getRecordKey(gameConfig.gridSize, gameConfig.difficulty);
    return bestRecords[recordKey];
  };

  // 获取总数字数量
  const getTotalNumbers = () => gameConfig.gridSize * gameConfig.gridSize;

  // 生成随机排列的数字
  const generateGrid = useCallback(() => {
    const totalNumbers = getTotalNumbers();
    const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
  }, [gameConfig.gridSize]);

  // 初始化游戏
  const initializeGame = useCallback(() => {
    setGrid(generateGrid());
    setCurrentNumber(1);
    setStartTime(null);
    setEndTime(null);
    setIsGameStarted(false);
    setIsGameCompleted(false);
    setClickedNumbers(new Set());
    setMistakes(0);
    setCurrentTime(0);
    setShowSettings(true);
  }, [generateGrid]);

  // 开始游戏
  const startGame = () => {
    setStartTime(Date.now());
    setIsGameStarted(true);
    setCurrentTime(0);
    setShowSettings(false);
  };

  // 处理方格点击
  const handleCellClick = (number: number) => {
    if (!isGameStarted || isGameCompleted) return;

    if (number === currentNumber) {
      // 正确点击
      setClickedNumbers(prev => new Set([...prev, number]));
      
      if (number === getTotalNumbers()) {
        // 游戏完成
        const completionTime = Date.now();
        setEndTime(completionTime);
        setIsGameCompleted(true);
        
        // 检查并更新记录
        const gameTime = Math.round((completionTime - (startTime || 0)) / 1000);
        checkAndUpdateRecord(gameTime, mistakes);
      } else {
        setCurrentNumber(prev => prev + 1);
      }
    } else {
      // 错误点击
      setMistakes(prev => prev + 1);
    }
  };

  // 重新开始游戏
  const restartGame = () => {
    initializeGame();
    setIsNewRecord(false);
  };

  // 返回首页
  const goBack = () => {
    navigate('/');
  };

  // 计算游戏时间
  const getGameTime = () => {
    if (!startTime) return 0;
    if (endTime) {
      // 游戏已结束，返回最终时间
      return Math.round((endTime - startTime) / 1000);
    }
    // 游戏进行中，返回当前时间
    return currentTime;
  };

  // 获取成绩评价
  const getPerformanceRating = () => {
    const time = getGameTime();
    const totalNumbers = getTotalNumbers();
    const errorRate = mistakes / totalNumbers;

    // 根据网格大小调整评分标准
    const timeThresholds = {
      3: { excellent: 15, good: 25, average: 40 },
      5: { excellent: 30, good: 45, average: 60 },
      9: { excellent: 120, good: 180, average: 240 }
    };

    const thresholds = timeThresholds[gameConfig.gridSize];

    if (time <= thresholds.excellent && errorRate <= 0.1) return { text: '优秀', color: 'text-green-600', variant: 'default' as const };
    if (time <= thresholds.good && errorRate <= 0.2) return { text: '良好', color: 'text-blue-600', variant: 'secondary' as const };
    if (time <= thresholds.average && errorRate <= 0.3) return { text: '一般', color: 'text-yellow-600', variant: 'outline' as const };
    return { text: '需要练习', color: 'text-red-600', variant: 'destructive' as const };
  };

  // 获取难度名称
  const getDifficultyName = (difficulty: Difficulty) => {
    const difficultyNames = {
      easy: '简单',
      normal: '普通',
      hard: '困难'
    };
    return difficultyNames[difficulty];
  };

  // 获取网格大小名称
  const getGridSizeName = (size: GridSize) => {
    return `${size}×${size}`;
  };

  // 获取方格样式
  const getCellStyle = (number: number) => {
    const baseStyle = `w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-sm sm:text-base lg:text-lg font-bold rounded-lg border-2 transition-all duration-200 select-none game-grid-button`;
    
    if (!isGameStarted || isGameCompleted) {
      return `${baseStyle} cursor-not-allowed opacity-50 bg-white border-gray-300`;
    }

    // 根据难度级别决定样式
    switch (gameConfig.difficulty) {
      case 'easy':
        // 简单模式：有提示
        if (clickedNumbers.has(number)) {
          return `${baseStyle} bg-green-500 text-white border-green-600 scale-95 cursor-pointer`;
        } else if (number === currentNumber) {
          return `${baseStyle} bg-blue-100 border-blue-400 hover:bg-blue-200 cursor-pointer hover:scale-105`;
        } else {
          return `${baseStyle} bg-white border-gray-300 hover:bg-gray-50 cursor-pointer hover:scale-105`;
        }
      
      case 'normal':
        // 普通模式：点击后改变颜色，但无当前目标提示
        if (clickedNumbers.has(number)) {
          return `${baseStyle} bg-green-500 text-white border-green-600 scale-95 cursor-pointer`;
        } else {
          return `${baseStyle} bg-white border-gray-300 hover:bg-gray-50 cursor-pointer hover:scale-105`;
        }
      
      case 'hard':
        // 困难模式：点击后颜色不变
        return `${baseStyle} bg-white border-gray-300 hover:bg-gray-50 cursor-pointer hover:scale-105`;
      
      default:
        return `${baseStyle} bg-white border-gray-300 cursor-pointer`;
    }
  };

  // 处理网格大小变更
  const handleGridSizeChange = (value: string) => {
    const gridSize = parseInt(value) as GridSize;
    setGameConfig(prev => ({ ...prev, gridSize }));
    setIsNewRecord(false); // 重置新记录状态
  };

  // 处理难度变更
  const handleDifficultyChange = (value: string) => {
    const difficulty = value as Difficulty;
    setGameConfig(prev => ({ ...prev, difficulty }));
    setIsNewRecord(false); // 重置新记录状态
  };

  // 实时更新游戏时间
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isGameStarted && !isGameCompleted && startTime) {
      // 立即更新一次时间
      const updateTime = () => {
        const now = Date.now();
        const elapsed = Math.round((now - startTime) / 1000);
        setCurrentTime(elapsed);
      };
      
      updateTime(); // 立即执行一次
      interval = setInterval(updateTime, 100); // 每100ms更新一次，更精确
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isGameStarted, isGameCompleted, startTime]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // 页面加载时初始化记录
  useEffect(() => {
    loadBestRecords();
  }, [loadBestRecords]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 select-none">
      <div className="container mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={goBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">舒尔特方格</h1>
            <p className="text-gray-600">按数字顺序依次点击方格</p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={restartGame}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            重新开始
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 游戏信息和设置 */}
          <div className="flex-none lg:w-80 space-y-4">
            {/* 游戏设置 */}
            {showSettings && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    游戏设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">网格大小</label>
                    <Select 
                      value={gameConfig.gridSize.toString()} 
                      onValueChange={handleGridSizeChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3×3 (9个数字)</SelectItem>
                        <SelectItem value="5">5×5 (25个数字)</SelectItem>
                        <SelectItem value="9">9×9 (81个数字)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">难度级别</label>
                    <Select 
                      value={gameConfig.difficulty} 
                      onValueChange={handleDifficultyChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">简单 - 有当前目标提示</SelectItem>
                        <SelectItem value="normal">普通 - 点击后显示状态</SelectItem>
                        <SelectItem value="hard">困难 - 无任何提示</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 游戏状态 */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  游戏状态
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">当前配置:</span>
                  <div className="flex gap-1">
                    <Badge variant="outline">{getGridSizeName(gameConfig.gridSize)}</Badge>
                    <Badge variant="secondary">{getDifficultyName(gameConfig.difficulty)}</Badge>
                  </div>
                </div>

                {(gameConfig.difficulty === 'easy' || isGameCompleted) && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">当前目标:</span>
                    <Badge variant="default" className="text-lg px-3 py-1">
                      {currentNumber}
                    </Badge>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">游戏时间:</span>
                  <div className="flex items-center gap-1">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-lg">{getGameTime()}s</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">错误次数:</span>
                  <span className="text-red-600 font-bold">{mistakes}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">进度:</span>
                  <span className="text-blue-600 font-bold">{clickedNumbers.size}/{getTotalNumbers()}</span>
                </div>
              </CardContent>
            </Card>

            {/* 游戏规则 */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>游戏规则</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• 按数字1-{getTotalNumbers()}的顺序依次点击</li>
                  <li>• 点击错误不会影响游戏进度</li>
                  <li>• 目标是用最短时间完成</li>
                  <li>• 训练专注力和视觉搜索能力</li>
                  {gameConfig.difficulty === 'easy' && <li>• 简单模式：蓝色高亮显示当前目标</li>}
                  {gameConfig.difficulty === 'normal' && <li>• 普通模式：点击正确后方格变绿</li>}
                  {gameConfig.difficulty === 'hard' && <li>• 困难模式：无任何视觉提示</li>}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 游戏区域 */}
          <div className="flex-grow">
            <Card className="h-fit">
              <CardContent className="p-6">
                {!isGameStarted && !isGameCompleted ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-6">🎯</div>
                    <h2 className="text-2xl font-bold mb-4">准备开始挑战？</h2>
                    <p className="text-muted-foreground mb-8">
                      当前配置：{getGridSizeName(gameConfig.gridSize)} {getDifficultyName(gameConfig.difficulty)}模式
                    </p>
                    <Button onClick={startGame} size="lg" className="px-8">
                      开始游戏
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* 游戏方格 */}
                    <div className="flex justify-center items-center mb-6 w-full">
                      <div 
                        className="grid gap-1 sm:gap-2"
                        style={{
                          gridTemplateColumns: `repeat(${gameConfig.gridSize}, 1fr)`,
                          maxWidth: gameConfig.gridSize === 3 ? '200px' : gameConfig.gridSize === 5 ? '320px' : '480px'
                        }}
                      >
                        {grid.map((number, index) => (
                          <button
                            key={index}
                            onClick={() => handleCellClick(number)}
                            className={getCellStyle(number)}
                            disabled={!isGameStarted || isGameCompleted}
                            onMouseDown={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                          >
                            {number}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 游戏完成 */}
                    {isGameCompleted && (
                      <div className="text-center py-6 border-t">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <Trophy className="h-8 w-8 text-yellow-600" />
                          <h2 className="text-3xl font-bold text-yellow-600">恭喜完成！</h2>
                          {isNewRecord && (
                            <Badge variant="destructive" className="animate-pulse ml-2">
                              🎉 新记录!
                            </Badge>
                          )}
                        </div>

                        {isNewRecord && (
                          <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                            <p className="text-yellow-800 font-semibold">
                              🏆 恭喜！您在 {getGridSizeName(gameConfig.gridSize)} {getDifficultyName(gameConfig.difficulty)} 模式下创造了新记录！
                            </p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{getGameTime()}s</div>
                            <div className="text-sm text-muted-foreground">完成时间</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{mistakes}</div>
                            <div className="text-sm text-muted-foreground">错误次数</div>
                          </div>
                          <div className="text-center">
                            <Badge variant={getPerformanceRating().variant} className="text-lg px-3 py-1">
                              {getPerformanceRating().text}
                            </Badge>
                          </div>
                        </div>

                        {/* 显示得分信息 */}
                        <div className="mb-6 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-700 mb-1">综合得分</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {calculateScore(getGameTime(), mistakes, gameConfig.gridSize).toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex gap-4 justify-center">
                          <Button onClick={restartGame} variant="default">
                            再玩一次
                          </Button>
                          <Button onClick={goBack} variant="outline">
                            返回首页
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 最高记录区域 */}
          <div className="flex-none lg:w-80 space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  最高记录
                </CardTitle>
                <CardDescription>
                  当前配置: {getGridSizeName(gameConfig.gridSize)} {getDifficultyName(gameConfig.difficulty)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const currentBest = getCurrentBestRecord();
                  if (currentBest) {
                    return (
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Award className="h-5 w-5 text-yellow-600" />
                            <span className="font-semibold text-yellow-800">个人最佳</span>
                            {isNewRecord && (
                              <Badge variant="destructive" className="text-xs animate-pulse">
                                新记录!
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">最短时间:</span>
                              <div className="font-bold text-lg text-blue-600">{currentBest.time}s</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">最少错误:</span>
                              <div className="font-bold text-lg text-green-600">{currentBest.mistakes}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">综合得分:</span>
                              <div className="font-bold text-lg text-purple-600">{currentBest.score.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">达成日期:</span>
                              <div className="font-medium text-gray-700">{currentBest.date}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🏆</div>
                        <p className="text-muted-foreground mb-4">
                          当前配置暂无记录
                        </p>
                        <p className="text-sm text-muted-foreground">
                          完成第一局游戏来创建记录！
                        </p>
                      </div>
                    );
                  }
                })()}
              </CardContent>
            </Card>

            {/* 全部记录 */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  历史记录
                </CardTitle>
                <CardDescription>
                  所有配置的最佳成绩
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(bestRecords).length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {Object.entries(bestRecords)
                      .sort((a, b) => b[1].score - a[1].score) // 按得分排序
                      .map(([key, record]) => {
                        const [gridSize, difficulty] = key.split('-');
                        return (
                          <div 
                            key={key} 
                            className={`p-3 rounded-lg border transition-all ${
                              key === getRecordKey(gameConfig.gridSize, gameConfig.difficulty)
                                ? 'bg-blue-50 border-blue-200' 
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {getGridSizeName(parseInt(gridSize) as GridSize)}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {getDifficultyName(difficulty as Difficulty)}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {record.date}
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">时间:</span>
                                <div className="font-semibold text-blue-600">{record.time}s</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">错误:</span>
                                <div className="font-semibold text-red-600">{record.mistakes}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">得分:</span>
                                <div className="font-semibold text-purple-600">{record.score.toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-3xl mb-3">📊</div>
                    <p className="text-muted-foreground text-sm">
                      暂无历史记录
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 记录说明 */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">记录说明</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• 记录按不同网格大小和难度分别保存</li>
                  <li>• 综合得分 = 基础分 - 时间惩罚 - 错误惩罚</li>
                  <li>• 得分越高记录越好</li>
                  <li>• 所有记录本地保存，不会丢失</li>
                  <li>• 新记录会有特殊标识提醒</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchulteGrid; 
