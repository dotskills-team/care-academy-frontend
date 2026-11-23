// =============================================================
// CARE Academy — PLACEHOLDER content.
// Everything here is generic/dummy. Replace with real content
// and images before launch. In production this data comes from
// the Express API (/api/...), not this file.
// =============================================================

export const site = {
  name: "CARE Academy",
  tagline:
    "Your trusted partner for studying abroad — universities, scholarships, visa guidance and admission support.",
  phone: "+880 1XXX-XXXXXX",
  whatsapp: "8801XXXXXXXXX", // digits only, no + or spaces
  email: "info@careacademy.example",
  address: "House 00, Road 00, Dhaka 1200, Bangladesh",
  mapEmbed:
    "https://www.google.com/maps?q=Dhaka&output=embed",
  socials: {
    facebook: "#",
    instagram: "#",
    linkedin: "#",
    youtube: "#",
  },
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Programs", href: "/programs" },
  { label: "Universities", href: "/universities" },
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const img = (seed: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=${w}&q=70`;

export const stats = [
  { value: "5,000+", label: "Students guided" },
  { value: "300+", label: "Partner universities" },
  { value: "15+", label: "Study destinations" },
  { value: "98%", label: "Visa success rate" },
];

export const destinations = [
  {
    slug: "united-kingdom",
    country: "United Kingdom",
    flag: "🇬🇧",
    image: img("1513635269975-59663e0ac1ad"),
    intro:
      "World-class universities, post-study work options and a rich academic heritage make the UK a top choice for international students.",
    universities: 150,
    tuition: "£12,000 – £28,000 / year",
    visa: "Student Route (Tier 4) — CAS required",
    workRules: "20 hrs/week during term, full-time in holidays",
    intakes: ["January", "September"],
  },
  {
    slug: "canada",
    country: "Canada",
    flag: "🇨🇦",
    image: img("1517935706615-2717063c2225"),
    intro:
      "Affordable tuition, a welcoming culture and clear pathways to permanent residency make Canada increasingly popular.",
    universities: 90,
    tuition: "CAD 15,000 – 35,000 / year",
    visa: "Study Permit — proof of funds + LOA",
    workRules: "Up to 24 hrs/week off-campus during term",
    intakes: ["January", "May", "September"],
  },
  {
    slug: "australia",
    country: "Australia",
    flag: "🇦🇺",
    image: img("1506973035872-a4ec16b8e8d9"),
    intro:
      "High living standards, strong research universities and generous post-study work rights across major cities.",
    universities: 43,
    tuition: "AUD 20,000 – 45,000 / year",
    visa: "Subclass 500 Student Visa",
    workRules: "48 hrs/fortnight during term",
    intakes: ["February", "July"],
  },
  {
    slug: "usa",
    country: "United States",
    flag: "🇺🇸",
    image: img("1485738422979-f5c462d49f74"),
    intro:
      "The largest selection of universities in the world, with flexible programs and extensive scholarship options.",
    universities: 200,
    tuition: "USD 20,000 – 55,000 / year",
    visa: "F-1 Student Visa — I-20 required",
    workRules: "On-campus 20 hrs/week; OPT after study",
    intakes: ["Spring", "Fall"],
  },
  {
    slug: "germany",
    country: "Germany",
    flag: "🇩🇪",
    image: img("1467269204594-9661b134dd2b"),
    intro:
      "Low or no tuition at public universities and a strong engineering reputation at the heart of Europe.",
    universities: 60,
    tuition: "€0 – €3,000 / year (public)",
    visa: "National (D) Student Visa",
    workRules: "120 full / 240 half days per year",
    intakes: ["Summer", "Winter"],
  },
  {
    slug: "malaysia",
    country: "Malaysia",
    flag: "🇲🇾",
    image: img("1596422846543-75c6fc197f07"),
    intro:
      "A budget-friendly hub with branch campuses of global universities and a comfortable climate for South Asian students.",
    universities: 30,
    tuition: "USD 4,000 – 12,000 / year",
    visa: "Student Pass via EMGS",
    workRules: "20 hrs/week during holidays only",
    intakes: ["February", "September"],
  },
];

export const programs = [
  { level: "Foundation", subjects: ["Science", "Business", "Arts"], note: "Bridge to undergraduate study" },
  { level: "Undergraduate", subjects: ["Engineering", "Business", "Computer Science", "Health"], note: "Bachelor's degrees, 3–4 years" },
  { level: "Postgraduate", subjects: ["MBA", "Data Science", "Public Health", "Law"], note: "Master's degrees, 1–2 years" },
  { level: "PhD / Research", subjects: ["Engineering", "Sciences", "Social Sciences"], note: "Funded research opportunities" },
];

export const subjectCategories = [
  { name: "Business & Management", icon: "💼", count: 320 },
  { name: "Engineering & Technology", icon: "⚙️", count: 410 },
  { name: "Computer Science & IT", icon: "💻", count: 280 },
  { name: "Health & Medicine", icon: "🩺", count: 190 },
  { name: "Arts & Humanities", icon: "🎨", count: 150 },
  { name: "Law", icon: "⚖️", count: 95 },
  { name: "Natural Sciences", icon: "🔬", count: 210 },
  { name: "Social Sciences", icon: "🌍", count: 175 },
];

export const services = [
  { title: "University Selection", desc: "Shortlist the right universities based on your profile, budget and goals.", icon: "🎓", by: "CARE" },
  { title: "Admission Processing", desc: "End-to-end application handling, documents and follow-ups.", icon: "📝", by: "CARE" },
  { title: "Scholarship Guidance", desc: "Find and apply for scholarships you qualify for.", icon: "💰", by: "CARE" },
  { title: "Visa Assistance", desc: "Complete visa file preparation and interview readiness.", icon: "🛂", by: "CARE" },
  { title: "IELTS / Test Prep", desc: "Coaching and resources for IELTS, PTE and more.", icon: "📚", by: "Partner" },
  { title: "Accommodation & Travel", desc: "Housing search, airport pickup and pre-departure briefing.", icon: "✈️", by: "Partner" },
];

export const scholarships = [
  { name: "Global Merit Scholarship", country: "United Kingdom", amount: "Up to 50% tuition", level: "Postgraduate" },
  { name: "International Excellence Award", country: "Canada", amount: "CAD 10,000", level: "Undergraduate" },
  { name: "Future Leaders Grant", country: "Australia", amount: "Up to 30% tuition", level: "All levels" },
  { name: "STEM Research Fellowship", country: "Germany", amount: "Full funding", level: "PhD" },
];

export const universities = [
  { name: "Northgate University", country: "United Kingdom", city: "Manchester", type: "Partner", subjects: "Business, Engineering", ielts: "6.5", fee: "£14,500", intake: "Jan, Sep", image: img("1562774053-701939374585") },
  { name: "Maple Ridge University", country: "Canada", city: "Toronto", type: "Partner", subjects: "CS, Health", ielts: "6.0", fee: "CAD 22,000", intake: "Jan, May, Sep", image: img("1498243691581-b145c3f54a5a") },
  { name: "Harbour Institute of Tech", country: "Australia", city: "Sydney", type: "Non-partner", subjects: "Engineering, IT", ielts: "6.5", fee: "AUD 32,000", intake: "Feb, Jul", image: "/images/universities/harbour.jpg" },
  { name: "Lakeside State University", country: "United States", city: "Chicago", type: "Research Listing", subjects: "Sciences, MBA", ielts: "6.5", fee: "USD 38,000", intake: "Spring, Fall", image: img("1541339907198-e08756dedf3f") },
  { name: "Rhein Technical University", country: "Germany", city: "Munich", type: "Partner", subjects: "Engineering", ielts: "6.0", fee: "€1,500", intake: "Summer, Winter", image: img("1527576539890-dfa815648363") },
  { name: "Summit University KL", country: "Malaysia", city: "Kuala Lumpur", type: "Partner", subjects: "Business, IT", ielts: "5.5", fee: "USD 8,000", intake: "Feb, Sep", image: img("1564981797816-1043664bf78d") },
];

export const testimonials = [
  { name: "Student Name", course: "MSc Data Science, UK", quote: "CARE Academy made my whole journey stress-free — from university selection to visa. Highly recommended.", image: img("1507003211169-0a1dd7228f2d", 200, 200) },
  { name: "Student Name", course: "Bachelor of Business, Canada", quote: "Their counsellors knew exactly which universities fit my budget and got me a scholarship I didn't know existed.", image: img("1494790108377-be9c29b29330", 200, 200) },
  { name: "Student Name", course: "Master of IT, Australia", quote: "Professional, honest and always available. I got my admission and visa on the first attempt.", image: img("1500648767791-00dcc994a43e", 200, 200) },
];

export const faqs = [
  { q: "How much does it cost to use CARE Academy?", a: "Our core counselling and admission support is free for most partner universities. Any paid service is clearly explained upfront with no hidden fees." },
  { q: "Which countries can you help me apply to?", a: "We currently support the UK, Canada, Australia, USA, Germany, Malaysia and more. Visit the Destinations page for the full list." },
  { q: "Do I need IELTS to apply?", a: "Most universities require IELTS or an equivalent, but some accept MOI or offer waivers. We'll advise based on your chosen university." },
  { q: "How long does the admission process take?", a: "It varies by country and university, typically 2–8 weeks from a complete application. We keep you updated at every step." },
  { q: "Can you help with scholarships?", a: "Yes. We help you identify and apply for scholarships you qualify for — see our Scholarships section." },
];

export const resources = [
  { type: "Guide", title: "Complete Study-in-UK Checklist", desc: "Everything you need from application to departure.", },
  { type: "Guide", title: "IELTS Band Score Guide", desc: "What score you need for each country and university.", },
  { type: "Blog", title: "Top Scholarships for 2026 Intake", desc: "Updated list of funding opportunities worldwide.", },
  { type: "Download", title: "SOP Writing Template (PDF)", desc: "A proven structure for your statement of purpose.", },
];

export const intakes = [
  { month: "January 2026", countries: "UK, Canada, USA", note: "Applications closing soon" },
  { month: "February 2026", countries: "Australia, Malaysia", note: "Open now" },
  { month: "May 2026", countries: "Canada", note: "Open now" },
  { month: "September 2026", countries: "UK, Germany, Malaysia", note: "Early applications advised" },
];
