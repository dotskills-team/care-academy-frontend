import { site } from "@/lib/data";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: [date]</p>

        <div className="prose mt-8 space-y-4 text-slate-600">
          <p>
            This is placeholder privacy policy text for {site.name}. Replace it with
            your reviewed legal content before launch.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Information We Collect</h2>
          <p>We collect the information you provide through our inquiry and contact forms, such as your name, email, phone number and study preferences.</p>
          <h2 className="text-xl font-semibold text-slate-900">How We Use It</h2>
          <p>Your information is used solely to respond to your inquiries and provide our consultancy services. We do not sell your data to third parties.</p>
          <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
          <p>For privacy questions, contact us on {site.phone}{site.email ? ` or email ${site.email}` : ""}.</p>
        </div>
      </div>
    </section>
  );
}
