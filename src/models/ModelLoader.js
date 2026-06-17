import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { applyFluidReveal } from "../shaders/FluidReveal.js";

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
loader.setDRACOLoader(dracoLoader);

/**
 * Loads a GLB model and applies wireframe and solid reveal effects.
 *
 * @param {string} path - URL to the .glb file
 * @param {THREE.Scene} scene - The main scene to add the models to
 * @param {Object} options - Configuration options
 * @param {THREE.Material} [options.solidMaterial] - Custom material for the solid model. If omitted, uses the GLB's internal material.
 * @param {THREE.Material} options.wireframeMaterial - Material for the wireframe model.
 * @param {Object} options.fluidUniforms - The uniforms object controlling the reveal.
 * @param {Object} [options.position] - x, y, z position. Default {x:0, y:0, z:0}
 * @param {Object} [options.rotation] - x, y, z rotation. Default {x:0, y:0, z:0}
 * @param {Object} [options.scale] - x, y, z scale. Default {x:1, y:1, z:1}
 * @param {boolean} [options.isHelmet=false] - For user data tagging
 * @param {boolean} [options.isGoggle=false] - For user data tagging
 * @param {number} [options.solidRenderOrder=0]
 * @param {number} [options.wireframeRenderOrder=0]
 * @returns {Promise<{solidGroup: THREE.Group, wireframeGroup: THREE.Group}>}
 */
export function loadRevealingModel(path, scene, options = {}) {
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      gltf => {
        const solidGroup = new THREE.Group();
        const wireframeGroup = new THREE.Group();

        const meshes = [];
        gltf.scene.traverse(child => {
          if (child.isMesh) meshes.push(child);
        });

        meshes.forEach(mesh => {
          // --- Solid Mesh ---
          let solidMesh = mesh.clone();

          if (options.solidMaterial) {
            // External material provided
            solidMesh.material = options.solidMaterial;
          } else {
            // Use internal texture/material from GLB
            solidMesh.material = mesh.material.clone();
          }

          if (options.isHelmet) solidMesh.userData.isHelmet = true;
          if (options.isGoggle) solidMesh.userData.isGoggle = true;
          if (options.id) solidMesh.userData.trailId = options.id;

          if (options.solidRenderOrder !== undefined) {
            solidMesh.renderOrder = options.solidRenderOrder;
          }

          applyFluidReveal(solidMesh.material, options.fluidUniforms);
          solidGroup.add(solidMesh);

          // --- Wireframe Mesh ---
          let wireMesh = mesh.clone();
          wireMesh.geometry = wireMesh.geometry.toNonIndexed();
          wireMesh.material = options.wireframeMaterial;

          if (options.wireframeRenderOrder !== undefined) {
            wireMesh.renderOrder = options.wireframeRenderOrder;
          }

          wireframeGroup.add(wireMesh);
        });

        const pos = options.position || { x: 0, y: 0, z: 0 };
        const rot = options.rotation || { x: 0, y: 0, z: 0 };
        const scale = options.scale || { x: 1, y: 1, z: 1 };

        solidGroup.position.set(pos.x, pos.y, pos.z);
        solidGroup.rotation.set(rot.x, rot.y, rot.z);
        solidGroup.scale.set(scale.x, scale.y, scale.z);

        wireframeGroup.position.set(pos.x, pos.y, pos.z);
        wireframeGroup.rotation.set(rot.x, rot.y, rot.z);
        wireframeGroup.scale.set(scale.x, scale.y, scale.z);

        scene.add(solidGroup);
        scene.add(wireframeGroup);

        resolve({ solidGroup, wireframeGroup });
      },
      undefined,
      err => {
        console.error("Error loading model:", err);
        reject(err);
      },
    );
  });
}
