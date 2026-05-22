import { Vector3 } from '../math/Vector3.js';

/**
 * PhysicsWorld — Lightweight AABB physics.
 * Add Rigidbody objects; call world.step(delta) each frame.
 */
export class PhysicsWorld {
  constructor() {
    this.gravity   = new Vector3(0, -9.81, 0);
    this.bodies    = [];
    this.colliders = []; // static AABB colliders (floors, walls)
  }

  addBody(rb) {
    this.bodies.push(rb);
    return rb;
  }

  addStaticBox(minX, minY, minZ, maxX, maxY, maxZ) {
    this.colliders.push({ min:{x:minX,y:minY,z:minZ}, max:{x:maxX,y:maxY,z:maxZ} });
  }

  step(delta) {
    for (const body of this.bodies) {
      if (body.isStatic) continue;

      // Apply gravity
      if (body.useGravity) {
        body.velocity.x += this.gravity.x * delta;
        body.velocity.y += this.gravity.y * delta;
        body.velocity.z += this.gravity.z * delta;
      }

      // Apply velocity
      body.mesh.position.x += body.velocity.x * delta;
      body.mesh.position.y += body.velocity.y * delta;
      body.mesh.position.z += body.velocity.z * delta;

      // Apply friction (horizontal)
      if (body.isGrounded) {
        body.velocity.x *= Math.pow(body.friction, delta * 60);
        body.velocity.z *= Math.pow(body.friction, delta * 60);
      }

      // ── AABB Collision ──────────────────────────────────────────────────
      body.isGrounded = false;
      for (const col of this.colliders) {
        const p  = body.mesh.position;
        const hs = body.halfSize;

        const bMin = { x: p.x - hs.x, y: p.y - hs.y, z: p.z - hs.z };
        const bMax = { x: p.x + hs.x, y: p.y + hs.y, z: p.z + hs.z };

        // AABB vs AABB overlap test
        if (bMax.x > col.min.x && bMin.x < col.max.x &&
            bMax.y > col.min.y && bMin.y < col.max.y &&
            bMax.z > col.min.z && bMin.z < col.max.z) {

          // Find shallowest penetration axis
          const dxL = col.max.x - bMin.x, dxR = bMax.x - col.min.x;
          const dyB = col.max.y - bMin.y, dyT = bMax.y - col.min.y;
          const dzF = col.max.z - bMin.z, dzB = bMax.z - col.min.z;

          const minDx = Math.min(dxL, dxR);
          const minDy = Math.min(dyB, dyT);
          const minDz = Math.min(dzF, dzB);

          if (minDy <= minDx && minDy <= minDz) {
            // Vertical collision (floor / ceiling)
            if (dyT < dyB) {
              // Hitting ceiling
              body.mesh.position.y -= dyT;
              if (body.velocity.y > 0) body.velocity.y = 0;
            } else {
              // Standing on floor
              body.mesh.position.y += dyB;
              if (body.velocity.y < 0) body.velocity.y = 0;
              body.isGrounded = true;
            }
          } else if (minDx < minDz) {
            // X axis collision
            if (dxR < dxL) { body.mesh.position.x -= dxR; if(body.velocity.x>0) body.velocity.x=0; }
            else            { body.mesh.position.x += dxL; if(body.velocity.x<0) body.velocity.x=0; }
          } else {
            // Z axis collision
            if (dzB < dzF) { body.mesh.position.z -= dzB; if(body.velocity.z>0) body.velocity.z=0; }
            else            { body.mesh.position.z += dzF; if(body.velocity.z<0) body.velocity.z=0; }
          }
        }
      }
    }
  }

  /** Simple raycast against colliders. Returns {hit, point, distance} */
  raycast(origin, direction, maxDist = 1000) {
    let closest = null;
    let closestDist = maxDist;
    const dir = direction.normalize();

    for (const col of this.colliders) {
      // Slab method ray-AABB test
      const tMinX = (col.min.x - origin.x) / dir.x;
      const tMaxX = (col.max.x - origin.x) / dir.x;
      const tMinY = (col.min.y - origin.y) / dir.y;
      const tMaxY = (col.max.y - origin.y) / dir.y;
      const tMinZ = (col.min.z - origin.z) / dir.z;
      const tMaxZ = (col.max.z - origin.z) / dir.z;

      const tEnterX = Math.min(tMinX, tMaxX), tExitX = Math.max(tMinX, tMaxX);
      const tEnterY = Math.min(tMinY, tMaxY), tExitY = Math.max(tMinY, tMaxY);
      const tEnterZ = Math.min(tMinZ, tMaxZ), tExitZ = Math.max(tMinZ, tMaxZ);

      const tEnter = Math.max(tEnterX, tEnterY, tEnterZ);
      const tExit  = Math.min(tExitX,  tExitY,  tExitZ);

      if (tEnter < tExit && tEnter > 0 && tEnter < closestDist) {
        closestDist = tEnter;
        closest = { hit: true, distance: tEnter,
          point: new Vector3(origin.x+dir.x*tEnter, origin.y+dir.y*tEnter, origin.z+dir.z*tEnter) };
      }
    }
    return closest || { hit: false };
  }
}
