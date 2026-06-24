"use client";

import { Link } from 'next-transition-router';
import { usePathname } from 'next/navigation';

export default function Navbar({ onMenuToggle, menuOpen }) {
  const pathname = usePathname();

  const handleNavClick = (e, targetId) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        if (window.lenis) {
          window.lenis.scrollTo(el);
        } else {
          el.scrollIntoView();
        }
        window.history.pushState(null, "", `/#${targetId}`);
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link href="/">
          <img src="/assets/logo.svg" alt="Abhai Matta Logo" />
        </Link>
      </div>
      <div className="nav-links">
        <Link href="/#whoami" onClick={(e) => handleNavClick(e, 'whoami')}>WHOAMI</Link>
        <span className="slash">/</span>{" "}
        <Link href="/#whatiship" onClick={(e) => handleNavClick(e, 'whatiship')}>WHAT I SHIP</Link>
        <span className="slash">/</span>
        <Link href="/#whychooseme" onClick={(e) => handleNavClick(e, 'whychooseme')}>WHY CHOOSE ME</Link>
        <span className="slash">/</span>
        <Link href="/projects">PROJECTS</Link>
      </div>
      <Link href="/#contact" className="cta-button" onClick={(e) => handleNavClick(e, 'contact')}>GET IN TOUCH</Link>
      {/* Unique Asymmetric Menu Toggle (Mobile Only) */}
      <button
        className={`menu-toggle${menuOpen ? " is-open" : ""}`}
        id="menu-toggle"
        aria-label="Open menu"
        onClick={onMenuToggle}
      >
        <span className="bar bar--short"></span>
        <span className="bar bar--long"></span>
      </button>
    </nav>
  );
}
