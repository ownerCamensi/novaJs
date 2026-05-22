import { Vector3 } from '../math/Vector3.js';

/**
 * AudioSystem — Web Audio API wrapper with 3D positional audio.
 */
export class AudioSystem {
  constructor() {
    this._ctx     = null;
    this._sounds  = new Map();
    this._music   = null;
    this._listener = null;
    this._masterGain = null;
  }

  _ensureContext() {
    if (this._ctx) return;
    this._ctx    = new (window.AudioContext || window.webkitAudioContext)();
    this._listener = this._ctx.listener;
    this._masterGain = this._ctx.createGain();
    this._masterGain.connect(this._ctx.destination);
  }

  async loadSound(name, url) {
    this._ensureContext();
    const resp   = await fetch(url);
    const buf    = await resp.arrayBuffer();
    const decoded = await this._ctx.decodeAudioData(buf);
    this._sounds.set(name, decoded);
    return decoded;
  }

  play(name, options = {}) {
    this._ensureContext();
    const buf = this._sounds.get(name);
    if (!buf) { console.warn(`[NovaJS Audio] Sound "${name}" not loaded`); return null; }

    const source = this._ctx.createBufferSource();
    source.buffer = buf;
    source.loop   = options.loop ?? false;

    let output = source;

    if (options.position) {
      // 3D positional audio
      const panner = this._ctx.createPanner();
      panner.panningModel   = 'HRTF';
      panner.distanceModel  = 'inverse';
      panner.refDistance    = options.refDistance ?? 1;
      panner.maxDistance    = options.maxDistance ?? 100;
      panner.rolloffFactor  = options.rolloff     ?? 1;
      const p = options.position;
      panner.positionX.value = p.x; panner.positionY.value = p.y; panner.positionZ.value = p.z;
      source.connect(panner);
      panner.connect(this._masterGain);
      output = panner;
    } else {
      source.connect(this._masterGain);
    }

    const gainNode = this._ctx.createGain();
    gainNode.gain.value = options.volume ?? 1;
    source.connect(gainNode);
    gainNode.connect(this._masterGain);

    source.start(options.delay ?? 0);
    return source;
  }

  /** Update listener position (camera position) */
  updateListener(position, forward, up) {
    if (!this._ctx) return;
    const l = this._listener;
    if (l.positionX) {
      l.positionX.value = position.x;
      l.positionY.value = position.y;
      l.positionZ.value = position.z;
      l.forwardX.value = forward.x; l.forwardY.value = forward.y; l.forwardZ.value = forward.z;
      l.upX.value = up.x;           l.upY.value = up.y;           l.upZ.value = up.z;
    } else {
      l.setPosition(position.x, position.y, position.z);
      l.setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
    }
  }

  setMasterVolume(v) {
    this._ensureContext();
    this._masterGain.gain.value = v;
  }

  resume() { if (this._ctx?.state === 'suspended') this._ctx.resume(); }
}
