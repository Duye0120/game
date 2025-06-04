import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Snake from './Snake';
import Candy from './Candy';
import Rock from './Rock';
import Tree from './Tree';
import Entity from './Entity';
import createLights from './Lights';
import { resolution, gameSpeed, isMobile } from './Params';
import { GameState, GameEvent, Position, Palette } from './types';

export default class SnakeGame {
  private container: HTMLElement;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private snake!: Snake;
  private candies: Candy[] = [];
  private entities: Entity[] = [];
  private gameState: GameState;
  private gameLoop: NodeJS.Timeout | null = null;
  private planeMaterial!: THREE.MeshStandardMaterial;
  private onGameEvent?: (event: GameEvent) => void;

  // 色彩主题
  private palettes: Record<string, Palette> = {
    green: {
      groundColor: 0x7cb342,
      fogColor: 0x4caf50,
      rockColor: 0xbdbdbd,
      treeColor: 0x2e7d32,
      candyColor: 0xff5722,
      snakeColor: 0x388e3c,
      mouthColor: 0xff5722,
    },
    orange: {
      groundColor: 0xffa726,
      fogColor: 0xff9800,
      rockColor: 0x9e9e9e,
      treeColor: 0x8bc34a,
      candyColor: 0xe91e63,
      snakeColor: 0xff5722,
      mouthColor: 0xe91e63,
    },
    lilac: {
      groundColor: 0xba68c8,
      fogColor: 0x9c27b0,
      rockColor: 0xbdbdbd,
      treeColor: 0x4fc3f7,
      candyColor: 0x673ab7,
      snakeColor: 0xe91e63,
      mouthColor: 0x673ab7,
    },
  };

  private currentPalette = 'orange';

  constructor(container: HTMLElement, onGameEvent?: (event: GameEvent) => void) {
    this.container = container;
    this.onGameEvent = onGameEvent;
    this.gameState = {
      score: 0,
      isPlaying: false,
      isPaused: false,
      gameOver: false
    };

    this.init();
  }

  private init() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupControls();
    this.setupLights();
    this.setupGround();
    this.setupGrid();
    this.resetGame();
    this.setupEventListeners();
    this.animate();
  }

  private setupScene() {
    this.scene = new THREE.Scene();
    const palette = this.palettes[this.currentPalette];
    this.scene.background = new THREE.Color(palette.fogColor);
    this.scene.fog = new THREE.Fog(palette.fogColor, 5, 40);
  }

  private setupCamera() {
    const fov = 60;
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);

    const finalPosition = isMobile
      ? new THREE.Vector3(resolution.x / 2 - 0.5, resolution.x + 15, resolution.y)
      : new THREE.Vector3(resolution.x / 2 - 0.5, resolution.x + 5, resolution.y + 10);

    this.camera.position.copy(finalPosition);
    this.camera.lookAt(resolution.x / 2 - 0.5, 0, resolution.y / 2 - 0.5);
  }

  private setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
  }

  private setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(resolution.x / 2 - 0.5, 0, resolution.y / 2 - 0.5);
  }

  private setupLights() {
    createLights(this.scene);
  }

  private setupGround() {
    const planeGeometry = new THREE.PlaneGeometry(resolution.x, resolution.y);
    this.planeMaterial = new THREE.MeshStandardMaterial({
      color: this.palettes[this.currentPalette].groundColor
    });
    const plane = new THREE.Mesh(planeGeometry, this.planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(resolution.x / 2 - 0.5, -0.5, resolution.y / 2 - 0.5);
    plane.receiveShadow = true;
    this.scene.add(plane);
  }

  private setupGrid() {
    const gridHelper = new THREE.GridHelper(
      resolution.x,
      resolution.y,
      0xffffff,
      0xffffff
    );
    gridHelper.position.set(resolution.x / 2 - 0.5, -0.49, resolution.y / 2 - 0.5);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = isMobile ? 0.75 : 0.3;
    this.scene.add(gridHelper);
  }

  private generateEntities() {
    const entityCount = Math.floor((resolution.x * resolution.y) / 50);

    for (let i = 0; i < entityCount; i++) {
      const freeIndex = this.getFreeIndex();
      if (freeIndex !== -1) {
        const position = Entity.indexToPosition(freeIndex);
        const palette = this.palettes[this.currentPalette];

        const entityType = Math.random();
        if (entityType < 0.5) {
          const rock = new Rock(position, palette.rockColor);
          this.entities.push(rock);
          this.scene.add(rock.mesh);
        } else {
          const tree = new Tree(position, palette.treeColor);
          this.entities.push(tree);
          this.scene.add(tree.mesh);
        }
      }
    }
  }

  private getFreeIndex(): number {
    const maxAttempts = 50;
    for (let i = 0; i < maxAttempts; i++) {
      const index = Math.floor(Math.random() * (resolution.x * resolution.y));
      const position = Entity.indexToPosition(index);

      if (!this.isPositionOccupied(position)) {
        return index;
      }
    }
    return -1;
  }

  private isPositionOccupied(position: Position): boolean {
    // 检查蛇身
    if (this.snake && this.snake.checkCollision(position)) {
      return true;
    }

    // 检查糖果
    for (const candy of this.candies) {
      if (candy.position.x === position.x && candy.position.y === position.y) {
        return true;
      }
    }

    // 检查其他实体
    for (const entity of this.entities) {
      if (entity.position.x === position.x && entity.position.y === position.y) {
        return true;
      }
    }

    return false;
  }

  private addCandy() {
    const freeIndex = this.getFreeIndex();
    if (freeIndex !== -1) {
      const position = Entity.indexToPosition(freeIndex);
      const palette = this.palettes[this.currentPalette];
      const candy = new Candy(position, palette.candyColor);
      this.candies.push(candy);
      this.scene.add(candy.mesh);
    }
  }

  private setupEventListeners() {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!this.gameState.isPlaying) return;

      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          this.snake.setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.snake.setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'KeyA':
          this.snake.setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.snake.setDirection({ x: 1, y: 0 });
          break;
        case 'Space':
          event.preventDefault();
          this.togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // 触摸控制（移动端）
    if (isMobile) {
      this.setupTouchControls();
    }

    // 窗口大小调整
    window.addEventListener('resize', () => this.handleResize());
  }

  private setupTouchControls() {
    let startX = 0;
    let startY = 0;

    this.renderer.domElement.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    this.renderer.domElement.addEventListener('touchend', (e) => {
      if (!this.gameState.isPlaying) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑动
        if (deltaX > 0) {
          this.snake.setDirection({ x: 1, y: 0 });
        } else {
          this.snake.setDirection({ x: -1, y: 0 });
        }
      } else {
        // 垂直滑动
        if (deltaY > 0) {
          this.snake.setDirection({ x: 0, y: 1 });
        } else {
          this.snake.setDirection({ x: 0, y: -1 });
        }
      }
    });
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private gameUpdate() {
    if (!this.gameState.isPlaying || this.gameState.isPaused) return;

    const moved = this.snake.move();
    if (!moved) {
      this.gameOver();
      return;
    }

    // 检查是否吃到糖果
    const snakePosition = this.snake.getPosition();
    for (let i = this.candies.length - 1; i >= 0; i--) {
      const candy = this.candies[i];
      if (candy.position.x === snakePosition.x && candy.position.y === snakePosition.y) {
        // 吃到糖果
        this.scene.remove(candy.mesh);
        this.candies.splice(i, 1);
        this.snake.grow();
        this.gameState.score += 10;
        this.addCandy();

        this.onGameEvent?.({
          type: 'score',
          data: { score: this.gameState.score }
        });
        break;
      }
    }

    // 检查与其他实体的碰撞
    for (const entity of this.entities) {
      if (entity.position.x === snakePosition.x && entity.position.y === snakePosition.y) {
        this.gameOver();
        return;
      }
    }
  }

  public startGame() {
    this.gameState.isPlaying = true;
    this.gameState.gameOver = false;
    this.gameState.isPaused = false;

    this.gameLoop = setInterval(() => {
      this.gameUpdate();
    }, gameSpeed) as NodeJS.Timeout;

    this.onGameEvent?.({ type: 'start' });
  }

  public stopGame() {
    this.gameState.isPlaying = false;
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
  }

  public togglePause() {
    if (!this.gameState.isPlaying) return;

    this.gameState.isPaused = !this.gameState.isPaused;
    this.onGameEvent?.({
      type: this.gameState.isPaused ? 'pause' : 'resume'
    });
  }

  public resetGame() {
    this.stopGame();

    // 清理现有蛇
    if (this.snake) {
      this.snake.destroy();
    }

    // 清理糖果
    this.candies.forEach(candy => this.scene.remove(candy.mesh));
    this.candies = [];

    // 清理现有实体
    this.entities.forEach(entity => this.scene.remove(entity.mesh));
    this.entities = [];

    // 重置游戏状态
    this.gameState = {
      score: 0,
      isPlaying: false,
      isPaused: false,
      gameOver: false
    };

    // 重新生成实体
    this.generateEntities();

    // 寻找一个安全的蛇起始位置
    const safeStartPosition = this.findSafeStartPosition();

    // 创建新蛇
    const palette = this.palettes[this.currentPalette];
    this.snake = new Snake(this.scene, safeStartPosition, palette.snakeColor, palette.mouthColor);

    // 添加糖果
    this.addCandy();
  }

  private findSafeStartPosition(): Position {
    // 尝试从游戏区域中心附近找一个安全位置
    const centerX = Math.floor(resolution.x / 2);
    const centerY = Math.floor(resolution.y / 2);

    // 优先尝试中心位置
    const candidatePositions = [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX + 1, y: centerY },
      { x: centerX, y: centerY - 1 },
      { x: centerX, y: centerY + 1 },
    ];

    for (const position of candidatePositions) {
      // 检查这个位置和蛇的初始身体位置(后面2格)是否安全
      const bodyPositions = [
        position,
        { x: position.x - 1, y: position.y },
        { x: position.x - 2, y: position.y }
      ];

      const isSafe = bodyPositions.every(pos =>
        pos.x >= 0 && pos.x < resolution.x &&
        pos.y >= 0 && pos.y < resolution.y &&
        !this.isPositionOccupied(pos)
      );

      if (isSafe) {
        return position;
      }
    }

    // 如果中心区域都不安全，就使用默认安全位置
    return { x: 3, y: 3 };
  }

  private gameOver() {
    this.stopGame();
    this.gameState.gameOver = true;
    this.onGameEvent?.({
      type: 'gameOver',
      data: { score: this.gameState.score }
    });
  }

  public applyPalette(paletteName: string) {
    if (!this.palettes[paletteName]) return;

    this.currentPalette = paletteName;
    const palette = this.palettes[paletteName];

    // 更新场景颜色
    this.planeMaterial.color.set(palette.groundColor);
    this.scene.fog?.color.set(palette.fogColor);
    this.scene.background = new THREE.Color(palette.fogColor);

    // 更新实体颜色
    this.entities.forEach(entity => {
      const material = entity.mesh.material as THREE.MeshStandardMaterial;
      if (entity instanceof Rock) {
        material.color.set(palette.rockColor);
      } else if (entity instanceof Tree) {
        material.color.set(palette.treeColor);
      }
    });

    // 更新糖果颜色
    this.candies.forEach(candy => {
      const material = candy.mesh.material as THREE.MeshStandardMaterial;
      material.color.set(palette.candyColor);
    });

    // 更新蛇的颜色
    if (this.snake && this.snake.body.head) {
      const headMaterial = this.snake.body.head.data.mesh.material as THREE.MeshStandardMaterial;
      headMaterial.color.set(palette.snakeColor);
      this.snake.mouth.material = new THREE.MeshStandardMaterial({ color: palette.mouthColor });
    }
  }

  private handleResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public getGameState(): GameState {
    return { ...this.gameState };
  }

  public destroy() {
    this.stopGame();
    if (this.snake) {
      this.snake.destroy();
    }
    this.candies.forEach(candy => this.scene.remove(candy.mesh));
    this.entities.forEach(entity => this.scene.remove(entity.mesh));
    if (this.renderer.domElement.parentNode) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
} 
