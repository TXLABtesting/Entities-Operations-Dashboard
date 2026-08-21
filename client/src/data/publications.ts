import type { Publication, PublicationCategory } from "@shared/types";
import { asset } from "@/lib/brand";

/** Filter categories offered by the library dropdown. */
export const PUBLICATION_CATEGORIES: PublicationCategory[] = [
  "الأدلة والمعايير",
  "الاستراتيجية والسياسات",
];

/**
 * Launch set of official documents. These become backoffice-driven once the
 * API is wired up — the shape here matches `Publication` so the swap is a
 * straight substitution of the fetch source.
 */
export const PUBLICATIONS: Publication[] = [
  {
    id: "pub-01",
    num: "01",
    title: "الدليل التعريفي للذكاء الاصطناعي المساعد",
    category: "الأدلة والمعايير",
    tag: "دليل · PDF",
    date: "يوليو 2026",
    desc: "دليل تعريفي شامل بمشروع الذكاء الاصطناعي المساعد: أهدافه، ومستهدفاته، ونطاق التحويل، والمبادئ العامة الأربعة عشر التي تحكم تطبيقه على مستوى الجهات الاتحادية.",
    coverUrl: asset("assets/docs/pub-01-cover.jpg"),
    fileUrl: asset("assets/docs/pub-01.pdf"),
  },
  {
    id: "pub-02",
    num: "02",
    title: "نظام عمل مشروع الذكاء الاصطناعي المساعد",
    category: "الاستراتيجية والسياسات",
    tag: "نظام عمل · PDF",
    date: "يوليو 2026",
    desc: "نظام العمل المعتمد للمشروع: الحوكمة، وأدوار رؤساء المسارات، وآليات المتابعة والتقارير، والإجراءات التنظيمية على مستوى حكومة دولة الإمارات.",
    coverUrl: asset("assets/docs/pub-02-cover.jpg"),
    fileUrl: asset("assets/docs/pub-02.pdf"),
  },
];
