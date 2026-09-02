# Portfolio | zrl.dev 

[![Stack](https://img.shields.io/badge/stack-Remix%20%2B%20Vite%20%2B%20Vercel-brightgreen?style=flat-square)](https://zrl.dev/tools)
[![Status](https://img.shields.io/badge/status-live-brightgreen?style=flat-square)](https://zrl.dev)
[![CI](https://github.com/zrlopez/zrl.dev/actions/workflows/secured_ci.yml/badge.svg?branch=main)](https://github.com/zrlopez/zrl.dev/actions/workflows/secured_ci.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/aeaf6b328db0474f84f5fde4fd0bc174)](https://app.codacy.com/gh/zrlopez/zrl.dev/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/aeaf6b328db0474f84f5fde4fd0bc174)](https://app.codacy.com/gh/zrlopez/zrl.dev/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](./LICENSE)

<p align="center">
  <img src="public/site-preview.png" alt="zrl.dev portfolio preview" width="720" />
</p>

Personal portfolio of **Zachary Ryan Lopez**, AI/ML Data Operations Analyst based in Austin, Texas.

**Live site:** [https://zrl.dev](https://zrl.dev)

The site presents professional experience, certifications, and project case studies in annotation quality assurance, machine learning operations, and multi-agent systems. The repository is the production source for the site, including continuous integration, security controls, and an interactive annotation analytics demonstration.

## Featured work

| Project | Description |
|---------|-------------|
| [Annotation Analytics Dashboard](https://zrl.dev/projects/annotation-dashboard#live-demo) | Interactive six-tab analytics demonstration for annotation throughput, quality, and capacity |
| [AI Agent Platform](https://zrl.dev/projects/ai-agent-platform) | Case study on cross-agent orchestration and durable agent systems |
| [ML Incident Response](https://zrl.dev/projects/ml-incident-response) | Case study on MLOps incident handling and operational runbooks |

## Site map

| Path | Description |
|------|-------------|
| [`/`](https://zrl.dev/) | Home — introduction, featured projects, profile |
| [`/projects`](https://zrl.dev/projects) | Project archive |
| [`/projects/annotation-dashboard`](https://zrl.dev/projects/annotation-dashboard#live-demo) | Annotation analytics case study and live demo |
| [`/projects/ai-agent-platform`](https://zrl.dev/projects/ai-agent-platform) | Agent platform case study |
| [`/projects/ml-incident-response`](https://zrl.dev/projects/ml-incident-response) | ML incident response case study |
| [`/tools`](https://zrl.dev/tools) | Tools and skills inventory |
| [`/experience`](https://zrl.dev/experience) | Professional experience |
| [`/certifications`](https://zrl.dev/certifications) | Certifications |
| [`/contact`](https://zrl.dev/contact) | Contact form (Cloudflare Turnstile and Resend) |

Additional public resources: [`/humans.txt`](https://zrl.dev/humans.txt), [`/security`](https://zrl.dev/security), [security.txt](https://zrl.dev/.well-known/security.txt).

## Technology

| Layer | Technologies |
|-------|----------------|
| Application | Remix, React, Vite |
| Motion and 3D | Framer Motion, Three.js (Draco) |
| Visualization | Recharts |
| Hosting | Vercel (production), Cloudflare (DNS and edge) |
| Contact | Cloudflare Turnstile, Resend (`contact@zrl.dev` / `no-reply@zrl.dev`) |
| Quality | Vitest, Codacy (grade and coverage), ESLint, TypeScript, CodeQL, TruffleHog, CycloneDX SBOM |

Visual system: Harvard Crimson (`#A51C30`), Gotham, IPA Gothic.

## Getting started

**Requirements:** Node.js 22.16 or later, npm.

```bash
git clone https://github.com/zrlopez/zrl.dev.git
cd zrl.dev
npm install
npm run dev
```

Local development server: [http://127.0.0.1:5173](http://127.0.0.1:5173)

```bash
npm test                 # unit and component tests
npm run test:coverage    # coverage report (lcov)
npm run build            # production build
npm run lint
npm run type-check
```

### Environment configuration

Local secrets are loaded from **`.dev.vars`** (Cloudflare / Wrangler convention; gitignored). A committed template is provided:

```bash
cp .dev.vars.example .dev.vars
```

Required keys for contact-form parity with production:

| Variable | Purpose |
|----------|---------|
| `SESSION_SECRET` | Theme session cookie signing |
| `RESEND_API_KEY` | Transactional email via Resend |
| `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile verification |
| `CONTACT_TO` / `CONTACT_FROM` | Mail routing (defaults to `contact@` / `no-reply@` on zrl.dev) |

Do not commit real credentials. Production values are set in the Vercel project environment.

## Deployment

Production deploys from the **`main`** branch on **Vercel**.

Optional Cloudflare Pages dual-build (npm, not pnpm):

| Setting | Value |
|---------|--------|
| Build command | `npm run pages:build` |
| Output directory | `build/client` |
| Functions entry | `functions/[[path]].js` → `build/server` |
| Node.js | 22 |

```bash
npm run build
# or
npm run pages:build
```

## Continuous integration

Workflow: [`.github/workflows/secured_ci.yml`](./.github/workflows/secured_ci.yml)

- Secret scanning (TruffleHog)
- Dependency audit
- TypeScript type check and ESLint
- CycloneDX SBOM generation
- CodeQL static analysis
- Vitest with coverage upload to Codacy
- Production build verification

## Credits

Layout foundation adapted from [Hamish Williams](https://hamishw.com) (MIT).  
Content, case studies, systems design, and imagery by Zachary Ryan Lopez.

## License

MIT. See [`LICENSE`](./LICENSE).
