export interface GameParams {
  groundColor: number;
  fogColor: number;
  rockColor: number;
  treeColor: number;
  candyColor: number;
  snakeColor: number;
  mouthColor: number;
}

export interface Palette {
  groundColor: number;
  fogColor: number;
  rockColor: number;
  treeColor: number;
  candyColor: number;
  snakeColor: number;
  mouthColor: number;
}

export interface GameState {
  score: number;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface GameEvent {
  type: 'score' | 'gameOver' | 'start' | 'pause' | 'resume';
  data?: any;
} 
