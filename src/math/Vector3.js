/**
 * Vector3 — The workhorse of 3D math.
 * Immutable operations return new vectors; "Self" ops mutate in-place.
 */
export class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
  setFrom(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
  clone() { return new Vector3(this.x, this.y, this.z); }

  add(v) { return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z); }
  addSelf(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
  addScalar(s) { return new Vector3(this.x + s, this.y + s, this.z + s); }

  sub(v) { return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z); }
  subSelf(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }

  scale(s) { return new Vector3(this.x * s, this.y * s, this.z * s); }
  scaleSelf(s) { this.x *= s; this.y *= s; this.z *= s; return this; }

  multiply(v) { return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z); }
  divide(v) { return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z); }

  dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }

  /** Cross product — gives a vector perpendicular to both */
  cross(v) {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  length() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
  lengthSq() { return this.x * this.x + this.y * this.y + this.z * this.z; }

  normalize() {
    const l = this.length();
    return l > 0 ? new Vector3(this.x / l, this.y / l, this.z / l) : new Vector3();
  }

  normalizeSelf() {
    const l = this.length();
    if (l > 0) { this.x /= l; this.y /= l; this.z /= l; }
    return this;
  }

  negate() { return new Vector3(-this.x, -this.y, -this.z); }
  negateSelf() { this.x = -this.x; this.y = -this.y; this.z = -this.z; return this; }

  distanceTo(v) { return this.sub(v).length(); }
  distanceToSq(v) { return this.sub(v).lengthSq(); }

  lerp(v, t) {
    return new Vector3(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t,
      this.z + (v.z - this.z) * t
    );
  }

  /** Apply a Matrix4 to this vector (w=1, includes translation) */
  applyMatrix4(m) {
    const e = m.elements;
    const x = this.x, y = this.y, z = this.z;
    const w = 1.0 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
    return new Vector3(
      (e[0] * x + e[4] * y + e[8]  * z + e[12]) * w,
      (e[1] * x + e[5] * y + e[9]  * z + e[13]) * w,
      (e[2] * x + e[6] * y + e[10] * z + e[14]) * w
    );
  }

  /** Apply only rotation/scale part of matrix (w=0, no translation) */
  applyMatrix3(m) {
    const e = m.elements;
    const x = this.x, y = this.y, z = this.z;
    return new Vector3(
      e[0] * x + e[4] * y + e[8]  * z,
      e[1] * x + e[5] * y + e[9]  * z,
      e[2] * x + e[6] * y + e[10] * z
    );
  }

  toArray() { return [this.x, this.y, this.z]; }
  toString() { return `Vector3(${this.x.toFixed(3)}, ${this.y.toFixed(3)}, ${this.z.toFixed(3)})`; }

  static UP()      { return new Vector3(0, 1, 0); }
  static DOWN()    { return new Vector3(0, -1, 0); }
  static RIGHT()   { return new Vector3(1, 0, 0); }
  static LEFT()    { return new Vector3(-1, 0, 0); }
  static FORWARD() { return new Vector3(0, 0, -1); }
  static BACK()    { return new Vector3(0, 0, 1); }
  static ZERO()    { return new Vector3(0, 0, 0); }
  static ONE()     { return new Vector3(1, 1, 1); }
}
