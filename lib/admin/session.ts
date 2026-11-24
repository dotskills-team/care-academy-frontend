import type { Notification } from "./types";

// FAKE notifications for the topbar bell.
// TODO(api): replace with a notifications endpoint. The signed-in user comes from useCurrentUser().

export const notifications: Notification[] = [
  { id: "n1", text: "New inquiry from Sara Mahmud (Canada)", time: "10 min ago", href: "/admin/inquiries", read: false },
  { id: "n2", text: "Inquiry #IQ-1248 assigned to Nusrat Jahan", time: "1 hour ago", href: "/admin/inquiries", read: false },
  { id: "n3", text: "Monash University was published", time: "Yesterday", href: "/admin/universities", read: true },
];
