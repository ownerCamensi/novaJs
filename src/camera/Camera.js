import { Object3D } from '../core/Object3D.js';
import { Matrix4 } from '../math/Matrix4.js';
import { Vector3 } from '../math/Vector3.js';

export class Camera extends Object3D {
  constructor() {
    super();
    this.type = 'Camera';
    this.isCamera = true;
    this.projectionMatrix = new Matrix4();
    this.viewMatrix       = new Matrix4();
    this._target = new Vector3(0, 0, 0);
  }

  /** Rebuild viewMatrix — called every frame by renderer */
  updateMatrices() {
    this.updateMatrix(); // sync rotation/position to matrix

    // View matrix = inverse of camera's world transform
    // For a camera: world matrix positions the camera, view matrix is its inverse
    // We can compute it cheaply using lookAt with derived forward vector
    const e  = this.matrix.elements;
    // Extract forward direction from the camera's rotation matrix (column 2, negated = -Z = look dir)
    const fx = -e[8], fy = -e[9], fz = -e[10];
    const target = new Vector3(
      this.position.x + fx,
      this.position.y + fy,
      this.position.z + fz
    );
    const up = new Vector3(e[4], e[5], e[6]); // column 1 = camera's local Y

    this.viewMatrix = Matrix4.lookAt(this.position, target, up);
  }
}
