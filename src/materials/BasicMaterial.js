import { Material } from './Material.js';

/**
 * BasicMaterial — Simple color + optional texture + lighting.
 */
export class BasicMaterial extends Material {
  constructor(options = {}) {
    super();
    this.type = 'BasicMaterial';
    if (options.color !== undefined) {
      if (typeof options.color === 'number') this.setColorHex(options.color);
      else if (Array.isArray(options.color)) this.color = { r:options.color[0], g:options.color[1], b:options.color[2] };
      else this.color = options.color;
    }
    if (options.opacity !== undefined) this.opacity = options.opacity;
    if (options.unlit   !== undefined) this.unlit   = options.unlit;
    if (options.map     !== undefined) this.map     = options.map;
  }
}
