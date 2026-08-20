# HelpDesk Lite

Internal IT ticketing workspace matching the [Figma Make prototype](https://copper-egg-87821545.figma.site/) and the HelpDesk Lite V1 design spec (emerald / gold, SSO-first, role-aware queues).

Lovable only exported a partial shadcn kit. This app is the working product: authentication, tickets, lifecycle, and manager analytics, with local demo data.

## Run

```bash
cd helpdesk-lite
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Demo sign-in

- **SSO / Enterprise** signs you in as **Marcus Webb (Manager)**, same as the Figma demo.
- **Demo / Dev** lets you pick Submitter (Elena), Agent (Priya), Triage (Jordan), or Manager (Marcus).

Tickets persist in `localStorage` in this browser.

## V1 scope

- Corporate SSO (demo) — no public registration
- Roles: Submitter, Agent, Triage Lead, Manager
- Lifecycle: Open → In Triage → In Progress → Resolved → Closed
- In Progress requires an assignee
- Closed tickets are read-only
- Light / dark theme
- Out of scope: SLA timers, AI routing, Slack/Jira/Zendesk, knowledge base
