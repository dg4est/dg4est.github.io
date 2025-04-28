/**********************************************************************
 * assets/js/topoShader.js
 * --------------------------------------------------------------------
 * “Depth-to-Rainbow” shader
 * --------------------------------------------------------------------
 * Converts camera-space depth (near → far) to a rainbow:
 *      blue → cyan → green → yellow → red.
 *
 * Exported helpers:
 *   • depthShader………… raw shader object (vertex + fragment)
 *   • makeDepthMaterial(camera) → ShaderMaterial
 *       - binds camera.near / camera.far so the colour range matches
 *         the active camera.
 *
 * The material is double-sided so STL files with flipped normals
 * still render.
 *********************************************************************/
import * as THREE from 'three';

/* ---------- raw shader definition -------------------------------- */
export const depthShader = {
  uniforms: {
    uNear : { value: 0.1 },        // camera.near  (filled in later)
    uFar  : { value: 1000.0 }      // camera.far
  },

  /* Pass view-space Z (positive forward) to the fragment shader.     */
  vertexShader: /* glsl */`
    varying float vDepth;
    void main() {
      vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
      vDepth = -viewPos.z;                 // depth always positive
      gl_Position = projectionMatrix * viewPos;
    }`,

  /* Simple 5-segment rainbow ramp                                    */
  fragmentShader: /* glsl */`
    varying float vDepth;
    uniform float uNear, uFar;

    vec3 rainbow(float t){             // t in 0-1
      return clamp(abs(mod(t*5.0 + vec3(0,2,4),10.0) - 5.0) - 1.0,
                   0.0, 1.0);
    }

    void main() {
      float t = clamp((vDepth - uNear) / (uFar - uNear), 0.0, 1.0);
      gl_FragColor = vec4(rainbow(t), 1.0);
    }`
};

/* ---------- convenience factory ---------------------------------- */
export function makeDepthMaterial(camera){
  const mat = new THREE.ShaderMaterial(depthShader);
  mat.uniforms.uNear.value = camera.near;
  mat.uniforms.uFar.value  = camera.far;
  mat.side = THREE.DoubleSide;           // render back-faces too
  return mat;
}
