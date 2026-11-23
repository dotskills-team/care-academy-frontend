import type { DashboardOverview, DashboardStat, Tone } from "./types";
// FAKE DATA for the dashboard overview.
// Keep the shape of getDashboardOverview() stable: when the API exists, replace the
// body with a fetch (e.g. GET /api/v1/dashboard/overview?range=7d) and nothing else changes.

const stat = (
  key: string,
  label: string,
  value: number,
  change: number,
  icon: string,
  tone: Tone,
): DashboardStat => ({ key, label, value, change, icon, tone });

export async function getDashboardOverview(/* { range = "7d" } = {} */): Promise<DashboardOverview> {
  return {
    lastUpdated: "Jan 22, 2025, 10:24 AM",
    stats: [
      stat("total", "Total Inquiries", 1248, 12.4, "Users", "violet"),
      stat("new", "New Inquiries", 342, 18.6, "UserPlus", "sky"),
      stat("contacted", "Contacted Inquiries", 628, 10.8, "Phone", "amber"),
      stat("closed", "Closed Inquiries", 278, 6.5, "CircleCheck", "emerald"),
      stat("universities", "Published Universities", 385, 4.3, "Landmark", "violet"),
      stat("countries", "Active Countries", 28, 0, "Globe", "sky"),
      stat("programs", "Published Programs", 1462, 7.9, "Layers", "rose"),
      stat("articles", "Published Articles", 124, 9.7, "FileText", "indigo"),
    ],
    trend: [
      { label: "Jan 16", value: 105 },
      { label: "Jan 17", value: 138 },
      { label: "Jan 18", value: 124 },
      { label: "Jan 19", value: 153 },
      { label: "Jan 20", value: 127 },
      { label: "Jan 21", value: 195 },
      { label: "Jan 22", value: 218 },
    ],
    statusBreakdown: {
      total: 1248,
      items: [
        { label: "New", value: 342, color: "#8b5cf6" },
        { label: "Contacted", value: 628, color: "#60a5fa" },
        { label: "Closed", value: 278, color: "#fbbf24" },
      ],
    },
    quickActions: [
      { label: "Add University", icon: "Landmark", href: "/admin/universities" },
      { label: "Add Country", icon: "Globe", href: "/admin/countries" },
      { label: "Add Program", icon: "Layers", href: "/admin/programs" },
      { label: "Manage Inquiries", icon: "Users", href: "/admin/inquiries" },
      { label: "Upload Media", icon: "ImagePlus", href: "/admin/media" },
      { label: "Create Article", icon: "FilePlus", href: "/admin/articles" },
    ],
    recentInquiries: [
      { id: "1", name: "Sara Mahmud", destination: "Canada", program: "MBA (Business Analytics)", counsellor: "Nusrat Jahan", status: "New", date: "Jan 22, 2025" },
      { id: "2", name: "Rafi Hossain", destination: "UK", program: "BSc in Computer Science", counsellor: "Tanvir Ali", status: "Contacted", date: "Jan 21, 2025" },
      { id: "3", name: "Nilima Akter", destination: "Australia", program: "Master of Data Science", counsellor: "Nusrat Jahan", status: "Contacted", date: "Jan 21, 2025" },
      { id: "4", name: "Fahim Islam", destination: "Canada", program: "BBA (Honours)", counsellor: "Arifur Rahman", status: "Closed", date: "Jan 20, 2025" },
      { id: "5", name: "Tasnim Alam", destination: "Australia", program: "Master of Public Health", counsellor: "Tanvir Ali", status: "New", date: "Jan 20, 2025" },
    ],
    contentUpdates: [
      { text: "University of Toronto updated", time: "Jan 22, 2025, 09:48 AM" },
      { text: "Canada country page updated", time: "Jan 21, 2025, 04:20 PM" },
      { text: "New article published: “Study in the UK in 2025”", time: "Jan 21, 2025, 11:35 AM" },
    ],
    deadlines: [
      { text: "Fall 2025 – Canada", time: "Mar 31, 2025", color: "bg-emerald-500" },
      { text: "Sep 2025 – UK", time: "Apr 30, 2025", color: "bg-amber-400" },
      { text: "Jul 2025 – Australia", time: "May 15, 2025", color: "bg-rose-500" },
    ],
    activity: [
      { text: "User “Nusrat Jahan” updated an inquiry (ID: #IQ-1248)", time: "Jan 22, 2025, 10:12 AM" },
      { text: "New university “Monash University” added", time: "Jan 22, 2025, 09:56 PM" },
      { text: "Article “Top Scholarships for International Students” published", time: "Jan 21, 2025, 03:28 PM" },
    ],
  };
}
