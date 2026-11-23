// Homepage content (structure mirrors the reference site; brand = CARE Academy).
// Numbers, names and testimonials are PLACEHOLDERS — replace with real data.

export const heroSlides = [
  {
    title: "Seamless entry to your Higher Education",
    text: "We extend global education opportunities to Bangladeshi students at both undergraduate and graduate levels.",
    image: "/images/hero-1.webp",
  },
  {
    title: "Consultation for Your Educational Journey",
    text: "Discover world-class universities and programs tailored to your aspirations, guided by expert advisors.",
    image: "/images/hero-2.webp",
  },
  {
    title: "Promoting Global Opportunities for Futures",
    text: "We partner with top institutions worldwide to help you build a strong foundation for success.",
    image: "/images/hero-3.webp",
  },
];

export const introImage = "/images/consultant.webp";
export const servicesImage = "/images/services.webp";
export const formImage = "/images/form-student.webp";

export const intro = {
  title: "Establishing your pathway to success",
  text: "CARE Academy is an education consultancy based in Dhaka that guides students through every step of the university application process. With partner institutions across Australia, the USA, Canada, the UK and more, we support students at both undergraduate and graduate levels.",
  stats: [
    { value: 15, suffix: "+", label: "Countries", icon: "Globe2" },
    { value: 5000, suffix: "+", label: "Students", icon: "GraduationCap" },
    { value: 10, suffix: "+", label: "Years Experience", icon: "Award" },
  ],
};

const dest = (name: string, slug: string, count: string | number) => ({
  title: `Study in ${name}`,
  count,
  desc: `Explore ${count} and find the program that fits your goals.`,
  image: `/images/destinations/${slug}.jpg`,
});

export const homeDestinations = [
  dest("Australia", "australia", "10+ partner universities"),
  dest("the UK", "uk", "200+ top-ranked universities"),
  dest("the USA", "usa", "200+ partner institutions"),
  dest("Canada", "canada", "10+ universities"),
  dest("New Zealand", "new-zealand", "5+ institutions"),
  dest("Malaysia", "malaysia", "8+ institutions"),
  dest("Singapore", "singapore", "6+ universities"),
  dest("Dubai", "dubai", "7+ institutions"),
  dest("Indonesia", "indonesia", "4+ universities"),
];

export const homeServices = [
  { title: "Interactive Student Consultation", desc: "Personalized consultations to help you secure placement at your ideal institution.", icon: "MessagesSquare" },
  { title: "Visa Application Handling", desc: "Visa application guidance and support after your offer letter is issued.", icon: "FileCheck2" },
  { title: "Post-Approval Counseling Support", desc: "Guidance on arrival, travel and accommodation after your visa is approved.", icon: "PlaneTakeoff" },
  { title: "Promoting Education Opportunities", desc: "We host seminars with foreign institutions in Bangladesh and arrange direct student interviews.", icon: "Megaphone" },
];

// Application process (10 steps)
export const applySteps = [
  { title: "Select a Course", icon: "SearchCheck" },
  { title: "Apply to a University", icon: "School" },
  { title: "Apply for Scholarship", icon: "Award" },
  { title: "Receive the Offer Letter", icon: "Mail" },
  { title: "Pay Tuition Fee & Receive the Fee Receipt", icon: "Receipt" },
  { title: "Receive LOA (Letter of Acceptance)", icon: "FileSignature" },
  { title: "Schedule IME (Immigration Medical Examination)", icon: "Stethoscope" },
  { title: "Prepare for Visa Filing (SDS or Non-SDS)", icon: "ClipboardCheck" },
  { title: "Biometrics Appointment & Interview", icon: "Fingerprint" },
  { title: "Visa Outcome", icon: "BadgeCheck" },
];

export const stories = [
  { name: "Student Name", text: "I received a university offer late in the process and my visa came within about two weeks. The team was incredibly professional." },
  { name: "Student Name", text: "My student visa was granted in one day. The staff helped with financial documents, the visa file and my SOP." },
  { name: "Student Name", text: "I received a 20% scholarship at a top-20 university and my visa arrived days after the medical exam." },
  { name: "Student Name", text: "The best consultancy in Dhaka. The whole process was smooth and fast." },
  { name: "Student Name", text: "I was confused at first, but the team guided me through the whole two-month process." },
];

export const partners = [
  "Partner University 1", "Partner University 2", "Partner University 3",
  "Partner University 4", "Partner University 5", "Partner University 6",
  "Partner University 7", "Partner University 8",
];

export const formOptions = {
  destinations: ["Australia", "Canada", "USA", "UK", "Malaysia", "Singapore", "Dubai", "New Zealand", "Indonesia", "Other"],
  levels: ["Undergraduate", "Graduate", "Diploma", "Certificate", "PhD", "Other"],
};

export const upcomingEvents = [
  "University Admission Assessment & Info. Session",
  "University Admission Assessment & Info. Session",
  "University Information & Admission Session",
];
