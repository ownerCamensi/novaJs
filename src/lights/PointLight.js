import { Object3D } from '../core/Object3D.js';

export class PointLight extends Object3D {
  constructor(color = 0xffffff, intensity = 1.0, distance = 100) {
    super();
    this.type      = 'PointLight';
    this.isLight   = true;
    this.intensity = intensity;
    this.distance  = distance;
    this.color     = this._hexToRgb(color);
  }
  _hexToRgb(hex) {
    return { r:((hex>>16)&0xff)/255, g:((hex>>8)&0xff)/255, b:(hex&0xff)/255 };
  }
}
