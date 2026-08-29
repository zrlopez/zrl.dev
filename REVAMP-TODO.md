# zrl.dev Revamp — TODO (chore/revamp-portfolio)

> Branch: `chore/revamp-portfolio` (Remix 2.7) — preview-only. Production `main` still Next.js 15.
> Last updated: 2026-08-28. Build: `✓ 311ms` post batch fix (1ff74ef).

## Must fix — high

- [x] **Z ascii** — `public/humans.txt:1` + `app/config.json:10` restored correct isometric `  ____  ____ /__ //__` 7-line, `config.ascii` synced (`root.jsx:102` console)
- [x] **SEO sitemap** — `public/sitemap.xml` → `zrl.dev` + `/experience` + 3 projects (1ff74ef)
- [x] **SEO manifest** — `public/manifest.json:2-3` → `ZRL` / `Zachary Ryan Lopez — AI/ML Data Operations`
- [x] **robots.txt** — added `Allow: /` + `Sitemap: https://zrl.dev/sitemap.xml`
- [x] **humans.txt colophon** — `public/humans.txt:48` `JAPANENSE-HERE` → `コロフォン`, `Catppuccin / Vira Montana` → `Gotham / IPA Gothic · Remix / Three.js / Vite · Vercel + Cloudflare`
- [x] **Uses System table** — `app/routes/uses/uses.jsx:154` `macOS 27` → `macOS 15 Sequoia`
- [x] **Uses Development stack** — `uses.jsx:85` → `Remix 2.7 / React 18 / Vite` for this branch, dashboard `Next.js 15` noted separately
- [x] **Dead project routes** — added `projects.ai-agent-platform`, `projects.ml-incident-response`, `projects.annotation-dashboard` (minimal Project layouts, sitemap wired). Old `slice`/`smart-sparrow` kept de-linked for now — delete when ready
- [x] **Home textures** — `home.jsx:2-7` distinct: `sprTexture` → AI Agent, `sliceTexture` → ML Incident, `sliceAnnotation` → Dashboard
- [x] **Monogram** — `app/components/monogram/monogram.jsx:21` `H` → `Z` (`M0 0h36v7H12.5L36 29H0v-7H23.5L0 0Z`)
- [x] **/articles redirect** — `app/routes/articles.jsx` + `articles.$slug.jsx` → 301 `/experience`, `root.jsx:52` canonical `url` → `pathname` bug fixed

## Nice to have — low / polish

- [x] **Prune icons** — `app/components/icon/icons.svg` removed `figma:18` + `bluesky:45` (story-only figma kept in `button.stories.jsx:44`)
- [x] **Canonical URL** — `app/root.jsx:52` `url` → `pathname` fixed
- [ ] **Heavy assets** — `notfound.mp4 4.7MB`, `spr-motion 2.2/3.9MB` — lazy-load or remove from server build (`vite chunk` warning) — noted, not blocking
- [ ] **`SESSION_SECRET` fallback** — `root.jsx:59` + `api.set-theme.js:8` `fallback-secret` OK for preview, set real env var before prod cutover
- [ ] **\_headers** — `public/_headers:27` Cloudflare Pages `noindex` syntax — Vercel ignores; add `vercel.json` if needed

## Done (for reference)

- Hero `AI/ML Data Operations → Ops` (`config.json:3`), social `LinkedIn/GitHub/Kaggle` + `icons.svg:48/51`, theme `crimson #A51C30` (`theme.js:113` dark primary/accent, orb `displacement-sphere-fragment.glsl:44`), Experience page `/experience`, Volkihar `29 files` removed, transparent portrait `960x1280/480x640 PNG`, entry.server `handleRequest` Vercel fix, vite `vercelPreset`

## How to work this

1. Fix SEO block first (sitemap/manifest/robots) — one commit.
2. Fix text blocks next (humans.txt + uses.jsx) — one commit.
3. Then routes/textures/monogram — each as atomic commit.
4. `npm run build` after each, `vercel curl` preview.
5. Never `vercel --prod` from branch without explicit approval — preview vs production separate.
