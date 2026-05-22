import { BufferGeometry } from './BufferGeometry.js';

/** UV sphere */
export class SphereGeometry extends BufferGeometry {
  constructor(radius=1, widthSeg=32, heightSeg=16) {
    super();
    const positions=[], normals=[], uvs=[], indices=[];
    for (let iy=0; iy<=heightSeg; iy++) {
      const v  = iy / heightSeg;
      const phi = v * Math.PI;
      for (let ix=0; ix<=widthSeg; ix++) {
        const u   = ix / widthSeg;
        const theta = u * Math.PI * 2;
        const x = -Math.cos(theta) * Math.sin(phi);
        const y =  Math.cos(phi);
        const z =  Math.sin(theta) * Math.sin(phi);
        positions.push(x*radius, y*radius, z*radius);
        normals.push(x, y, z);
        uvs.push(u, 1-v);
      }
    }
    for (let iy=0; iy<heightSeg; iy++) {
      for (let ix=0; ix<widthSeg; ix++) {
        const a=(widthSeg+1)*iy+ix, b=a+widthSeg+1;
        indices.push(a,b,a+1, b+1,a+1,b);
      }
    }
    this.setPositions(positions); this.setNormals(normals);
    this.setUVs(uvs); this.setIndices(indices);
  }
}
