import * as THREE from "three";
import { HDRLoader } from "three/examples/jsm/Addons.js";

export class Environment {
  constructor() {
    this.hdrloader = new HDRLoader(THREE.DefaultLoadingManager);
  }

  loadHDR(path, scene) {
    this.hdrloader.load(path, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
    });
  }
}
