import * as THREE from 'three';
import Entity from './Entity';
import { Position } from './types';

export default class Tree extends Entity {
  constructor(position: Position, color = 0x639541) {
    const geometry = new THREE.ConeGeometry(0.4, 1.5, 8);
    geometry.translate(0, 0.75, 0);

    const material = new THREE.MeshStandardMaterial({ color });

    super(geometry, material, position);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }
} 
