let _matId = 0;

export class Material {
  constructor() {
    this.id       = _matId++;
    this.type     = 'Material';
    this.color    = { r: 1, g: 1, b: 1 };
    this.opacity  = 1.0;
    this.unlit    = false; // if true, skip lighting calculation
    this.map      = null;  // diffuse texture
    this.uniforms = {};
    this.vertexShader   = null; // null = use engine default
    this.fragmentShader = null;
  }

  setColor(r, g, b) { this.color = { r, g, b }; return this; }
  setColorHex(hex) {
    this.color = {
      r: ((hex >> 16) & 0xff) / 255,
      g: ((hex >> 8)  & 0xff) / 255,
      b: ((hex)       & 0xff) / 255,
    };
    return this;
  }
}
