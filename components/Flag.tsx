// Real flag image. Windows browsers don't render flag emoji (they show "SE", "ES"...).
export default function Flag({ code, name, className = "h-5 w-7" }: { code: string; name: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/flags/${code}.svg`}
      alt={`${name} flag`}
      className={`inline-block rounded-[3px] object-cover shadow ring-1 ring-black/10 ${className}`}
    />
  );
}
