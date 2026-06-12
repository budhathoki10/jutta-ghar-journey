import { DependencyList, useEffect } from "react";

/**
 * Adds `.in-view` to reveal elements when they scroll into view.
 */
export function useReveal(deps: DependencyList = []) {
  useEffect(() => {
    const selector = ".reveal, .reveal-left, .reveal-right, .reveal-scale, .shoe-scroll-reveal, .admin-shoe-card-reveal";
    let observer: IntersectionObserver | null = null;
    let frame = 0;

    const setup = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(selector));

      if (!("IntersectionObserver" in window)) {
        els.forEach((el) => el.classList.add("in-view"));
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              (e.target as HTMLElement).classList.add("in-view");
              observer?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );

      els.forEach((el) => observer?.observe(el));
    };

    if (!("IntersectionObserver" in window)) {
      setup();
      return;
    }

    frame = window.requestAnimationFrame(setup);

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, deps);
}
