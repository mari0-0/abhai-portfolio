"use client";

export default function Navbar({ onMenuToggle, menuOpen }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/assets/logo.svg" alt="Abhai Matta Logo" />
      </div>
      <div className="nav-links">
        <a href="#">ABOUT</a>
        <span className="slash">/</span>{" "}
        <a href="#">HOW IT WORKS</a>
        <span className="slash">/</span>
        <a href="#">ADVANTAGE</a>
        <span className="slash">/</span>
        <a href="#">INDUSTRIES</a>
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
