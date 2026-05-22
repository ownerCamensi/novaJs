import { BufferGeometry } from './BufferGeometry.js';

/** Donut shape */
export class TorusGeometry extends BufferGeometry {
  constructor(radius=1, tube=0.4, radSeg=32, tubeSeg=16) {
    super();
    const positions=[], normals=[], uvs=[], indices=[];
    for (let j=0; j<=radSeg; j++) {
      for (let i=0; i<=tubeSeg; i++) {
        const u = i / tubeSeg * Math.PI * 2;
        const v = j / radSeg  * Math.PI * 2;
        const x = (radius + tube*Math.cos(v)) * Math.cos(u);
        const y =  tube * Math.sin(v);
        const z = (radius + tube*Math.cos(v)) * Math.sin(u);
        positions.push(x, y, z);
        const cx = Math.cos(u)*Math.cos(v), cy = Math.sin(v), cz = Math.sin(u)*Math.cos(v);
        normals.push(cx, cy, cz);
        uvs.push(i/tubeSeg, j/radSeg);
      }
    }
    for (let j=0; j<radSeg; j++) {
      for (let i=0; i<tubeSeg; i++) {
        const a = (tubeSeg+1)*j+i;
        const b = (tubeSeg+1)*(j+1)+i;
        indices.push(a,b,a+1, b+1,a+1,b);
      }
    }
    this.setPositions(positions); this.setNormals(normals);
    this.setUVs(uvs); this.setIndices(indices);
  }
}
