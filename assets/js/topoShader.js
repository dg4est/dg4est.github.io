/* ------------------------------------------------------------------
 *  Simple “height → rainbow” shader
 * ------------------------------------------------------------------ */
import * as THREE from 'three';

export const topoShader = {
  uniforms: {
    uMinY: { value: 0 },
    uMaxY: { value: 1 }
  },
  vertexShader: /* glsl */`
    varying float vY;
    void main() {
      vY = position.y;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: /* glsl */`
    varying float vY;
    uniform float uMinY;
    uniform float uMaxY;

    /* maps 0-1 → blue-cyan-green-yellow-red */
    vec3 rainbow(float t){
      return clamp(abs(mod(t*5.0+vec3(0,2,4),10.0)-5.0)-1.0,0.0,1.0);
    }
    void main(){
      float t = clamp((vY-uMinY)/(uMaxY-uMinY),0.0,1.0);
      gl_FragColor = vec4(rainbow(t),1.0);
    }
  `
};

export function makeTopoMaterial(minY,maxY){
  const m = new THREE.ShaderMaterial(topoShader);
  m.uniforms.uMinY.value = minY;
  m.uniforms.uMaxY.value = maxY;
  return m;
}
