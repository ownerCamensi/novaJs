import { Camera } from './Camera.js';
import { Matrix4 } from '../math/Matrix4.js';

/**
 * PerspectiveCamera — Standard frustum projection.
 * @param {number} fov    - Vertical FOV in degrees
 * @param {number} aspect - Width / height
 * @param {number} near   - Near clip distance
 * @param {number} far    - Far clip distance
 */
export class PerspectiveCamera extends Camera {
  constructor(fov = 75, aspect = 16/9, near = 0.1, far = 1000) {
    super();
    this.type = 'PerspectiveCamera';
    this.fov    = fov;
    this.aspect = aspect;
    this.near   = near;
    this.far    = far;
    this._updateProjection();
  }

  _updateProjection() {
    this.projectionMatrix = Matrix4.perspective(
      this.fov * Math.PI / 180,
      this.aspect,
      this.near,
      this.far
    );
  }

  setAspect(aspect) { this.aspect = aspect; this._updateProjection(); }
  setFOV(fov)       { this.fov = fov;       this._updateProjection(); }

  updateMatrices() {
    this._updateProjection(); // always fresh (handles resize)
    super.updateMatrices();
  }
}
