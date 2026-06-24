"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { blurReveal } from "@/utils/blurReveal";
import "@/utils/blurReveal.css";
import CatSprite from "./CatSprite";
import "./WhoAmISection.css";

export default function WhoAmISection() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Label animation
      gsap.to(labelRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 45%",
        }
      });

      // Words blur reveal on scroll — using the utility
      blurReveal(textRef.current, sectionRef.current, {
        start: "top 45%",
        end: "center center",
        highlightIndices: [2, 4, 5, 13, 14, 20, 21],
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="who-am-i-section" ref={sectionRef}>
      <div className="who-am-i-header">
        <div className="who-am-i-label" ref={labelRef}>( WhoAmI )</div>
        <CatSprite />
      </div>
      <div className="who-am-i-container">
        <h2 className="who-am-i-text" ref={textRef}>
          I am Abhai, a full-stack developer and recent graduate. I specialize in crafting modern, interactive web experiences driven by deep practical knowledge.
        </h2>
      </div>
    </section>
  );
}
