"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CatSprite.css";

export default function CatSprite() {
  const [action, setAction] = useState("walking"); // "walking" | "scratching"
  const [frame, setFrame] = useState(77);
  const containerRef = useRef(null);

  useEffect(() => {
    // Frame animation loop
    const speed = action === "walking" ? 100 : 150;
    const interval = setInterval(() => {
      setFrame((prev) => {
        if (action === "walking") {
          return prev >= 84 ? 77 : prev + 1;
        } else {
          return prev >= 450 ? 429 : prev + 1;
        }
      });
    }, speed);

    return () => clearInterval(interval);
  }, [action]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initial position: 50vw to the right of the center
    gsap.set(containerRef.current, {
      xPercent: -50,
      yPercent: -50,
      x: "30vw"
    });

    // Walk animation
    gsap.to(containerRef.current, {
      x: 0,
      duration: 3,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        once: true,
      },
      onComplete: () => {
        setAction("scratching");
        setFrame(429);
      }
    });
  }, []);

  const folder = action === "walking" ? "cat_walking_sprite" : "cat_scratching_sprite";

  return (
    <div className="cat-sprite-container" ref={containerRef}>
      <img
        src={`/${folder}/${frame}.png`}
        alt={`Cat ${action}`}
        className="cat-sprite-img"
      />
    </div>
  );
}
