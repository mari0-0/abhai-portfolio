import * as THREE from "three";
import { TRAIL_LENGTH } from "../shaders/FluidReveal.js";

export class TrailManager {
  constructor(camera, globalParams) {
    this.camera = camera;
    this.globalParams = globalParams;

    this.raycaster = new THREE.Raycaster();
    this.mouse2D = new THREE.Vector2(-1000, -1000);
    this.mouseP = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };
    this.windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    this.planes = [];
    this.trackables = [];

    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  onMouseMove(event) {
    this.mouseP.targetX = (event.clientX - this.windowHalf.x) / this.windowHalf.x;
    this.mouseP.targetY = (event.clientY - this.windowHalf.y) / this.windowHalf.y;

    this.mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onWindowResize() {
    this.windowHalf.x = window.innerWidth / 2;
    this.windowHalf.y = window.innerHeight / 2;
  }

  addTrackable(mesh, planeZ, fluidUniforms, decaySpeed, id) {
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), planeZ);
    this.planes.push({ plane, id });
    this.trackables.push({ mesh, fluidUniforms, decaySpeed, id });
  }

  update(delta) {
    this.mouseP.currentX += (this.mouseP.targetX - this.mouseP.currentX) * this.globalParams.parallaxEase;
    this.mouseP.currentY += (this.mouseP.targetY - this.mouseP.currentY) * this.globalParams.parallaxEase;

    this.raycaster.setFromCamera(this.mouse2D, this.camera);

    const hitPoints = {};
    for (const p of this.planes) {
      hitPoints[p.id] = new THREE.Vector3();
      this.raycaster.ray.intersectPlane(p.plane, hitPoints[p.id]);
    }

    const meshesToIntersect = this.trackables.map(t => t.mesh).filter(Boolean);
    const intersects = this.raycaster.intersectObjects(meshesToIntersect, true);

    const actualHits = {};
    if (intersects.length > 0) {
      const hit = intersects[0];
      const hitId = hit.object.userData.trailId;
      if (hitId && hitPoints[hitId]) {
        actualHits[hitId] = hit.point;
      }
    }

    for (const t of this.trackables) {
      let hitPoint = actualHits[t.id];

      if (hitPoint) {
        const headPosition = t.fluidUniforms.uTrailPositions.value[0];
        if (headPosition.distanceTo(hitPoint) > 0.05) {
          for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
            t.fluidUniforms.uTrailPositions.value[i].copy(t.fluidUniforms.uTrailPositions.value[i - 1]);
            t.fluidUniforms.uTrailIntensities.value[i] = t.fluidUniforms.uTrailIntensities.value[i - 1];
          }
        }
        t.fluidUniforms.uTrailPositions.value[0].copy(hitPoint);
        t.fluidUniforms.uTrailIntensities.value[0] = 1.0;
      }

      for (let i = 0; i < TRAIL_LENGTH; i++) {
        t.fluidUniforms.uTrailIntensities.value[i] -= delta * t.decaySpeed;
        if (t.fluidUniforms.uTrailIntensities.value[i] <= 0.0) {
          t.fluidUniforms.uTrailIntensities.value[i] = 0.0;
          t.fluidUniforms.uTrailPositions.value[i].set(1000, 1000, 1000);
        }
      }
    }
  }
}
