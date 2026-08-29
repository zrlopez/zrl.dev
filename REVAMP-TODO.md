# zrl.dev Revamp — TODO (chore/revamp-portfolio)

> Branch: `chore/revamp-portfolio` (Remix 2.7) — preview-only. Production `main` still Next.js 15.
> Last updated: 2026-08-28. Build: `✓ 306ms` post Z-fix.

## Must fix — high

- [x] **Z ascii** — `public/humans.txt:1` + `app/config.json:10` restored correct isometric `  ____  ____ /__ //__` 7-line, `config.ascii` synced (`root.jsx:102` console)
- [ ] **SEO sitemap** — `public/sitemap.xml` still `hamishw.com` with `/articles`, `/projects/slice|smart-sparrow|volkihar`. Replace with `https://zrl.dev/` + `/contact` + `/uses` + `/experience` + `/projects/ai-agent-platform` + `/projects/ml-incident-response` + `/projects/annotation-dashboard`
- [ ] **SEO manifest** — `public/manifest.json:2-3` `Hamish Williams` → `Zachary Ryan Lopez` / `zrl.dev — AI/ML Data Operations`
- [ ] **robots.txt** — currently bare `User-agent: *` — add `Sitemap: https://zrl.dev/sitemap.xml` + allow
- [ ] **humans.txt colophon** — `public/humans.txt:48` `JAPANENSE-HERE` typo, `Catppuccin / Vira Montana` → site-accurate `Gotham / IPA Gothic · Remix / Three.js / Vite / Vercel + Cloudflare` (site uses `theme.js:15` Gotham, not Catppuccin which is your terminal theme)
- [ ] **Uses System table** — `app/routes/uses/uses.jsx:154` `Golden Gate (macOS 27)` → `macOS 15 Sequoia` (or Tahoe 26 if you want beta), keep rest
- [ ] **Uses Development stack** — `uses.jsx:85` says `Next.js 15 + Tailwind` then hedge "currently rebuilding on this Remix base" — should state actual deployed stack for this branch: `Remix 2.7 / React 18 / Vite / Framer Motion / Three.js`
- [ ] **Dead project routes** — `app/routes/projects.slice/` + `projects.smart-sparrow/` are Hamish Slice/Sparrow (gamestack/slice assets). Delete or replace with real `projects.ai-agent-platform`, `projects.ml-incident-response`, `projects.annotation-dashboard` routes + MDX content (see `home.jsx:100-155` placeholders)
- [ ] **Home textures** — `home.jsx:2-7` all three `ProjectSummary` use duplicate `sliceTexture`/`sprTexture` (Slice + Smart Sparrow). Wire distinct: `sprTexture` → keep for AI Agent Platform only if you re-skin, `sliceTexture` → ML Incident, `slice-annotation.png` exists unused → Annotation Dashboard. Add real screenshots later.
- [ ] **Monogram** — `app/components/monogram/monogram.jsx:21` clip path is Hamish `H` shape — replace with `Z` monogram or neutral mark
- [ ] **/articles redirect** — `app/routes/$.jsx` currently 404 all misses. Add explicit `/articles` → 301 `/experience` (Articles retired `dd08db0`)

## Nice to have — low / polish

- [ ] **Prune icons** — `app/components/icon/icons.svg:18` `figma` + `bluesky` symbols unused after `nav-data.js:22` switch to LinkedIn/GitHub/Kaggle — keep `linkedin:48` `github:12` `kaggle:51`, delete dead defs to trim bundle
- [ ] **Heavy assets** — `public/static` + `build` includes `notfound.mp4 4.7MB`, `spr-motion 2.2/3.9MB` — lazy-load or remove from server build (`vite chunk` warning)
- [ ] **`SESSION_SECRET` fallback** — `app/root.jsx:59` + `api.set-theme.js:8` `fallback-secret` hardcoded — OK for preview, set real env var before prod cutover via `process.env.SESSION_SECRET` (already wired with `cloudflare.env` fallback)
- [ ] **\_headers** — `public/_headers:27` `https://:project.pages.dev/* X-Robots-Tag: noindex` is Cloudflare Pages syntax — Vercel ignores; add `vercel.json` headers or keep for future CF
- [ ] **Canonical URL** — `app/root.jsx:52` `pathnameSliced` bug: fallback returns full `url` not `pathname` — should be `pathname.slice(0,-1)` else `pathname`

## Done (for reference)

- Hero `AI/ML Data Operations → Ops` (`config.json:3`), social `LinkedIn/GitHub/Kaggle` + `icons.svg:48/51`, theme `crimson #A51C30` (`theme.js:113` dark primary/accent, orb `displacement-sphere-fragment.glsl:44`), Experience page `/experience`, Volkihar `29 files` removed, transparent portrait `960x1280/480x640 PNG`, entry.server `handleRequest` Vercel fix, vite `vercelPreset`

## How to work this

1. Fix SEO block first (sitemap/manifest/robots) — one commit.
2. Fix text blocks next (humans.txt + uses.jsx) — one commit.
3. Then routes/textures/monogram — each as atomic commit.
4. `npm run build` after each, `vercel curl` preview.
5. Never `vercel --prod` from branch without explicit approval — preview vs production separate.
