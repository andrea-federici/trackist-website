# StrideBuddy Website Rules

## Git Workflow

- When the user asks to commit and push changes, do not create, switch to, or use a new branch. Commit and push only from the branch that was already checked out. If the worktree is not already on a named branch, ask before proceeding.

## Product and Architecture

- Keep the website dependency-free and static: plain HTML and CSS with no build step, client framework, analytics, or tracking unless the user explicitly changes that product direction. **The one exception is the campaign-attribution script described below, which is deliberate and load-bearing.** The rule is about tracking, third-party requests and dependencies, not about JavaScript as such; judge a proposed script by whether it does any of those, and never delete this one as dependency-free cleanup.
- Preserve public behavior, responsive layout, dark mode, accessibility, metadata, URLs, legal meaning, and product claims during architecture-only cleanup.
- Keep the canonical public domain and support contact as `stridebuddy.app` and `support@stridebuddy.app`.
- Treat `README.md` as the website file and asset map. Use `../iOS/docs/DESIGN.md` for high-level design direction and the live iOS design-system code for exact shared tokens.

## Campaign attribution: in use, do not remove

Every App Store install is traced back to the channel that produced it through Apple's
campaign token (`ct`), read in App Store Connect → Analytics → Acquisition → Campaigns.
There is no web analytics behind this and there must not be: the token on the outbound
link is the entire mechanism. Four things carry it, and each is live and referenced from
somewhere outside this repository. **Deleting any of them silently stops a channel being
measurable — nothing fails, no test breaks, and the installs quietly report as `website`.**

| Thing | Why it must stay |
| --- | --- |
| The inline script at the bottom of `index.html` | Reads `?c=<campaign>` and rewrites `ct` on the three App Store links. **The Instagram profile's "Explore StrideBuddy" link is `https://stridebuddy.app/?c=instagram` and depends entirely on it.** Delete the script and that traffic reports as `website` |
| `s/community/index.html` | The `/s/community` landing page, and the only thing carrying `ct=community`. **It is the link posted in forums, on Reddit, in Discord and in club spaces**, where a bare App Store link is a dead end for desktop readers and reads as spam. Delete it and every link already posted 404s while that campaign reports nothing |
| `s/campaign.css` | Styles the call to action on `/s/community`. **One consumer is not a reason to inline or remove it.** Deleting it is the quietest failure here: the page still returns 200 and still carries its token, so attribution keeps working while the page renders unstyled at the end of every community link |
| The `pt` and `ct` parameters on every `apps.apple.com` link | `pt=128627634` is the provider token; `ct` is the campaign. A link missing them is an invisible install |

Rules when touching any of it:

- **The script is not a duplicate of the landing pages.** It was proposed for deletion once on those grounds. `/s/instagram` was deleted instead, because Instagram's "Explore" link promises the app and a two-sentence stub is not that. Do not re-litigate this without the user.
- **The script is safe by construction.** It only honours campaigns in its own allowlist, makes no request, sets no cookie or storage, contacts no third party, and records nothing about the visitor. If it never runs, every link stays at `ct=website`, exactly as before it existed.
- **Adding a channel needs three things in sync:** a campaign registered in App Store Connect, its name added to the script's `campaigns` array, and a row in `README.md`. Two out of three reports nothing.
- **Nothing in this repository links to `/s/community`, and that is not evidence it is unused.** Its inbound links live outside: in forum threads, Reddit comments and Discord messages already posted. A reachability check run inside the repo will call it an orphan and be wrong. The same holds for the `?c=` parameter, whose only caller is the Instagram profile.
- **`/s/instagram` is deleted on purpose.** Do not recreate it because a document mentions it; older notes predate the change.
- Never add analytics, pixels, cookies, fonts, or any third-party request. That prohibition is real and unchanged, and `privacy.html` is written on the assumption it holds.

`README.md § Campaign attribution` carries the full link list and the per-channel rules.

## Search indexing: keep it self-consistent

The site was absent from Google's index entirely on 2026-08-11. `robots.txt`,
`sitemap.xml`, the `rel="canonical"` tags, the `noindex, follow` on
`/s/community`, and the `SoftwareApplication` JSON-LD in `index.html` are the fix
for the mechanical half of that. `README.md § Search indexing` carries the full
reasoning; the rules that matter when editing are these.

- **Three things must agree: the canonical tags, `sitemap.xml`, and the internal
  links.** All three name the apex host with **no `.html` extension** — `/support`,
  not `/support.html`, and `/` rather than `/index.html`. That is what the host
  serves: Cloudflare Pages strips the extension and 307s the `.html` form to it.
  A sitemap listing redirecting URLs is a defect Google reports, and a canonical
  pointing at a redirect contradicts itself. Change all three together or none.
- **Check redirects with `curl` and no `-L`.** Following them reports the final
  200 and hides the hop. That is exactly how this rule was first written
  backwards, on 2026-08-11, and shipped in `4d67a0a` before being corrected —
  `curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' <url>`.
- **`www.stridebuddy.app` is the case the canonical tags genuinely earn.** It
  answers 200 and does not redirect to apex, so nothing else distinguishes the
  two hosts. A 301 at the Cloudflare level would be better and is not configured.
- **`robots.txt` holds only the `Sitemap:` line, deliberately.** Cloudflare
  appends a managed block with the `User-agent: *` group and the AI-crawler
  rules. Do not add a second `User-agent: *` group here; change crawler rules in
  the Cloudflare dashboard under AI Crawl Control.
- **The JSON-LD is not a script in the sense the dependency rule means.** It is
  inert data: no execution, no request, no third party. It omits
  `aggregateRating` on purpose — Google requires that to reflect a rating shown
  on the page, and there is effectively no rating yet. Do not add one to look
  more complete.
- **`/s/community` is `noindex, follow`, and `follow` is the load-bearing half.**
  That page is where the site's inbound forum and Reddit links land. `nofollow`
  would discard them. It near-duplicates the homepage, which is why it is not
  indexed, and it is absent from `sitemap.xml` for the same reason.
- Adding a page means adding it to `sitemap.xml` with a canonical tag, or
  deciding it is `noindex` and leaving it out. Silently doing neither is the
  failure mode.

## Shared Design Values

- Minimize semantic duplication with CSS custom properties and shared styles when every consumer represents the same visual concept and should change together.
- Preserve separate values when identical numbers represent unrelated concepts that should evolve independently.
- Keep the StrideBuddy paper, ink, red accent, card, typography, and numerical treatments aligned with the app. Do not introduce a separate web visual language.
- Preserve the existing screenshot filenames, aspect ratios, device treatment, and page references when replacing images.

## Verification

- Serve the site locally with `python3 serve.py 8000` when visual verification is needed. **Not `python3 -m http.server`** — production strips the `.html` extension and the internal links match production, so the plain server 404s on all of them and the site looks broken when it is not.
- Check every changed page at narrow and wide widths, in light and dark appearance, with keyboard navigation, and with all local links and asset paths working.
- Treat changes to `terms.html`, `privacy.html`, and support information as user-visible legal or policy changes rather than routine cleanup.
- Do not commit `.DS_Store`, cache files, local server output, or other generated artifacts.
