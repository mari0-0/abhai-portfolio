"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { projects } from "@/data/projectsData";
import "./ProjectsSlider.css";
import { useTransitionRouter, Link } from "next-transition-router";

export default function ProjectsSlider() {
  const router = useTransitionRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const targetIdxRef = useRef(0);
  const isAnimating = useRef(false);
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorXTo = useRef(null);
  const cursorYTo = useRef(null);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const imageRefs = useRef([]);
  const scrollerLines = useRef([]);
  const scrollerThumbs = useRef([]);
  const isAutoScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    // Initial state setup
    gsap.set(imageRefs.current, {
      autoAlpha: 0,
      clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)"
    });
    gsap.set(imageRefs.current[0], {
      autoAlpha: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
    });

    // Mini scroller init
    gsap.set(scrollerThumbs.current, { height: 0, autoAlpha: 0 });
    gsap.set(scrollerLines.current, { autoAlpha: 1 });

    gsap.set(scrollerThumbs.current[0], { height: 80, autoAlpha: 1 });
    gsap.set(scrollerLines.current[0], { autoAlpha: 0 });

    // Custom Cursor init
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
    cursorXTo.current = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3.out" });
    cursorYTo.current = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3.out" });

    const handleMouseMove = (e) => {
      if (cursorXTo.current) cursorXTo.current(e.clientX);
      if (cursorYTo.current) cursorYTo.current(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const maxScroll = rect.height - windowHeight;
      const currentScroll = -rect.top;

      let progress = currentScroll / maxScroll;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      // Calculate target slide
      let nextIdx = Math.floor(progress * projects.length);
      if (nextIdx >= projects.length) nextIdx = projects.length - 1;

      if (!isAutoScrollingRef.current) {
        targetIdxRef.current = nextIdx;
      }

      if (isAutoScrollingRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isAutoScrollingRef.current = false;
          targetIdxRef.current = nextIdx;
        }, 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Init

    const tick = () => {
      if (activeIdxRef.current !== targetIdxRef.current && !isAnimating.current) {
        goToSlide(targetIdxRef.current, targetIdxRef.current > activeIdxRef.current ? 1 : -1);
      }
    };
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(tick);
    };
  }, []);

  useEffect(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: isHoveringImage ? 1 : 0,
        opacity: isHoveringImage ? 1 : 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto"
      });
    }
  }, [isHoveringImage]);

  const goToSlide = (nextIdx, direction = 1) => {
    if (isAnimating.current || nextIdx === activeIdxRef.current) return;
    isAnimating.current = true;

    const oldIdx = activeIdxRef.current;
    activeIdxRef.current = nextIdx;
    setActiveIdx(nextIdx);

    const currentImg = imageRefs.current[oldIdx];
    const nextImg = imageRefs.current[nextIdx];

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      }
    });

    // 1. Main Image Animation
    // Old image collapses to bottom right (no opacity change)
    tl.to(currentImg, {
      clipPath: direction === 1
        ? "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)"
        : "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
      duration: 1.2,
      ease: "expo.out"
    }, 0);

    // Hide old image AFTER it fully collapses into thin air
    tl.set(currentImg, { autoAlpha: 0 });

    // New image expands from top left (perfectly synced with old image)
    tl.fromTo(nextImg,
      {
        clipPath: direction === 1
          ? "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)"
          : "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
        autoAlpha: 1
      },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1.6,
        ease: "expo.out"
      },
      0
    );

    // 2. Mini Scroller Animation (Happening simultaneously)
    if (oldIdx !== nextIdx) {
      // Collapse old thumbnail to line
      tl.to(scrollerThumbs.current[oldIdx], { height: 0, autoAlpha: 0, duration: 1.2, ease: "expo.out" }, 0);
      tl.to(scrollerLines.current[oldIdx], { autoAlpha: 1, duration: 1.2, ease: "expo.out" }, 0);

      // Expand new line to thumbnail
      tl.to(scrollerLines.current[nextIdx], { autoAlpha: 0, duration: 1.2, ease: "expo.out" }, 0);
      tl.to(scrollerThumbs.current[nextIdx], { height: 80, autoAlpha: 1, duration: 1.2, ease: "expo.out" }, 0);
    }
  };

  const scrollToProject = (index) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const maxScroll = rect.height - windowHeight;

    const targetProgress = (index + 0.1) / projects.length;
    const containerTop = window.scrollY + rect.top;
    const targetScrollY = containerTop + targetProgress * maxScroll;

    isAutoScrollingRef.current = true;
    targetIdxRef.current = index;

    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  const navigateToProject = () => {
    if (isAnimating.current) return;
    router.push(`/projects/${projects[activeIdxRef.current].slug}`);
  };

  return (
    <div ref={containerRef} style={{ height: `${projects.length * 100}vh`, position: "relative" }}>
      <div className="projects-slider" style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        <div className="projects-slider__label">( Projects )</div>

        {/* MOBILE NAV ARROWS (Tablet/Mobile Only) */}
        <div className="projects-slider__mobile-nav">
          <button className="nav-arrow" onClick={() => scrollToProject((activeIdx - 1 + projects.length) % projects.length)}>
            ←
          </button>
          <button className="nav-arrow" onClick={() => scrollToProject((activeIdx + 1) % projects.length)}>
            →
          </button>
        </div>

        {/* Main Container */}
        <div className="projects-slider__content">

          {/* TEXT COLUMN */}
          <div className="projects-slider__text-column">

            {/* TITLE SLOT */}
            <div className="slot-container" style={{ display: 'grid', overflow: 'hidden', marginBottom: '4rem' }}>
              {projects.map((proj, i) => (
                <h1
                  key={`title-${proj.slug}`}
                  className="projects-slider__title"
                  style={{
                    gridArea: '1 / 1',
                    margin: 0,
                    transform: `translateY(${(i - activeIdx) * 100}%)`,
                    transition: 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)'
                  }}
                >
                  {proj.title}
                </h1>
              ))}
            </div>

            <div className="projects-slider__meta-grid">
              {/* ROLE SLOT */}
              <div className="projects-slider__meta-block">
                <span className="projects-slider__meta-label">Role</span>
                <div className="slot-container" style={{ display: 'grid', overflow: 'hidden' }}>
                  {projects.map((proj, i) => (
                    <span
                      key={`role-${proj.slug}`}
                      className="projects-slider__meta-value"
                      style={{
                        gridArea: '1 / 1',
                        height: '100%',
                        transform: `translateY(${(i - activeIdx) * 100}%)`,
                        transition: 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)'
                      }}
                    >
                      {proj.role}
                    </span>
                  ))}
                </div>
              </div>

              {/* SERVICES SLOT */}
              <div className="projects-slider__meta-block">
                <span className="projects-slider__meta-label">Services</span>
                <div className="slot-container" style={{ display: 'grid', overflow: 'hidden' }}>
                  {projects.map((proj, i) => (
                    <div
                      key={`services-${proj.slug}`}
                      className="projects-slider__meta-value"
                      style={{
                        gridArea: '1 / 1',
                        height: '100%',
                        transform: `translateY(${(i - activeIdx) * 100}%)`,
                        transition: 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)'
                      }}
                    >
                      {proj.services.map((service, idx) => (
                        <p key={idx}>{service}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* DESCRIPTION SLOT */}
              <div className="projects-slider__meta-block">
                <span className="projects-slider__meta-label">Description</span>
                <div className="slot-container" style={{ display: 'grid', overflow: 'hidden' }}>
                  {projects.map((proj, i) => (
                    <span
                      key={`desc-${proj.slug}`}
                      className="projects-slider__meta-value"
                      style={{
                        gridArea: '1 / 1',
                        height: '100%',
                        transform: `translateY(${(i - activeIdx) * 100}%)`,
                        transition: 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)'
                      }}
                      dangerouslySetInnerHTML={{ __html: proj.intro[0] }}
                    />
                  ))}
                </div>
              </div>

              {/* OUTCOMES SLOT */}
              <div className="projects-slider__meta-block">
                <span className="projects-slider__meta-label">Outcomes</span>
                <div className="slot-container" style={{ display: 'grid', overflow: 'hidden' }}>
                  {projects.map((proj, i) => (
                    <ul
                      key={`outcomes-${proj.slug}`}
                      className="projects-slider__outcomes"
                      style={{
                        gridArea: '1 / 1',
                        height: '100%',
                        margin: 0,
                        transform: `translateY(${(i - activeIdx) * 100}%)`,
                        transition: 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)'
                      }}
                    >
                      {proj.outcomesList ? proj.outcomesList.map(out => (
                        <li key={out} className="projects-slider__meta-value">{out}</li>
                      )) : null}
                    </ul>
                  ))}
                </div>
              </div>

              {/* EXPLORE LINK SLOT (Tablet/Mobile Only) */}
              <div className="projects-slider__meta-block projects-slider__explore-mobile">
                <div className="slot-container" style={{ display: 'grid', overflow: 'hidden' }}>
                  {projects.map((proj, i) => (
                    <Link
                      key={`explore-${proj.slug}`}
                      href={`/projects/${proj.slug}`}
                      className="projects-slider__explore-link"
                      style={{
                        gridArea: '1 / 1',
                        height: '100%',
                        margin: 0,
                        textDecoration: 'none',
                        transform: `translateY(${(i - activeIdx) * 100}%)`,
                        transition: 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)'
                      }}
                    >
                      Explore Project ↗
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CUSTOM CURSOR */}
          <div className="projects-slider__cursor" ref={cursorRef}>
            VIEW
          </div>

          {/* IMAGES */}
          <div
            className="projects-slider__images"
          >
            {projects.map((proj, i) => (
              <div
                key={`img-${proj.slug}`}
                ref={(el) => (imageRefs.current[i] = el)}
                className="project-image-wrapper"
                style={{ cursor: 'none', pointerEvents: i === activeIdx ? 'auto' : 'none' }}
                onClick={navigateToProject}
                onMouseEnter={() => setIsHoveringImage(true)}
                onMouseMove={() => !isHoveringImage && setIsHoveringImage(true)}
                onMouseLeave={() => setIsHoveringImage(false)}
              >
                <img src={proj.heroImage} alt={proj.title} />
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="projects-slider__footer">
          <div className="projects-slider__year-container" style={{ position: 'relative', overflow: 'hidden', height: '1.5rem', width: '100px' }}>
            {projects.map((proj, i) => (
              <div
                key={`year-${proj.slug}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  transform: `translateY(${(i - activeIdx) * 100}%)`,
                  transition: 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)'
                }}
                className="projects-slider__year"
              >
                © {proj.year}
              </div>
            ))}
          </div>
          <div className="projects-slider__counter">
            <div className="projects-slider__counter-current">
              {projects.map((_, i) => (
                <span
                  key={`count-${i}`}
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `translateY(${(i - activeIdx) * 100}%)`,
                    transition: 'transform 1.2s cubic-bezier(0.19, 1, 0.22, 1)'
                  }}
                >
                  0{i + 1}
                </span>
              ))}
            </div>
            <span className="projects-slider__counter-total">/ 0{projects.length}</span>
          </div>
        </div>

        {/* MINI SCROLLER */}
        <div className="projects-slider__mini-scroller">
          {projects.map((proj, i) => {
            const isNext = i === (activeIdx + 1) % projects.length;

            return (
              <div
                key={`scroll-${proj.slug}`}
                className={`scroller-item ${i === activeIdx ? 'is-active' : ''}`}
                onClick={() => scrollToProject(i)}
              >
                <div className="scroller-line" ref={(el) => (scrollerLines.current[i] = el)} />
                <div className="scroller-thumbnail" ref={(el) => (scrollerThumbs.current[i] = el)}>
                  <div className="scroller-thumbnail-inner">
                    <img src={proj.heroImage} alt="" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
