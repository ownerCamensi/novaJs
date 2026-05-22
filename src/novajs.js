/**
 * NovaJS — Advanced WebGL2 3D Engine
 * ====================================
 * A modular, production-style engine for learning graphics,
 * making games, and experimenting with shaders.
 *
 * Exposes window.Nova when loaded as UMD bundle.
 */

// Math
export { Vector2 }   from './math/Vector2.js';
export { Vector3 }   from './math/Vector3.js';
export { Vector4 }   from './math/Vector4.js';
export { Matrix4 }   from './math/Matrix4.js';
export { Quaternion } from './math/Quaternion.js';

// Core
export { Object3D }  from './core/Object3D.js';
export { Scene }     from './core/Scene.js';
export { Engine }    from './core/Engine.js';

// Renderer
export { WebGLRenderer } from './renderer/WebGLRenderer.js';
export { ShaderProgram } from './renderer/ShaderProgram.js';

// Camera
export { Camera }             from './camera/Camera.js';
export { PerspectiveCamera }  from './camera/PerspectiveCamera.js';
export { OrthographicCamera } from './camera/OrthographicCamera.js';

// Geometry
export { BufferGeometry } from './geometry/BufferGeometry.js';
export { BoxGeometry }    from './geometry/BoxGeometry.js';
export { PlaneGeometry }  from './geometry/PlaneGeometry.js';
export { SphereGeometry } from './geometry/SphereGeometry.js';
export { TorusGeometry }  from './geometry/TorusGeometry.js';

// Materials
export { Material }       from './materials/Material.js';
export { BasicMaterial }  from './materials/BasicMaterial.js';
export { ShaderMaterial } from './materials/ShaderMaterial.js';

// Objects
export { Mesh } from './objects/Mesh.js';

// Lights
export { AmbientLight }     from './lights/AmbientLight.js';
export { DirectionalLight } from './lights/DirectionalLight.js';
export { PointLight }       from './lights/PointLight.js';

// Physics
export { PhysicsWorld } from './physics/PhysicsWorld.js';
export { Rigidbody }    from './physics/Rigidbody.js';

// Controls
export { FPSControls } from './controls/FPSControls.js';

// Loaders
export { TextureLoader } from './loaders/TextureLoader.js';
export { OBJLoader }     from './loaders/OBJLoader.js';

// Particles
export { ParticleSystem } from './particles/ParticleSystem.js';

// Post-processing
export { PostProcessor } from './postprocessing/PostProcessor.js';

// Audio
export { AudioSystem } from './audio/AudioSystem.js';

// ── Version ────────────────────────────────────────────────────────────────
export const VERSION = '1.0.0';

console.log(`%c✦ NovaJS v${VERSION} — WebGL2 Engine Ready`, 
  'color:#a78bfa;font-weight:bold;font-size:14px;');
