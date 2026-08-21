/**
 * Asset paths, resolved against Vite's BASE_URL so the app works both at the
 * domain root and under a sub-path (e.g. a GitHub Pages project site).
 *
 * The files live in client/public/assets/ and come from the public-site design
 * handoff bundle.
 */
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

/**
 * Prefix a public-folder path with the configured base. A value that already
 * carries a scheme — a CDN URL, or a data URI in a self-contained build — is
 * already absolute and passes through untouched.
 */
export const asset = (path: string) =>
  /^[a-z][a-z0-9+.-]*:/i.test(path)
    ? path
    : `${BASE}/${path.replace(/^\//, "")}`;

export const BRAND = {
  /** Wordmark used in the floating top nav (light backgrounds). */
  logoNav: asset("assets/web/logo-nav-z.png"),
  /** Monochrome wordmark used in the dark footer. */
  logoMono: asset("assets/web/logo-mono-z.png"),
  /** White wordmark for dark/photographic backgrounds. */
  logoWhite: asset("assets/web/logo-white-z.png"),
  /** Full-colour lockup. */
  logoFull: asset("assets/web/logo-full-z.png"),
  /** Blue lockup for light surfaces. */
  logoBlue: asset("assets/web/logo-blue-z.png"),
  /** Square project logo. */
  logo: asset("assets/logo.png"),
  /** Full lockup used on the login gate. */
  logoLockup: asset("assets/logo-lockup-z.png"),
  /** UAE PASS fingerprint mark. */
  uaePass: asset("assets/uaepass-finger.png"),
};

export const MEDIA = {
  heroVideo: asset("assets/web/hero-bg.mp4"),
  heroPoster: asset("assets/web/hero-poster.jpg"),
  introCabinet: asset("assets/web/intro-cabinet-m-c.jpg"),
  hhLaunch: asset("assets/web/hh-launch-v3-c.jpg"),
  mgQuote: asset("assets/web/mg-quote-m-c.jpg"),
  histIntro: asset("assets/web/hist-intro-c.jpg"),
  hist2001: asset("assets/web/hist-2001-s-c.jpg"),
  hist2013: asset("assets/web/hist-2013-m.jpg"),
  hist2017: asset("assets/web/hist-2017-v3-c.jpg"),
  hist2019: asset("assets/web/hist-2019-s-c.jpg"),
  hist2026: asset("assets/web/hist-2026-v2-c.jpg"),
  news0: asset("assets/web/news-0-crop.jpg"),
  news1: asset("assets/web/news-1.jpg"),
  news2: asset("assets/web/news-2.jpg"),
};
