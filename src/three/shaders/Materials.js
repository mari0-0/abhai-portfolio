import * as THREE from "three";
import { TRAIL_LENGTH } from "./FluidReveal.js";

export function createScanMaterial(fluidUniforms, paramsConfig, globalParams) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: true,
    depthTest: true,
    side: THREE.DoubleSide,
    wireframe: true,

    uniforms: {
      uScanPos: { value: 0 },
      uWidth: { value: paramsConfig.width },
      uInnerWidth: { value: paramsConfig.innerWidth },
      uBaseColor: { value: globalParams.baseColor },
      uInnerColor: { value: globalParams.innerColor },
      uWireframeOpacity: { value: paramsConfig.wireframeOpacity },

      uTime: fluidUniforms.uTime,
      uTrailPositions: fluidUniforms.uTrailPositions,
      uTrailIntensities: fluidUniforms.uTrailIntensities,
      uRevealRadius: fluidUniforms.uRevealRadius,
      uZCut: fluidUniforms.uzcut,
    },

    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,

    fragmentShader: `
      varying vec3 vWorldPosition;
      uniform float uScanPos;
      uniform float uWidth;
      uniform float uInnerWidth;
      uniform float uZCut; 
      uniform vec3 uBaseColor;
      uniform vec3 uInnerColor;
      uniform float uWireframeOpacity;

      uniform float uTime;
      uniform vec3 uTrailPositions[${TRAIL_LENGTH}];
      uniform float uTrailIntensities[${TRAIL_LENGTH}];
      uniform float uRevealRadius;

      void main() {
        if (vWorldPosition.z < uZCut) discard;

        float dist = abs(vWorldPosition.y - uScanPos);
        float normalizedDist = clamp(dist / uWidth, 0.0, 1.0);
        float alpha = pow(1.0 - normalizedDist, 4.0);
        float innerDist = clamp(dist / uInnerWidth, 0.0, 1.0);
        float whiteCenter = pow(1.0 - innerDist, 4.0);

        float blobNoise = sin(vWorldPosition.x * 5.0 + uTime * 2.0) * cos(vWorldPosition.y * 5.0 - uTime * 1.0) * sin(vWorldPosition.z * 5.0 + uTime * 2.0) * 0.4;

        float hideMask = 0.0;
        for(int i = 0; i < ${TRAIL_LENGTH}; i++) {
          float currentRadius = uRevealRadius * uTrailIntensities[i];
          float noisyRadius = currentRadius * (1.0 + blobNoise);
          float mouseDist = distance(vWorldPosition, uTrailPositions[i]);
          float circle = 1.0 - step(noisyRadius, mouseDist);
          hideMask = max(hideMask, circle);
        }

        alpha *= (1.0 - hideMask);
        alpha *= uWireframeOpacity;

        if (alpha < 0.01) discard;

        vec3 finalColor = mix(uBaseColor, uInnerColor, whiteCenter);
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  });
}

export function createFadingWireframeMaterial(fluidUniforms, paramsConfig) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
    wireframe: true,

    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,

    uniforms: {
      uColor: { value: paramsConfig.wireframeColor },
      uOpacity: { value: 0.0 },
      uWireframeOpacity: { value: paramsConfig.wireframeOpacity },

      uTime: fluidUniforms.uTime,
      uTrailPositions: fluidUniforms.uTrailPositions,
      uTrailIntensities: fluidUniforms.uTrailIntensities,
      uRevealRadius: fluidUniforms.uRevealRadius,
      uZCut: fluidUniforms.uzcut,
    },

    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,

    fragmentShader: `
      varying vec3 vWorldPosition;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uZCut; 
      uniform float uWireframeOpacity;

      uniform float uTime;
      uniform vec3 uTrailPositions[${TRAIL_LENGTH}];
      uniform float uTrailIntensities[${TRAIL_LENGTH}];
      uniform float uRevealRadius;

      void main() {
        if (vWorldPosition.z < uZCut) discard;

        float alpha = uOpacity * uWireframeOpacity; 

        float blobNoise = sin(vWorldPosition.x * 5.0 + uTime * 2.0) * cos(vWorldPosition.y * 5.0 - uTime * 1.0) * sin(vWorldPosition.z * 5.0 + uTime * 2.0) * 0.4;

        float hideMask = 0.0;
        for(int i = 0; i < ${TRAIL_LENGTH}; i++) {
          float currentRadius = uRevealRadius * uTrailIntensities[i];
          float noisyRadius = currentRadius * (1.0 + blobNoise);
          float mouseDist = distance(vWorldPosition, uTrailPositions[i]);
          float circle = 1.0 - step(noisyRadius, mouseDist);
          hideMask = max(hideMask, circle);
        }

        alpha *= (1.0 - hideMask);
        if (alpha < 0.01) discard;

        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  });
}
