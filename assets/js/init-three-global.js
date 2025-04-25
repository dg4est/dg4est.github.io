// File: assets/js/init-three-global.js
// ------------------------------------------------------------
// 1) Import core Three.js (local file, must be three.module.js)
// 2) Dynamically import all controls & loaders from unpkg
// 3) Expose them on window.THREE and window.ThreeModules
// ------------------------------------------------------------

import * as THREE from './threejs/three.module.js';  
window.THREE = THREE;

// Version must match your local three.module.js
const version = '0.160.0';
const baseURL = `https://unpkg.com/three@${version}/examples/jsm`;

const MODULES = {
  // controls
  OrbitControls:   `${baseURL}/controls/OrbitControls.js`,
  ArcballControls: `${baseURL}/controls/ArcballControls.js`,
  DragControls:    `${baseURL}/controls/DragControls.js`,
  FirstPersonControls: `${baseURL}/controls/FirstPersonControls.js`,
  FlyControls:     `${baseURL}/controls/FlyControls.js`,
  MapControls:     `${baseURL}/controls/MapControls.js`,
  PointerLockControls: `${baseURL}/controls/PointerLockControls.js`,
  TrackballControls:   `${baseURL}/controls/TrackballControls.js`,
  TransformControls:   `${baseURL}/controls/TransformControls.js`,

  // loaders
  STLLoader:  `${baseURL}/loaders/STLLoader.js`,
  GLTFLoader: `${baseURL}/loaders/GLTFLoader.js`,
  OBJLoader:  `${baseURL}/loaders/OBJLoader.js`,
  VOXLoader:  `${baseURL}/loaders/VOXLoader.js`,
};

window.ThreeModules = {};

for (const [name, url] of Object.entries(MODULES)) {
  try {
    const mod = await import(/* @vite-ignore */ url);
    // each module exports a class of the same name
    window.ThreeModules[name] = mod[name];
    console.log(`init-three-global: loaded ${name}`);
  } catch (err) {
    console.warn(`init-three-global: failed to load ${name} from ${url}`, err);
  }
}

console.log('✅ Three.js + controls & loaders registered globally');
