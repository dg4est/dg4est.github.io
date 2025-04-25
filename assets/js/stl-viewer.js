// File: assets/js/STLViewer.js
export function STLViewer(containerId, modelPath, options = {}) {
  /* ------------------------------------------------------------------ */
  /* 1.  Basic bootstrap & renderer                                      */
  /* ------------------------------------------------------------------ */
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`STLViewer ➔ container “${containerId}” not found`);
    return;
  }

  const width  = container.clientWidth  || 640;
  const height = container.clientHeight || 480;

  // THREE is exposed globally by your layout
  const THREE = window.THREE;
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  /* ------------------------------------------------------------------ */
  /* 2.  OrbitControls (also on window.ThreeModules)                     */
  /* ------------------------------------------------------------------ */
  const controls = new window.ThreeModules.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  /* ------------------------------------------------------------------ */
  /* 3.  Lighting + optional ground plane                                */
  /* ------------------------------------------------------------------ */
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.45);
  hemiLight.position.set(0, 200, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
  dirLight.position.set(100, 100, 100);
  scene.add(dirLight);

  if (options.ground !== false) {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.ShadowMaterial({ opacity: 0.15 })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
  }

  /* ------------------------------------------------------------------ */
  /* 4.  Load STL, centre mesh, auto-frame camera                        */
  /* ------------------------------------------------------------------ */
  const loader   = new window.ThreeModules.STLLoader();
  const material = new THREE.MeshStandardMaterial({
    color: options.color || 0x0077be,
    metalness: 0.3,
    roughness: 0.5
  });

  loader.load(
    modelPath,
    geometry => {
      // Mesh creation
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow    = options.shadows ?? false;
      mesh.receiveShadow = options.shadows ?? false;

      // Centre the geometry on (0,0,0)
      geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      geometry.boundingBox.getCenter(center);
      mesh.position.sub(center);

      scene.add(mesh);

      // Auto-fit: move camera back so entire model is visible
      geometry.computeBoundingSphere();
      const r = geometry.boundingSphere.radius;
      const z = options.cameraZ ?? r * 2.5;      // fallback if user didn’t pass cameraZ
      camera.position.set(0, 0, z);
      controls.target.set(0, 0, 0);
      controls.update();
    },
    undefined,          // onProgress — not needed
    err => console.error('STLViewer ➔ failed to load', modelPath, err)
  );

  /* ------------------------------------------------------------------ */
  /* 5.  Handle resizes                                                  */
  /* ------------------------------------------------------------------ */
  window.addEventListener('resize', () => {
    const w = container.clientWidth  || 640;
    const h = container.clientHeight || 480;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  /* ------------------------------------------------------------------ */
  /* 6.  Animation loop                                                 */
  /* ------------------------------------------------------------------ */
  (function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  })();
}
window.STLViewer = STLViewer; // added to present a final render window