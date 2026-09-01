# zrl.dev

**[zrl.dev](https://zrl.dev)** — portfolio of **Zachary Ryan Lopez**, AI/ML Data Operations Analyst (Austin, TX).

Annotation QA, ML incident response, durable agent systems, and the tools behind them.

[![Live site](https://img.shields.io/badge/live-zrl.dev-A51C30?style=flat-square)](https://zrl.dev)
[![Stack](https://img.shields.io/badge/stack-Remix%20%2B%20Vite%20%2B%20Vercel-111111?style=flat-square)](https://zrl.dev/tools)

<p align="center">
  <img src="public/social-image.png" alt="zrl.dev" width="720" />
</p>

## What’s here

| Path | |
|------|--|
| [`/`](https://zrl.dev/) | Intro, featured projects, profile |
| [`/projects`](https://zrl.dev/projects) | Project archive |
| [`/projects/annotation-dashboard`](https://zrl.dev/projects/annotation-dashboard#live-demo) | **Live** annotation analytics demo (6 tabs) |
| [`/projects/ai-agent-platform`](https://zrl.dev/projects/ai-agent-platform) | Cross-agent orchestration case study |
| [`/projects/ml-incident-response`](https://zrl.dev/projects/ml-incident-response) | MLOps incident / runbook system |
| [`/tools`](https://zrl.dev/tools) | Tools & Skills |
| [`/experience`](https://zrl.dev/experience) | Experience |
| [`/certifications`](https://zrl.dev/certifications) | Certifications |
| [`/contact`](https://zrl.dev/contact) | Contact (Turnstile + Resend) |

Also: [`/humans.txt`](https://zrl.dev/humans.txt) · [`/security`](https://zrl.dev/security) · [security.txt](https://zrl.dev/.well-known/security.txt)

## Stack

- **App:** Remix, React, Vite  
- **Motion / 3D:** Framer Motion, Three.js (Draco)  
- **Charts:** Recharts (annotation demo)  
- **Deploy:** Vercel (production) · Cloudflare DNS / edge  
- **Contact:** Cloudflare Turnstile · Resend · `contact@` / `no-reply@` on zrl.dev  

Visual system: Harvard Crimson `#A51C30` · Gotham + IPA Gothic.

## Develop

```bash
npm install
npm run dev          # http://127.0.0.1:5173
npm test
npm run build
```

Optional:

```bash
npm run dev:storybook
npm run lint
npm run type-check
```

Copy `.dev.vars.example` → `.dev.vars` for local contact / session secrets. Never commit real keys.

## Deploy

Production tracks **`main`**. Pushes to `main` deploy on Vercel.

Preview deploys ship from feature branches (may require Vercel SSO).

## Credits

Layout foundation: [Hamish Williams](https://hamishw.com) portfolio (MIT).  
Content, case studies, systems, and imagery: Zachary Ryan Lopez.

## License

MIT — see [`LICENSE`](./LICENSE).
