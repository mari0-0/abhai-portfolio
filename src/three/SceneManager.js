import * as THREE from "three";

export class SceneManager {
  constructor(containerElement) {
    this.container = containerElement;

    this.scene = new THREE.Scene();
    this.bgScene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      document.documentElement.clientWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 3);

    this.bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // --- Foreground Renderer (Models) ---
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(
      document.documentElement.clientWidth,
      window.innerHeight
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.domElement.id = "fg-canvas";

    // --- Background Renderer (Shader) ---
    this.bgRenderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
    });
    this.bgRenderer.setSize(
      document.documentElement.clientWidth,
      window.innerHeight
    );
    this.bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.bgRenderer.domElement.id = "bg-canvas";

    this.container.appendChild(this.bgRenderer.domElement);
    this.container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    this._onResize = this.onWindowResize.bind(this);
    window.addEventListener("resize", this._onResize);
  }

  onWindowResize() {
    this.camera.aspect =
      document.documentElement.clientWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      document.documentElement.clientWidth,
      window.innerHeight
    );
    this.bgRenderer.setSize(
      document.documentElement.clientWidth,
      window.innerHeight
    );
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

  dispose() {
    window.removeEventListener("resize", this._onResize);

    this.renderer.dispose();
    this.bgRenderer.dispose();
  }
}
