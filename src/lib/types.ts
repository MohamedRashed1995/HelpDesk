export type Role = "submitter" | "agent" | "triage" | "manager";

export type TicketStatus =
  | "Open"
  | "In Triage"
  | "In Progress"
  | "Resolved"
  | "Closed";

export type ActivityKind = "note" | "status" | "assignment";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  emailVerified?: boolean;
  authProvider?: "firebase" | "demo";
};

export type Activity = {
  id: string;
  at: string;
  userId: string;
  kind: ActivityKind;
  message: string;
  from?: string;
  to?: string;
};

export type Ticket = {
  id: string;
  subject: string;
  category: string;
  description: string;
  status: TicketStatus;
  submitterId: string;
  assigneeId: string | null;
  assignedById: string | null;
  assignedAt: string | null;
  createdAt: string;
  updatedAt: string;
  activity: Activity[];
};

export const CATEGORIES = [
  "Access & Accounts",
  "Hardware",
  "Network",
  "Software",
  "Email",
  "Other",
] as const;

export const LIFECYCLE: TicketStatus[] = [
  "Open",
  "In Triage",
  "In Progress",
  "Resolved",
  "Closed",
];

export const NEXT_STATUS: Record<TicketStatus, TicketStatus | null> = {
  Open: "In Triage",
  "In Triage": "In Progress",
  "In Progress": "Resolved",
  Resolved: "Closed",
  Closed: null,
};
