/**
 * Vector4 — for homogeneous coordinates, colors (RGBA), quaternion math
 */
export class Vector4 {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x; this.y = y; this.z = z; this.w = w;
  }

  set(x, y, z, w) { this.x = x; this.y = y; this.z = z; this.w = w; return this; }
  clone() { return new Vector4(this.x, this.y, this.z, this.w); }

  add(v) { return new Vector4(this.x+v.x, this.y+v.y, this.z+v.z, this.w+v.w); }
  scale(s) { return new Vector4(this.x*s, this.y*s, this.z*s, this.w*s); }

  dot(v) { return this.x*v.x + this.y*v.y + this.z*v.z + this.w*v.w; }

  length() { return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w); }

  normalize() {
    const l = this.length();
    return l > 0 ? new Vector4(this.x/l, this.y/l, this.z/l, this.w/l) : new Vector4();
  }

  toArray() { return [this.x, this.y, this.z, this.w]; }
  toString() { return `Vector4(${this.x}, ${this.y}, ${this.z}, ${this.w})`; }
}
