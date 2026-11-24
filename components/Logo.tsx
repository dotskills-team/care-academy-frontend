// CARE Consultancy logo: graduation cap + "C" + open book, with wordmark.
// Navy #12306a, gold #E5A912. Replace with the final designed asset when ready.
export default function Logo({ className = "h-11 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 370 72" overflow="visible" className={className} role="img" aria-label="CARE Consultancy for Academic Research & Education">
      {/* graduation cap */}
      <polygon points="6,16 30,7 54,16 30,25" fill="#12306a" />
      <path d="M17 21v8c0 3 6 6 13 6s13-3 13-6v-8l-13 5z" fill="#12306a" />
      <line x1="52" y1="17" x2="52" y2="31" stroke="#E5A912" strokeWidth="2" />
      <rect x="50" y="30" width="4" height="7" rx="1" fill="#E5A912" />
      {/* C */}
      <path d="M50 44a19 19 0 1 0 0 22" fill="none" stroke="#12306a" strokeWidth="7" strokeLinecap="round" transform="translate(-6 -2)" />
      {/* open book */}
      <path d="M22 52c6-4 12-4 16 0 4-4 10-4 16 0-6-1-12 0-16 3-4-3-10-4-16-3z" fill="#E5A912" />
      <path d="M22 59c6-3 12-3 16 1 4-4 10-4 16-1" fill="none" stroke="#87CEEB" strokeWidth="2" />
      <line x1="72" y1="10" x2="72" y2="64" stroke="#12306a" strokeWidth="1.5" />
      <text x="82" y="40" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="25" fill="#12306a">CARE-Consultancy</text>
      <text x="83" y="58" fontFamily="Inter, system-ui, sans-serif" fontSize="12" fill="#12306a">for Academic Research &amp; Education</text>
    </svg>
  );
}
