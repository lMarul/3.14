# 3.14 - Conf (SOMA Likhani) Project Guidelines & Documentation

This document serves as the authoritative reference for the **3.14 - Conf** codebase. It outlines the project concept, architecture, tech stack, key routes, animation workflows, telemetry, admin access, database schemas, and development guidelines.

---

## 📌 1. Project Overview & Concept

**Project Name**: `3.14 - Conf` (Codebase directory: `APC_2025_2026_T1-MERGE_CONFLICT-SOMA-VERGE-LIKHANI/SOMA_Likhani`)  
**Team**: Team Likhani & Team Merge Conflict  
**Institution**: Asia Pacific College (APC) — School of Multimedia Arts (SOMA)

### Dual-Layer Experience Architecture:
1. **Likhani Archive Homepage (Disguise / Trap Front)**:
   - Appears as the official digital media archive for APC SOMA student works (films, animations, documentaries, capstone projects).
   - Serves as an authentic, high-end portfolio frontend with hero video carousels, spotlights, categories, and footer links.
2. **Secret Confession Experience (`/conf`)**:
   - Activating any interactive media card, watch button, stream link, or navigation item triggers the **Trap System**.
   - **Granular Micro-Element Chaotic Breakdown**: Fine-grained micro-elements (brand logo, individual nav links, hero heading, body texts, buttons, badges, media cards, footer elements) independently tumble, rotate, and scatter downwards with calibrated staggered physics delays (`0.05s` to `1.8s`) and randomized rotations/translations.
   - **Black Overlay Lift & 5.0-Second Fade-In**: Smooth fade through a dark transition overlay into `/conf` where the minimalist, card-less security verification loading screen softly fades in over `5.0s` (`animate-slow-fade-in`).
   - **Confession Interactive Deck**: Includes card-less security verification check, identity quiz, PowerPoint-style slides deck with reveal gate & burst animations, smooth fade to decision question, playful evasive "No" button, coffee date picker & map, and celebration confetti.

---

## 🛠️ 2. Technology Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Routing**: `react-router-dom` v7 (SPA with Vercel rewrite rules)
- **Styling**: Tailwind CSS v4, Custom CSS design system (`conf.css`, `index.css`)
- **Animation Engine**: Framer Motion (`motion/react` v12), CSS keyframe animations
- **Backend & Database**:
  - **Convex**: Realtime cloud database & sync via `ConvexProvider` / `useQuery` / `useMutation` for live app configuration (slides, quiz questions, recipient name, admin passcode), confession responses, and view-time telemetry logs.
  - **Supabase**: Auth session sync and public media announcements data.
- **Media & Interactive Libraries**:
  - Cloudinary Video Player (`cloudinary-video-player`)
  - Leaflet Maps (`leaflet`, `react-leaflet`)
  - Canvas Confetti (`canvas-confetti`)
  - Lucide Icons (`lucide-react`), Sonner toasts (`sonner`), Radix UI Slot (`@radix-ui/react-slot`)

---

## 📁 3. Project Structure

```
3.14 - Conf/
├── guidelines.md                        # Project Guidelines & Memory Documentation (Root)
├── vercel.json                          # Vercel deployment configuration & SPA route rewrites
├── package.json                         # Root package manifest & build script
├── convex/                              # Convex Realtime Backend Functions & Schemas
│   ├── schema.ts                        # Tables: appConfig, viewTimeLogs, responses
│   ├── analytics.ts                     # Telemetry logging & summary math queries
│   ├── config.ts                        # App configuration (passcode, slides, recipient) queries/mutations
│   └── responses.ts                     # Confession responses CRUD queries/mutations
└── APC_2025_2026_T1-MERGE_CONFLICT-SOMA-VERGE-LIKHANI/
    └── SOMA_Likhani/                    # Primary Application Codebase
        ├── guidelines.md                # App guidelines copy
        ├── convex/                      # Local Convex client bindings & generated types
        ├── src/
        │   ├── main.tsx                 # React DOM root
        │   └── app/
        │       ├── App.tsx              # Main Router, ConvexProvider & TrapTransitionProvider wrapper
        │       ├── context/
        │       │   └── TrapTransitionContext.tsx # Trap Context & TrapElement fall-off helper
        │       ├── pages/
        │       │   ├── Home.tsx         # Likhani Archive Homepage (Disguise Front)
        │       │   └── NotFound.tsx     # 404 Page
        │       ├── conf/                # Valentine Confession App
        │       │   ├── ConfPage.tsx     # Main Confession Flow Entry, Stage Manager & live useQuery subscription
        │       │   ├── ConfAdminPage.tsx# In-App Admin Login Gate (/conf-admin)
        │       │   ├── AdminDashboard.tsx# In-App Admin Panel (Sonner toasts, Analytics, Responses, Quiz, Slides, Config)
        │       │   ├── LoadingIntro.tsx # Card-less full-screen security verification loading screen
        │       │   ├── QuizViewer.tsx   # Interactive identity quiz deck component
        │       │   ├── CongratsScreen.tsx # Transition congratulations screen
        │       │   ├── SlideViewer.tsx  # PowerPoint-style slide deck with reveal gate & Slide 8 burst physics
        │       │   ├── DecisionSlide.tsx# Decision question with fade transition & evasive No button
        │       │   ├── MapLocation.tsx  # Coffee shop location map & date/time confirmation
        │       │   ├── MessageForm.tsx  # Response submission form
        │       │   ├── defaultConfig.ts # Fallback app configuration and initial deck data
        │       │   ├── telemetry.ts     # Client telemetry logging & summary math
        │       │   ├── types.ts         # TypeScript definitions for slides, quiz, responses, and config
        │       │   └── conf.css         # Confession design tokens, burst animations & transition keyframes
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
cd APC_2025_2026_T1-MERGE_CONFLICT-SOMA-VERGE-LIKHANI/SOMA_Likhani
npx convex dev
```

---

## 🔑 5. Routes & Admin Access

- `/` or `/home`: Likhani Archive Homepage (Disguise Front).
- `/conf`: Secret Confession Experience (Revealed after trap activation).
- `/conf-admin` or `/conf/admin`: Built-in In-App Admin Dashboard.
  - **Default Passcode**: `1234` (configurable in the **CONFIG** tab or Convex DB).
  - **Capabilities**:
    - **ANALYTICS**: Realtime telemetry stats (unique sessions, total view time, average session duration, screen/slide view breakdown).
    - **RESPONSES**: Confession responses log with choices, date/time preferences, messages, and manual entry CRUD.
    - **QUIZ**: Interactive quiz question CRUD editor (edit questions, choices, correct answers, comments).
    - **SLIDES**: PowerPoint slide deck CRUD editor (add, edit, reorder, delete slides).
    - **CONFIG**: Live updating of recipient name, sender name, confession question prompt, coffee shop coordinates, evasive "No" button setting, and admin passcode with Sonner toast feedback.

---

## ⚙️ 6. Core Workflow & Feature Specifications

### 1. Trap Transition Cascade Workflow
1. User clicks any media card, stream button, watch button, or navigation link on the Likhani homepage.
2. `triggerTrap('/conf')` is invoked from `useTrapTransition()`.
3. Granular micro-elements wrapped in `<TrapElement>` tumble downwards with staggered physics delays (`0.05s` to `1.8s`) and random rotations over a 4.0-second sequence.
4. A cinematic dark overlay engages at `2.6s` and navigates to `/conf` at `3.6s`.
5. `ConfPage` and `LoadingIntro` fade into view over a **5.0-second slow fade-in** (`animate-slow-fade-in 5.0s ease-in-out forwards`).

### 2. Confession Flow Stages
- **Stage 1: Loading Intro (`LoadingIntro.tsx`)**: Minimalist, card-less security verification interface pulling dynamic recipient name from live Convex config.
- **Stage 2: Verification Quiz (`QuizViewer.tsx`)**: Customized interactive questions validating identity.
- **Stage 3: Congrats Screen (`CongratsScreen.tsx`)**: Smooth transition confirmation heading into the confession message deck.
- **Stage 4: PowerPoint Story Presentation (`SlideViewer.tsx`)**:
  - Fullscreen modern slide-deck view with direct jump dot indicators, interactive click-to-reveal for Slide 1, and embedded media players.
  - **Slide 4 Audio & Video Layout**:
    - 2 floating video cards positioned at the upper-left and upper-right corners of the centered middle text.
    - Background audio (`ligaya.mp3`) starts strictly at `00:58` (58s) on Slide 4, smoothly fades near `01:38` (98s), and automatically pauses/resets when navigating away or unmounting.
  - **Slide 5 Video Layout**:
    - 6 floating video cards scattered around the centered middle text across the 6 anti-gravity coordinate positions (Slide 8 style burst/float physics).
  - **Slide 8 Floating Canvas & Burst Animations**: Emojis and items (🐋 Blue Whales, 🌸 Kirby `kirby.png`, 3.14 `(My birthday btw)`, 🔴 The Color Red, π Pi Symbol, 🎸 Bass) blossom/burst outward from the center into their free-floating anti-gravity coordinates with directional easing and hover effects.
  - **Clean Aesthetic**: Pins/badges and decorative emojis removed for an elegant presentation. Fixed music toggle removed.
- **Stage 5: Decision Slide (`DecisionSlide.tsx`)**:
  - Transitions with a smooth fade-in from Slide 8 (`animate-powerpoint-slow`).
  - Playful evasive "No" button that dodges the cursor across screen bounds before cycling through humorous prompts and allowing a final message.
  - Celebratory canvas confetti on "Yes".
- **Stage 6: Location & Date Picker (`MapLocation.tsx` / `MessageForm.tsx`)**:
  - Interactive Leaflet map centered directly on the **Pasay / Villamor / Newport / Nichols area** with active mouse-wheel scroll zoom enabled.
  - Highly accurate, verified cafes from Google Maps in the Villamor neighborhood (**Café MERGE**, **Cafe Prince**, **Kkopi.tea Villamor**, **Jeonbu Cafe and Tea**, **The Cozy Garage x Bean Hopper Cafe**, **Brew Bottle**, **HOLY SIP!**, **Euno Cafe**, **Saing Cafe**, **Dae Beauty Cafe**, **Pickup Coffee - Andrews Ave**, **Starbucks - Newport World Resorts**).
  - **Dynamic Green Selection**: Selected spot turns vibrant emerald green with an animated pulse ring (`pulse-green-pin`) and auto-focuses the map.
  - **Custom Location Suggestion**: Includes a `"Suggest Another Place"` toggle where the recipient can type any cafe name/vicinity, or simply click/tap anywhere on the map to drop a custom green marker and set their preferred venue.

### 3. Real-Time Convex Live Wiring
- `App.tsx` wrapped in `ConvexProvider` with `ConvexReactClient`.
- `ConfPage.tsx` actively subscribes to `useQuery(api.config.get)`. Any updates made in the admin panel are immediately reflected on active client screens in real time without refreshing.
- `AdminDashboard.tsx` uses Sonner toast notifications (`toast.success` / `toast.error`) for all configuration saves and mutation actions.

### 4. Telemetry System
- Automatically records visitor duration on every screen and slide transition.
- Logged to Convex DB (`viewTimeLogs` table) and locally cached in `localStorage`.
- Admin analytics dashboard aggregates total logs, unique sessions, total view time, average session length, and screen-by-screen breakdown.

---

## 📝 7. Guidelines for Future Maintenance

1. **Obey Design Standards**: Preserve the curated color system (`#8A181A` crimson, deep dark mode, rose accents) and clean typography.
2. **Keep Trap Transitions Intact**: When adding new elements to the Likhani homepage, wrap fine-grained micro-components in `<TrapElement>` with appropriate staggered delays so they tumble dynamically.
3. **Card-Less & Minimalist Principles**: Keep the card-less layout for `LoadingIntro.tsx` and avoid redundant navigation buttons or decorative pin badges.
4. **Live Convex Sync**: Ensure all configuration state changes maintain the `useQuery` / `api.config.save` pipeline with fallback to `defaultConfig.ts`.
5. **Always Verify Builds**: Run `npm run build` after modifying routing, components, or styles to ensure clean TypeScript compilation with zero errors.
