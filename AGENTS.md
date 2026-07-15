# StrideBuddy Website Rules

## Git Workflow

- When the user asks to commit and push changes, do not create, switch to, or use a new branch. Commit and push only from the branch that was already checked out. If the worktree is not already on a named branch, ask before proceeding.

## Product and Architecture

- Keep the website dependency-free and static: plain HTML and CSS with no build step, client framework, analytics, or tracking unless the user explicitly changes that product direction.
- Preserve public behavior, responsive layout, dark mode, accessibility, metadata, URLs, legal meaning, and product claims during architecture-only cleanup.
- Keep the canonical public domain and support contact as `stridebuddy.app` and `support@stridebuddy.app`.
- Treat `README.md` as the website file and asset map. Use `../iOS/docs/DESIGN.md` for high-level design direction and the live iOS design-system code for exact shared tokens.

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
