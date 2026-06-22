"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getNextProject, projects } from "@/data/projectsData";
import Navbar from "@/components/Navbar/Navbar";
import MobileMenuOverlay from "@/components/MobileMenuOverlay/MobileMenuOverlay";
import "./ProjectDetail.css";

/* ── tiny SVG icons ──────────────────────────────────────────── */
const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);

export default function ProjectDetail({ project }) {
  const router = useRouter();
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const introRef = useRef(null);
  const sectionRefs = useRef([]);
  const nextProjectRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isHoveringNext, setIsHoveringNext] = useState(false);
  const [isHoveringHero, setIsHoveringHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const heroCursorRef = useRef(null);
  const nextCursorRef = useRef(null);
  const heroXTo = useRef(null);
  const heroYTo = useRef(null);
  const nextXTo = useRef(null);
  const nextYTo = useRef(null);

  const gsapCtxRef = useRef(null);
  const isTransitioningRef = useRef(false);

  const nextProject = getNextProject(project.slug);

  /* ── scroll-to-section helper ──────────────────────────────── */
  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /* ── Route Change Cooldown ─────────────────────────────────── */
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [project.slug]);

  /* ── GSAP setup ────────────────────────────────────────────── */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize GSAP custom cursors
    gsap.set([heroCursorRef.current, nextCursorRef.current], { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
    heroXTo.current = gsap.quickTo(heroCursorRef.current, "x", { duration: 0.15, ease: "power3.out" });
    heroYTo.current = gsap.quickTo(heroCursorRef.current, "y", { duration: 0.15, ease: "power3.out" });
    nextXTo.current = gsap.quickTo(nextCursorRef.current, "x", { duration: 0.15, ease: "power3.out" });
    nextYTo.current = gsap.quickTo(nextCursorRef.current, "y", { duration: 0.15, ease: "power3.out" });

    const handleMouseMove = (e) => {
      if (heroXTo.current) heroXTo.current(e.clientX);
      if (heroYTo.current) heroYTo.current(e.clientY);
      if (nextXTo.current) nextXTo.current(e.clientX);
      if (nextYTo.current) nextYTo.current(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);

    const ctx = gsap.context(() => {
      const CUSTOM_EASE = "expo.out";

      gsap.set(containerRef.current, { visibility: "visible" });

      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: "none",
      });

      const navEl = containerRef.current.querySelector(".project-hero__nav");
      if (navEl) {
        gsap.from(navEl, {
          y: -50,
          opacity: 0,
          duration: 1.2,
          ease: CUSTOM_EASE,
          delay: 0.1,
        });
      }

      const metaEl = containerRef.current.querySelector(".project-hero__meta");
      if (metaEl) {
        gsap.from(metaEl, {
          x: 50,
          opacity: 0,
          duration: 1.2,
          ease: CUSTOM_EASE,
          delay: 0.2,
        });
      }

      const bottomEls = containerRef.current.querySelectorAll(
        ".project-hero__title, .project-hero__footer"
      );
      if (bottomEls.length) {
        gsap.from(bottomEls, {
          y: 50,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: CUSTOM_EASE,
          delay: 0.3,
        });
      }

      if (heroRef.current) {
        gsap.to(heroRef.current.querySelector(".project-hero__image"), {
          yPercent: 15,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=100vh",
            scrub: true,
          },
        });
      }

      if (introRef.current) {
        const introTexts = introRef.current.querySelectorAll(
          ".project-intro__text"
        );
        introTexts.forEach((el, i) => {
          gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            delay: i * 0.15,
          });
        });
      }

      sectionRefs.current.forEach((el) => {
        if (!el) return;
        const heading = el.querySelector(".project-section__heading");
        const body = el.querySelector(".project-section__body");
        const img = el.querySelector(".project-section__image");

        if (heading) {
          gsap.from(heading, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        }
        if (body) {
          gsap.from(body, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: body,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });
        }
        if (img) {
          gsap.from(img, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: img,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          });
        }
      });

      sectionRefs.current.forEach((el, i) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 40%",
          end: "bottom 40%",
          onEnter: () => setActiveSection(i),
          onEnterBack: () => setActiveSection(i),
        });
      });
    }, containerRef);

    gsapCtxRef.current = ctx;

    return () => {
      if (gsapCtxRef.current) gsapCtxRef.current.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [project.slug, nextProject.slug, router]);

  useEffect(() => {
    gsap.to(heroCursorRef.current, { scale: isHoveringHero ? 1 : 0, opacity: isHoveringHero ? 1 : 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
  }, [isHoveringHero]);

  useEffect(() => {
    gsap.to(nextCursorRef.current, { scale: isHoveringNext ? 1 : 0, opacity: isHoveringNext ? 1 : 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
  }, [isHoveringNext]);

  /* ── RENDER ────────────────────────────────────────────────── */
  return (
    <div
      className="project-page"
      ref={containerRef}
      style={{ opacity: 0, visibility: "hidden" }}
    >
      {/* ============ HERO SECTION ============ */}
      <section ref={heroRef} className="project-hero">
        <div
          className="project-hero__image-wrapper"
          onMouseEnter={() => setIsHoveringHero(true)}
          onMouseLeave={() => setIsHoveringHero(false)}
          onClick={() => {
            if (introRef.current) {
              introRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <img
            src={project.heroImage}
            alt={project.title}
            className="project-hero__image"
          />
          <div className="project-hero__overlay" />
        </div>

        <div className="project-hero__cursor" ref={heroCursorRef}>
          READ
        </div>

        {/* Nav */}
        <div className="project-hero__nav" style={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 50 }}>
          <Navbar menuOpen={menuOpen} onMenuToggle={() => setMenuOpen(!menuOpen)} />
        </div>
        <MobileMenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

        {/* Metadata */}
        <div className="project-hero__meta">
          <div className="project-hero__meta-group">
            <span className="project-hero__meta-label">Role</span>
            <span className="project-hero__meta-value">{project.role}</span>
          </div>
          <div className="project-hero__meta-group">
            <span className="project-hero__meta-label">Services</span>
            {project.services.map((s, i) => (
              <span key={i} className="project-hero__meta-value">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h1 className="project-hero__title">{project.title}</h1>

        {/* Footer */}
        <div className="project-hero__footer">
          <span className="project-hero__year">© {project.year}</span>
          <span className="project-hero__scroll-hint">(Scroll down)</span>
        </div>
      </section>

      {/* Everything below scrolls over the fixed hero */}
      <div className="project-scroll-content">
        {/* ============ INTRO OVERLAP ============ */}
        <section ref={introRef} className="project-intro">
          <span className="project-intro__label">(Intro)</span>
          {project.intro.map((text, i) => (
            <p
              key={i}
              className={`project-intro__text ${i === 0 ? "project-intro__text--faded" : ""
                }`}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ))}
        </section>

        {/* ============ CONTENT BODY ============ */}
        <section className="project-content">
          {/* Sidebar */}
          <aside className="project-sidebar">
            <span className="project-sidebar__label">Summary</span>
            {project.sections.map((sec, i) => (
              <button
                key={sec.id}
                className={`project-sidebar__link ${activeSection === i ? "is-active" : ""
                  }`}
                onClick={() => scrollToSection(sec.id)}
              >
                <span className="project-sidebar__dot" />
                {sec.heading}
              </button>
            ))}
          </aside>

          {/* Main */}
          <div className="project-main">
            {project.sections.map((sec, i) => (
              <div
                key={sec.id}
                id={sec.id}
                className="project-section"
                ref={(el) => (sectionRefs.current[i] = el)}
              >
                <h2 className="project-section__heading">{sec.heading}</h2>
                <p className="project-section__body">{sec.body}</p>
                {sec.image && (
                  <img
                    src={sec.image}
                    alt={sec.heading}
                    className="project-section__image"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="project-social">
            <button className="project-social__btn" aria-label="LinkedIn">
              <LinkedInIcon />
            </button>
            <button className="project-social__btn" aria-label="Facebook">
              <FacebookIcon />
            </button>
            <button className="project-social__btn" aria-label="X">
              <XIcon />
            </button>
            <button className="project-social__btn" aria-label="Copy link">
              <LinkIcon />
            </button>
          </div>
        </section>

        {/* ============ NEXT PROJECT PEEK ============ */}
        <section
          ref={nextProjectRef}
          className="project-next"
          onMouseEnter={() => setIsHoveringNext(true)}
          onMouseLeave={() => setIsHoveringNext(false)}
          onClick={async () => {
            if (isTransitioningRef.current) return;
            isTransitioningRef.current = true;

            // Smooth exit animation
            gsap.to(containerRef.current, {
              opacity: 0,
              y: -40,
              duration: 0.4,
              ease: "power2.inOut",
              onComplete: () => {
                window.scrollTo(0, 0);
                router.push(`/projects/${nextProject.slug}`);
              }
            });
          }}
        >
          <div className="project-next__cursor" ref={nextCursorRef}>
            VIEW
          </div>
          <div className="project-next__image-wrapper">
            <img
              src={nextProject.heroImage}
              alt={nextProject.title}
              className="project-next__image"
            />
            <div className="project-next__overlay" />
          </div>
          <span className="project-next__label">Next Project</span>
          <h2 className="project-next__title">{nextProject.title}</h2>
        </section>
      </div>{/* end .project-scroll-content */}
    </div>
  );
}
