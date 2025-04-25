// File: assets/js/init-three-global.js
// ───────────────────────────────────────────────────────
// Load core Three.js locally, then import all controls
// and loaders from the official unpkg CDN. Expose them
// on window.THREE and window.ThreeModules.
// Include this via <script type="module"> in your docs layout.
// ───────────────────────────────────────────────────────

import * as THREE from './threejs/three.module.js';
window.THREE = THREE;

// Pull controls and loaders from CDN (versions must match your local three.module.js)
const version = '0.160.0';
const base   = `https://unpkg.com/three@${version}/examples/jsm`;

// Controls
import { OrbitControls }       from `${base}/controls/OrbitControls.js`;
import { ArcballControls }     from `${base}/controls/ArcballControls.js`;
import { DragControls }        from `${base}/controls/DragControls.js`;
import { FirstPersonControls } from `${base}/controls/FirstPersonControls.js`;
import { FlyControls }         from `${base}/controls/FlyControls.js`;
import { MapControls }         from `${base}/controls/MapControls.js`;
import { PointerLockControls } from `${base}/controls/PointerLockControls.js`;
import { TrackballControls }   from `${base}/controls/TrackballControls.js`;
import { TransformControls }   from `${base}/controls/TransformControls.js`;

// Loaders
import { STLLoader }    from `${base}/loaders/STLLoader.js`;
import { GLTFLoader }   from `${base}/loaders/GLTFLoader.js`;
import { OBJLoader }    from `${base}/loaders/OBJLoader.js`;
import { VOXLoader }    from `${base}/loaders/VOXLoader.js`;
// …add others you need…

// Expose them
window.ThreeModules = {
  OrbitControls,
  ArcballControls,
  DragControls,
  FirstPersonControls,
  FlyControls,
  MapControls,
  PointerLockControls,
  TrackballControls,
  TransformControls,
  STLLoader,
  GLTFLoader,
  OBJLoader,
  VOXLoader
};

console.log('✅ Three.js + controls/loaders (from CDN) registered globally');
