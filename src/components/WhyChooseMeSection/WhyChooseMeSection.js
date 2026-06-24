"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./WhyChooseMeSection.css";

export default function WhyChooseMeSection() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = cardsRef.current.filter(Boolean);

    gsap.fromTo(cards,
      {
        y: 100,
        opacity: 0,
        scale: 0.95
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === containerRef.current) {
          t.kill();
        }
      });
    };
  }, []);

  return (
    <section id="whychooseme" className="why-choose-me-section" ref={containerRef}>
      <div className="why-choose-me-header">
        <div className="why-choose-me-label">( Why Choose Me )</div>
      </div>
      <div className="why-choose-me-container">
        <div className="bento-grid">
          {/* Card 1 */}
          <div 
            className="bento-card card-pixel-perfect"
            ref={el => { if (el) cardsRef.current[0] = el; }}
          >
            <div className="bento-graphic">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
            <div className="bento-card-content">
              <h3>Pixel-Perfect Engineering</h3>
              <p>I bridge the gap between design and development, ensuring every UI matches the creative vision down to the last pixel with fluid responsiveness across all devices.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            className="bento-card card-performance"
            ref={el => { if (el) cardsRef.current[1] = el; }}
          >
            <div className="bento-graphic">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
            <div className="bento-card-content">
              <h3>Performance Obsessed</h3>
              <p>Optimized assets, clean architecture, and rapid load times. I build apps that feel instantly responsive.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            className="bento-card card-animations"
            ref={el => { if (el) cardsRef.current[2] = el; }}
          >
            <div className="bento-graphic">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20"></path>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div className="bento-card-content">
              <h3>Fluid Animations</h3>
              <p>Expertise in GSAP and WebGL to create memorable, premium user interactions.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div 
            className="bento-card card-fullstack"
            ref={el => { if (el) cardsRef.current[3] = el; }}
          >
            <div className="bento-graphic">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
            </div>
            <div className="bento-card-content">
              <h3>Full-Stack Capability</h3>
              <p>From complex database architectures to real-time client state management, I deliver robust end-to-end solutions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
