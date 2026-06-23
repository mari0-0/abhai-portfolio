"use client";

import { useState, useEffect } from "react";
import "./CatSprite.css";

export default function CatSprite() {
  const [frame, setFrame] = useState(429);

  useEffect(() => {
    // 22 frames from 429 to 450
    const interval = setInterval(() => {
      setFrame((prev) => {
        if (prev >= 450) return 429;
        return prev + 1;
      });
    }, 100); // 10 frames per second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cat-sprite-container">
      <img
        src={`/cat_scratching_sprite/${frame}.png`}
        alt="Cat Scratching"
        className="cat-sprite-img"
      />
    </div>
  );
}
