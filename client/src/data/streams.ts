import type { Stream, StreamContact } from "@shared/types";

/** The five project workstreams, shown on Home and About. */
export const STREAMS: Stream[] = [
  {
    id: "operations",
    num: "01",
    title: "مسار العمليات والدعم المؤسسي",
    desc: "تحويل العمليات التخصصية وعمليات الدعم المؤسسي لتطبيق نماذج وأنظمة الذكاء الاصطناعي المساعد، بما يعزز الإنتاجية والأداء الحكومي",
  },
  {
    id: "strategic",
    num: "02",
    title: "مسار العمل الحكومي الاستراتيجي",
    desc: "تحويل المهام الاستراتيجية لتطبيق نماذج وأنظمة الذكاء الاصطناعي المساعد، بما يدعم جودة وسرعة صناعة القرار الحكومي",
  },
  {
    id: "services",
    num: "03",
    title: "مسار الخدمات الحكومية",
    desc: "تحويل الخدمات وباقات الخدمات لتطبيق نماذج وأنظمة الذكاء الاصطناعي المساعد، بما يحسّن تجربة المتعامل ويرفع من كفاءة الخدمة",
  },
  {
    id: "technology",
    num: "04",
    title: "مسار تقنيات الذكاء الاصطناعي والبيانات",
    desc: "تطوير وتنفيذ المتطلبات اللازمة لضمان حوكمة وجاهزية ونضج وأمن وسلامة المنظومة التقنية والبنية التحتية للذكاء الاصطناعي المساعد",
  },
  {
    id: "capabilities",
    num: "05",
    title: "مسار بناء القدرات والتدريب",
    desc: "تطوير وتأهيل الموظفين الحكوميين في مجال الذكاء الاصطناعي المساعد، بما يعزز جاهزية الكوادر للاستفادة من الفرص التي تتيحها التقنيات الحديثة",
  },
];

/**
 * Options offered by the contact form's "المسار المعني" dropdown.
 *
 * `representativeEmail` is deliberately absent here: the routing table is
 * configured in the backoffice dashboard and resolved server-side, so the
 * destination address never reaches the browser.
 */
export const CONTACT_STREAMS: StreamContact[] = [
  { id: "services", nameAr: "الخدمات الحكومية" },
  { id: "strategic", nameAr: "العمل الحكومي الاستراتيجي" },
  { id: "operations", nameAr: "العمليات والدعم المؤسسي" },
  { id: "capabilities", nameAr: "بناء القدرات والتدريب" },
  { id: "technology", nameAr: "تقنيات الذكاء الاصطناعي والبيانات" },
  { id: "general", nameAr: "استفسارات عامة" },
];
