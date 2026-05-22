/**
 * Vector2 — 2D vector for UVs, screen coords, etc.
 */
export class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) { this.x = x; this.y = y; return this; }
  clone() { return new Vector2(this.x, this.y); }

  add(v) { return new Vector2(this.x + v.x, this.y + v.y); }
  addSelf(v) { this.x += v.x; this.y += v.y; return this; }

  sub(v) { return new Vector2(this.x - v.x, this.y - v.y); }
  subSelf(v) { this.x -= v.x; this.y -= v.y; return this; }

  scale(s) { return new Vector2(this.x * s, this.y * s); }
  scaleSelf(s) { this.x *= s; this.y *= s; return this; }

  dot(v) { return this.x * v.x + this.y * v.y; }

  length() { return Math.sqrt(this.x * this.x + this.y * this.y); }
  lengthSq() { return this.x * this.x + this.y * this.y; }

  normalize() {
    const l = this.length();
    return l > 0 ? new Vector2(this.x / l, this.y / l) : new Vector2();
  }

  normalizeSelf() {
    const l = this.length();
    if (l > 0) { this.x /= l; this.y /= l; }
    return this;
  }

  lerp(v, t) {
    return new Vector2(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t
    );
  }

  toArray() { return [this.x, this.y]; }
  toString() { return `Vector2(${this.x}, ${this.y})`; }
}
