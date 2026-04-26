# Habit Tracker PWA - Stage 3 Implementation

## Project Overview
This repository contains the technical implementation of the Stage 3 Habit Tracker PWA. The application allows users to sign up, log in, manage their daily habits, track streaks, and operates smoothly fully locally as an installable Progressive Web App (PWA).

## Setup Instructions
1. Install Node.js v18 or later.
2. Clone this repository (Assumed URL placeholder).
3. Run `npm install` to install all dependencies (Next.js, Tailwind, Vitest, Playwright).
4. Run `npx playwright install` to set up E2E browser environments.

## Run Instructions
- Start development server: `npm run dev`
- Build the app: `npm run build`
- Start production server: `npm run start`

App will run locally at `http://localhost:3000`.

## Test Instructions
We use `vitest` for Unit and Integration testing, and `playwright` for End-to-End Testing.
- Run all test suites exactly as required: `npm run test`
- Run just Unit tests + Coverage: `npm run test:unit`
- Run Integration tests: `npm run test:integration`
- Run E2E tests: `npm run test:e2e`

## Explanation of Local Persistence Structure
The entire database layer runs deterministically within the browser's `localStorage` in strict accordance with the TRD. Data is isolated by standard JSON stringified arrays:
- `habit-tracker-users`: JSON array holding user accounts `{id, email, password, createdAt}`
- `habit-tracker-session`: Active session `{userId, email}` or `null`
- `habit-tracker-habits`: Cross-user collection of habits `{id, userId, name, description, frequency, createdAt, completions}`. Logic maps habit CRUD access strictly to the matching session `userId`.

## PWA Support Implementation
PWA support is implemented directly via vanilla Web APIs bridging inside a standard Next.js layout constraint:
1. `public/manifest.json`: Defines the web manifest (display, theme, icons) that provides installability.
2. `public/sw.js`: A custom Service Worker caching an offline shell `/` upon 'install', and intercepting 'fetch' events. When offline fetching fails, it falls back to the cached root, completely preventing the "hard crash" screen.
3. Automatically registered inside `app/layout.tsx` when the client mounts.

## Trade-offs or Limitations
- **Security Check Trade-offs**: Passwords exist in plaintext within Local Storage to meet strict testing visibility. This violates actual security but mirrors TRD deterministic bounds exactly.
- **Client Render Locking**: Since local storage dictates session state securely inside a deterministic SSR framework (Next.js), many pages use `"use client"` directives and effects. This bypasses SSR optimization entirely but properly supports pure local storage mapping requirements.

## Behavior Verification Map
| Required File | Verification Purpose |
| ------------- | -------------------- |
| `tests/unit/slug.test.ts` | Confirms string transformation output properly yields clean URLs/IDs |
| `tests/unit/validators.test.ts` | Asserts habit naming guardrails around empties and >60 char bounds |
| `tests/unit/streaks.test.ts` | Validates backwards day-by-day continuous completion chain math logic |
| `tests/unit/habits.test.ts` | Validates immutable, non-duplicative array toggle logic per Date ISO |
| `tests/integration/auth-flow.test.tsx` | Validates UI signup/login error reporting and standard local storage hooks |
| `tests/integration/habit-form.test.tsx`| Verifies standard local operations for creating and clearing habits |
| `tests/e2e/app.spec.ts` | Full user-simulated journeys from boot screen load times to authenticated CRUD offline reloading |
