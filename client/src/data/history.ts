import type { HistoryMilestone } from "@shared/types";
import { MEDIA } from "@/lib/brand";

/**
 * The government-transformation journey rendered as a horizontally scrolling
 * filmstrip on the About page. Panel widths are viewport percentages and match
 * the design reference exactly.
 */
export const HISTORY: HistoryMilestone[] = [
  {
    year: "",
    title: "مسيرة التحول",
    eyebrow: "2001 إلى 2026",
    bg: "#2563EB",
    image: MEDIA.histIntro,
    layout: "intro",
    width: 100,
  },
  {
    year: "2001",
    title: "الحكومة الإلكترونية",
    bg: "#EFEDE8",
    image: MEDIA.hist2001,
    layout: "split",
    width: 80,
  },
  {
    year: "2013",
    title: "الحكومة الذكية",
    bg: "#2563EB",
    image: MEDIA.hist2013,
    layout: "bottom-start",
    width: 76,
  },
  {
    year: "2017",
    title: "تعيين أول وزير للذكاء الاصطناعي في العالم",
    bg: "#FFFFFF",
    image: MEDIA.hist2017,
    layout: "bottom-center",
    width: 72,
  },
  {
    year: "2019",
    title: "الحكومة الرقمية",
    bg: "#2563EB",
    image: MEDIA.hist2019,
    layout: "bottom-start",
    width: 76,
  },
  {
    year: "2026",
    title: "الذكاء الاصطناعي المساعد",
    bg: "#2563EB",
    image: MEDIA.hist2026,
    layout: "final",
    width: 100,
  },
];

/** Years that get a clickable tick on the journey ruler. */
export const HISTORY_MARKS = ["2001", "2013", "2017", "2019", "2026"];

/** Leadership quote shown under the journey. */
export const QUOTE = {
  text: "“التكنولوجيا في أفضل صورها لا تستبدل الإنسان، بل تمنحه مساحة ليصل إلى إمكاناته الحقيقية“",
  attribution:
    "معالي محمد القرقاوي — رئيس اللجنة الوطنية للذكاء الاصطناعي المساعد",
  image: MEDIA.mgQuote,
};
