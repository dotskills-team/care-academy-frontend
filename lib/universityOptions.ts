// Same lists as the API (server: modules/university/university.constants.ts).
// Safe to import from client components.
export const UNIVERSITY_TYPES = ["Partner", "Non-partner", "Research Listing"] as const;
export type UniversityType = (typeof UNIVERSITY_TYPES)[number];

export const STUDY_LEVELS = ["Foundation", "Diploma", "Undergraduate", "Postgraduate", "PhD / Research"];

export const INTAKE_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Names of the filters in the /universities URL
export const FILTER_KEYS = ["q", "country", "level", "subject", "intake", "type", "ielts", "maxFee"] as const;
export type UniversityFilterValues = Partial<Record<(typeof FILTER_KEYS)[number], string>>;

export const universityBadge: Record<UniversityType, string> = {
  Partner: "bg-green-100 text-green-800",
  "Non-partner": "bg-slate-100 text-slate-700",
  "Research Listing": "bg-accent-100 text-accent-700",
};

export const formatFee = (fee: number | null) =>
  fee === null ? "" : `From €${fee.toLocaleString("en-US")} / year`;
