# Security Policy

**System:** `zrl.dev`  
**Owner:** Zachary Ryan Lopez (`@zrlopez`)  
**Last Updated:** August 30, 2026

---

## Supported Versions

| Version / branch | Status | Notes |
|---|---|---|
| `main` | Supported | Current production branch for the Cloudflare Pages project |
| `chore/revamp-portfolio` and other preview branches | Best effort | Design and migration work may not yet expose the full production control set |
| Historical commits | Unsupported | No security backports |

---

## Reporting a Vulnerability

If you discover a security vulnerability in this repository or the live
`zrl.dev` service, please report it privately. Do not open a public GitHub
issue for security reports.

### Preferred contact

- Email: `hello@zrl.dev`
- Subject: `[SECURITY] <brief description>`
- Canonical disclosure file: `https://zrl.dev/.well-known/security.txt`

### Please include

- A short description of the issue
- Steps to reproduce
- Expected impact
- Whether the issue affects production, a preview deployment, or source only
- Any suggested mitigation, if you have one

### Response targets

- Initial acknowledgement: within 5 business days
- Triage decision: as quickly as practical after reproduction
- Coordinated disclosure: preferred after a fix or mitigation is in place

---

## Scope

This policy applies to:

- The `zrlopez/zrl.dev` repository
- The production `zrl.dev` website
- Preview deployments generated from this repository
- Security-sensitive GitHub Actions workflows for this repository

Out of scope:

- Third-party service vulnerabilities that do not arise from this repository's configuration or use
- General spam or abusive traffic without a concrete vulnerability
- Social engineering attempts
- Physical access scenarios outside the service boundary

---

## Current Security Posture

As of August 30, 2026, the production deployment and the revamp branch are not
identical.

### Production (`main`)

- Cloudflare Pages project: `zrl-dev`
- Production branch in Cloudflare Pages: `main`
- Cloudflare Pages Functions remain enabled for production
- Cloudflare-backed rate limiting remains active at the platform level
- Cloudflare zone protections include custom firewall rules and managed DDoS protection
- Repository CI includes secret scanning, dependency audit, SBOM generation, CodeQL, tests, lint, and type checking

### Revamp branch status

- The security-focused CI workflows have been ported into the Remix revamp branch
- Contact on the revamp branch now uses the Remix action in `app/routes/contact/contact.jsx` with:
  - Cloudflare Turnstile siteverify (`action=contact`, hostname allowlist)
  - Resend mail delivery (same path as production `main`)
  - shared sanitizers in `app/utils/security.js`
  - rate limiting via Cloudflare `RateLimitKV` when bound, otherwise per-isolate memory
  - honeypot field retained as defense-in-depth
- Application-level CSP and baseline security headers are declared in `vercel.json` and `public/_headers`
- Full nonce-based CSP parity with the old Next.js `middleware.ts` is still a follow-up

If you are evaluating a vulnerability, please note whether it affects:

- deployed production on `main`
- a preview deployment
- or only the in-repo revamp source

---

## Workflow Security

The main CI workflow is [secured_ci.yml](.github/workflows/secured_ci.yml).
It currently uses least-privilege defaults for `GITHUB_TOKEN`, pinned actions
for several critical steps, and multiple security gates.

Security-relevant workflow coverage includes:

- TruffleHog secret scanning
- `pnpm audit` at high severity threshold
- CodeQL analysis
- CycloneDX SBOM generation
- test, lint, and type-check gates

The repository also includes a Dependabot automation workflow at
[dependabot-auto-approve.yml](.github/workflows/dependabot-auto-approve.yml).
Because it uses `pull_request_target` and write permissions, it should remain
restricted to trusted automation behavior only.

---

## Disclosure Expectations

Please give me a reasonable opportunity to investigate and mitigate reported
issues before public disclosure. Good-faith research is appreciated, and I am
happy to credit researchers who coordinate disclosure responsibly.

---

## Related Documents

- [docs/security/ACCESS_CONTROL_POLICY.md](docs/security/ACCESS_CONTROL_POLICY.md)
- [docs/security/INCIDENT_RESPONSE_RUNBOOK.md](docs/security/INCIDENT_RESPONSE_RUNBOOK.md)
- [public/.well-known/security.txt](public/.well-known/security.txt)
