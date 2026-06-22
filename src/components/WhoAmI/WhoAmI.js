export default function WhoAmI() {
  return (
    <section className="who-am-i">
      <div className="who-am-i__inner">
        <div className="who-am-i__left">
          <span className="who-am-i__label">INTRODUCTION</span>
          <h2 className="who-am-i__heading">
            Who
            <br />
            Am I
          </h2>
        </div>
        <div className="who-am-i__right">
          <div className="who-am-i__bio">
            <p className="who-am-i__text">
              I&apos;m a full-stack developer and creative technologist who builds
              immersive digital experiences at the intersection of design and
              engineering. I specialize in crafting high-performance web
              applications, interactive 3D interfaces, and scalable SaaS
              platforms that push the boundaries of what&apos;s possible on the web.
            </p>
            <p className="who-am-i__text who-am-i__text--muted">
              With a keen eye for detail and a passion for clean architecture, I
              transform complex ideas into elegant, user-centric products that
              deliver real impact.
            </p>
          </div>
          <div className="who-am-i__stats">
            <div className="who-am-i__stat">
              <span className="who-am-i__stat-number">5+</span>
              <span className="who-am-i__stat-label">
                Years of
                <br />
                Experience
              </span>
            </div>
            <div className="who-am-i__stat">
              <span className="who-am-i__stat-number">50+</span>
              <span className="who-am-i__stat-label">
                Projects
                <br />
                Delivered
              </span>
            </div>
            <div className="who-am-i__stat">
              <span className="who-am-i__stat-number">10+</span>
              <span className="who-am-i__stat-label">
                Happy
                <br />
                Clients
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
