/**
 * assets/js/init-three-global.js
 * ---------------------------------------------------------------
 * 1) Import your local three.module.js
 * 2) Dynamically pull controls & loaders from the CDN
 * 3) Expose everything on window + dispatch "three-ready" event
 * ---------------------------------------------------------------
 */

import * as THREE from './threejs/three.module.js';
window.THREE = THREE;

const ver  = '0.160.0';
const cdn  = `https://unpkg.com/three@${ver}/examples/jsm`;

/* modules we want */
const MODULES = {
  OrbitControls        : `${cdn}/controls/OrbitControls.js`,
  ArcballControls      : `${cdn}/controls/ArcballControls.js`,
  DragControls         : `${cdn}/controls/DragControls.js`,
  FirstPersonControls  : `${cdn}/controls/FirstPersonControls.js`,
  FlyControls          : `${cdn}/controls/FlyControls.js`,
  MapControls          : `${cdn}/controls/MapControls.js`,
  PointerLockControls  : `${cdn}/controls/PointerLockControls.js`,
  TrackballControls    : `${cdn}/controls/TrackballControls.js`,
  TransformControls    : `${cdn}/controls/TransformControls.js`,

  STLLoader : `${cdn}/loaders/STLLoader.js`,
  GLTFLoader: `${cdn}/loaders/GLTFLoader.js`,
  OBJLoader : `${cdn}/loaders/OBJLoader.js`,
  VOXLoader : `${cdn}/loaders/VOXLoader.js`
};

window.ThreeModules = {};

for (const [name, url] of Object.entries(MODULES)) {
  try {
    const m = await import(/* @vite-ignore */ url);
    window.ThreeModules[name] = m[name] || m.default;   // ← handles default exports
    console.log(`init-three-global: loaded ${name}`);
  } catch (err) {
    console.warn(`init-three-global: failed to load ${name}`, err);
  }
}

console.log('✅ Three.js plus controls/loaders registered globally');

/* ---- NEW: signal downstream code that everything is ready ---- */
document.dispatchEvent(new Event('three-ready'));
