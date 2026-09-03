# Movizo — Anime & Movie Streaming UI (frontend only)

A fully static, mock-data streaming platform UI called **Movizo**: 18 user-facing pages, a 6-page admin panel, and a 4-page super-admin panel, all sharing one dark forest-green + cyan design system. No backend, no real auth, no real video playback.

## Design system

- Background ramp: `#0d1210` → `#1a2420` (deep forest green-black), elevated cards slightly lighter.
- Accent: cyan-teal `#2DD4CF` for primary buttons, active nav, focus rings, glows.
- Yellow `#FFD54F` for star ratings, orange-red `#FF6B35` for trending/fire badges, red for destructive actions.
- Text: white headings, `#B0B8B5` body.
- Bold geometric display font for logo/headings, clean sans for body (loaded via a font `<link>` in the root route).
- Cards: 8–12px radius, hover scale + cyan glow, play-icon overlay.
- Motion: smooth hover/entry transitions, shimmer skeletons.
- Responsive across desktop / tablet / mobile.

## Shared components

Navbar (transparent over hero, solid on scroll, mobile drawer), footer, admin sidebar (collapsible, icon + label), poster card, hero carousel, horizontal scroll row with arrows, progress bar, modal, button variants (primary / secondary / danger / ghost), input, select, toast, card skeleton, badges (rating, episode count, trending), filter sidebar, data table, stat card, chart placeholders.

## Pages

**User-facing (1–18):** Home (hero carousel + Trending / New Releases / Top Rated / Continue Watching rows), Browse, Series, Movies, Genres, Search results with live filtering and empty state, Anime detail (banner, synopsis, episode list, similar row), Video player mockup with control bar and episode sidebar, My List, Profile, Settings, Login, Signup, Forgot password, About, Contact, FAQ accordion, 404.

**Admin (19–24):** Admin login, dashboard with stat cards and chart placeholders, content management table with "Add New Content" modal, genre management, user management, reports/moderation.

**Super admin (25–28):** Super admin dashboard (admins, system health, storage), admin account management, site settings (branding, feature toggles, maintenance mode), audit logs.

## Data & images

One mock data module with ~30 titles (mix of series and movies), episodes, genres, users, admins, audit entries, reports, and stats. Posters and banners use Lorem Picsum seeded URLs so every card has a stable image. Interactions (My List add/remove, filters, search, form submits, admin CRUD, toggles) update local React state only and show toasts — nothing persists to a server.

## Technical notes

- TanStack Router file routes: user pages at `/`, `/browse`, `/series`, `/movies`, `/genres`, `/search`, `/title/$id`, `/watch/$id`, `/my-list`, `/profile`, `/settings`, `/login`, `/signup`, `/forgot-password`, `/about`, `/contact`, `/faq`; admin under `/admin/*`; super admin under `/super-admin/*`. 404 handled by the root not-found component.
- Two layout routes: user shell (navbar + footer) and admin shell (sidebar + topbar), so the admin panel has its own chrome.
- All tokens defined in `src/styles.css` under `@theme inline` / `:root` in oklch; no hardcoded color utilities in components.
- Each route gets its own `head()` with a unique Movizo title, description, and OG tags.
- shadcn/ui primitives restyled to the Movizo palette rather than default styling.
