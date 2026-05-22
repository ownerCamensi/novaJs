import { Vector3 } from '../math/Vector3.js';

/**
 * Rigidbody — Attach to a Mesh to give it physics behavior.
 */
export class Rigidbody {
  constructor(mesh, options = {}) {
    this.mesh       = mesh;
    this.velocity   = new Vector3(0, 0, 0);
    this.halfSize   = options.halfSize || new Vector3(0.5, 0.5, 0.5);
    this.mass       = options.mass     ?? 1;
    this.useGravity = options.useGravity ?? true;
    this.isStatic   = options.isStatic  ?? false;
    this.friction   = options.friction  ?? 0.85; // 0=ice, 1=no friction
    this.isGrounded = false;
    this.bounciness = options.bounciness ?? 0;
  }

  applyForce(fx, fy, fz) {
    this.velocity.x += fx / this.mass;
    this.velocity.y += fy / this.mass;
    this.velocity.z += fz / this.mass;
  }

  jump(force = 5) {
    if (this.isGrounded) {
      this.velocity.y = force;
      this.isGrounded = false;
    }
  }
}
