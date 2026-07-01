# UI Revamp Plan

## Reference (design/UX only — not code, not tech stack)
`C:\Users\lange\Downloads\build-safecheck-web-application\src`

This is a separate prototype (Vite + React, lucide-react icons). We are **only** borrowing its visual language and UX flow — layout, copy tone, color usage, motion, component states. We are **not** importing its files, its build setup, or lucide-react. Our stack stays exactly as-is:
- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4 (`@theme` tokens already close to the reference's `index.css`)
- `framer-motion` (already a dependency — reference's motion patterns translate directly)
- `ionicons` for icons (reference's `lucide-react` icons get mapped to ionicons equivalents, not installed)
- `styles/design-system.ts` remains the single source of truth for tokens

## What the reference gets us
- **Color system**: slate-950/900/800 base + red-950→500 danger scale + amber (mid-risk) + emerald (protected/safe state). Matches our red/navy brand direction, more fully fleshed out across states.
- **Risk meter**: 10-segment horizontal bar, amber→orange→red fill by score — reusable pattern for our results page risk display.
- **Fear bar**: labeled percentage bars with animated width fill (framer-motion `initial`/`animate` on width) — likelihood/vulnerability metrics.
- **Searching/scan screen**: spinner + streaming log lines (staggered via `setTimeout`) — matches our existing scan-screen.tsx, can tighten the visual treatment.
- **Protection flow**: 3-button decision (Yes/No/Unsure) → full-screen modal overlay for No/Unsure with rotating fear stories, inline lead form, phone "verify" step, POPIA consent checkbox with timestamp capture, submitted confirmation state. This is more elaborate than our current protection-flow.tsx and is the highest-value UX to port.
- **Fear/insurance section**: collapsible car-specific + province-specific fact lists, staggered fade-in-x animation per line.
- **Micro-animations**: `heartbeat` (CTA pulse), `pulse-red` (glow ring), `scanline`, `fade-in-up`, `slide-in-right` — all defined as plain CSS `@keyframes` in `index.css`, portable into our `globals.css` as utility classes.
- **Live social proof**: ticker + live feed components — compare against our existing `ticker.tsx` / `live-feed.tsx` / `live-counter.tsx` for gaps.

## Scope boundaries
- Do NOT copy files verbatim from the reference directory.
- Do NOT add lucide-react, Vite, or any reference-only dependency.
- Re-implement each pattern using our existing component structure in `components/` and `app/`, our data layer (`app/lib/`), and our design tokens.
- Content differences (car data, comments, provinces) — cross-check against our own `app/lib/vehicles.ts` / `app/lib/data.ts` rather than importing reference `data/`.

## Proposed approach (pending approval)
1. Extend `styles/design-system.ts` with any missing tokens/keyframes surfaced by the reference (fear/risk color scale, animation names).
2. Revamp file-by-file per `ui-revamp-status.md`, in this order:
   - `styles/design-system.ts` + `app/globals.css` (tokens + keyframes foundation)
   - `components/scan-screen.tsx` (searching state)
   - `components/protection-flow.tsx` (biggest UX upgrade — decision buttons, modal, consent flow)
   - `app/results/*` (risk meter, fear bars, fear/insurance section)
   - `components/ticker.tsx`, `live-feed.tsx`, `live-counter.tsx`, `live-stats.tsx`, `social-proof.tsx`
   - `components/car-check-form.tsx`, `hero-section.tsx`, `check-cta-button.tsx`
   - `app/page.tsx`, `app/admin/*` (lower priority — internal tooling)
3. After each file/group is revamped, flip its row in `ui-revamp-status.md` to Done.
4. Verify in-browser after each major group (per `/verify` or `/run`) before moving to the next.

Awaiting approval before starting implementation.
