import { ShaderProgram } from '../renderer/ShaderProgram.js';

const QUAD_VERT = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUV;
void main() {
  vUV = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

// ── Built-in post-processing effects ─────────────────────────────────────────

const EFFECTS = {
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
}`,
};

/**
 * PostProcessor — Render-to-texture + fullscreen quad effects.
 *
 * Usage:
 *   const pp = new PostProcessor(gl, canvas.width, canvas.height);
 *   pp.addEffect('bloom');
 *   pp.addEffect('crt');
 *
 *   // In render loop:
 *   pp.begin();
 *   renderer.render(scene, camera);
 *   pp.end(totalTime);
 */
export class PostProcessor {
  constructor(gl, width, height) {
    this.gl      = gl;
    this.width   = width;
    this.height  = height;
    this._effects = []; // array of ShaderProgram

    this._fbo     = null;
    this._colorTex = null;
    this._rbo     = null;  // depth renderbuffer

    this._quadVAO = null;
    this._quadBuf = null;

    this._initFBO();
    this._initQuad();
  }

  _initFBO() {
    const gl = this.gl;
    this._fbo      = gl.createFramebuffer();
    this._colorTex = gl.createTexture();
    this._rbo      = gl.createRenderbuffer();

    gl.bindTexture(gl.TEXTURE_2D, this._colorTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindRenderbuffer(gl.RENDERBUFFER, this._rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._colorTex, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this._rbo);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  _initQuad() {
    const gl = this.gl;
    // Simple fullscreen triangle pair
    const verts = new Float32Array([-1,-1, 1,-1, -1,1, 1,-1, 1,1, -1,1]);
    this._quadVAO = gl.createVertexArray();
    this._quadBuf = gl.createBuffer();
    gl.bindVertexArray(this._quadVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    // Attribute 0 = aPosition (bound lazily per program)
    gl.bindVertexArray(null);
  }

  addEffect(name, customFrag = null) {
    const fragSrc = customFrag || EFFECTS[name] || EFFECTS.passthrough;
    const prog = new ShaderProgram(this.gl, QUAD_VERT, fragSrc);
    this._effects.push({ name, prog });
    return this;
  }

  begin() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._fbo);
  }

  end(time = 0) {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    if (this._effects.length === 0) return;

    gl.disable(gl.DEPTH_TEST);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._colorTex);

    for (const { prog } of this._effects) {
      prog.use();
      prog.setInt('uScene', 0);
      prog.setFloat('uTime', time);
      prog.setVec2('uResolution', this.width, this.height);

      gl.bindVertexArray(this._quadVAO);
      const loc = prog.attribLocation('aPosition');
      if (loc >= 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._quadBuf);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    gl.enable(gl.DEPTH_TEST);
    gl.bindVertexArray(null);
  }

  resize(w, h) {
    this.width = w; this.height = h;
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this._colorTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, this._rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
  }

  static get EFFECTS() { return Object.keys(EFFECTS); }
}
