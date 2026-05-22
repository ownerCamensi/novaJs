import { BufferGeometry } from './BufferGeometry.js';

/**
 * BoxGeometry — Unit cube (−0.5 to +0.5 on each axis by default).
 * 6 faces × 4 verts × 2 triangles = 36 indices.
 * Each face has its own 4 vertices so normals are hard-edged (flat-shaded look).
 */
export class BoxGeometry extends BufferGeometry {
  constructor(w = 1, h = 1, d = 1) {
    super();

    const hw = w / 2, hh = h / 2, hd = d / 2;

    // Each face: 4 vertices with position, normal, uv
    // Faces: +X, -X, +Y, -Y, +Z, -Z
    const faces = [
      // pos (+X face) — normal (1,0,0)
      { verts: [[hw,hh,-hd],[hw,-hh,-hd],[hw,-hh,hd],[hw,hh,hd]],  n:[1,0,0] },
      // neg (-X face) — normal (-1,0,0)
      { verts: [[-hw,hh,hd],[-hw,-hh,hd],[-hw,-hh,-hd],[-hw,hh,-hd]], n:[-1,0,0] },
      // top (+Y face)
      { verts: [[-hw,hh,hd],[hw,hh,hd],[hw,hh,-hd],[-hw,hh,-hd]],   n:[0,1,0] },
      // bottom (-Y face)
      { verts: [[-hw,-hh,-hd],[hw,-hh,-hd],[hw,-hh,hd],[-hw,-hh,hd]], n:[0,-1,0] },
      // front (+Z face)
      { verts: [[-hw,hh,hd],[-hw,-hh,hd],[hw,-hh,hd],[hw,hh,hd]],   n:[0,0,1] },
      // back (-Z face)
      { verts: [[hw,hh,-hd],[hw,-hh,-hd],[-hw,-hh,-hd],[-hw,hh,-hd]], n:[0,0,-1] },
    ];

    const uvCoords = [[0,1],[0,0],[1,0],[1,1]];

    const positions = [], normals = [], uvs = [], indices = [];

    faces.forEach((face, fi) => {
      const base = fi * 4;
      face.verts.forEach((v, vi) => {
        positions.push(...v);
        normals.push(...face.n);
        uvs.push(...uvCoords[vi]);
      });
      // Two triangles per face (CCW winding)
      indices.push(base, base+1, base+2, base, base+2, base+3);
    });

    this.setPositions(positions);
    this.setNormals(normals);
    this.setUVs(uvs);
    this.setIndices(indices);
  }
}
