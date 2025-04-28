/* ------------------------------------------------------------------ */
/*  File: assets/js/fluidsimviewer.js                                 */
/*  Exposes: window.FluidSimViewer                                    */
/* ------------------------------------------------------------------ */
import { makeTopoMaterial } from './topoShader.js';

export function FluidSimViewer(containerId, modelPaths, options = {}) {

  /* ---------- 1. Mount-point -------------------------------------- */
  const container = document.getElementById(containerId);
  if (!container) { console.error(`FluidSimViewer: “${containerId}” not found`); return; }

  /* ---------- 2. THREE scene + renderer --------------------------- */
  const THREE = window.THREE;
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,      // near
    1000      // far – may expand in fitCamera()
  );
  camera.position.z = options.cameraZ || 120;

  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const OC = window.ThreeModules.OrbitControls;
  if (typeof OC !== 'function') { console.error('OrbitControls missing'); return; }
  const controls = new OC(camera, renderer.domElement);
  controls.enableDamping = true;

  /* lights */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(100,100,100);
  scene.add(dir);

  /* ---------- 3. Load STL frames ---------------------------------- */
  const loader = new window.ThreeModules.STLLoader();

  let   topoMat   = null;                  // will build after first frame arrives
  const meshes    = new Array(modelPaths.length);
  let   loadedCnt = 0;

  modelPaths.forEach((file, idx) => {
    loader.load(
      file,
      geo => {
        /* build the shader material on first arrival */
        if (!topoMat){
          geo.computeBoundingBox();
          topoMat = makeTopoMaterial(geo.boundingBox.min.y,
                                     geo.boundingBox.max.y);
        }

        const mesh = new THREE.Mesh(geo, topoMat.clone());
        geo.computeBoundingBox();
        geo.boundingBox.getCenter(mesh.position).negate();
        mesh.visible = false;
        scene.add(mesh);
        meshes[idx] = mesh;

        /* when every frame loaded, start animation */
        if (++loadedCnt === modelPaths.length) {
          (meshes.find(m=>m) || mesh).visible = true;   // first real mesh
          fitCamera(geo);
          animate();
          play();
        }
      },
      undefined,
      err => console.error(`[FluidSimViewer] failed to load ${file}`, err)
    );
  });

  /* ---------- 4. Animation controls ------------------------------- */
  let animationInterval = null;           // declared before play()

  function show(i){ meshes.forEach((m,k)=>m && (m.visible = k === i)); }

  function play(){
    if (animationInterval) return;
    let i = 0;
    animationInterval = setInterval(()=>{
      i = (i + 1) % meshes.length;
      show(i);
    }, options.frameDelay || 150);
  }
  function pause(){ clearInterval(animationInterval); animationInterval=null; }

  window.playFluid  = play;
  window.pauseFluid = pause;

  /* ---------- 5. Auto-fit camera ---------------------------------- */
  function fitCamera(geometry){
    geometry.computeBoundingSphere();
    const r = geometry.boundingSphere.radius;
    const z = r * 2.5;
    camera.position.set(0,0,z);

    if (z > camera.far*0.9){
      camera.far = z*2;
      camera.updateProjectionMatrix();
    }
    controls.target.set(0,0,0);
    controls.update();
  }

  /* ---------- 6. Render loop -------------------------------------- */
  function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);
  }

  /* ---------- 7. Responsive resize -------------------------------- */
  window.addEventListener('resize', ()=>{
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  });
}

/* expose for wrapper */
window.FluidSimViewer = FluidSimViewer;
