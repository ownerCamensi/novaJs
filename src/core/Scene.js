import { Object3D } from './Object3D.js';

/**
 * Scene — The root of the scene graph.
 * Add meshes, lights, cameras etc. as children.
 */
export class Scene extends Object3D {
  constructor() {
    super();
    this.type = 'Scene';
    this.background = { r: 0.05, g: 0.05, b: 0.1, a: 1.0 }; // dark blue default

    // Flat lists for fast render iteration
    this._lights = [];
  }

  /** Override add to track lights separately */
  add(child) {
    super.add(child);
    if (child.isLight) this._lights.push(child);
    return this;
  }

  remove(child) {
    super.remove(child);
    if (child.isLight) {
      const idx = this._lights.indexOf(child);
      if (idx !== -1) this._lights.splice(idx, 1);
    }
    return this;
  }

  /** Collect all renderable objects (Meshes, ParticleSystems, etc.) */
  getRenderList() {
    const list = [];
    this.traverse((obj) => {
      if (obj.isMesh || obj.isParticleSystem) list.push(obj);
    });
    return list;
  }

  getLights() { return this._lights; }

  setBackground(r, g, b, a = 1) {
    this.background = { r, g, b, a };
  }
}
