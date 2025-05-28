# 3D贪吃蛇游戏

这是一个使用Three.js构建的3D贪吃蛇游戏，已集成到React游戏平台中。

## 功能特性

### 🎮 游戏玩法

- 经典贪吃蛇规则的3D版本
- 控制蛇在3D空间中移动，吃食物获得分数
- 避免撞到障碍物（石头、树木）和自己的身体
- 蛇会随着吃到食物而增长

### 🎨 视觉效果

- 三种精美的色彩主题：森林绿、夕阳橙、梦幻紫
- 实时阴影和光照效果
- 平滑的3D动画和视角控制
- 响应式设计，支持移动端

### 🕹️ 控制方式

- **键盘控制**：方向键或WASD控制蛇的移动
- **触摸控制**：移动端支持滑动手势
- **视角控制**：鼠标拖拽旋转视角观察
- **快捷键**：空格键暂停/继续游戏

## 技术架构

### 核心类

- `SnakeGame`: 主游戏类，负责整体游戏逻辑
- `Snake`: 贪吃蛇实体，包含移动、生长、碰撞检测
- `Entity`: 游戏实体基类
- `Candy`: 食物实体
- `Rock` & `Tree`: 障碍物实体

### 数据结构

- `LinkedList`: 自定义链表，用于管理蛇身
- `ListNode`: 链表节点

### 工具模块

- `Lights`: 光照设置
- `Params`: 游戏参数配置
- `types`: TypeScript类型定义

## 使用方法

### 在React组件中使用

```typescript
import SnakeGame from '../lib/three-snake/SnakeGame';
import { GameEvent } from '../lib/three-snake/types';

// 创建游戏实例
const gameRef = useRef<SnakeGame | null>(null);
const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!containerRef.current) return;

  const handleGameEvent = (event: GameEvent) => {
    // 处理游戏事件
  };

  gameRef.current = new SnakeGame(containerRef.current, handleGameEvent);

  return () => {
    if (gameRef.current) {
      gameRef.current.destroy();
    }
  };
}, []);

// 游戏控制
gameRef.current?.startGame();
gameRef.current?.togglePause();
gameRef.current?.resetGame();
gameRef.current?.applyPalette('orange');
```

### 游戏事件

游戏会触发以下事件：

- `score`: 分数更新
- `gameOver`: 游戏结束
- `start`: 游戏开始
- `pause`: 游戏暂停
- `resume`: 游戏继续

## 依赖项

- `three`: 3D图形库
- `@types/three`: Three.js类型定义
- `gsap`: 动画库（可选）
- `lil-gui`: 调试界面（可选）

## 配置选项

可以通过修改 `Params.ts` 调整游戏配置：

```typescript
export const resolution = new THREE.Vector2(20, 20); // 游戏网格大小
export const gameSpeed = 500; // 游戏速度（毫秒）
export const isMobile = window.innerWidth <= 768; // 移动端检测
```
