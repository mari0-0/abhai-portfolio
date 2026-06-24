import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Creates a scroll-triggered blur reveal animation on text.
 * 
 * Splits the text content of the target element into individual word spans,
 * each starting blurred/offset and animating to clear on scroll.
 *
 * @param {HTMLElement} element - The text element to animate (h1, h2, p, etc.)
 * @param {HTMLElement} trigger - The scroll trigger element (usually section or parent)
 * @param {Object} [options] - Configuration options
 * @param {string} [options.start="top 75%"] - ScrollTrigger start position
 * @param {string} [options.end="center center"] - ScrollTrigger end position
 * @param {number} [options.blur=12] - Starting blur amount in px
 * @param {number} [options.y=30] - Starting translateY offset in px
 * @param {number} [options.stagger=0.1] - Stagger delay between words
 * @param {string} [options.ease="power2.out"] - GSAP ease
 * @param {boolean} [options.scrub=true] - Whether animation is scrub-linked
 * @param {string} [options.highlightClass=""] - CSS class for highlighted words (comma-separated word indices or empty)
 * @param {number[]} [options.highlightIndices=[]] - Array of word indices to highlight
 * @returns {{ wordEls: HTMLElement[], revert: () => void }} - References to created word elements and cleanup function
 */
export function blurReveal(element, trigger, options = {}) {
  gsap.registerPlugin(ScrollTrigger);

  const {
    start = "top 75%",
    end = "center center",
    blur = 12,
    y = 30,
    stagger = 0.1,
    ease = "power2.out",
    scrub = true,
    highlightClass = "blur-reveal-highlight",
    highlightIndices = [],
    split = true,
  } = options;

  const scrollTriggerConfig = {
    trigger,
    start,
  };

  if (scrub) {
    scrollTriggerConfig.end = end;
    scrollTriggerConfig.scrub = scrub;
  } else {
    scrollTriggerConfig.toggleActions = "play none none none";
  }

  if (!split) {
    const tween = gsap.fromTo(
      element,
      { y, opacity: 0, filter: `blur(${blur}px)` },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        ease,
        duration: scrub ? undefined : 0.8,
        scrollTrigger: scrollTriggerConfig,
      }
    );
    return {
      wordEls: [element],
      revert: () => tween.kill(),
    };
  }

  // Preserve HTML tags while splitting words
  const originalHTML = element.innerHTML;
  const tokens = originalHTML.split(/(<[^>]+>|\s+)/).filter(Boolean);

  let wordIndex = 0;
  element.innerHTML = tokens
    .map((token) => {
      if (token.match(/^<[^>]+>$/)) {
        return token; // HTML tag
      }
      if (token.match(/^\s+$/)) {
        return token; // Whitespace
      }
      // Word or punctuation
      const isHighlighted = highlightIndices.includes(wordIndex);
      const cls = `blur-reveal-word${isHighlighted ? ` ${highlightClass}` : ""}`;
      wordIndex++;
      return `<span class="blur-reveal-wrap"><span class="${cls}">${token}</span></span>`;
    })
    .join("");

  const wordEls = element.querySelectorAll(".blur-reveal-word");

  // Animate
  const tween = gsap.to(wordEls, {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    stagger,
    ease,
    duration: scrub ? undefined : 0.8,
    scrollTrigger: scrollTriggerConfig,
  });

  return {
    wordEls: Array.from(wordEls),
    revert: () => {
      tween.kill();
      element.innerHTML = originalHTML;
    },
  };
}
