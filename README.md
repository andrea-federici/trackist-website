# Trackist — Marketing Website

A single-page landing site for **Trackist**, the iOS training diary for competitive
track-and-field athletes. It is a static site (plain HTML + inline CSS, no build step,
no dependencies, no tracking) styled with the app's **Lane Design System**
(see `../iOS/docs/DESIGN.md`).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The one-page landing site (hero, problem, features, logging, review, weekly recap, records, how-it-works, credibility, CTA). |
| `support.html` | Support / contact page. |
| `terms.html` | Terms of use and AI disclosure. |
| `privacy.html` | Privacy policy. |
| `assets/` | Brand logos and screenshots. |
| `assets/screenshots/` | App screenshots used by the landing page. |

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
| `assets/screenshots/diary.png` | Diary | Hero |
| `assets/screenshots/central_log.png` | Central Log tray | Logging section |
| `assets/screenshots/log_strength.png` | Strength logging chip picker | Logging section |
| `assets/screenshots/log_structured.png` | Structured track-session logging | Logging section |
| `assets/screenshots/review.png` | Review tab / Daily Review | Review section |
| `assets/screenshots/weekly_recap.png` | Generated Weekly Recap detail | Weekly Recap section |
| `assets/screenshots/records.png` | Records / speed curve | Records section |

Current exports are **1800×3680** PNGs. Keep the same aspect ratio and transparent
device treatment when replacing them.

## Intentional TODOs

- **Waitlist**: there is no backend wired up, so the "Join the waitlist" buttons use a
  `mailto:` link. Replace with a real waitlist endpoint/form when available
  (search `TODO` in `index.html`).
- **Contact email**: `andrea.federici1999@icloud.com` is used as the support / privacy /
  waitlist address. Confirm or swap for a dedicated public address before launch
  (search `TODO` in `support.html` and `privacy.html`).
