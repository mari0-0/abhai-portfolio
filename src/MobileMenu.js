export class MobileMenu {
  constructor() {
    this.menu = document.getElementById("mobile-menu");
    this.toggleBtn = document.getElementById("menu-toggle");
    this.closeBtn = document.getElementById("menu-close");

    if (!this.menu || !this.toggleBtn || !this.closeBtn) return;

    this.toggleBtn.addEventListener("click", () => this.open());
    this.closeBtn.addEventListener("click", () => this.close());

    // Close when clicking a menu link
    this.menu.querySelectorAll(".mobile-menu__item").forEach(link => {
      link.addEventListener("click", () => this.close());
    });
  }

  open() {
    this.menu.classList.add("is-open");
    this.toggleBtn.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  close() {
    this.menu.classList.remove("is-open");
    this.toggleBtn.classList.remove("is-open");
    document.body.style.overflow = "";
  }
}
