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
| `s/community/index.html` | The `/s/community` landing page, used when posting in forums, Reddit, Discord and club spaces, where a bare App Store link is a dead end for desktop readers and reads as spam |
| `s/campaign.css` | Styles the call to action on that page. One consumer is not a reason to inline it |
| The `pt` and `ct` parameters on every `apps.apple.com` link | `pt=128627634` is the provider token; `ct` is the campaign. A link missing them is an invisible install |

Rules when touching any of it:

- **The script is not a duplicate of the landing pages.** It was proposed for deletion once on those grounds. `/s/instagram` was deleted instead, because Instagram's "Explore" link promises the app and a two-sentence stub is not that. Do not re-litigate this without the user.
- **The script is safe by construction.** It only honours campaigns in its own allowlist, makes no request, sets no cookie or storage, contacts no third party, and records nothing about the visitor. If it never runs, every link stays at `ct=website`, exactly as before it existed.
- **Adding a channel needs three things in sync:** a campaign registered in App Store Connect, its name added to the script's `campaigns` array, and a row in `README.md`. Two out of three reports nothing.
- **`/s/instagram` is deleted on purpose.** Do not recreate it because a document mentions it; older notes predate the change.
- Never add analytics, pixels, cookies, fonts, or any third-party request. That prohibition is real and unchanged, and `privacy.html` is written on the assumption it holds.

`README.md § Campaign attribution` carries the full link list and the per-channel rules.

## Shared Design Values

- Minimize semantic duplication with CSS custom properties and shared styles when every consumer represents the same visual concept and should change together.
- Preserve separate values when identical numbers represent unrelated concepts that should evolve independently.
- Keep the StrideBuddy paper, ink, red accent, card, typography, and numerical treatments aligned with the app. Do not introduce a separate web visual language.
- Preserve the existing screenshot filenames, aspect ratios, device treatment, and page references when replacing images.

## Verification

- Serve the site locally with `python3 -m http.server 8000` when visual verification is needed.
- Check every changed page at narrow and wide widths, in light and dark appearance, with keyboard navigation, and with all local links and asset paths working.
- Treat changes to `terms.html`, `privacy.html`, and support information as user-visible legal or policy changes rather than routine cleanup.
- Do not commit `.DS_Store`, cache files, local server output, or other generated artifacts.
