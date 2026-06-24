"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SceneManager } from "@/three/SceneManager";
import { Environment } from "@/three/Environment";
import { TrailManager } from "@/three/TrailManager";
import { loadRevealingModel } from "@/three/ModelLoader";
import { createFluidUniforms } from "@/three/shaders/FluidReveal";
import {
  createFadingWireframeMaterial,
  createScanMaterial,
} from "@/three/shaders/Materials";


import Navbar from "@/components/Navbar/Navbar";
import HeroSection from "@/components/HeroSection/HeroSection";
import HeroDissolve from "@/components/HeroDissolve/HeroDissolve";
import MobileMenuOverlay from "@/components/MobileMenuOverlay/MobileMenuOverlay";
import WhatIShipSection from "@/components/WhatIShipSection/WhatIShipSection";
import WhoAmISection from "@/components/WhoAmISection/WhoAmISection";
import SeeMoreWorkSection from "@/components/SeeMoreWorkSection/SeeMoreWorkSection";
import WhyChooseMeSection from "@/components/WhyChooseMeSection/WhyChooseMeSection";
import ContactSection from "@/components/ContactSection/ContactSection";
import AsciiHands from "@/components/AsciiHands/AsciiHands";
import Footer from "@/components/Footer/Footer";

export default function PortfolioPage() {
  const canvasContainerRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          if (window.lenis) {
            window.lenis.scrollTo(el);
          } else {
            el.scrollIntoView(); // fallback without smooth behavior
          }
        }
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    /* ---------------- SCENE MANAGER ---------------- */
    const sceneManager = new SceneManager(canvasContainerRef.current);

    /* ---------------- LOADING MANAGER ---------------- */
    THREE.DefaultLoadingManager.onProgress = function (
      url,
      itemsLoaded,
      itemsTotal
    ) {
      setLoadingProgress(itemsLoaded / itemsTotal);
    };

    /* ---------------- ENVIRONMENT ---------------- */
    const env = new Environment();
    env.loadHDR(
      "/textures/environment/studio_small_08_1k--faded.hdr",
      sceneManager.scene
    );

    /* ---------------- TEXTURES ---------------- */
    const textureLoader = new THREE.TextureLoader();

    const diffuseMap = textureLoader.load("/textures/head/diffuse.webp");
    diffuseMap.colorSpace = THREE.SRGBColorSpace;
    const normalMap = textureLoader.load("/textures/head/normal.webp");
    const roughnessMap = textureLoader.load("/textures/head/roughness.webp");
    const alphaMap = textureLoader.load("/textures/head/alpha.webp");
    const depthMap = textureLoader.load("/textures/head/depth.webp");

    const helmetBaseColor = textureLoader.load(
      "/textures/helmet/gold/baseColor.webp"
    );
    helmetBaseColor.colorSpace = THREE.SRGBColorSpace;
    const helmetMetallic = textureLoader.load(
      "/textures/helmet/mettalic.webp"
    );
    const helmetNormal = textureLoader.load("/textures/helmet/normal.webp");
    const helmetRoughness = textureLoader.load(
      "/textures/helmet/roughness.webp"
    );

    [helmetBaseColor, helmetMetallic, helmetNormal, helmetRoughness].forEach(
      (tex) => {
        tex.center.set(0.5, 0.5);
        tex.rotation = Math.PI / 2;
      }
    );

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
    // Background shader removed

    /* ---------------- TRAIL MANAGER ---------------- */
    const trailManager = new TrailManager(sceneManager.camera, globalParams);

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

    sceneManager.scene.add(face);

    /* ---------------- FLUID & SHADERS ---------------- */
    const scanFluidUniforms = createFluidUniforms(helmetParams);
    const fadingFluidUniforms = createFluidUniforms(maskParams);

    const scanWireframeMaterial = createScanMaterial(
      scanFluidUniforms,
      helmetParams,
      globalParams
    );
    const fadingWireframeMaterial = createFadingWireframeMaterial(
      fadingFluidUniforms,
      maskParams
    );

    /* ---------------- LOAD MASK MODEL ---------------- */
    const baseMaskPos = { x: 0, y: 0.04, z: 0.53 };
    const baseMaskRot = { x: -Math.PI / 2, y: 0, z: 0 };

    let maskGroups = null;

    loadRevealingModel("/models/kitsune_mask.glb", sceneManager.scene, {
      wireframeMaterial: fadingWireframeMaterial,
      fluidUniforms: fadingFluidUniforms,
      position: baseMaskPos,
      scale: { x: 0.85, y: 0.85, z: 0.85 },
      rotation: baseMaskRot,
      id: "mask",
      solidRenderOrder: 1,
      wireframeRenderOrder: 2,
    }).then((groups) => {
      maskGroups = groups;
      trailManager.addTrackable(
        groups.solidGroup,
        -0.5,
        fadingFluidUniforms,
        maskParams.trailDecaySpeed,
        "mask"
      );

      // Fallback trigger
      setLoadingProgress(1);
      window.portfolio3DLoaded = true;
      window.dispatchEvent(new Event("portfolio-3d-loaded"));
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

      const currentY =
        params.maxY - state.progress * (params.maxY - params.minY);
      material.uniforms.uScanPos.value = currentY;
    }

    /* ---------------- ANIMATE ---------------- */
    let animationId;

    function animate() {
      animationId = requestAnimationFrame(animate);

      const delta = sceneManager.getDelta();
      const elapsedTime = sceneManager.getElapsedTime();

      scanFluidUniforms.uTime.value = elapsedTime;
      fadingFluidUniforms.uTime.value = elapsedTime;

      const fadeValue =
        (Math.sin(elapsedTime * maskParams.fadeSpeed) + 1.0) / 2.0;
      fadingWireframeMaterial.uniforms.uOpacity.value = fadeValue;

      trailManager.update(delta);

      const mouseP = trailManager.mouseP;

      if (face) {
        face.position.x =
          baseFacePos.x + mouseP.currentX * globalParams.parallaxSpeedFace;
        face.position.y =
          baseFacePos.y - mouseP.currentY * globalParams.parallaxSpeedFace;
        face.rotation.y =
          mouseP.currentX * (globalParams.parallaxSpeedFace / 2);
        face.rotation.x =
          mouseP.currentY * (globalParams.parallaxSpeedFace / 2);
      }

      if (maskGroups) {
        const { solidGroup, wireframeGroup } = maskGroups;
        wireframeGroup.position.x =
          baseMaskPos.x + mouseP.currentX * maskParams.parallaxSpeed;
        wireframeGroup.position.z =
          baseMaskPos.z - mouseP.currentY * maskParams.parallaxSpeed;
        wireframeGroup.rotation.x =
          baseMaskRot.x +
          mouseP.currentY * (maskParams.parallaxSpeed / 2);
        wireframeGroup.rotation.z =
          baseMaskRot.z +
          mouseP.currentX * (maskParams.parallaxSpeed / 2);
        wireframeGroup.rotation.y = baseMaskRot.y;

        solidGroup.position.copy(wireframeGroup.position);
        solidGroup.rotation.copy(wireframeGroup.rotation);
      }

      updatePulse(helmetState, helmetParams, scanWireframeMaterial, delta);

      sceneManager.render();
    }

    animate();

    /* ---------------- CLEANUP ---------------- */
    return () => {
      cancelAnimationFrame(animationId);

      trailManager.dispose();
      sceneManager.dispose();
      window.portfolio3DLoaded = false;
    };
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>


      {/* Canvas Container — both WebGL renderers mount here */}
      <div ref={canvasContainerRef} />

      {/* Hero Dissolve Effect Overlay */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh", zIndex: 3, pointerEvents: "none" }}>
        <HeroDissolve />
      </div>

      {/* Navbar moved outside of ui-layer to sit on top of 3d models */}
      <Navbar onMenuToggle={toggleMenu} menuOpen={menuOpen} />

      {/* UI Overlay Layer */}
      <section style={{ position: "relative", width: "100%", height: "100vh" }}>
        <div id="ui-layer">
          <HeroSection />
        </div>
      </section>

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay isOpen={menuOpen} onClose={closeMenu} />

      {/* Who Am I Section */}
      <WhoAmISection />

      {/* ASCII Hands Section */}
      <AsciiHands />

      {/* What I Ship Section */}
      <WhatIShipSection />

      {/* See More Work Section */}
      <SeeMoreWorkSection />

      {/* Why Choose Me Section */}
      <WhyChooseMeSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </>
  );
}
