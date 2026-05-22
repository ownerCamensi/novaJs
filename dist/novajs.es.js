class F {
  constructor(t = 0, i = 0) {
    this.x = t, this.y = i;
  }
  set(t, i) {
    return this.x = t, this.y = i, this;
  }
  clone() {
    return new F(this.x, this.y);
  }
  add(t) {
    return new F(this.x + t.x, this.y + t.y);
  }
  addSelf(t) {
    return this.x += t.x, this.y += t.y, this;
  }
  sub(t) {
    return new F(this.x - t.x, this.y - t.y);
  }
  subSelf(t) {
    return this.x -= t.x, this.y -= t.y, this;
  }
  scale(t) {
    return new F(this.x * t, this.y * t);
  }
  scaleSelf(t) {
    return this.x *= t, this.y *= t, this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  normalize() {
    const t = this.length();
    return t > 0 ? new F(this.x / t, this.y / t) : new F();
  }
  normalizeSelf() {
    const t = this.length();
    return t > 0 && (this.x /= t, this.y /= t), this;
  }
  lerp(t, i) {
    return new F(
      this.x + (t.x - this.x) * i,
      this.y + (t.y - this.y) * i
    );
  }
  toArray() {
    return [this.x, this.y];
  }
  toString() {
    return `Vector2(${this.x}, ${this.y})`;
  }
}
class x {
  constructor(t = 0, i = 0, e = 0) {
    this.x = t, this.y = i, this.z = e;
  }
  set(t, i, e) {
    return this.x = t, this.y = i, this.z = e, this;
  }
  setFrom(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this;
  }
  clone() {
    return new x(this.x, this.y, this.z);
  }
  add(t) {
    return new x(this.x + t.x, this.y + t.y, this.z + t.z);
  }
  addSelf(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this;
  }
  addScalar(t) {
    return new x(this.x + t, this.y + t, this.z + t);
  }
  sub(t) {
    return new x(this.x - t.x, this.y - t.y, this.z - t.z);
  }
  subSelf(t) {
    return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
  }
  scale(t) {
    return new x(this.x * t, this.y * t, this.z * t);
  }
  scaleSelf(t) {
    return this.x *= t, this.y *= t, this.z *= t, this;
  }
  multiply(t) {
    return new x(this.x * t.x, this.y * t.y, this.z * t.z);
  }
  divide(t) {
    return new x(this.x / t.x, this.y / t.y, this.z / t.z);
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  /** Cross product — gives a vector perpendicular to both */
  cross(t) {
    return new x(
      this.y * t.z - this.z * t.y,
      this.z * t.x - this.x * t.z,
      this.x * t.y - this.y * t.x
    );
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  normalize() {
    const t = this.length();
    return t > 0 ? new x(this.x / t, this.y / t, this.z / t) : new x();
  }
  normalizeSelf() {
    const t = this.length();
    return t > 0 && (this.x /= t, this.y /= t, this.z /= t), this;
  }
  negate() {
    return new x(-this.x, -this.y, -this.z);
  }
  negateSelf() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }
  distanceTo(t) {
    return this.sub(t).length();
  }
  distanceToSq(t) {
    return this.sub(t).lengthSq();
  }
  lerp(t, i) {
    return new x(
      this.x + (t.x - this.x) * i,
      this.y + (t.y - this.y) * i,
      this.z + (t.z - this.z) * i
    );
  }
  /** Apply a Matrix4 to this vector (w=1, includes translation) */
  applyMatrix4(t) {
    const i = t.elements, e = this.x, s = this.y, r = this.z, o = 1 / (i[3] * e + i[7] * s + i[11] * r + i[15]);
    return new x(
      (i[0] * e + i[4] * s + i[8] * r + i[12]) * o,
      (i[1] * e + i[5] * s + i[9] * r + i[13]) * o,
      (i[2] * e + i[6] * s + i[10] * r + i[14]) * o
    );
  }
  /** Apply only rotation/scale part of matrix (w=0, no translation) */
  applyMatrix3(t) {
    const i = t.elements, e = this.x, s = this.y, r = this.z;
    return new x(
      i[0] * e + i[4] * s + i[8] * r,
      i[1] * e + i[5] * s + i[9] * r,
      i[2] * e + i[6] * s + i[10] * r
    );
  }
  toArray() {
    return [this.x, this.y, this.z];
  }
  toString() {
    return `Vector3(${this.x.toFixed(3)}, ${this.y.toFixed(3)}, ${this.z.toFixed(3)})`;
  }
  static UP() {
    return new x(0, 1, 0);
  }
  static DOWN() {
    return new x(0, -1, 0);
  }
  static RIGHT() {
    return new x(1, 0, 0);
  }
  static LEFT() {
    return new x(-1, 0, 0);
  }
  static FORWARD() {
    return new x(0, 0, -1);
  }
  static BACK() {
    return new x(0, 0, 1);
  }
  static ZERO() {
    return new x(0, 0, 0);
  }
  static ONE() {
    return new x(1, 1, 1);
  }
}
class S {
  constructor(t = 0, i = 0, e = 0, s = 1) {
    this.x = t, this.y = i, this.z = e, this.w = s;
  }
  set(t, i, e, s) {
    return this.x = t, this.y = i, this.z = e, this.w = s, this;
  }
  clone() {
    return new S(this.x, this.y, this.z, this.w);
  }
  add(t) {
    return new S(this.x + t.x, this.y + t.y, this.z + t.z, this.w + t.w);
  }
  scale(t) {
    return new S(this.x * t, this.y * t, this.z * t, this.w * t);
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  normalize() {
    const t = this.length();
    return t > 0 ? new S(this.x / t, this.y / t, this.z / t, this.w / t) : new S();
  }
  toArray() {
    return [this.x, this.y, this.z, this.w];
  }
  toString() {
    return `Vector4(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
  }
}
class v {
  constructor() {
    this.elements = new Float32Array(16), this.identity();
  }
  /** Set to identity matrix */
  identity() {
    const t = this.elements;
    return t[0] = 1, t[4] = 0, t[8] = 0, t[12] = 0, t[1] = 0, t[5] = 1, t[9] = 0, t[13] = 0, t[2] = 0, t[6] = 0, t[10] = 1, t[14] = 0, t[3] = 0, t[7] = 0, t[11] = 0, t[15] = 1, this;
  }
  clone() {
    const t = new v();
    return t.elements.set(this.elements), t;
  }
  copy(t) {
    return this.elements.set(t.elements), this;
  }
  /**
   * Multiply: this * other, returns new Matrix4.
   * M = A * B means "first apply B, then A."
   */
  multiply(t) {
    const i = this.elements, e = t.elements, s = new Float32Array(16);
    for (let o = 0; o < 4; o++)
      for (let h = 0; h < 4; h++) {
        let n = 0;
        for (let c = 0; c < 4; c++)
          n += i[h + c * 4] * e[c + o * 4];
        s[h + o * 4] = n;
      }
    const r = new v();
    return r.elements = s, r;
  }
  /** Multiply in-place: this = this * other */
  multiplySelf(t) {
    const i = this.multiply(t);
    return this.elements.set(i.elements), this;
  }
  /** Premultiply: this = other * this */
  premultiply(t) {
    const i = t.multiply(this);
    return this.elements.set(i.elements), this;
  }
  // ─── Factory methods ──────────────────────────────────────────────────────
  /** Translation matrix */
  static translation(t, i, e) {
    const s = new v(), r = s.elements;
    return r[12] = t, r[13] = i, r[14] = e, s;
  }
  /** Scale matrix */
  static scaling(t, i, e) {
    const s = new v(), r = s.elements;
    return r[0] = t, r[5] = i, r[10] = e, s;
  }
  /** Rotation around X axis by angle (radians) */
  static rotationX(t) {
    const i = new v(), e = i.elements, s = Math.cos(t), r = Math.sin(t);
    return e[5] = s, e[6] = r, e[9] = -r, e[10] = s, i;
  }
  /** Rotation around Y axis */
  static rotationY(t) {
    const i = new v(), e = i.elements, s = Math.cos(t), r = Math.sin(t);
    return e[0] = s, e[2] = -r, e[8] = r, e[10] = s, i;
  }
  /** Rotation around Z axis */
  static rotationZ(t) {
    const i = new v(), e = i.elements, s = Math.cos(t), r = Math.sin(t);
    return e[0] = s, e[1] = r, e[4] = -r, e[5] = s, i;
  }
  /**
   * Perspective projection matrix.
   * Maps view frustum to NDC cube (-1 to 1 on all axes).
   *
   * @param {number} fovY  - Vertical field of view in radians
   * @param {number} aspect - Width / height
   * @param {number} near  - Near clip plane
   * @param {number} far   - Far clip plane
   */
  static perspective(t, i, e, s) {
    const r = new v(), o = r.elements;
    o.fill(0);
    const h = 1 / Math.tan(t / 2), n = 1 / (e - s);
    return o[0] = h / i, o[5] = h, o[10] = (e + s) * n, o[11] = -1, o[14] = 2 * e * s * n, r;
  }
  /**
   * Orthographic projection matrix.
   */
  static orthographic(t, i, e, s, r, o) {
    const h = new v(), n = h.elements;
    return n.fill(0), n[0] = 2 / (i - t), n[5] = 2 / (s - e), n[10] = -2 / (o - r), n[12] = -(i + t) / (i - t), n[13] = -(s + e) / (s - e), n[14] = -(o + r) / (o - r), n[15] = 1, h;
  }
  /**
   * Camera view matrix via lookAt.
   * Builds the inverse of the camera's world transform.
   *
   * Camera looks down its local -Z axis (OpenGL convention).
   */
  static lookAt(t, i, e) {
    const s = new v(), r = s.elements;
    let o = t.x - i.x, h = t.y - i.y, n = t.z - i.z, c = Math.sqrt(o * o + h * h + n * n);
    c > 0 && (o /= c, h /= c, n /= c);
    let a = e.y * n - e.z * h, l = e.z * o - e.x * n, u = e.x * h - e.y * o, f = Math.sqrt(a * a + l * l + u * u);
    f > 0 && (a /= f, l /= f, u /= f);
    const m = h * u - n * l, d = n * a - o * u, y = o * l - h * a;
    return r[0] = a, r[1] = m, r[2] = o, r[3] = 0, r[4] = l, r[5] = d, r[6] = h, r[7] = 0, r[8] = u, r[9] = y, r[10] = n, r[11] = 0, r[12] = -(a * t.x + l * t.y + u * t.z), r[13] = -(m * t.x + d * t.y + y * t.z), r[14] = -(o * t.x + h * t.y + n * t.z), r[15] = 1, s;
  }
  /**
   * Compose a TRS (Translation * Rotation * Scale) model matrix.
   * position: Vector3, quaternion: Quaternion, scale: Vector3
   */
  static compose(t, i, e) {
    const s = new v(), r = s.elements, { x: o, y: h, z: n, w: c } = i, { x: a, y: l, z: u } = e, f = o + o, m = h + h, d = n + n, y = o * f, _ = o * m, g = o * d, z = h * m, E = h * d, M = n * d, A = c * f, R = c * m, b = c * d;
    return r[0] = (1 - (z + M)) * a, r[1] = (_ + b) * a, r[2] = (g - R) * a, r[3] = 0, r[4] = (_ - b) * l, r[5] = (1 - (y + M)) * l, r[6] = (E + A) * l, r[7] = 0, r[8] = (g + R) * u, r[9] = (E - A) * u, r[10] = (1 - (y + z)) * u, r[11] = 0, r[12] = t.x, r[13] = t.y, r[14] = t.z, r[15] = 1, s;
  }
  /** Transpose (swap rows/cols) */
  transpose() {
    const t = new v(), i = this.elements, e = t.elements;
    return e[0] = i[0], e[1] = i[4], e[2] = i[8], e[3] = i[12], e[4] = i[1], e[5] = i[5], e[6] = i[9], e[7] = i[13], e[8] = i[2], e[9] = i[6], e[10] = i[10], e[11] = i[14], e[12] = i[3], e[13] = i[7], e[14] = i[11], e[15] = i[15], t;
  }
  /** Invert this matrix (for view matrix from camera world matrix) */
  invert() {
    const t = this.elements, i = new Float32Array(16), e = t[0], s = t[1], r = t[2], o = t[3], h = t[4], n = t[5], c = t[6], a = t[7], l = t[8], u = t[9], f = t[10], m = t[11], d = t[12], y = t[13], _ = t[14], g = t[15], z = e * n - s * h, E = e * c - r * h, M = e * a - o * h, A = s * c - r * n, R = s * a - o * n, b = r * a - o * c, L = l * y - u * d, U = l * _ - f * d, C = l * g - m * d, D = u * _ - f * y, I = u * g - m * y, B = f * g - m * _;
    let w = z * B - E * I + M * D + A * C - R * U + b * L;
    if (!w) return this;
    w = 1 / w, i[0] = (n * B - c * I + a * D) * w, i[1] = (-s * B + r * I - o * D) * w, i[2] = (y * b - _ * R + g * A) * w, i[3] = (-u * b + f * R - m * A) * w, i[4] = (-h * B + c * C - a * U) * w, i[5] = (e * B - r * C + o * U) * w, i[6] = (-d * b + _ * M - g * E) * w, i[7] = (l * b - f * M + m * E) * w, i[8] = (h * I - n * C + a * L) * w, i[9] = (-e * I + s * C - o * L) * w, i[10] = (d * R - y * M + g * z) * w, i[11] = (-l * R + u * M - m * z) * w, i[12] = (-h * D + n * U - c * L) * w, i[13] = (e * D - s * U + r * L) * w, i[14] = (-d * A + y * E - _ * z) * w, i[15] = (l * A - u * E + f * z) * w;
    const V = new v();
    return V.elements = i, V;
  }
  /**
   * Extract normal matrix (upper-left 3x3, inverted and transposed).
   * Used to transform normals correctly when non-uniform scaling is applied.
   * Returns as flat Float32Array for gl.uniformMatrix3fv.
   */
  normalMatrix() {
    const t = this.elements, i = t[0], e = t[1], s = t[2], r = t[4], o = t[5], h = t[6], n = t[8], c = t[9], a = t[10], l = i * (o * a - h * c) - e * (r * a - h * n) + s * (r * c - o * n), u = l !== 0 ? 1 / l : 0, f = new Float32Array(9);
    return f[0] = (o * a - h * c) * u, f[1] = (-e * a + s * c) * u, f[2] = (e * h - s * o) * u, f[3] = (-r * a + h * n) * u, f[4] = (i * a - s * n) * u, f[5] = (-i * h + s * r) * u, f[6] = (r * c - o * n) * u, f[7] = (-i * c + e * n) * u, f[8] = (i * o - e * r) * u, f;
  }
  toString() {
    const t = this.elements, i = (e) => e.toFixed(3).padStart(8);
    return [
      `[${i(t[0])} ${i(t[4])} ${i(t[8])}  ${i(t[12])}]`,
      `[${i(t[1])} ${i(t[5])} ${i(t[9])}  ${i(t[13])}]`,
      `[${i(t[2])} ${i(t[6])} ${i(t[10])} ${i(t[14])}]`,
      `[${i(t[3])} ${i(t[7])} ${i(t[11])} ${i(t[15])}]`
    ].join(`
`);
  }
}
class P {
  constructor(t = 0, i = 0, e = 0, s = 1) {
    this.x = t, this.y = i, this.z = e, this.w = s;
  }
  set(t, i, e, s) {
    return this.x = t, this.y = i, this.z = e, this.w = s, this;
  }
  clone() {
    return new P(this.x, this.y, this.z, this.w);
  }
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w, this;
  }
  identity() {
    return this.x = 0, this.y = 0, this.z = 0, this.w = 1, this;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  normalizeSelf() {
    const t = this.length();
    return t > 0 && (this.x /= t, this.y /= t, this.z /= t, this.w /= t), this;
  }
  conjugate() {
    return new P(-this.x, -this.y, -this.z, this.w);
  }
  multiply(t) {
    const i = this.x, e = this.y, s = this.z, r = this.w, o = t.x, h = t.y, n = t.z, c = t.w;
    return new P(
      r * o + i * c + e * n - s * h,
      r * h - i * n + e * c + s * o,
      r * n + i * h - e * o + s * c,
      r * c - i * o - e * h - s * n
    );
  }
  multiplySelf(t) {
    return this.copy(this.multiply(t));
  }
  setFromEuler(t, i, e, s = "YXZ") {
    const r = Math.cos(t / 2), o = Math.sin(t / 2), h = Math.cos(i / 2), n = Math.sin(i / 2), c = Math.cos(e / 2), a = Math.sin(e / 2);
    return s === "XYZ" ? (this.x = o * h * c + r * n * a, this.y = r * n * c - o * h * a, this.z = r * h * a + o * n * c, this.w = r * h * c - o * n * a) : s === "YXZ" ? (this.x = o * h * c + r * n * a, this.y = r * n * c - o * h * a, this.z = r * h * a - o * n * c, this.w = r * h * c + o * n * a) : (this.x = o * h * c - r * n * a, this.y = r * n * c + o * h * a, this.z = r * h * a - o * n * c, this.w = r * h * c + o * n * a), this;
  }
  setFromAxisAngle(t, i) {
    const e = i / 2, s = Math.sin(e);
    return this.x = t.x * s, this.y = t.y * s, this.z = t.z * s, this.w = Math.cos(e), this;
  }
  slerp(t, i) {
    let e = this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w, s = t.x, r = t.y, o = t.z, h = t.w;
    if (e < 0 && (s = -s, r = -r, o = -o, h = -h, e = -e), e > 0.9995)
      return new P(
        this.x + i * (s - this.x),
        this.y + i * (r - this.y),
        this.z + i * (o - this.z),
        this.w + i * (h - this.w)
      ).normalizeSelf();
    const n = Math.acos(e), c = n * i, a = Math.sin(c), l = Math.sin(n), u = Math.cos(c) - e * a / l, f = a / l;
    return new P(u * this.x + f * s, u * this.y + f * r, u * this.z + f * o, u * this.w + f * h);
  }
  toArray() {
    return [this.x, this.y, this.z, this.w];
  }
}
let $ = 0;
class T {
  constructor() {
    this.id = $++, this.name = "", this.type = "Object3D", this.position = new x(0, 0, 0), this.quaternion = new P(0, 0, 0, 1), this.scale = new x(1, 1, 1), this.rotation = new x(0, 0, 0), this.matrix = new v(), this.worldMatrix = new v(), this.parent = null, this.children = [], this.visible = !0, this.castShadow = !1, this.matrixDirty = !0;
  }
  // ─── Scene Graph ────────────────────────────────────────────────────────────
  add(t) {
    return t.parent && t.parent.remove(t), t.parent = this, this.children.push(t), this;
  }
  remove(t) {
    const i = this.children.indexOf(t);
    return i !== -1 && (this.children.splice(i, 1), t.parent = null), this;
  }
  traverse(t) {
    t(this);
    for (const i of this.children) i.traverse(t);
  }
  // ─── Matrix updates ─────────────────────────────────────────────────────────
  /** Rebuild local matrix from position / rotation (Euler) / scale */
  updateMatrix() {
    this.quaternion.setFromEuler(
      this.rotation.x,
      this.rotation.y,
      this.rotation.z,
      "YXZ"
    ), this.matrix = v.compose(this.position, this.quaternion, this.scale), this.matrixDirty = !1;
  }
  /** Walk up the parent chain to build the world matrix */
  updateWorldMatrix(t = !1, i = !1) {
    if (t && this.parent && this.parent.updateWorldMatrix(!0, !1), this.updateMatrix(), this.parent ? this.worldMatrix = this.parent.worldMatrix.multiply(this.matrix) : this.worldMatrix.copy(this.matrix), i)
      for (const e of this.children)
        e.updateWorldMatrix(!1, !0);
  }
  // ─── Convenience helpers ────────────────────────────────────────────────────
  /** Look at a world-space target */
  lookAt(t) {
    const i = this.position.sub(t).normalizeSelf();
    this.quaternion.setFromAxisAngle(i, 0);
  }
  getWorldPosition() {
    this.updateWorldMatrix();
    const t = this.worldMatrix.elements;
    return new x(t[12], t[13], t[14]);
  }
  clone() {
    const t = new T();
    return t.position.setFrom(this.position), t.rotation.setFrom(this.rotation), t.scale.setFrom(this.scale), t;
  }
}
class it extends T {
  constructor() {
    super(), this.type = "Scene", this.background = { r: 0.05, g: 0.05, b: 0.1, a: 1 }, this._lights = [];
  }
  /** Override add to track lights separately */
  add(t) {
    return super.add(t), t.isLight && this._lights.push(t), this;
  }
  remove(t) {
    if (super.remove(t), t.isLight) {
      const i = this._lights.indexOf(t);
      i !== -1 && this._lights.splice(i, 1);
    }
    return this;
  }
  /** Collect all renderable objects (Meshes, ParticleSystems, etc.) */
  getRenderList() {
    const t = [];
    return this.traverse((i) => {
      (i.isMesh || i.isParticleSystem) && t.push(i);
    }), t;
  }
  getLights() {
    return this._lights;
  }
  setBackground(t, i, e, s = 1) {
    this.background = { r: t, g: i, b: e, a: s };
  }
}
class X {
  constructor(t, i, e) {
    this.gl = t, this.glProgram = this._compile(i, e), this._uniformCache = {}, this._attribCache = {};
  }
  _compileShader(t, i) {
    const e = this.gl, s = e.createShader(t);
    if (e.shaderSource(s, i), e.compileShader(s), !e.getShaderParameter(s, e.COMPILE_STATUS)) {
      const r = t === e.VERTEX_SHADER ? "VERTEX" : "FRAGMENT";
      return console.error(`[NovaJS] ${r} shader compile error:
`, e.getShaderInfoLog(s)), console.error(`Source:
`, i.split(`
`).map((o, h) => `${h + 1}: ${o}`).join(`
`)), e.deleteShader(s), null;
    }
    return s;
  }
  _compile(t, i) {
    const e = this.gl, s = this._compileShader(e.VERTEX_SHADER, t), r = this._compileShader(e.FRAGMENT_SHADER, i);
    if (!s || !r) throw new Error("[NovaJS] Shader compilation failed");
    const o = e.createProgram();
    if (e.attachShader(o, s), e.attachShader(o, r), e.linkProgram(o), !e.getProgramParameter(o, e.LINK_STATUS))
      throw console.error("[NovaJS] Program link error:", e.getProgramInfoLog(o)), new Error("[NovaJS] Shader program link failed");
    return e.deleteShader(s), e.deleteShader(r), o;
  }
  use() {
    this.gl.useProgram(this.glProgram);
  }
  // ─── Uniform helpers ────────────────────────────────────────────────────────
  _loc(t) {
    return this._uniformCache[t] === void 0 && (this._uniformCache[t] = this.gl.getUniformLocation(this.glProgram, t)), this._uniformCache[t];
  }
  setFloat(t, i) {
    const e = this._loc(t);
    e != null && this.gl.uniform1f(e, i);
  }
  setInt(t, i) {
    const e = this._loc(t);
    e != null && this.gl.uniform1i(e, i);
  }
  setVec2(t, i, e) {
    const s = this._loc(t);
    s != null && this.gl.uniform2f(s, i, e);
  }
  setVec3(t, i, e, s) {
    const r = this._loc(t);
    r != null && this.gl.uniform3f(r, i, e, s);
  }
  setVec4(t, i, e, s, r) {
    const o = this._loc(t);
    o != null && this.gl.uniform4f(o, i, e, s, r);
  }
  setMat3(t, i) {
    const e = this._loc(t);
    e != null && this.gl.uniformMatrix3fv(e, !1, i);
  }
  setMat4(t, i) {
    const e = this._loc(t);
    e != null && this.gl.uniformMatrix4fv(e, !1, i instanceof Float32Array ? i : new Float32Array(i));
  }
  /** Generic setter — dispatch by value type */
  setUniform(t, i) {
    i instanceof Float32Array ? i.length === 16 ? this.setMat4(t, i) : i.length === 9 ? this.setMat3(t, i) : i.length === 4 ? this.gl.uniform4fv(this._loc(t), i) : i.length === 3 ? this.gl.uniform3fv(this._loc(t), i) : i.length === 2 && this.gl.uniform2fv(this._loc(t), i) : Array.isArray(i) ? this.setUniform(t, new Float32Array(i)) : typeof i == "number" ? this.setFloat(t, i) : typeof i == "boolean" && this.setInt(t, i ? 1 : 0);
  }
  // ─── Attribute helpers ──────────────────────────────────────────────────────
  attribLocation(t) {
    return this._attribCache[t] === void 0 && (this._attribCache[t] = this.gl.getAttribLocation(this.glProgram, t)), this._attribCache[t];
  }
  destroy() {
    this.gl.deleteProgram(this.glProgram);
  }
}
const j = `#version 300 es
precision highp float;

// Per-vertex attributes
in vec3 position;
in vec3 normal;
in vec2 uv;

// MVP matrices — THE CRITICAL TRANSFORM PIPELINE
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

// Passed to fragment shader
out vec3 vWorldPos;
out vec3 vNormal;
out vec2 vUV;
out vec3 vViewPos;

void main() {
  // Step 1: model → world space
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;

  // Step 2: correct normal for non-uniform scaling
  vNormal = normalize(normalMatrix * normal);

  vUV = uv;

  // Step 3: world → view → clip space
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`, H = `#version 300 es
precision highp float;

in vec3 vWorldPos;
in vec3 vNormal;
in vec2 vUV;

uniform vec3  color;
uniform float opacity;
uniform float time;

// Lights (up to 4 point lights)
uniform vec3  ambientColor;
uniform vec3  dirLightDir;
uniform vec3  dirLightColor;
uniform vec3  pointLightPos[4];
uniform vec3  pointLightColor[4];
uniform int   numPointLights;

out vec4 fragColor;

void main() {
  vec3 N = normalize(vNormal);

  // Ambient
  vec3 lighting = ambientColor;

  // Directional light (Lambert diffuse)
  vec3 L = normalize(-dirLightDir);
  float diff = max(dot(N, L), 0.0);
  lighting += dirLightColor * diff;

  // Point lights
  for (int i = 0; i < 4; i++) {
    if (i >= numPointLights) break;
    vec3 Lp   = pointLightPos[i] - vWorldPos;
    float dist = length(Lp);
    vec3 Ln    = Lp / dist;
    float atten = 1.0 / (1.0 + 0.09 * dist + 0.032 * dist * dist);
    float d    = max(dot(N, Ln), 0.0);
    lighting  += pointLightColor[i] * d * atten;
  }

  vec3 finalColor = color * lighting;
  fragColor = vec4(finalColor, opacity);
}
`;
class W {
  constructor(t) {
    const i = t.getContext("webgl2", {
      antialias: !0,
      alpha: !1,
      depth: !0,
      stencil: !1,
      powerPreference: "high-performance"
    });
    if (!i) throw new Error("[NovaJS] WebGL2 not supported in this browser");
    this.gl = i, this.canvas = t, this._programCache = /* @__PURE__ */ new Map(), this._vaoCache = /* @__PURE__ */ new Map(), this._textureCache = /* @__PURE__ */ new Map(), i.enable(i.DEPTH_TEST), i.depthFunc(i.LEQUAL), i.enable(i.BLEND), i.blendFunc(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA), this.resize(t.clientWidth, t.clientHeight);
  }
  // ─── Resize ───────────────────────────────────────────────────────────────
  resize(t, i) {
    this.canvas.width = t, this.canvas.height = i, this.gl.viewport(0, 0, t, i);
  }
  // ─── Program cache ────────────────────────────────────────────────────────
  _getProgram(t) {
    const i = t.id;
    if (!this._programCache.has(i)) {
      const e = t.vertexShader || j, s = t.fragmentShader || H, r = new X(this.gl, e, s);
      this._programCache.set(i, r);
    }
    return this._programCache.get(i);
  }
  // ─── VAO cache ────────────────────────────────────────────────────────────
  /**
   * Build (or retrieve) a VAO that binds geometry attributes to a program.
   * A VAO records all the attribute pointer state, so we just bind it at draw time.
   */
  _getVAO(t, i) {
    const e = `${t.id}_${i.glProgram}`;
    if (this._vaoCache.has(e)) return this._vaoCache.get(e);
    const s = this.gl, r = s.createVertexArray();
    s.bindVertexArray(r);
    const o = (h, n, c) => {
      const a = i.attribLocation(h);
      if (a < 0) return;
      const l = s.createBuffer();
      s.bindBuffer(s.ARRAY_BUFFER, l), s.bufferData(s.ARRAY_BUFFER, n instanceof Float32Array ? n : new Float32Array(n), s.STATIC_DRAW), s.enableVertexAttribArray(a), s.vertexAttribPointer(a, c, s.FLOAT, !1, 0, 0);
    };
    if (t.positions && o("position", t.positions, 3), t.normals && o("normal", t.normals, 3), t.uvs && o("uv", t.uvs, 2), t.indices) {
      const h = s.createBuffer();
      s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, h), s.bufferData(
        s.ELEMENT_ARRAY_BUFFER,
        t.indices instanceof Uint16Array ? t.indices : new Uint16Array(t.indices),
        s.STATIC_DRAW
      );
    }
    return s.bindVertexArray(null), this._vaoCache.set(e, r), r;
  }
  // ─── Texture binding ─────────────────────────────────────────────────────
  _bindTexture(t, i, e, s) {
    !e || !e._glTexture || (this.gl.activeTexture(this.gl.TEXTURE0 + s), this.gl.bindTexture(this.gl.TEXTURE_2D, e._glTexture), t.setInt(i, s));
  }
  // ─── Light uniforms ────────────────────────────────────────────────────────
  _uploadLights(t, i) {
    t.setVec3("ambientColor", 0.15, 0.15, 0.15), t.setVec3("dirLightDir", 0, -1, 0), t.setVec3("dirLightColor", 0, 0, 0), t.setInt("numPointLights", 0);
    let e = 0;
    for (const s of i)
      if (s.type === "AmbientLight")
        t.setVec3(
          "ambientColor",
          s.color.r * s.intensity,
          s.color.g * s.intensity,
          s.color.b * s.intensity
        );
      else if (s.type === "DirectionalLight") {
        const r = s.getDirection ? s.getDirection() : { x: 0, y: -1, z: 0 };
        t.setVec3("dirLightDir", r.x, r.y, r.z), t.setVec3(
          "dirLightColor",
          s.color.r * s.intensity,
          s.color.g * s.intensity,
          s.color.b * s.intensity
        );
      } else s.type === "PointLight" && e < 4 && (this.gl.uniform3f(
        this.gl.getUniformLocation(t.glProgram, `pointLightPos[${e}]`),
        s.position.x,
        s.position.y,
        s.position.z
      ), this.gl.uniform3f(
        this.gl.getUniformLocation(t.glProgram, `pointLightColor[${e}]`),
        s.color.r * s.intensity,
        s.color.g * s.intensity,
        s.color.b * s.intensity
      ), e++);
    t.setInt("numPointLights", e);
  }
  // ─── Draw a single mesh ───────────────────────────────────────────────────
  _renderMesh(t, i, e, s) {
    if (!t.visible) return;
    const r = this.gl, o = t.material, h = t.geometry;
    if (!h || !o) return;
    const n = this._getProgram(o);
    n.use(), t.updateWorldMatrix(), i.updateMatrices(), n.setMat4("modelMatrix", t.worldMatrix.elements), n.setMat4("viewMatrix", i.viewMatrix.elements), n.setMat4("projectionMatrix", i.projectionMatrix.elements);
    const c = t.worldMatrix.normalMatrix();
    n.setMat3("normalMatrix", c);
    const a = i.position;
    n.setVec3("cameraPos", a.x, a.y, a.z), n.setFloat("time", s);
    const l = o.color || { r: 1, g: 1, b: 1 };
    if (n.setVec3("color", l.r, l.g, l.b), n.setFloat("opacity", o.opacity !== void 0 ? o.opacity : 1), o.uniforms)
      for (const [f, m] of Object.entries(o.uniforms))
        n.setUniform(f, typeof m == "object" && m.value !== void 0 ? m.value : m);
    o.unlit ? (n.setVec3("ambientColor", 1, 1, 1), n.setVec3("dirLightColor", 0, 0, 0), n.setInt("numPointLights", 0)) : this._uploadLights(n, e), o.map && this._bindTexture(n, "map", o.map, 0);
    const u = this._getVAO(h, n);
    r.bindVertexArray(u), h.indices && h.indices.length > 0 ? r.drawElements(r.TRIANGLES, h.indices.length, r.UNSIGNED_SHORT, 0) : h.positions && r.drawArrays(r.TRIANGLES, 0, h.positions.length / 3), r.bindVertexArray(null);
  }
  // ─── Main render call ─────────────────────────────────────────────────────
  render(t, i, e = 0) {
    const s = this.gl, r = t.background;
    s.clearColor(r.r, r.g, r.b, r.a), s.clear(s.COLOR_BUFFER_BIT | s.DEPTH_BUFFER_BIT), i.updateMatrices();
    const o = t.getRenderList(), h = t.getLights();
    for (const n of o)
      n.isMesh ? this._renderMesh(n, i, h, e) : n.isParticleSystem && n.render(s, i, e);
  }
  destroy() {
    for (const t of this._programCache.values()) t.destroy();
    this._programCache.clear();
  }
}
class et {
  constructor(t) {
    if (typeof t == "string" && (t = document.getElementById(t)), !t) throw new Error("NovaJS: no canvas provided");
    this.canvas = t, this.renderer = new W(t), this._running = !1, this._rafId = null, this._lastTime = 0, this._totalTime = 0, this._onResize = () => {
      this.renderer.resize(window.innerWidth, window.innerHeight), this._camera && this._camera.setAspect && this._camera.setAspect(window.innerWidth / window.innerHeight);
    }, window.addEventListener("resize", this._onResize), this._onResize();
  }
  start(t, i, e = () => {
  }) {
    this._scene = t, this._camera = i, this._update = e, this._running = !0;
    const s = (r) => {
      if (!this._running) return;
      const o = Math.min((r - this._lastTime) / 1e3, 0.1);
      this._lastTime = r, this._totalTime += o, this._update(o, this._totalTime), this.renderer.render(t, i, this._totalTime), this._rafId = requestAnimationFrame(s);
    };
    this._lastTime = performance.now(), this._rafId = requestAnimationFrame(s);
  }
  stop() {
    this._running = !1, this._rafId && cancelAnimationFrame(this._rafId);
  }
  destroy() {
    this.stop(), window.removeEventListener("resize", this._onResize), this.renderer.destroy();
  }
}
class Y extends T {
  constructor() {
    super(), this.type = "Camera", this.isCamera = !0, this.projectionMatrix = new v(), this.viewMatrix = new v(), this._target = new x(0, 0, 0);
  }
  /** Rebuild viewMatrix — called every frame by renderer */
  updateMatrices() {
    this.updateMatrix();
    const t = this.matrix.elements, i = -t[8], e = -t[9], s = -t[10], r = new x(
      this.position.x + i,
      this.position.y + e,
      this.position.z + s
    ), o = new x(t[4], t[5], t[6]);
    this.viewMatrix = v.lookAt(this.position, r, o);
  }
}
class st extends Y {
  constructor(t = 75, i = 16 / 9, e = 0.1, s = 1e3) {
    super(), this.type = "PerspectiveCamera", this.fov = t, this.aspect = i, this.near = e, this.far = s, this._updateProjection();
  }
  _updateProjection() {
    this.projectionMatrix = v.perspective(
      this.fov * Math.PI / 180,
      this.aspect,
      this.near,
      this.far
    );
  }
  setAspect(t) {
    this.aspect = t, this._updateProjection();
  }
  setFOV(t) {
    this.fov = t, this._updateProjection();
  }
  updateMatrices() {
    this._updateProjection(), super.updateMatrices();
  }
}
class rt extends Y {
  constructor(t = -10, i = 10, e = -10, s = 10, r = 0.1, o = 1e3) {
    super(), this.type = "OrthographicCamera", this.left = t, this.right = i, this.bottom = e, this.top = s, this.near = r, this.far = o, this.projectionMatrix = v.orthographic(t, i, e, s, r, o);
  }
  updateMatrices() {
    this.projectionMatrix = v.orthographic(
      this.left,
      this.right,
      this.bottom,
      this.top,
      this.near,
      this.far
    ), super.updateMatrices();
  }
}
let q = 0;
class N {
  constructor() {
    this.id = q++, this.positions = null, this.normals = null, this.uvs = null, this.indices = null;
  }
  setPositions(t) {
    return this.positions = t instanceof Float32Array ? t : new Float32Array(t), this;
  }
  setNormals(t) {
    return this.normals = t instanceof Float32Array ? t : new Float32Array(t), this;
  }
  setUVs(t) {
    return this.uvs = t instanceof Float32Array ? t : new Float32Array(t), this;
  }
  setIndices(t) {
    return this.indices = t instanceof Uint16Array ? t : new Uint16Array(t), this;
  }
  get vertexCount() {
    return this.positions ? this.positions.length / 3 : 0;
  }
}
class ot extends N {
  constructor(t = 1, i = 1, e = 1) {
    super();
    const s = t / 2, r = i / 2, o = e / 2, h = [
      // pos (+X face) — normal (1,0,0)
      { verts: [[s, r, -o], [s, -r, -o], [s, -r, o], [s, r, o]], n: [1, 0, 0] },
      // neg (-X face) — normal (-1,0,0)
      { verts: [[-s, r, o], [-s, -r, o], [-s, -r, -o], [-s, r, -o]], n: [-1, 0, 0] },
      // top (+Y face)
      { verts: [[-s, r, o], [s, r, o], [s, r, -o], [-s, r, -o]], n: [0, 1, 0] },
      // bottom (-Y face)
      { verts: [[-s, -r, -o], [s, -r, -o], [s, -r, o], [-s, -r, o]], n: [0, -1, 0] },
      // front (+Z face)
      { verts: [[-s, r, o], [-s, -r, o], [s, -r, o], [s, r, o]], n: [0, 0, 1] },
      // back (-Z face)
      { verts: [[s, r, -o], [s, -r, -o], [-s, -r, -o], [-s, r, -o]], n: [0, 0, -1] }
    ], n = [[0, 1], [0, 0], [1, 0], [1, 1]], c = [], a = [], l = [], u = [];
    h.forEach((f, m) => {
      const d = m * 4;
      f.verts.forEach((y, _) => {
        c.push(...y), a.push(...f.n), l.push(...n[_]);
      }), u.push(d, d + 1, d + 2, d, d + 2, d + 3);
    }), this.setPositions(c), this.setNormals(a), this.setUVs(l), this.setIndices(u);
  }
}
class nt extends N {
  constructor(t = 1, i = 1, e = 1, s = 1) {
    super();
    const r = [], o = [], h = [], n = [], c = t / e, a = i / s;
    for (let l = 0; l <= s; l++)
      for (let u = 0; u <= e; u++) {
        const f = u * c - t / 2, m = l * a - i / 2;
        r.push(f, 0, m), o.push(0, 1, 0), h.push(u / e, 1 - l / s);
      }
    for (let l = 0; l < s; l++)
      for (let u = 0; u < e; u++) {
        const f = l * (e + 1) + u, m = f + 1, d = f + (e + 1), y = d + 1;
        n.push(f, d, m, m, d, y);
      }
    this.setPositions(r), this.setNormals(o), this.setUVs(h), this.setIndices(n);
  }
}
class ht extends N {
  constructor(t = 1, i = 32, e = 16) {
    super();
    const s = [], r = [], o = [], h = [];
    for (let n = 0; n <= e; n++) {
      const c = n / e, a = c * Math.PI;
      for (let l = 0; l <= i; l++) {
        const u = l / i, f = u * Math.PI * 2, m = -Math.cos(f) * Math.sin(a), d = Math.cos(a), y = Math.sin(f) * Math.sin(a);
        s.push(m * t, d * t, y * t), r.push(m, d, y), o.push(u, 1 - c);
      }
    }
    for (let n = 0; n < e; n++)
      for (let c = 0; c < i; c++) {
        const a = (i + 1) * n + c, l = a + i + 1;
        h.push(a, l, a + 1, l + 1, a + 1, l);
      }
    this.setPositions(s), this.setNormals(r), this.setUVs(o), this.setIndices(h);
  }
}
class at extends N {
  constructor(t = 1, i = 0.4, e = 32, s = 16) {
    super();
    const r = [], o = [], h = [], n = [];
    for (let c = 0; c <= e; c++)
      for (let a = 0; a <= s; a++) {
        const l = a / s * Math.PI * 2, u = c / e * Math.PI * 2, f = (t + i * Math.cos(u)) * Math.cos(l), m = i * Math.sin(u), d = (t + i * Math.cos(u)) * Math.sin(l);
        r.push(f, m, d);
        const y = Math.cos(l) * Math.cos(u), _ = Math.sin(u), g = Math.sin(l) * Math.cos(u);
        o.push(y, _, g), h.push(a / s, c / e);
      }
    for (let c = 0; c < e; c++)
      for (let a = 0; a < s; a++) {
        const l = (s + 1) * c + a, u = (s + 1) * (c + 1) + a;
        n.push(l, u, l + 1, u + 1, l + 1, u);
      }
    this.setPositions(r), this.setNormals(o), this.setUVs(h), this.setIndices(n);
  }
}
let Z = 0;
class O {
  constructor() {
    this.id = Z++, this.type = "Material", this.color = { r: 1, g: 1, b: 1 }, this.opacity = 1, this.unlit = !1, this.map = null, this.uniforms = {}, this.vertexShader = null, this.fragmentShader = null;
  }
  setColor(t, i, e) {
    return this.color = { r: t, g: i, b: e }, this;
  }
  setColorHex(t) {
    return this.color = {
      r: (t >> 16 & 255) / 255,
      g: (t >> 8 & 255) / 255,
      b: (t & 255) / 255
    }, this;
  }
}
class ct extends O {
  constructor(t = {}) {
    super(), this.type = "BasicMaterial", t.color !== void 0 && (typeof t.color == "number" ? this.setColorHex(t.color) : Array.isArray(t.color) ? this.color = { r: t.color[0], g: t.color[1], b: t.color[2] } : this.color = t.color), t.opacity !== void 0 && (this.opacity = t.opacity), t.unlit !== void 0 && (this.unlit = t.unlit), t.map !== void 0 && (this.map = t.map);
  }
}
class lt extends O {
  constructor(t = {}) {
    super(), this.type = "ShaderMaterial", this.vertexShader = t.vertexShader || null, this.fragmentShader = t.fragmentShader || null, this.uniforms = t.uniforms || {}, this.unlit = !0, t.color && (typeof t.color == "number" ? this.setColorHex(t.color) : this.color = t.color);
  }
}
class k extends T {
  constructor(t, i) {
    super(), this.type = "Mesh", this.isMesh = !0, this.geometry = t, this.material = i;
  }
  clone() {
    const t = new k(this.geometry, this.material);
    return t.position.setFrom(this.position), t.rotation.setFrom(this.rotation), t.scale.setFrom(this.scale), t;
  }
}
class ut extends T {
  constructor(t = 16777215, i = 0.4) {
    super(), this.type = "AmbientLight", this.isLight = !0, this.intensity = i, this.color = this._hexToRgb(t);
  }
  _hexToRgb(t) {
    return { r: (t >> 16 & 255) / 255, g: (t >> 8 & 255) / 255, b: (t & 255) / 255 };
  }
  setColor(t) {
    return this.color = this._hexToRgb(t), this;
  }
}
class ft extends T {
  constructor(t = 16777215, i = 1) {
    super(), this.type = "DirectionalLight", this.isLight = !0, this.intensity = i, this.color = this._hexToRgb(t), this.target = new x(0, 0, 0);
  }
  _hexToRgb(t) {
    return { r: (t >> 16 & 255) / 255, g: (t >> 8 & 255) / 255, b: (t & 255) / 255 };
  }
  getDirection() {
    return this.target.sub(this.position).normalizeSelf();
  }
}
class dt extends T {
  constructor(t = 16777215, i = 1, e = 100) {
    super(), this.type = "PointLight", this.isLight = !0, this.intensity = i, this.distance = e, this.color = this._hexToRgb(t);
  }
  _hexToRgb(t) {
    return { r: (t >> 16 & 255) / 255, g: (t >> 8 & 255) / 255, b: (t & 255) / 255 };
  }
}
class mt {
  constructor() {
    this.gravity = new x(0, -9.81, 0), this.bodies = [], this.colliders = [];
  }
  addBody(t) {
    return this.bodies.push(t), t;
  }
  addStaticBox(t, i, e, s, r, o) {
    this.colliders.push({ min: { x: t, y: i, z: e }, max: { x: s, y: r, z: o } });
  }
  step(t) {
    for (const i of this.bodies)
      if (!i.isStatic) {
        i.useGravity && (i.velocity.x += this.gravity.x * t, i.velocity.y += this.gravity.y * t, i.velocity.z += this.gravity.z * t), i.mesh.position.x += i.velocity.x * t, i.mesh.position.y += i.velocity.y * t, i.mesh.position.z += i.velocity.z * t, i.isGrounded && (i.velocity.x *= Math.pow(i.friction, t * 60), i.velocity.z *= Math.pow(i.friction, t * 60)), i.isGrounded = !1;
        for (const e of this.colliders) {
          const s = i.mesh.position, r = i.halfSize, o = { x: s.x - r.x, y: s.y - r.y, z: s.z - r.z }, h = { x: s.x + r.x, y: s.y + r.y, z: s.z + r.z };
          if (h.x > e.min.x && o.x < e.max.x && h.y > e.min.y && o.y < e.max.y && h.z > e.min.z && o.z < e.max.z) {
            const n = e.max.x - o.x, c = h.x - e.min.x, a = e.max.y - o.y, l = h.y - e.min.y, u = e.max.z - o.z, f = h.z - e.min.z, m = Math.min(n, c), d = Math.min(a, l), y = Math.min(u, f);
            d <= m && d <= y ? l < a ? (i.mesh.position.y -= l, i.velocity.y > 0 && (i.velocity.y = 0)) : (i.mesh.position.y += a, i.velocity.y < 0 && (i.velocity.y = 0), i.isGrounded = !0) : m < y ? c < n ? (i.mesh.position.x -= c, i.velocity.x > 0 && (i.velocity.x = 0)) : (i.mesh.position.x += n, i.velocity.x < 0 && (i.velocity.x = 0)) : f < u ? (i.mesh.position.z -= f, i.velocity.z > 0 && (i.velocity.z = 0)) : (i.mesh.position.z += u, i.velocity.z < 0 && (i.velocity.z = 0));
          }
        }
      }
  }
  /** Simple raycast against colliders. Returns {hit, point, distance} */
  raycast(t, i, e = 1e3) {
    let s = null, r = e;
    const o = i.normalize();
    for (const h of this.colliders) {
      const n = (h.min.x - t.x) / o.x, c = (h.max.x - t.x) / o.x, a = (h.min.y - t.y) / o.y, l = (h.max.y - t.y) / o.y, u = (h.min.z - t.z) / o.z, f = (h.max.z - t.z) / o.z, m = Math.min(n, c), d = Math.max(n, c), y = Math.min(a, l), _ = Math.max(a, l), g = Math.min(u, f), z = Math.max(u, f), E = Math.max(m, y, g), M = Math.min(d, _, z);
      E < M && E > 0 && E < r && (r = E, s = {
        hit: !0,
        distance: E,
        point: new x(t.x + o.x * E, t.y + o.y * E, t.z + o.z * E)
      });
    }
    return s || { hit: !1 };
  }
}
class xt {
  constructor(t, i = {}) {
    this.mesh = t, this.velocity = new x(0, 0, 0), this.halfSize = i.halfSize || new x(0.5, 0.5, 0.5), this.mass = i.mass ?? 1, this.useGravity = i.useGravity ?? !0, this.isStatic = i.isStatic ?? !1, this.friction = i.friction ?? 0.85, this.isGrounded = !1, this.bounciness = i.bounciness ?? 0;
  }
  applyForce(t, i, e) {
    this.velocity.x += t / this.mass, this.velocity.y += i / this.mass, this.velocity.z += e / this.mass;
  }
  jump(t = 5) {
    this.isGrounded && (this.velocity.y = t, this.isGrounded = !1);
  }
}
class yt {
  constructor(t, i, e = {}) {
    this.camera = t, this.canvas = i, this.moveSpeed = e.moveSpeed ?? 5, this.sprintMult = e.sprintMult ?? 2, this.crouchMult = e.crouchMult ?? 0.4, this.lookSpeed = e.lookSpeed ?? 2e-3, this.jumpForce = e.jumpForce ?? 5, this.gravity = e.gravity ?? 20, this.eyeHeight = e.eyeHeight ?? 1.7, this.groundY = e.groundY ?? 0, this._yaw = 0, this._pitch = 0, this._velY = 0, this._onGround = !0, this._keys = {}, this._locked = !1, this._bindEvents(), this.camera.position.y = this.groundY + this.eyeHeight;
  }
  _bindEvents() {
    this.canvas.addEventListener("click", () => {
      this.canvas.requestPointerLock();
    }), document.addEventListener("pointerlockchange", () => {
      this._locked = document.pointerLockElement === this.canvas;
    }), document.addEventListener("mousemove", (t) => {
      this._locked && (this._yaw -= t.movementX * this.lookSpeed, this._pitch -= t.movementY * this.lookSpeed, this._pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, this._pitch)));
    }), document.addEventListener("keydown", (t) => {
      this._keys[t.code] = !0;
    }), document.addEventListener("keyup", (t) => {
      this._keys[t.code] = !1;
    });
  }
  update(t) {
    const i = this.camera, e = this._keys;
    i.rotation.x = this._pitch, i.rotation.y = this._yaw, i.rotation.z = 0;
    const s = Math.sin(this._yaw), r = Math.cos(this._yaw);
    let o = 0, h = 0;
    (e.KeyW || e.ArrowUp) && (o -= s, h -= r), (e.KeyS || e.ArrowDown) && (o += s, h += r), (e.KeyA || e.ArrowLeft) && (o -= r, h += s), (e.KeyD || e.ArrowRight) && (o += r, h -= s);
    let n = this.moveSpeed;
    (e.ShiftLeft || e.ShiftRight) && (n *= this.sprintMult), (e.ControlLeft || e.KeyC) && (n *= this.crouchMult);
    const c = Math.sqrt(o * o + h * h);
    c > 0 && (o /= c, h /= c), i.position.x += o * n * t, i.position.z += h * n * t, this._onGround && (e.Space || e.KeyE) && (this._velY = this.jumpForce, this._onGround = !1), this._onGround || (this._velY -= this.gravity * t), i.position.y += this._velY * t;
    const a = this.groundY + this.eyeHeight;
    i.position.y <= a && (i.position.y = a, this._velY = 0, this._onGround = !0);
  }
  /** Set ground Y dynamically (e.g. for terrain) */
  setGroundY(t) {
    this.groundY = t;
  }
  dispose() {
    document.exitPointerLock();
  }
}
class pt {
  constructor(t) {
    this.gl = t;
  }
  load(t, i = null) {
    const e = this.gl, s = { _glTexture: null, width: 0, height: 0, loaded: !1 }, r = e.createTexture();
    e.bindTexture(e.TEXTURE_2D, r), e.texImage2D(
      e.TEXTURE_2D,
      0,
      e.RGBA,
      1,
      1,
      0,
      e.RGBA,
      e.UNSIGNED_BYTE,
      new Uint8Array([255, 0, 255, 255])
    ), s._glTexture = r;
    const o = new Image();
    return o.crossOrigin = "anonymous", o.onload = () => {
      e.bindTexture(e.TEXTURE_2D, r), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, o), e.generateMipmap(e.TEXTURE_2D), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR_MIPMAP_LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.REPEAT), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.REPEAT), s.width = o.width, s.height = o.height, s.loaded = !0, i && i(s);
    }, o.src = t, s;
  }
  /** Create a solid-color texture procedurally */
  fromColor(t, i, e, s = 255) {
    const r = this.gl, o = r.createTexture();
    return r.bindTexture(r.TEXTURE_2D, o), r.texImage2D(
      r.TEXTURE_2D,
      0,
      r.RGBA,
      1,
      1,
      0,
      r.RGBA,
      r.UNSIGNED_BYTE,
      new Uint8Array([t, i, e, s])
    ), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.NEAREST), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.NEAREST), { _glTexture: o, loaded: !0 };
  }
}
class vt {
  parse(t) {
    const i = [], e = [], s = [], r = [], o = [], h = [], n = t.split(`
`);
    for (let a of n)
      if (a = a.trim(), a.startsWith("v ")) {
        const [, l, u, f] = a.split(/\s+/);
        i.push(parseFloat(l), parseFloat(u), parseFloat(f));
      } else if (a.startsWith("vn ")) {
        const [, l, u, f] = a.split(/\s+/);
        e.push(parseFloat(l), parseFloat(u), parseFloat(f));
      } else if (a.startsWith("vt ")) {
        const [, l, u] = a.split(/\s+/);
        s.push(parseFloat(l), parseFloat(u));
      } else if (a.startsWith("f ")) {
        const l = a.slice(2).trim().split(/\s+/);
        for (let u = 1; u < l.length - 1; u++)
          [l[0], l[u], l[u + 1]].forEach((f) => {
            const [m, d, y] = f.split("/").map((g) => parseInt(g) || 0), _ = (m - 1) * 3;
            if (r.push(i[_], i[_ + 1], i[_ + 2]), y) {
              const g = (y - 1) * 3;
              o.push(e[g], e[g + 1], e[g + 2]);
            } else
              o.push(0, 1, 0);
            if (d) {
              const g = (d - 1) * 2;
              h.push(s[g], s[g + 1]);
            } else
              h.push(0, 0);
          });
      }
    const c = new N();
    return c.setPositions(r), c.setNormals(o), c.setUVs(h), c;
  }
  async load(t) {
    const e = await (await fetch(t)).text();
    return this.parse(e);
  }
}
const J = `#version 300 es
precision highp float;
in vec3  aPosition;
in float aSize;
in float aLife;      // 0=dead, 1=full life
in vec3  aColor;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

out float vLife;
out vec3  vColor;

void main() {
  vLife  = aLife;
  vColor = aColor;
  vec4 viewPos = viewMatrix * vec4(aPosition, 1.0);
  gl_PointSize = aSize * (300.0 / -viewPos.z);  // perspective scale
  gl_Position  = projectionMatrix * viewPos;
}
`, K = `#version 300 es
precision highp float;
in float vLife;
in vec3  vColor;
out vec4 fragColor;

void main() {
  // Circular soft point
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;
  float alpha = (1.0 - dist * 2.0) * vLife;
  fragColor = vec4(vColor, alpha);
}
`;
class gt extends T {
  constructor(t = {}) {
    super(), this.isParticleSystem = !0, this.type = "ParticleSystem", this.maxParticles = t.maxParticles ?? 1e3, this.emitRate = t.emitRate ?? 50, this.emitterType = t.emitterType || "fire", this.emitting = !0, this._particles = [], this._toEmit = 0, this._gl = null, this._program = null, this._vao = null, this._buffers = null, this._initParticles();
  }
  _initParticles() {
    for (let t = 0; t < this.maxParticles; t++)
      this._particles.push({
        pos: new x(),
        vel: new x(),
        life: 0,
        maxLife: 1,
        size: 10,
        color: [1, 0.5, 0],
        active: !1
      });
  }
  _spawnParticle(t) {
    const i = this.emitterType, e = this.position;
    t.active = !0, t.maxLife = 0.5 + Math.random() * 1.5, t.life = 1;
    const s = 0.3;
    if (t.pos.set(
      e.x + (Math.random() - 0.5) * s,
      e.y + (Math.random() - 0.5) * 0.1,
      e.z + (Math.random() - 0.5) * s
    ), i === "fire")
      t.vel.set((Math.random() - 0.5) * 0.5, 1.5 + Math.random() * 2, (Math.random() - 0.5) * 0.5), t.size = 20 + Math.random() * 30, t.color = [1, 0.3 + Math.random() * 0.4, 0];
    else if (i === "smoke")
      t.vel.set((Math.random() - 0.5) * 0.3, 0.5 + Math.random(), (Math.random() - 0.5) * 0.3), t.size = 30 + Math.random() * 50, t.color = [0.5, 0.5, 0.5], t.maxLife = 2 + Math.random();
    else if (i === "sparks") {
      const r = Math.random() * Math.PI * 2, o = 2 + Math.random() * 4;
      t.vel.set(Math.cos(r) * o, 3 + Math.random() * 3, Math.sin(r) * o), t.size = 4 + Math.random() * 8, t.color = [1, 0.9, 0.2], t.maxLife = 0.3 + Math.random() * 0.5;
    } else i === "snow" && (t.pos.set(e.x + (Math.random() - 0.5) * 10, e.y + 5, e.z + (Math.random() - 0.5) * 10), t.vel.set((Math.random() - 0.5) * 0.3, -0.5 - Math.random(), (Math.random() - 0.5) * 0.3), t.size = 5 + Math.random() * 10, t.color = [0.9, 0.9, 1], t.maxLife = 5 + Math.random() * 3);
  }
  update(t) {
    if (this.emitting)
      for (this._toEmit += this.emitRate * t; this._toEmit >= 1; ) {
        const i = this._particles.find((e) => !e.active);
        i && this._spawnParticle(i), this._toEmit -= 1;
      }
    for (const i of this._particles)
      if (i.active) {
        if (i.life -= t / i.maxLife, i.life <= 0) {
          i.active = !1;
          continue;
        }
        this.emitterType === "sparks" && (i.vel.y -= 9.81 * t), this.emitterType === "smoke" && (i.vel.y *= 1.001), i.pos.x += i.vel.x * t, i.pos.y += i.vel.y * t, i.pos.z += i.vel.z * t, this.emitterType === "fire" && (i.color[1] = i.life * 0.4, i.size = 15 + i.life * 30);
      }
  }
  render(t, i, e) {
    const s = this._particles.filter((a) => a.active);
    if (s.length === 0) return;
    this._program || this._initGPU(t);
    const r = new Float32Array(s.length * 3), o = new Float32Array(s.length), h = new Float32Array(s.length), n = new Float32Array(s.length * 3);
    s.forEach((a, l) => {
      r[l * 3] = a.pos.x, r[l * 3 + 1] = a.pos.y, r[l * 3 + 2] = a.pos.z, o[l] = a.size, h[l] = a.life, n[l * 3] = a.color[0], n[l * 3 + 1] = a.color[1], n[l * 3 + 2] = a.color[2];
    });
    const c = this._program;
    c.use(), c.setMat4("viewMatrix", i.viewMatrix.elements), c.setMat4("projectionMatrix", i.projectionMatrix.elements), t.bindVertexArray(this._vao), this._upload(t, this._buffers.pos, t.ARRAY_BUFFER, r), this._upload(t, this._buffers.size, t.ARRAY_BUFFER, o), this._upload(t, this._buffers.life, t.ARRAY_BUFFER, h), this._upload(t, this._buffers.color, t.ARRAY_BUFFER, n), t.enable(t.BLEND), t.blendFunc(t.SRC_ALPHA, t.ONE), t.depthMask(!1), t.drawArrays(t.POINTS, 0, s.length), t.depthMask(!0), t.blendFunc(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA), t.bindVertexArray(null);
  }
  _upload(t, i, e, s) {
    t.bindBuffer(e, i), t.bufferData(e, s, t.DYNAMIC_DRAW);
  }
  _initGPU(t) {
    this._gl = t, this._program = new X(t, J, K), this._vao = t.createVertexArray(), t.bindVertexArray(this._vao);
    const i = this._program, e = () => t.createBuffer(), s = (c, a, l) => {
      const u = i.attribLocation(a);
      u < 0 || (t.bindBuffer(t.ARRAY_BUFFER, c), t.bufferData(t.ARRAY_BUFFER, new Float32Array(this.maxParticles * l), t.DYNAMIC_DRAW), t.enableVertexAttribArray(u), t.vertexAttribPointer(u, l, t.FLOAT, !1, 0, 0));
    }, r = e();
    s(r, "aPosition", 3);
    const o = e();
    s(o, "aSize", 1);
    const h = e();
    s(h, "aLife", 1);
    const n = e();
    s(n, "aColor", 3), this._buffers = { pos: r, size: o, life: h, color: n }, t.bindVertexArray(null);
  }
}
const Q = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUV;
void main() {
  vUV = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`, G = {
  passthrough: `#version 300 es
precision highp float;
in vec2 vUV; uniform sampler2D uScene; out vec4 fragColor;
void main() { fragColor = texture(uScene, vUV); }`,
  vignette: `#version 300 es
precision highp float;
in vec2 vUV; uniform sampler2D uScene; uniform float uTime; out vec4 fragColor;
void main() {
  vec4 col = texture(uScene, vUV);
  vec2 uv  = vUV - 0.5;
  float vig = 1.0 - dot(uv, uv) * 2.5;
  fragColor = vec4(col.rgb * vig, col.a);
}`,
  bloom: `#version 300 es
precision highp float;
in vec2 vUV; uniform sampler2D uScene; uniform vec2 uResolution; out vec4 fragColor;
void main() {
  vec3 col = texture(uScene, vUV).rgb;
  vec3 bloom = vec3(0.0);
  vec2 px = 1.0 / uResolution;
  for (int x=-4; x<=4; x++) for (int y=-4; y<=4; y++) {
    vec3 s = texture(uScene, vUV + vec2(float(x),float(y))*px*2.0).rgb;
    float lum = dot(s, vec3(0.299,0.587,0.114));
    bloom += s * max(0.0, lum - 0.7);
  }
  bloom /= 81.0;
  fragColor = vec4(col + bloom * 2.5, 1.0);
}`,
  crt: `#version 300 es
precision highp float;
in vec2 vUV; uniform sampler2D uScene; uniform float uTime; uniform vec2 uResolution; out vec4 fragColor;
void main() {
  vec2 uv = vUV;
  // Barrel distortion
  vec2 cc = uv - 0.5;
  float dist = dot(cc, cc);
  uv += cc * dist * 0.15;
  if (uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0) { fragColor=vec4(0,0,0,1); return; }
  vec3 col = texture(uScene, uv).rgb;
  // Scanlines
  float scanline = sin(uv.y * uResolution.y * 3.14159) * 0.5 + 0.5;
  col *= mix(0.7, 1.0, scanline);
  // RGB shift
  col.r = texture(uScene, uv + vec2(0.002, 0.0)).r;
  col.b = texture(uScene, uv - vec2(0.002, 0.0)).b;
  // Vignette
  vec2 vig = uv - 0.5; col *= 1.0 - dot(vig,vig)*2.0;
  fragColor = vec4(col * 1.1, 1.0);
}`,
  chromaticAberration: `#version 300 es
precision highp float;
in vec2 vUV; uniform sampler2D uScene; uniform float uTime; out vec4 fragColor;
void main() {
  vec2 dir = vUV - 0.5;
  float strength = 0.006;
  float r = texture(uScene, vUV + dir * strength       ).r;
  float g = texture(uScene, vUV                        ).g;
  float b = texture(uScene, vUV - dir * strength       ).b;
  fragColor = vec4(r, g, b, 1.0);
}`,
  pixelate: `#version 300 es
precision highp float;
in vec2 vUV; uniform sampler2D uScene; uniform vec2 uResolution; out vec4 fragColor;
void main() {
  float size = 4.0;
  vec2 uv = floor(vUV * uResolution / size) * size / uResolution;
  fragColor = texture(uScene, uv);
}`,
  colorGrade: `#version 300 es
precision highp float;
in vec2 vUV; uniform sampler2D uScene; uniform float uTime; out vec4 fragColor;
void main() {
  vec3 col = texture(uScene, vUV).rgb;
  // Cinematic teal-orange grade
  col.r = pow(col.r, 0.9) * 1.1;
  col.g = pow(col.g, 1.05);
  col.b = pow(col.b, 0.85) * 0.9;
  // S-curve contrast
  col = col * col * (3.0 - 2.0 * col);
  fragColor = vec4(col, 1.0);
}`
};
class _t {
  constructor(t, i, e) {
    this.gl = t, this.width = i, this.height = e, this._effects = [], this._fbo = null, this._colorTex = null, this._rbo = null, this._quadVAO = null, this._quadBuf = null, this._initFBO(), this._initQuad();
  }
  _initFBO() {
    const t = this.gl;
    this._fbo = t.createFramebuffer(), this._colorTex = t.createTexture(), this._rbo = t.createRenderbuffer(), t.bindTexture(t.TEXTURE_2D, this._colorTex), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, this.width, this.height, 0, t.RGBA, t.UNSIGNED_BYTE, null), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.bindRenderbuffer(t.RENDERBUFFER, this._rbo), t.renderbufferStorage(t.RENDERBUFFER, t.DEPTH_COMPONENT16, this.width, this.height), t.bindFramebuffer(t.FRAMEBUFFER, this._fbo), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, this._colorTex, 0), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.DEPTH_ATTACHMENT, t.RENDERBUFFER, this._rbo), t.bindFramebuffer(t.FRAMEBUFFER, null);
  }
  _initQuad() {
    const t = this.gl, i = new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]);
    this._quadVAO = t.createVertexArray(), this._quadBuf = t.createBuffer(), t.bindVertexArray(this._quadVAO), t.bindBuffer(t.ARRAY_BUFFER, this._quadBuf), t.bufferData(t.ARRAY_BUFFER, i, t.STATIC_DRAW), t.bindVertexArray(null);
  }
  addEffect(t, i = null) {
    const e = i || G[t] || G.passthrough, s = new X(this.gl, Q, e);
    return this._effects.push({ name: t, prog: s }), this;
  }
  begin() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._fbo);
  }
  end(t = 0) {
    const i = this.gl;
    if (i.bindFramebuffer(i.FRAMEBUFFER, null), this._effects.length !== 0) {
      i.disable(i.DEPTH_TEST), i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, this._colorTex);
      for (const { prog: e } of this._effects) {
        e.use(), e.setInt("uScene", 0), e.setFloat("uTime", t), e.setVec2("uResolution", this.width, this.height), i.bindVertexArray(this._quadVAO);
        const s = e.attribLocation("aPosition");
        s >= 0 && (i.bindBuffer(i.ARRAY_BUFFER, this._quadBuf), i.enableVertexAttribArray(s), i.vertexAttribPointer(s, 2, i.FLOAT, !1, 0, 0)), i.drawArrays(i.TRIANGLES, 0, 6);
      }
      i.enable(i.DEPTH_TEST), i.bindVertexArray(null);
    }
  }
  resize(t, i) {
    this.width = t, this.height = i;
    const e = this.gl;
    e.bindTexture(e.TEXTURE_2D, this._colorTex), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, t, i, 0, e.RGBA, e.UNSIGNED_BYTE, null), e.bindRenderbuffer(e.RENDERBUFFER, this._rbo), e.renderbufferStorage(e.RENDERBUFFER, e.DEPTH_COMPONENT16, t, i);
  }
  static get EFFECTS() {
    return Object.keys(G);
  }
}
class wt {
  constructor() {
    this._ctx = null, this._sounds = /* @__PURE__ */ new Map(), this._music = null, this._listener = null, this._masterGain = null;
  }
  _ensureContext() {
    this._ctx || (this._ctx = new (window.AudioContext || window.webkitAudioContext)(), this._listener = this._ctx.listener, this._masterGain = this._ctx.createGain(), this._masterGain.connect(this._ctx.destination));
  }
  async loadSound(t, i) {
    this._ensureContext();
    const s = await (await fetch(i)).arrayBuffer(), r = await this._ctx.decodeAudioData(s);
    return this._sounds.set(t, r), r;
  }
  play(t, i = {}) {
    this._ensureContext();
    const e = this._sounds.get(t);
    if (!e)
      return console.warn(`[NovaJS Audio] Sound "${t}" not loaded`), null;
    const s = this._ctx.createBufferSource();
    if (s.buffer = e, s.loop = i.loop ?? !1, i.position) {
      const o = this._ctx.createPanner();
      o.panningModel = "HRTF", o.distanceModel = "inverse", o.refDistance = i.refDistance ?? 1, o.maxDistance = i.maxDistance ?? 100, o.rolloffFactor = i.rolloff ?? 1;
      const h = i.position;
      o.positionX.value = h.x, o.positionY.value = h.y, o.positionZ.value = h.z, s.connect(o), o.connect(this._masterGain);
    } else
      s.connect(this._masterGain);
    const r = this._ctx.createGain();
    return r.gain.value = i.volume ?? 1, s.connect(r), r.connect(this._masterGain), s.start(i.delay ?? 0), s;
  }
  /** Update listener position (camera position) */
  updateListener(t, i, e) {
    if (!this._ctx) return;
    const s = this._listener;
    s.positionX ? (s.positionX.value = t.x, s.positionY.value = t.y, s.positionZ.value = t.z, s.forwardX.value = i.x, s.forwardY.value = i.y, s.forwardZ.value = i.z, s.upX.value = e.x, s.upY.value = e.y, s.upZ.value = e.z) : (s.setPosition(t.x, t.y, t.z), s.setOrientation(i.x, i.y, i.z, e.x, e.y, e.z));
  }
  setMasterVolume(t) {
    this._ensureContext(), this._masterGain.gain.value = t;
  }
  resume() {
    var t;
    ((t = this._ctx) == null ? void 0 : t.state) === "suspended" && this._ctx.resume();
  }
}
const tt = "1.0.0";
console.log(
  `%c✦ NovaJS v${tt} — WebGL2 Engine Ready`,
  "color:#a78bfa;font-weight:bold;font-size:14px;"
);
export {
  ut as AmbientLight,
  wt as AudioSystem,
  ct as BasicMaterial,
  ot as BoxGeometry,
  N as BufferGeometry,
  Y as Camera,
  ft as DirectionalLight,
  et as Engine,
  yt as FPSControls,
  O as Material,
  v as Matrix4,
  k as Mesh,
  vt as OBJLoader,
  T as Object3D,
  rt as OrthographicCamera,
  gt as ParticleSystem,
  st as PerspectiveCamera,
  mt as PhysicsWorld,
  nt as PlaneGeometry,
  dt as PointLight,
  _t as PostProcessor,
  P as Quaternion,
  xt as Rigidbody,
  it as Scene,
  lt as ShaderMaterial,
  X as ShaderProgram,
  ht as SphereGeometry,
  pt as TextureLoader,
  at as TorusGeometry,
  tt as VERSION,
  F as Vector2,
  x as Vector3,
  S as Vector4,
  W as WebGLRenderer
};
