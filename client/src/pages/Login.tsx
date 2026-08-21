import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { BRAND } from "@/lib/brand";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@shared/const";

/** Links a signed-out visitor may leave the gate through. */
const NAV = [
  { href: ROUTES.home, label: "الصفحة الرئيسية" },
  { href: ROUTES.about, label: "من نحن" },
];

/**
 * /login — the platform's gate, from the design's Login page: deep navy field
 * with a faint dot matrix, the lockup over a glowing cluster, and a glass card
 * holding the single UAE PASS entry.
 *
 * Signing in opens the demo session and returns to the landing page with the
 * member navigation; the UAE PASS OIDC redirect replaces the demo when the
 * platform connects.
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
      login({ name: "أحمد المنصوري", role: "منسق المسار في الجهة الاتحادية" });
      navigate(ROUTES.home);
    }, 900);
  };

  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#0A1426]"
    >
      {/* faint dot matrix across the whole field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(122,172,255,.07) 1px, transparent 1.4px)",
          backgroundSize: "26px 26px",
        }}
      />
      {/* the glowing cluster beside the lockup */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "18%",
          right: "56%",
          width: 460,
          height: 360,
          background:
            "radial-gradient(closest-side, rgba(59,130,246,.22), transparent 72%)",
          filter: "blur(4px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "22%",
          right: "58%",
          width: 300,
          height: 220,
          backgroundImage:
            "radial-gradient(rgba(147,197,253,.5) 1.5px, transparent 2px)",
          backgroundSize: "18px 18px",
          maskImage: "radial-gradient(closest-side, #000, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(closest-side, #000, transparent 75%)",
        }}
      />

      <nav
        className="relative z-10 flex items-center justify-center gap-2 px-6 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,.06)" }}
      >
        {NAV.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-full px-5 py-[10px] text-[13.5px] font-bold text-white/80 transition-colors hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16">
        <img
          src={BRAND.logoWhite}
          alt="مشروع الذكاء الاصطناعي المساعد"
          className="h-[104px] object-contain max-[480px]:h-[76px]"
        />

        <div
          className="mt-14 w-full max-w-[560px] rounded-[24px] px-10 py-11 text-center max-[480px]:px-6"
          style={{
            background:
              "linear-gradient(150deg, rgba(125,185,230,.28) 0%, rgba(56,105,160,.13) 40%, rgba(18,38,70,.05) 100%)",
            border: "1px solid rgba(255,255,255,.12)",
            boxShadow: "0 34px 90px -44px rgba(0,0,0,.65)",
          }}
        >
          <h1 className="m-0 text-[26px] font-black text-white">
            تسجيل الدخول
          </h1>

          <button
            type="button"
            onClick={signIn}
            disabled={busy}
            className="mx-auto mt-7 flex w-full max-w-[480px] cursor-pointer items-center justify-center gap-3 rounded-[14px] border-none bg-white px-8 py-[13px] text-[15px] font-extrabold text-[#0F1F3D] transition-[filter] hover:brightness-95 disabled:cursor-wait"
            style={{ opacity: busy ? 0.8 : 1 }}
          >
            <img
              src={BRAND.uaePass}
              alt=""
              className="h-[22px] w-[22px] object-contain"
            />
            {busy
              ? "جارِ التحقق من الهوية الرقمية…"
              : "تسجيل الدخول بالهوية الرقمية"}
          </button>

          <p
            className="mt-5 mb-0 text-[13px] font-bold leading-[1.9]"
            style={{ color: "rgba(214,230,255,.85)" }}
          >
            هوية رقمية واحدة موثوقة لجميع المواطنين والمقيمين والزوار
          </p>
        </div>
      </main>
    </div>
  );
}
