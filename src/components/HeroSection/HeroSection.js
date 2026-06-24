export default function HeroSection() {
  return (
    <main className="hero-content">
      {/* Left Side Content */}
      <div className="hero-left">
        <div className="hero-left__label">
          <span className="hero-label-dot"></span>
          <span>CREATIVE DEVELOPER</span>
        </div>
        <h1 className="hero-left__title">
          <span className="hero-title-line">I Build</span>
          <span className="hero-title-line hero-title-line--accent">Digital</span>
          <span className="hero-title-line">Worlds</span>
        </h1>
        <p className="hero-left__sub">
          Crafting immersive 3D experiences &amp; interfaces that feel alive.
        </p>
      </div>

      {/* Right Side Content */}
      <div className="hero-right">
        <div className="hero-right__stats">
          <div className="hero-stat">
            <span className="hero-stat__number">3+</span>
            <span className="hero-stat__label">Years of<br />Experience</span>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat">
            <span className="hero-stat__number">20+</span>
            <span className="hero-stat__label">Projects<br />Delivered</span>
          </div>
        </div>

        <div className="hero-right__tagline">
          <span className="hero-tagline-bracket">[</span>
          <span className="hero-tagline-text">Frontend &bull; 3D &bull; Motion</span>
          <span className="hero-tagline-bracket">]</span>
        </div>

        <div className="hero-right__scroll-hint">
          <div className="hero-scroll-line"></div>
          <span className="hero-scroll-text">SCROLL</span>
        </div>
      </div>
    </main>
  );
}
