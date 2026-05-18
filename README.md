# Gen AI Summit Asia 2026 — Live Event Check-In Visualization

> "You're not Gen X, not Gen Y — You're Gen AI"
> 8–9 August 2026 · MITEC Kuala Lumpur, Malaysia · Capacity: 3,000

A real-time event check-in system with animated robot avatars on a 1920×1080 LED display. Built with Next.js 16, PixiJS, Supabase Realtime, and DiceBear.

---

## Pages

| Route | Purpose | Device |
|-------|---------|--------|
| `/kiosk` | Attendee check-in form | iPad landscape (touch) |
| `/display` | Live robot visualization | LED screen / 4K display |
| `/admin` | Dashboard, stats, controls | Laptop browser |

---

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier works)
- (Optional) [Vercel CLI](https://vercel.com/cli) for deployment

---

## Environment Variables

Create `.env.local` (copy from `.env.example`):

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API → `anon` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API → `service_role` key |

> **Security**: `SUPABASE_SERVICE_ROLE_KEY` is only used in server-side API routes. Never expose it to the browser.

---

## Supabase Setup

### 1. Run the migration

In the Supabase dashboard → SQL Editor, paste and run the contents of:

```
supabase/migrations/001_initial.sql
```

This creates the `attendees` and `events` tables, enables Realtime, and sets up RLS policies.

### 2. Seed initial data

Run the seed file to create the event row + 20 pre-loaded dummy attendees so the display is never empty:

```
supabase/seed.sql
```

### 3. Enable Realtime (if not already)

In Supabase dashboard → Database → Replication → Supabase Realtime → ensure `attendees` table is enabled.

---

## Local Development

```bash
npm install
npm run dev
```

Open:
- [http://localhost:3000/kiosk](http://localhost:3000/kiosk) — Check-in form
- [http://localhost:3000/display](http://localhost:3000/display) — Live visualization
- [http://localhost:3000/admin](http://localhost:3000/admin) — Admin dashboard

> **Note**: WakeLock API only works on HTTPS (production). No effect on localhost.

### Testing the full flow

1. Open `/display` in one browser window
2. Open `/kiosk` in another
3. Submit a check-in on kiosk
4. Watch the robot appear on `/display` within ~1 second (Supabase Realtime)

---

## Swapping Assets

### Logo (`public/images/logo.svg`)
Replace with the official Gen AI Summit Asia 2026 logo. Max height **60px** for the top bar. SVG preferred (scales to 4K). Referenced in `src/components/display/TopBar.tsx`.

### MITEC Hall Background (`public/images/mitec-bg.svg`)
Replace with the actual isometric MITEC Kuala Lumpur hall illustration. Target: **1920×900px viewBox**. After replacing:
1. Update `FLOOR_BOUNDS` in `src/lib/pixi/WaypointSystem.ts` to match the walkable floor area in your illustration.
2. Update the `waypoints` array in the same file to place robots in realistic positions on the actual floor.

### Check-in Sound (`public/sounds/checkin.mp3`)
Replace with a short (0.4–1.5s) friendly chime. Configured in `src/lib/sound.ts`.

---

## Deployment (Vercel)

```bash
npx vercel --prod
```

Set these environment variables in the Vercel dashboard (Project → Settings → Environment Variables):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Recommended region**: Singapore (`sin1`) for lowest latency to Malaysia.

---

## Chrome Kiosk Setup (LED Display PC)

For the main event hall screen running `/display`:

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  "https://your-vercel-url.vercel.app/display"

# Windows
chrome.exe --kiosk --noerrdialogs "https://your-vercel-url.vercel.app/display"
```

The display page:
- Hides the cursor
- Prevents scrolling
- Auto-scales to fill any screen (1080p, 4K)
- Requests WakeLock to prevent screen sleep
- Runs forever — no manual refresh needed

For the kiosk tablet (iPad):
- Use **Safari** or **Chrome** in Guided Access mode (Settings → Accessibility → Guided Access)
- Navigate to `https://your-vercel-url.vercel.app/kiosk`

---

## Architecture Notes

### PixiJS + React Integration
Robot positions are **never stored in React state** — they live entirely inside PixiJS sprites mutated by the ticker loop. React only owns: total count, latest arrival, and UI text. This allows 250+ animated sprites at 60fps without React re-renders.

### Realtime Flow
```
Kiosk form submit
  → POST /api/checkin (server validates + inserts)
  → Supabase fires Realtime INSERT event
  → /display useRealtimeAttendees hook receives payload
  → RobotManager.addAttendee() spawns sprite + entrance animation
  → JoinToast + TickerBar update
```

### Offline Queue
If the kiosk loses network, check-ins are stored in `localStorage` under `kiosk_offline_queue`. They auto-sync when connectivity returns via `window.addEventListener('online')`.

### Dummy Generator
The `/display` page runs a `setInterval` that POSTs to `/api/dummy/generate` every 5 minutes (default) to keep the floor looking populated. Toggle and tune this from `/admin` — settings persist in `localStorage('dummy_config')` and are read by `/display` on mount.

### 250-Robot Threshold
When active sprites exceed 250, the oldest are demoted to small static dots (cluster dots) shown in the background. A "+N more Gen AI" label appears. To raise the threshold: switch from `pixi.js Text` to `BitmapText` for name pills (pre-rasterised font atlas) which can push to 500+ sprites.

---

## Character Sprite Pool

Avatars are served from a local sprite pool. Placeholder SVGs are included — swap them for real artwork before the event.

### Directory layout

```
public/
  characters/
    male/
      male_01.svg   ← placeholder; replace with male_01.png
      …
      male_10.svg
    female/
      female_01.svg ← placeholder; replace with female_01.png
      …
      female_10.svg
```

### Sprite specification

| Property | Value |
|----------|-------|
| Size | 512 × 512 px |
| Format | Transparent PNG (preferred) or SVG |
| Style | Full-body standing adult, stylized / semi-realistic |
| Attire | Smart-casual — jacket or blazer, tech-conference appropriate |
| Background | Fully transparent |

### Recommended sources

- **Freepik** — search "business character illustration transparent PNG"
- **Ready Player Me** (`readyplayer.me`) — export full-body PNG at 512 px
- **Midjourney prompt** — `full body standing adult [male/female] character, smart casual attire, stylized 3D, transparent background, front view, no shadow --ar 1:1 --v 6`

### Swapping placeholders for real sprites

1. Drop PNGs into `public/characters/male/` and `public/characters/female/` named `male_01.png` … `male_10.png` (and `female_`).
2. Open [`src/lib/character-pool.ts`](src/lib/character-pool.ts) and change `.svg` → `.png` in the two `Array.from` calls.
3. Run `npm run build` to verify no asset errors.

### Expanding beyond 10 per gender

1. Add `male_11.png`, `male_12.png`, … to the folder.
2. In `character-pool.ts`, increase `Array.from({ length: 10 }, …)` to match.
3. Existing attendees keep their assigned character as long as you only append files (never reorder).

### Database migration

Run [`supabase/migrations/004_character_id.sql`](supabase/migrations/004_character_id.sql) in the Supabase dashboard SQL Editor:

```sql
ALTER TABLE attendees ADD COLUMN IF NOT EXISTS character_id integer;
```

---

## Brand Tokens

Defined in `tailwind.config.ts` under `theme.extend.colors.brand`:

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-orange` | `#FF4F00` | Primary accent, buttons, robot tint |
| `brand-black` | `#0A0A0A` | Background |
| `brand-white` | `#FAFAFA` | Text |
| `brand-gold` | `#FFB800` | Secondary accent, welcome-back glow |
| `brand-cyan` | `#00E5FF` | AI/tech glow, entrance effects |

---

## File Map (Key Files)

```
src/lib/character-pool.ts      — Sprite pool paths + deterministic character assignment
src/lib/pixi/RobotManager.ts   — preloadCharacters(), 250 threshold, ticker loop
src/lib/pixi/RobotSprite.ts    — One character: avatar sprite + name pill + bob motion
src/lib/pixi/EntranceEffect.ts — Orange radial pulse + spark particles on arrival
src/lib/pixi/WaypointSystem.ts — Floor waypoints (UPDATE after bg swap)
src/lib/dummy-names.ts         — ~80 pan-Asian names (easy to edit)
src/hooks/useRealtimeAttendees — Supabase Realtime subscription
src/app/api/checkin/route.ts   — Trust boundary for all check-ins
public/characters/             — Sprite image files (male_01–10, female_01–10)
```
