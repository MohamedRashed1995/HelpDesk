export type Role = "submitter" | "agent" | "triage" | "manager";

export type TicketStatus =
  | "Open"
  | "In Triage"
  | "In Progress"
  | "Resolved"
  | "Closed";

export type ActivityKind = "note" | "status" | "assignment";

<<<<<<< HEAD
export type AuditAction =
  | "ticket.created"
  | "ticket.assigned"
  | "ticket.status"
  | "ticket.priority"
  | "ticket.resolved"
  | "ticket.closed"
  | "ticket.note";

export type TicketPriority = "Low" | "Normal" | "High" | "Urgent";

=======
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  emailVerified?: boolean;
  authProvider?: "firebase" | "demo";
<<<<<<< HEAD
  avatarUrl?: string | null;
};

/** Shape of a `users/{uid}` document in Firestore. */
export type UserProfileDoc = {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  emailVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Shape of an `auditLogs/{logId}` document in Firestore. */
export type AuditLog = {
  id: string;
  ticketId: string;
  actorId: string;
  action: AuditAction;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
=======
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
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
<<<<<<< HEAD
  priority: TicketPriority;
=======
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
  submitterId: string;
  assigneeId: string | null;
  assignedById: string | null;
  assignedAt: string | null;
  createdAt: string;
  updatedAt: string;
<<<<<<< HEAD
  resolvedAt: string | null;
  closedAt: string | null;
=======
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
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

<<<<<<< HEAD
export const PRIORITIES: TicketPriority[] = ["Low", "Normal", "High", "Urgent"];

=======
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
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
