// File: assets/js/init-three-global.js
// ──────────────────────────────────────────────────────────────────────
// 1) Load core Three.js
// 2) Dynamically fetch & rewrite every example-module so its bare
//    `import … from 'three'` becomes a correct import from './three.module.js'
// 3) Attach everything to window.THREE and window.ThreeModules
// ──────────────────────────────────────────────────────────────────────
import * as THREE from './threejs/three.module.js';
window.THREE = THREE;
window.ThreeModules = {};

// list every control & loader relative to this file
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
  'loaders/VOXLoader.js'
];

// helper to load+patch a single module
async function loadAndPatch(subpath) {
  // derive full URL to the source file
  const url = new URL(`./threejs/${subpath}`, import.meta.url).href;
  // fetch its text
  let src = await (await fetch(url)).text();
  // rewrite bare `from 'three'` → relative import
  const threeUrl = new URL('./threejs/three.module.js', import.meta.url).href;
  src = src.replace(/from\s+['"]three['"]/g, `from '${threeUrl}'`);
  // create a blob so we can import it
  const blob = new Blob([src], { type: 'application/javascript' });
  const blobUrl = URL.createObjectURL(blob);
  const mod = await import(blobUrl);
  // register every export under window.ThreeModules
  for (const key of Object.keys(mod)) {
    window.ThreeModules[key] = mod[key];
  }
}

// load all modules in parallel
await Promise.all(MODULE_PATHS.map(loadAndPatch));

console.log('✅ Three.js + controls + loaders registered globally');
