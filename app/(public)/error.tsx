"use client";

export default function PublicError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section">
      <div className="container text-center">
        <h1 className="text-2xl font-bold text-slate-900">We couldn&apos;t load this page</h1>
        <p className="mt-3 text-slate-600">This information is temporarily unavailable. Please try again.</p>
        <button type="button" onClick={() => reset()} className="btn-primary mt-6">
          Try again
        </button>
      </div>
    </section>
  );
}
