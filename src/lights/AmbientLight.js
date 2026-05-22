import { Object3D } from '../core/Object3D.js';

export class AmbientLight extends Object3D {
  constructor(color = 0xffffff, intensity = 0.4) {
    super();
    this.type      = 'AmbientLight';
    this.isLight   = true;
    this.intensity = intensity;
    this.color     = this._hexToRgb(color);
  }
  _hexToRgb(hex) {
    return { r:((hex>>16)&0xff)/255, g:((hex>>8)&0xff)/255, b:(hex&0xff)/255 };
  }
  setColor(hex) { this.color = this._hexToRgb(hex); return this; }
}
