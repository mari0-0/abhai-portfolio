"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./WhatIShipSection.css";

const shipData = [
  {
    id: "01",
    title: "High-Performance Full Stack Platforms",
    desc: "I architect and deploy scalable, responsive web applications. By bridging elegant UI/UX design with robust backend microservices, I deliver platforms optimized for speed, user retention, and seamless interactions.",
    highlights: [
      "Optimized frontend load speeds by 35% for high-traffic gaming apps.",
      "Built stateful session management and real-time backend microservices."
    ],
    techStack: ["React.js", "Next.js", "Node.js", "Express.js", "Tailwind CSS"],
    bgColor: "var(--color-surface)",
    textColor: "var(--color-text-primary)",
  },
  {
    id: "02",
    title: "Secure Web3 & Blockchain Systems",
    desc: "I engineer decentralized applications, cross-chain token bridges, and secure multi-currency payment infrastructures. With a deep understanding of EVM mechanics and smart contract vulnerabilities, I ensure zero-loss crypto transactions.",
    highlights: [
      "Integrated secure webhooks processing hundreds of daily crypto transactions.",
      "Conducted deep-dive smart contract audits for reentrancy and overflows."
    ],
    techStack: ["Solidity", "Ethers.js", "Hardhat", "Rust", "Smart Contracts"],
    bgColor: "var(--color-primary)",
    textColor: "var(--color-text-primary)",
  },
  {
    id: "03",
    title: "Real-Time Distributed Architecture",
    desc: "I build complex, low-latency systems capable of handling concurrent data synchronization and high-frequency live events. From live casino betting feeds to collaborative workspaces, I ensure real-time data consistency.",
    highlights: [
      "Engineered WebSockets and Redis Pub/Sub systems with sub-50ms latency.",
      "Implemented CRDTs for concurrent edits in collaborative applications."
    ],
    techStack: ["WebSockets", "Redis", "Socket.io", "PostgreSQL", "MongoDB"],
    bgColor: "var(--color-secondary)",
    textColor: "var(--color-background)",
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
    <section className="what-i-ship-section" id="whatiship" ref={sectionRef}>
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
                  <div className="ship-card__highlights">
                    <h4 className="ship-card__highlights-title">Key Achievements</h4>
                    <ul className="ship-card__highlights-list">
                      {data.highlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="ship-card__tech-stack">
                    {data.techStack.map((tech, i) => (
                      <span key={i} className="ship-card__tech-pill">
                        {tech}
                      </span>
                    ))}
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
