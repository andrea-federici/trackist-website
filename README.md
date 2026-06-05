# Trackist — Marketing Website

A single-page landing site for **Trackist**, the iOS training diary for competitive
track-and-field athletes. It is a static site (plain HTML + inline CSS, no build step,
no dependencies, no tracking) styled with the app's **Lane Design System**
(see `../iOS/docs/DESIGN.md`).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The one-page landing site (hero, problem, features, screenshots, how-it-works, credibility, coming-later, CTA). |
| `support.html` | Support / contact page. |
| `privacy.html` | Privacy policy. |
| `assets/` | Brand logos + screenshot slots. |

## Running it

No build needed — open `index.html` in a browser, or serve the folder:

```sh
cd Website
python3 -m http.server 8000
# then open http://localhost:8000
```

## Design system

Colors, type, radius, and tone all mirror `iOS/docs/DESIGN.md` and
`TPLaneDesign.swift`: warm paper canvas (`#F4EFE6`), ink text, soft white cards,
the terracotta accent (`#C8442B`), serif headings, sans controls, and monospaced
numerals. Do not introduce a separate web palette — derive from those tokens.

## Adding real screenshots

The phone mockups on the page are **stylized CSS placeholders**, clearly labeled
"Placeholder". To swap in real App Store screenshots, drop these PNGs into `assets/`:

| File | Screen | Used in |
| --- | --- | --- |
| `assets/screenshot-today.png` | Today | Hero + Screenshots section |
| `assets/screenshot-diary.png` | Diary | Screenshots section |
| `assets/screenshot-log-workout.png` | Log workout / Structured session | Screenshots section |

Recommended export: **1170×2532** (iPhone, 9:19.5 aspect) PNG. Then, in `index.html`,
replace the `.phone-screen` placeholder contents (look for the
`PLACEHOLDER`/`SCREENSHOT SLOT` HTML comments) with, e.g.:

```html
<div class="phone-screen">
  <img src="assets/screenshot-today.png" alt="Trackist Today screen">
</div>
```

The `.phone-screen > img` style already crops to the frame without distorting
aspect ratio.

## Intentional TODOs

- **Waitlist**: there is no backend wired up, so the "Join the waitlist" buttons use a
  `mailto:` link. Replace with a real waitlist endpoint/form when available
  (search `TODO` in `index.html`).
- **Contact email**: `andrea.federici1999@icloud.com` is used as the support / privacy /
  waitlist address. Confirm or swap for a dedicated public address before launch
  (search `TODO` in `support.html` and `privacy.html`).
