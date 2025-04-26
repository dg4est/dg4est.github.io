/* ------------------------------------------------------------------ */
/*  File: assets/js/fluidsimviewer.js                                 */
/* ------------------------------------------------------------------ */
export function FluidSimViewer(containerId, modelPaths, options = {}) {
  /* ---------- mount point ---------- */
  const container = document.getElementById(containerId);
  if (!container) { console.error(`FluidSimViewer: “${containerId}” not found`); return; }

  /* ---------- THREE scene ---------- */
  const THREE = window.THREE;
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = options.cameraZ || 120;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const OC = window.ThreeModules.OrbitControls;
  if (typeof OC !== 'function') { console.error('OrbitControls missing'); return; }
  const controls = new OC(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.6));

  /* ---------- load STL frames ---------- */
  const loader = new window.ThreeModules.STLLoader();
  const templateMat = new THREE.MeshStandardMaterial({
    color: options.color || 0x1caaff,
    side : THREE.DoubleSide           // draw back faces so inverted normals show
  });

  const meshes = new Array(modelPaths.length);
  let loaded   = 0;

  modelPaths.forEach((file, idx) => {
    loader.load(
      file,
      geo => {
        const mesh = new THREE.Mesh(geo, templateMat.clone());
        geo.computeBoundingBox();
        geo.boundingBox.getCenter(mesh.position).negate();
        mesh.visible = false;
        scene.add(mesh);
        meshes[idx] = mesh;

        if (++loaded === modelPaths.length) {   // every frame ready
          (meshes.find(m => m) || mesh).visible = true; // show first real mesh
          fitCamera(geo);                       // zoom so the model is on-screen
          animate();
          play();
        }
      },
      undefined,
      err => console.error(`[FluidSimViewer] failed to load ${file}`, err)
    );
  });

  /* ---------- animation controls ---------- */
  let animationInterval = null;      // declare before play()

  function show(i) { meshes.forEach((m,k)=>m && (m.visible = k===i)); }

  function play() {
    if (animationInterval) return;   // already running
    let i = 0;
    animationInterval = setInterval(() => {
      i = (i + 1) % meshes.length;
      show(i);
    }, options.frameDelay || 150);
  }
  function pause() { clearInterval(animationInterval); animationInterval=null; }

  window.playFluid  = play;
  window.pauseFluid = pause;

  /* ---------- helpers ---------- */
  function fitCamera(geometry) {
    geometry.computeBoundingSphere();
    const r = geometry.boundingSphere.radius;
    camera.position.set(0, 0, r * 2.5);
    controls.target.set(0, 0, 0);
    controls.update();
  }

  /* ---------- render loop ---------- */
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  /* ---------- responsive resize ---------- */
  window.addEventListener('resize', () => {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}
window.FluidSimViewer = FluidSimViewer;
