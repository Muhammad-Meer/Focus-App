# Focus-App

A full-stack Focus Mode application with a React + Vite + Tailwind frontend and a Node.js + Express + MongoDB backend.

## Structure
// code buff
```
FOCUS/
│
├── client/    → React + Vite + Tailwind frontend (Zaf Focus UI)
└── server/    → Node.js + Express + MongoDB backend
```

## Features

- **Auth** — Sign up / sign in with JWT-backed sessions
- **Focus Engine** — Pomodoro / custom timers with a circular countdown, task + category tracking, and a distraction-free fullscreen mode
- **Ambient audio** — Web Audio synthesized white noise (rain, binaural beats, cafe, deep space)
- **Rewards** — Points, streaks, levels, and badges earned server-side when a session completes
- **Dashboard** — Today's deep work stats, active session controller, recent sessions, and active goals
- **Analytics** — Weekly focus volume chart, category breakdown, and searchable/filterable session logs
- **Achievements** — Badge wall synced with backend progress, level/XP progress
- **Goals** — Set focus-hour targets, log progress, track completion
- **Settings** — Light/dark theme, language, startup behavior, data export (JSON/CSV), subscription UI, account deletion
- **Notifications** — In-app notification feed for session completions and badge unlocks

## Getting Started

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # set MONGO_URI and JWT_SECRET
npm run dev            # runs on http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev            # runs on http://localhost:5173
```

The client calls the backend at `http://localhost:5000/api`.

## Scripts

| Directory | Command          | Description                    |
| --------- | ---------------- | ------------------------------ |
| client    | `npm run dev`    | Start Vite dev server          |
| client    | `npm run build`  | Production build               |
| client    | `npm run lint`   | Oxlint checks                  |
| client    | `npm run typecheck` | TypeScript check           |
| server    | `npm run dev`    | Start server with nodemon      |
