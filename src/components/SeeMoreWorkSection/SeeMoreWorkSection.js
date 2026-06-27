"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTransitionRouter } from "next-transition-router";
import { projects } from "@/data/projectsData";
import "./SeeMoreWorkSection.css";

const getThumbnail = (proj) => {
  return proj.thumbnailMobile || proj.thumbnail || proj.heroImage;
};

const isVideo = (url) => url && url.endsWith('.mp4');

export default function SeeMoreWorkSection() {
  const ringRef = useRef(null);
  const router = useTransitionRouter();
  const [radius, setRadius] = useState("38vh");
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setRadius("18vh");
      } else if (window.innerWidth <= 1024) {
        setRadius("28vh");
      } else {
        setRadius("42vh");
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Create continuous rotation tween
    const rotationTween = gsap.to(ringRef.current, {
      rotation: 360,
      duration: 25, // Base slow rotation
      repeat: -1,
      ease: "none",
    });

    // Scroll trigger to modify timescale based on velocity globally
    let returnTimeout;

    const returnToNormal = () => {
      gsap.to(rotationTween, {
        timeScale: 1,
        duration: 0.8,
        ease: "power1.in",
        overwrite: true
      });
    };

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity());
        // Base timeScale is 1. Absolute velocity makes it spin faster.
        const targetTimeScale = 1 + velocity / 200;

        gsap.to(rotationTween, {
          timeScale: targetTimeScale,
          duration: 0.1,
          overwrite: true
        });

        // Reset the deceleration timer on every scroll tick
        if (returnTimeout) returnTimeout.kill();
        returnTimeout = gsap.delayedCall(0.1, returnToNormal);
      }
    });

    return () => {
      if (returnTimeout) returnTimeout.kill();
      st.kill();
      rotationTween.kill();
    };
  }, []);

  // Prepare 9 cards by repeating projects if necessary
  const cards = Array.from({ length: 9 }).map((_, i) => projects[i % projects.length]);

  return (
    <section className="see-more-section" onClick={() => router.push("/projects")}>
      <div className="see-more-center-text">
        <h2>See more<br />work</h2>
      </div>

      <div className="see-more-ring-scaler">
        <div className="see-more-ring" ref={ringRef}>
          {cards.map((proj, i) => (
            <div
              className="see-more-card-wrapper"
              key={i}
              style={{ transform: `rotate(${i * 40}deg) translateY(-${radius})` }}
            >
              <div className="see-more-card">
                {isVideo(getThumbnail(proj)) ? (
                  <video src={getThumbnail(proj)} autoPlay loop muted playsInline style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: 'inherit' }} />
                ) : (
                  <img src={getThumbnail(proj)} alt={proj.title} style={getThumbnail(proj).endsWith('.svg') ? { objectFit: 'contain', padding: '1.2rem', backgroundColor: '#111' } : {}} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
