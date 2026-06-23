"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./WhoAmISection.css";

export default function WhoAmISection() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const wordsRef = useRef([]);

  const text = "I am Abhai a frontend, full stack developer and a fresh grad with deep experience in practical knowledge.";
  const words = text.split(" ");

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
          start: "top 75%",
        }
      });

      // Words stagger animation
      gsap.to(wordsRef.current, {
        y: "0%",
        duration: 1.2,
        stagger: 0.04,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="who-am-i-section" ref={sectionRef}>
      <div className="who-am-i-label" ref={labelRef}>( Who Am I )</div>
      <div className="who-am-i-container">
        <h2 className="who-am-i-text">
          {words.map((word, i) => (
            <span key={i} className="word-wrap">
              <span className="word" ref={el => wordsRef.current[i] = el}>
                {word}
              </span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
