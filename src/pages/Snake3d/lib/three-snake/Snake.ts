import type { Position } from './types';
import * as THREE from 'three';
import LinkedList from './LinkedList';
import { resolution } from './Params';

interface SnakeSegment {
  mesh: THREE.Mesh;
  position: Position;
}

export default class Snake {
  body: LinkedList<SnakeSegment>;
  direction: Position;
  nextDirection: Position;
  mouth: THREE.Mesh;
  mouthColor: number;
  scene: THREE.Scene;

  constructor(scene: THREE.Scene, startPosition: Position = { x: 10, y: 10 }, snakeColor = 0x1D5846, mouthColor = 0x39C09F) {
    this.scene = scene;
    this.body = new LinkedList<SnakeSegment>();
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.mouthColor = mouthColor;

    // 创建蛇头
    const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    headGeometry.translate(0, 0.4, 0);
    const headMaterial = new THREE.MeshStandardMaterial({ color: snakeColor });
    const headMesh = new THREE.Mesh(headGeometry, headMaterial);
    headMesh.position.set(startPosition.x, 0, startPosition.y);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;

    // 创建嘴巴
    const mouthGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.6);
    mouthGeometry.translate(0, 0.6, 0.4);
    const mouthMaterial = new THREE.MeshStandardMaterial({ color: mouthColor });
    this.mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    this.mouth.castShadow = true;
    headMesh.add(this.mouth);

    scene.add(headMesh);

    this.body.add({ mesh: headMesh, position: startPosition });

    // 添加初始身体段
    this.addSegment({ x: startPosition.x - 1, y: startPosition.y }, snakeColor);
    this.addSegment({ x: startPosition.x - 2, y: startPosition.y }, snakeColor);
  }

  addSegment(position: Position, color: number) {
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    geometry.translate(0, 0.4, 0);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, 0, position.y);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.scene.add(mesh);
    this.body.add({ mesh, position });
  }

  setDirection(direction: Position) {
    // 防止反向移动
    if (this.direction.x !== -direction.x || this.direction.y !== -direction.y) {
      this.nextDirection = direction;
    }
  }

  move() {
    this.direction = this.nextDirection;

    if (!this.body.head)
return false;

    const head = this.body.head.data;
    const newPosition: Position = {
      x: head.position.x + this.direction.x,
      y: head.position.y + this.direction.y,
    };

    // 检查边界碰撞
    if (newPosition.x < 0 || newPosition.x >= resolution.x
      || newPosition.y < 0 || newPosition.y >= resolution.y) {
      return false;
    }

    // 检查自身碰撞
    if (this.checkSelfCollision(newPosition)) {
      return false;
    }

    // 保存蛇头的旧位置，用于身体移动
    const oldHeadPosition = { ...head.position };

    // 移动蛇头
    head.position = newPosition;
    head.mesh.position.set(newPosition.x, 0, newPosition.y);

    // 更新头部朝向
    this.updateHeadRotation();

    // 移动身体 - 使用旧的头部位置
    let current = this.body.head.next;
    let previousPosition = oldHeadPosition;

    while (current) {
      const tempPosition = { ...current.data.position };
      current.data.position = previousPosition;
      current.data.mesh.position.set(previousPosition.x, 0, previousPosition.y);
      previousPosition = tempPosition;
      current = current.next;
    }

    return true;
  }

  grow() {
    if (!this.body.head)
return;

    // 找到尾部
    let tail = this.body.head;
    while (tail.next) {
      tail = tail.next;
    }

    // 在尾部后面添加新段
    const tailPosition = tail.data.position;
    const newPosition: Position = {
      x: tailPosition.x - this.direction.x,
      y: tailPosition.y - this.direction.y,
    };

    this.addSegment(newPosition, (this.body.head.data.mesh.material as THREE.MeshStandardMaterial).color.getHex());
  }

  checkSelfCollision(position: Position): boolean {
    // 跳过蛇头，只检查身体段
    let current = this.body.head?.next;
    while (current) {
      if (current.data.position.x === position.x && current.data.position.y === position.y) {
        return true;
      }
      current = current.next;
    }
    return false;
  }

  checkCollision(position: Position): boolean {
    let current = this.body.head;
    while (current) {
      if (current.data.position.x === position.x && current.data.position.y === position.y) {
        return true;
      }
      current = current.next;
    }
    return false;
  }

  private updateHeadRotation() {
    if (!this.body.head)
return;

    const head = this.body.head.data.mesh;
    if (this.direction.x === 1) {
      head.rotation.y = 0;
    }
 else if (this.direction.x === -1) {
      head.rotation.y = Math.PI;
    }
 else if (this.direction.y === 1) {
      head.rotation.y = Math.PI / 2;
    }
 else if (this.direction.y === -1) {
      head.rotation.y = -Math.PI / 2;
    }
  }

  getPosition(): Position {
    return this.body.head ? this.body.head.data.position : { x: 0, y: 0 };
  }

  destroy() {
    let current = this.body.head;
    while (current) {
      this.scene.remove(current.data.mesh);
      current = current.next;
    }
  }
}
