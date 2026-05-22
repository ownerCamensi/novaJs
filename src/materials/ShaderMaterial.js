import { Material } from './Material.js';

/**
 * ShaderMaterial — Provide your own GLSL vertex + fragment shaders.
 *
 * IMPORTANT: Your vertex shader MUST declare and use:
 *   uniform mat4 modelMatrix;
 *   uniform mat4 viewMatrix;
 *   uniform mat4 projectionMatrix;
 *   gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
 */
export class ShaderMaterial extends Material {
  constructor(options = {}) {
    super();
    this.type = 'ShaderMaterial';
    this.vertexShader   = options.vertexShader   || null;
    this.fragmentShader = options.fragmentShader || null;
    this.uniforms       = options.uniforms       || {};
    this.unlit          = true; // custom shaders handle their own lighting
    if (options.color) {
      if (typeof options.color === 'number') this.setColorHex(options.color);
      else this.color = options.color;
    }
  }
}
