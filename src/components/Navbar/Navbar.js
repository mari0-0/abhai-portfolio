"use client";

import { Link } from 'next-transition-router';

export default function Navbar({ onMenuToggle, menuOpen }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link href="/">
          <img src="/assets/logo.svg" alt="Abhai Matta Logo" />
        </Link>
      </div>
      <div className="nav-links">
        <Link href="#">ABOUT</Link>
        <span className="slash">/</span>{" "}
        <Link href="#">HOW IT WORKS</Link>
        <span className="slash">/</span>
        <Link href="#">ADVANTAGE</Link>
        <span className="slash">/</span>
        <Link href="/projects">PROJECTS</Link>
      </div>
      <button className="cta-button">GET IN TOUCH</button>
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
