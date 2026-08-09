# StrideBuddy — Marketing Website

A single-page landing site for **StrideBuddy**, the iOS training diary for competitive
track-and-field athletes. It is a static site (plain HTML + inline CSS, no build step,
no dependencies, no tracking) styled with the app's **StrideBuddy Design System**
(see `../iOS/docs/DESIGN.md`).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The one-page landing site (hero, problem, features, logging, Daily Review, records, how-it-works, credibility, CTA). |
| `support.html` | Support / contact page. |
| `terms.html` | Terms of use and AI disclosure. |
| `privacy.html` | Privacy policy. |
| `legal.css` | Shared paper/ink layout and typography for support, legal, and campaign pages. |
| `s/instagram/index.html` | Campaign landing page for Instagram (`/s/instagram`). |
| `s/community/index.html` | Campaign landing page for community links (`/s/community`). |
| `s/campaign.css` | App Store call-to-action styles shared by the campaign pages. |
| `assets/` | Brand logos and screenshots. |
| `assets/screenshots/` | App screenshots used by the landing page. |

## Campaign attribution

Every App Store link is a campaign link generated in App Store Connect →
Analytics → Acquisition → Campaigns, so installs are traceable there. The links
take the form:

```
https://apps.apple.com/app/apple-store/id6760190939?pt=128627634&ct=<token>&mt=8
```

`pt` is the provider token for the Apple Account and is the same everywhere.
`ct` is the campaign, and each campaign must also exist in App Store Connect
under exactly that name or its installs are not reported. The tokens are
`website` for `index.html`, `instagram` for `/s/instagram`, and `community` for
`/s/community`. A campaign stays empty until at least five individual Apple
Accounts have installed from it, so an early zero is a privacy floor rather than
a broken link.

Use the generated link verbatim when adding a channel — note the
`/app/apple-store/` path, which differs from the plain `/app/` product URL.
Attribution comes from the campaign token alone: the site adds no analytics,
cookies, scripts, or third-party requests, and it should stay that way.

## Running it

No build needed — open `index.html` in a browser, or serve the folder:

```sh
cd Website
python3 -m http.server 8000
# then open http://localhost:8000
```

## Design system

Colors, type, radius, and tone all mirror `iOS/docs/DESIGN.md` and the app's
Swift design tokens: a neutral near-white canvas (`#F8F8F8`), ink text, true-white
cards, the StrideBuddy red accent (`#DB2412`), system-sans typography, and
monospaced numerals. The palette adapts to the design system's night-paper colors
when the visitor prefers dark mode. Do not introduce a separate web palette —
derive from those tokens.

## App screenshots

The page uses real app screenshots exported with a transparent device frame:

| File | Screen | Used in |
| --- | --- | --- |
| `assets/screenshots/today.png` | Today | Hero (layered inside `assets/iphone-17-black-bezel.png`) |
| `assets/screenshots/central_log.png` | Central Log tray | Logging section |
| `assets/screenshots/log_strength.png` | Strength logging chip picker | Logging section |
| `assets/screenshots/log_structured.png` | Structured track-session logging | Logging section |
| `assets/screenshots/review.png` | Review tab / Daily Review feedback | Review section |
| `assets/screenshots/records.png` | Records / speed curve | Records section |

Current exports are **1800×3680** PNGs. Keep the same aspect ratio and transparent
device treatment when replacing them.

## Contact

`support@stridebuddy.app` is the support, legal, and privacy contact address.
