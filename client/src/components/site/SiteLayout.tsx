import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

interface SiteLayoutProps {
  children: ReactNode;
  /** Page background behind the content area. */
  background?: string;
  /**
   * Set on pages whose first section is a full-bleed hero: the nav stays
   * transparent until the first scroll.
   */
  overHero?: boolean;
}

/** Nav + page + footer wrapper used by all four public routes. */
export function SiteLayout({
  children,
  background = "#F4F7FB",
  overHero = false,
}: SiteLayoutProps) {
  const [location] = useLocation();

  // Every route starts at the top — the pages are long and scroll-driven.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col"
      style={{ background }}
    >
      <SiteNav overHero={overHero} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
