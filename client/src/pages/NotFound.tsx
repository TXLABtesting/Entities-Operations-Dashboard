import { Link } from "wouter";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ROUTES } from "@shared/const";

export default function NotFound() {
  return (
    <SiteLayout background="#EEF2F9">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[840px] flex-col items-center justify-center px-8 pt-[140px] pb-[72px] text-center">
        <div className="text-[64px] font-black leading-none text-[#2563EB]">
          404
        </div>
        <h1 className="mt-4 mb-0 text-2xl font-black">الصفحة غير موجودة</h1>
        <p className="mt-3 mb-0 text-sm font-semibold text-[#5E6E8C]">
          تعذر العثور على الصفحة المطلوبة.
        </p>
        <Link
          href={ROUTES.home}
          className="mt-8 rounded-xl px-7 py-3 text-sm font-extrabold text-white transition-[filter] hover:brightness-110"
          style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}
        >
          العودة إلى الرئيسية
        </Link>
      </div>
    </SiteLayout>
  );
}
