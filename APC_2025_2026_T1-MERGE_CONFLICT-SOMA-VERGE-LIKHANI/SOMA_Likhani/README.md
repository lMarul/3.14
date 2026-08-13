# Likhani Frontend Prototype

A React + Vite frontend prototype (generated from Figma export and being cleaned up for production-ready structure).

## Tech Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS 4 (`@tailwindcss/vite`)
- Motion (`motion/react`)
- Radix UI primitives
- Sonner (toasts)
- Cloudinary Video Player

## Prerequisites

- Node.js 18+ (recommended: Node 20+
- npm 9+
- Windows PowerShell, Terminal, or Git Bash

## Project Location

Current expected path:

"C:\Users\Vince\Documents\APC_2025_2026_T1-METAMORPHISIS-SOMAVAULT\SOMA_Likhani"

## Install and Run

From repository root:

```powershell
cd likhani-frontend-prototype
npm install
npm run dev
```

Vite will print a local URL such as:

- `http://localhost:5173/`
- If occupied, it will auto-increment (`5174`, `5175`, etc.).

## Build and Preview

```powershell
cd likhani-frontend-prototype
npm run build
npm run preview
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Type-check + production build
- `npm run preview` - Preview production build locally

## Important Project Notes

### 1) Entry Files

The app needs these files present:

- `index.html`
- `src/main.tsx`

`src/main.tsx` must import global styles:

```ts
import "./styles/index.css";
```

### 2) Global Styling Pipeline

`src/styles/index.css` imports:

- `fonts.css`
- `tailwind.css`
- `theme.css`
- Cloudinary player CSS

If UI looks unstyled, verify those imports are still intact.

### 3) Figma Asset Imports

Figma-exported files may include imports like:

`figma:asset/...`

Vite is configured to map those to a local fallback module in `vite.config.ts`:

- regex alias: `/^figma:asset\/.*$/`
- fallback file: `src/figmaAssetFallback.ts`

This keeps the app running even when the original Figma asset resolver is unavailable.

## Common Issues and Fixes

### Issue: `Could not read package.json` / JSON parse errors

Cause:

- Corrupted or empty `package.json` in current/parent folder.

Fix:

1. Ensure you are in `SOMA_Likhani` before running npm commands.
2. Check `SOMA_Likhani/package.json` is valid JSON.
3. Delete accidental root-level empty `package.json` files outside this folder.

### Issue: `Port 5173 is in use`

Cause:

- Another Vite/dev server is already running.

Fix:

- Open the next URL Vite provides (`5174`, `5175`, etc.), or
- stop old terminals/processes and rerun `npm run dev`.

### Issue: App opens but page is unstyled

Cause:

- Missing `import "./styles/index.css";` in `src/main.tsx`, or missing style dependencies.

Fix:

```powershell
cd likhani-frontend-prototype
npm install
npm install -D tailwindcss @tailwindcss/vite tw-animate-css
npm run dev
```

### Issue: Missing module errors (e.g. `react-router-dom`, `sonner`, `motion/react`)

Fix:

```powershell
cd likhani-frontend-prototype
npm install react-router-dom sonner motion @radix-ui/react-slot class-variance-authority cloudinary-video-player
```

## Folder Overview

- `src/app/` - Main application logic and pages
- `src/app/components/layout/` - Structural components (navbar, footer, page container, logo)
- `src/app/components/media/` - Media presentation components (video card, carousel, player)
- `src/app/components/navigation/` - Navigation controls (back button, filters)
- `src/app/components/providers/` - App-level providers and hooks
- `src/app/components/common/` - Reusable common components (buttons, icons)
- `src/styles/` - Global CSS/theme/font layers
- `src/generated/` - Figma-generated assets/helpers
- `public/` - Static files
- `vite.config.ts` - Vite plugins + alias rules

## Team Workflow (Temporary)

Until we reorganize files:

1. Keep features working first (do not over-refactor paths yet).
2. Add components/pages in current structure under `src/app/`.
3. Preserve alias + fallback setup in `vite.config.ts`.
4. Update this README whenever setup or commands change.

## Next Planned Cleanup (After This README)

- Normalize folder structure (`src/features`, `src/shared`, etc.)
- Replace fallback Figma assets with real local assets
- Add linting and formatting configuration
- Add environment docs once backend/API integration starts

## Quick Start Checklist

- [ ] `cd SOMA_Likhani`
- [ ] `npm install`
- [ ] `npm run dev`
- [ ] Open URL printed by Vite
- [ ] Hard refresh browser (`Ctrl+F5`) if styles look stale
