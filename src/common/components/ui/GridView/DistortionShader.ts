import * as THREE from 'three';

export const DistortionShader = {
  uniforms: {
    tDiffuse: { value: null },
    distortion: { value: new THREE.Vector2(0, 0) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 distortion;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      vec2 center = uv - 0.5;
      // Mercek bükülmesi formülü
      float dist = dot(center, center);
      uv = uv + center * dist * distortion;
      
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        discard; // Kenarları kes
      }
      gl_FragColor = texture2D(tDiffuse, uv);
    }
  `
};