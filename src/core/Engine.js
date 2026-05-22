import { WebGLRenderer } from '../renderer/WebGLRenderer.js';

export class Engine {
  constructor(canvas) {
    if (typeof canvas === 'string') canvas = document.getElementById(canvas);
    if (!canvas) throw new Error('NovaJS: no canvas provided');
    this.canvas   = canvas;
    this.renderer = new WebGLRenderer(canvas);
    this._running   = false;
    this._rafId     = null;
    this._lastTime  = 0;
    this._totalTime = 0;
    this._onResize  = () => {
      this.renderer.resize(window.innerWidth, window.innerHeight);
      if (this._camera && this._camera.setAspect) {
        this._camera.setAspect(window.innerWidth / window.innerHeight);
      }
    };
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  start(scene, camera, update = () => {}) {
    this._scene  = scene;
    this._camera = camera;
    this._update = update;
    this._running = true;
    const loop = (timestamp) => {
      if (!this._running) return;
      const delta = Math.min((timestamp - this._lastTime) / 1000, 0.1);
      this._lastTime   = timestamp;
      this._totalTime += delta;
      this._update(delta, this._totalTime);
      this.renderer.render(scene, camera, this._totalTime);
      this._rafId = requestAnimationFrame(loop);
    };
    this._lastTime = performance.now();
    this._rafId = requestAnimationFrame(loop);
  }

  stop()    { this._running = false; if (this._rafId) cancelAnimationFrame(this._rafId); }
  destroy() { this.stop(); window.removeEventListener('resize', this._onResize); this.renderer.destroy(); }
}
