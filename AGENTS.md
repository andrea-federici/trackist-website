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
| The inline script at the bottom of `index.html` and its copy in `it.html` | Reads `?c=<campaign>` and rewrites `ct` on every App Store link on the page. **The Instagram profile's "Explore StrideBuddy" link is `https://stridebuddy.app/?c=instagram` and depends entirely on it.** Delete the script and that traffic reports as `website` |
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
- **`www.stridebuddy.app` 301-redirects to apex** through a Cloudflare redirect
  rule (2026-10-24). The canonical tags agree with it.
- **`robots.txt` is the whole crawler policy and allows every crawler, AI ones
  included.** Cloudflare's managed robots.txt and AI-bot blocking are off
  (2026-10-24) because being found by chatbots matters. Change crawler rules in
  this file, and don't re-enable the Cloudflare blocks without the user.
- **The JSON-LD is not a script in the sense the dependency rule means.** It is
  inert data: no execution, no request, no third party. It omits
  `aggregateRating` on purpose — Google requires that to reflect a rating shown
  on the page, and there is effectively no rating yet. Do not add one to look
  more complete.
- **The FAQ's `FAQPage` JSON-LD must match the visible questions and answers
  word for word.** Google requires it. Change both together. `llms.txt` repeats
  the same facts; update it when they change.
- **`/s/community` is `noindex, follow`, and `follow` is the load-bearing half.**
  That page is where the site's inbound forum and Reddit links land. `nofollow`
  would discard them. It near-duplicates the homepage, which is why it is not
  indexed, and it is absent from `sitemap.xml` for the same reason.
- **`/` and `/it` are language versions of one page.** Each carries `hreflang`
  links for `en`, `it` and `x-default` (pointing at `/`), and `sitemap.xml`
  repeats them. Copy, sections, images, the campaign script and the style block
  change on both pages together. There is no redirect by browser language.
- Adding a page means adding it to `sitemap.xml` with a canonical tag, or
  deciding it is `noindex` and leaving it out. Silently doing neither is the
  failure mode.

## Shared Design Values

- Minimize semantic duplication with CSS custom properties and shared styles when every consumer represents the same visual concept and should change together.
- Preserve separate values when identical numbers represent unrelated concepts that should evolve independently.
- Keep the StrideBuddy paper, ink, red accent, card, typography, and numerical treatments aligned with the app. Do not introduce a separate web visual language.
- Preserve the existing screenshot filenames, aspect ratios, device treatment, and page references when replacing images.

## Images: always downsize and compress with pngquant

Every image the page loads must be downsized and then compressed with `pngquant` before it is committed. This covers adding a new image and replacing an existing one. A full-size screenshot is about 1.7 MB; downsized and compressed it is about 230 KB, with no visible difference. Before this rule the page loaded 20.5 MB of images and was slow; now it loads 2.7 MB.

- **Downsize first.** Framed screenshots and `assets/iphone-17-black-bezel.png` are 1008×2061, and the bare `today.png` is 900×1957. The largest phone on the page is 320 CSS pixels wide, so that is still about 3× on a retina screen. `bezel.py` and the `AppStore/` pipeline write 2015×4120, so their output is never ready to commit as it is.
- **Then compress with `pngquant`**, and no other tool. Install it with `brew install pngquant` if it is missing. Pillow's own palette mode was tried and rejected: it drops card shadows and bands gradients.
- **Use the exact commands in `README.md § App screenshots`.** They hold the sizes and the `pngquant` settings (`--quality=85-98 --speed 1 --strip`).
- **Compress each file once, right after it is written.** Running `pngquant` again on a file that is already compressed loses a little more quality each time.
- **Leave the `_raw.png` inputs full size and uncompressed.** The page does not load them; they are the sources for the next frame.
- **Look at the result before committing.** Compare a crop of a gradient, a shadow and small text against the uncompressed file. If you can see a difference, raise the quality floor rather than commit it.

## Verification

- Serve the site locally with `python3 serve.py 8000` when visual verification is needed. **Not `python3 -m http.server`** — production strips the `.html` extension and the internal links match production, so the plain server 404s on all of them and the site looks broken when it is not.
- Check every changed page at narrow and wide widths, in light and dark appearance, with keyboard navigation, and with all local links and asset paths working.
- Treat changes to `terms.html`, `privacy.html`, and support information as user-visible legal or policy changes rather than routine cleanup.
- Do not commit `.DS_Store`, cache files, local server output, or other generated artifacts.
