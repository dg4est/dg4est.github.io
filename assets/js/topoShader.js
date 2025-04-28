/**********************************************************************
 *  Depth-rainbow shader  +  factory that never crashes               *
 *  - If geometry is a BufferGeometry → samples every vertex position *
 *  - Otherwise                    → uses bounding-sphere as fallback *
 *********************************************************************/
import * as THREE from 'three';

/* ---------- glsl program ----------------------------------------- */
export const depthShader = {
  uniforms : {
    uMinD : { value : 1.0 },
    uMaxD : { value : 10.0 },
    uLight: { value : new THREE.Vector3(0.6,0.7,0.4).normalize() }
  },

  vertexShader : /* glsl */`
    varying float vDepth;
    varying vec3  vNormal;
    void main(){
      vec4 viewPos = modelViewMatrix * vec4(position,1.0);
      vDepth  = -viewPos.z;                   /* camera-space depth  */
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * viewPos;
    }`,

  fragmentShader : /* glsl */`
    varying float vDepth;
    varying vec3  vNormal;

    uniform float uMinD, uMaxD;
    uniform vec3  uLight;

    /* blue-cyan-green-yellow-red ramp */
    vec3 rainbow(float t){
      return clamp(abs(mod(t*5.0 + vec3(0,2,4),10.0)-5.0)-1.0,0.0,1.0);
    }

    void main(){
      float t = clamp((vDepth - uMinD) / (uMaxD - uMinD), 0.0, 1.0);
      vec3  col = rainbow(t);

      /* simple lambert shading */
      float diff = max(dot(normalize(uLight), normalize(vNormal)), 0.15);
      gl_FragColor = vec4(col * diff, 1.0);
    }`
};


/* ---------- safe factory ----------------------------------------- *
 *  makeDepthMaterial( geometry ) : ShaderMaterial                    *
 * ------------------------------------------------------------------ */
export function makeDepthMaterial(geometry){
  /* ----- compute per-mesh depth range (fallback if needed) ------- */
  let minD =  1e9;
  let maxD = -1e9;

  if (geometry.isBufferGeometry && geometry.attributes.position){

    /* sample every vertex (works for BufferGeometry) */
    const pos = geometry.attributes.position;
    const v   = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++){
      v.fromBufferAttribute(pos, i);
      minD = Math.min(minD, -v.z);
      maxD = Math.max(maxD, -v.z);
    }

  } else if (geometry.boundingSphere || geometry.computeBoundingSphere){

    /* fallback: use bounding-sphere radius */
    geometry.computeBoundingSphere?.();
    const r = geometry.boundingSphere.radius;
    minD = 0.0;
    maxD = r * 2.0;

  } else {
    /* absolute fallback — avoid div/0 in shader */
    minD = 0.0;
    maxD = 1.0;
  }

  /* ----- material instance -------------------------------------- */
  const mat = new THREE.ShaderMaterial(depthShader);
  mat.uniforms.uMinD.value = minD;
  mat.uniforms.uMaxD.value = maxD;
  mat.side = THREE.DoubleSide;
  return mat;
}
