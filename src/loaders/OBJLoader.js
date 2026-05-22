import { BufferGeometry } from '../geometry/BufferGeometry.js';

/**
 * OBJLoader — Parse Wavefront OBJ text into a BufferGeometry.
 * Supports: v, vn, vt, f (triangles and quads). No MTL support.
 */
export class OBJLoader {
  parse(text) {
    const rawPos = [], rawNorm = [], rawUV = [];
    const positions = [], normals = [], uvs = [];

    const lines = text.split('\n');
    for (let line of lines) {
      line = line.trim();
      if (line.startsWith('v ')) {
        const [,x,y,z] = line.split(/\s+/);
        rawPos.push(parseFloat(x), parseFloat(y), parseFloat(z));
      } else if (line.startsWith('vn ')) {
        const [,x,y,z] = line.split(/\s+/);
        rawNorm.push(parseFloat(x), parseFloat(y), parseFloat(z));
      } else if (line.startsWith('vt ')) {
        const [,u,v] = line.split(/\s+/);
        rawUV.push(parseFloat(u), parseFloat(v));
      } else if (line.startsWith('f ')) {
        const parts = line.slice(2).trim().split(/\s+/);
        // Triangulate: fan from first vertex
        for (let i = 1; i < parts.length - 1; i++) {
          [parts[0], parts[i], parts[i+1]].forEach(part => {
            const [pi, ti, ni] = part.split('/').map(s => parseInt(s) || 0);
            const pIdx = (pi - 1) * 3;
            positions.push(rawPos[pIdx], rawPos[pIdx+1], rawPos[pIdx+2]);
            if (ni) {
              const nIdx = (ni - 1) * 3;
              normals.push(rawNorm[nIdx], rawNorm[nIdx+1], rawNorm[nIdx+2]);
            } else { normals.push(0, 1, 0); }
            if (ti) {
              const tIdx = (ti - 1) * 2;
              uvs.push(rawUV[tIdx], rawUV[tIdx+1]);
            } else { uvs.push(0, 0); }
          });
        }
      }
    }

    const geo = new BufferGeometry();
    geo.setPositions(positions);
    geo.setNormals(normals);
    geo.setUVs(uvs);
    return geo;
  }

  async load(url) {
    const resp = await fetch(url);
    const text = await resp.text();
    return this.parse(text);
  }
}
