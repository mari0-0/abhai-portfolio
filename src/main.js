import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

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

const rgbeLoader = new RGBELoader();

rgbeLoader.load("/src/textures/environment/studio_small_08_1k--faded.hdr", texture => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

/* ---------------- TEXTURES ---------------- */

const textureLoader = new THREE.TextureLoader();

// Face Textures
const diffuseMap = textureLoader.load("/src/textures/head/diffuse.webp");
diffuseMap.colorSpace = THREE.SRGBColorSpace;
const normalMap = textureLoader.load("/src/textures/head/normal.webp");
const roughnessMap = textureLoader.load("/src/textures/head/roughness.webp");
const alphaMap = textureLoader.load("/src/textures/head/alpha.webp");
const depthMap = textureLoader.load("/src/textures/head/depth.webp");

// Helmet Textures
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

/* ---------------- SHADER MATERIALS & TRAIL STATE ---------------- */

const params = {
  speed: 0.2,
  delay: 0.0,
  width: 1,
  innerWidth: 1,
  minY: -2.5,
  maxY: 2.5,
  baseColor: new THREE.Color(0xf0f0f0),
  innerColor: new THREE.Color(0xc0c0c0),
  zcut: 0.5,

  parallaxSpeedFace: 0.06,
  parallaxSpeedHelmet: 0.06,
  parallaxEase: 0.05,

  revealMaxRadius: 0.5,
  trailDecaySpeed: 1.0,
};

// Array setup for the trail
const TRAIL_LENGTH = 40;
const trailPositions = new Array(TRAIL_LENGTH).fill(null).map(() => new THREE.Vector3(1000, 1000, 1000));
const trailIntensities = new Array(TRAIL_LENGTH).fill(0.0);

// Shared uniforms between solid and wireframe
const solidHelmetUniforms = {
  uTime: { value: 0 }, // NEW: Pass time for the blob movement
  uTrailPositions: { value: trailPositions },
  uTrailIntensities: { value: trailIntensities },
  uRevealRadius: { value: params.revealMaxRadius },
};

// 1. Wireframe Material
const scanMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: true,
  depthTest: true,
  side: THREE.DoubleSide,
  wireframe: true,

  uniforms: {
    uScanPos: { value: 0 },
    uWidth: { value: params.width },
    uInnerWidth: { value: params.innerWidth },
    uBaseColor: { value: params.baseColor },
    uInnerColor: { value: params.innerColor },
    uZCut: { value: params.zcut },

    uTime: solidHelmetUniforms.uTime,
    uTrailPositions: solidHelmetUniforms.uTrailPositions,
    uTrailIntensities: solidHelmetUniforms.uTrailIntensities,
    uRevealRadius: solidHelmetUniforms.uRevealRadius,
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

    uniform float uTime;
    uniform vec3 uTrailPositions[${TRAIL_LENGTH}];
    uniform float uTrailIntensities[${TRAIL_LENGTH}];
    uniform float uRevealRadius;

    void main() {
      if (vWorldPosition.z < uZCut) discard;

      // Pulse logic
      float dist = abs(vWorldPosition.y - uScanPos);
      float normalizedDist = clamp(dist / uWidth, 0.0, 1.0);
      float alpha = pow(1.0 - normalizedDist, 4.0);
      float innerDist = clamp(dist / uInnerWidth, 0.0, 1.0);
      float whiteCenter = pow(1.0 - innerDist, 4.0);

      // --- INVERSE HARD TRAIL MASK WITH BLOB NOISE ---
      // Generate a wavy, moving distortion based on 3D space and time
      float blobNoise = sin(vWorldPosition.x * 12.0 + uTime * 4.0) * cos(vWorldPosition.y * 12.0 - uTime * 3.0) * sin(vWorldPosition.z * 12.0 + uTime * 5.0) * 0.4;

      float hideMask = 0.0;
      for(int i = 0; i < ${TRAIL_LENGTH}; i++) {
        float currentRadius = uRevealRadius * uTrailIntensities[i];
        
        // Add the noise to the radius. Multiply by currentRadius so small tail dots don't distort wildly.
        float noisyRadius = currentRadius * (1.0 + blobNoise);
        float mouseDist = distance(vWorldPosition, uTrailPositions[i]);
        
        float circle = 1.0 - step(noisyRadius, mouseDist);
        hideMask = max(hideMask, circle);
      }

      alpha *= (1.0 - hideMask);
      if (alpha < 0.01) discard;

      vec3 finalColor = mix(uBaseColor, uInnerColor, whiteCenter);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
});

// 2. Solid Textured Helmet Material
const helmetSolidMaterial = new THREE.MeshStandardMaterial({
  map: helmetBaseColor,
  metalnessMap: helmetMetallic,
  normalMap: helmetNormal,
  roughnessMap: helmetRoughness,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
});

helmetSolidMaterial.onBeforeCompile = shader => {
  shader.uniforms.uTime = solidHelmetUniforms.uTime;
  shader.uniforms.uTrailPositions = solidHelmetUniforms.uTrailPositions;
  shader.uniforms.uTrailIntensities = solidHelmetUniforms.uTrailIntensities;
  shader.uniforms.uRevealRadius = solidHelmetUniforms.uRevealRadius;

  shader.vertexShader = `
    varying vec3 vWorldPos;
    ${shader.vertexShader}
  `.replace(
    `#include <worldpos_vertex>`,
    `#include <worldpos_vertex>
     vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
  );

  shader.fragmentShader = `
    varying vec3 vWorldPos;
    uniform float uTime;
    uniform vec3 uTrailPositions[${TRAIL_LENGTH}];
    uniform float uTrailIntensities[${TRAIL_LENGTH}];
    uniform float uRevealRadius;
    ${shader.fragmentShader}
  `.replace(
    `#include <dithering_fragment>`,
    `#include <dithering_fragment>
     
     // --- HARD TRAIL MASK WITH BLOB NOISE ---
     float blobNoise = sin(vWorldPos.x * 5.0 + uTime * 2.0) * cos(vWorldPos.y * 5.0 - uTime * 1.0) * sin(vWorldPos.z * 5.0 + uTime * 2.0) * 0.4;

     float mask = 0.0;
     for(int i = 0; i < ${TRAIL_LENGTH}; i++) {
       float currentRadius = uRevealRadius * uTrailIntensities[i];
       float noisyRadius = currentRadius * (1.0 + blobNoise);
       float d = distance(vWorldPos, uTrailPositions[i]);
       
       float circle = 1.0 - step(noisyRadius, d);
       mask = max(mask, circle);
     }
     
     if (mask < 0.01) discard;
     gl_FragColor.a *= mask;`,
  );
};

/* ---------------- LOAD HELMETS ---------------- */

let helmetWireframe = new THREE.Group();
let helmetSolid = new THREE.Group();

scene.add(helmetWireframe);
scene.add(helmetSolid);

const baseHelmetPos = { x: 0, y: 0.25, z: 0 };
const baseHelmetRot = { x: Math.PI / 10, y: 0, z: 0 };

loader.load("/src/models/helmet.glb", gltf => {
  const meshes = [];

  gltf.scene.traverse(child => {
    if (child.isMesh) meshes.push(child);
  });

  meshes.forEach(mesh => {
    let solidMesh = mesh.clone();
    solidMesh.material = helmetSolidMaterial;
    helmetSolid.add(solidMesh);

    mesh.geometry = mesh.geometry.toNonIndexed();
    mesh.material = scanMaterial;
    helmetWireframe.add(mesh);
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

window.addEventListener("mousemove", event => {
  mouseP.targetX = (event.clientX - windowHalf.x) / windowHalf.x;
  mouseP.targetY = (event.clientY - windowHalf.y) / windowHalf.y;

  mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

/* ---------------- ANIMATION STATE ---------------- */

let pulseProgress = 0;
let isWaiting = false;
let waitTimer = 0;

/* ---------------- ANIMATE ---------------- */

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  // Update time for the blob shaders
  solidHelmetUniforms.uTime.value = elapsedTime;

  // --- 1. Update Parallax ---
  mouseP.currentX += (mouseP.targetX - mouseP.currentX) * params.parallaxEase;
  mouseP.currentY += (mouseP.targetY - mouseP.currentY) * params.parallaxEase;

  if (face) {
    face.position.x = baseFacePos.x + mouseP.currentX * params.parallaxSpeedFace;
    face.position.y = baseFacePos.y - mouseP.currentY * params.parallaxSpeedFace;
    face.rotation.y = mouseP.currentX * (params.parallaxSpeedFace / 2);
    face.rotation.x = mouseP.currentY * (params.parallaxSpeedFace / 2);
  }

  if (helmetWireframe && helmetSolid) {
    helmetWireframe.position.x = baseHelmetPos.x + mouseP.currentX * params.parallaxSpeedHelmet;
    helmetWireframe.position.y = baseHelmetPos.y - mouseP.currentY * params.parallaxSpeedHelmet;
    helmetWireframe.rotation.y = baseHelmetRot.y + mouseP.currentX * (params.parallaxSpeedHelmet / 2);
    helmetWireframe.rotation.x = baseHelmetRot.x + mouseP.currentY * (params.parallaxSpeedHelmet / 2);

    helmetSolid.position.copy(helmetWireframe.position);
    helmetSolid.rotation.copy(helmetWireframe.rotation);

    // --- 2. Update Fluid Trail Logic ---
    raycaster.setFromCamera(mouse2D, camera);
    const intersects = raycaster.intersectObject(helmetSolid, true);

    if (intersects.length > 0) {
      const hitPoint = intersects[0].point;
      const headPoint = solidHelmetUniforms.uTrailPositions.value[0];
      const distToLastNode = headPoint.distanceTo(hitPoint);

      if (distToLastNode > 0.05) {
        for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
          solidHelmetUniforms.uTrailPositions.value[i].copy(solidHelmetUniforms.uTrailPositions.value[i - 1]);
          solidHelmetUniforms.uTrailIntensities.value[i] = solidHelmetUniforms.uTrailIntensities.value[i - 1];
        }
      }

      solidHelmetUniforms.uTrailPositions.value[0].copy(hitPoint);
      solidHelmetUniforms.uTrailIntensities.value[0] = 1.0;
    }

    // Decay all points
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      solidHelmetUniforms.uTrailIntensities.value[i] -= delta * params.trailDecaySpeed;
      if (solidHelmetUniforms.uTrailIntensities.value[i] <= 0.0) {
        solidHelmetUniforms.uTrailIntensities.value[i] = 0.0;
        solidHelmetUniforms.uTrailPositions.value[i].set(1000, 1000, 1000);
      }
    }

    // --- 3. Update Pulse Effect (Wireframe) ---
    if (!isWaiting) {
      pulseProgress += delta * params.speed;
      if (pulseProgress >= 1.0) {
        pulseProgress = 1.0;
        isWaiting = true;
        waitTimer = 0;
      }
    } else {
      waitTimer += delta;
      if (waitTimer >= params.delay) {
        isWaiting = false;
        pulseProgress = 0;
      }
    }
    const currentY = params.maxY - pulseProgress * (params.maxY - params.minY);
    scanMaterial.uniforms.uScanPos.value = currentY;
  }

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
