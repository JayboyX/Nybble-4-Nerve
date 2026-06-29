<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# SafeCheck SA — Agent Instructions

## Design Reference
The visual system is defined in `styles/design-system.ts`. Use design tokens from there — never hardcode colors or spacing. The structural approach mirrors the Apex Platform UI but with SafeCheck SA's own brand palette (red/danger for urgency, navy for trust).

## Git Workflow
- Branch: `development` (maps to Vercel deployment)
- Push script: `./push-dev.ps1 "message"`
- Remote: `https://github.com/JayboyX/Nybble-4-Nerve.git`

## Code Style
- Tailwind CSS 4 utility classes
- TypeScript strict
- Components in `app/` following Next.js App Router conventions
- Mobile-first responsive design — most traffic from WhatsApp

## Business Context
This is a NERVE lead gen pipeline for Nybble. The app captures vehicle insurance leads via fear-based risk assessment. All lead capture must be POPIA-compliant with consent timestamps.
