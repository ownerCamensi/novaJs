import { Vector3 } from '../math/Vector3.js';
import { Quaternion } from '../math/Quaternion.js';
import { Matrix4 } from '../math/Matrix4.js';

let _nextId = 0;

/**
 * Object3D — Base class for everything in the scene graph.
 * Holds position, quaternion rotation, scale, and a computed world matrix.
 */
export class Object3D {
  constructor() {
    this.id   = _nextId++;
    this.name = '';
    this.type = 'Object3D';

    // Local-space transform components
    this.position   = new Vector3(0, 0, 0);
    this.quaternion = new Quaternion(0, 0, 0, 1);
    this.scale      = new Vector3(1, 1, 1);

    // Euler angles (radians) — convenience; synced to quaternion on updateMatrix
    this.rotation = new Vector3(0, 0, 0);

    // Matrices
    this.matrix      = new Matrix4(); // local
    this.worldMatrix = new Matrix4(); // world (parent * local)

    this.parent   = null;
    this.children = [];

    this.visible    = true;
    this.castShadow = false;
    this.matrixDirty = true;
  }

  // ─── Scene Graph ────────────────────────────────────────────────────────────

  add(child) {
    if (child.parent) child.parent.remove(child);
    child.parent = this;
    this.children.push(child);
    return this;
  }

  remove(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parent = null;
    }
    return this;
  }

  traverse(cb) {
    cb(this);
    for (const child of this.children) child.traverse(cb);
  }

  // ─── Matrix updates ─────────────────────────────────────────────────────────

  /** Rebuild local matrix from position / rotation (Euler) / scale */
  updateMatrix() {
    // Sync Euler → quaternion (YXZ order — natural for FPS / 3D objects)
    this.quaternion.setFromEuler(
      this.rotation.x,
      this.rotation.y,
      this.rotation.z,
      'YXZ'
    );
    // Compose TRS
    this.matrix = Matrix4.compose(this.position, this.quaternion, this.scale);
    this.matrixDirty = false;
  }

  /** Walk up the parent chain to build the world matrix */
  updateWorldMatrix(updateParents = false, updateChildren = false) {
    if (updateParents && this.parent) {
      this.parent.updateWorldMatrix(true, false);
    }

    this.updateMatrix();

    if (this.parent) {
      this.worldMatrix = this.parent.worldMatrix.multiply(this.matrix);
    } else {
      this.worldMatrix.copy(this.matrix);
    }

    if (updateChildren) {
      for (const child of this.children) {
        child.updateWorldMatrix(false, true);
      }
    }
  }

  // ─── Convenience helpers ────────────────────────────────────────────────────

  /** Look at a world-space target */
  lookAt(target) {
    const dir = this.position.sub(target).normalizeSelf();
    this.quaternion.setFromAxisAngle(dir, 0);
  }

  getWorldPosition() {
    this.updateWorldMatrix();
    const e = this.worldMatrix.elements;
    return new Vector3(e[12], e[13], e[14]);
  }

  clone() {
    const obj = new Object3D();
    obj.position.setFrom(this.position);
    obj.rotation.setFrom(this.rotation);
    obj.scale.setFrom(this.scale);
    return obj;
  }
}
