# Neon Stream UI

Build a frontend-only UI for a movie/anime streaming platform called "[YOUR APP NAME]". 

This is UI/design only — no backend, no real authentication, no real video 

playback logic. Use mock/dummy data and placeholder images throughout.

DESIGN STYLE:

- Background: Dark muted forest green-black (#0d1210 to #1a2420)

- Accent color: Bright cyan-teal (#2DD4CF / #22D3D3) — used for primary 

  buttons, active states, links, and highlights

- Secondary highlight colors: Yellow (#FFD54F) for ratings/stars, 

  Orange-red (#FF6B35) for trending/fire badges

- Text: White (#FFFFFF) for headings, light gray (#B0B8B5) for body text

- Modern, cinematic, anime-streaming inspired layout (like Crunchyroll/Aniverse)

- Card-based UI with rounded corners (8-12px radius), subtle hover scale 

  and glow effects using the cyan accent

- Clean sans-serif typography for body text, bold geometric font for 

  headings/logo

- Fully responsive (desktop, tablet, mobile)

- Smooth transitions/animations on hover and page load

PAGES TO BUILD:

1. Home Page

   - Top navbar: logo (left), nav links (Home, Series, Movie, Genres), 

     search icon, profile avatar (right)

   - Full-width hero banner with background artwork, title, season/genre/

     year tags, short description, rating badge, episode count badge, 

     trending badge, "Watch Now" (filled cyan) and "My List" (outlined) buttons

   - Carousel navigation arrows (cyan active state) on hero

   - "Trending Anime" row — horizontal scrollable poster cards below hero

   - Additional rows: "New Releases", "Top Rated", "Continue Watching" 

     (with progress bars)

2. Browse/Explore Page

   - Filter sidebar (genre, year, rating, status: ongoing/completed)

   - Grid of poster cards with title, rating, episode count

3. Series Page

   - Same grid layout as Explore, filtered to series only

4. Movie Page

   - Same grid layout, filtered to movies only

5. Genres Page

   - Grid of genre tiles (Action, Romance, Fantasy, Horror, Comedy, Drama, 

     Sci-Fi, Slice of Life) each with background art

6. Search Results Page

   - Search bar with live filter UI, grid results, empty state

7. Anime/Show Detail Page

   - Large banner artwork, title, rating, genre tags, season/episode info, 

     synopsis

   - Episode list (thumbnail, episode number, title, duration)

   - "Similar Anime" recommendation row

   - Watch Now / Add to My List buttons

8. Video Player Page (UI only, no real playback)

   - Player mockup with controls bar (play/pause, seek, volume, quality, 

     subtitles, fullscreen)

   - Episode list sidebar with thumbnails

9. My List / Favourites Page

   - Grid of saved anime, remove button on hover

10. Profile Page

    - Avatar, username, email, watch stats, favourite genres

11. Settings Page

    - Account settings, notification preferences, playback quality, 

      subtitle language, theme toggle

12. Login Page

    - Centered card on dark background, email/password fields, 

      cyan "Login" button, social login options

13. Signup Page

    - Same style, name/email/password/confirm fields

14. Forgot Password Page

    - Simple centered form

15. About Us Page

    - Brand story, mission, team section (placeholder)

16. Contact Us Page

    - Contact form + info

17. FAQ / Help Center Page

    - Accordion-style Q&A

18. 404 Error Page

    - Anime-themed illustration + "Go Home" button (cyan)

ADMIN PANEL (separate layout, dark sidebar, same color scheme):

19. Admin Login Page

    - Minimal, secure-looking login form

20. Admin Dashboard

    - Stats cards (total users, total anime, total views, active streams)

    - Chart placeholders (views over time, popular genres, top anime)

21. Content Management Page

    - Table of all anime/movies with poster thumbnail, edit/delete actions

    - "Add New Content" modal (title, poster upload, description, genre, 

      episode upload placeholder, season info)

22. Category/Genre Management Page

    - Table/list of genres with add/edit/delete

23. User Management Page

    - Table of users with role, status, subscription tier, ban/edit actions

24. Reports/Moderation Page

    - List of flagged content/comments with review actions

SUPER ADMIN PANEL:

25. Super Admin Dashboard

    - Overview of all admins, system health, storage usage cards

26. Admin Account Management Page

    - Table of admin accounts, create/remove/edit permissions

27. Site Settings Page

    - Branding controls (logo, colors), feature toggles, maintenance mode

28. Audit Logs Page

    - Table of all admin actions with timestamp, admin name, action type

COMPONENTS TO REUSE ACROSS PAGES:

- Navbar (user-facing, transparent over hero, solid on scroll)

- Admin sidebar (dark, icon + label nav items, collapsible)

- Anime/Movie poster card (image, title, rating badge, hover glow + 

  play icon overlay)

- Progress bar component (cyan fill, for continue watching)

- Modal/dialog component (dark background, cyan accent border)

- Button variants: primary (filled cyan), secondary (outlined), 

  danger (red), ghost

- Input field component (dark background, cyan focus ring)

- Toast/notification component

- Loading skeleton for cards (subtle shimmer animation)

- Badge components (rating/star, episode count, trending/fire)

Use placeholder anime/movie poster images from Unsplash or Lorem Picsum 

for all thumbnails and banners. Keep all data mock/static in the UI — 

no real backend calls, no real authentication logic.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e779982d-90c3-450b-bef2-fc411a2916ba).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
