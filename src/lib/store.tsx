import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
<<<<<<< HEAD
import { useAuth } from "./auth";
import { checkAssignment, checkClose, checkNote, checkStatusChange } from "./permissions";
import { SEED_TICKETS, USERS } from "./seed";
import * as repository from "./ticketsRepository";
import type { Ticket, TicketStatus, User } from "./types";
=======
import { SEED_TICKETS, USERS, userById } from "./seed";
import type { Role, Ticket, TicketStatus, User } from "./types";
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
import { NEXT_STATUS } from "./types";

const STORAGE_KEY = "helpdesk-lite-state-v1";

type Toast = { id: string; text: string } | null;

<<<<<<< HEAD
type AppContextValue = {
  user: User | null;
  users: User[];
  tickets: Ticket[];
  theme: "dark" | "light";
  toast: Toast;
  ticketsError: string;
=======
type AppState = {
  user: User | null;
  tickets: Ticket[];
  theme: "dark" | "light";
  toast: Toast;
};

type AppContextValue = AppState & {
  users: User[];
  login: (userId: string) => void;
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
  logout: () => void;
  setTheme: (theme: "dark" | "light") => void;
  createTicket: (input: {
    subject: string;
    category: string;
    description: string;
<<<<<<< HEAD
    priority?: Ticket["priority"];
  }) => Promise<Ticket>;
  addNote: (ticketId: string, message: string) => Promise<string | null>;
  assignTicket: (ticketId: string, assigneeId: string) => Promise<string | null>;
  advanceStatus: (ticketId: string) => Promise<string | null>;
  closeTicket: (ticketId: string) => Promise<string | null>;
=======
  }) => Ticket;
  addNote: (ticketId: string, message: string) => void;
  assignTicket: (ticketId: string, assigneeId: string) => string | null;
  advanceStatus: (ticketId: string) => string | null;
  closeTicket: (ticketId: string) => string | null;
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
};

const AppContext = createContext<AppContextValue | null>(null);

function nowIso() {
  return new Date().toISOString();
}

<<<<<<< HEAD
function loadLocalState(): { tickets: Ticket[]; theme: "dark" | "light" } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tickets: SEED_TICKETS, theme: "dark" };
    const parsed = JSON.parse(raw) as { tickets?: Ticket[]; theme?: "dark" | "light" };
    return {
=======
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
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
      tickets: parsed.tickets?.length ? parsed.tickets : SEED_TICKETS,
      theme: parsed.theme === "light" ? "light" : "dark",
    };
  } catch {
<<<<<<< HEAD
    return { tickets: SEED_TICKETS, theme: "dark" };
=======
    return { user: null, tickets: SEED_TICKETS, theme: "dark" };
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
<<<<<<< HEAD
  const { user, mode, signOutUser } = useAuth();
  const initial = loadLocalState();
  const [tickets, setTickets] = useState<Ticket[]>(mode === "demo" ? initial.tickets : []);
  const [remoteUsers, setRemoteUsers] = useState<User[]>([]);
  const [theme, setThemeState] = useState<"dark" | "light">(initial.theme);
  const [toast, setToast] = useState<Toast>(null);
  const [ticketsError, setTicketsError] = useState("");
=======
  const initial = loadState();
  const [user, setUser] = useState<User | null>(initial.user);
  const [tickets, setTickets] = useState<Ticket[]>(initial.tickets);
  const [theme, setThemeState] = useState<"dark" | "light">(initial.theme);
  const [toast, setToast] = useState<Toast>(null);
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
<<<<<<< HEAD
    if (mode !== "demo") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme }));
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tickets, theme }));
  }, [mode, tickets, theme]);

  useEffect(() => {
    if (mode !== "firebase" || !user) {
      if (mode === "firebase") setTickets([]);
      return;
    }
    setTicketsError("");
    const unsubscribeTickets = repository.subscribeToTickets(user, setTickets, (error) =>
      setTicketsError(error.message),
    );
    const unsubscribeUsers = repository.subscribeToUsers(setRemoteUsers, () => setRemoteUsers([]));
    return () => {
      unsubscribeTickets();
      unsubscribeUsers();
    };
  }, [mode, user]);

  const users = mode === "demo" ? USERS : remoteUsers;
=======
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ userId: user?.id ?? null, tickets, theme }),
    );
  }, [user, tickets, theme]);
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27

  const showToast = useCallback((text: string) => {
    const id = crypto.randomUUID();
    setToast({ id, text });
    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2800);
  }, []);

<<<<<<< HEAD
  const logout = useCallback(() => {
    void signOutUser();
  }, [signOutUser]);
=======
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
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27

  const setTheme = useCallback((next: "dark" | "light") => {
    setThemeState(next);
  }, []);

<<<<<<< HEAD
  const patchLocal = useCallback((ticketId: string, patch: (ticket: Ticket) => Ticket) => {
    setTickets((list) => list.map((ticket) => (ticket.id === ticketId ? patch(ticket) : ticket)));
  }, []);

  const createTicket = useCallback<AppContextValue["createTicket"]>(
    async (input) => {
      if (!user) throw new Error("Not authenticated");
      if (mode === "firebase") {
        const created = await repository.createTicket(user, input);
        showToast("Ticket created successfully");
        return created;
      }

=======
  const createTicket = useCallback(
    (input: { subject: string; category: string; description: string }) => {
      if (!user) throw new Error("Not authenticated");
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
      const maxId = tickets.reduce((max, ticket) => {
        const n = Number(ticket.id.replace("HD-", ""));
        return Number.isFinite(n) ? Math.max(max, n) : max;
      }, 2400);
<<<<<<< HEAD
      const created: Ticket = {
        id: `HD-${maxId + 1}`,
=======
      const id = `HD-${maxId + 1}`;
      const created: Ticket = {
        id,
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
        subject: input.subject,
        category: input.category,
        description: input.description,
        status: "Open",
<<<<<<< HEAD
        priority: input.priority ?? "Normal",
=======
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
        submitterId: user.id,
        assigneeId: null,
        assignedById: null,
        assignedAt: null,
        createdAt: nowIso(),
        updatedAt: nowIso(),
<<<<<<< HEAD
        resolvedAt: null,
        closedAt: null,
=======
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
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
<<<<<<< HEAD
    [mode, showToast, tickets, user],
  );

  const addNote = useCallback<AppContextValue["addNote"]>(
    async (ticketId, message) => {
      const ticket = tickets.find((item) => item.id === ticketId);
      if (!user || !ticket) return "Ticket not found.";
      const blocked = checkNote(user, ticket);
      if (blocked) return blocked;

      if (mode === "firebase") {
        await repository.addNote(user, ticket, message);
      } else {
        patchLocal(ticketId, (current) => ({
          ...current,
          updatedAt: nowIso(),
          activity: [
            { id: crypto.randomUUID(), at: nowIso(), userId: user.id, kind: "note", message },
            ...current.activity,
          ],
        }));
      }
      showToast("Note added");
      return null;
    },
    [mode, patchLocal, showToast, tickets, user],
  );

  const assignTicket = useCallback<AppContextValue["assignTicket"]>(
    async (ticketId, assigneeId) => {
      const ticket = tickets.find((item) => item.id === ticketId);
      if (!user || !ticket) return "Ticket not found.";
      const blocked = checkAssignment(user, ticket, assigneeId);
      if (blocked) return blocked;

      const assigneeName = users.find((item) => item.id === assigneeId)?.name ?? assigneeId;
      if (mode === "firebase") {
        await repository.assignTicket(user, ticket, assigneeId, assigneeName);
      } else {
        patchLocal(ticketId, (current) => ({
          ...current,
=======
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
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
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
<<<<<<< HEAD
              message: `Assigned to ${assigneeName}`,
              from: current.assigneeId ?? undefined,
              to: assigneeId,
            },
            ...current.activity,
          ],
        }));
      }
      showToast("Ticket assigned successfully");
      return null;
    },
    [mode, patchLocal, showToast, tickets, user, users],
  );

  const applyStatus = useCallback(
    async (ticket: Ticket, next: TicketStatus, actor: User) => {
      if (mode === "firebase") {
        await repository.changeStatus(actor, ticket, next);
        return;
      }
      const at = nowIso();
      patchLocal(ticket.id, (current) => ({
        ...current,
        status: next,
        updatedAt: at,
        resolvedAt: next === "Resolved" ? at : current.resolvedAt,
        closedAt: next === "Closed" ? at : current.closedAt,
        activity: [
          {
            id: crypto.randomUUID(),
            at,
            userId: actor.id,
            kind: "status",
            message: `Status updated to ${next}`,
            from: current.status,
            to: next,
          },
          ...current.activity,
        ],
      }));
    },
    [mode, patchLocal],
  );

  const advanceStatus = useCallback<AppContextValue["advanceStatus"]>(
    async (ticketId) => {
      const ticket = tickets.find((item) => item.id === ticketId);
      if (!user || !ticket) return "Ticket not found.";
      const next = NEXT_STATUS[ticket.status];
      if (!next) return "No further status change is allowed.";
      const blocked = checkStatusChange(user, ticket, next);
      if (blocked) return blocked;
      await applyStatus(ticket, next, user);
      showToast("Ticket status updated");
      return null;
    },
    [applyStatus, showToast, tickets, user],
  );

  const closeTicket = useCallback<AppContextValue["closeTicket"]>(
    async (ticketId) => {
      const ticket = tickets.find((item) => item.id === ticketId);
      if (!user || !ticket) return "Ticket not found.";
      const blocked = checkClose(user, ticket);
      if (blocked) return blocked;
      await applyStatus(ticket, "Closed", user);
      showToast("Ticket closed");
      return null;
    },
    [applyStatus, showToast, tickets, user],
=======
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
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
  );

  const value = useMemo<AppContextValue>(
    () => ({
      user,
<<<<<<< HEAD
      users,
      tickets,
      theme,
      toast,
      ticketsError,
=======
      tickets,
      theme,
      toast,
      users: USERS,
      login,
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
      logout,
      setTheme,
      createTicket,
      addNote,
      assignTicket,
      advanceStatus,
      closeTicket,
    }),
    [
<<<<<<< HEAD
      addNote,
      advanceStatus,
      assignTicket,
      closeTicket,
      createTicket,
      logout,
      setTheme,
      theme,
      ticketsError,
      tickets,
      toast,
      user,
      users,
=======
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
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
