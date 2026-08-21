import { useEffect } from "react";

/**
 * Reveals every `[data-reveal]` element inside `root` once it scrolls into
 * view, stamping `data-revealed` on it (the transition itself lives in
 * index.css). Elements already in the viewport on mount reveal immediately, so
 * nothing above the fold ever stays blank.
 *
 * Siblings are staggered by 70ms to reproduce the cascade in the design files.
 */
export function useScrollReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = root.current;
    if (!host) return;

    const reveal = (el: Element) => {
      if (el.hasAttribute("data-revealed")) return;
      el.setAttribute("data-revealed", "");
    };

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
    );

    const targets = Array.from(host.querySelectorAll("[data-reveal]"));
    targets.forEach(el => {
      // Stagger against previous revealing siblings, capped so long lists do
      // not accumulate a visible lag.
      let index = 0;
      let sibling: Element | null = el;
      while ((sibling = sibling.previousElementSibling)) {
        if (sibling.hasAttribute("data-reveal")) index++;
      }
      (el as HTMLElement).style.transitionDelay = `${(index % 8) * 0.07}s`;

      const rect = el.getBoundingClientRect();
      if (rect.height && rect.top < window.innerHeight * 0.92) {
        reveal(el);
        return;
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [root]);
}
