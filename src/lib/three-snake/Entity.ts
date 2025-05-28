import * as THREE from 'three';
import { Position } from './types';

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
    return this.position.y * 20 + this.position.x;
  }

  static indexToPosition(index: number): Position {
    return {
      x: index % 20,
      y: Math.floor(index / 20)
    };
  }
} 
