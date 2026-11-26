// Countries with a flag file in public/images/flags/. Add the code here with the file.
const AVAILABLE = ["es", "fi", "it", "mt", "nl", "ro", "se"];

// Real flag image. Windows browsers don't render flag emoji (they show "SE", "ES"...).
export default function Flag({ code, name, className = "h-5 w-7" }: { code: string; name: string; className?: string }) {
  // Countries added from the admin side may not have a file yet: show the code instead
  if (!AVAILABLE.includes(code)) {
    return (
      <span
        role="img"
        aria-label={`${name} flag`}
        className={`inline-flex items-center justify-center rounded-[3px] bg-slate-200 text-[10px] font-bold uppercase leading-none text-slate-700 ${className}`}
      >
        {code}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/flags/${code}.svg`}
      alt={`${name} flag`}
      className={`inline-block rounded-[3px] object-cover shadow ring-1 ring-black/10 ${className}`}
    />
  );
}
