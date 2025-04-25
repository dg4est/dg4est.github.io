// File: assets/js/fluidsimviewer.js

export function FluidSimViewer(containerId, modelPaths, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID '${containerId}' not found.`);
    return;
  }

  // Use global THREE
  const THREE = window.THREE;

  let currentIndex = 0;
  const meshes = [];
  const totalFrames = modelPaths.length;
  const frameDelay = options.frameDelay || 150;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = options.cameraZ || 100;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  const controls = new window.ThreeModules.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const ambientLight = new THREE.AmbientLight(0x888888);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 100, 100);
  directionalLight.castShadow = true;

  scene.add(ambientLight);
  scene.add(directionalLight);

  const loader = new window.ThreeModules.STLLoader();
  const material = new THREE.MeshStandardMaterial({ color: options.color || 0x1caaff });

  modelPaths.forEach((path, index) => {
    loader.load(path, geometry => {
      geometry.computeBoundingBox();
      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.visible = false;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      geometry.boundingBox.getCenter(mesh.position).negate();
      scene.add(mesh);
      meshes[index] = mesh;

      if (meshes.filter(Boolean).length === totalFrames && index === totalFrames - 1) {
        document.getElementById("fluid-loading-message")?.remove();
        meshes[0].visible = true;
        animate();
        play();
      }
    });
  });
  // Begin render as soon as the last outstanding load completes
  let loadedCount = 0;
  loader.load(path, geometry => {
    /* … create mesh … */
    meshes[index] = mesh;
    loadedCount++;

    if (loadedCount === totalFrames) {        // ← start here
      document.getElementById("fluid-loading-message")?.remove();
      meshes[0].visible = true;
      animate();
      play();
    }
  });

  function showFrame(index) {
    meshes.forEach((m, i) => (m.visible = i === index));
  }

  let animationInterval = null;

  function play() {
    animationInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalFrames;
      showFrame(currentIndex);
    }, frameDelay);
  }

  function pause() {
    clearInterval(animationInterval);
  }

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  // Optional: Expose play/pause globally
  window.pauseFluid = pause;
  window.playFluid = play;
}
window.FluidSimViewer = FluidSimViewer; // export to a final window