# Trackist — Marketing Website

A single-page landing site for **Trackist**, the iOS training diary for competitive
track-and-field athletes. It is a static site (plain HTML + inline CSS, no build step,
no dependencies, no tracking) styled with the app's **Lane Design System**
(see `../iOS/docs/DESIGN.md`).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The one-page landing site (hero, problem, features, weekly recap, screenshots, how-it-works, credibility, coming-later, CTA). |
| `support.html` | Support / contact page. |
| `privacy.html` | Privacy policy. |
| `assets/` | Brand logos and app screenshots. |

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

## App screenshots

The page uses real app screenshots exported with a transparent device frame:

| File | Screen | Used in |
| --- | --- | --- |
| `assets/today.png` | Today + Weekly Recap entry point | Screenshots section |
| `assets/diary.png` | Diary | Hero + Screenshots section |
| `assets/log.png` | Structured track-session logging | Screenshots section |
| `assets/weekly_recap.png` | Generated Weekly Recap detail | Weekly Recap section |

Current exports are **900×1840** PNGs. Keep the same aspect ratio and transparent
device treatment when replacing them.

## Intentional TODOs

- **Waitlist**: there is no backend wired up, so the "Join the waitlist" buttons use a
  `mailto:` link. Replace with a real waitlist endpoint/form when available
  (search `TODO` in `index.html`).
- **Contact email**: `andrea.federici1999@icloud.com` is used as the support / privacy /
  waitlist address. Confirm or swap for a dedicated public address before launch
  (search `TODO` in `support.html` and `privacy.html`).
