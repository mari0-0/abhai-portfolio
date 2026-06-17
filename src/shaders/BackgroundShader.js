import * as THREE from "three";

export function createBackgroundShader() {
  return new THREE.ShaderMaterial({
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(document.documentElement.clientWidth, window.innerHeight) },
      // Colors taken from the new palette
      uColorLeft: { value: new THREE.Color("#ffa154") },
      uColorRight: { value: new THREE.Color("#fdfdfd") },
      // Noise opacity to blend with the gradient
      uNoiseIntensity: { value: 0.05 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uColorLeft;
      uniform vec3 uColorRight;
      uniform float uNoiseIntensity;

      varying vec2 vUv;

      // Pseudo-random generator for noise
      float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
        // Normalize aspect ratio for perfect circular/smooth waves
        vec2 st = gl_FragCoord.xy / uResolution.xy;
        st.x *= uResolution.x / uResolution.y;

        // Base wave function: combination of sin waves moving diagonally
        float wave1 = sin(st.x * 3.0 + st.y * 2.0 + uTime * 0.5);
        float wave2 = cos(st.x * 5.0 - st.y * 4.0 - uTime * 0.3);
        float wave3 = sin(st.x * 2.0 - st.y * 5.0 + uTime * 0.7);

        // Create the requested slant: top-left (25%) to bottom-right (w-25%)
        // Equation: x + 0.5y = 0.75
        float slant = vUv.x + 0.7 * vUv.y;
        float xDisplacement = (wave1 + wave2 + wave3) * 0.07;
        float separator = slant + xDisplacement;

        // Create a smooth transition between left and right colors
        // Adjust the center point (0.9) to push the split left or right
        float blend = smoothstep(0.7, 1.1, separator);

        vec3 color = mix(uColorLeft, uColorRight, blend);

        // Add soft film grain/noise
        float noise = random(vUv * uTime);
        color += (noise - 0.5) * uNoiseIntensity;

        // Add a subtle radial vignette for depth
        float dist = distance(vUv, vec2(0.5));
        color *= smoothstep(1.2, 0.2, dist);

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}
