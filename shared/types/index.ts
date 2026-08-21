/**
 * Types shared between the client and (later) the API layer.
 * The public site is currently rendered from the static seeds in
 * `client/src/data/`; once the backoffice endpoints are wired up these same
 * shapes are what the server returns.
 */

/** One of the five project workstreams. */
export interface Stream {
  id: string;
  num: string;
  /** Arabic display title, e.g. "مسار الخدمات الحكومية". */
  title: string;
  desc: string;
}

/** A contact-form destination. `representativeEmail` is server-only and must
 *  never be serialised to the client. */
export interface StreamContact {
  id: string;
  nameAr: string;
  representativeEmail?: string;
}

/** A milestone on the government-transformation history journey. */
export interface HistoryMilestone {
  year: string;
  title: string;
  /** Panel background colour, drives the ambient tint of the journey view. */
  bg: string;
  image: string;
  /** Layout treatment used by the horizontal journey on the About page. */
  layout: "intro" | "split" | "bottom-start" | "bottom-center" | "final";
  /** Panel width as a viewport percentage. */
  width: number;
  /**
   * Where the people are in the photograph, as an `object-position` value.
   * The desktop panels are wide enough to show the whole frame; the stacked
   * mobile panels crop it, so each image says which part must survive.
   */
  focus?: string;
  /** Intro panel copy. */
  eyebrow?: string;
}

/** One of the 14 general principles. */
export interface Principle {
  n: string;
  title: string;
  desc: string;
}

/** A phase of the implementation programme. */
export interface Phase {
  phase: string;
  title: string;
  range: string;
  months: string;
  desc: string;
}

/** A news item shown in the Home carousel. */
export interface NewsItem {
  id: string;
  image: string;
  date: string;
  title: string;
  desc: string;
  source: string;
  link: string;
}

/** Home page headline targets. */
export interface Target {
  /** Percentage the counter animates up to. */
  value: number;
  /** How far the column's liquid rises, as a percentage of its height. The
   *  design tops the 100% column out at 93% so the meniscus stays visible
   *  below the cap. */
  fill: number;
  label: string;
  /** Height of the 3-D column in pixels. */
  height: number;
}

export type PublicationCategory = "الأدلة والمعايير" | "الاستراتيجية والسياسات";

/** A document in the library, data-driven from the backoffice. */
export interface Publication {
  id: string;
  num: string;
  title: string;
  category: PublicationCategory;
  /** Meta line, e.g. "دليل · PDF". */
  tag: string;
  date: string;
  desc: string;
  coverUrl: string;
  fileUrl: string;
}

/** Payload posted by the contact form. The server resolves `streamId` to the
 *  stream representative's email; the mapping never reaches the client. */
export interface ContactRequest {
  name: string;
  phone: string;
  email: string;
  streamId: string;
  message: string;
}

export type SubmitState = "idle" | "sending" | "success" | "error";
