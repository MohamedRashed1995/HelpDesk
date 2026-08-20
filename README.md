# HelpDesk Lite

<<<<<<< HEAD
Internal IT ticketing workspace matching the [Figma Make prototype](https://copper-egg-87821545.figma.site/) and the HelpDesk Lite V1 design spec (emerald / gold, role-aware queues).

Authentication runs on **Firebase Authentication** and tickets persist in **Cloud Firestore**, with role-based access control enforced both in the router and in Firestore security rules. Without Firebase environment variables the app falls back to the original local demo store so the UI can still be explored offline.
=======
Internal IT ticketing workspace matching the [Figma Make prototype](https://copper-egg-87821545.figma.site/) and the HelpDesk Lite V1 design spec (emerald / gold, SSO-first, role-aware queues).

Lovable only exported a partial shadcn kit. This app is the working product: authentication, tickets, lifecycle, and manager analytics, with local demo data.
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27

## Run

```bash
<<<<<<< HEAD
npm install
cp .env.example .env   # fill in your Firebase web config
=======
cd helpdesk-lite
npm install
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

<<<<<<< HEAD
| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run lint` | oxlint |
| `npm run typecheck` | TypeScript project build |
| `npm test` | Vitest unit + route-guard tests |
| `npm run build` | Type-check and production build |

## Firebase setup

1. Create a Firebase project and add a **Web app**; copy its config into `.env` using the keys in `.env.example`.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create a **Cloud Firestore** database.
4. Deploy the security rules and indexes in this repo:

   ```bash
   npm i -g firebase-tools
   firebase login
   firebase use <your-project-id>
   firebase deploy --only firestore:rules,firestore:indexes
   ```

5. Optional — run locally against the emulators:

   ```bash
   firebase emulators:start   # then set VITE_FIREBASE_USE_EMULATOR=true
   ```

Only the public web config belongs in the frontend. Never place Firebase **Admin** credentials or service-account keys in this app, and never commit a filled-in `.env`.

### Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | yes | Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | yes | `<project>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | yes | |
| `VITE_FIREBASE_STORAGE_BUCKET` | no | |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | no | |
| `VITE_FIREBASE_APP_ID` | yes | |
| `VITE_FIREBASE_USE_EMULATOR` | no | `true` to use local emulators |

When the required variables are missing the app starts in **demo mode**: the persona picker from the prototype returns and tickets persist in `localStorage`.

## Authentication

- Sign up (`/signup`), sign in (`/signin`), sign out, forgot password (`/forgot-password`), password reset (`/reset-password`), email verification (`/verify-email`).
- Session persistence is `browserLocalPersistence`; a single `onAuthStateChanged` listener in `src/lib/auth.tsx` owns auth state for the whole app.
- Protected routes are blocked until the email address is verified.
- Every new account is created as **submitter**. Roles are never chosen during registration; only a manager can change a role (enforced in Firestore rules).

## Data model

| Collection | Document |
| --- | --- |
| `users/{uid}` | `uid, email, displayName, role, emailVerified, avatarUrl, createdAt, updatedAt` |
| `tickets/{ticketId}` | `id, subject, category, description, status, priority, submitterId, assigneeId, assignedById, assignedAt, createdAt, updatedAt, resolvedAt, closedAt, activity[]` |
| `auditLogs/{logId}` | `id, ticketId, actorId, action, oldValue, newValue, createdAt` — append-only |

Audit entries are written in the same batch as the ticket change for ticket creation, assignment changes, status changes, resolution, and closure. Clients can never update or delete an audit record.

## Roles and access

| Route | Roles |
| --- | --- |
| `/`, `/tickets`, `/tickets/new`, `/tickets/:id`, `/profile` | any signed-in user (submitters only see their own tickets) |
| `/queue` (alias `/agent/queue`) | agent, triage, manager |
| `/analytics` | manager |

Unauthorized navigation renders a real 403 page instead of a silent redirect, and Firestore rules enforce the same boundaries server-side.

## Ticket rules

- Lifecycle: Open → In Triage → In Progress → Resolved → Closed (no skipping).
- **A ticket cannot enter In Progress without an assignee** — enforced in the shared permission module, in the UI, and in `firestore.rules`.
- Agents may only assign tickets to themselves; triage leads and managers may assign anyone.
- Closed tickets are read-only.

## V1 scope

- Roles: Submitter, Agent, Triage Lead, Manager
- Light / dark theme, responsive layout, accessible inline form validation
=======
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
>>>>>>> 95f43248261b9ce82ba6995324a329dbf0cdcc27
- Out of scope: SLA timers, AI routing, Slack/Jira/Zendesk, knowledge base
