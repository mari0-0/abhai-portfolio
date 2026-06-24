"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ContactSection.css";

export default function ContactSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from([labelRef.current, ...containerRef.current.children], {
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
      <div className="contact-label-wrap" ref={labelRef}>
        <span className="contact-label">( Get in Touch )</span>
      </div>
      <div className="contact-container" ref={containerRef}>
        <div className="contact-left">
          <div className="contact-heading-wrap">
            <h2 className="contact-heading">Big Ideas Deserve<br />Great Execution.</h2>
          </div>
          <div className="contact-socials">
            <a href="mailto:abhaimatta@gmail.com" className="contact-social-link">abhaimatta@gmail.com</a>
            <a href="https://wa.me/919026137470" target="_blank" rel="noopener noreferrer" className="contact-social-link">WhatsApp (+919026137470)</a>
            <a href="https://www.linkedin.com/in/abhaimatta" target="_blank" rel="noopener noreferrer" className="contact-social-link">LinkedIn</a>
          </div>
        </div>

        <div className="contact-right">
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
      </div>
    </section>
  );
}
