let _geoId = 0;

/**
 * BufferGeometry — Raw GPU-ready buffer data.
 * Stores flat typed arrays: positions, normals, uvs, indices.
 */
export class BufferGeometry {
  constructor() {
    this.id        = _geoId++;
    this.positions = null; // Float32Array, 3 per vertex
    this.normals   = null; // Float32Array, 3 per vertex
    this.uvs       = null; // Float32Array, 2 per vertex
    this.indices   = null; // Uint16Array
  }

  setPositions(data) { this.positions = data instanceof Float32Array ? data : new Float32Array(data); return this; }
  setNormals(data)   { this.normals   = data instanceof Float32Array ? data : new Float32Array(data); return this; }
  setUVs(data)       { this.uvs       = data instanceof Float32Array ? data : new Float32Array(data); return this; }
  setIndices(data)   { this.indices   = data instanceof Uint16Array  ? data : new Uint16Array(data);  return this; }

  get vertexCount() {
    return this.positions ? this.positions.length / 3 : 0;
  }
}
