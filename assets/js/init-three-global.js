/**
 * assets/js/init-three-global.js
 * ---------------------------------------------------------------------
 * Loads the ES-module build of Three.js plus a handful of controls /
 * loaders, then exposes them as easy-access globals so you can keep the
 * rest of your code in simple `<script>` files (or inline markdown tags)
 * without worrying about ESM import paths.
 *
 * Usage in HTML (must be type="module" so the imports work):
 * <script type="module" src="{{ '/assets/js/init-three-global.js' | relative_url }}"></script>
 *
 * Any script *after* that tag can rely on:
 *   window.THREE              -> Three core
 *   window.ThreeModules.*     -> OrbitControls, STLLoader, …
 * ---------------------------------------------------------------------
 */

/* ---------- core Three.js ---------- */
import * as THREE from './threejs/three.module.js';

/* ---------- Controls ---------- */
import { OrbitControls }       from './threejs/controls/OrbitControls.js';
import { ArcballControls }     from './threejs/controls/ArcballControls.js';
import { DragControls }        from './threejs/controls/DragControls.js';
import { FirstPersonControls } from './threejs/controls/FirstPersonControls.js';
import { FlyControls }         from './threejs/controls/FlyControls.js';
import { MapControls }         from './threejs/controls/MapControls.js';
import { PointerLockControls } from './threejs/controls/PointerLockControls.js';
import { TrackballControls }   from './threejs/controls/TrackballControls.js';
import { TransformControls }   from './threejs/controls/TransformControls.js';

/* ---------- Loaders ---------- */
import { STLLoader }      from './threejs/loaders/STLLoader.js';
import { ThreeDMLoader }  from './threejs/loaders/3DMLoader.js';
import { ThreeMFLoader }  from './threejs/loaders/3MFLoader.js';
import { GLTFLoader }     from './threejs/loaders/GLTFLoader.js';
import { OBJLoader }      from './threejs/loaders/OBJLoader.js';
import { VOXLoader }      from './threejs/loaders/VOXLoader.js';

/* ---------- expose globally ---------- */
window.THREE = THREE;
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
  ThreeDMLoader,
  ThreeMFLoader,
  GLTFLoader,
  OBJLoader,
  VOXLoader,
};

console.log('✅ Three.js and helper modules registered globally');