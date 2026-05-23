# Security Policy

**System:** zrl.dev + duloup.co  
**Owner:** Zachary Ryan Lopez (`@zrlopez`)  
**Last Updated:** May 23, 2026  

---

## Supported Versions

| Version | Supported |
|---|---|
| Latest (`main`) | ✅ |
| All prior commits | ❌ |

---

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it
responsibly. **Do not open a public GitHub issue.**

### How to Report

- **Email:** hello@zrl.dev
- **Subject line:** `[SECURITY] <brief description>`
- **Disclosure document:** https://zrl.dev/.well-known/security.txt (RFC 9116)
- **Response time:** Within 5 business days for initial acknowledgement

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigations (optional but appreciated)

---

## Scope

This policy covers:
- [zrl.dev](https://zrl.dev) — primary portfolio site
- [duloup.co](https://duloup.co) — brand site
- Any associated GitHub repositories under [@zrlopez](https://github.com/zrlopez)

## Out of Scope

- Issues in third-party services (Cloudflare, Resend, GitHub infrastructure)
- Social engineering attempts
- Denial of service
- Physical security
- Vulnerabilities requiring authenticated access (no auth system exists)

---

## Infrastructure Security Controls

The following controls are active as of the last-updated date above:

| Control | Status | Details |
|---|---|---|
| **WAF — AI Crawl Control** | ✅ Enabled | Blocks AI training bots by User-Agent (zone-wide, action: Block) |
| **WAF — SSL/TLS DDoS Protection** | ✅ Enabled | TLS exhaustion attack mitigation at Cloudflare edge |
| **WAF — Network-layer DDoS Protection** | ✅ Enabled | L3/L4 volumetric + protocol attack mitigation |
| **Rate Limiting** | ✅ Active | 5 requests / IP / hour via Cloudflare KV (`RateLimitKV` bound) |
| **Cloudflare Turnstile** | ✅ Active | Server-side verification on every contact form submission |
| **Secret Scanning** | ✅ CI gate | TruffleHog `@v3` on every push and PR to `main` |
| **Dependency Scanning** | ✅ CI gate | `npm audit --audit-level=high` on every push and PR |
| **SBOM** | ✅ Per-commit | CycloneDX JSON artifact, 30-day retention |
| **Structured Logging** | ✅ Active | JSON event logs with `requestId` — no raw IPs stored |
| **RFC 9116 Disclosure** | ✅ Active | `/.well-known/security.txt` with contact + expiry |

---

## Disclosure Policy

After a fix is deployed, vulnerabilities may be publicly disclosed with the
reporter's consent. Credit will be given to researchers who follow responsible
disclosure. Coordinated disclosure window: **90 days** from initial report,
or sooner if a patch is available.

---

## Compliance Alignment

This codebase and infrastructure are designed in alignment with:

- **GDPR Art. 25 / 32** — Privacy by design; no PII in logs; hashed IP for rate limiting
- **NIST CSF** — Identify, Protect, Detect, Respond controls implemented
- **SOC 2 CC6 / CC7** — Logical access controls; operational logging
- **OWASP Top 10** — All applicable categories addressed (see audit report)

---

## Security Documentation

| Document | Description |
|---|---|
| [`docs/security/ACCESS_CONTROL_POLICY.md`](docs/security/ACCESS_CONTROL_POLICY.md) | Formal access control policy (least privilege, credential lifecycle, WAF/KV state) |
| [`docs/security/INCIDENT_RESPONSE_RUNBOOK.md`](docs/security/INCIDENT_RESPONSE_RUNBOOK.md) | Operational runbook: secret exposure, form abuse, CVE, AI bypass, CI failure |
| [`public/.well-known/security.txt`](public/.well-known/security.txt) | RFC 9116 coordinated disclosure |
| [`functions/api/contact.ts`](functions/api/contact.ts) | API implementation with inline security control documentation |
| [`src/lib/security.ts`](src/lib/security.ts) | Shared security utilities (sanitization, validation, HTML escaping) |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | CI security gates (TruffleHog, npm audit, TypeScript, ESLint, SBOM) |
| [`.github/dependabot.yml`](.github/dependabot.yml) | Automated dependency monitoring |

---

*Policy Owner: Zachary Ryan Lopez — Review cycle: Annual or on material infrastructure change*
