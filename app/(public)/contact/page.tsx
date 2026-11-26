import InquiryFormSection from "@/components/InquiryFormSection";
import { site } from "@/lib/data";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 to-brand-800 text-white">
        <div className="container py-16 text-center">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-3 text-accent-300">We&apos;d love to hear from you. Let&apos;s plan your future together.</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Get in Touch</h2>
            <div className="mt-6 space-y-4 text-slate-600">
              <p>📍 <strong>Address:</strong> {site.address}</p>
              <p>📞 <strong>Phone:</strong> {site.phone}</p>
              {site.email && <p>✉️ <strong>Email:</strong> {site.email}</p>}
              <p>
                💬 <strong>WhatsApp:</strong>{" "}
                <a href={`https://wa.me/${site.whatsapp}`} className="text-brand-700 hover:underline">
                  Chat with us
                </a>
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <iframe
                src={site.mapEmbed}
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office location"
              />
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Send an Inquiry</h2>
            <InquiryFormSection />
          </div>
        </div>
      </section>
    </>
  );
}
