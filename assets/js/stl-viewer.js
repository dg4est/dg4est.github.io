/**********************************************************************
 * ONE-OFF STL VIEWER                                                *
 * Uses orbit controls, auto-fit camera and rainbow height shader.   *
 *********************************************************************/
import { makeDepthMaterial } from './topoShader.js';

export function STLViewer(containerId, modelPath, options = {}) {
  /* ---------- 1. Container & renderer ---------------------------- */
  const el = typeof containerId === 'string'
           ? document.getElementById(containerId)
           : containerId;
  if (!el) { console.error(`STLViewer: “${containerId}” not found`); return; }

  const W = el.clientWidth  || 640;
  const H = el.clientHeight || 480;

  const THREE    = window.THREE;
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(W, H);
  el.appendChild(renderer.domElement);

  /* ---------- 2. OrbitControls ----------------------------------- */
  const controls = new window.ThreeModules.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  /* ---------- 3. Lights ------------------------------------------ */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.45));
  const sun = new THREE.DirectionalLight(0xffffff, 0.85);
  sun.position.set(100,100,100);
  scene.add(sun);

  /* optional ground plane ----------------------------------------- */
  if (options.ground !== false){
    const g = new THREE.Mesh(
      new THREE.PlaneGeometry(1000,1000),
      new THREE.ShadowMaterial({ opacity:0.15 })
    );
    g.rotation.x = -Math.PI/2;
    scene.add(g);
  }

  /* ---------- 4. Load STL, build topographic material ------------ */
  const loader = new window.ThreeModules.STLLoader();
  loader.load(
    modelPath,
    geo => {
      /* compute y-range BEFORE recentring                            */
      geo.computeBoundingBox();
      const mat = makeDepthMaterial(geo.boundingBox.min.y,
                                   geo.boundingBox.max.y);

      const mesh = new THREE.Mesh(geo, mat);
      /* recenter mesh                                                */
      const centre=new THREE.Vector3();
      geo.boundingBox.getCenter(centre);
      mesh.position.sub(centre);
      scene.add(mesh);

      /* auto-fit camera                                              */
      geo.computeBoundingSphere();
      const r = geo.boundingSphere.radius;
      camera.position.set(0,0, options.cameraZ ?? r*2.5);
      controls.target.set(0,0,0);
      controls.update();

      animate();          // start loop once model ready
    },
    undefined,
    err => console.error('STLViewer load error', err)
  );

  /* ---------- 5. Responsive resize ------------------------------- */
  window.addEventListener('resize', ()=>{
    const w=el.clientWidth||640, h=el.clientHeight||480;
    camera.aspect=w/h; camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  });

  /* ---------- 6. Render loop ------------------------------------- */
  function animate(){
    requestAnimationFrame(animate);
    controls.update();
    window._fvCam = camera;          // <— share for gizmo
    renderer.render(scene,camera);
  }
}
window.STLViewer = STLViewer;
