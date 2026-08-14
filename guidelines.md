# 3.14 - Conf (SOMA Likhani) Project Guidelines & Documentation

This document serves as the authoritative reference for the **3.14 - Conf** codebase. It outlines the project concept, architecture, tech stack, key routes, animation workflows, telemetry, admin access, and development commands.

---

## 📌 1. Project Overview & Concept

**Project Name**: `3.14 - Conf` (Codebase directory: `APC_2025_2026_T1-MERGE_CONFLICT-SOMA-VERGE-LIKHANI/SOMA_Likhani`)  
**Team**: Team Likhani & Team Merge Conflict  
**Institution**: Asia Pacific College (APC) — School of Multimedia Arts (SOMA)

### Dual-Layer Experience Architecture:
1. **Likhani Archive Homepage (Disguise / Trap Front)**:
   - Appears as the official digital media archive for APC SOMA student works (films, animations, documentaries, capstone projects).
   - Serves as an authentic, high-end portfolio frontend.
2. **Secret Confession Experience (`/conf`)**:
   - Activating any media card, watch button, stream link, or navigation item triggers the **Trap System**.
   - **5-Second Fall-off Animation**: Individual UI elements (Navbar, Hero Section, Spotlight Card, Category Lists, Site Footer) tumble and fall off downwards with staggered physical delays (`0.1s` to `1.6s`) and 3D rotations.
   - **3-Second Slow Fade-In Transition**: At `3.8s`, the app navigates to `/conf` where the clean, card-less security verification loading screen softly fades in over `3.0s` (`animate-slow-fade-in`).
   - **Confession Interactive Deck**: Includes card-less full-screen security verification, custom interactive quiz, PowerPoint-style slides deck, evasive "No" button, date/time location picker, and celebration confetti.

---

## 🛠️ 2. Technology Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Routing**: `react-router-dom` v7 (SPA with Vercel rewrite rules)
- **Styling**: Tailwind CSS v4, Custom CSS design system (`conf.css`, `index.css`)
- **Animation Engine**: Framer Motion (`motion/react` v12)
- **Backend & Database**:
  - **Convex**: Realtime cloud database for confession responses, app configuration (slides, quiz, recipient name, admin passcode), and view-time telemetry logs.
  - **Supabase**: Auth sync and public media announcements data.
- **Media & Interactive Libraries**:
  - Cloudinary Video Player (`cloudinary-video-player`)
  - Leaflet Maps (`leaflet`, `react-leaflet`)
  - Canvas Confetti (`canvas-confetti`)
  - Lucide Icons (`lucide-react`), Sonner toasts (`sonner`), Radix UI Slot (`@radix-ui/react-slot`)

---

## 📁 3. Project Structure

```
3.14 - Conf/
├── guidelines.md                        # Project Guidelines & Memory Documentation (This File)
├── vercel.json                          # Vercel deployment configuration & SPA route rewrites
├── package.json                         # Root package manifest & build script
├── convex/                              # Convex Realtime Backend Functions & Schemas
│   ├── schema.ts                        # Tables: viewTimeLogs, config, responses
│   ├── analytics.ts                     # Telemetry logging & summary math queries
│   ├── config.ts                        # App configuration (passcode, slides, recipient) queries/mutations
│   └── responses.ts                     # Confession responses CRUD queries/mutations
└── APC_2025_2026_T1-MERGE_CONFLICT-SOMA-VERGE-LIKHANI/
    └── SOMA_Likhani/                    # Primary Application Codebase
        ├── src/
        │   └── app/
        │       ├── App.tsx              # Main Router & TrapTransitionProvider wrapper
        │       ├── context/
        │       │   └── TrapTransitionContext.tsx # Trap Context & TrapElement fall-off helper
        │       ├── pages/
        │       │   ├── Home.tsx         # Likhani Archive Homepage (Disguise Front)
        │       │   └── NotFound.tsx     # 404 Page
        │       ├── conf/                # Valentine Confession App
        │       │   ├── ConfPage.tsx     # Main Confession Flow Entry & Stage Manager
        │       │   ├── ConfAdminPage.tsx# In-App Admin Login Gate (/conf-admin)
        │       │   ├── AdminDashboard.tsx# In-App Admin Panel (Analytics, Responses, Quiz, Slides, Config)
        │       │   ├── LoadingIntro.tsx # Card-less full-screen security verification loading screen
        │       │   ├── QuizViewer.tsx   # Interactive quiz deck component
        │       │   ├── SlidesViewer.tsx # PowerPoint-style slide deck component
        │       │   ├── MessageForm.tsx # Response submission & date picker
        │       │   ├── telemetry.ts     # Client telemetry logging & summary math
        │       │   └── conf.css         # Confession design tokens & slowFadeIn keyframes
        │       └── components/          # Layout & Media components (Navbar, SiteFooter, VideoCard)
        ├── package.json
        └── vite.config.ts
```

---

## 🚀 4. Important Commands

### Development Server
Run the local Vite development server:
```bash
cd APC_2025_2026_T1-MERGE_CONFLICT-SOMA-VERGE-LIKHANI/SOMA_Likhani
npm run dev
```

### Production Build
Build the client application bundle:
```bash
cd APC_2025_2026_T1-MERGE_CONFLICT-SOMA-VERGE-LIKHANI/SOMA_Likhani
npm run build
```

### Root Build Command (Vercel Build Target)
```bash
npm run build
```

### Convex Realtime Database Sync
```bash
npx convex dev
```

---

## 🔑 5. Routes & Admin Access

- `/` or `/home`: Likhani Archive Homepage (Trap Front).
- `/conf`: Secret Confession Experience (Revealed after trap activation).
- `/conf-admin` or `/conf/admin`: Built-in In-App Admin Dashboard.
  - **Default Passcode**: `1234` (configurable in the **CONFIG** tab or Convex DB).
  - **Capabilities**:
    - **ANALYTICS**: Realtime telemetry stats (unique sessions, view time, average session duration, screen/slide breakdown).
    - **RESPONSES**: Confession responses log with choices, date/time preferences, and messages.
    - **QUIZ**: Quiz question CRUD editor.
    - **SLIDES**: PowerPoint slide deck CRUD editor (add, edit, reorder, delete slides).
    - **CONFIG**: Recipient name, sender name, confession question text, coffee location, evasive "No" button setting, and admin passcode.

---

## ⚙️ 6. Core Workflow Specifications

### 1. Trap Transition Cascade Workflow
1. User clicks any media card, stream button, watch button, or footer link on Likhani.
2. `triggerTrap('/conf')` is invoked from `useTrapTransition()`.
3. Individual UI components wrapped in `<TrapElement>` fall off downwards with staggered physical delays (`0.1s` to `1.6s`) over a 5.0-second duration:
   - **Navbar**: `delay={0.1s}`, `rotate={-6}`
   - **Hero Section**: `delay={0.4s}`, `rotate={8}`
   - **Spotlight Section**: `delay={0.8s}`, `rotate={-9}`
   - **Category Lists**: `delay={1.2s}`, `rotate={7}`
   - **Site Footer**: `delay={1.6s}`, `rotate={-5}`
4. Navigation to `/conf` runs at `3.9s` right as the tumble sequence concludes.
5. `ConfPage` and `LoadingIntro` fade into view over a **5.0-second slow fade-in** (`animate-slow-fade-in 5.0s ease-in-out forwards`).

### 2. Card-Less Loading Intro Design
- `LoadingIntro.tsx` intentionally omits card/box containers.
- Loading elements (pulsing heart icon ring, *"Private Access Check"* title, recipient verification subtitle, progress bar, status text, and action button) float directly on the screen for a full-screen, native loading experience.

### 3. Telemetry System
- Screen and slide view durations are automatically tracked.
- Telemetry events are persisted in Convex DB (`viewTimeLogs` table) with fallback to `localStorage`.

---

## 📝 7. Guidelines for Future Maintenance

1. **Obey Design Standards**: Preserve the curated color system (`#8A181A` crimson, deep dark mode, rose accents) and typography.
2. **Keep Trap Transitions Intact**: When adding new pages or UI sections to the Likhani frontend, wrap them in `<TrapElement>` with appropriate staggered delays so they fall off dynamically when the trap triggers.
3. **Card-Less Loading**: Maintain the clean, card-less layout for `LoadingIntro.tsx`.
4. **Always Verify Builds**: Run `npm run build` after modifying routing, components, or styles to ensure clean TypeScript compilation.
