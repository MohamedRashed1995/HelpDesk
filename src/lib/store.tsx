import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SEED_TICKETS, USERS, userById } from "./seed";
import type { Role, Ticket, TicketStatus, User } from "./types";
import { NEXT_STATUS } from "./types";

const STORAGE_KEY = "helpdesk-lite-state-v1";

type Toast = { id: string; text: string } | null;

type AppState = {
  user: User | null;
  tickets: Ticket[];
  theme: "dark" | "light";
  toast: Toast;
};

type AppContextValue = AppState & {
  users: User[];
  login: (userId: string) => void;
  logout: () => void;
  setTheme: (theme: "dark" | "light") => void;
  createTicket: (input: {
    subject: string;
    category: string;
    description: string;
  }) => Ticket;
  addNote: (ticketId: string, message: string) => void;
  assignTicket: (ticketId: string, assigneeId: string) => string | null;
  advanceStatus: (ticketId: string) => string | null;
  closeTicket: (ticketId: string) => string | null;
};

const AppContext = createContext<AppContextValue | null>(null);

function nowIso() {
  return new Date().toISOString();
}

function loadState(): Pick<AppState, "user" | "tickets" | "theme"> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, tickets: SEED_TICKETS, theme: "dark" };
    const parsed = JSON.parse(raw) as {
      userId?: string | null;
      tickets?: Ticket[];
      theme?: "dark" | "light";
    };
    const user = parsed.userId ? (userById(parsed.userId) ?? null) : null;
    return {
      user,
      tickets: parsed.tickets?.length ? parsed.tickets : SEED_TICKETS,
      theme: parsed.theme === "light" ? "light" : "dark",
    };
  } catch {
    return { user: null, tickets: SEED_TICKETS, theme: "dark" };
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = loadState();
  const [user, setUser] = useState<User | null>(initial.user);
  const [tickets, setTickets] = useState<Ticket[]>(initial.tickets);
  const [theme, setThemeState] = useState<"dark" | "light">(initial.theme);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ userId: user?.id ?? null, tickets, theme }),
    );
  }, [user, tickets, theme]);

  const showToast = useCallback((text: string) => {
    const id = crypto.randomUUID();
    setToast({ id, text });
    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2800);
  }, []);

  const login = useCallback(
    (userId: string) => {
      const next = userById(userId);
      if (next) {
        setUser(next);
        showToast(`Signed in as ${next.name}`);
      }
    },
    [showToast],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const setTheme = useCallback((next: "dark" | "light") => {
    setThemeState(next);
  }, []);

  const createTicket = useCallback(
    (input: { subject: string; category: string; description: string }) => {
      if (!user) throw new Error("Not authenticated");
      const maxId = tickets.reduce((max, ticket) => {
        const n = Number(ticket.id.replace("HD-", ""));
        return Number.isFinite(n) ? Math.max(max, n) : max;
      }, 2400);
      const id = `HD-${maxId + 1}`;
      const created: Ticket = {
        id,
        subject: input.subject,
        category: input.category,
        description: input.description,
        status: "Open",
        submitterId: user.id,
        assigneeId: null,
        assignedById: null,
        assignedAt: null,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        activity: [
          {
            id: crypto.randomUUID(),
            at: nowIso(),
            userId: user.id,
            kind: "status",
            message: "Ticket opened",
            to: "Open",
          },
        ],
      };
      setTickets((list) => [created, ...list]);
      showToast("Ticket created successfully");
      return created;
    },
    [tickets, user, showToast],
  );

  const mutateTicket = useCallback(
    (ticketId: string, updater: (ticket: Ticket) => Ticket | string) => {
      let error: string | null = null;
      setTickets((list) =>
        list.map((ticket) => {
          if (ticket.id !== ticketId) return ticket;
          const result = updater(ticket);
          if (typeof result === "string") {
            error = result;
            return ticket;
          }
          return result;
        }),
      );
      return error;
    },
    [],
  );

  const addNote = useCallback(
    (ticketId: string, message: string) => {
      if (!user) return;
      mutateTicket(ticketId, (ticket) => {
        if (ticket.status === "Closed") return "Closed tickets are read-only.";
        return {
          ...ticket,
          updatedAt: nowIso(),
          activity: [
            {
              id: crypto.randomUUID(),
              at: nowIso(),
              userId: user.id,
              kind: "note",
              message,
            },
            ...ticket.activity,
          ],
        };
      });
      showToast("Note added");
    },
    [mutateTicket, showToast, user],
  );

  const assignTicket = useCallback(
    (ticketId: string, assigneeId: string) => {
      if (!user) return "Not authenticated";
      const err = mutateTicket(ticketId, (ticket) => {
        if (ticket.status === "Closed") return "Closed tickets are read-only.";
        return {
          ...ticket,
          assigneeId,
          assignedById: user.id,
          assignedAt: nowIso(),
          updatedAt: nowIso(),
          activity: [
            {
              id: crypto.randomUUID(),
              at: nowIso(),
              userId: user.id,
              kind: "assignment",
              message: `Assigned to ${userById(assigneeId)?.name ?? assigneeId}`,
              from: ticket.assigneeId ?? undefined,
              to: assigneeId,
            },
            ...ticket.activity,
          ],
        };
      });
      if (!err) showToast("Ticket assigned successfully");
      return err;
    },
    [mutateTicket, showToast, user],
  );

  const advanceStatus = useCallback(
    (ticketId: string) => {
      if (!user) return "Not authenticated";
      const err = mutateTicket(ticketId, (ticket) => {
        if (ticket.status === "Closed") return "Closed tickets are read-only.";
        const next = NEXT_STATUS[ticket.status];
        if (!next) return "No further status change is allowed.";
        if (next === "In Progress" && !ticket.assigneeId) {
          return "A ticket cannot move to In Progress without an assignee.";
        }
        const allowed: Record<Role, TicketStatus[]> = {
          submitter: ["Closed"],
          agent: ["In Progress", "Resolved"],
          triage: ["In Triage", "In Progress"],
          manager: ["In Triage", "In Progress", "Resolved", "Closed"],
        };
        if (!allowed[user.role].includes(next)) {
          return "Your role cannot perform this status change.";
        }
        return {
          ...ticket,
          status: next,
          updatedAt: nowIso(),
          activity: [
            {
              id: crypto.randomUUID(),
              at: nowIso(),
              userId: user.id,
              kind: "status",
              message: `Status updated to ${next}`,
              from: ticket.status,
              to: next,
            },
            ...ticket.activity,
          ],
        };
      });
      if (!err) showToast("Ticket status updated");
      return err;
    },
    [mutateTicket, showToast, user],
  );

  const closeTicket = useCallback(
    (ticketId: string) => {
      if (!user) return "Not authenticated";
      const err = mutateTicket(ticketId, (ticket) => {
        if (ticket.status !== "Resolved") {
          return "Only resolved tickets can be closed.";
        }
        return {
          ...ticket,
          status: "Closed",
          updatedAt: nowIso(),
          activity: [
            {
              id: crypto.randomUUID(),
              at: nowIso(),
              userId: user.id,
              kind: "status",
              message: "Closed",
              from: "Resolved",
              to: "Closed",
            },
            ...ticket.activity,
          ],
        };
      });
      if (!err) showToast("Ticket closed");
      return err;
    },
    [mutateTicket, showToast, user],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      tickets,
      theme,
      toast,
      users: USERS,
      login,
      logout,
      setTheme,
      createTicket,
      addNote,
      assignTicket,
      advanceStatus,
      closeTicket,
    }),
    [
      user,
      tickets,
      theme,
      toast,
      login,
      logout,
      setTheme,
      createTicket,
      addNote,
      assignTicket,
      advanceStatus,
      closeTicket,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
