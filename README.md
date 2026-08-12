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
| `s/community/index.html` | Campaign landing page for community links (`/s/community`). Carries `noindex, follow`. |
| `s/campaign.css` | App Store call-to-action styles for the campaign pages. |
| `robots.txt` | Sitemap declaration only. Cloudflare appends the managed crawler block. |
| `serve.py` | Local dev server that strips `.html` like production does. Never deployed. |
| `BingSiteAuth.xml` | Bing Webmaster Tools site verification. Must stay at the site root. |
| `sitemap.xml` | The four indexable URLs. Must agree with the `rel="canonical"` tags. |
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
Attribution comes from the campaign token alone. The site adds no analytics,
cookies, or third-party requests, and it must stay that way — but note that
"no scripts" stopped being literally true: `index.html` carries the inline
campaign script and an inert block of JSON-LD. Both are first-party, neither
makes a request or records anything, and both are deliberate. Judge a proposed
script by whether it tracks, fetches, or adds a dependency, not by whether it
is JavaScript.

## Search indexing

As of 2026-08-11 the site was **absent from Google's index entirely** — a search
for the brand name and its own tagline returned nothing, and `site:stridebuddy.app`
returned nothing. The files below are the fix for the mechanical half of that.
They do not make the site rank; they make it eligible.

### The canonical URL form is apex, no extension

**Cloudflare Pages strips the `.html` extension.** `/support.html` returns a 307
to `/support`, and `/index.html` a 307 to `/`. The extensionless URL is the one
that returns 200, so it is the real URL, and the canonical tags, `sitemap.xml`
and every internal link all name it.

This is not a style preference and getting it backwards is not harmless. A
sitemap listing redirecting URLs is a defect Google reports, and a canonical
pointing at a redirect is a signal that contradicts itself. **The three must
agree; if they ever disagree, the signal is worse than having none.**

**Verify with `curl` and no `-L`.** Following redirects reports the final 200
and hides the hop — that mistake is how this was first written with `.html`
URLs throughout, on 2026-08-11, and shipped that way in `4d67a0a` before being
corrected.

```sh
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://stridebuddy.app/support
```

`www.stridebuddy.app` is the separate case, and the one the canonical tags
genuinely earn their place on: it answers 200 and does **not** redirect to apex,
so nothing else distinguishes the two hosts. A 301 at the Cloudflare level would
be better and is not configured.

### robots.txt is mostly not ours

Cloudflare serves a **managed robots.txt** block for this zone, injected between
`# BEGIN Cloudflare Managed content` and `# END Cloudflare Managed Content`. It
already grants `User-agent: *` / `Allow: /` with `Content-Signal: search=yes`, and
disallows the AI training crawlers — GPTBot, ClaudeBot, CCBot, Google-Extended,
Applebot-Extended, Bytespider, Amazonbot, meta-externalagent.

The repository's `robots.txt` therefore holds **only** the `Sitemap:` line, which
is group-independent and cannot conflict. Do not add a `User-agent: *` group to
it — two groups for one agent is ambiguous and crawlers resolve it inconsistently.
Crawler rules change in the Cloudflare dashboard, under AI Crawl Control.

**Verify after any deploy that touches this**: fetch `https://stridebuddy.app/robots.txt`
and confirm both the `Sitemap:` line and the managed block are present. The
append behaviour is Cloudflare's, not ours, and a change on their side would be
silent.

### Structured data

`index.html` carries a `SoftwareApplication` JSON-LD block. It is inert JSON —
no execution, no request, no third party — so it does not bear on the
dependency-free rule.

It deliberately omits `aggregateRating`. Google requires rating markup to reflect
ratings genuinely displayed on the page, and the App Store count was 0/0/1 across
`us`/`gb`/`it` on 2026-08-11. Add it only when a real figure exists **and** the
page shows it.

### Search engine verification

`BingSiteAuth.xml` at the site root proves domain ownership to Bing Webmaster
Tools. **Do not move, rename or delete it.** Bing re-checks periodically rather
than once, so removing it un-verifies the property and silently stops the
reporting — the same failure shape as the campaign tokens above.

Its contents are byte-identical to the file Bing generated; leave them alone. The
token inside is *meant* to be publicly served, so it is not a secret and belongs
in Git. Keep it out of `sitemap.xml` — it is not a page.

Google is verified differently and needs nothing in this repository. It uses a
**Domain property** (`sc-domain:stridebuddy.app`), proven by a DNS `TXT` record on
the Cloudflare zone, which is why it covers apex and `www` together while Bing's
covers only the URL it was added under.

### State as of 2026-08-12

**Google: done.** The Domain property is verified, `sitemap.xml` is submitted, and
URL Inspection reports the homepage `indexed`.

**The site was never missing from Google's index.** That was this work's founding
assumption and it was wrong — the homepage has been indexed since **17 July**,
three weeks before 1.0.4 shipped. It was believed because a `site:stridebuddy.app`
search came back with nothing relevant, from a tool that silently ignores the
`site:` operator. **Check a claim like that against Search Console, which is
Google reporting on itself, rather than against a search box.**

Two things followed from reading the real report. Discovery names
`apps.apple.com` and `appagg.com` as referring pages, so the App Store listing
and the aggregators scraping it are what found the site — tracked as `GROW-010`.
And `Google-selected canonical: Inspected URL` means Google had already resolved
the homepage correctly on its own, so the canonical tag earns its place on the
legal pages and the `www` variants rather than here.

**Bing: verified** 2026-08-12 against `BingSiteAuth.xml`, after the *Import from
Google Search Console* path failed to find the property and the site was added
manually instead.

Bing's is a **URL property**, not a domain one, so unlike Google's it covers only
`https://stridebuddy.app` and not `www`. That is deliberate: a second property for
`www` would split the reporting rather than add to it, and the canonical tags
already point Bing at the apex.

**Still not done, and not doable from this repository:** the `www` → apex 301,
which is a Cloudflare setting. Tracked in `WEB-003`.

## Running it

No build needed. Use `serve.py`, not `python3 -m http.server`:

```sh
python3 serve.py 8000
```

**The plain `http.server` 404s on every internal link.** Production strips the
`.html` extension, so the links, the canonical tags and `sitemap.xml` all use
`/support` rather than `/support.html`; `http.server` serves files literally and
finds nothing at that path. `serve.py` adds that one behaviour and nothing else,
so local matches production. It is a development tool and is never deployed.

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
