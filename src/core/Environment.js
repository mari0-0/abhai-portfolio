import * as THREE from "three";
import { HDRLoader } from "three/examples/jsm/Addons.js";
import { sceneSetup } from "./SceneSetup.js";

class Environment {
  constructor() {
    this.hdrloader = new HDRLoader(THREE.DefaultLoadingManager);
  }

  loadHDR(path) {
    this.hdrloader.load(path, texture => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      sceneSetup.scene.environment = texture;
    });
  }
}

export const environment = new Environment();
