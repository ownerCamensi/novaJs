/**
 * Matrix4 — Column-major 4x4 matrix for WebGL.
 *
 * WebGL stores matrices in COLUMN-MAJOR order, meaning:
 *   elements[col * 4 + row]
 *
 * So the array layout is:
 *   [m00, m10, m20, m30,   <- column 0
 *    m01, m11, m21, m31,   <- column 1
 *    m02, m12, m22, m32,   <- column 2
 *    m03, m13, m23, m33]   <- column 3
 *
 * Where mRC = element at Row R, Column C.
 *
 * This matches what gl.uniformMatrix4fv expects.
 */
export class Matrix4 {
  constructor() {
    // 16 floats, column-major
    this.elements = new Float32Array(16);
    this.identity();
  }

  /** Set to identity matrix */
  identity() {
    const e = this.elements;
    e[0]=1; e[4]=0; e[8]=0;  e[12]=0;
    e[1]=0; e[5]=1; e[9]=0;  e[13]=0;
    e[2]=0; e[6]=0; e[10]=1; e[14]=0;
    e[3]=0; e[7]=0; e[11]=0; e[15]=1;
    return this;
  }

  clone() {
    const m = new Matrix4();
    m.elements.set(this.elements);
    return m;
  }

  copy(m) {
    this.elements.set(m.elements);
    return this;
  }

  /**
   * Multiply: this * other, returns new Matrix4.
   * M = A * B means "first apply B, then A."
   */
  multiply(b) {
    const a = this.elements;
    const e = b.elements;
    const r = new Float32Array(16);

    // Standard column-major matrix multiplication
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          // a[row + k*4] = element at (row, k) of matrix a
          // e[k + col*4] = element at (k, col) of matrix b
          sum += a[row + k * 4] * e[k + col * 4];
        }
        r[row + col * 4] = sum;
      }
    }

    const out = new Matrix4();
    out.elements = r;
    return out;
  }

  /** Multiply in-place: this = this * other */
  multiplySelf(b) {
    const result = this.multiply(b);
    this.elements.set(result.elements);
    return this;
  }

  /** Premultiply: this = other * this */
  premultiply(other) {
    const result = other.multiply(this);
    this.elements.set(result.elements);
    return this;
  }

  // ─── Factory methods ──────────────────────────────────────────────────────

  /** Translation matrix */
  static translation(x, y, z) {
    const m = new Matrix4();
    const e = m.elements;
    // e[col*4 + row]; translation goes in column 3
    e[12] = x;  // col3, row0
    e[13] = y;  // col3, row1
    e[14] = z;  // col3, row2
    return m;
  }

  /** Scale matrix */
  static scaling(x, y, z) {
    const m = new Matrix4();
    const e = m.elements;
    e[0]  = x;  // col0, row0
    e[5]  = y;  // col1, row1
    e[10] = z;  // col2, row2
    return m;
  }

  /** Rotation around X axis by angle (radians) */
  static rotationX(angle) {
    const m = new Matrix4();
    const e = m.elements;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    // col1 row1, col1 row2, col2 row1, col2 row2
    e[5]  =  c;  // col1, row1
    e[6]  =  s;  // col1, row2
    e[9]  = -s;  // col2, row1
    e[10] =  c;  // col2, row2
    return m;
  }

  /** Rotation around Y axis */
  static rotationY(angle) {
    const m = new Matrix4();
    const e = m.elements;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    e[0]  =  c;  // col0, row0
    e[2]  = -s;  // col0, row2
    e[8]  =  s;  // col2, row0
    e[10] =  c;  // col2, row2
    return m;
  }

  /** Rotation around Z axis */
  static rotationZ(angle) {
    const m = new Matrix4();
    const e = m.elements;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    e[0] =  c;  // col0, row0
    e[1] =  s;  // col0, row1
    e[4] = -s;  // col1, row0
    e[5] =  c;  // col1, row1
    return m;
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
  static perspective(fovY, aspect, near, far) {
    const m = new Matrix4();
    const e = m.elements;
    // Clear to zeros
    e.fill(0);

    const f = 1.0 / Math.tan(fovY / 2);
    const rangeInv = 1.0 / (near - far);

    e[0]  = f / aspect;       // col0, row0
    e[5]  = f;                 // col1, row1
    e[10] = (near + far) * rangeInv;       // col2, row2
    e[11] = -1;                            // col2, row3  <- w divide, maps to -z
    e[14] = 2 * near * far * rangeInv;    // col3, row2
    // e[15] stays 0

    return m;
  }

  /**
   * Orthographic projection matrix.
   */
  static orthographic(left, right, bottom, top, near, far) {
    const m = new Matrix4();
    const e = m.elements;
    e.fill(0);

    e[0]  = 2 / (right - left);
    e[5]  = 2 / (top - bottom);
    e[10] = -2 / (far - near);
    e[12] = -(right + left) / (right - left);
    e[13] = -(top + bottom) / (top - bottom);
    e[14] = -(far + near) / (far - near);
    e[15] = 1;

    return m;
  }

  /**
   * Camera view matrix via lookAt.
   * Builds the inverse of the camera's world transform.
   *
   * Camera looks down its local -Z axis (OpenGL convention).
   */
  static lookAt(eye, target, up) {
    const m = new Matrix4();
    const e = m.elements;

    // z = backward direction (eye - target), normalized
    let zx = eye.x - target.x;
    let zy = eye.y - target.y;
    let zz = eye.z - target.z;
    let zLen = Math.sqrt(zx*zx + zy*zy + zz*zz);
    if (zLen > 0) { zx /= zLen; zy /= zLen; zz /= zLen; }

    // x = right = cross(up, z), normalized
    let xx = up.y * zz - up.z * zy;
    let xy = up.z * zx - up.x * zz;
    let xz = up.x * zy - up.y * zx;
    let xLen = Math.sqrt(xx*xx + xy*xy + xz*xz);
    if (xLen > 0) { xx /= xLen; xy /= xLen; xz /= xLen; }

    // y = up = cross(z, x) — already normalized since z and x are ortho
    const yx = zy * xz - zz * xy;
    const yy = zz * xx - zx * xz;
    const yz = zx * xy - zy * xx;

    // Build view matrix (transpose of rotation * translation)
    // Column 0: right vector
    e[0] = xx; e[1] = yx; e[2] = zx; e[3] = 0;
    // Column 1: up vector
    e[4] = xy; e[5] = yy; e[6] = zy; e[7] = 0;
    // Column 2: forward (negated z = look direction)
    e[8] = xz; e[9] = yz; e[10] = zz; e[11] = 0;
    // Column 3: translation
    e[12] = -(xx * eye.x + xy * eye.y + xz * eye.z);
    e[13] = -(yx * eye.x + yy * eye.y + yz * eye.z);
    e[14] = -(zx * eye.x + zy * eye.y + zz * eye.z);
    e[15] = 1;

    return m;
  }

  /**
   * Compose a TRS (Translation * Rotation * Scale) model matrix.
   * position: Vector3, quaternion: Quaternion, scale: Vector3
   */
  static compose(position, quaternion, scale) {
    const m = new Matrix4();
    const e = m.elements;

    const { x: qx, y: qy, z: qz, w: qw } = quaternion;
    const { x: sx, y: sy, z: sz } = scale;

    // Quaternion to rotation matrix, then scale
    const x2 = qx + qx, y2 = qy + qy, z2 = qz + qz;
    const xx = qx * x2, xy = qx * y2, xz = qx * z2;
    const yy = qy * y2, yz = qy * z2, zz = qz * z2;
    const wx = qw * x2, wy = qw * y2, wz = qw * z2;

    e[0]  = (1 - (yy + zz)) * sx;
    e[1]  = (xy + wz) * sx;
    e[2]  = (xz - wy) * sx;
    e[3]  = 0;

    e[4]  = (xy - wz) * sy;
    e[5]  = (1 - (xx + zz)) * sy;
    e[6]  = (yz + wx) * sy;
    e[7]  = 0;

    e[8]  = (xz + wy) * sz;
    e[9]  = (yz - wx) * sz;
    e[10] = (1 - (xx + yy)) * sz;
    e[11] = 0;

    e[12] = position.x;
    e[13] = position.y;
    e[14] = position.z;
    e[15] = 1;

    return m;
  }

  /** Transpose (swap rows/cols) */
  transpose() {
    const m = new Matrix4();
    const e = this.elements;
    const r = m.elements;
    r[0]=e[0];  r[1]=e[4];  r[2]=e[8];  r[3]=e[12];
    r[4]=e[1];  r[5]=e[5];  r[6]=e[9];  r[7]=e[13];
    r[8]=e[2];  r[9]=e[6];  r[10]=e[10]; r[11]=e[14];
    r[12]=e[3]; r[13]=e[7]; r[14]=e[11]; r[15]=e[15];
    return m;
  }

  /** Invert this matrix (for view matrix from camera world matrix) */
  invert() {
    const e = this.elements;
    const out = new Float32Array(16);

    const a00=e[0],  a01=e[1],  a02=e[2],  a03=e[3];
    const a10=e[4],  a11=e[5],  a12=e[6],  a13=e[7];
    const a20=e[8],  a21=e[9],  a22=e[10], a23=e[11];
    const a30=e[12], a31=e[13], a32=e[14], a33=e[15];

    const b00 = a00*a11 - a01*a10, b01 = a00*a12 - a02*a10;
    const b02 = a00*a13 - a03*a10, b03 = a01*a12 - a02*a11;
    const b04 = a01*a13 - a03*a11, b05 = a02*a13 - a03*a12;
    const b06 = a20*a31 - a21*a30, b07 = a20*a32 - a22*a30;
    const b08 = a20*a33 - a23*a30, b09 = a21*a32 - a22*a31;
    const b10 = a21*a33 - a23*a31, b11 = a22*a33 - a23*a32;

    let det = b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06;
    if (!det) return this;
    det = 1.0 / det;

    out[0]  = ( a11*b11 - a12*b10 + a13*b09) * det;
    out[1]  = (-a01*b11 + a02*b10 - a03*b09) * det;
    out[2]  = ( a31*b05 - a32*b04 + a33*b03) * det;
    out[3]  = (-a21*b05 + a22*b04 - a23*b03) * det;
    out[4]  = (-a10*b11 + a12*b08 - a13*b07) * det;
    out[5]  = ( a00*b11 - a02*b08 + a03*b07) * det;
    out[6]  = (-a30*b05 + a32*b02 - a33*b01) * det;
    out[7]  = ( a20*b05 - a22*b02 + a23*b01) * det;
    out[8]  = ( a10*b10 - a11*b08 + a13*b06) * det;
    out[9]  = (-a00*b10 + a01*b08 - a03*b06) * det;
    out[10] = ( a30*b04 - a31*b02 + a33*b00) * det;
    out[11] = (-a20*b04 + a21*b02 - a23*b00) * det;
    out[12] = (-a10*b09 + a11*b07 - a12*b06) * det;
    out[13] = ( a00*b09 - a01*b07 + a02*b06) * det;
    out[14] = (-a30*b03 + a31*b01 - a32*b00) * det;
    out[15] = ( a20*b03 - a21*b01 + a22*b00) * det;

    const result = new Matrix4();
    result.elements = out;
    return result;
  }

  /**
   * Extract normal matrix (upper-left 3x3, inverted and transposed).
   * Used to transform normals correctly when non-uniform scaling is applied.
   * Returns as flat Float32Array for gl.uniformMatrix3fv.
   */
  normalMatrix() {
    const e = this.elements;
    // Cofactor matrix of upper-left 3x3, divided by determinant
    const a = e[0], b = e[1], c = e[2];
    const d = e[4], f = e[5], g = e[6];
    const h = e[8], i = e[9], j = e[10];

    const det = a*(f*j - g*i) - b*(d*j - g*h) + c*(d*i - f*h);
    const invDet = det !== 0 ? 1.0 / det : 0;

    const out = new Float32Array(9);
    out[0] = ( f*j - g*i) * invDet;
    out[1] = (-b*j + c*i) * invDet;
    out[2] = ( b*g - c*f) * invDet;
    out[3] = (-d*j + g*h) * invDet;
    out[4] = ( a*j - c*h) * invDet;
    out[5] = (-a*g + c*d) * invDet;
    out[6] = ( d*i - f*h) * invDet;
    out[7] = (-a*i + b*h) * invDet;
    out[8] = ( a*f - b*d) * invDet;
    return out;
  }

  toString() {
    const e = this.elements;
    const f = (n) => n.toFixed(3).padStart(8);
    return [
      `[${f(e[0])} ${f(e[4])} ${f(e[8])}  ${f(e[12])}]`,
      `[${f(e[1])} ${f(e[5])} ${f(e[9])}  ${f(e[13])}]`,
      `[${f(e[2])} ${f(e[6])} ${f(e[10])} ${f(e[14])}]`,
      `[${f(e[3])} ${f(e[7])} ${f(e[11])} ${f(e[15])}]`,
    ].join('\n');
  }
}
