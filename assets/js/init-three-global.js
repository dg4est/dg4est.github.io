/**
 * assets/js/init-three-global.js
 * ---------------------------------------------------------------------
 * Load Three.js, then dynamically fetch and register example controls/loaders,
 * skipping any missing or HTML responses to avoid import errors.
 * Exposes:
 *   window.THREE
 *   window.ThreeModules (OrbitControls, STLLoader, etc.)
 *
 * Include this with `<script type="module">` in your layout.
 * ---------------------------------------------------------------------
 */

// 1) Load core Three.js
import * as THREE from './threejs/three.module.js';
window.THREE = THREE;

// 2) Prepare a registry for example modules
window.ThreeModules = {};

// 3) List of control/loader module paths relative to this file
const MODULE_PATHS = [
  'controls/OrbitControls.js',
  'controls/ArcballControls.js',
  'controls/DragControls.js',
  'controls/FirstPersonControls.js',
  'controls/FlyControls.js',
  'controls/MapControls.js',
  'controls/PointerLockControls.js',
  'controls/TrackballControls.js',
  'controls/TransformControls.js',
  'loaders/STLLoader.js',
  'loaders/ThreeDMLoader.js',
  'loaders/ThreeMFLoader.js',
  'loaders/GLTFLoader.js',
  'loaders/OBJLoader.js',
  'loaders/VOXLoader.js',
  // add any additional loaders you have locally
];

// Helper: fetch, validate, patch bare "from 'three'" imports, and import module
async function loadAndPatch(subpath) {
  const url = new URL(`./threejs/${subpath}`, import.meta.url).href;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.warn(`init-three-global: skipping ${subpath} (HTTP ${resp.status})`);
      return;
    }
    const contentType = resp.headers.get('Content-Type') || '';
    if (!contentType.includes('javascript') && !contentType.includes('application/ecmascript')) {
      console.warn(`init-three-global: skipping ${subpath} (invalid content-type: ${contentType})`);
      return;
    }
    const src = await resp.text();
    if (src.trim().startsWith('<')) {
      console.warn(`init-three-global: skipping ${subpath} (HTML content)`);
      return;
    }
    // patch bare specifiers
    const threeRel = new URL('./threejs/three.module.js', import.meta.url).href;
    const patched = src.replace(/from ['"]three['"]/g, `from '${threeRel}'`);
    // blob & dynamic import
    const blobUrl = URL.createObjectURL(new Blob([patched], { type: 'application/javascript' }));
    const mod = await import(blobUrl);
    // register exports globally
    Object.keys(mod).forEach(key => window.ThreeModules[key] = mod[key]);
    URL.revokeObjectURL(blobUrl);
    console.log(`init-three-global: loaded ${subpath}`);
  } catch (err) {
    console.error(`init-three-global: error loading ${subpath}`, err);
  }
}

// Load all modules in parallel, skipping missing or invalid ones
await Promise.all(MODULE_PATHS.map(loadAndPatch));
console.log('✅ Three.js and available controls/loaders registered globally');
