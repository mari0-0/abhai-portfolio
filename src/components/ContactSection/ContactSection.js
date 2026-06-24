"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ContactSection.css";

export default function ContactSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(containerRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      <div className="contact-container" ref={containerRef}>
        <div className="contact-heading-wrap">
          <span className="contact-label">( Contact )</span>
          <h2 className="contact-heading">Big Ideas Deserve Great Execution.</h2>
        </div>

        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="contact-input-group">
            <div className="contact-row">
              <div className="contact-input-wrap">
                <input
                  type="text"
                  className="contact-input"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="contact-input-wrap">
                <input
                  type="email"
                  className="contact-input"
                  placeholder="Your Email"
                  required
                />
              </div>
            </div>
            
            <div className="contact-input-wrap">
              <textarea
                className="contact-textarea"
                placeholder="Tell me about your project..."
                required
              ></textarea>
            </div>
          </div>

          <button type="submit" className="contact-submit">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
