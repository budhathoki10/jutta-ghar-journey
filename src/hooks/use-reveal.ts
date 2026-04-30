import { useEffect } from "react";

/**
 * Adds `.in-view` to any element with `.reveal`, `.reveal-left`,
 * `.reveal-right`, or `.reveal-scale` when it scrolls into view.
 */
export function useReveal() {
  useEffect(() => {
    const selector = ".reveal, .reveal-left, .reveal-right, .reveal-scale";
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}