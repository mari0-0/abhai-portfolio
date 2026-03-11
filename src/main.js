import * as THREE from "three";
import { HDRLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/* ---------------- SCENE ---------------- */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3);

/* ---------------- RENDERER ---------------- */

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

renderer.setClearColor(0xf0f0f0, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

document.body.appendChild(renderer.domElement);

/* ---------------- CONTROLS ---------------- */

new OrbitControls(camera, renderer.domElement);

/* ---------------- CLOCK ---------------- */

const clock = new THREE.Clock();

/* ---------------- HDR ENVIRONMENT ---------------- */

const hdrloader = new HDRLoader();

hdrloader.load("/src/textures/environment/studio_small_08_1k--faded.hdr", texture => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

/* ---------------- TEXTURES ---------------- */

const textureLoader = new THREE.TextureLoader();

const diffuseMap = textureLoader.load("/src/textures/head/diffuse.webp");
diffuseMap.colorSpace = THREE.SRGBColorSpace;
const normalMap = textureLoader.load("/src/textures/head/normal.webp");
const roughnessMap = textureLoader.load("/src/textures/head/roughness.webp");
const alphaMap = textureLoader.load("/src/textures/head/alpha.webp");
const depthMap = textureLoader.load("/src/textures/head/depth.webp");

const helmetBaseColor = textureLoader.load("/src/textures/helmet/gold/baseColor.webp");
helmetBaseColor.colorSpace = THREE.SRGBColorSpace;
const helmetMetallic = textureLoader.load("/src/textures/helmet/mettalic.webp");
const helmetNormal = textureLoader.load("/src/textures/helmet/normal.webp");
const helmetRoughness = textureLoader.load("/src/textures/helmet/roughness.webp");

[helmetBaseColor, helmetMetallic, helmetNormal, helmetRoughness].forEach(tex => {
  tex.center.set(0.5, 0.5);
  tex.rotation = Math.PI / 2;
});

/* ---------------- MATERIALS ---------------- */

const faceMaterial = new THREE.MeshStandardMaterial({
  map: diffuseMap,
  normalMap: normalMap,
  roughnessMap: roughnessMap,
  alphaMap: alphaMap,
  displacementMap: depthMap,
  displacementScale: 0.1,
  transparent: true,
  depthWrite: true,
  metalness: 0.0,
  roughness: 1.0,
});

/* ---------------- FACE GEOMETRY ---------------- */

const faceGeometry = new THREE.PlaneGeometry(1.2, 1.2, 200, 200);
const face = new THREE.Mesh(faceGeometry, faceMaterial);

const baseFacePos = { x: 0, y: -0.15, z: 0 };
face.position.set(baseFacePos.x, baseFacePos.y, baseFacePos.z);
face.scale.set(4, 4, 4);

scene.add(face);

/* ---------------- DRACO + GLTF LOADER ---------------- */

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
loader.setDRACOLoader(dracoLoader);

/* ---------------- INDEPENDENT PARAMETERS ---------------- */

const globalParams = {
  baseColor: new THREE.Color(0xf0f0f0),
  innerColor: new THREE.Color(0xc0c0c0),
  parallaxEase: 0.05,
  parallaxSpeedFace: 0.06,
};

const helmetParams = {
  parallaxSpeed: 0.06,
  revealMaxRadius: 0.5,
  trailDecaySpeed: 1.0,
  zcut: 0.5,
  minY: -2.5,
  maxY: 2.5,
  speed: 0.2,
  delay: 0.0,
  width: 1,
  innerWidth: 1,
  wireframeOpacity: 0.8, // <-- NEW: Master opacity for helmet wireframe
};

const goggleParams = {
  parallaxSpeed: 0.08,
  revealMaxRadius: 0.7,
  trailDecaySpeed: 1.5,
  zcut: -100,
  fadeSpeed: 2.0,
  wireframeColor: new THREE.Color(0x222222),
  wireframeOpacity: 0.1, // <-- NEW: Master opacity for goggle wireframe
};

/* ---------------- TRAIL ARRAYS ---------------- */

const TRAIL_LENGTH = 40;

function createFluidUniforms(paramsConfig) {
  return {
    uTime: { value: 0 },
    uTrailPositions: { value: new Array(TRAIL_LENGTH).fill(null).map(() => new THREE.Vector3(1000, 1000, 1000)) },
    uTrailIntensities: { value: new Array(TRAIL_LENGTH).fill(0.0) },
    uRevealRadius: { value: paramsConfig.revealMaxRadius },
    uzcut: { value: paramsConfig.zcut || 0 },
  };
}

const helmetFluidUniforms = createFluidUniforms(helmetParams);
const goggleFluidUniforms = createFluidUniforms(goggleParams);

/* ---------------- SHADER FACTORY ---------------- */

// 1. Scanning Wireframe (For Helmet)
function createScanMaterial(fluidUniforms, paramsConfig) {
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
      uWireframeOpacity: { value: paramsConfig.wireframeOpacity }, // <-- Injected here

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
        alpha *= uWireframeOpacity; // <-- Multiplied here

        if (alpha < 0.01) discard;

        vec3 finalColor = mix(uBaseColor, uInnerColor, whiteCenter);
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  });
}

// 2. Fading Wireframe (For Goggles)
function createFadingWireframeMaterial(fluidUniforms, paramsConfig) {
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
      uWireframeOpacity: { value: paramsConfig.wireframeOpacity }, // <-- Injected here

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

        // Multiply cyclic opacity by master opacity
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

// 3. Fluid Reveal Injector (For Both Solid Helmet & Goggles)
function applyFluidReveal(material, fluidUniforms) {
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

const helmetScanMaterial = createScanMaterial(helmetFluidUniforms, helmetParams);
const goggleFadingWireframeMaterial = createFadingWireframeMaterial(goggleFluidUniforms, goggleParams);

const helmetSolidMaterial = new THREE.MeshStandardMaterial({
  map: helmetBaseColor,
  metalnessMap: helmetMetallic,
  normalMap: helmetNormal,
  roughnessMap: helmetRoughness,
});
applyFluidReveal(helmetSolidMaterial, helmetFluidUniforms);

/* ---------------- LOAD HELMETS & GOGGLES ---------------- */

let helmetWireframe = new THREE.Group();
let helmetSolid = new THREE.Group();
let goggleSolid = new THREE.Group();
let goggleWireframe = new THREE.Group();

// scene.add(helmetWireframe);
// scene.add(helmetSolid);
scene.add(goggleSolid);
scene.add(goggleWireframe);

const baseHelmetPos = { x: 0, y: 0.25, z: 0 };
const baseHelmetRot = { x: Math.PI / 10, y: 0, z: 0 };
const baseGogglePos = { x: 0, y: 0, z: 0.3 };

loader.load("/src/models/thug_life_goggles.glb", gltf => {
  const meshes = [];

  gltf.scene.traverse(child => {
    if (child.isMesh) meshes.push(child);
  });

  meshes.forEach(mesh => {
    let solidMesh = mesh.clone();
    solidMesh.material = mesh.material.clone();
    solidMesh.userData.isGoggle = true;

    applyFluidReveal(solidMesh.material, goggleFluidUniforms);
    solidMesh.renderOrder = 1;
    goggleSolid.add(solidMesh);

    let wireMesh = mesh.clone();
    wireMesh.geometry = wireMesh.geometry.toNonIndexed();
    wireMesh.material = goggleFadingWireframeMaterial;
    wireMesh.renderOrder = 2;
    goggleWireframe.add(wireMesh);
  });

  goggleSolid.scale.set(0.01, 0.01, 0.01);
  goggleSolid.position.set(baseGogglePos.x, baseGogglePos.y, baseGogglePos.z);

  goggleWireframe.scale.set(0.01, 0.01, 0.01);
  goggleWireframe.position.set(baseGogglePos.x, baseGogglePos.y, baseGogglePos.z);
});

loader.load("/src/models/helmet.glb", gltf => {
  const meshes = [];

  gltf.scene.traverse(child => {
    if (child.isMesh) meshes.push(child);
  });

  meshes.forEach(mesh => {
    let solidMesh = mesh.clone();
    solidMesh.material = helmetSolidMaterial;
    solidMesh.userData.isHelmet = true;

    helmetSolid.add(solidMesh);

    let wireMesh = mesh.clone();
    wireMesh.geometry = wireMesh.geometry.toNonIndexed();
    wireMesh.material = helmetScanMaterial;
    helmetWireframe.add(wireMesh);
  });

  helmetWireframe.scale.set(29, 29, 29);
  helmetWireframe.position.set(baseHelmetPos.x, baseHelmetPos.y, baseHelmetPos.z);
  helmetWireframe.rotation.set(baseHelmetRot.x, baseHelmetRot.y, baseHelmetRot.z);

  helmetSolid.scale.set(29, 29, 29);
  helmetSolid.position.set(baseHelmetPos.x, baseHelmetPos.y, baseHelmetPos.z);
  helmetSolid.rotation.set(baseHelmetRot.x, baseHelmetRot.y, baseHelmetRot.z);
});

/* ---------------- PARALLAX & RAYCASTING ---------------- */

const raycaster = new THREE.Raycaster();
const mouse2D = new THREE.Vector2();
const mouseP = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };
const windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

const helmetPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const gogglePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.5);

window.addEventListener("mousemove", event => {
  mouseP.targetX = (event.clientX - windowHalf.x) / windowHalf.x;
  mouseP.targetY = (event.clientY - windowHalf.y) / windowHalf.y;

  mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

/* ---------------- ANIMATION STATE ---------------- */

const helmetState = { progress: 0, isWaiting: false, timer: 0 };

function updatePulse(state, params, material, delta) {
  if (!state.isWaiting) {
    state.progress += delta * params.speed;
    if (state.progress >= 1.0) {
      state.progress = 1.0;
      state.isWaiting = true;
      state.timer = 0;
    }
  } else {
    state.timer += delta;
    if (state.timer >= params.delay) {
      state.isWaiting = false;
      state.progress = 0;
    }
  }

  const currentY = params.maxY - state.progress * (params.maxY - params.minY);
  material.uniforms.uScanPos.value = currentY;
}

/* ---------------- ANIMATE ---------------- */

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  helmetFluidUniforms.uTime.value = elapsedTime;
  goggleFluidUniforms.uTime.value = elapsedTime;

  // --- 1. Update Goggle Wireframe Fade ---
  const fadeValue = (Math.sin(elapsedTime * goggleParams.fadeSpeed) + 1.0) / 2.0;
  goggleFadingWireframeMaterial.uniforms.uOpacity.value = fadeValue;

  // --- 2. Update Parallax ---
  mouseP.currentX += (mouseP.targetX - mouseP.currentX) * globalParams.parallaxEase;
  mouseP.currentY += (mouseP.targetY - mouseP.currentY) * globalParams.parallaxEase;

  if (face) {
    face.position.x = baseFacePos.x + mouseP.currentX * globalParams.parallaxSpeedFace;
    face.position.y = baseFacePos.y - mouseP.currentY * globalParams.parallaxSpeedFace;
    face.rotation.y = mouseP.currentX * (globalParams.parallaxSpeedFace / 2);
    face.rotation.x = mouseP.currentY * (globalParams.parallaxSpeedFace / 2);
  }

  if (goggleSolid && goggleWireframe) {
    goggleWireframe.position.x = baseGogglePos.x + mouseP.currentX * goggleParams.parallaxSpeed;
    goggleWireframe.position.y = baseGogglePos.y - mouseP.currentY * goggleParams.parallaxSpeed;
    goggleWireframe.rotation.y = mouseP.currentX * (goggleParams.parallaxSpeed / 2);
    goggleWireframe.rotation.x = mouseP.currentY * (goggleParams.parallaxSpeed / 2);

    goggleSolid.position.copy(goggleWireframe.position);
    goggleSolid.rotation.copy(goggleWireframe.rotation);
  }

  if (helmetWireframe && helmetSolid) {
    helmetWireframe.position.x = baseHelmetPos.x + mouseP.currentX * helmetParams.parallaxSpeed;
    helmetWireframe.position.y = baseHelmetPos.y - mouseP.currentY * helmetParams.parallaxSpeed;
    helmetWireframe.rotation.y = baseHelmetRot.y + mouseP.currentX * (helmetParams.parallaxSpeed / 2);
    helmetWireframe.rotation.x = baseHelmetRot.x + mouseP.currentY * (helmetParams.parallaxSpeed / 2);

    helmetSolid.position.copy(helmetWireframe.position);
    helmetSolid.rotation.copy(helmetWireframe.rotation);
  }

  // --- 3. Update Fluid Trail Logic ---
  raycaster.setFromCamera(mouse2D, camera);

  let hitPointHelmet = new THREE.Vector3();
  let hitPointGoggle = new THREE.Vector3();

  raycaster.ray.intersectPlane(helmetPlane, hitPointHelmet);
  raycaster.ray.intersectPlane(gogglePlane, hitPointGoggle);

  const intersects = raycaster.intersectObjects([helmetSolid, goggleSolid], true);
  if (intersects.length > 0) {
    const hit = intersects[0];
    if (hit.object.userData.isGoggle) {
      hitPointGoggle.copy(hit.point);
    } else if (hit.object.userData.isHelmet) {
      hitPointHelmet.copy(hit.point);
    }
  }

  if (hitPointHelmet) {
    const headH = helmetFluidUniforms.uTrailPositions.value[0];
    if (headH.distanceTo(hitPointHelmet) > 0.05) {
      for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
        helmetFluidUniforms.uTrailPositions.value[i].copy(helmetFluidUniforms.uTrailPositions.value[i - 1]);
        helmetFluidUniforms.uTrailIntensities.value[i] = helmetFluidUniforms.uTrailIntensities.value[i - 1];
      }
    }
    helmetFluidUniforms.uTrailPositions.value[0].copy(hitPointHelmet);
    helmetFluidUniforms.uTrailIntensities.value[0] = 1.0;
  }

  if (hitPointGoggle) {
    const headG = goggleFluidUniforms.uTrailPositions.value[0];
    if (headG.distanceTo(hitPointGoggle) > 0.05) {
      for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
        goggleFluidUniforms.uTrailPositions.value[i].copy(goggleFluidUniforms.uTrailPositions.value[i - 1]);
        goggleFluidUniforms.uTrailIntensities.value[i] = goggleFluidUniforms.uTrailIntensities.value[i - 1];
      }
    }
    goggleFluidUniforms.uTrailPositions.value[0].copy(hitPointGoggle);
    goggleFluidUniforms.uTrailIntensities.value[0] = 1.0;
  }

  for (let i = 0; i < TRAIL_LENGTH; i++) {
    helmetFluidUniforms.uTrailIntensities.value[i] -= delta * helmetParams.trailDecaySpeed;
    if (helmetFluidUniforms.uTrailIntensities.value[i] <= 0.0) {
      helmetFluidUniforms.uTrailIntensities.value[i] = 0.0;
      helmetFluidUniforms.uTrailPositions.value[i].set(1000, 1000, 1000);
    }

    goggleFluidUniforms.uTrailIntensities.value[i] -= delta * goggleParams.trailDecaySpeed;
    if (goggleFluidUniforms.uTrailIntensities.value[i] <= 0.0) {
      goggleFluidUniforms.uTrailIntensities.value[i] = 0.0;
      goggleFluidUniforms.uTrailPositions.value[i].set(1000, 1000, 1000);
    }
  }

  // --- 4. Update Pulse Effect (Wireframe Helmet Only) ---
  updatePulse(helmetState, helmetParams, helmetScanMaterial, delta);

  renderer.render(scene, camera);
}

/* ---------------- RESIZE ---------------- */

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  windowHalf.x = window.innerWidth / 2;
  windowHalf.y = window.innerHeight / 2;
});

/* ---------------- START ---------------- */

animate();
