"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./WhatIShipSection.css";

const shipData = [
  {
    id: "01",
    title: "Branding that drives conversion & funding.",
    desc: "We clarify your positioning, define a distinctive tone of voice, and build a visual system that works across acquisition and product. Each sprint ships a robust logo, pragmatic brand guidelines, and a social kit so you can launch fast. The goal is simple: perceived value up.",
    testimonial: "Working with Brand Appart has been an absolute pleasure. Beyond their creativity and professionalism, there's a real sense of kindness and care in everything they do.",
    authorName: "Jérémy Bendayan",
    authorRole: "Co-founder & COO @Jaws Group",
    bgColor: "var(--color-surface)", // Alternatively, a custom blue if requested, but using palette color
    textColor: "var(--color-text-primary)",
  },
  {
    id: "02",
    title: "Product experiences users adopt & keep using",
    desc: "We start from business goals, map the critical journeys, and prototype what actually moves the needle. Every sprint ships clear flows, a reusable UI library, and a dev-ready. Expect time-to-value down, UX friction down, retention/NPS up.",
    testimonial: "A huge thank you to the entire team for your outstanding work on our rebranding! We're thrilled to have you as an integral part of the team.",
    authorName: "Théo Cesarini",
    authorRole: "CEO & Co-Founder @Incard",
    bgColor: "var(--color-primary)",
    textColor: "var(--color-text-primary)",
  },
  {
    id: "03",
    title: "Websites that tell your story & convert",
    desc: "Your website is your best salesperson. We design and build high-performance, accessible, and stunning websites using modern frameworks. We ensure it's not just beautiful, but highly optimized for search engines and user experience.",
    testimonial: "The new website completely changed how our clients perceive us. The interactive elements and smooth transitions make a huge difference.",
    authorName: "Sarah Jenkins",
    authorRole: "CMO @TechFlow",
    bgColor: "var(--color-secondary)",
    textColor: "var(--color-background)", // Dark text for yellow background
  }
];

export default function WhatIShipSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Create a timeline mapped to the scroll distance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${shipData.length * 400}vh`, // Increased pinning distance for longer duration
          pin: containerRef.current,
          scrub: 1, // Smooth scrubbing
        }
      });

      // Initial state: offset and scale down cards that are in the back
      cardsRef.current.forEach((card, index) => {
        if (index > 0) {
          gsap.set(card, {
            scale: 1 - index * 0.05, // e.g., index 1 = 0.95, index 2 = 0.90
            y: `${index * 5}vh`, // Offset downwards by 5vh per index
          });
        }
      });

      // Sequence the cards in the timeline
      cardsRef.current.forEach((card, index) => {
        if (index === cardsRef.current.length - 1) return; // Last card stays

        // Top card moves out
        tl.to(card, {
          y: "-110vh", // Move completely out of the viewport
          scale: 0.85, // Scale down noticeably
          rotateX: 50, // Prominent 3D tilt backwards
          ease: "none",
        }, index); // Start at timeline relative index to sequence correctly

        // Cards behind it grow and move up to their new positions
        cardsRef.current.slice(index + 1).forEach((nextCard, i) => {
          // Calculate how far back this card WILL be after the current scroll step
          const newIndexPos = i;

          tl.to(nextCard, {
            scale: 1 - newIndexPos * 0.05,
            y: `${newIndexPos * 5}vh`,
            ease: "none",
          }, index); // Sync with the top card moving out
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="what-i-ship-section" ref={sectionRef}>
      {/* Container that gets pinned */}
      <div className="what-i-ship-pinned" ref={containerRef}>

        <div className="what-i-ship-header">
          <div className="what-i-ship-label">( What I Ship )</div>
        </div>

        <div className="what-i-ship-cards-container">
          <div className="what-i-ship-cards-wrapper">
            {shipData.map((data, index) => (
              <div
                key={data.id}
                className="ship-card"
                ref={(el) => (cardsRef.current[index] = el)}
                style={{
                  backgroundColor: data.bgColor,
                  color: data.textColor,
                  zIndex: (shipData.length - index) + 10, // Top cards have higher z-index and are above the header
                }}
              >
                <div className="ship-card__top">
                  <div className="ship-card__content">
                    <h3 className="ship-card__title">{data.title}</h3>
                    <p className="ship-card__desc">{data.desc}</p>
                  </div>
                  <div className="ship-card__number">({data.id})</div>
                </div>

                <div className="ship-card__bottom">
                  <div className="ship-card__testimonial">
                    <p>{data.testimonial}</p>
                    <div className="ship-card__author">
                      <div className="ship-card__author-avatar"></div>
                      <div className="ship-card__author-info">
                        <h4>{data.authorName}</h4>
                        <p>{data.authorRole}</p>
                      </div>
                    </div>
                  </div>

                  <div className="ship-card__images">
                    {/* Placeholder for images as seen in design */}
                    <div className="ship-card__image-box" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                    <div className="ship-card__image-box" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}></div>
                    <div className="ship-card__image-box" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                    <div className="ship-card__image-box" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
