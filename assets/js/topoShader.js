/**********************************************************************
 * topoShader.js  —  depth-rainbow *with* lambert shading
 *********************************************************************/
import * as THREE from 'three';

/* ---------- raw GLSL program ------------------------------------- */
export const depthLambertShader = {
  uniforms: {
    uLightDir : { value: new THREE.Vector3(0.6, 0.7, 0.4).normalize() },
    uMinD     : { value: 1.0 },
    uMaxD     : { value: 10.0 }
  },

  vertexShader: /* glsl */`
    varying float vDepth;
    varying vec3  vNormal;

    void main(){
      vec4 viewPos = modelViewMatrix * vec4(position,1.0);
      vDepth  = -viewPos.z;            /* camera-space Z, positive fwd */
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * viewPos;
    }`,

  fragmentShader: /* glsl */`
    varying float vDepth;
    varying vec3  vNormal;

    uniform vec3  uLightDir;
    uniform float uMinD, uMaxD;

    /* rainbow ramp: blue→red */
    vec3 rainbow(float t){
      return clamp(abs(mod(t*5.0 + vec3(0,2,4),10.0)-5.0)-1.0,0.0,1.0);
    }

    void main(){
      /* 1) depth → rainbow colour                                    */
      float t = clamp( (vDepth - uMinD) / (uMaxD - uMinD), 0.0, 1.0 );
      vec3  baseCol = rainbow(t);

      /* 2) simple lambert                                             */
      float lambert = max(dot( normalize(uLightDir), normalize(vNormal) ), 0.0);

      gl_FragColor = vec4(baseCol * lambert, 1.0);
    }`
};

/* ---------- helper: build material with *local* min/max depth ---- */
export function makeDepthMaterial(geometry){
  /* compute depth range in the mesh’s own view (assumes it has
     been positioned already)                                         */
  let minD =  1e9;
  let maxD = -1e9;

  const pos = geometry.attributes.position;
  const m   = new THREE.Matrix4();
  geometry.computeBoundingSphere();          /* ensures matrixWorld up-to-date */

  for (let i=0; i<pos.count; i++){
    const v = new THREE.Vector3().fromBufferAttribute(pos,i).applyMatrix4(m);
    minD = Math.min(minD, -v.z);
    maxD = Math.max(maxD, -v.z);
  }

  const mat = new THREE.ShaderMaterial(depthLambertShader);
  mat.uniforms.uMinD.value = minD;
  mat.uniforms.uMaxD.value = maxD;
  mat.side = THREE.DoubleSide;
  return mat;
}
