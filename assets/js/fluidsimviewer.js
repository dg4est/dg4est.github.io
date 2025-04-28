/**********************************************************************
 * assets/js/fluidsimviewer.js
 * --------------------------------------------------------------------
 * Plays a sequence of STL frames (1 … n) as an animation.
 * Adds play/pause API, OrbitControls, lights, auto-fit, and uses the
 * rainbow topographic shader from topoShader.js.
 *********************************************************************/
import { makeTopoMaterial } from './topoShader.js';

export function FluidSimViewer(containerId, modelPaths, options = {}) {

  /* ---------- 1. Mount-point + renderer -------------------------- */
  const container = document.getElementById(containerId);
  if (!container){ console.error(`FluidSimViewer: “${containerId}” not found`); return; }

  const THREE   = window.THREE;
  const scene   = new THREE.Scene();
  const camera  = new THREE.PerspectiveCamera(
                    75,
                    container.clientWidth / container.clientHeight,
                    0.1, 1000);
  camera.position.z = options.cameraZ || 120;

  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const OC = window.ThreeModules.OrbitControls;
  const controls = new OC(camera, renderer.domElement);
  controls.enableDamping = true;

  /* simple two-light rig ------------------------------------------ */
  scene.add( new THREE.HemisphereLight(0xffffff,0x444444,0.6) );
  const dl = new THREE.DirectionalLight(0xffffff,0.8);
  dl.position.set(100,100,100); scene.add(dl);

  /* ---------- 2. Load every STL frame ---------------------------- */
  const loader   = new window.ThreeModules.STLLoader();
  let   topoMat  = null;                 // built from first frame’s y-range
  const meshes   = new Array(modelPaths.length);
  let   loaded   = 0;                    // counter

  modelPaths.forEach((file, idx) => {
    loader.load(
      file,
      geo => {
        /* create shader material exactly once -------------------- */
        if (!topoMat){
          geo.computeBoundingBox();
          topoMat = makeTopoMaterial(
                      geo.boundingBox.min.y,
                      geo.boundingBox.max.y );
        }

        const mesh = new THREE.Mesh(geo, topoMat.clone());
        geo.computeBoundingBox();
        const cen = new THREE.Vector3();
        geo.boundingBox.getCenter(cen);
        mesh.position.sub(cen);
        mesh.visible = false;
        scene.add(mesh);
        meshes[idx] = mesh;

        /* when all frames ready, start animation ---------------- */
        if (++loaded === modelPaths.length){
          (meshes.find(m=>m) || mesh).visible = true;
          fitCamera(geo);
          animate();
          play();
        }
      },
      undefined,
      err => console.error('[FluidSimViewer] load error', file, err)
    );
  });

  /* ---------- 3. Play / pause API ------------------------------- */
  let interval = null;

  function show(i){ meshes.forEach((m,k)=>m && (m.visible = k===i)); }

  function play(){
    if (interval) return;
    let i = 0;
    interval = setInterval(()=>{
      i = (i + 1) % meshes.length;
      show(i);
    }, options.frameDelay || 150);
  }
  function pause(){ clearInterval(interval); interval=null; }

  window.playFluid  = play;
  window.pauseFluid = pause;

  /* ---------- 4. Auto-fit & far-plane expansion ----------------- */
  function fitCamera(geometry){
    geometry.computeBoundingSphere();
    const r = geometry.boundingSphere.radius;
    const z = r * 2.5;
    camera.position.set(0,0,z);
    if (z > camera.far * 0.9){
      camera.far = z * 2;
      camera.updateProjectionMatrix();
    }
    controls.target.set(0,0,0); controls.update();
  }

  /* ---------- 5. Render loop ------------------------------------ */
  function animate(){
    requestAnimationFrame(animate);
    controls.update();
    THREE.__currentCamera = camera;      // share for gizmo
    renderer.render(scene, camera);
  }

  /* ---------- 6. Resize handling -------------------------------- */
  window.addEventListener('resize',()=>{
    const w=container.clientWidth, h=container.clientHeight;
    camera.aspect = w/h; camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  });
}
window.FluidSimViewer = FluidSimViewer;
