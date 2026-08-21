import { useEffect, useMemo, useRef, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PUBLICATIONS, PUBLICATION_CATEGORIES } from "@/data/publications";
import type { Publication, PublicationCategory } from "@shared/types";

/**
 * Normalise Arabic text for search: strip diacritics/tatweel and fold the alef
 * variants so "الادلة" matches "الأدلة".
 */
function normalise(text: string) {
  return text
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .trim();
}

/** Open a document in a new tab, falling back to a direct navigation when the
 *  popup is blocked. */
function previewDoc(doc: Publication) {
  const win = window.open(doc.fileUrl, "_blank", "noopener");
  if (!win) window.location.href = doc.fileUrl;
}

/** Download with the document's Arabic filename. */
function downloadDoc(doc: Publication) {
  const link = document.createElement("a");
  link.href = doc.fileUrl;
  link.download = `${doc.title}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export default function Library() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PublicationCategory | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close the filter popover on an outside click or Escape.
  useEffect(() => {
    if (!filterOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!filterRef.current?.contains(e.target as Node)) setFilterOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilterOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [filterOpen]);

  const results = useMemo(() => {
    const q = normalise(query);
    return PUBLICATIONS.filter(
      doc =>
        (!category || doc.category === category) &&
        (!q || normalise(doc.title).includes(q))
    );
  }, [query, category]);

  return (
    <SiteLayout background="#FFFFFF">
      <div className="mx-auto w-full max-w-[1240px] bg-white px-10 pt-[170px] pb-[90px] font-kufi max-[780px]:px-5 max-[780px]:pt-[130px] max-[780px]:pb-[60px]">
        <header className="mb-11 flex flex-wrap items-center justify-between gap-6">
          <h1
            className="m-0 text-right font-normal text-black"
            style={{ fontSize: "clamp(30px,9vw,46px)" }}
          >
            المنشورات
          </h1>

          <div
            ref={filterRef}
            className="relative z-30 w-[250px] max-[780px]:w-full"
          >
            <button
              type="button"
              onClick={() => setFilterOpen(open => !open)}
              aria-expanded={filterOpen}
              className="flex w-full cursor-pointer flex-row-reverse items-center justify-between border border-[#E3E9F2] bg-[#F6F8FB] px-[18px] py-[13px] text-[13.5px] font-bold text-[#0F1F3D] transition-colors hover:bg-[#EFF3F9]"
            >
              <span className="msr text-[18px] text-[#5B6B85]">
                {filterOpen ? "expand_less" : "expand_more"}
              </span>
              <span>{category ?? "المنشورات"}</span>
            </button>

            {filterOpen && (
              <div className="absolute inset-x-0 top-[calc(100%+4px)] flex flex-col gap-[2px] border border-[#E3E9F2] bg-white p-[10px] shadow-[0_22px_44px_-24px_rgba(15,31,61,.3)]">
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="بحث"
                  className="mb-2 w-full border border-[#E3E9F2] px-3 py-[9px] text-[13px] font-semibold outline-none focus:border-[#2563EB]"
                />
                {PUBLICATION_CATEGORIES.map(cat => {
                  const active = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(active ? null : cat);
                        setFilterOpen(false);
                      }}
                      className="cursor-pointer border-none bg-transparent px-3 py-[10px] text-right text-[13.5px] transition-colors hover:bg-[#F4F7FC]"
                      style={{
                        color: active ? "#2563EB" : "#0F1F3D",
                        fontWeight: active ? 800 : 600,
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </header>

        <div
          className="grid gap-x-9 gap-y-11"
          style={{
            gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))",
          }}
        >
          {results.map(doc => (
            <article key={doc.id} className="flex flex-col gap-4">
              <div
                className="group relative cursor-pointer overflow-hidden rounded-md bg-[#F2F5F9] shadow-[0_10px_26px_-18px_rgba(15,31,61,.35)]"
                style={{ aspectRatio: "0.72" }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("${doc.coverUrl}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                    backgroundColor: "#F2F5F9",
                  }}
                />
                {/* Hover reveal on pointer devices; always visible on touch,
                    where there is no hover state to reveal it. */}
                <div className="doc-actions absolute inset-0 flex items-center justify-center gap-3 bg-[rgba(8,24,58,0)] opacity-0 transition-all duration-[250ms] group-hover:bg-[rgba(8,24,58,.38)] group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => downloadDoc(doc)}
                    title="تحميل"
                    aria-label={`تحميل ${doc.title}`}
                    className="flex h-[46px] w-[46px] cursor-pointer items-center justify-center rounded-full border-none bg-white text-[#2563EB] shadow-[0_10px_24px_-10px_rgba(0,0,0,.4)] transition-colors hover:bg-[#EAF1FE]"
                  >
                    <span className="msr text-[21px]">download</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => previewDoc(doc)}
                    title="معاينة"
                    aria-label={`معاينة ${doc.title}`}
                    className="flex h-[46px] w-[46px] cursor-pointer items-center justify-center rounded-full border-none bg-white text-[#2563EB] shadow-[0_10px_24px_-10px_rgba(0,0,0,.4)] transition-colors hover:bg-[#EAF1FE]"
                  >
                    <span className="msr text-[21px]">visibility</span>
                  </button>
                </div>
              </div>
              <h2
                className="m-0 text-right text-[17px] font-extrabold leading-[1.7] text-[#0F1F3D]"
                style={{ textWrap: "balance" }}
              >
                {doc.title}
              </h2>
            </article>
          ))}
        </div>

        {results.length === 0 && (
          <div className="py-[60px] text-center">
            <span className="msr text-[44px] text-[#8A97AD]">search_off</span>
            <div className="mt-3 text-[15px] font-extrabold text-[#0F1F3D]">
              لا توجد منشورات مطابقة
            </div>
            <div className="mt-1 text-[12.5px] font-semibold text-[#8A97AD]">
              جرّب كلمة أخرى أو امسح البحث
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
