import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { AppProvider, useApp } from "./lib/store";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { AuthPage } from "./pages/AuthPage";
import { CreateTicketPage } from "./pages/CreateTicketPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MyTicketsPage } from "./pages/MyTicketsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { QueuePage } from "./pages/QueuePage";
import { TicketDetailsPage } from "./pages/TicketDetailsPage";

function Protected() {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return <AppShell />;
}

function RoleGate({ allow }: { allow: string[] }) {
  const { user } = useApp();
  if (!user || !allow.includes(user.role)) {
    return (
      <div>
        <h1 className="text-4xl">Unauthorized</h1>
        <p className="mt-3" style={{ color: "var(--muted)" }}>
          This area is hidden from your role. Return to the dashboard for the workspace you can use.
        </p>
      </div>
    );
  }
  return <Outlet />;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route element={<Protected />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tickets" element={<MyTicketsPage />} />
            <Route path="/tickets/new" element={<CreateTicketPage />} />
            <Route path="/tickets/:id" element={<TicketDetailsPage />} />
            <Route element={<RoleGate allow={["agent", "triage", "manager"]} />}>
              <Route path="/queue" element={<QueuePage />} />
            </Route>
            <Route element={<RoleGate allow={["manager"]} />}>
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="*"
              element={
                <div>
                  <h1 className="text-4xl">Page not found</h1>
                  <p className="mt-3" style={{ color: "var(--muted)" }}>
                    That route is not part of HelpDesk Lite V1.
                  </p>
                </div>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
