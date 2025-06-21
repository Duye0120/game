import type { Position } from './types';
import * as THREE from 'three';
import { resolution } from './Params';

export default class Entity {
  mesh: THREE.Mesh;
  position: Position;

  constructor(geometry: THREE.BufferGeometry, material: THREE.Material, position: Position) {
    this.mesh = new THREE.Mesh(geometry, material);
    this.position = position;
    this.mesh.position.set(position.x, 0, position.y);
  }

  setPosition(position: Position) {
    this.position = position;
    this.mesh.position.set(position.x, 0, position.y);
  }

  getIndex() {
    return this.position.y * resolution.x + this.position.x;
  }

  static indexToPosition(index: number): Position {
    return {
      x: index % resolution.x,
      y: Math.floor(index / resolution.x),
    };
  }
}
