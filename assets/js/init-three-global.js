// File: assets/js/init-three-global.js
import * as THREE from '/assets/js/threejs/three.module.js';

import { OrbitControls } from '/assets/js/threejs/controls/OrbitControls.js';
import { ArcballControls } from '/assets/js/threejs/controls/ArcballControls.js';
import { DragControls } from '/assets/js/threejs/controls/DragControls.js';
import { FirstPersonControls } from '/assets/js/threejs/controls/FirstPersonControls.js';
import { FlyControls } from '/assets/js/threejs/controls/FlyControls.js';
import { MapControls } from '/assets/js/threejs/controls/MapControls.js';
import { PointerLockControls } from '/assets/js/threejs/controls/PointerLockControls.js';
import { TrackballControls } from '/assets/js/threejs/controls/TrackballControls.js';
import { TransformControls } from '/assets/js/threejs/controls/TransformControls.js';

import { STLLoader } from '/assets/js/threejs/loaders/STLLoader.js';
import { ThreeDMLoader } from '/assets/js/threejs/loaders/3DMLoader.js';
import { ThreeMFLoader } from '/assets/js/threejs/loaders/3MFLoader.js';
import { GLTFLoader } from '/assets/js/threejs/loaders/GLTFLoader.js';
import { OBJLoader } from '/assets/js/threejs/loaders/OBJLoader.js';
import { VOXLoader } from '/assets/js/threejs/loaders/VOXLoader.js';

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

console.log("Three.js and all modules are globally registered.");
