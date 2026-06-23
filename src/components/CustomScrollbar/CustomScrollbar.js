"use client";

import { useEffect, useState, useRef } from "react";
import "./CustomScrollbar.css";

export default function CustomScrollbar() {
  const [progress, setProgress] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(100);
  const [isVisible, setIsVisible] = useState(false);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollY = useRef(0);

  useEffect(() => {
    const updateScroll = () => {
      if (isDragging.current) return;
      
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (documentHeight <= windowHeight) {
        setIsVisible(false);
        return;
      }
      
      setIsVisible(true);
      
      const tHeight = Math.max((windowHeight / documentHeight) * windowHeight, 50);
      setThumbHeight(tHeight);
      
      const maxScroll = documentHeight - windowHeight;
      setProgress(window.scrollY / maxScroll);
    };

    updateScroll();
    
    window.addEventListener("scroll", updateScroll);
    window.addEventListener("resize", updateScroll);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startScrollY.current = window.scrollY;
    document.body.style.userSelect = "none";
    
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    
    const deltaY = e.clientY - startY.current;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = documentHeight - windowHeight;
    const maxTranslate = windowHeight - thumbHeight;
    
    const scrollDelta = (deltaY / maxTranslate) * maxScroll;
    const newScrollY = Math.min(Math.max(startScrollY.current + scrollDelta, 0), maxScroll);
    
    setProgress(newScrollY / maxScroll);
    
    if (window.lenis) {
      window.lenis.scrollTo(newScrollY, { immediate: true });
    } else {
      window.scrollTo({ top: newScrollY, behavior: "auto" });
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    document.body.style.userSelect = "";
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
  };

  if (!isVisible) return null;

  const trackHeight = typeof window !== "undefined" ? window.innerHeight : 0;
  const maxTranslate = trackHeight - thumbHeight;
  const translateY = progress * maxTranslate;

  return (
    <div className="custom-scrollbar-container">
      <div 
        className="custom-scrollbar-thumb" 
        style={{ 
          height: `${thumbHeight}px`,
          transform: `translateY(${translateY}px)`
        }}
        onPointerDown={handlePointerDown}
      />
    </div>
  );
}
