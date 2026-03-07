# Wendigo Corp

Website for the artist Wendigo. Post news updates, learn about events on the calendar, a shop (coming soon) hooked to Shopify, an inquiry tab to get in touch

## Design Style

Early 2000s web portal aesthetic — think PHP-Nuke, GameSpy Arcade, HeavenGames portals. Retro UI with pixel icons, gradient boxes, inset shadows, and bordered panels. Not a parody of that style — it's genuinely built in that style using modern tools.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Database**: PostgreSQL (schema: `wendigo`)
- **Cache**: Redis (with pub/sub)
- **Package Manager**: pnpm
- **Language**: JavaScript (no TypeScript)

## Project Structure

- `app/` — pages and shared components (no `src/` directory)
  - `app/page.js` — Home (news feed)
  - `app/about/page.js` — About page
  - `app/calendar/page.js` — Events calendar
  - `app/shop/page.js` — Shop with product modal
  - `app/jobs/page.js` — Job listings
  - `app/styles.js` — shared Tailwind class constants (`box`, `smallBox`, `insetShadow`, `dropShadow`)
  - `app/theme.js` — dark mode toggle (CSS `filter: invert(1)`)
  - `app/link.js` — custom Link component with active state styling
  - `app/globals.css` — base styles, font (Tahoma), dark mode filter
- `lib/` — backend utilities
  - `lib/sql.js` — Postgres client
  - `lib/redis.js` — Redis client/pub/sub
- `public/icons/` — 32px pixel icons
- `public/icons/small/` — 16px pixel icons
