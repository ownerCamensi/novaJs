/**
 * Quaternion — Represents a rotation without gimbal lock.
 */
export class Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x; this.y = y; this.z = z; this.w = w;
  }
  set(x, y, z, w) { this.x=x; this.y=y; this.z=z; this.w=w; return this; }
  clone() { return new Quaternion(this.x, this.y, this.z, this.w); }
  copy(q) { this.x=q.x; this.y=q.y; this.z=q.z; this.w=q.w; return this; }
  identity() { this.x=0; this.y=0; this.z=0; this.w=1; return this; }
  length() { return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w); }
  normalizeSelf() {
    const l=this.length();
    if(l>0){this.x/=l;this.y/=l;this.z/=l;this.w/=l;}
    return this;
  }
  conjugate() { return new Quaternion(-this.x,-this.y,-this.z,this.w); }
  multiply(b) {
    const ax=this.x,ay=this.y,az=this.z,aw=this.w;
    const bx=b.x,by=b.y,bz=b.z,bw=b.w;
    return new Quaternion(
      aw*bx+ax*bw+ay*bz-az*by,
      aw*by-ax*bz+ay*bw+az*bx,
      aw*bz+ax*by-ay*bx+az*bw,
      aw*bw-ax*bx-ay*by-az*bz
    );
  }
  multiplySelf(b) { return this.copy(this.multiply(b)); }
  setFromEuler(x, y, z, order='YXZ') {
    const c1=Math.cos(x/2),s1=Math.sin(x/2);
    const c2=Math.cos(y/2),s2=Math.sin(y/2);
    const c3=Math.cos(z/2),s3=Math.sin(z/2);
    if(order==='XYZ'){
      this.x=s1*c2*c3+c1*s2*s3; this.y=c1*s2*c3-s1*c2*s3;
      this.z=c1*c2*s3+s1*s2*c3; this.w=c1*c2*c3-s1*s2*s3;
    } else if(order==='YXZ'){
      this.x=s1*c2*c3+c1*s2*s3; this.y=c1*s2*c3-s1*c2*s3;
      this.z=c1*c2*s3-s1*s2*c3; this.w=c1*c2*c3+s1*s2*s3;
    } else {
      this.x=s1*c2*c3-c1*s2*s3; this.y=c1*s2*c3+s1*c2*s3;
      this.z=c1*c2*s3-s1*s2*c3; this.w=c1*c2*c3+s1*s2*s3;
    }
    return this;
  }
  setFromAxisAngle(axis, angle) {
    const h=angle/2,s=Math.sin(h);
    this.x=axis.x*s; this.y=axis.y*s; this.z=axis.z*s; this.w=Math.cos(h);
    return this;
  }
  slerp(b, t) {
    let dot=this.x*b.x+this.y*b.y+this.z*b.z+this.w*b.w;
    let bx=b.x,by=b.y,bz=b.z,bw=b.w;
    if(dot<0){bx=-bx;by=-by;bz=-bz;bw=-bw;dot=-dot;}
    if(dot>0.9995){
      return new Quaternion(this.x+t*(bx-this.x),this.y+t*(by-this.y),
        this.z+t*(bz-this.z),this.w+t*(bw-this.w)).normalizeSelf();
    }
    const theta0=Math.acos(dot),theta=theta0*t;
    const sinTheta=Math.sin(theta),sinTheta0=Math.sin(theta0);
    const s0=Math.cos(theta)-dot*sinTheta/sinTheta0,s1=sinTheta/sinTheta0;
    return new Quaternion(s0*this.x+s1*bx,s0*this.y+s1*by,s0*this.z+s1*bz,s0*this.w+s1*bw);
  }
  toArray() { return [this.x,this.y,this.z,this.w]; }
}
