/**********************************************************************
 * assets/js/topoShader.js
 * --------------------------------------------------------------------
 * A tiny GLSL shader that maps vertex height ( y ) → rainbow colours:
 *    blue → cyan → green → yellow → red.
 * We export:
 *   • topoShader      – the raw shader definition
 *   • makeTopoMaterial(minY,maxY) → THREE.ShaderMaterial
 *
 * The material is double-sided so STL files with flipped normals
 * still render.
 *********************************************************************/
import * as THREE from 'three';

/* GLSL + uniform bundle — we re-use this for every model            */
export const topoShader = {
  uniforms: {
    uMinY: { value: 0 },         // lowest vertex.y in the mesh
    uMaxY: { value: 1 }          // highest vertex.y in the mesh
  },
  /* Pass vertex.y to the fragment shader via vY                     */
  vertexShader: /* glsl */`
    varying float vY;
    void main(){
      vY = position.y;
      gl_Position = projectionMatrix *
                    modelViewMatrix *
                    vec4(position,1.0);
    }`,
  /* Height → rainbow colour ramp                                    */
  fragmentShader: /* glsl */`
    varying float vY;
    uniform float uMinY, uMaxY;

    /* simple HSV-ish rainbow (5 segments)                            */
    vec3 rainbow(float t){
      return clamp( abs(mod(t*5.0 + vec3(0,2,4), 10.0) - 5.0) - 1.0,
                    0.0, 1.0 );
    }

    void main(){
      float t = clamp( (vY - uMinY) / (uMaxY - uMinY), 0.0, 1.0 );
      gl_FragColor = vec4( rainbow(t), 1.0 );
    }`
};

/* Helper that locks the uniforms to minY / maxY for one mesh        */
export function makeTopoMaterial(minY, maxY){
  const mat = new THREE.ShaderMaterial(topoShader);
  mat.uniforms.uMinY.value = minY;
  mat.uniforms.uMaxY.value = maxY;
  mat.side = THREE.DoubleSide;          // show back-faces too
  return mat;
}
