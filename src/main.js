import * as THREE from "three";
import { environment } from "./core/Environment.js";
import { sceneSetup } from "./core/SceneSetup.js";
import { TrailManager } from "./effects/TrailManager.js";
import { LoadingScreen } from "./LoadingScreen.js";
import { MobileMenu } from "./MobileMenu.js";
import { loadRevealingModel } from "./models/ModelLoader.js";
import { initScrollAnimations } from "./ScrollAnimations.js";
import { createBackgroundShader } from "./shaders/BackgroundShader.js";
import { createFluidUniforms } from "./shaders/FluidReveal.js";
import { createFadingWireframeMaterial, createScanMaterial } from "./shaders/Materials.js";

/* ---------------- MOBILE MENU ---------------- */
new MobileMenu();

/* ---------------- SCROLL ANIMATIONS ---------------- */
initScrollAnimations();

/* ---------------- LOADING SCREEN ---------------- */
const loadingScreen = new LoadingScreen();
THREE.DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
  loadingScreen.updateProgress(itemsLoaded / itemsTotal);
};

/* ---------------- ENVIRONMENT ---------------- */
environment.loadHDR("/src/textures/environment/studio_small_08_1k--faded.hdr");

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
  wireframeOpacity: 0.8,
};

const maskParams = {
  parallaxSpeed: 0.07,
  revealMaxRadius: 0.7,
  trailDecaySpeed: 0.3,
  zcut: -100,
  fadeSpeed: 2.0,
  wireframeColor: new THREE.Color(0x222222),
  wireframeOpacity: 0.1,
};

/* ---------------- BACKGROUND SHADER ---------------- */

const bgMaterial = createBackgroundShader();
const bgGeometry = new THREE.PlaneGeometry(2, 2);
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
sceneSetup.bgScene.add(bgMesh);

// Setup resize for the uniform to keep the waves proportional
window.addEventListener("resize", () => {
  if (bgMaterial.uniforms.uResolution) {
    bgMaterial.uniforms.uResolution.value.set(document.documentElement.clientWidth, window.innerHeight);
  }
});

/* ---------------- TRAIL MANAGER ---------------- */
const trailManager = new TrailManager(sceneSetup.camera, globalParams);

/* ---------------- FACE GEOMETRY ---------------- */
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

const faceGeometry = new THREE.PlaneGeometry(1.2, 1.2, 200, 200);
const face = new THREE.Mesh(faceGeometry, faceMaterial);

const baseFacePos = { x: 0, y: -0.15, z: 0 };
face.position.set(baseFacePos.x, baseFacePos.y, baseFacePos.z);
face.scale.set(4, 4, 4);

sceneSetup.scene.add(face);

/* ---------------- FLUID & SHADERS ---------------- */
const scanFluidUniforms = createFluidUniforms(helmetParams);
const fadingFluidUniforms = createFluidUniforms(maskParams);

const scanWireframeMaterial = createScanMaterial(scanFluidUniforms, helmetParams, globalParams);
const fadingWireframeMaterial = createFadingWireframeMaterial(fadingFluidUniforms, maskParams);

const solidMaterial = new THREE.MeshStandardMaterial({
  map: helmetBaseColor,
  metalnessMap: helmetMetallic,
  normalMap: helmetNormal,
  roughnessMap: helmetRoughness,
});

/* ---------------- LOAD HELMETS & GOGGLES ---------------- */
const baseHelmetPos = { x: 0, y: 0.25, z: 0 };
const baseHelmetRot = { x: Math.PI / 10, y: 0, z: 0 };
const baseMaskPos = { x: 0, y: 0.04, z: 0.53 };
const baseMaskRot = { x: -Math.PI / 2, y: 0, z: 0 };

let helmetGroups = null;
let maskGroups = null;

loadRevealingModel("/src/models/kitsune_mask.glb", sceneSetup.scene, {
  wireframeMaterial: fadingWireframeMaterial,
  fluidUniforms: fadingFluidUniforms,
  position: baseMaskPos,
  scale: { x: 0.85, y: 0.85, z: 0.85 },
  rotation: baseMaskRot,
  id: "mask",
  solidRenderOrder: 1,
  wireframeRenderOrder: 2,
  // NO solidMaterial passed here -> Uses internal GLTF material!
}).then(groups => {
  maskGroups = groups;
  trailManager.addTrackable(groups.solidGroup, -0.5, fadingFluidUniforms, maskParams.trailDecaySpeed, "mask");

  // Fallback trigger in case DefaultLoadingManager misses some rapid cache loads
  loadingScreen.updateProgress(1);
});

// loadRevealingModel("/src/models/helmet.glb", sceneSetup.scene, {
//   solidMaterial: solidMaterial, // EXTERNAL texture/material!
//   wireframeMaterial: scanWireframeMaterial,
//   fluidUniforms: scanFluidUniforms,
//   position: baseHelmetPos,
//   rotation: baseHelmetRot,
//   scale: { x: 29, y: 29, z: 29 },
//   isHelmet: true,
//   id: "helmet",
// }).then(groups => {
//   helmetGroups = groups;
//   trailManager.addTrackable(groups.solidGroup, 0, scanFluidUniforms, helmetParams.trailDecaySpeed, "helmet");
// });

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

  const delta = sceneSetup.getDelta();
  const elapsedTime = sceneSetup.getElapsedTime();

  // Background Time Update
  if (bgMaterial.uniforms.uTime) bgMaterial.uniforms.uTime.value = elapsedTime;

  scanFluidUniforms.uTime.value = elapsedTime;
  fadingFluidUniforms.uTime.value = elapsedTime;

  const fadeValue = (Math.sin(elapsedTime * maskParams.fadeSpeed) + 1.0) / 2.0;
  fadingWireframeMaterial.uniforms.uOpacity.value = fadeValue;

  trailManager.update(delta);

  const mouseP = trailManager.mouseP;

  if (face) {
    face.position.x = baseFacePos.x + mouseP.currentX * globalParams.parallaxSpeedFace;
    face.position.y = baseFacePos.y - mouseP.currentY * globalParams.parallaxSpeedFace;
    face.rotation.y = mouseP.currentX * (globalParams.parallaxSpeedFace / 2);
    face.rotation.x = mouseP.currentY * (globalParams.parallaxSpeedFace / 2);
  }

  if (maskGroups) {
    const { solidGroup, wireframeGroup } = maskGroups;
    wireframeGroup.position.x = baseMaskPos.x + mouseP.currentX * maskParams.parallaxSpeed;
    // wireframeGroup.position.y = baseMaskPos.y - mouseP.currentY * maskParams.parallaxSpeed;
    wireframeGroup.position.z = baseMaskPos.z - mouseP.currentY * maskParams.parallaxSpeed;
    wireframeGroup.rotation.x = baseMaskRot.x + mouseP.currentY * (maskParams.parallaxSpeed / 2);
    // wireframeGroup.rotation.y = baseMaskRot.y + mouseP.currentX * (maskParams.parallaxSpeed / 2);
    wireframeGroup.rotation.z = baseMaskRot.z + mouseP.currentX * (maskParams.parallaxSpeed / 2);
    wireframeGroup.rotation.y = baseMaskRot.y;

    solidGroup.position.copy(wireframeGroup.position);
    solidGroup.rotation.copy(wireframeGroup.rotation);
  }

  if (helmetGroups) {
    const { solidGroup, wireframeGroup } = helmetGroups;
    wireframeGroup.position.x = baseHelmetPos.x + mouseP.currentX * helmetParams.parallaxSpeed;
    wireframeGroup.position.y = baseHelmetPos.y - mouseP.currentY * helmetParams.parallaxSpeed;
    wireframeGroup.rotation.y = baseHelmetRot.y + mouseP.currentX * (helmetParams.parallaxSpeed / 2);
    wireframeGroup.rotation.x = baseHelmetRot.x + mouseP.currentY * (helmetParams.parallaxSpeed / 2);

    solidGroup.position.copy(wireframeGroup.position);
    solidGroup.rotation.copy(wireframeGroup.rotation);
  }

  updatePulse(helmetState, helmetParams, scanWireframeMaterial, delta);

  sceneSetup.render();
}

animate();
