/**
 * ShaderProgram — Compiles, links, and manages a WebGL2 shader program.
 * Caches uniform locations for fast updates.
 */
export class ShaderProgram {
  constructor(gl, vertSrc, fragSrc) {
    this.gl = gl;
    this.glProgram = this._compile(vertSrc, fragSrc);
    this._uniformCache = {};
    this._attribCache  = {};
  }

  _compileShader(type, src) {
    const gl     = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const typeName = type === gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT';
      console.error(`[NovaJS] ${typeName} shader compile error:\n`, gl.getShaderInfoLog(shader));
      console.error('Source:\n', src.split('\n').map((l,i)=>`${i+1}: ${l}`).join('\n'));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  _compile(vertSrc, fragSrc) {
    const gl   = this.gl;
    const vert = this._compileShader(gl.VERTEX_SHADER,   vertSrc);
    const frag = this._compileShader(gl.FRAGMENT_SHADER, fragSrc);
    if (!vert || !frag) throw new Error('[NovaJS] Shader compilation failed');

    const prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[NovaJS] Program link error:', gl.getProgramInfoLog(prog));
      throw new Error('[NovaJS] Shader program link failed');
    }

    // Shaders are baked into the program; no need to keep them
    gl.deleteShader(vert);
    gl.deleteShader(frag);
    return prog;
  }

  use() { this.gl.useProgram(this.glProgram); }

  // ─── Uniform helpers ────────────────────────────────────────────────────────

  _loc(name) {
    if (this._uniformCache[name] === undefined) {
      this._uniformCache[name] = this.gl.getUniformLocation(this.glProgram, name);
    }
    return this._uniformCache[name];
  }

  setFloat(name, v)  { const l=this._loc(name); if(l!=null) this.gl.uniform1f(l, v); }
  setInt(name, v)    { const l=this._loc(name); if(l!=null) this.gl.uniform1i(l, v); }
  setVec2(name,x,y)  { const l=this._loc(name); if(l!=null) this.gl.uniform2f(l,x,y); }
  setVec3(name,x,y,z){ const l=this._loc(name); if(l!=null) this.gl.uniform3f(l,x,y,z); }
  setVec4(name,x,y,z,w){ const l=this._loc(name); if(l!=null) this.gl.uniform4f(l,x,y,z,w); }

  setMat3(name, m)   {
    const l=this._loc(name);
    if(l!=null) this.gl.uniformMatrix3fv(l, false, m);
  }
  setMat4(name, m) {
    const l=this._loc(name);
    // m can be Float32Array (Matrix4.elements) or raw array
    if(l!=null) this.gl.uniformMatrix4fv(l, false, m instanceof Float32Array ? m : new Float32Array(m));
  }

  /** Generic setter — dispatch by value type */
  setUniform(name, value) {
    if (value instanceof Float32Array) {
      if (value.length === 16) this.setMat4(name, value);
      else if (value.length === 9) this.setMat3(name, value);
      else if (value.length === 4) this.gl.uniform4fv(this._loc(name), value);
      else if (value.length === 3) this.gl.uniform3fv(this._loc(name), value);
      else if (value.length === 2) this.gl.uniform2fv(this._loc(name), value);
    } else if (Array.isArray(value)) {
      this.setUniform(name, new Float32Array(value));
    } else if (typeof value === 'number') {
      this.setFloat(name, value);
    } else if (typeof value === 'boolean') {
      this.setInt(name, value ? 1 : 0);
    }
  }

  // ─── Attribute helpers ──────────────────────────────────────────────────────

  attribLocation(name) {
    if (this._attribCache[name] === undefined) {
      this._attribCache[name] = this.gl.getAttribLocation(this.glProgram, name);
    }
    return this._attribCache[name];
  }

  destroy() { this.gl.deleteProgram(this.glProgram); }
}
