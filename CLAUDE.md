# SafeCheck SA — Nybble for NERVE

## What is this?
SafeCheck SA is a viral vehicle risk assessment tool powered by **NERVE** (lead generation engine) for the **Nybble** pipeline/client. It uses South African vehicle theft and hijacking statistics to generate high-intent insurance leads.

### Business Flow
1. User checks their car's risk (free) 
2. Results page shows high fear content + protection prompt
3. User schedes a "protection call" (lead captured)
4. Lead (name + phone + car + province + consent timestamp) delivered to FSCA-licensed insurance partners
5. Revenue: R200–R600 per qualified lead

### Viral Mechanic
- WhatsApp share message pre-generated per user/car combo
- Fear-based sharing: "Is YOUR car on the list?"
- 1 share → 250–500 views → 20–30% CTR

## NERVE Context
NERVE is the lead generation engine at IDT. Each client gets a pipeline/project with a tailored approach:
- **Nybble** — SafeCheck SA (this project)
- **BrandX** — WhatsApp-based lead gen (see `../../BrandX/`)
- Previous clients included FNB, Dikgoboro, Sanlam, and others

**Branding**: "SafeCheck SA — powered by Nerve"

## Tech Stack
- **Next.js 16** with App Router (React 19)
- **Tailwind CSS 4**
- **TypeScript**
- **Vercel** for deployment (preview/development branch = production)

## Deployment
- Push to `development` branch via `./push-dev.ps1 "commit message"`
- Vercel auto-deploys from `development` branch
- No separate prod pipeline — Vercel preview IS production

## Design System
See [styles/design-system.ts](styles/design-system.ts) for colors, typography, spacing, shadows, and radii. The design system follows the same structural patterns as the Apex Platform UI but with SafeCheck SA's own brand palette.

## Key Principles
- POPIA-compliant lead capture (consent timestamp required)
- Mobile-first — most traffic comes via WhatsApp
- Fast, fear-driven UX — minimize friction to lead capture
- Share-optimized — WhatsApp OG tags and pre-written share messages

@AGENTS.md
