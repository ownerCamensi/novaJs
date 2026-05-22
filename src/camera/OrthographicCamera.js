import { Camera } from './Camera.js';
import { Matrix4 } from '../math/Matrix4.js';

export class OrthographicCamera extends Camera {
  constructor(left=-10, right=10, bottom=-10, top=10, near=0.1, far=1000) {
    super();
    this.type   = 'OrthographicCamera';
    this.left   = left;  this.right  = right;
    this.bottom = bottom; this.top   = top;
    this.near   = near;   this.far   = far;
    this.projectionMatrix = Matrix4.orthographic(left,right,bottom,top,near,far);
  }
  updateMatrices() {
    this.projectionMatrix = Matrix4.orthographic(
      this.left, this.right, this.bottom, this.top, this.near, this.far);
    super.updateMatrices();
  }
}
