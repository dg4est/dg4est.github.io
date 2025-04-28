/* ------------------------------------------------------------------ */
/*  File: assets/js/stl-viewer.js                                     */
/*  Exposes: window.STLViewer                                         */
/* ------------------------------------------------------------------ */
import { makeTopoMaterial } from './topoShader.js';

export function STLViewer(containerId, modelPath, options = {}) {

  /* ---------- 1  Mount & renderer --------------------------------- */
  const c = document.getElementById(containerId);
  if (!c) { console.error(`STLViewer ➔ container “${containerId}” not found`); return; }

  const w = c.clientWidth  || 640;
  const h = c.clientHeight || 480;

  const THREE = window.THREE;
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  c.appendChild(renderer.domElement);

  /* ---------- 2  OrbitControls ------------------------------------ */
  const OC = window.ThreeModules.OrbitControls;
  const controls = new OC(camera, renderer.domElement);
  controls.enableDamping = true;

  /* ---------- 3  Lights ------------------------------------------- */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.45));
  const dir = new THREE.DirectionalLight(0xffffff, 0.85);
  dir.position.set(100,100,100);
  scene.add(dir);

  if (options.ground !== false){
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1000,1000),
      new THREE.ShadowMaterial({ opacity:0.15 })
    );
    ground.rotation.x = -Math.PI/2;
    scene.add(ground);
  }

  /* ---------- 4  Load STL & apply topo shader --------------------- */
  const loader = new window.ThreeModules.STLLoader();
  loader.load(
    modelPath,
    geo => {
      geo.computeBoundingBox();
      const mat = makeTopoMaterial(geo.boundingBox.min.y,
                                   geo.boundingBox.max.y);

      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow    = options.shadows ?? false;
      mesh.receiveShadow = options.shadows ?? false;

      /* centre model */
      const center = new THREE.Vector3();
      geo.boundingBox.getCenter(center);
      mesh.position.sub(center);
      scene.add(mesh);

      /* auto-fit camera */
      geo.computeBoundingSphere();
      const r = geo.boundingSphere.radius;
      camera.position.set(0,0, options.cameraZ ?? r*2.5);
      controls.target.set(0,0,0);
      controls.update();

      animate();          // start the render loop once model is in scene
    },
    undefined,
    err => console.error('STLViewer ➔ failed to load', modelPath, err)
  );

  /* ---------- 5  Responsive resize [active listener] -------------------------------- */
  window.addEventListener('resize', () => {
    const W = c.clientWidth || 640, H = c.clientHeight || 480;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });

  /* ---------- 6  Render loop -------------------------------------- */
  function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
}
window.STLViewer = STLViewer;
