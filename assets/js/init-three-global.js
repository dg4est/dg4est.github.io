/**
 * assets/js/init-three-global.js
 * ---------------------------------------------------------------
 * 1) Import the core Three.js build you ship in your repo.
 * 2) Dynamically import any controls/loaders you need from the CDN.
 * 3) Expose them so plain <script> viewer code can grab them.
 *
 * IMPORTANT: because the CDN modules all contain
 *   import { … } from 'three';
 * you must declare one tiny import-map in your layout so the browser
 * knows what URL "three" means:
 *
 *   <script type="importmap">
 *   {
 *     "imports": {
 *       "three": "{{ '/assets/js/threejs/three.module.js' | relative_url }}"
 *     }
 *   }
 *   </script>
 *
 * Put that block in <head> *before* any <script type="module">.
 * ---------------------------------------------------------------
 */

/* ----------  core Three.js (local) ---------- */
import * as THREE from './threejs/three.module.js';
window.THREE = THREE;

/* ----------  controls & loaders to fetch ---------- */
const ver  = '0.160.0';                                 // keep in sync with local file
const cdn  = `https://unpkg.com/three@${ver}/examples/jsm`;

const MODULES = {
  /* controls */
  OrbitControls        : `${cdn}/controls/OrbitControls.js`,
  ArcballControls      : `${cdn}/controls/ArcballControls.js`,
  DragControls         : `${cdn}/controls/DragControls.js`,
  FirstPersonControls  : `${cdn}/controls/FirstPersonControls.js`,
  FlyControls          : `${cdn}/controls/FlyControls.js`,
  MapControls          : `${cdn}/controls/MapControls.js`,
  PointerLockControls  : `${cdn}/controls/PointerLockControls.js`,
  TrackballControls    : `${cdn}/controls/TrackballControls.js`,
  TransformControls    : `${cdn}/controls/TransformControls.js`,

  /* loaders (add/remove as needed) */
  STLLoader : `${cdn}/loaders/STLLoader.js`,
  GLTFLoader: `${cdn}/loaders/GLTFLoader.js`,
  OBJLoader : `${cdn}/loaders/OBJLoader.js`,
  VOXLoader : `${cdn}/loaders/VOXLoader.js`
};

/* ----------  global registry  ---------- */
window.ThreeModules = {};

/* ----------  dynamic import loop  ---------- */
for (const [name, url] of Object.entries(MODULES)) {
  try {
    // dynamic import accepts fully-qualified URLs
    const mod = await import(/* @vite-ignore */ url);
    window.ThreeModules[name] = mod[name] || mod.default;
    console.log(`init-three-global: loaded ${name}`);
  } catch (err) {
    console.warn(`init-three-global: failed to load ${name} —`, err);
  }
}

console.log('✅ Three.js plus controls/loaders registered globally');
