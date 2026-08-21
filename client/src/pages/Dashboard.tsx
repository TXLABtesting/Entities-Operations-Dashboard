import { useEffect } from "react";
import { useLocation } from "wouter";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@shared/const";

/**
 * /dashboard — منصة الإدخال, reached from the signed-in nav.
 *
 * The entries dashboard has its own design in the platform project that was
 * not part of the public-site handoff bundle; this page holds its place in
 * the flow (route, auth guard, shell) until that design export arrives, then
 * it is rebuilt from it screen-for-screen.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // The dashboard is members-only; the gate is the way in.
  useEffect(() => {
    if (!user) navigate(ROUTES.login, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return null;

  return (
    <SiteLayout background="#F4F7FB">
      <div className="mx-auto w-full max-w-[1080px] px-8 pt-[150px] pb-[80px]">
        <header className="mb-8">
          <h1 className="m-0 text-[28px] font-black text-[#0F1F3D]">
            منصة الإدخال
          </h1>
          <p className="mt-2 mb-0 text-[14px] font-semibold text-[#5E6E8C]">
            أهلاً {user.name} — {user.role}
          </p>
        </header>

        <div className="flex flex-col items-center rounded-[22px] border border-[#E7ECF4] bg-white px-10 py-16 text-center shadow-[0_18px_44px_-30px_rgba(15,31,61,.35)]">
          <span className="flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-[#EAF1FE]">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563EB"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="9" rx="1.5" />
              <rect x="14" y="3" width="7" height="5" rx="1.5" />
              <rect x="14" y="12" width="7" height="9" rx="1.5" />
              <rect x="3" y="16" width="7" height="5" rx="1.5" />
            </svg>
          </span>
          <h2 className="mt-6 mb-0 text-xl font-black text-[#0F1F3D]">
            لوحة الإدخالات
          </h2>
          <p className="mt-3 mb-0 max-w-[520px] text-[13.5px] font-semibold leading-[2.1] text-[#5E6E8C]">
            تُعرض هنا إدخالات الجهات الاتحادية ومتابعتها. تُبنى اللوحة من تصميم
            المنصة وتُفعّل في هذا الموضع.
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
