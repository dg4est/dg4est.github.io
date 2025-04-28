/**********************************************************************
 * assets/js/stl-viewer.js
 * --------------------------------------------------------------------
 * Renders ONE STL file inside the given container DIV or element id.
 * Adds OrbitControls, hemisphere + directional lights, optional ground
 * plane, and applies the rainbow height shader from topoShader.js
 * --------------------------------------------------------------------*/
import { makeTopoMaterial } from './topoShader.js';

/* global export so the wrapper can call window.STLViewer(..)        */
export function STLViewer(containerId, modelPath, options = {}) {

  /* --------- 1. Resolve container & basic renderer --------------- */
  const container = typeof containerId === 'string'
        ? document.getElementById(containerId)
        : containerId;
  if (!container){
    console.error(`STLViewer ➔ container “${containerId}” not found`);
    return;
  }

  const W = container.clientWidth  || 640;
  const H = container.clientHeight || 480;

  const THREE = window.THREE;                 // provided by init-three
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, W/H, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(W,H);
  container.appendChild(renderer.domElement);

  /* --------- 2. OrbitControls ------------------------------------ */
  const OC       = window.ThreeModules.OrbitControls;
  const controls = new OC(camera, renderer.domElement);
  controls.enableDamping = true;              // smoother interaction

  /* --------- 3. Lights (simple PBR) ------------------------------ */
  scene.add( new THREE.HemisphereLight(0xffffff, 0x444444, 0.45) );
  const dir = new THREE.DirectionalLight(0xffffff, 0.85);
  dir.position.set(100,100,100);
  scene.add(dir);

  /* optional ground plane for soft shadows or orientation cue       */
  if (options.ground !== false){
    const g = new THREE.Mesh(
      new THREE.PlaneGeometry(1000,1000),
      new THREE.ShadowMaterial({ opacity:0.15 })
    );
    g.rotation.x = -Math.PI/2;
    scene.add(g);
  }

  /* --------- 4. Load STL + shader material ----------------------- */
  const loader = new window.ThreeModules.STLLoader();
  loader.load(
    modelPath,
    geometry => {
      /* compute minY / maxY BEFORE we translate the mesh            */
      geometry.computeBoundingBox();
      const mat = makeTopoMaterial(
                    geometry.boundingBox.min.y,
                    geometry.boundingBox.max.y );

      const mesh = new THREE.Mesh(geometry, mat);
      mesh.castShadow    = options.shadows ?? false;
      mesh.receiveShadow = options.shadows ?? false;

      /* centre mesh on origin so camera framing is consistent        */
      const center = new THREE.Vector3();
      geometry.boundingBox.getCenter(center);
      mesh.position.sub(center);
      scene.add(mesh);

      /* auto-fit camera distance based on bounding-sphere radius     */
      geometry.computeBoundingSphere();
      const r = geometry.boundingSphere.radius;
      camera.position.set(0, 0, options.cameraZ ?? r * 2.5);
      controls.target.set(0,0,0);
      controls.update();

      animate();            // start render loop once model is ready
    },
    undefined,              // onProgress (not needed)
    err => console.error('STLViewer ➔ failed to load', modelPath, err)
  );

  /* --------- 5. Resize handler ----------------------------------- */
  window.addEventListener('resize', () => {
    const w = container.clientWidth  || 640;
    const h = container.clientHeight || 480;
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  });

  /* --------- 6. Animation / render loop -------------------------- */
  function animate(){
    requestAnimationFrame(animate);
    controls.update();
    window.THREE.__currentCamera = camera;   // share orientation with gizmo
    renderer.render(scene, camera);
  }
}
window.STLViewer = STLViewer;   // global for wrapper
