/**
 * assets/js/init-three-global.js
 * ---------------------------------------------------------------------
 * Load Three.js, then dynamically fetch and register example controls/loaders,
 * skipping missing or invalid files, and rewrite both bare specifiers
 * and relative imports so modules resolve correctly.
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

// 2) Prepare registry for example modules
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
  'loaders/OBJLoader.js',
  'loaders/VOXLoader.js'
];

// Helper: fetch, validate, patch imports, and import module
async function loadAndPatch(subpath) {
  const moduleUrl = new URL(`./threejs/${subpath}`, import.meta.url).href;
  try {
    const resp = await fetch(moduleUrl);
    if (!resp.ok) { console.warn(`init-three-global: skipping ${subpath} (HTTP ${resp.status})`); return; }
    const contentType = resp.headers.get('Content-Type') || '';
    if (!contentType.includes('application/javascript') && !contentType.includes('ecmascript')) {
      console.warn(`init-three-global: skipping ${subpath} (invalid content-type: ${contentType})`);
      return;
    }
    let src = await resp.text();
    if (src.trim().startsWith('<')) {
      console.warn(`init-three-global: skipping ${subpath} (HTML content)`);
      return;
    }
    // Patch bare 'three' imports
    const threeUrl = new URL('./threejs/three.module.js', import.meta.url).href;
    src = src.replace(/from ['"]three['"]/g, `from '${threeUrl}'`);

    // Patch relative imports (e.g. './OrbitControls.js') to absolute URLs
    const base = moduleUrl.replace(/[^/]+$/, '');
    src = src.replace(/from ['"](\.\/[^'"\s]+)['"]/g, (_m, rel) => {
      // remove leading './'
      const relPath = rel.replace(/^[.]+\//, '');
      return `from '${base + relPath}'`;
    });

    // Load via blob
    const blob = new Blob([src], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);
    const mod = await import(blobUrl);
    URL.revokeObjectURL(blobUrl);

    // Register exports globally
    Object.keys(mod).forEach(k => window.ThreeModules[k] = mod[k]);
    console.log(`init-three-global: loaded ${subpath}`);
  } catch (err) {
    console.error(`init-three-global: error loading ${subpath}`, err);
  }
}

// Load all modules in parallel
await Promise.all(MODULE_PATHS.map(loadAndPatch));
console.log('✅ Three.js and available controls/loaders registered globally');
