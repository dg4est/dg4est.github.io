/* ------------------------------------------------------------------ */
/*  File: assets/js/fluidsimviewer.js                                 */
/*  Exposes: window.FluidSimViewer                                    */
/* ------------------------------------------------------------------ */
export function FluidSimViewer(containerId, modelPaths, options = {}) {
  /* ---------- 1  Mount-point ---------- */
  const container = document.getElementById(containerId);
  if (!container) { console.error(`FluidSimViewer: “${containerId}” not found`); return; }

  /* ---------- 2  THREE scene + renderer ---------- */
  const THREE  = window.THREE;
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
  if (typeof OC !== 'function') {
    console.error('FluidSimViewer: OrbitControls not available'); return;
  }
  const controls = new OC(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.6));

  /* ---------- 3  Load all STL frames ---------- */
  const loader   = new window.ThreeModules.STLLoader();
  const material = new THREE.MeshStandardMaterial({ color: options.color || 0x1caaff });

  const meshes = new Array(modelPaths.length);
  let loaded   = 0;

  modelPaths.forEach((file, idx) => {
    loader.load(
      file,
      geo => {
        const mesh = new THREE.Mesh(geo, material.clone());
        geo.computeBoundingBox();
        geo.boundingBox.getCenter(mesh.position).negate();
        mesh.visible = false;
        scene.add(mesh);
        meshes[idx] = mesh;

        if (++loaded === modelPaths.length) {        // everything ready
          meshes[0].visible = true;
          animate();
          play();
        }
      },
      undefined,
      err => console.error(`[FluidSimViewer] failed to load ${file}`, err)
    );
  });

  /* ---------- 4  Animation controls ---------- */
  let animationInterval = null;                      // declared *before* play()

  function showFrame(i) { meshes.forEach((m, k) => (m.visible = k === i)); }

  function play() {
    if (animationInterval) return;                   // already running
    let i = 0;
    animationInterval = setInterval(() => {
      i = (i + 1) % meshes.length;
      showFrame(i);
    }, options.frameDelay || 150);
  }

  function pause() {
    clearInterval(animationInterval);
    animationInterval = null;
  }

  window.playFluid  = play;
  window.pauseFluid = pause;

  /* ---------- 5  Render loop ---------- */
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  /* ---------- 6  Responsive resize ---------- */
  window.addEventListener('resize', () => {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

/* expose for FlowVisualization wrapper */
window.FluidSimViewer = FluidSimViewer;
