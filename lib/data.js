// =============================================================
// CARE Consultancy — site content.
// Items marked TBC are pending from the client (country details,
// partner universities, testimonials, team). Replace before launch.
// In production this data should come from the Express API.
// =============================================================

export const site = {
  name: "CARE Consultancy",
  fullName: "CARE – Consultancy for Academic Research & Education",
  tagline:
    "Global Education. Greater Opportunities — university selection, applications, scholarships and visa guidance for Bangladeshi students.",
  domain: "careconsultancybd.com",
  phone: "+8801356908585",
  whatsapp: "8801356908585", // digits only, no + or spaces
  email: "", // TODO: create after careconsultancybd.com is activated
  address: "El Dorado (MIA Tower), 59 West Agargaon, Sher-E-Bangla Nagar, Dhaka, Bangladesh",
  mapEmbed:
    "https://www.google.com/maps?q=59+West+Agargaon+Sher-E-Bangla+Nagar+Dhaka&output=embed",
  // Empty string = not created yet; the footer hides it.
  socials: {
    facebook: "", // TODO: paste the CARE Facebook page URL
    instagram: "",
    linkedin: "",
    youtube: "",
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

export const stats = [
  { value: "7", label: "European destinations" },
  { value: "1-to-1", label: "Personal counselling" },
  { value: "End-to-end", label: "Application to arrival" },
  { value: "Dhaka", label: "Based in Bangladesh" },
];

const TBC = "To be confirmed";
const mk = (slug, country, code, intro) => ({
  slug, country, code, intro,
  image: `/images/destinations/${slug}.jpg`,
  tuition: TBC, visa: TBC, workRules: TBC, intakes: [TBC],
});

export const destinations = [
  mk("sweden", "Sweden", "se", "Innovation-led universities, a strong research culture and an English-friendly study environment in Scandinavia."),
  mk("spain", "Spain", "es", "Respected universities and business schools, a vibrant lifestyle and a growing range of English-taught programmes."),
  mk("malta", "Malta", "mt", "An English-speaking Mediterranean island with a compact, welcoming student community and EU access."),
  mk("finland", "Finland", "fi", "A top-ranked education system, research-driven teaching and a safe, high-quality living environment."),
  mk("netherlands", "Netherlands", "nl", "A pioneer in English-taught degrees with internationally recognised universities and a global outlook."),
  mk("italy", "Italy", "it", "Historic universities, strong design, engineering and arts programmes, and scholarships for international students."),
  mk("romania", "Romania", "ro", "Affordable, EU-recognised education with strong programmes in medicine, engineering and IT."),
];

export const programs = [
  { level: "Foundation", subjects: ["Science", "Business", "Arts"], note: "Bridge to undergraduate study" },
  { level: "Undergraduate", subjects: ["Engineering", "Business", "Computer Science", "Health"], note: "Bachelor's degrees" },
  { level: "Postgraduate", subjects: ["MBA", "Data Science", "Public Health", "Law"], note: "Master's degrees" },
  { level: "PhD / Research", subjects: ["Engineering", "Sciences", "Social Sciences"], note: "Research opportunities" },
];

export const subjectCategories = [
  { name: "Business & Management", icon: "💼", count: 0 },
  { name: "Engineering & Technology", icon: "⚙️", count: 0 },
  { name: "Computer Science & IT", icon: "💻", count: 0 },
  { name: "Health & Medicine", icon: "🩺", count: 0 },
  { name: "Arts & Humanities", icon: "🎨", count: 0 },
  { name: "Law", icon: "⚖️", count: 0 },
  { name: "Natural Sciences", icon: "🔬", count: 0 },
  { name: "Social Sciences", icon: "🌍", count: 0 },
];

export const services = [
  { title: "Universities & Course Selection", desc: "Shortlist the right universities and programmes for your profile, budget and goals.", icon: "🎓", by: "CARE" },
  { title: "Application & Admission", desc: "End-to-end application handling and admission follow-up.", icon: "📝", by: "CARE" },
  { title: "Documentation", desc: "Preparation and checking of your academic and supporting documents.", icon: "📄", by: "CARE" },
  { title: "Scholarship Opportunities", desc: "Find and apply for scholarships you qualify for.", icon: "💰", by: "CARE" },
  { title: "Visa & Air Ticket", desc: "Visa file preparation, guidance and travel booking support.", icon: "🛂", by: "CARE" },
  { title: "Post-Arrival Support", desc: "Help settling in after you reach your destination.", icon: "✈️", by: "CARE" },
  { title: "Career & PR Pathways", desc: "Guidance on work and residency options after your studies.", icon: "🧭", by: "CARE" },
];

// Pending from client. Pages render an empty-state when these are [].
export const scholarships = [];
export const universities = [];
export const testimonials = [];
export const intakes = [];
export const resources = [];

export const faqs = [
  { q: "Which countries can you help me apply to?", a: "We are launching with Sweden, Spain, Malta, Finland, the Netherlands, Italy and Romania. Visit the Destinations page for details." },
  { q: "What services does CARE Consultancy provide?", a: "University and course selection, application, admission, documentation, visa and air ticket support, post-arrival support, scholarship opportunities and career & PR pathway guidance." },
  { q: "Do I need IELTS to apply?", a: "Requirements vary by university and country. Some accept alternatives or offer waivers; we advise based on your chosen programme." },
  { q: "Can you help with scholarships?", a: "Yes. We help you identify and apply for scholarships you may qualify for." },
  { q: "How do I get started?", a: "Fill in the inquiry form, call or WhatsApp us, and a counsellor will contact you with the next steps." },
];
