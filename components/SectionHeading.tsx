export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? "mx-auto max-w-2xl text-center" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-[2.5rem] md:leading-tight">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">{subtitle}</p>}
    </div>
  );
}
