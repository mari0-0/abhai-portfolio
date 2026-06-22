"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WhatIOffer() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    // Only activate horizontal scroll on non-mobile
    if (window.innerWidth <= 768) return;

    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        const rightPadding = section.clientWidth * 0.25;
        return track.scrollWidth - section.clientWidth + rightPadding;
      };

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    // Refresh on resize
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section className="what-i-offer" id="what-i-offer" ref={sectionRef}>
      <div className="offer-header">
        <span className="offer-label">SERVICES</span>
        <h2 className="offer-heading">What I Offer</h2>
      </div>
      <div className="offer-track" ref={trackRef}>
        {/* Card 01 */}
        <div className="offer-card">
          <div className="offer-card__top">
            <div className="offer-card__icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <span className="offer-card__number">01</span>
          </div>
          <h3 className="offer-card__title">
            Full Stack
            <br />
            Development
          </h3>
          <hr className="offer-card__divider" />
          <p className="offer-card__desc">
            Building scalable and high-performance web applications using
            Next.js, React, Node.js, and TypeScript, with robust backend
            architectures, secure RESTful APIs, and clean code practices.
          </p>
        </div>

        {/* Card 02 */}
        <div className="offer-card">
          <div className="offer-card__top">
            <div className="offer-card__icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <span className="offer-card__number">02</span>
          </div>
          <h3 className="offer-card__title">
            UI/UX Design &amp;
            <br />
            Frontend
          </h3>
          <hr className="offer-card__divider" />
          <p className="offer-card__desc">
            Designing modern, responsive interfaces with Figma, Tailwind CSS,
            and Framer Motion. Creating intuitive experiences with clean design
            systems and pixel-perfect implementations.
          </p>
        </div>

        {/* Card 03 */}
        <div className="offer-card">
          <div className="offer-card__top">
            <div className="offer-card__icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <span className="offer-card__number">03</span>
          </div>
          <h3 className="offer-card__title">
            SaaS Platform
            <br />
            Development
          </h3>
          <hr className="offer-card__divider" />
          <p className="offer-card__desc">
            Developing end-to-end SaaS solutions with subscription systems,
            Stripe billing, and multi-tenant management. Ensuring scalability
            and secure user management.
          </p>
        </div>

        {/* Card 04 */}
        <div className="offer-card">
          <div className="offer-card__top">
            <div className="offer-card__icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <line x1="12" y1="1" x2="12" y2="5"></line>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="1" y1="12" x2="5" y2="12"></line>
                <line x1="19" y1="12" x2="23" y2="12"></line>
              </svg>
            </div>
            <span className="offer-card__number">04</span>
          </div>
          <h3 className="offer-card__title">
            API &amp; System
            <br />
            Architecture
          </h3>
          <hr className="offer-card__divider" />
          <p className="offer-card__desc">
            Designing maintainable APIs with PostgreSQL, Prisma, and MongoDB.
            Focusing on performance optimization, security best practices, and
            reliable data flow.
          </p>
        </div>
      </div>
    </section>
  );
}
