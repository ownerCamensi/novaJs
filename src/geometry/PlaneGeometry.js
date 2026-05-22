import { BufferGeometry } from './BufferGeometry.js';

/** Flat XZ plane centered at origin, with segmented UVs */
export class PlaneGeometry extends BufferGeometry {
  constructor(w = 1, h = 1, segW = 1, segH = 1) {
    super();
    const positions=[], normals=[], uvs=[], indices=[];
    const dx = w / segW, dz = h / segH;
    for (let iz = 0; iz <= segH; iz++) {
      for (let ix = 0; ix <= segW; ix++) {
        const x = ix * dx - w/2, z = iz * dz - h/2;
        positions.push(x, 0, z);
        normals.push(0, 1, 0);
        uvs.push(ix / segW, 1 - iz / segH);
      }
    }
    for (let iz = 0; iz < segH; iz++) {
      for (let ix = 0; ix < segW; ix++) {
        const a = iz*(segW+1)+ix, b=a+1, c=a+(segW+1), d=c+1;
        indices.push(a,c,b, b,c,d);
      }
    }
    this.setPositions(positions); this.setNormals(normals);
    this.setUVs(uvs); this.setIndices(indices);
  }
}
