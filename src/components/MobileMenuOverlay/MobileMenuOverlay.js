"use client";

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
        <a href="#" className="mobile-menu__item" onClick={onClose}>
          <span className="mobile-menu__label">Our Story</span>
          <span className="mobile-menu__title">Home</span>
        </a>
        <a href="#" className="mobile-menu__item" onClick={onClose}>
          <span className="mobile-menu__label">Case Studies</span>
          <span className="mobile-menu__title">Work</span>
        </a>
        <a href="#" className="mobile-menu__item" onClick={onClose}>
          <span className="mobile-menu__label">What We Do</span>
          <span className="mobile-menu__title">Services</span>
        </a>
        <a href="#" className="mobile-menu__item" onClick={onClose}>
          <span className="mobile-menu__label">Thought Leadership</span>
          <span className="mobile-menu__title">Insights</span>
        </a>
        <a href="#" className="mobile-menu__item" onClick={onClose}>
          <span className="mobile-menu__label">Who We Are</span>
          <span className="mobile-menu__title">About</span>
        </a>
        <a href="#" className="mobile-menu__item" onClick={onClose}>
          <span className="mobile-menu__label">Get in Touch</span>
          <span className="mobile-menu__title">Contact</span>
        </a>
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
