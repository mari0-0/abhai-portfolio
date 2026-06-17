import * as THREE from "three";

class SceneSetup {
  constructor() {
    this.scene = new THREE.Scene();
    this.bgScene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, document.documentElement.clientWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 3);

    this.bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // --- Foreground Renderer (Models) ---
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(document.documentElement.clientWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.domElement.id = "fg-canvas";

    // --- Background Renderer (Shader) ---
    this.bgRenderer = new THREE.WebGLRenderer({
      antialias: false,
    });
    this.bgRenderer.setSize(document.documentElement.clientWidth, window.innerHeight);
    this.bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.bgRenderer.domElement.id = "bg-canvas";

    document.body.appendChild(this.bgRenderer.domElement);
    document.body.appendChild(this.renderer.domElement);

    // UNCOMMET THIS FOR ORBIT CONTROLS
    // this.controls = new OrbitControls(this.camera, document.body);

    this.clock = new THREE.Clock();

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  onWindowResize() {
    this.camera.aspect = document.documentElement.clientWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(document.documentElement.clientWidth, window.innerHeight);
    this.bgRenderer.setSize(document.documentElement.clientWidth, window.innerHeight);
  }

  getDelta() {
    return this.clock.getDelta();
  }

  getElapsedTime() {
    return this.clock.getElapsedTime();
  }

  render() {
    this.bgRenderer.render(this.bgScene, this.bgCamera);
    this.renderer.render(this.scene, this.camera);
  }
}

export const sceneSetup = new SceneSetup();
