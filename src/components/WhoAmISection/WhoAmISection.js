"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CatSprite from "./CatSprite";
import "./WhoAmISection.css";

export default function WhoAmISection() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const wordsRef = useRef([]);

  const wordsData = [
    { text: "I", highlight: false },
    { text: "am", highlight: false },
    { text: "Abhai,", highlight: true },
    { text: "a", highlight: false },
    { text: "full-stack", highlight: true },
    { text: "developer", highlight: true },
    { text: "and", highlight: false },
    { text: "recent", highlight: false },
    { text: "graduate.", highlight: false },
    { text: "I", highlight: false },
    { text: "specialize", highlight: false },
    { text: "in", highlight: false },
    { text: "crafting", highlight: false },
    { text: "modern,", highlight: true },
    { text: "interactive", highlight: true },
    { text: "web", highlight: false },
    { text: "experiences", highlight: false },
    { text: "driven", highlight: false },
    { text: "by", highlight: false },
    { text: "deep", highlight: false },
    { text: "practical", highlight: true },
    { text: "knowledge.", highlight: true },
  ];

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

      // Words blur reveal on scroll
      gsap.to(wordsRef.current, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 45%",
          end: "center center",
          scrub: true,
        }
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
        <h2 className="who-am-i-text">
          {wordsData.map((w, i) => (
            <span key={i} className="word-wrap">
              <span
                className={`word ${w.highlight ? 'highlight' : ''}`}
                ref={el => wordsRef.current[i] = el}
              >
                {w.text}
              </span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
