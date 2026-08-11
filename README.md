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
| `s/community/index.html` | Campaign landing page for community links (`/s/community`). |
| `s/campaign.css` | App Store call-to-action styles for the campaign pages. |
| `assets/` | Brand logos and screenshots. |
| `assets/screenshots/` | App screenshots used by the landing page. |

## Campaign attribution

> **In use. Do not delete any of it.** The inline script in `index.html`, the
> `/s/community` page, `s/campaign.css`, and the `pt`/`ct` parameters on every
> App Store link are each load-bearing, and each is referenced from somewhere
> outside this repository — the Instagram profile, community posts, App Store
> Connect. Removing one breaks nothing visibly: the page still renders, no test
> fails, and that channel's installs quietly start reporting as `website`.
> `AGENTS.md § Campaign attribution` states the rules.

Every App Store link is a campaign link generated in App Store Connect →
Analytics → Acquisition → Campaigns, so installs are traceable there. The links
take the form:

```
https://apps.apple.com/app/apple-store/id6760190939?pt=128627634&ct=<token>&mt=8
```

`pt` is the provider token for the Apple Account and is the same everywhere.
`ct` is the campaign, and each campaign must also exist in App Store Connect
under exactly that name or its installs are not reported. A campaign stays empty
until at least five individual Apple Accounts have installed from it, so an early
zero is a privacy floor rather than a broken link.

### What to share, per channel

Share a page rather than the App Store link anywhere a visitor might be on a
desktop, where an App Store link is a dead end. Every page below carries a token,
so the attribution is the same either way.

| Channel | Share this | Attributes as |
| --- | --- | --- |
| Instagram profile, "Explore StrideBuddy" | `https://stridebuddy.app/?c=instagram` | `instagram` |
| Instagram profile, "Download StrideBuddy" | the `instagram` App Store link below | `instagram` |
| Forums, Reddit, Discord, clubs, coaches | `https://stridebuddy.app/s/community` | `community` |
| Everything else, and organic search | `https://stridebuddy.app` | `website` |

Never share a bare `apps.apple.com` link. It carries no token, and the install is
invisible. Never send channel traffic to the plain homepage either — it tags as
`website` and drains the channel's own number.

### Tagging the homepage with `?c=`

Someone told to "explore" wants the full site, not a landing stub, so the
homepage can carry any campaign's token. Adding `?c=<campaign>` to it rewrites
the `ct` on its three App Store links, and an inline script at the bottom of
`index.html` does the rewrite.

Only campaigns named in that script's `campaigns` array are accepted, so a
made-up value cannot invent a campaign or repoint the button; anything
unrecognized leaves the links at `ct=website`. Add a channel there when you add
one to App Store Connect. The script reads the URL and sets link attributes, and
that is all it does: no request, cookie, storage, or third party, and nothing
about the visitor is recorded. If it never runs, the links stay `ct=website`.

`/s/community` is the lightweight alternative for somewhere the full homepage is
too much, such as a forum reply. Instagram used to have a matching page and no
longer needs one: its links go to the App Store and to the tagged homepage, so
the page was deleted rather than left unused. Add another `/s/` page only if a
channel wants a landing page of its own; a channel that just needs the homepage
only needs a `?c=` value.

### The three App Store campaign links

```
instagram  https://apps.apple.com/app/apple-store/id6760190939?pt=128627634&ct=instagram&mt=8
community  https://apps.apple.com/app/apple-store/id6760190939?pt=128627634&ct=community&mt=8
website    https://apps.apple.com/app/apple-store/id6760190939?pt=128627634&ct=website&mt=8
```

The `website` link is the one already in `index.html`, three times. The other two
are in their landing pages' call to action.

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
