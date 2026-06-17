import * as THREE from "three";

export const TRAIL_LENGTH = 40;

export function createFluidUniforms(paramsConfig) {
  return {
    uTime: { value: 0 },
    uTrailPositions: { value: new Array(TRAIL_LENGTH).fill(null).map(() => new THREE.Vector3(1000, 1000, 1000)) },
    uTrailIntensities: { value: new Array(TRAIL_LENGTH).fill(0.0) },
    uRevealRadius: { value: paramsConfig.revealMaxRadius },
    uzcut: { value: paramsConfig.zcut || 0 },
  };
}

export function applyFluidReveal(material, fluidUniforms) {
  material.onBeforeCompile = shader => {
    shader.uniforms.uTime = fluidUniforms.uTime;
    shader.uniforms.uTrailPositions = fluidUniforms.uTrailPositions;
    shader.uniforms.uTrailIntensities = fluidUniforms.uTrailIntensities;
    shader.uniforms.uRevealRadius = fluidUniforms.uRevealRadius;

    shader.vertexShader = `
      varying vec3 vFluidWorldPos;
      ${shader.vertexShader}
    `.replace(
      `#include <worldpos_vertex>`,
      `#include <worldpos_vertex>
       vFluidWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
    );

    shader.fragmentShader = `
      varying vec3 vFluidWorldPos;
      uniform float uTime;
      uniform vec3 uTrailPositions[${TRAIL_LENGTH}];
      uniform float uTrailIntensities[${TRAIL_LENGTH}];
      uniform float uRevealRadius;
      ${shader.fragmentShader}
    `.replace(
      `#include <dithering_fragment>`,
      `#include <dithering_fragment>
       
       float blobNoise = sin(vFluidWorldPos.x * 5.0 + uTime * 2.0) * cos(vFluidWorldPos.y * 5.0 - uTime * 1.0) * sin(vFluidWorldPos.z * 5.0 + uTime * 2.0) * 0.4;

       float mask = 0.0;
       for(int i = 0; i < ${TRAIL_LENGTH}; i++) {
         float currentRadius = uRevealRadius * uTrailIntensities[i];
         float noisyRadius = currentRadius * (1.0 + blobNoise);
         float d = distance(vFluidWorldPos, uTrailPositions[i]);
         float circle = 1.0 - step(noisyRadius, d);
         mask = max(mask, circle);
       }
       
       if (mask < 0.01) discard;
       gl_FragColor.a *= mask;`,
    );
  };
}
