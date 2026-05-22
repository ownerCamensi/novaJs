import { Object3D } from '../core/Object3D.js';
import { Vector3 } from '../math/Vector3.js';

export class DirectionalLight extends Object3D {
  constructor(color = 0xffffff, intensity = 1.0) {
    super();
    this.type      = 'DirectionalLight';
    this.isLight   = true;
    this.intensity = intensity;
    this.color     = this._hexToRgb(color);
    this.target    = new Vector3(0, 0, 0);
  }
  _hexToRgb(hex) {
    return { r:((hex>>16)&0xff)/255, g:((hex>>8)&0xff)/255, b:(hex&0xff)/255 };
  }
  getDirection() {
    return this.target.sub(this.position).normalizeSelf();
  }
}
