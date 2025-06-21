import type { Position } from './types';
import * as THREE from 'three';
import Entity from './Entity';

export default class Candy extends Entity {
  constructor(position: Position, color = 0x1D5846) {
    const geometry = new THREE.SphereGeometry(0.4, 16, 8);
    const material = new THREE.MeshStandardMaterial({ color });

    super(geometry, material, position);

    this.mesh.position.y = 0.4;
    this.mesh.castShadow = true;
  }
}
