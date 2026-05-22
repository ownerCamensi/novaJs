import { Vector3 } from '../math/Vector3.js';

/**
 * FPSControls — First-person camera controller.
 * Supports: WASD movement, mouse look, pointer lock, jump, sprint, crouch.
 *
 * Usage:
 *   const controls = new FPSControls(camera, canvas);
 *   // In update loop:
 *   controls.update(delta);
 */
export class FPSControls {
  constructor(camera, canvas, options = {}) {
    this.camera  = camera;
    this.canvas  = canvas;

    // Settings
    this.moveSpeed   = options.moveSpeed   ?? 5;
    this.sprintMult  = options.sprintMult  ?? 2;
    this.crouchMult  = options.crouchMult  ?? 0.4;
    this.lookSpeed   = options.lookSpeed   ?? 0.002;
    this.jumpForce   = options.jumpForce   ?? 5;
    this.gravity     = options.gravity     ?? 20;
    this.eyeHeight   = options.eyeHeight   ?? 1.7;
    this.groundY     = options.groundY     ?? 0; // default floor Y

    // Internal state
    this._yaw    = 0;
    this._pitch  = 0;
    this._velY   = 0;
    this._onGround = true;

    this._keys = {};
    this._locked = false;

    this._bindEvents();

    // Set initial camera height
    this.camera.position.y = this.groundY + this.eyeHeight;
  }

  _bindEvents() {
    // Pointer lock
    this.canvas.addEventListener('click', () => {
      this.canvas.requestPointerLock();
    });
    document.addEventListener('pointerlockchange', () => {
      this._locked = document.pointerLockElement === this.canvas;
    });

    // Mouse look
    document.addEventListener('mousemove', (e) => {
      if (!this._locked) return;
      this._yaw   -= e.movementX * this.lookSpeed;
      this._pitch -= e.movementY * this.lookSpeed;
      // Clamp pitch to avoid flipping
      this._pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, this._pitch));
    });

    // Keys
    document.addEventListener('keydown', (e) => { this._keys[e.code] = true; });
    document.addEventListener('keyup',   (e) => { this._keys[e.code] = false; });
  }

  update(delta) {
    const cam  = this.camera;
    const keys = this._keys;

    // ── Apply yaw/pitch to camera rotation ──────────────────────────────────
    cam.rotation.x = this._pitch;
    cam.rotation.y = this._yaw;
    cam.rotation.z = 0;

    // ── Build move direction from yaw only (no pitch-tilt on movement) ──────
    const sinYaw = Math.sin(this._yaw);
    const cosYaw = Math.cos(this._yaw);

    let moveX = 0, moveZ = 0;
    if (keys['KeyW'] || keys['ArrowUp'])    { moveX -= sinYaw; moveZ -= cosYaw; }
    if (keys['KeyS'] || keys['ArrowDown'])  { moveX += sinYaw; moveZ += cosYaw; }
    if (keys['KeyA'] || keys['ArrowLeft'])  { moveX -= cosYaw; moveZ += sinYaw; }
    if (keys['KeyD'] || keys['ArrowRight']) { moveX += cosYaw; moveZ -= sinYaw; }

    // ── Speed modifier ───────────────────────────────────────────────────────
    let speed = this.moveSpeed;
    if (keys['ShiftLeft'] || keys['ShiftRight']) speed *= this.sprintMult;
    if (keys['ControlLeft'] || keys['KeyC'])     speed *= this.crouchMult;

    // Normalize diagonal
    const len = Math.sqrt(moveX*moveX + moveZ*moveZ);
    if (len > 0) { moveX /= len; moveZ /= len; }

    cam.position.x += moveX * speed * delta;
    cam.position.z += moveZ * speed * delta;

    // ── Gravity + Jump ───────────────────────────────────────────────────────
    if (this._onGround && (keys['Space'] || keys['KeyE'])) {
      this._velY = this.jumpForce;
      this._onGround = false;
    }

    if (!this._onGround) {
      this._velY -= this.gravity * delta;
    }

    cam.position.y += this._velY * delta;

    // Simple floor collision
    const floorY = this.groundY + this.eyeHeight;
    if (cam.position.y <= floorY) {
      cam.position.y = floorY;
      this._velY     = 0;
      this._onGround = true;
    }
  }

  /** Set ground Y dynamically (e.g. for terrain) */
  setGroundY(y) { this.groundY = y; }

  dispose() {
    document.exitPointerLock();
  }
}
