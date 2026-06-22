"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import MobileMenuOverlay from "@/components/MobileMenuOverlay/MobileMenuOverlay";
import ProjectsSlider from "@/components/ProjectsSlider/ProjectsSlider";

export default function ProjectsPageClient() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 50 }}>
        <Navbar menuOpen={menuOpen} onMenuToggle={() => setMenuOpen(!menuOpen)} />
      </div>
      <MobileMenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <ProjectsSlider />
    </>
  );
}
