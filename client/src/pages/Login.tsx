import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { SiteLayout } from "@/components/site/SiteLayout";
import { BRAND } from "@/lib/brand";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@shared/const";

/**
 * The soft sky-blue backdrop from the design's hero, reused so the gate reads
 * as part of the same world as the landing page.
 */
const GATE_BACKDROP =
  "radial-gradient(70% 62% at 80% 8%, rgba(178,219,250,.9) 0%, rgba(198,229,252,.42) 46%, rgba(220,240,254,0) 74%), radial-gradient(65% 58% at 8% 26%, rgba(190,224,251,.85) 0%, rgba(208,233,252,.38) 48%, rgba(228,243,254,0) 74%), radial-gradient(75% 66% at 28% 96%, rgba(171,215,249,.95) 0%, rgba(196,228,252,.45) 46%, rgba(224,241,254,0) 76%), linear-gradient(180deg, #FDFEFF 0%, #F5F9FE 40%, #EFF6FD 100%)";

/**
 * /login — the UAE PASS gate into منصة الإدخال.
 *
 * The portal's own design file was not part of the public-site handoff bundle
 * (only its assets were), so this screen is composed from those assets and the
 * bundle's tokens. Signing in currently opens the demo session — the visitor
 * lands back on the home page with the member navigation — and the UAE PASS
 * OIDC redirect replaces the demo when the platform connects.
 */
export default function Login() {
  const { user, login } = useAuth();
  const [, navigate] = useLocation();
  const [busy, setBusy] = useState(false);

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
      login({ name: "أحمد المنصوري", role: "ممثل الجهة الاتحادية" });
      navigate(ROUTES.home);
    }, 900);
  };

  return (
    <SiteLayout background={GATE_BACKDROP}>
      <div
        className="flex w-full items-center justify-center px-6"
        style={{ minHeight: "100svh", paddingTop: 130, paddingBottom: 70 }}
      >
        <div className="w-full max-w-[440px] rounded-[22px] border border-[#E7ECF4] bg-white px-10 py-11 text-center shadow-[0_18px_44px_-30px_rgba(15,31,61,.35)] max-[480px]:px-6">
          <img
            src={BRAND.logoLockup}
            alt="مشروع الذكاء الاصطناعي المساعد"
            className="mx-auto h-[64px] object-contain"
          />

          <h1 className="mt-8 mb-0 text-2xl font-black text-[#0F1F3D]">
            تسجيل الدخول
          </h1>
          <p className="mt-2 mb-0 text-[13.5px] font-semibold leading-[2] text-[#5E6E8C]">
            الدخول إلى منصة الإدخال الخاصة بمشروع الذكاء الاصطناعي المساعد
          </p>

          <button
            type="button"
            onClick={signIn}
            disabled={busy}
            className="mt-8 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-none bg-[#0F1F3D] px-5 py-[13px] text-[14.5px] font-extrabold text-white transition-all hover:bg-[#1B3260] disabled:cursor-wait"
            style={{ opacity: busy ? 0.75 : 1 }}
          >
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px] bg-white">
              <img
                src={BRAND.uaePass}
                alt=""
                className="h-[22px] w-[22px] object-contain"
              />
            </span>
            {busy
              ? "جارِ التحقق من الهوية الرقمية…"
              : "تسجيل الدخول بالهوية الرقمية"}
          </button>
          <div className="mt-[10px] text-[11px] font-bold tracking-[.08em] text-[#8A97AD]">
            UAE PASS
          </div>

          <div className="mt-8 border-t border-[#EDF1F8] pt-5 text-xs font-semibold leading-[1.9] text-[#8A97AD]">
            الدخول متاح للموظفين الحكوميين وممثلي الجهات الاتحادية المعتمدين
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
