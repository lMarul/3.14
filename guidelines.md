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
   - **Confession Interactive Deck**: Includes card-less security verification check, identity quiz with strict answer gates, PowerPoint-style slides deck with reveal gate & calibrated subtle burst physics, smooth fade to decision question, playful evasive "No" button, coffee date picker with quick date/time chips & outfit color coordination, interactive map, and celebration confetti.

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
│   ├── schema.ts                        # Tables: appConfig, analytics / viewTimeLogs, responses
│   ├── analytics.ts                     # Telemetry logging & summary math queries/mutations
│   ├── config.ts                        # App configuration (passcode, slides, recipient) queries/mutations
│   └── responses.ts                     # Confession responses CRUD queries/mutations
└── APC_2025_2026_T1-MERGE_CONFLICT-SOMA-VERGE-LIKHANI/
    └── SOMA_Likhani/                    # Primary Application Codebase
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
        │       │   ├── ConfAdminPage.tsx# In-App Admin Login Gate & Data Sync (/conf-admin)
        │       │   ├── AdminDashboard.tsx# In-App Admin Panel (Sonner toasts, Analytics, Responses, Quiz, Slides, Config)
        │       │   ├── LoadingIntro.tsx # Card-less full-screen security verification loading screen
        │       │   ├── QuizViewer.tsx   # Interactive identity quiz deck with "wrong means no proceed" gate
        │       │   ├── CongratsScreen.tsx # Transition congratulations screen
        │       │   ├── SlideViewer.tsx  # PowerPoint-style slide deck with reveal gate & Slide 8 subtle floating physics
        │       │   ├── DecisionSlide.tsx# Decision question with fade transition & evasive No button
        │       │   ├── MapLocation.tsx  # Pasay/Villamor Leaflet map, quick date/time chips, outfit color picker & ticket
        │       │   ├── MessageForm.tsx  # Response submission fallback form
        │       │   ├── defaultConfig.ts # Fallback app configuration and initial deck data
        │       │   ├── telemetry.ts     # Client telemetry logging, localStorage caching & summary math
        │       │   ├── types.ts         # TypeScript definitions for slides, quiz, responses, and config
        │       │   └── conf.css         # Confession design tokens, burst animations & floating keyframes
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
  - **Tabs & Capabilities**:
    - **RESPONSES**: Complete confession responses log with summary cards (Total Responses, "Said YES 💖", "Said NO 💔").
      - Inspects choices, preferred dates, preferred times, chosen venue name, outfit color feeling, and personal messages.
      - Full manual entry CRUD (Create new response, Edit existing response, Delete response, and Refresh from Convex).
    - **ANALYTICS (View Time Telemetry & Session Inspector)**:
      - **View Mode Switcher**: Toggle between **"Grouped by Session"** (Visitor Journey Inspector) and **"Global Averages"** (consolidated metrics).
      - **4 Key Metrics**: Total Visitors / Sessions, Total View Time (minutes & seconds), Average Session Length (seconds), and Total Telemetry Events.
      - **User Session Inspector (Grouped by Session)**:
        - Lists unique visitor journeys sorted by most recent activity with relative time-ago format (`3m ago`, `1h ago`, `Yesterday`).
        - Persistent Visitor ID (`vis_...`) and Ephemeral Session ID (`sess_...`) tracking badges.
        - Device & OS badge with icons (`Mobile` with `Smartphone`, `Tablet` with `Tablet`, `Desktop` with `Monitor`), OS (`iOS`, `Android`, `macOS`, `Windows`, `Linux`), browser (`Safari`, `Chrome`, `Firefox`, `Edge`), and screen resolution.
        - Non-intrusive passive location badge (`Pasay, Metro Manila, PH`) and IP address.
        - Terminal outcome badge (`Answered YES 💖`, `Answered NO 💔`, `Reached Decision ☕`, `Viewing Slides`, `On Quiz`, `Bounced on Intro`).
        - Master-Detail expandable audit trail showing step-by-step screen breakdown, duration per step with proportional duration bars, and timestamps.
        - Interactive search bar and filter pills by Device (`All`, `Mobile`, `Tablet`, `Desktop`) and Outcome (`All`, `YES`, `NO`, `Decision`, `Bounced`).
      - **Global Averages View**:
        - Screen & Slide View Duration Breakdown with horizontal progress bars.
        - Raw Telemetry Entry Log table with Session ID, Device/Location, Screen, Duration, and Start Time.
      - **Management Actions**: Real-time "Refresh Telemetry" and "Clear Telemetry Logs" controls with safe confirmation.
    - **QUIZ**: Interactive quiz question CRUD editor (edit Quiz Header Title, add/edit/delete questions, configure 4 choices, set correct answer index, and customize reaction comments for correct and incorrect selections).
    - **SLIDES**: PowerPoint slide deck CRUD editor (add, edit, reorder using Move Up / Move Down, and delete slides with custom titles, subtitles, quotes, icons, and contents).
    - **CONFIG**: Live updating of recipient name, sender name, confession question prompt, coffee shop coordinates and details, evasive "No" button setting, and admin passcode with Sonner toast feedback.

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
- **Stage 2: Verification Quiz (`QuizViewer.tsx`)**:
  - Customized interactive questions validating identity.
  - **"Wrong Means No Proceed" Gate**: The Next/Proceed button remains locked and disabled (`disabled={!isCorrect}`, `opacity-40 cursor-not-allowed grayscale pointer-events-none`) until the recipient selects the verified correct answer.
  - **Dynamic Reaction Feedback**: Displays custom per-option reaction comments (`optionComments`, `correctComment`, `wrongComment`) with a pulsing warning indicator (`⚠️ Please pick the correct answer to proceed`) when an incorrect option is chosen.
- **Stage 3: Congrats Screen (`CongratsScreen.tsx`)**: Smooth transition confirmation heading into the confession message deck.
- **Stage 4: Slide Viewer (`SlideViewer.tsx`)**:
  - **Reveal Gate (Slide 1)**: "Next Message" button, keyboard shortcuts, and swipe navigation remain locked until the user clicks "Click to Reveal" (`#8A181A` crimson button).
  - **Slide 8 Floating Canvas & Subtle Physics**: Emojis and items (Blue Whales 🐋, Kirby 💖, 3.14, The Color Red 🔴, Pi Symbol π, Bass Guitar 🎸) blossom outward from the center into free-floating anti-gravity coordinates with calibrated subtle floating keyframe physics (`floatSubtle1` 5.5s, `floatSubtle2` 6.5s, `floatSubtle3` 5.0s) for an elegant, non-jarring floating experience.
  - **3.14 Birthday Subtext**: Displays `3.14` with the clean subtext `(My birthday btw)`.
  - **Clean Aesthetic**: Pins/badges and decorative emojis removed for an elegant presentation. Fixed music toggle removed.
- **Stage 5: Decision Slide (`DecisionSlide.tsx`)**:
  - Transitions with a smooth fade-in from Slide 8 (`animate-powerpoint-slow`).
  - Playful evasive "No" button that dodges the cursor across screen bounds before cycling through humorous prompts and allowing a final message.
  - Celebratory canvas confetti on "Yes".
- **Stage 6: Location, Date & Time Picker, Outfit Coordination (`MapLocation.tsx`)**:
  - **Interactive Leaflet Map**: Enlarged map viewport (up to `430px` height) centered directly on the **Pasay / Villamor / Newport / Nichols area** with active mouse-wheel scroll zoom enabled.
  - **Verified Cafes**: Highly accurate, verified cafes in the Villamor neighborhood (**Café MERGE**, **Cafe Prince**, **Kkopi.tea Villamor**, **Jeonbu Cafe and Tea**, **The Cozy Garage x Bean Hopper Cafe**, **Brew Bottle**, **HOLY SIP!**, **Euno Cafe**, **Saing Cafe**, **Dae Beauty Cafe**, **Pickup Coffee - Andrews Ave**, **Starbucks - Newport World Resorts**).
  - **Dynamic Green Selection**: Selected spot turns vibrant emerald green with an animated pulse ring (`pulse-green-pin`) and auto-focuses the map.
  - **Default Suggestion Badge**: Highlights the sender's top recommendation with a `★ My Suggestion` badge.
  - **Custom Location Suggestion**: Includes a `"Suggest another place"` collapsible drawer where the recipient can select other nearby cafes, type a custom cafe name & vicinity, or click/tap anywhere on the map to drop a custom pin.
  - **Designed Quick Date Picker**:
    - One-click date chips: `Tomorrow`, `In 2 Days` / `Saturday`, `This Saturday`, `This Sunday` with dynamic relative date calculations and calendar subtext.
    - Native `<input type="date">` picker with `min` restriction to prevent past date selection.
  - **Designed Quick Time Preset Chips**:
    - 5 meeting time chips: `10:30 AM (Morning ☕)`, `12:30 PM (Lunch 🥐)`, `02:30 PM (Afternoon ✨)`, `04:30 PM (Sunset 🌅)`, `06:30 PM (Evening 🌙)`.
    - Native `<input type="time">` picker for custom time selections.
  - **"What color are you feeling?" (Outfit / Color to Wear)**:
    - 8 classic crayon-box color chips (`Red #E53E3E`, `Yellow #FACC15`, `Blue #2563EB`, `Green #16A34A`, `Orange #EA580C`, `Purple #9333EA`, `Brown #854D0E`, `Black #1F242D`) with colored checkmarks and circular swatches.
    - Custom write-in text field for custom palettes (e.g. Lavender, Sky Blue, Matcha Green).
  - **Invitation Ticket View**: Once confirmed, renders a structured confirmation receipt displaying From, To, Date, Time, Location, Color to Wear (with a colored circular swatch), Address, and Note, with a "Change Date / Time / Color / Note" edit toggle.

### 3. Real-Time Convex Live Wiring & Synchronization
- `App.tsx` wrapped in `ConvexProvider` with `ConvexReactClient`.
- `ConfPage.tsx` actively subscribes to `useQuery(api.config.get)`. Any updates made in the admin panel are immediately reflected on active client screens in real time without refreshing.
- `AdminDashboard.tsx` uses Sonner toast notifications (`toast.success` / `toast.error`) for all configuration saves and mutation actions.

### 4. Telemetry System & Analytics Architecture
- **Per-User / Per-Session Separation**:
  - `visitorId`: Persistent across browser reopens, stored in `localStorage` under `conf_visitor_id` (`vis_<random>_<timestamp>`).
  - `sessionId`: Ephemeral to the active tab/visit, stored in `sessionStorage` under `conf_session_id` (`sess_<random>_<timestamp>`).
- **Device & Platform Fingerprinting**:
  - Automatically parses `navigator.userAgent`, `navigator.maxTouchPoints`, and display dimensions:
    - `deviceType`: `"Mobile"` | `"Tablet"` | `"Desktop"` (accurately detects iPadOS on MacIntel touch devices, phones, and tablets).
    - `os`: `"iOS"`, `"Android"`, `"macOS"`, `"Windows"`, `"Linux"`, `"Chrome OS"`.
    - `browser`: `"Safari"`, `"Chrome"`, `"Firefox"`, `"Edge"`, `"Opera"`.
    - `screenResolution`: `${window.screen.width}x${window.screen.height}`.
    - `viewport`: `${window.innerWidth}x${window.innerHeight}`.
- **Passive Non-Intrusive Location Logging**:
  - **Zero Browser Permission Dialogs**: Never invokes `navigator.geolocation.getCurrentPosition()`, keeping the disguise trap 100% authentic and stealthy.
  - Lightweight client-side IP-lookup via `https://freeipapi.com/api/json` (with automatic fallback to `https://ipapi.co/json/`).
  - Captures: `city`, `region`, `country`, and optional `ip` / `timezone`.
  - Cached in `sessionStorage` (`conf_geo_location`) on first lookup to prevent redundant network calls during rapid screen transitions.
  - **Strict Silent Failure**: Uses a 2.5-second `AbortController` timeout; if blocked by ad-blockers or network failure, defaults silently to `"Unknown"` without interrupting the user experience.
- **Transition Logging**: Automatically calculates and records view duration on every screen switch, slide advance/retreat, quiz step, and page unload (`beforeunload`).
- **Dual-Storage Resilience**:
  - Real-time logging to Convex DB (`viewTimeLogs` / `analytics` table via `api.analytics.logViewTime`).
  - Redundant local caching in `localStorage` (`conf_app_telemetry_logs`, capped at 1,000 recent records).
- **Admin Analytics Engine**: Aggregates total logs, unique visitor sessions, total view time (in seconds/minutes), average session duration, and screen-by-screen breakdown. Falls back automatically to client-side math if Convex is unreachable.

### 5. Convex Database Schemas

#### 1. `responses` Table
- `choice`: string (`"YES"` or `"NO"`)
- `preferredDate`: optional string | null
- `preferredTime`: optional string | null
- `message`: optional string | null (contains structured metadata tags: `[Location: ...] [Color to wear: ...]`)
- `createdAt`: string (ISO 8601)
- `userAgent`: optional string

#### 2. `appConfig` Table
- `recipientName`: string
- `senderName`: string
- `questionText`: string
- `quizTitle`: optional string
- `quizQuestions`: array of `QuizQuestion` objects (question, options, correctIndex, correctComment, wrongComment, optionComments)
- `coffeeLocation`: `CoffeeLocation` object (name, address, lat, lng, googleMapsUrl, note)
- `slides`: array of `Slide` objects (id, title, subtitle, content, quote, iconName, etc.)
- `evasiveNoButton`: boolean
- `adminPasscode`: string
- `updatedAt`: string (ISO 8601)

#### 3. `viewTimeLogs` / `analytics` Table
- `sessionId`: string (indexed by `by_session`)
- `visitorId`: optional string (indexed by `by_visitor`)
- `screen`: string (e.g. `INTRO`, `QUIZ (Question 1)`, `SLIDE 1`, `YES_MAP`)
- `slideIndex`: optional number
- `durationSeconds`: number
- `startTime`: string (ISO 8601)
- `endTime`: string (ISO 8601)
- **Device & Environment**:
  - `deviceType`: optional string (`"Mobile"` | `"Tablet"` | `"Desktop"`)
  - `os`: optional string
  - `browser`: optional string
  - `screenResolution`: optional string
  - `viewport`: optional string
- **Location Data**:
  - `city`: optional string
  - `region`: optional string
  - `country`: optional string
  - `ip`: optional string
  - `userAgent`: optional string

---

## 📝 7. Guidelines for Future Maintenance & Git Workflow

1. **Obey Design Standards**: Preserve the curated color system (`#8A181A` crimson, deep dark mode, rose accents) and clean typography (`font-poppins`, `font-mono`).
2. **Keep Trap Transitions Intact**: When adding new elements to the Likhani homepage, wrap fine-grained micro-components in `<TrapElement>` with appropriate staggered delays so they tumble dynamically.
3. **Card-Less & Minimalist Principles**: Keep the card-less layout for `LoadingIntro.tsx` and avoid redundant navigation buttons or decorative pin badges.
4. **Live Convex Sync**: Ensure all configuration state changes maintain the `useQuery` / `api.config.save` pipeline with fallback to `defaultConfig.ts`.
5. **Git Branching & PR Best Practices**:
   - Create focused feature branches (e.g. `feature/updated-admin-logs`).
   - Maintain the single source of truth in root `guidelines.md` whenever architecture or specifications change.
6. **Always Verify Builds**: Run `npm run build` after modifying routing, components, or styles to ensure clean TypeScript compilation with zero errors.
