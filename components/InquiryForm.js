"use client";

import { useState } from "react";
import { destinations } from "@/lib/data";

export default function InquiryForm({ compact }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    program: "",
    message: "",
  });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-2xl">✅</p>
        <h3 className="mt-2 text-lg font-bold text-slate-900">Thank you!</h3>
        <p className="mt-1 text-slate-600">
          Your inquiry has been received. A counsellor will contact you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" name="name" value={form.name} onChange={update} required />
        <Field label="Phone" name="phone" value={form.phone} onChange={update} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" value={form.email} onChange={update} required />
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Preferred Country</label>
          <select
            name="country"
            value={form.country}
            onChange={update}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">Select a country</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.country}>{d.country}</option>
            ))}
          </select>
        </div>
      </div>
      {!compact && (
        <Field label="Program / Subject of interest" name="program" value={form.program} onChange={update} />
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Message</label>
        <textarea
          name="message"
          rows={compact ? 2 : 4}
          value={form.message}
          onChange={update}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="Tell us about your study goals..."
        />
      </div>
      <button type="submit" className="btn-primary w-full">Submit Inquiry</button>
      <p className="text-center text-xs text-slate-500">
        By submitting, you agree to be contacted by our counsellors.
      </p>
    </form>
  );
}

function Field({ label, name, value, onChange, type = "text", required }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  );
}
