# Zaf Focus — Client

React + Vite + Tailwind CSS frontend for the Focus App. This is the single frontend for the project (merged from the design source; no separate UI app exists anymore).

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- lucide-react (icons)
- axios (backend API calls to `http://localhost:5000/api`)

## Structure

```
src/
├── main.tsx                  → entry point
├── App.tsx                   → auth gate + main layout (sidebar, header, views, modals)
├── api.js                    → backend API client
├── api.d.ts                  → types for the API client
├── types.ts                  → shared domain types
├── index.css                 → Tailwind + theme tokens (light/dark)
├── context/AppContext.tsx    → global state + backend wiring (timer, sessions, goals, stats, badges)
├── components/
│   ├── auth/AuthPage.tsx     → login / signup
│   ├── Header.tsx, Sidebar.tsx
│   ├── views/                → Dashboard, Focus, Stats, Achievements, Goals, Settings
│   └── modals/               → Profile, Notifications, Support, Subscription, Sign out, Delete account
└── utils/
    ├── audio.ts              → Web Audio ambient sound synthesizer
    └── storage.ts            → localStorage persistence + seed data
```

## Scripts

```bash
npm run dev          # start dev server
npm run build        # production build
npm run lint         # oxlint
npm run typecheck    # tsc --noEmit
npm run preview      # preview production build
```
