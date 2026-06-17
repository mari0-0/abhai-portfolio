import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // Only activate horizontal scroll on non-mobile
  if (window.innerWidth <= 768) return;

  const section = document.querySelector(".what-i-offer");
  const track = document.querySelector(".offer-track");

  if (!section || !track) return;

  // Calculate scroll distance:
  // track starts with 25% left padding, should end with 25% right whitespace
  const getScrollAmount = () => {
    const rightPadding = section.clientWidth * 0.25;
    return track.scrollWidth - section.clientWidth + rightPadding;
  };

  gsap.to(track, {
    x: () => -getScrollAmount(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${getScrollAmount()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  // Refresh on resize
  window.addEventListener("resize", () => ScrollTrigger.refresh());
}
