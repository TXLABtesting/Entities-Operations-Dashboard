/** Public-site routes. */
export const ROUTES = {
  home: "/",
  about: "/about",
  library: "/library",
  contact: "/contact",
} as const;

/** Copy that appears on every page. */
export const SITE = {
  nameAr: "مشروع الذكاء الاصطناعي المساعد",
  copyright: "جميع الحقوق محفوظه © 2026 مشروع الذكاء الاصطناعي المساعد",
} as const;

/** Viewport width below which the nav collapses to a hamburger drawer. */
export const NAV_BREAKPOINT = 1040;
