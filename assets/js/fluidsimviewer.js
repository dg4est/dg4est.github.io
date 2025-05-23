/**********************************************************************
 * MULTI-FRAME STL ANIMATION VIEWER                                  *
 * Shows 1…N frames, rainbow shader, play / pause API.               *
 *********************************************************************/
import { makeDepthMaterial} from './topoShader.js';

export function FluidSimViewer(containerId, modelPaths, options = {}) {
  /* ---------- 1. Mount-point & renderer -------------------------- */
  const el = document.getElementById(containerId);
  if (!el) { console.error(`FluidSimViewer: “${containerId}” not found`); return; }

  const THREE   = window.THREE;
  const scene   = new THREE.Scene();
  const camera  = new THREE.PerspectiveCamera(
                    75, el.clientWidth / el.clientHeight, 0.1, 1000);
  camera.position.z = options.cameraZ || 120;

  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(el.clientWidth, el.clientHeight);
  el.appendChild(renderer.domElement);

  const controls = new window.ThreeModules.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  /* lights -------------------------------------------------------- */
  /* very low-level ambient so nothing is pitch-black */
  scene.add(new THREE.AmbientLight(0xffffff, 0.15));

  /* cool sky / warm ground tint */
  scene.add(new THREE.HemisphereLight(0xb1e1ff, 0x444422, 0.35));

  /* key light – warm, 45° overhead */
  const key = new THREE.DirectionalLight(0xfff2e5, 0.9);
  key.position.set(7, 10, 5);
  scene.add(key);

  /* fill light – cool, opposite side, softer */
  const fill = new THREE.DirectionalLight(0xccddff, 0.4);
  fill.position.set(-6, 4, -4);
  scene.add(fill);

  /* rim light – bright edge highlight from behind */
  const rim = new THREE.DirectionalLight(0xffffff, 0.6);
  rim.position.set(0, 5, -10);
  scene.add(rim);

  /* ---------- 2. Load frames ------------------------------------- */
  const loader   = new window.ThreeModules.STLLoader();
  let   topoMat  = null;                     // built after first frame
  const meshes   = new Array(modelPaths.length);
  let   loaded   = 0;

  modelPaths.forEach((file, idx)=>{
    loader.load(
      file,
      geo =>{
        /* build rainbow shader material once --------------------- */
        if (!topoMat){
          geo.computeBoundingBox();
          topoMat = makeDepthMaterial(geo.boundingBox.min.y,
                                     geo.boundingBox.max.y);
        }
        const mesh = new THREE.Mesh(geo, topoMat.clone());
        /* recentre                                                 */
        geo.computeBoundingBox();
        const c=new THREE.Vector3(); geo.boundingBox.getCenter(c);
        mesh.position.sub(c);
        mesh.visible = false;
        scene.add(mesh);
        meshes[idx] = mesh;

        if (++loaded === modelPaths.length){
          /* all frames ready — start animation                    */
          (meshes.find(m=>m) || mesh).visible = true;
          fitCamera(geo);
          animate();
          play();
        }
      },
      undefined,
      e=>console.error('Frame load error', file, e)
    );
  });

  /* ---------- 3. Play / pause ------------------------------------ */
  let timer = null;
  function show(i){meshes.forEach((m,k)=>m&&(m.visible=k===i));}
  function play(){ if(timer) return;
    let i=0; timer=setInterval(()=>{i=(i+1)%meshes.length;show(i);},
                               options.frameDelay||150); }
  function pause(){ clearInterval(timer); timer=null; }
  window.playFluid = play;  window.pauseFluid = pause;

  /* ---------- 4. Auto-fit camera --------------------------------- */
  function fitCamera(geometry){
    geometry.computeBoundingSphere();
    const r = geometry.boundingSphere.radius;
    const z = r*2.5; camera.position.set(0,0,z);
    if (z > camera.far*0.9){ camera.far = z*2; camera.updateProjectionMatrix();}
    controls.target.set(0,0,0); controls.update();
  }

  /* ---------- 5. Render loop ------------------------------------- */
  function animate(){
    requestAnimationFrame(animate);
    controls.update();
    window._fvCam = camera;          // <— share for gizmo
    renderer.render(scene,camera);
  }

  /* ---------- 6. Resize ------------------------------------------ */
  window.addEventListener('resize',()=>{
    const w=el.clientWidth,h=el.clientHeight;
    camera.aspect=w/h; camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  });
}
window.FluidSimViewer = FluidSimViewer;
