# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build (also type-checks)
npm run lint     # ESLint
npx tsc --noEmit # Type-check without building
```

There are no tests configured in this project.

To add a new shadcn/ui component:
```bash
npx shadcn@latest add <component-name>
```

## Architecture

This is a **frontend-only** HR admin panel demo. There is no backend, API, or database — all data lives in React state initialized from static fake data files.

### Data flow

```
src/lib/data.ts          ← Static fake data (18 employees, 6 departments)
src/lib/types.ts         ← TypeScript interfaces (Employee, Department)
src/lib/store.tsx        ← HRProvider (React Context) — in-memory CRUD state
src/app/(admin)/layout.tsx ← Wraps all admin pages with HRProvider
```

All pages consume data via `useHR()` hook from `src/lib/store.tsx`. State resets on page refresh since there is no persistence layer.

### Routing

Uses Next.js App Router with a `(admin)` route group:

- `/` → redirects to `/dashboard`
- `/dashboard` — KPI cards, headcount bars, recent hires
- `/employees` — searchable/filterable table, add/edit/delete modals
- `/departments` — table + card view toggle, add/edit/delete modals
- `/settings` — static placeholder

### Styling

- **Tailwind CSS v4** with CSS variables defined in `src/app/globals.css`
- **shadcn/ui** (new-york style, `components.json` at root) — components live in `src/components/ui/`
- Custom theme: indigo primary, dark slate sidebar. All colors defined as `oklch()` variables in `globals.css` under `:root` and `.dark`
- Icon library: **lucide-react**

### Key constraint: hydration safety

Never use `new Date()`, `Date.now()`, or `Math.random()` at module level in client components — this causes React hydration mismatches between SSR and client renders. Always compute these values inside event handlers or `useEffect`.
