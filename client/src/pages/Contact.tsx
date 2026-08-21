import { useState, type CSSProperties } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CONTACT_STREAMS } from "@/data/streams";
import type { ContactRequest, SubmitState } from "@shared/types";

type Field = keyof ContactRequest;

const EMPTY: ContactRequest = {
  name: "",
  phone: "",
  email: "",
  streamId: "",
  message: "",
};

/** UAE numbers: +971 5x xxxxxxx or a local 05x xxxxxxx, spaces/dashes ignored. */
const PHONE_RE = /^(?:\+?971|0)(?:\d{8,9})$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ERRORS: Record<Field, string> = {
  name: "يرجى إدخال الاسم",
  phone: "يرجى إدخال رقم هاتف صحيح",
  email: "يرجى إدخال بريد إلكتروني صحيح",
  streamId: "يرجى اختيار المسار المعني",
  message: "يرجى كتابة محتوى الرسالة",
};

function validate(values: ContactRequest): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (!values.name.trim()) errors.name = ERRORS.name;
  if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, ""))) {
    errors.phone = ERRORS.phone;
  }
  if (!EMAIL_RE.test(values.email.trim())) errors.email = ERRORS.email;
  if (!values.streamId) errors.streamId = ERRORS.streamId;
  if (!values.message.trim()) errors.message = ERRORS.message;
  return errors;
}

const controlStyle = (invalid: boolean): CSSProperties => ({
  width: "100%",
  background: "#F7F9FD",
  border: `1.5px solid ${invalid ? "#B42318" : "#E1E7F1"}`,
  borderRadius: 12,
  padding: "12px 15px",
  fontSize: 14,
  fontWeight: 600,
  outline: "none",
  fontFamily: "inherit",
});

export default function Contact() {
  const [values, setValues] = useState<ContactRequest>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<SubmitState>("idle");
  /** Honeypot: a real person never fills a field they cannot see. */
  const [trap, setTrap] = useState("");

  const set = (field: Field) => (value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear the inline error as soon as the visitor starts fixing the field.
    setErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (state === "sending") return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    // Silently accept-and-drop bot submissions.
    if (trap) {
      setState("success");
      return;
    }

    setState("sending");
    try {
      // The server resolves streamId → the stream representative's email from
      // the backoffice config and sends the message. That mapping never
      // reaches the browser, and the UI never mentions it.
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setState("success");
      setValues(EMPTY);
    } catch {
      setState("error");
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setState("idle");
  };

  return (
    <SiteLayout background="#EEF2F9">
      <div className="mx-auto w-full max-w-[840px] px-8 pt-[140px] pb-[72px]">
        <header className="mb-[30px] text-center">
          <h1 className="m-0 mb-2 text-[30px] font-black">تواصل معنا</h1>
          <p className="m-0 text-[14.5px] font-semibold text-[#5E6E8C]">
            ما الذي ترغب في الاستفسار عنه؟
          </p>
        </header>

        <div className="rounded-[22px] border border-[#E7ECF4] bg-white px-[42px] py-[38px] shadow-[0_18px_44px_-30px_rgba(15,31,61,.35)] max-[700px]:px-5 max-[700px]:py-[26px]">
          {state === "success" ? (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="msr text-[56px] text-[#16A34A]">
                check_circle
              </span>
              <h2 className="mt-4 mb-0 text-xl font-black">
                تم إرسال استفسارك بنجاح
              </h2>
              <p className="mt-2 mb-0 text-[13.5px] font-semibold text-[#5E6E8C]">
                سيتواصل معك الفريق المعني في أقرب وقت.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-7 cursor-pointer rounded-xl border-[1.5px] border-[#C9D8F2] bg-white px-6 py-3 text-sm font-extrabold text-[#2563EB] transition-colors hover:bg-[#F0F5FF]"
              >
                إرسال استفسار آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {state === "error" && (
                <div
                  role="alert"
                  className="mb-5 rounded-[14px] border border-[#F3D2D2] bg-[#FDF6F6] px-5 py-4 text-[13px] font-bold text-[#7A3B3B]"
                >
                  تعذر إرسال الاستفسار، يرجى المحاولة مجدداً.
                </div>
              )}

              <div className="grid grid-cols-2 gap-x-5 gap-y-[18px] max-[700px]:grid-cols-1">
                <Field
                  id="name"
                  label="الاسم"
                  error={errors.name}
                  placeholder="الاسم الكامل"
                  value={values.name}
                  onChange={set("name")}
                />
                <Field
                  id="phone"
                  label="رقم الهاتف"
                  error={errors.phone}
                  placeholder="+971 5x xxx xxxx"
                  value={values.phone}
                  onChange={set("phone")}
                  type="tel"
                  ltr
                />
                <Field
                  id="email"
                  label="البريد الإلكتروني"
                  error={errors.email}
                  placeholder="name@entity.gov.ae"
                  value={values.email}
                  onChange={set("email")}
                  type="email"
                  ltr
                />

                <div>
                  <label
                    htmlFor="streamId"
                    className="mb-[7px] block text-[12.5px] font-extrabold text-[#54627B]"
                  >
                    المسار المعني
                  </label>
                  <select
                    id="streamId"
                    value={values.streamId}
                    onChange={e => set("streamId")(e.target.value)}
                    aria-invalid={Boolean(errors.streamId)}
                    className="cursor-pointer focus:!border-[#2563EB] focus:!bg-white"
                    style={{
                      ...controlStyle(Boolean(errors.streamId)),
                      padding: "12px 15px 12px 18px",
                      fontWeight: 700,
                      color: "#0F1F3D",
                    }}
                  >
                    <option value="">اختر المسار…</option>
                    {CONTACT_STREAMS.map(stream => (
                      <option key={stream.id} value={stream.id}>
                        {stream.nameAr}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.streamId} />
                </div>

                <div className="col-span-full max-[700px]:col-span-1">
                  <label
                    htmlFor="message"
                    className="mb-[7px] block text-[12.5px] font-extrabold text-[#54627B]"
                  >
                    محتوى الرسالة
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="اكتب استفسارك هنا…"
                    value={values.message}
                    onChange={e => set("message")(e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    className="focus:!border-[#2563EB] focus:!bg-white"
                    style={{
                      ...controlStyle(Boolean(errors.message)),
                      padding: "13px 15px",
                      resize: "vertical",
                    }}
                  />
                  <FieldError message={errors.message} />
                </div>
              </div>

              {/* Honeypot — hidden from people, tempting to bots. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={trap}
                onChange={e => setTrap(e.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />

              <div className="mt-[22px] flex items-center justify-end gap-4">
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="cursor-pointer rounded-xl border-none px-[52px] py-[13px] text-[15px] font-extrabold text-white transition-[filter] hover:brightness-110 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
                    opacity: state === "sending" ? 0.7 : 1,
                  }}
                >
                  {state === "sending" ? "جارِ الإرسال…" : "إرسال"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

/* -------------------------------------------------------------------------- */

interface FieldProps {
  id: Field;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  /** Latin-script value, right-aligned inside the RTL form. */
  ltr?: boolean;
}

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  ltr = false,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-[7px] block text-[12.5px] font-extrabold text-[#54627B]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className="focus:!border-[#2563EB] focus:!bg-white"
        style={{
          ...controlStyle(Boolean(error)),
          ...(ltr ? { direction: "ltr", textAlign: "right" } : null),
        }}
      />
      <FieldError message={error} />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mt-[6px] text-xs font-bold text-[#B42318]">{message}</div>
  );
}
