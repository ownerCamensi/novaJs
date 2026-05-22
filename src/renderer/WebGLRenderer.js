import { ShaderProgram } from './ShaderProgram.js';
import { Matrix4 } from '../math/Matrix4.js';

// ─── Built-in default shaders ─────────────────────────────────────────────────
// These include lights, normals, UVs, and time.

const DEFAULT_VERT = `#version 300 es
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
`;

const DEFAULT_FRAG = `#version 300 es
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

/**
 * WebGLRenderer — The core rendering engine.
 *
 * Key responsibilities:
 *  - Manage the WebGL2 context
 *  - Compile and cache shader programs
 *  - Build and cache VAOs per geometry+program pair
 *  - Upload uniforms (MVP matrices, lights, material params)
 *  - Draw the scene
 */
export class WebGLRenderer {
  constructor(canvas) {
    const gl = canvas.getContext('webgl2', {
      antialias: true,
      alpha: false,
      depth: true,
      stencil: false,
      powerPreference: 'high-performance',
    });

    if (!gl) throw new Error('[NovaJS] WebGL2 not supported in this browser');

    this.gl     = gl;
    this.canvas = canvas;

    // ── State ──────────────────────────────────────────────────────────────
    this._programCache = new Map(); // materialId → ShaderProgram
    this._vaoCache     = new Map(); // geometryId_programId → WebGLVertexArrayObject
    this._textureCache = new Map();

    // ── Default state ──────────────────────────────────────────────────────
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // Do NOT cull faces by default — makes debugging easier
    // gl.enable(gl.CULL_FACE); // re-enable once winding is confirmed correct

    this.resize(canvas.clientWidth, canvas.clientHeight);
  }

  // ─── Resize ───────────────────────────────────────────────────────────────

  resize(width, height) {
    this.canvas.width  = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  // ─── Program cache ────────────────────────────────────────────────────────

  _getProgram(material) {
    const key = material.id;
    if (!this._programCache.has(key)) {
      const vertSrc = material.vertexShader   || DEFAULT_VERT;
      const fragSrc = material.fragmentShader || DEFAULT_FRAG;
      const prog = new ShaderProgram(this.gl, vertSrc, fragSrc);
      this._programCache.set(key, prog);
    }
    return this._programCache.get(key);
  }

  // ─── VAO cache ────────────────────────────────────────────────────────────

  /**
   * Build (or retrieve) a VAO that binds geometry attributes to a program.
   * A VAO records all the attribute pointer state, so we just bind it at draw time.
   */
  _getVAO(geometry, program) {
    const key = `${geometry.id}_${program.glProgram}`;
    if (this._vaoCache.has(key)) return this._vaoCache.get(key);

    const gl  = this.gl;
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // Helper: upload a Float32 attribute buffer and enable it
    const bindAttrib = (name, data, itemSize) => {
      const loc = program.attribLocation(name);
      if (loc < 0) return; // shader doesn't use this attribute

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data instanceof Float32Array ? data : new Float32Array(data), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, itemSize, gl.FLOAT, false, 0, 0);
    };

    if (geometry.positions) bindAttrib('position', geometry.positions, 3);
    if (geometry.normals)   bindAttrib('normal',   geometry.normals,   3);
    if (geometry.uvs)       bindAttrib('uv',       geometry.uvs,       2);

    // Index buffer (element array buffer) — stored IN the VAO
    if (geometry.indices) {
      const ibo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        geometry.indices instanceof Uint16Array ? geometry.indices : new Uint16Array(geometry.indices),
        gl.STATIC_DRAW);
    }

    gl.bindVertexArray(null);
    this._vaoCache.set(key, vao);
    return vao;
  }

  // ─── Texture binding ─────────────────────────────────────────────────────

  _bindTexture(program, name, texture, unit) {
    if (!texture || !texture._glTexture) return;
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture._glTexture);
    program.setInt(name, unit);
  }

  // ─── Light uniforms ────────────────────────────────────────────────────────

  _uploadLights(program, lights) {
    // Defaults — no lighting
    program.setVec3('ambientColor', 0.15, 0.15, 0.15);
    program.setVec3('dirLightDir',   0, -1, 0);
    program.setVec3('dirLightColor', 0, 0, 0);
    program.setInt('numPointLights', 0);

    let numPoint = 0;

    for (const light of lights) {
      if (light.type === 'AmbientLight') {
        program.setVec3('ambientColor', light.color.r * light.intensity,
                                        light.color.g * light.intensity,
                                        light.color.b * light.intensity);
      } else if (light.type === 'DirectionalLight') {
        const d = light.getDirection ? light.getDirection() : { x:0,y:-1,z:0 };
        program.setVec3('dirLightDir',   d.x, d.y, d.z);
        program.setVec3('dirLightColor', light.color.r * light.intensity,
                                          light.color.g * light.intensity,
                                          light.color.b * light.intensity);
      } else if (light.type === 'PointLight' && numPoint < 4) {
        this.gl.uniform3f(
          this.gl.getUniformLocation(program.glProgram, `pointLightPos[${numPoint}]`),
          light.position.x, light.position.y, light.position.z
        );
        this.gl.uniform3f(
          this.gl.getUniformLocation(program.glProgram, `pointLightColor[${numPoint}]`),
          light.color.r * light.intensity,
          light.color.g * light.intensity,
          light.color.b * light.intensity
        );
        numPoint++;
      }
    }
    program.setInt('numPointLights', numPoint);
  }

  // ─── Draw a single mesh ───────────────────────────────────────────────────

  _renderMesh(mesh, camera, lights, totalTime) {
    if (!mesh.visible) return;

    const gl       = this.gl;
    const material = mesh.material;
    const geometry = mesh.geometry;

    if (!geometry || !material) return;

    // 1. Get / compile shader program
    const program = this._getProgram(material);
    program.use();

    // 2. Update and upload matrices
    mesh.updateWorldMatrix();
    camera.updateMatrices();

    program.setMat4('modelMatrix',      mesh.worldMatrix.elements);
    program.setMat4('viewMatrix',       camera.viewMatrix.elements);
    program.setMat4('projectionMatrix', camera.projectionMatrix.elements);

    // Normal matrix — inverse transpose of model matrix (for correct normal transform)
    const nm = mesh.worldMatrix.normalMatrix();
    program.setMat3('normalMatrix', nm);

    // Camera world position (for specular highlights etc.)
    const cp = camera.position;
    program.setVec3('cameraPos', cp.x, cp.y, cp.z);

    // 3. Time uniform (for animated shaders)
    program.setFloat('time', totalTime);

    // 4. Material uniforms
    const c = material.color || { r:1, g:1, b:1 };
    program.setVec3('color', c.r, c.g, c.b);
    program.setFloat('opacity', material.opacity !== undefined ? material.opacity : 1.0);

    // Custom material uniforms
    if (material.uniforms) {
      for (const [name, value] of Object.entries(material.uniforms)) {
        program.setUniform(name, typeof value === 'object' && value.value !== undefined ? value.value : value);
      }
    }

    // 5. Lights
    if (!material.unlit) {
      this._uploadLights(program, lights);
    } else {
      // Unlit: full bright ambient
      program.setVec3('ambientColor', 1, 1, 1);
      program.setVec3('dirLightColor', 0, 0, 0);
      program.setInt('numPointLights', 0);
    }

    // 6. Textures
    if (material.map) this._bindTexture(program, 'map', material.map, 0);

    // 7. Bind VAO and draw
    const vao = this._getVAO(geometry, program);
    gl.bindVertexArray(vao);

    if (geometry.indices && geometry.indices.length > 0) {
      gl.drawElements(gl.TRIANGLES, geometry.indices.length, gl.UNSIGNED_SHORT, 0);
    } else if (geometry.positions) {
      gl.drawArrays(gl.TRIANGLES, 0, geometry.positions.length / 3);
    }

    gl.bindVertexArray(null);
  }

  // ─── Main render call ─────────────────────────────────────────────────────

  render(scene, camera, totalTime = 0) {
    const gl = this.gl;
    const bg = scene.background;

    gl.clearColor(bg.r, bg.g, bg.b, bg.a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    camera.updateMatrices();

    const renderList = scene.getRenderList();
    const lights     = scene.getLights();

    for (const obj of renderList) {
      if (obj.isMesh) {
        this._renderMesh(obj, camera, lights, totalTime);
      } else if (obj.isParticleSystem) {
        obj.render(gl, camera, totalTime);
      }
    }
  }

  destroy() {
    for (const prog of this._programCache.values()) prog.destroy();
    this._programCache.clear();
    // VAOs and buffers are GC'd when context is lost
  }
}
