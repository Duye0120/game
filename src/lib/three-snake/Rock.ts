import * as THREE from 'three';
import Entity from './Entity';
import { Position } from './types';

export default class Rock extends Entity {
  constructor(position: Position, color = 0xebebeb) {
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    geometry.translate(0, 0.4, 0);

    const material = new THREE.MeshStandardMaterial({ color });

    super(geometry, material, position);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }
} 
