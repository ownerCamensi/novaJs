import { ShaderProgram } from '../renderer/ShaderProgram.js';
import { Vector3 } from '../math/Vector3.js';
import { Object3D } from '../core/Object3D.js';

const PART_VERT = `#version 300 es
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
`;

const PART_FRAG = `#version 300 es
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

/**
 * ParticleSystem — GPU-based point sprite particle emitter.
 * Types: 'fire', 'smoke', 'sparks', 'snow', 'custom'
 */
export class ParticleSystem extends Object3D {
  constructor(options = {}) {
    super();
    this.isParticleSystem = true;
    this.type = 'ParticleSystem';

    this.maxParticles = options.maxParticles ?? 1000;
    this.emitRate     = options.emitRate     ?? 50;  // per second
    this.emitterType  = options.emitterType  || 'fire';
    this.emitting     = true;

    this._particles = [];
    this._toEmit    = 0;
    this._gl        = null;
    this._program   = null;
    this._vao       = null;
    this._buffers   = null;

    this._initParticles();
  }

  _initParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
      this._particles.push({
        pos: new Vector3(), vel: new Vector3(),
        life: 0, maxLife: 1, size: 10,
        color: [1, 0.5, 0], active: false,
      });
    }
  }

  _spawnParticle(p) {
    const type = this.emitterType;
    const o    = this.position;

    p.active  = true;
    p.maxLife = 0.5 + Math.random() * 1.5;
    p.life    = 1.0;

    // Spread
    const spread = 0.3;
    p.pos.set(o.x + (Math.random()-0.5)*spread,
              o.y + (Math.random()-0.5)*0.1,
              o.z + (Math.random()-0.5)*spread);

    if (type === 'fire') {
      p.vel.set((Math.random()-0.5)*0.5, 1.5+Math.random()*2, (Math.random()-0.5)*0.5);
      p.size = 20 + Math.random() * 30;
      p.color = [1, 0.3 + Math.random()*0.4, 0];
    } else if (type === 'smoke') {
      p.vel.set((Math.random()-0.5)*0.3, 0.5+Math.random(), (Math.random()-0.5)*0.3);
      p.size = 30 + Math.random() * 50;
      p.color = [0.5, 0.5, 0.5];
      p.maxLife = 2 + Math.random();
    } else if (type === 'sparks') {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      p.vel.set(Math.cos(angle)*speed, 3+Math.random()*3, Math.sin(angle)*speed);
      p.size = 4 + Math.random() * 8;
      p.color = [1, 0.9, 0.2];
      p.maxLife = 0.3 + Math.random() * 0.5;
    } else if (type === 'snow') {
      p.pos.set(o.x+(Math.random()-0.5)*10, o.y+5, o.z+(Math.random()-0.5)*10);
      p.vel.set((Math.random()-0.5)*0.3, -0.5-Math.random(), (Math.random()-0.5)*0.3);
      p.size = 5 + Math.random() * 10;
      p.color = [0.9, 0.9, 1.0];
      p.maxLife = 5 + Math.random() * 3;
    }
  }

  update(delta) {
    // Emit new particles
    if (this.emitting) {
      this._toEmit += this.emitRate * delta;
      while (this._toEmit >= 1) {
        const dead = this._particles.find(p => !p.active);
        if (dead) this._spawnParticle(dead);
        this._toEmit -= 1;
      }
    }

    // Update alive particles
    for (const p of this._particles) {
      if (!p.active) continue;
      p.life -= delta / p.maxLife;
      if (p.life <= 0) { p.active = false; continue; }

      // Apply gravity to sparks/smoke
      if (this.emitterType === 'sparks') p.vel.y -= 9.81 * delta;
      if (this.emitterType === 'smoke')  p.vel.y *= 1.001;

      p.pos.x += p.vel.x * delta;
      p.pos.y += p.vel.y * delta;
      p.pos.z += p.vel.z * delta;

      // Fire gets hotter color while alive, cools as it dies
      if (this.emitterType === 'fire') {
        p.color[1] = p.life * 0.4;
        p.size = (15 + p.life * 30);
      }
    }
  }

  render(gl, camera, time) {
    const active = this._particles.filter(p => p.active);
    if (active.length === 0) return;

    // Lazy GPU init
    if (!this._program) this._initGPU(gl);

    // Build CPU arrays
    const posArr   = new Float32Array(active.length * 3);
    const sizeArr  = new Float32Array(active.length);
    const lifeArr  = new Float32Array(active.length);
    const colorArr = new Float32Array(active.length * 3);

    active.forEach((p, i) => {
      posArr[i*3]   = p.pos.x; posArr[i*3+1] = p.pos.y; posArr[i*3+2] = p.pos.z;
      sizeArr[i]    = p.size;
      lifeArr[i]    = p.life;
      colorArr[i*3] = p.color[0]; colorArr[i*3+1] = p.color[1]; colorArr[i*3+2] = p.color[2];
    });

    const prog = this._program;
    prog.use();
    prog.setMat4('viewMatrix',       camera.viewMatrix.elements);
    prog.setMat4('projectionMatrix', camera.projectionMatrix.elements);

    gl.bindVertexArray(this._vao);

    this._upload(gl, this._buffers.pos,   gl.ARRAY_BUFFER, posArr);
    this._upload(gl, this._buffers.size,  gl.ARRAY_BUFFER, sizeArr);
    this._upload(gl, this._buffers.life,  gl.ARRAY_BUFFER, lifeArr);
    this._upload(gl, this._buffers.color, gl.ARRAY_BUFFER, colorArr);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // additive for fire/sparks
    gl.depthMask(false);
    gl.drawArrays(gl.POINTS, 0, active.length);
    gl.depthMask(true);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.bindVertexArray(null);
  }

  _upload(gl, buf, target, data) {
    gl.bindBuffer(target, buf);
    gl.bufferData(target, data, gl.DYNAMIC_DRAW);
  }

  _initGPU(gl) {
    this._gl      = gl;
    this._program = new ShaderProgram(gl, PART_VERT, PART_FRAG);
    this._vao     = gl.createVertexArray();
    gl.bindVertexArray(this._vao);

    const prog = this._program;
    const mk   = () => gl.createBuffer();

    const bindF = (buf, name, size) => {
      const loc = prog.attribLocation(name);
      if (loc < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.maxParticles * size), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };

    const posBuf   = mk(); bindF(posBuf,   'aPosition', 3);
    const sizeBuf  = mk(); bindF(sizeBuf,  'aSize',     1);
    const lifeBuf  = mk(); bindF(lifeBuf,  'aLife',     1);
    const colorBuf = mk(); bindF(colorBuf, 'aColor',    3);

    this._buffers = { pos: posBuf, size: sizeBuf, life: lifeBuf, color: colorBuf };
    gl.bindVertexArray(null);
  }
}
