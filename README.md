# Valentino Amatsaleh — Portfolio Website

A vanilla HTML/CSS/JavaScript personal portfolio website built as a university assignment — no frameworks, no build step, no dependencies. Just static files, ready to host on GitHub Pages.

**Pages:** `index.html` (Home) · `about.html` (About) · `work.html` (Work) · `contact.html` (Contact)

---

## Overview

The site is built around a light, paper-like design system (warm off-white background, serif display type paired with Inter, soft shadows and glassmorphism panels) and leans into a few larger interactive set-pieces rather than being a plain scrolling brochure:

- A **scroll-scrubbed hero video** on the Home page.
- A **manga-panel intro** that transitions into an animated, clickable **skill tree** on the About page.
- A **suit-based playing-card deck** for browsing projects on the Work page — with a hidden **Joker card** easter egg.
- An **animated multi-language terminal** and parallax portrait on the Contact page.

---

## Page-by-Page Breakdown

### Home (`index.html`)
- **Scroll Hero:** a `400vh` section pinned to the viewport (`position: sticky`) while the user scrolls. A background video is scrubbed frame-by-frame to match scroll progress (it never autoplays — it's 100% scroll-driven), while an overlay headline types itself out in sync with the same scroll progress, cycling through five short intro lines. Both the video seek and the typing animation are frame-rate-independent (`requestAnimationFrame` + exponential smoothing) so fast or janky scrolling doesn't cause frame-skipping. If the visitor has OS-level "reduce motion" enabled, the pinned effect is skipped in favor of a static headline.
- **Currently / Skills / Experience / Selected Work / Certifications** sections, each revealed with a scroll-triggered fade-and-rise animation (`.reveal` + `IntersectionObserver`).

### About (`about.html`)
- **Manga hero intro:** a full-screen, click-through (or keyboard-driven) five-panel comic sequence that plays before the page content is shown, with a skip button and a fade-out transition into the page.
- **Interactive skill tree:** a roots → trunk → branches → leaves visual metaphor for the author's education, university, technical skills, and experience. Nodes animate in via `IntersectionObserver`, and clicking a node opens a detail card (education/skills) or, for "leaf" nodes, navigates straight to the Work page.
- Contains a **hidden node** in the skill tree (glitch-styled text, invisible until hovered/focused) as a secondary riddle — separate from the Joker easter egg described below.
- **Values grid** with hover-swap imagery (text fades out, a photo fades in on hover).

### Work (`work.html`)
- **Playing-card deck:** four suit cards (Hearts, Diamonds, Spades, Clubs) are dealt onto the screen with a staggered animation. Each card represents a role played on a project:
  - ♥ **Hearts** — Front-End Development
  - ♦ **Diamonds** — Back-End Development
  - ♠ **Spades** — Full-Stack Development
  - ♣ **Clubs** — Solo Project / Creator
- Hovering (or focusing) a card flips it to reveal its meaning; clicking swaps the deck view for a filtered list of matching projects, each with a thumbnail, description, tech badges, and a GitHub link.
- **🃏 Hidden Joker card easter egg** — see below.

### Contact (`contact.html`)
- **Animated terminal:** a fake code editor that "types" and "deletes" short snippets in rotating languages (Python, JavaScript, Java, Lua), each styled with basic syntax highlighting.
- **Parallax portrait:** the contact photo subtly shifts position based on mouse movement.
- **Contact form:** client-side validation (name, email format, subject, message length) submitting to [Formspree](https://formspree.io/), with inline error messages and a success confirmation.
- Contact cards linking to email, LinkedIn, and GitHub, plus a location card.

---

## 🃏 Hidden Easter Egg: The Joker Card

The Work page hides a secret fifth card — the **Joker** — behind a tiny interactive detail in the page heading.

**How to find it:**
1. Go to the **Work** page.
2. Look at the heading: *"Pick a suit, see the projects I built with it."*
3. The **period at the very end of that sentence** is secretly clickable (`.hero-easter-egg` on the trailing `.`).
4. Click it — a full-screen overlay fades in with the message **"Ha, you found me!"** and reveals the Joker card.
5. Click the Joker card itself to flip past the suit deck entirely and open a bonus **Hobbies & Sports** view, listing things like swimming, taekwondo, gaming, and anime. Use the **"Back to all suits"** button to return to the deck.
6. You can also close the overlay without clicking the card via the **×** button or by clicking outside the card.

There's also a **console message easter egg** — open your browser's DevTools console on any page to find a small hidden note about the Joker.

*(As a bonus, the About page's skill tree also hides one extra glitch-text node among the "leaf" experience nodes — it's invisible until you hover or tab-focus it.)*

---

## Project Structure

valthevisionary.github.io/
├── index.html # Home
├── about.html # About
├── work.html # Work / Projects
├── contact.html # Contact
├── css/
│ ├── main.css # Design tokens, reset, nav, footer, layout, scroll-hero, buttons, cards
│ ├── about.css # Manga hero intro + skill tree
│ ├── work.css # Playing-card deck, suit views, joker overlay, hobbies view
│ └── contact.css # Contact hero split, terminal, contact cards, form
├── js/
│ ├── main.js # Nav scroll/toggle state, active link, reveal-on-scroll, scroll-hero controller
│ ├── about.js # Manga hero sequencing + skill tree interactivity
│ ├── work.js # Card deck rendering, suit filtering, joker/hobbies easter egg
│ └── contact.js # Terminal typewriter, portrait parallax, form validation
└── img/
├── tech/ # SVG tech-stack icons (HTML, CSS, JS, Java, MySQL, Git, GitHub, Figma, Node.js, Express, Prisma, Claude, ChatGPT, VS Code, LinkedIn)
├── manga-panel-1.png … 5.png # About page intro panels
├── portfolio-.png/.webp/.avif # Work thumbnails, values-section hover imagery
├── project--thumbnail.png # Reserved project thumbnails
├── joker-icon.svg # Joker card artwork
└── ... # Profile photos, nav logo, hero video


---

## Getting Started

This is a fully static site — no build tools, package manager, or dependencies required.

1. Clone or download the repository.
2. Open `index.html` directly in a browser, **or** serve the folder with any static file server (e.g. `npx serve`, VS Code "Live Server") for the best experience with routing/relative paths.

---

## Tech Stack

| Category | Tools |
|---|---|
| Languages | HTML, CSS, vanilla JavaScript (ES5/ES6, no build step) |
| Fonts | [Fraunces](https://fonts.google.com/specimen/Fraunces) & [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |
| Forms | [Formspree](https://formspree.io/) for contact form handling |
| Hosting | GitHub Pages |

No frameworks, bundlers, or npm dependencies — everything runs directly in the browser using standard Web APIs (`IntersectionObserver`, `requestAnimationFrame`, the Fetch API for form submission).

---

## About the Author

Valentino Amatsaleh is a Software Engineering student at the University of Applied Sciences and Technology Suriname, building real-world applications and steadily growing his skills across the full stack.

- **GitHub:** [ValTheVisionary](https://github.com/ValTheVisionary)
- **LinkedIn:** [valentino-amatsaleh](https://www.linkedin.com/in/valentino-amatsaleh)
- **Email:** valentino.amatsaleh@gmail.com

---

## License

This project is a personal portfolio built for academic purposes. Feel free to reference the code structure, but please don't reuse personal content, photos, or copy as your own.