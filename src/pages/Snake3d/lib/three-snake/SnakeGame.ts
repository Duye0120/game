import type { GameEvent } from './types';
import * as THREE from 'three';
import { resolution } from './Params';

export default class SnakeGame {
  private container: HTMLElement;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private onGameEvent?: (event: GameEvent) => void;

  constructor(container: HTMLElement, onGameEvent?: (event: GameEvent) => void) {
    this.container = container;
    this.onGameEvent = onGameEvent;
    this.init();

    // 调试：确认实例正确创建
    console.log('🎮 SnakeGame实例创建完成，包含方法：', Object.getOwnPropertyNames(Object.getPrototypeOf(this)));
  }

  /**
   * 初始化整个3D场景
   */
  private init() {
    console.log('🎮 开始初始化3D贪吃蛇游戏...');

    // 按步骤初始化各个组件
    this.setupScene(); // 1. 创建3D场景
    this.setupCamera(); // 2. 设置摄像机
    this.setupRenderer(); // 3. 设置渲染器
    this.setupLights(); // 4. 添加光照
    this.setupGround(); // 5. 创建地面
    this.setupGrid(); // 6. 添加网格线
    this.setupTestCubes(); // 7. 添加测试立方体

    // 开始渲染循环
    this.animate();

    console.log('✅ 3D场景初始化完成！');
  }

  /**
   * 步骤1: 创建3D场景
   * Scene是Three.js中所有3D对象的容器
   */
  private setupScene() {
    console.log('📦 创建3D场景...');

    this.scene = new THREE.Scene();

    // 设置场景背景色为橙黄色渐变
    this.scene.background = new THREE.Color(0xFF9800); // 橙色背景
  }

  /**
   * 步骤2: 设置摄像机
   * 摄像机决定了我们从什么角度观察3D世界
   */
  private setupCamera() {
    console.log('📷 设置摄像机...');

    // 创建透视摄像机
    // 参数：视野角度, 宽高比, 近裁剪面(0.1), 远裁剪面(1000)
    // 较小的FOV会让物体看起来更大（类似望远镜效果）
    const fov = 100;
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);

    // 设置摄像机位置 - 调整为更好的游戏视角
    // resolution.x = 20, resolution.y = 20 (20x20的游戏网格)
    this.camera.position.set(
      0, // x: 水平居中
      10, // y: 降低高度，从20改为15
      0, // z: 稍微向后，创造更好的俯视角度
    );

    // 让摄像机看向游戏区域的中心
    this.camera.lookAt(
      0, // 看向网格中心的x
      0, // 看向地面
      0, // 看向稍微前面一点，让棋盘在视野中心偏上
    );

    console.log(`📷 摄像机位置: (${this.camera.position.x}, ${this.camera.position.y}, ${this.camera.position.z})`);
  }

  /**
   * 步骤3: 设置渲染器
   * 渲染器负责将3D场景绘制到HTML页面上
   */
  private setupRenderer() {
    console.log('🎨 设置渲染器...');

    // 创建WebGL渲染器，开启抗锯齿
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    // 设置渲染器尺寸为容器大小
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    // 开启阴影
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 柔和阴影

    // 将渲染器的canvas元素添加到HTML容器中
    this.container.appendChild(this.renderer.domElement);

    console.log(`🎨 渲染器尺寸: ${this.container.clientWidth} x ${this.container.clientHeight}`);
  }

  /**
   * 步骤4: 添加光照
   * 光照让3D物体有立体感和真实感
   */
  private setupLights() {
    console.log('💡 添加光照...');

    // 1. 环境光 - 提供整体的基础亮度
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6); // 白色，强度0.6
    this.scene.add(ambientLight);

    // 2. 方向光 - 模拟太阳光，产生阴影
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8); // 白色，强度0.8
    directionalLight.position.set(10, 20, 10); // 光源位置
    directionalLight.castShadow = true; // 开启阴影投射

    // 设置阴影相关参数
    directionalLight.shadow.mapSize.width = 2048; // 阴影贴图宽度
    directionalLight.shadow.mapSize.height = 2048; // 阴影贴图高度
    directionalLight.shadow.camera.near = 0.5; // 阴影相机近裁剪面
    directionalLight.shadow.camera.far = 50; // 阴影相机远裁剪面

    // 设置阴影相机的范围（需要覆盖整个游戏区域）
    directionalLight.shadow.camera.left = -15;
    directionalLight.shadow.camera.right = 25;
    directionalLight.shadow.camera.top = 25;
    directionalLight.shadow.camera.bottom = -15;

    this.scene.add(directionalLight);

    console.log('💡 光照设置完成 - 环境光 + 方向光');
  }

  /**
   * 步骤5: 创建地面
   * 地面是游戏的基础平台
   */
  private setupGround() {
    console.log('🌍 创建地面...');

    // 创建一个平面几何体，大小为游戏网格大小
    const planeGeometry = new THREE.PlaneGeometry(resolution.x, resolution.y);

    // 创建材质 - 橙色地面
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFA726, // 橙色
    });

    // 创建地面网格对象
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // 旋转地面使其水平放置（Three.js中平面默认是垂直的）
    plane.rotation.x = -Math.PI / 2; // 绕x轴旋转-90度

    // 设置地面位置 - 居中在原点
    plane.position.set(
      0, // x: 原点居中
      -0.5, // y: 稍微低于0（游戏物体会放在y=0上）
      0, // z: 原点居中
    );

    // 地面接收阴影
    plane.receiveShadow = true;

    // 将地面添加到场景中
    this.scene.add(plane);

    console.log(`🌍 地面创建完成 - 尺寸: ${resolution.x} x ${resolution.y}`);
  }

  /**
   * 步骤6: 添加网格线
   * 网格线帮助我们看清游戏的格子边界
   */
  private setupGrid() {
    console.log('📐 添加网格线...');

    // 创建网格辅助对象
    const gridHelper = new THREE.GridHelper(
      resolution.x, // 网格总尺寸（x方向）
      resolution.y, // 网格总尺寸（z方向）
      0xFFFFFF, // 中心线颜色（白色）
      0xFFFFFF, // 网格线颜色（白色）
    );

    // 设置网格位置 - 居中在原点，与地面对齐
    gridHelper.position.set(
      0, // x: 原点居中
      -0.49, // y: 稍微高于地面
      0, // z: 原点居中
    );

    // 设置网格线透明度
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3; // 30%透明度，不会太显眼

    // 将网格添加到场景中
    this.scene.add(gridHelper);

    console.log('📐 网格线添加完成 - 20x20格子');
  }

  /**
   * 步骤7: 添加测试立方体来演示裁剪面效果
   * 这些立方体帮助理解近裁剪面和远裁剪面的概念
   */
  private setupTestCubes() {
    console.log('🧊 添加测试立方体演示裁剪面...');

    // 创建立方体几何体和材质
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // 测试立方体的距离数组
    const testDistances = [
      { distance: 0.05, color: 0xFF0000, label: '太近-被近裁剪面裁掉' }, // 红色 - 应该看不到
      { distance: 0.2, color: 0x00FF00, label: '刚好可见' }, // 绿色 - 刚好能看到
      { distance: 5, color: 0x0000FF, label: '正常距离' }, // 蓝色 - 正常可见
      { distance: 50, color: 0xFFFF00, label: '较远距离' }, // 黄色 - 较远但可见
      { distance: 500, color: 0xFF00FF, label: '很远距离' }, // 紫色 - 很远但还能看到
      { distance: 1500, color: 0x00FFFF, label: '超远-被远裁剪面裁掉' }, // 青色 - 应该看不到
    ];

    testDistances.forEach((test, index) => {
      const material = new THREE.MeshStandardMaterial({
        color: test.color,
        transparent: true,
        opacity: 0.8,
      });

      const cube = new THREE.Mesh(geometry, material);

      // 将测试立方体放置在网格内的不同位置
      cube.position.set(
        (index * 2 - 5), // x: 在网格内横向分布 (-5, -3, -1, 1, 3, 5)
        0.5, // y: 在地面上
        (index % 2) * 2 - 1, // z: 交错放置在前后两排
      );

      cube.castShadow = true;
      cube.receiveShadow = true;

      this.scene.add(cube);

      console.log(`🧊 立方体 ${index + 1}: 位置(${cube.position.x}, ${cube.position.y}, ${cube.position.z}), 颜色${test.color.toString(16)}, ${test.label}`);
    });

    console.log('🧊 测试立方体添加完成！');
  }

  /**
   * 渲染循环
   * 这个函数会持续运行，每帧都重新绘制场景
   */
  private animate() {
    // 请求下一帧动画
    requestAnimationFrame(() => this.animate());

    // 渲染场景
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 应用不同的色彩主题
   */
  public applyPalette(paletteName: string) {
    console.log(`🎨 切换色彩主题: ${paletteName}`);

    // 定义不同的色彩主题
    const palettes = {
      green: {
        background: 0x4CAF50, // 绿色背景
        ground: 0x7CB342, // 绿色地面
      },
      orange: {
        background: 0xFF9800, // 橙色背景
        ground: 0xFFA726, // 橙色地面
      },
      lilac: {
        background: 0x9C27B0, // 紫色背景
        ground: 0xBA68C8, // 紫色地面
      },
    };

    const palette = palettes[paletteName as keyof typeof palettes];
    if (palette) {
      // 更新场景背景色
      this.scene.background = new THREE.Color(palette.background);
      this.scene.fog = new THREE.Fog(palette.background, 5, 40);

      // 更新地面颜色（需要找到地面对象）
      this.scene.traverse(object => {
        if (object instanceof THREE.Mesh && object.geometry instanceof THREE.PlaneGeometry) {
          (object.material as THREE.MeshStandardMaterial).color.setHex(palette.ground);
        }
      });
    }
  }

  /**
   * 实验方法：调整摄像机裁剪面参数
   * 这个方法可以帮助理解裁剪面的作用
   */
  public experimentWithClippingPlanes(near: number, far: number) {
    console.log(`🔬 实验裁剪面参数: 近=${near}, 远=${far}`);

    // 更新摄像机的裁剪面
    this.camera.near = near;
    this.camera.far = far;

    // 重要：更新摄像机的投影矩阵！
    this.camera.updateProjectionMatrix();

    console.log(`📷 摄像机裁剪面已更新 - 近裁剪面: ${near}, 远裁剪面: ${far}`);
    console.log(`🧪 现在观察哪些立方体消失了！`);
  }

  /**
   * 测试方法：动态调整摄像机高度来演示裁剪面
   */
  public testClipping() {
    console.log('🧪 测试裁剪面功能 - 调整摄像机高度');

    // 让摄像机更靠近地面，这样裁剪面效果更明显
    this.camera.position.y = 5; // 从20降低到5
    this.camera.lookAt(0, 0, 0); // 看向原点

    // 同时调整近裁剪面
    this.camera.near = 2;
    this.camera.updateProjectionMatrix();

    console.log('✅ 摄像机高度调整为5，近裁剪面设置为2');
    console.log('🔍 现在观察哪些立方体会被裁剪掉！');
  }

  /**
   * 重置摄像机位置 - 垂直俯视
   */
  public resetCamera() {
    console.log('🔄 重置摄像机到垂直俯视位置');

    this.camera.position.set(0, 20, 0); // 网格中心正上方，高度20
    this.camera.lookAt(0, 0, 0); // 看向网格中心
    this.camera.near = 0.1;
    this.camera.far = 1000;
    this.camera.updateProjectionMatrix();

    console.log('✅ 摄像机已重置到垂直俯视位置 (0, 20, 0)');
  }

  /**
   * 调整摄像机高度 - 保持垂直俯视
   */
  public adjustCameraHeight(height: number) {
    console.log(`📏 调整摄像机高度到: ${height}`);

    this.camera.position.set(0, height, 0); // 保持在原点正上方
    this.camera.lookAt(0, 0, 0); // 始终看向原点

    console.log(`✅ 摄像机高度已调整为: ${height}，保持垂直俯视`);
  }

  /**
   * 调整FOV（视野角度）
   */
  public adjustFOV(fov: number) {
    console.log(`🔍 调整FOV到: ${fov}度`);

    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();

    console.log(`✅ FOV已调整为: ${fov}度`);
  }

  /**
   * 开始游戏（暂时只是一个占位符）
   */
  public startGame() {
    console.log('🎮 开始游戏（目前只有场景，还没有游戏逻辑）');
    this.onGameEvent?.({ type: 'start' });
  }

  /**
   * 暂停/恢复游戏（暂时只是一个占位符）
   */
  public togglePause() {
    console.log('⏸️ 暂停/恢复游戏（目前只有场景，还没有游戏逻辑）');
  }

  /**
   * 重置游戏（暂时只是一个占位符）
   */
  public resetGame() {
    console.log('🔄 重置游戏（目前只有场景，还没有游戏逻辑）');
  }

  /**
   * 销毁游戏，清理资源
   */
  public destroy() {
    console.log('🗑️ 销毁游戏，清理资源...');

    // 从容器中移除渲染器的canvas元素
    if (this.renderer.domElement.parentNode) {
      this.container.removeChild(this.renderer.domElement);
    }

    // 清理渲染器
    this.renderer.dispose();

    console.log('✅ 游戏资源清理完成');
  }
}
