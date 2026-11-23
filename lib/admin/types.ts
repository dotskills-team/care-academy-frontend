// Shapes of the admin dashboard payload. When the API exists, these should mirror the
// response of GET /api/v1/dashboard/overview (or be generated from it).

export type Tone = "violet" | "sky" | "amber" | "emerald" | "rose" | "indigo";

export type InquiryStatus = "New" | "Contacted" | "Closed";

export interface DashboardStat {
  key: string;
  label: string;
  value: number;
  /** Percent change vs. the previous period; 0 renders as flat. */
  change: number;
  /** lucide-react icon name, resolved by components/Icon. */
  icon: string;
  tone: Tone;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface StatusSlice {
  label: string;
  value: number;
  color: string;
}

export interface QuickAction {
  label: string;
  icon: string;
  href: string;
}

export interface RecentInquiry {
  id: string;
  name: string;
  destination: string;
  program: string;
  counsellor: string;
  status: InquiryStatus;
  date: string;
}

/** A line in the dashboard side lists. `color` is a Tailwind bg-* class for the dot. */
export interface TimedItem {
  text: string;
  time: string;
  color?: string;
}

export interface DashboardOverview {
  lastUpdated: string;
  stats: DashboardStat[];
  trend: TrendPoint[];
  statusBreakdown: { total: number; items: StatusSlice[] };
  quickActions: QuickAction[];
  recentInquiries: RecentInquiry[];
  contentUpdates: TimedItem[];
  deadlines: TimedItem[];
  activity: TimedItem[];
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface NavGroup {
  heading: string;
  items: (NavItem & { icon: string })[];
}

export interface Notification {
  id: string;
  text: string;
  time: string;
  href: string;
  read: boolean;
}
