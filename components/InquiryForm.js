"use client";

import { useState } from "react";
import {
  User, Phone, Mail, BookOpen, GraduationCap, Languages, CalendarDays,
  Send, CheckCircle2, MessageSquareText,
} from "lucide-react";
import Flag from "@/components/Flag";
import { destinations } from "@/lib/data";

const levels = ["Foundation", "Undergraduate", "Master's", "PhD / Research", "Diploma"];

const empty = {
  name: "", phone: "", email: "", countries: [], level: "", program: "",
  education: "", english: "", intake: "", message: "", consent: false,
};

const base =
  "w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pr-2 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100";

export default function InquiryForm({ compact }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState(empty);

  const update = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const toggleCountry = (c) =>
    setForm({
      ...form,
      countries: form.countries.includes(c) ? form.countries.filter((x) => x !== c) : [...form.countries, c],
    });

  const submit = async (e) => {
    e.preventDefault();
    // TODO: connect to Express API — POST /api/inquiries
    // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiries`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(form),
    // });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-xl">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-50 text-green-600">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-slate-900">Thank you, {form.name.split(" ")[0] || "friend"}!</h3>
        <p className="mt-2 text-sm text-slate-600">
          Your inquiry has been received. A CARE counsellor will contact you shortly.
        </p>
        <button onClick={() => { setForm(empty); setSent(false); }} className="btn-outline mt-5">
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:p-5">
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-700 via-brand-400 to-accent-500" />

      <h3 className="mb-3 text-base font-bold text-slate-900">Book a Free Consultation</h3>

      <div className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field icon={User} label="Full Name" required>
            <input name="name" value={form.name} onChange={update} required placeholder="Your full name" className={`${base} pl-9`} />
          </Field>
          <Field icon={Phone} label="Phone / WhatsApp" required>
            <input name="phone" type="tel" value={form.phone} onChange={update} required placeholder="01XXXXXXXXX" className={`${base} pl-9`} />
          </Field>
          <Field icon={Mail} label="Email">
            <input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" className={`${base} pl-9`} />
          </Field>
          {!compact && (
            <Field icon={BookOpen} label="Subject of interest">
              <input name="program" value={form.program} onChange={update} placeholder="e.g. Computer Science" className={`${base} pl-9`} />
            </Field>
          )}
        </div>

        {/* Country chips */}
        <div>
          <Label>Preferred Country</Label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {destinations.map((d) => {
              const on = form.countries.includes(d.country);
              return (
                <button
                  type="button"
                  key={d.slug}
                  onClick={() => toggleCountry(d.country)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                    on
                      ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50"
                  }`}
                >
                  <Flag code={d.code} name={d.country} className="h-3 w-4" />
                  {d.country}
                </button>
              );
            })}
          </div>
        </div>

        {/* Level pills */}
        <div>
          <Label>Level of Study</Label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {levels.map((l) => (
              <button
                type="button"
                key={l}
                onClick={() => setForm({ ...form, level: form.level === l ? "" : l })}
                aria-pressed={form.level === l}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                  form.level === l
                    ? "border-accent-500 bg-accent-500 text-slate-900 shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-accent-300 hover:bg-accent-50"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {!compact && (
          <div className="grid gap-3 sm:grid-cols-3">
            <Field icon={GraduationCap} label="Last Education">
              <Select name="education" value={form.education} onChange={update}
                options={["SSC / O-Level", "HSC / A-Level", "Diploma", "Bachelor's", "Master's"]} />
            </Field>
            <Field icon={Languages} label="English Test">
              <Select name="english" value={form.english} onChange={update}
                options={["IELTS", "PTE", "Duolingo", "TOEFL", "Not taken yet"]} />
            </Field>
            <Field icon={CalendarDays} label="Intake">
              <Select name="intake" value={form.intake} onChange={update}
                options={["Spring", "Summer", "Autumn / Fall", "Winter", "Not sure yet"]} />
            </Field>
          </div>
        )}

        <Field icon={MessageSquareText} label="Message" top>
          <textarea
            name="message" rows={2} value={form.message} onChange={update}
            placeholder="Tell us about your study goals..." className={`${base} resize-none pl-9`}
          />
        </Field>

        <label className="flex items-start gap-2 text-xs leading-snug text-slate-600">
          <input type="checkbox" name="consent" checked={form.consent} onChange={update} required
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          I agree to be contacted by CARE Consultancy counsellors about my inquiry.
        </label>

        <button type="submit" className="btn-primary w-full py-2.5">
          Submit Inquiry <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

function Label({ children, required }) {
  return (
    <span className="block text-xs font-semibold text-slate-700">
      {children}{required && <span className="text-red-500"> *</span>}
    </span>
  );
}

function Field({ icon: Icon, label, required, top, children }) {
  return (
    <label className="block">
      <Label required={required}>{label}</Label>
      <span className="relative mt-1 block">
        <Icon className={`pointer-events-none absolute left-3 h-4 w-4 text-slate-400 ${top ? "top-2.5" : "top-1/2 -translate-y-1/2"}`} />
        {children}
      </span>
    </label>
  );
}

function Select({ name, value, onChange, options }) {
  return (
    <select name={name} value={value} onChange={onChange} className={`${base} appearance-none pl-9`}>
      <option value="">Select…</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
