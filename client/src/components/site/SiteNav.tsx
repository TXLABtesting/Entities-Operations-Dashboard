import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { BRAND } from "@/lib/brand";
import { NAV_BREAKPOINT, ROUTES } from "@shared/const";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface NavLink {
  href: string;
  label: string;
}

/**
 * Links a signed-out visitor sees. المنشورات and تواصل معنا are member-only in
 * the design (its nav hides them behind `memberLinkDisplay` until login), so
 * they join this list when the auth provider lands.
 */
const LINKS: NavLink[] = [
  { href: ROUTES.home, label: "الرئيسية" },
  { href: ROUTES.about, label: "من نحن" },
];

interface SiteNavProps {
  /**
   * True while the nav floats over a full-bleed hero: the bar stays
   * transparent until the first scroll, then fades into frosted white.
   */
  overHero?: boolean;
}

/**
 * The floating pill navigation shared by every public page. It hides on
 * scroll-down / reappears on scroll-up, and collapses to a hamburger drawer
 * below 1040px.
 */
export function SiteNav({ overHero = false }: SiteNavProps) {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const narrow = useMediaQuery(`(max-width: ${NAV_BREAKPOINT - 1}px)`);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y >= 40);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 8) {
        setHidden(delta > 0 && y > 120);
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on navigation and whenever the viewport grows wide again.
  useEffect(() => setMenuOpen(false), [location]);
  useEffect(() => {
    if (!narrow) setMenuOpen(false);
  }, [narrow]);

  const solid = scrolled || !overHero;

  return (
    <div
      className="fixed top-[18px] right-0 left-0 z-[80] flex justify-center px-5 pointer-events-none"
      style={{
        transition: "transform .38s cubic-bezier(.22,1,.36,1)",
        transform: hidden ? "translateY(-130%)" : "translateY(0)",
      }}
    >
      <div
        className="pointer-events-auto flex w-full max-w-[1180px] items-center justify-between rounded-full py-2 px-[18px]"
        style={{
          gap: "clamp(6px,1.4vw,30px)",
          background: solid ? "rgba(255,255,255,.9)" : "transparent",
          backdropFilter: solid ? "blur(20px) saturate(1.5)" : "none",
          WebkitBackdropFilter: solid ? "blur(20px) saturate(1.5)" : "none",
          boxShadow: solid ? "0 18px 44px -20px rgba(15,31,61,.35)" : "none",
          transition: "background .35s,box-shadow .35s,backdrop-filter .35s",
        }}
      >
        <Link
          href={ROUTES.home}
          className="flex min-w-0 flex-1 items-center justify-start gap-[10px] py-[3px] px-2"
        >
          <img
            src={BRAND.logoNav}
            alt="مشروع الذكاء الاصطناعي المساعد"
            className="h-[33px] w-[127px] object-contain"
          />
        </Link>

        {!narrow && (
          <nav
            className="flex min-w-0 flex-[0_1_auto] items-center justify-center"
            style={{ gap: "clamp(6px,1.4vw,30px)" }}
          >
            {LINKS.map(link => {
              const active = link.href === location;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="whitespace-nowrap rounded-full transition-colors hover:!text-[#2563EB]"
                  style={{
                    padding: "10px clamp(4px,0.9vw,16px)",
                    fontSize: active ? 13 : 13.5,
                    fontWeight: active ? 800 : 400,
                    color: active ? "#2563EB" : "#0F1F3D",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {!narrow && (
          <div className="flex flex-1 justify-end">
            <Link
              href={ROUTES.login}
              className="inline-block flex-none whitespace-nowrap rounded-full text-white transition-transform hover:-translate-y-px"
              style={{
                background:
                  "linear-gradient(135deg,#0158DF 0%,#0098F8 55%,#00B8F8 100%)",
                padding: "11px clamp(16px,2vw,28px)",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              تسجيل الدخول
            </Link>
          </div>
        )}

        {narrow && (
          <div className="relative flex-none">
            <button
              type="button"
              onClick={() => setMenuOpen(open => !open)}
              aria-label="القائمة"
              aria-expanded={menuOpen}
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-[rgba(15,31,61,.12)] bg-[rgba(255,255,255,.94)] text-[#0F1F3D] transition-colors hover:bg-[#EAF1FE]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute top-14 left-0 z-[90] flex min-w-[242px] flex-col gap-[2px] rounded-[18px] border border-[#E6ECF6] bg-white p-[10px] shadow-[0_28px_58px_-26px_rgba(15,31,61,.42)]">
                {LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-[14px] py-3 text-sm font-extrabold text-[#0F1F3D] transition-colors hover:bg-[#F4F7FC]"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={ROUTES.login}
                  className="mt-2 rounded-full bg-[#0F1F3D] px-[18px] py-[13px] text-center text-[13.5px] font-extrabold text-white"
                >
                  تسجيل الدخول
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
