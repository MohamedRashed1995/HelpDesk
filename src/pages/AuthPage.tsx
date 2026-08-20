import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { USERS } from "../lib/seed";
import { useApp } from "../lib/store";

const ROLES = [
  { title: "Submitter", copy: "Submit and track support tickets" },
  { title: "Agent", copy: "Manage and resolve the queue" },
  { title: "Manager", copy: "Oversee workload and operations" },
];

export function AuthPage() {
  const { user, login } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"sso" | "demo">("sso");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  function finish(userId: string) {
    setLoading(true);
    setError("");
    window.setTimeout(() => {
      login(userId);
      navigate("/");
    }, 900);
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2" style={{ background: "var(--bg)" }}>
      <section
        className="relative hidden overflow-hidden px-12 py-14 lg:flex lg:flex-col"
        style={{ background: "radial-gradient(1200px 600px at -10% 20%, var(--glow), transparent 50%), var(--surface-lowest)" }}
      >
        <div className="flex items-center gap-3">
          <Logo size={42} />
          <span className="text-lg font-semibold tracking-wide">HelpDesk Lite</span>
        </div>
        <div className="my-auto max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--gold)" }}>
            IT support,
          </p>
          <h1 className="mt-3 text-6xl leading-[1.05]">resolved.</h1>
          <p className="mt-6 max-w-md text-lg" style={{ color: "var(--muted)" }}>
            Submit tickets, track progress, and get your team moving again — without the friction.
          </p>
          <div className="mt-12 grid gap-4">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className="rounded-[10px] px-5 py-4"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="text-sm font-semibold">{role.title}</div>
                <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  {role.copy}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Logo />
            <span className="font-semibold">HelpDesk Lite</span>
          </div>
          <h1 className="text-5xl">Sign in</h1>
          <p className="mt-3" style={{ color: "var(--muted)" }}>
            Welcome back to HelpDesk Lite
          </p>

          <div
            className="mt-8 grid grid-cols-2 rounded-[8px] p-1 text-sm"
            style={{ background: "var(--surface-low)" }}
            role="tablist"
          >
            {(["sso", "demo"] as const).map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className="rounded-[6px] py-2 font-semibold"
                style={{
                  background: tab === id ? "var(--surface-high)" : "transparent",
                  color: tab === id ? "var(--gold)" : "var(--muted)",
                }}
                onClick={() => setTab(id)}
              >
                {id === "sso" ? "SSO / Enterprise" : "Demo / Dev"}
              </button>
            ))}
          </div>

          {tab === "sso" ? (
            <div className="mt-8">
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Sign in with your organization account via Single Sign-On.
              </p>
              <div
                className="mt-5 rounded-[8px] px-4 py-3 text-sm"
                style={{ background: "var(--forest)", color: "var(--primary)" }}
              >
                Production environment
                <div className="mt-1 text-[13px]" style={{ color: "var(--muted)" }}>
                  Uses OIDC/SAML authentication. No public registration.
                </div>
              </div>
              {error ? (
                <p className="mt-4 text-sm" style={{ color: "var(--error)" }} role="alert">
                  {error}
                </p>
              ) : null}
              <button
                type="button"
                className="gold-btn mt-6 w-full rounded-[8px] py-3 text-sm font-semibold disabled:opacity-60"
                disabled={loading}
                onClick={() => finish("u-marcus")}
              >
                {loading ? "Connecting to SSO…" : "Continue with SSO →"}
              </button>
              <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
                Demo: SSO will sign you in as Marcus Webb (Manager)
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Choose a workspace persona. This tab is for local demonstration only.
              </p>
              {USERS.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  disabled={loading}
                  onClick={() => finish(persona.id)}
                  className="flex w-full items-center justify-between rounded-[10px] px-4 py-3 text-left"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <span>
                    <span className="block text-sm font-semibold">{persona.name}</span>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {persona.title}
                    </span>
                  </span>
                  <span className="text-xs uppercase tracking-[0.14em]" style={{ color: "var(--gold)" }}>
                    Enter
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
