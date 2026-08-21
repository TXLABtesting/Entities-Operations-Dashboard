import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { BRAND } from "@/lib/brand";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@shared/const";

/**
 * The dashboard adapts to who signed in; these are the four roles from the
 * platform design. The demo session opens on the first.
 */
const ROLES = [
  "منسق المسار في الجهة الاتحادية",
  "فريق عمل المسار في المشروع",
  "اللجنة الوطنية للذكاء الاصطناعي المساعد",
  "مشرف النظام",
];

const TRACKS = [
  { icon: "settings_suggest", label: "مسار العمليات والدعم المؤسسي", count: 2 },
  { icon: "query_stats", label: "مسار العمل الحكومي الاستراتيجي", count: 1 },
  { icon: "support_agent", label: "مسار الخدمات الحكومية", count: 2 },
];

const STATS = [
  { label: "إجمالي عدد العمليات الرئيسية", value: 2 },
  { label: "إجمالي عدد الأنشطة الفرعية", value: 6 },
  { label: "إجمالي عدد الأنشطة الفرعية القابلة للتحول", value: 6 },
  { label: "إجمالي عدد الأنشطة الفرعية المستهدف تحويلها", value: 6 },
];

interface EntryRow {
  title: string;
  category: string;
  supportType: string;
  status: "معتمد" | "قيد الاعتماد";
  removable?: boolean;
}

/** Launch data-set from the design; the backoffice feed replaces it. */
const ENTRIES: EntryRow[] = [
  {
    title: "معالجة طلبات الدعم الفني",
    category: "عمليات الدعم المؤسسي",
    supportType: "—",
    status: "معتمد",
  },
  {
    title: "تدقيق طلبات الموارد البشرية",
    category: "عمليات الدعم المؤسسي",
    supportType: "الشؤون المالية",
    status: "قيد الاعتماد",
    removable: true,
  },
];

const FILTERS = ["تصنيف العملية: الكل", "قابلية التحول: الكل", "الحالة"];

function StatusChip({ status }: { status: EntryRow["status"] }) {
  const approved = status === "معتمد";
  return (
    <span
      className="inline-flex items-center gap-2 rounded-lg px-3 py-[6px] text-[13px] font-extrabold"
      style={{
        background: approved ? "#E8F6EE" : "#FBF3E2",
        color: approved ? "#15803D" : "#B45309",
      }}
    >
      <span
        className="h-[7px] w-[7px] rounded-full"
        style={{ background: approved ? "#16A34A" : "#D97706" }}
      />
      {status}
    </span>
  );
}

/**
 * /dashboard — منصة الإدخال: "جميع مدخلات المسار" from the platform design.
 * Role tabs across the top, the tally and launch-batch lists on the side, and
 * the entries table with its stats, filters and Excel actions.
 *
 * The actions are the visual surface for now; they wire to the backoffice API
 * with the rest of the platform.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [role, setRole] = useState(0);
  const [track, setTrack] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // The dashboard is members-only; the gate is the way in.
  useEffect(() => {
    if (!user) navigate(ROUTES.login, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return null;

  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-[#F6F8FB]">
      {/* app bar: lockup · role tabs · account controls */}
      <header className="flex items-center justify-between gap-6 border-b border-[#E7ECF4] bg-white px-6 py-4">
        <img
          src={BRAND.logoLockup}
          alt="مشروع الذكاء الاصطناعي المساعد"
          className="h-12 flex-none object-contain"
        />
        <div className="no-scrollbar flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto">
          {ROLES.map((label, i) => {
            const active = i === role;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setRole(i)}
                className="cursor-pointer whitespace-nowrap rounded-xl px-[18px] py-[10px] text-[14px] font-bold transition-colors"
                style={{
                  background: active ? "#F1F4F9" : "transparent",
                  border: active
                    ? "1px solid #D8E0EC"
                    : "1px solid transparent",
                  color: "#0F1F3D",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-none items-center gap-3">
          <button
            type="button"
            aria-label="التنبيهات"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[#E7ECF4] bg-white text-[#0F1F3D] transition-colors hover:bg-[#F4F7FC]"
          >
            <span className="msr text-[20px]">notifications</span>
          </button>
          <button
            type="button"
            aria-label="حساب المستخدم"
            title={`${user.name} — ${ROLES[role]}`}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border-none bg-[#2563EB] text-white transition-[filter] hover:brightness-110"
          >
            <span className="msr text-[20px]">person</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 items-stretch">
        {/* side lists: the tally queues and the launch batches */}
        <aside className="w-[290px] flex-none border-l border-[#E7ECF4] bg-white px-4 py-6 max-[1024px]:hidden">
          <div className="px-3 pb-3 text-[13.5px] font-extrabold text-[#0F1F3D]">
            قوائم الحصر
          </div>
          <div className="flex flex-col gap-1">
            {TRACKS.map((item, i) => {
              const active = i === track;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setTrack(i)}
                  className="relative flex cursor-pointer items-center gap-3 rounded-xl border-none px-3 py-3 text-right text-[13.5px] font-bold transition-colors"
                  style={{
                    background: active ? "#EAF1FE" : "transparent",
                    color: active ? "#2563EB" : "#33415E",
                  }}
                >
                  {active && (
                    <span className="absolute inset-y-2 right-0 w-[3px] rounded-full bg-[#2563EB]" />
                  )}
                  <span className="msr flex-none text-[18px]">{item.icon}</span>
                  <span className="min-w-0 flex-1 leading-[1.7]">
                    {item.label}
                  </span>
                  <span
                    className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full text-[11.5px] font-extrabold"
                    style={{
                      background: active ? "#DBEAFE" : "#EEF2F8",
                      color: active ? "#2563EB" : "#5E6E8C",
                    }}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-7 px-3 pb-3 text-[13.5px] font-extrabold text-[#0F1F3D]">
            دفعات الإطلاق
          </div>
          <div className="flex flex-col gap-1">
            {TRACKS.map(item => (
              <button
                key={item.label}
                type="button"
                className="flex cursor-pointer items-center gap-3 rounded-xl border-none bg-transparent px-3 py-3 text-right text-[13.5px] font-bold text-[#33415E] transition-colors hover:bg-[#F4F7FC]"
              >
                <span className="msr flex-none text-[18px]">{item.icon}</span>
                <span className="min-w-0 flex-1 leading-[1.7]">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-7 py-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h1 className="m-0 text-[26px] font-black text-[#0F1F3D]">
              جميع مدخلات المسار
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 rounded-xl border-none bg-[#2563EB] px-5 py-[11px] text-[14px] font-extrabold text-white transition-[filter] hover:brightness-110"
              >
                <span className="msr text-[18px]">add</span>
                إضافة المدخلات
              </button>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 rounded-xl border-none bg-[#16A34A] px-5 py-[11px] text-[14px] font-extrabold text-white transition-[filter] hover:brightness-110"
              >
                <span className="msr text-[18px]">upload</span>
                رفع ملف Excel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 max-[1240px]:grid-cols-2 max-[560px]:grid-cols-1">
            {STATS.map(stat => (
              <div
                key={stat.label}
                className="flex min-h-[120px] flex-col justify-between rounded-2xl border border-[#E7ECF4] bg-white px-5 py-4"
              >
                <div className="text-[14.5px] font-bold leading-[1.8] text-[#0F1F3D]">
                  {stat.label}
                </div>
                <div
                  className="text-[34px] font-black leading-none text-[#0F1F3D]"
                  style={{ direction: "ltr", textAlign: "left" }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <label className="flex min-w-[240px] items-center gap-2 rounded-xl border border-[#E3E9F2] bg-white px-4 py-[11px]">
                <span className="msr text-[18px] text-[#8A97AD]">search</span>
                <input
                  placeholder="البحث باسم المدخل..."
                  className="w-full border-none bg-transparent text-[13.5px] font-semibold outline-none"
                />
              </label>
              {FILTERS.map(filter => (
                <button
                  key={filter}
                  type="button"
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#E3E9F2] bg-white px-4 py-[11px] text-[13.5px] font-bold text-[#0F1F3D] transition-colors hover:bg-[#F4F7FC]"
                >
                  {filter}
                  <span className="msr text-[18px] text-[#8A97AD]">
                    expand_more
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#E3E9F2] bg-white px-4 py-[11px] text-[13.5px] font-extrabold text-[#0F1F3D] transition-colors hover:bg-[#F4F7FC]"
            >
              <span className="msr text-[18px]">download</span>
              تحميل التقرير
            </button>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-[#E7ECF4] bg-white">
            <table className="w-full min-w-[760px] border-collapse text-right">
              <thead>
                <tr className="border-b border-[#EDF1F8]">
                  {[
                    "العنوان",
                    "التصنيف",
                    "نوع عملية الدعم المؤسسي",
                    "الحالة",
                    "الإجراء",
                  ].map(head => (
                    <th
                      key={head}
                      className="px-5 py-4 text-[13.5px] font-extrabold text-[#5E6E8C]"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ENTRIES.map(entry => (
                  <tr
                    key={entry.title}
                    className="border-b border-[#F2F5FA] last:border-b-0"
                  >
                    <td className="px-5 py-5 text-[15px] font-extrabold text-[#0F1F3D]">
                      {entry.title}
                    </td>
                    <td className="px-5 py-5 text-[14px] font-semibold text-[#33415E]">
                      {entry.category}
                    </td>
                    <td className="px-5 py-5 text-[14px] font-semibold text-[#33415E]">
                      {entry.supportType}
                    </td>
                    <td className="px-5 py-5">
                      <StatusChip status={entry.status} />
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="cursor-pointer rounded-[10px] border-none bg-[#EFF4FC] px-4 py-[9px] text-[13px] font-extrabold text-[#2563EB] transition-colors hover:bg-[#E2ECFB]"
                        >
                          عرض التفاصيل
                        </button>
                        {entry.removable && (
                          <button
                            type="button"
                            className="cursor-pointer rounded-[10px] border border-[#F3D2D2] bg-[#FDF1F1] px-4 py-[9px] text-[13px] font-extrabold text-[#DC2626] transition-colors hover:bg-[#FBE4E4]"
                          >
                            إزالة
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
