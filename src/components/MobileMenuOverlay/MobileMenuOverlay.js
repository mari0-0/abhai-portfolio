"use client";

import { Link } from "next-transition-router";

export default function MobileMenuOverlay({ isOpen, onClose }) {
  return (
    <div id="mobile-menu" className={`mobile-menu${isOpen ? " is-open" : ""}`}>
      <div className="mobile-menu__header">
        <div className="mobile-menu__logo">
          <img src="/assets/logo-light.svg" alt="Logo" />
        </div>
        <button
          className="menu-close"
          id="menu-close"
          aria-label="Close menu"
          onClick={onClose}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </button>
      </div>

      <div className="mobile-menu__links">
        <Link href="/#whoami" className="mobile-menu__item" onClick={onClose}>
          <span className="mobile-menu__title">WHOAMI</span>
        </Link>
        <Link href="/#whatiship" className="mobile-menu__item" onClick={onClose}>
          <span className="mobile-menu__title">WHAT I SHIP</span>
        </Link>
        <Link href="/#projects" className="mobile-menu__item" onClick={onClose}>
          <span className="mobile-menu__title">PROJECTS</span>
        </Link>
        <Link href="/#whychooseme" className="mobile-menu__item" onClick={onClose}>
          <span className="mobile-menu__title">WHY CHOOSE ME</span>
        </Link>
        <Link href="/#contact" className="mobile-menu__item" onClick={onClose}>
          <span className="mobile-menu__title">GET IN TOUCH</span>
        </Link>
      </div>

      <div className="mobile-menu__footer">
        <span className="mobile-menu__footer-label">Follow our journey</span>
        <div className="mobile-menu__socials">
          <a href="#">Behance</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">Dribbble</a>
        </div>
      </div>
    </div>
  );
}
