# Valentino Amatsaleh — Portfolio (static build)

This is a vanilla HTML/CSS/JS export of the Lovable portfolio, ready to host on
GitHub Pages.

## Before you deploy: swap in your real photos and hero video

Placeholder images have been generated so every page renders correctly out of
the box, but you'll want to replace them with your real photos (and add the
real hero video) before going live:

| Path | What it should be |
|---|---|
| `img/navbar-logo.jpeg` | Your small circular nav logo |
| `img/profile.JPG` | About page portrait |
| `img/contact-profile.jpeg` | Contact page portrait |
| `img/manga-panel-1.png` through `img/manga-panel-5.png` | The 5 manga-style intro panels on the About page |
| `img/project-studie4su-thumbnail.png` | Work page thumbnail for Studie4SU |
| `img/project-inventory-management-thumbnail.png` | Work page thumbnail for Inventory Management System v2 |
| `img/project-innovation-vs-insects-thumbnail.png` | Work page thumbnail for Innovation VS Insects |
| `img/project-portfolio-website-thumbnail.png` | Work page thumbnail for this Portfolio Website |
| `img/hero-scroll-video-placeholder.mp4` | The Home page's scroll-driven hero video (see below) |

**To add them:**
1. Save your image/video with the exact filename from the table above
   (kebab-case, as shown).
2. Drop it into this project's `img/` folder, overwriting the placeholder.
3. Re-open `index.html`, `about.html`, `work.html`, and `contact.html` locally
   to confirm everything loads — then push to GitHub.

## Home page: scroll-driven hero video

The Home page hero is a tall (`400vh`) section that stays pinned to the
viewport (via CSS `position: sticky`) while the user scrolls through it. As
they scroll:

- The hero `<video>` is scrubbed frame-by-frame to match scroll position —
  it never autoplays, playback is entirely driven by scroll (`js/main.js`,
  `initScrollHero`, sets `video.currentTime` on every scroll tick).
- The overlay headline types itself out character-by-character, in sync with
  the same scroll progress, cycling through five short lines.
- Once the section has been fully scrolled through, the page continues
  scrolling normally into the rest of the site.
- If the visitor has "reduce motion" turned on at the OS level, the pinned
  scroll effect and video scrubbing are skipped and a static headline is
  shown instead.

**To swap in your final video:** export a roughly 10-second clip, save it as
`hero-scroll-video-placeholder.mp4`, and drop it into `img/` (overwriting the
placeholder) — no code changes needed. If you'd rather use a different
filename, just update the `src` attribute on the `[data-scroll-hero-video]`
`<video>` element in `index.html`.

## Work page filtering

The Work page shows four playing cards (Hearts, Diamonds, Spades, Clubs).
Clicking any card filters to that category's projects:

- **Hearts** (Front-End) → Studie4SU
- **Diamonds** (Back-End) → Inventory Management System v2
- **Spades** (Full-Stack) → empty state ("No projects here — yet.")
- **Clubs** (Solo Projects) → Innovation VS Insects, Portfolio Website

This is powered by `js/work.js`, which renders each card, listens for clicks
(and Enter/Space for keyboard users) via event delegation on the deck
container, and swaps in the matching project cards — each with a thumbnail,
description, tech badges, and a GitHub link.

## Structure
```
index.html / about.html / work.html / contact.html
css/  → main.css (shared, incl. the home-page scroll-hero styles), work.css, contact.css, about.css
js/   → main.js (shared, incl. the scroll-hero controller), about.js, work.js, contact.js
img/  → your photos + hero video (see above) + img/tech/ (SVG tech icons, already included)
```

## Deploying to GitHub Pages
1. Push this folder's contents to the root of a GitHub repo.
2. Repo Settings → Pages → Source: your default branch, folder `/ (root)`.
3. Your site will be live at `https://<username>.github.io/<repo-name>/`.
