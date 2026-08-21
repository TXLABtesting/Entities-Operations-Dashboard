import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { BRAND } from "@/lib/brand";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@shared/const";

/** Links a signed-out visitor may leave the gate through. */
const NAV = [
  { href: ROUTES.home, label: "الرئيسية" },
  { href: ROUTES.about, label: "من نحن" },
];

/**
 * /login — the platform's gate, taken verbatim from the design project's
 * "AI Transformation Portal" Login screen: a #071224 field under a wide dot
 * matrix and two ambient glows, a fixed centered nav, the white lockup over a
 * frosted card holding the single UAE PASS entry, and the copyright line.
 *
 * Signing in mirrors the design's loginUaePass: store the session and return
 * to the landing page, where the member navigation takes over. The UAE PASS
 * OIDC redirect replaces the stored demo user when the platform connects.
 */
export default function Login() {
  const { user, login } = useAuth();
  const [, navigate] = useLocation();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Already signed in: the gate has nothing to offer, go home.
  useEffect(() => {
    if (user && !busy) navigate(ROUTES.home, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const signIn = () => {
    if (busy) return;
    setBusy(true);
    // A short beat where the real flow would round-trip to UAE PASS.
    window.setTimeout(() => {
      login({ name: "أحمد المنصوري", role: "منسق الجهة" });
      navigate(ROUTES.home);
    }, 600);
  };

  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071224]"
    >
      {/* wide dot matrix across the whole field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(122,162,220,.13) 1.5px, transparent 1.5px)",
          backgroundSize: "34px 34px",
        }}
      />
      {/* ambient corner glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 82% 12%, rgba(39,120,240,.14), transparent 45%), radial-gradient(circle at 12% 88%, rgba(37,99,235,.14), transparent 45%)",
        }}
      />

      <nav className="fixed inset-x-0 top-[18px] z-[60] flex justify-center px-5">
        <div className="flex h-fit w-full max-w-[1180px] items-center justify-center rounded-2xl bg-transparent px-[14px] py-3 [gap:clamp(6px,1.4vw,30px)]">
          {NAV.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full px-5 py-[10px] text-[13px] font-bold text-[#C9DAF2] no-underline transition-colors hover:bg-white/[.12] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <div
        className="relative z-[1] mx-6 mb-6 mt-[90px] w-full max-w-[520px] text-center"
        style={{ animation: "fadeUp .5s ease both" }}
      >
        <img
          src={BRAND.logoWhite}
          alt="مشروع الذكاء الاصطناعي المساعد لحكومة دولة الإمارات"
          className="inline-block h-[170px] max-[480px]:h-[120px]"
        />

        <div
          className="mx-auto mt-[34px] max-w-[470px] rounded-[26px] px-8 pb-[30px] pt-9 max-[480px]:px-5"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,.09), rgba(39,120,240,.14))",
            border: "1px solid rgba(122,178,255,.22)",
            backdropFilter: "blur(16px) saturate(140%)",
            WebkitBackdropFilter: "blur(16px) saturate(140%)",
            boxShadow: "0 30px 70px -28px rgba(0,0,0,.6)",
          }}
        >
          <h1 className="m-0 mb-6 text-[28px] font-black text-white">
            تسجيل الدخول
          </h1>

          <button
            type="button"
            onClick={signIn}
            disabled={busy}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-[14px] border-none bg-white px-5 py-[15px] transition-[transform,box-shadow] duration-150 hover:scale-[1.015] disabled:cursor-wait"
            style={{
              boxShadow: "0 12px 30px -14px rgba(0,0,0,.55)",
              opacity: busy ? 0.85 : 1,
            }}
          >
            <img
              src={BRAND.uaePass}
              alt=""
              className="block h-[26px] max-h-[26px] w-auto"
            />
            <span className="text-[17px] font-extrabold text-[#1A1A1A] max-[480px]:text-[15px]">
              {busy
                ? "جارِ التحقق من الهوية الرقمية…"
                : "تسجيل الدخول بالهوية الرقمية"}
            </span>
          </button>

          <div className="mt-[18px] text-[13px] font-semibold text-[#AFC6E8]">
            هوية رقمية واحدة موثوقة لجميع المواطنين والمقيمين والزوار
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-5 z-[1] text-center text-[11.5px] font-medium text-[#5E7BA8]">
        © 2026 مشروع الذكاء الاصطناعي المساعد، جميع الحقوق محفوظة
      </div>
    </div>
  );
}
