import { site } from "@/lib/data";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: [date]</p>

        <div className="prose mt-8 space-y-4 text-slate-600">
          <p>
            This is placeholder terms text for {site.name}. Replace it with your
            reviewed legal content before launch.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Use of Our Services</h2>
          <p>Our consultancy provides guidance and support for studying abroad. By using our services you agree to provide accurate information.</p>
          <h2 className="text-xl font-semibold text-slate-900">No Guarantee</h2>
          <p>Admission and visa outcomes are decided solely by the respective universities and immigration authorities. {site.name} does not guarantee any specific outcome.</p>
          <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
          <p>For any questions about these terms, email {site.email}.</p>
        </div>
      </div>
    </section>
  );
}
