"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function LoadingScreen({ progress }) {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const uiRef = useRef(null);
  const progressRef = useRef(null);
  const rectsRef = useRef([]);
  const isLoadedRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const [visible, setVisible] = useState(true);

  // Setup the grid on mount
  useEffect(() => {
    if (!gridRef.current || !containerRef.current) return;

    const color = "var(--color-primary)";
    const rectSize = Math.max(80, window.innerWidth / 20);
    const cols = Math.ceil(window.innerWidth / rectSize);
    const rows = Math.ceil(window.innerHeight / rectSize);

    // Clear fallback background
    containerRef.current.style.backgroundColor = "transparent";

    const gridWrapper = gridRef.current;
    gridWrapper.innerHTML = "";
    gridWrapper.style.position = "absolute";
    gridWrapper.style.top = "0";
    gridWrapper.style.left = "0";
    gridWrapper.style.width = "100%";
    gridWrapper.style.height = "100%";
    gridWrapper.style.display = "grid";
    gridWrapper.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridWrapper.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const rects = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const rect = document.createElement("div");
        rect.classList.add("loading-rect");
        rect.style.backgroundColor = color;
        gridWrapper.appendChild(rect);
        rects.push({ el: rect, r, c });
      }
    }
    rectsRef.current = rects;
    rectsRef.current._rows = rows;
    rectsRef.current._cols = cols;
  }, []);

  // Handle progress updates
  useEffect(() => {
    if (isLoadedRef.current || !progress || progress <= 0) return;

    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      let animationStartTime = null;
      const animationDuration = 2000;

      const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const animate = (timestamp) => {
        if (!animationStartTime) animationStartTime = timestamp;
        const elapsed = timestamp - animationStartTime;

        let timeProgress = Math.min(elapsed / animationDuration, 1.0);
        const currentAnimPercent = easeInOutCubic(timeProgress);

        let displayPercent = Math.round((currentAnimPercent * 100) / 5) * 5;
        if (displayPercent > 100) displayPercent = 100;

        if (progressRef.current) {
          progressRef.current.innerText = `${displayPercent}%`;
          progressRef.current.style.transform = `translateX(${
            currentAnimPercent *
            (window.innerWidth - progressRef.current.offsetWidth)
          }px)`;
        }

        if (timeProgress >= 1.0) {
          isLoadedRef.current = true;
          completeLoading();
        } else {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [progress]);

  const completeLoading = useCallback(() => {
    // Fade out logo and text
    if (uiRef.current) {
      uiRef.current.classList.add("fade-out");
    }

    // After UI fades out, reveal rectangles
    setTimeout(() => {
      reveal();
    }, 600);
  }, []);

  const reveal = useCallback(() => {
    const rects = rectsRef.current;
    if (!rects || rects.length === 0) return;

    const rows = rects._rows;
    const cols = rects._cols;

    // Origin is bottom right
    const originR = rows - 1;
    const originC = cols - 1;

    let maxDist = 0;
    rects.forEach((rect) => {
      const dist = Math.sqrt(
        Math.pow(rect.r - originR, 2) + Math.pow(rect.c - originC, 2)
      );
      rect.dist = dist;
      if (dist > maxDist) maxDist = dist;
    });

    const totalDelay = 1.0;

    rects.forEach((rect) => {
      const normDist = maxDist === 0 ? 0 : rect.dist / maxDist;
      const delay = normDist * totalDelay;

      rect.el.style.transitionDelay = `${delay}s`;

      requestAnimationFrame(() => {
        rect.el.classList.add("reveal-active");
      });
    });

    // Cleanup
    setTimeout(
      () => {
        if (containerRef.current) {
          containerRef.current.style.pointerEvents = "none";
          containerRef.current.style.display = "none";
        }
        setVisible(false);
      },
      (totalDelay + 0.8) * 1000
    );
  }, []);

  if (!visible) return null;

  return (
    <div
      id="loading-screen"
      ref={containerRef}
    >
      <div id="loading-ui" ref={uiRef}>
        <img src="/assets/logo.svg" id="loading-logo" alt="Logo" />
        <div id="loading-progress" ref={progressRef}>
          0%
        </div>
      </div>
      <div id="loading-grid" ref={gridRef}></div>
    </div>
  );
}
