// assets/js/fluidsimviewer.js
export function FluidSimViewer(containerId, modelPaths, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container '${containerId}' not found`);
    return;
  }

  /* ---------- THREE.js scene boilerplate ---------- */
  const THREE = window.THREE;
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = options.cameraZ || 120;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new window.ThreeModules.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.6));

  /* ---------- load STL frames ---------- */
  const loader  = new window.ThreeModules.STLLoader();
  const materialTemplate = new THREE.MeshStandardMaterial({ color: options.color || 0x1caaff });

  const meshes = new Array(modelPaths.length);
  let loaded   = 0;

  modelPaths.forEach((file, idx) => {
    loader.load(
      file,
      geo => {
        const mesh = new THREE.Mesh(geo, materialTemplate.clone());
        geo.computeBoundingBox();
        geo.boundingBox.getCenter(mesh.position).negate();
        mesh.visible = false;
        scene.add(mesh);
        meshes[idx] = mesh;

        if (++loaded === modelPaths.length) {
          meshes[0].visible = true;
          animate();
          play();
        }
      },
      undefined,
      err => console.error(`[FluidSimViewer] failed to load ${file}`, err)
    );
  });

  /* ---------- animation controls ---------- */
  let animationInterval = null;   //  ← declare before play/pause use it

  function showFrame(i) { meshes.forEach((m, k) => (m.visible = k === i)); }

  function play() {
    if (animationInterval) return;               // already playing
    let index = 0;
    animationInterval = setInterval(() => {
      index = (index + 1) % meshes.length;
      showFrame(index);
    }, options.frameDelay || 150);
  }

  function pause() {
    clearInterval(animationInterval);
    animationInterval = null;
  }

  window.playFluid  = play;
  window.pauseFluid = pause;

  /* ---------- render loop ---------- */
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  /* ---------- resize handling ---------- */
  window.addEventListener('resize', () => {
    const { clientWidth: w, clientHeight: h } = container;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}
