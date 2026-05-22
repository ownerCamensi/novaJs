import { Object3D } from '../core/Object3D.js';

/**
 * Mesh — A geometry + material combination placed in the scene.
 * This is what gets rendered.
 */
export class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    this.type     = 'Mesh';
    this.isMesh   = true;
    this.geometry = geometry;
    this.material = material;
  }

  clone() {
    const m = new Mesh(this.geometry, this.material);
    m.position.setFrom(this.position);
    m.rotation.setFrom(this.rotation);
    m.scale.setFrom(this.scale);
    return m;
  }
}
