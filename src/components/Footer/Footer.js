"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Footer.css";

export default function Footer() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const linksRef = useRef([]);
  const titleRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!canvasRef.current || !containerRef.current) return;

    /* ---------------- THREE.JS SETUP ---------------- */
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    // Load Model
    let maskGroup = null;
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/models/kitsune_mask.glb",
      (gltf) => {
        maskGroup = gltf.scene;
        const baseMaskRot = { x: 0, y: 0, z: 0 };

        // Ensure default rotation is set properly so it faces forward
        maskGroup.rotation.set(baseMaskRot.x, baseMaskRot.y, baseMaskRot.z);
        maskGroup.userData.baseRot = { ...baseMaskRot }; // Save for animate loop
        
        const isMobile = window.innerWidth <= 768;
        const scale = isMobile ? 0.005 : 0.008;
        const posY = isMobile ? -0.2 : 0.5;
        
        maskGroup.scale.set(scale, scale, scale);
        maskGroup.position.set(0, posY, 0);

        // Keep the original materials and textures from the GLB
        // Optionally adjust existing materials if needed:
        maskGroup.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.envMapIntensity = 2.0; // Enhance lighting reflection
          }
        });

        scene.add(maskGroup);

        // Fade in animation for the mask relative to its set position
        gsap.from(maskGroup.position, {
          y: "-=1.5", // Start 1.5 units below the set position
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "center center",
            scrub: true,
          }
        });
      },
      undefined,
      (error) => {
        console.error("Error loading kitsune mask:", error);
      }
    );

    /* ---------------- MOUSE INTERACTION ---------------- */
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    /* ---------------- ANIMATION LOOP ---------------- */
    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      // Lerp mask rotation
      if (maskGroup && maskGroup.userData.baseRot) {
        // Base rotation + mouse offset
        mouse.x += (mouse.targetX - mouse.x) * 5 * delta;
        mouse.y += (mouse.targetY - mouse.y) * 5 * delta;

        // Apply to rotation (adjust multipliers for sensitivity)
        maskGroup.rotation.y = maskGroup.userData.baseRot.y + mouse.x * 0.8;
        maskGroup.rotation.x = maskGroup.userData.baseRot.x - mouse.y * 0.5;
        maskGroup.rotation.z = maskGroup.userData.baseRot.z;
      }

      renderer.render(scene, camera);
    };
    animate();

    /* ---------------- RESIZE ---------------- */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    /* ---------------- GSAP UI ANIMATIONS ---------------- */

    // Links reveal
    gsap.to(linksRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        refreshPriority: -1,
      }
    });

    // Ensure parent is visible since we removed CSS hiding
    gsap.set(titleRef.current, { opacity: 1, y: 0 });

    // Title parallax scrub per letter
    const letters = gsap.utils.toArray(titleRef.current.querySelectorAll("span"));
    const distances = [1050, -250, 500, -500, 850, 0, -300, 1550, -450, 900, -100];

    gsap.fromTo(letters,
      {
        y: (i) => distances[i % distances.length],
      },
      {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "center center",
          scrub: true,
          refreshPriority: -1,
        }
      }
    );

    // Navbar hide/show when footer enters
    gsap.to(".navbar", {
      yPercent: -100,
      duration: 0.5,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 30%", // Trigger when footer fills 70% of the viewport
        toggleActions: "play none none reverse", // Play on enter, reverse on leave back
        refreshPriority: -1,
      }
    });

    /* ---------------- CLEANUP ---------------- */
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      dracoLoader.dispose();
    };
  }, []);

  return (
    <footer className="footer" ref={containerRef}>
      {/* 3D Background Canvas */}
      <div className="footer-canvas-container">
        <canvas ref={canvasRef} />
      </div>

      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-links left-links">
            <h3 className="footer-subtitle">Let's work together</h3>
            {[
              { label: "Get in Touch", href: "/#contact" },
              { label: "abhaimatta@gmail.com", href: "mailto:abhaimatta@gmail.com" },
              { label: "WhatsApp", href: "https://wa.me/919026137470" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/abhaimatta" },
              { label: "GitHub", href: "https://github.com/mari0-0" },
            ].map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link-item"
                data-text={link.label}
                ref={el => linksRef.current[index] = el}
              >
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          <div className="footer-links right-links">
            {[
              { label: "WHOAMI", href: "#whoami" },
              { label: "WHAT I SHIP", href: "#whatiship" },
              { label: "PROJECTS", href: "/projects" },
              { label: "WHY CHOOSE ME", href: "#whychooseme" },
            ].map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                className="footer-link-item"
                data-text={link.label}
                ref={el => linksRef.current[3 + index] = el}
              >
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <h1 className="footer-title" ref={titleRef}>
            <span>A</span>
            <span>B</span>
            <span>H</span>
            <span>A</span>
            <span>I</span>
            <span>&nbsp;</span>
            <span>M</span>
            <span>A</span>
            <span>T</span>
            <span>T</span>
            <span>A</span>
          </h1>
        </div>
      </div>
    </footer>
  );
}
