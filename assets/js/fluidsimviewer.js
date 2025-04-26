/* ------------------------------------------------------------------ */
/*  File: assets/js/fluidsimviewer.js                                 */
/*  Exposes: window.FluidSimViewer                                    */
/* ------------------------------------------------------------------ */
export function FluidSimViewer(containerId, modelPaths, options = {}) {
  /* ---------- 1  Mount-point ---------- */
  const container = document.getElementById(containerId);
  if (!container) { console.error(`FluidSimViewer: “${containerId}” not found`); return; }

  /* ---------- 2  THREE scene & renderer ---------- */
  const THREE = window.THREE;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,          // near
    1000          // far   (will expand in fitCamera if needed)
  );
  camera.position.z = options.cameraZ || 120;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const OC = window.ThreeModules.OrbitControls;
  if (typeof OC !== 'function') { console.error('OrbitControls missing'); return; }
  const controls = new OC(camera, renderer.domElement);
  controls.enableDamping = true;

  /* lights */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);   // NEW: gives stronger shading
  dir.position.set(100, 100, 100);
  scene.add(dir);

  /* ---------- 3  Load all STL frames ---------- */
  const loader = new window.ThreeModules.STLLoader();
  const templateMat = new THREE.MeshStandardMaterial({
    color : options.color || 0x1caaff,
    side  : THREE.DoubleSide       // draw back faces → visible even if normals flipped
  });

  const meshes = new Array(modelPaths.length);
  let   loaded = 0;

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

        /* start once every frame is ready */
        if (++loaded === modelPaths.length) {
          (meshes.find(m => m) || mesh).visible = true;
          fitCamera(geo);          // NEW: auto-fit & adjust camera.far
          animate();
          play();
        }
      },
      undefined,
      err => console.error(`[FluidSimViewer] failed to load ${file}`, err)
    );
  });

  /* ---------- 4  Animation controls ---------- */
  let animationInterval = null;          // declare BEFORE play()

  function show(i) { meshes.forEach((m, k) => (m && (m.visible = k === i))); }

  function play() {
    if (animationInterval) return;       // already playing
    let i = 0;
    animationInterval = setInterval(() => {
      i = (i + 1) % meshes.length;
      show(i);
    }, options.frameDelay || 150);
  }

  function pause() { clearInterval(animationInterval); animationInterval = null; }

  window.playFluid  = play;
  window.pauseFluid = pause;

  /* ---------- 5  Auto-fit camera ---------- */
  function fitCamera(geometry) {
    geometry.computeBoundingSphere();
    const r = geometry.boundingSphere.radius;
    const z = r * 2.5;

    camera.position.set(0, 0, z);

    /* push far-plane out if object is huge */
    if (z > camera.far * 0.9) {
      camera.far = z * 2;
      camera.updateProjectionMatrix();
    }

    controls.target.set(0, 0, 0);
    controls.update();
  }

  /* ---------- 6  Render loop ---------- */
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  /* ---------- 7  Responsive resize ---------- */
  window.addEventListener('resize', () => {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

/* expose for FlowVisualization wrapper */
window.FluidSimViewer = FluidSimViewer;
