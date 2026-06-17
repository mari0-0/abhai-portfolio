export class LoadingScreen {
  constructor(color = "var(--color-primary)") {
    this.container = document.getElementById("loading-screen");
    this.color = color;
    this.rects = [];
    this.rectSize = Math.max(80, window.innerWidth / 20); // Dynamic or fixed size
    this.isLoaded = false;

    // Grab existing UI Wrapper (on top of grid)
    this.uiWrapper = document.getElementById("loading-ui");

    // Grab existing Logo
    this.logo = document.getElementById("loading-logo");

    // Grab existing Progress
    this.progressText = document.getElementById("loading-progress");

    // Grab existing Grid Wrapper
    this.gridWrapper = document.getElementById("loading-grid");

    // Initial setup
    this.setupGrid();
  }

  setupGrid() {
    this.gridWrapper.innerHTML = "";

    // IMPORTANT: Clear the fallback FOUC background color of the main container NOW
    // Because the `.loading-rect` elements will take over blocking the screen completely
    this.container.style.backgroundColor = "transparent";

    // We want to fill the viewport
    this.cols = Math.ceil(window.innerWidth / this.rectSize);
    this.rows = Math.ceil(window.innerHeight / this.rectSize);

    this.gridWrapper.style.position = "absolute";
    this.gridWrapper.style.top = "0";
    this.gridWrapper.style.left = "0";
    this.gridWrapper.style.width = "100%";
    this.gridWrapper.style.height = "100%";
    this.gridWrapper.style.display = "grid";
    this.gridWrapper.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
    this.gridWrapper.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const rect = document.createElement("div");
        rect.classList.add("loading-rect");
        rect.style.backgroundColor = this.color;
        this.gridWrapper.appendChild(rect);
        this.rects.push({ el: rect, r, c });
      }
    }
  }

  updateProgress(percent) {
    if (this.isLoaded) return;
    this.targetPercent = Math.max(percent, this.targetPercent || 0);

    // Start animation loop once if not already running
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.currentVisualPercent = 0;
      this.animationStartTime = null;
      this.animationDuration = 2000; // Force 2 seconds

      const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

      const animate = timestamp => {
        if (!this.animationStartTime) this.animationStartTime = timestamp;
        const elapsed = timestamp - this.animationStartTime;

        // Progress based on time (0 to 1)
        let timeProgress = Math.min(elapsed / this.animationDuration, 1.0);

        // Apply easing curve for smoother visually appealing movement
        const currentAnimPercent = easeInOutCubic(timeProgress);

        // Round the displayed number to nearest 5 for readability
        // (so it doesn't spin like a slot machine every single frame)
        let displayPercent = Math.round((currentAnimPercent * 100) / 5) * 5;
        // Cap exactly at 100 just in case floating point pushes it to 105
        if (displayPercent > 100) displayPercent = 100;

        this.progressText.innerText = `${displayPercent}%`;

        // Move only using transform for sub-pixel hardware accelerated smoothness
        // We drop the `left` style modification completely to prevent layout thrashing
        // padding-right is internally handled by offsetWidth since box-sizing is border-box
        this.progressText.style.transform = `translateX(${currentAnimPercent * (window.innerWidth - this.progressText.offsetWidth)}px)`;

        if (timeProgress >= 1.0) {
          this.isLoaded = true;
          this.completeLoading();
        } else {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }

  completeLoading() {
    // Fade out logo and text
    this.uiWrapper.classList.add("fade-out");

    // After UI fades out, reveal rectangles
    setTimeout(() => {
      this.reveal();
    }, 600); // Wait for CSS transition in style.css
  }

  reveal() {
    return new Promise(resolve => {
      if (this.rects.length === 0) {
        resolve();
        return;
      }

      // Origin is bottom right
      const originR = this.rows - 1;
      const originC = this.cols - 1;

      let maxDist = 0;
      this.rects.forEach(rect => {
        const dist = Math.sqrt(Math.pow(rect.r - originR, 2) + Math.pow(rect.c - originC, 2));
        rect.dist = dist;
        if (dist > maxDist) maxDist = dist;
      });

      // Total staggering delay in seconds
      const totalDelay = 1.0;

      this.rects.forEach(rect => {
        // Normalize distance (0 at bottom-right, 1 at top-left)
        const normDist = maxDist === 0 ? 0 : rect.dist / maxDist;
        const delay = normDist * totalDelay;

        rect.el.style.transitionDelay = `${delay}s`;

        // Apply fade-out class in next frame
        requestAnimationFrame(() => {
          rect.el.classList.add("reveal-active");
        });
      });

      // Cleanup
      setTimeout(
        () => {
          this.container.style.pointerEvents = "none";
          this.container.style.display = "none";
          // Re-enable scrolling now that the loading screen has fully wiped away
          // document.body.style.overflow = "auto";
          resolve();
        },
        (totalDelay + 0.8) * 1000,
      ); // Wait for max delay + transition duration (0.8s)
    });
  }
}
