# Access Control Policy

**System:** `zrl.dev`  
**Owner:** Zachary Ryan Lopez (`@zrlopez`)  
**Version:** 1.1  
**Effective Date:** August 30, 2026  
**Review Cycle:** Annual or upon material infrastructure change  
**Classification:** Internal — Engineering & Compliance Reference

---

## 1. Purpose

This policy defines how access to systems, services, credentials, and
automation supporting `zrl.dev` is granted, reviewed, limited, and revoked.
It is intended to reflect the current split state of the project:

- production remains on the `main` branch and Cloudflare Pages Functions
- the Remix revamp branch is in migration and does not yet mirror every
  production-side control in source

Standards alignment references:

- **NIST CSF 2.0 PR.AA** — Identity, Authentication, and Access Control
- **NIST SP 800-61 Rev. 3** — Incident response integration guidance
- **SOC 2 CC6 / CC7** — Logical access and monitoring controls
- **RFC 9116** — Coordinated vulnerability disclosure

---

## 2. Scope

This policy applies to:

| System | Role |
|---|---|
| Cloudflare zone `zrl.dev` | DNS, WAF, DDoS, edge policy |
| Cloudflare Pages project `zrl-dev` | Production and preview deployment runtime |
| GitHub repository `zrlopez/zrl.dev` | Source control and review surface |
| GitHub Actions workflows | CI, code scanning, SBOM, test gates |
| Mail delivery providers used by the app | Contact-form delivery path |

This policy does not treat historical branches as supported production systems.

---

## 3. Access Control Principles

### 3.1 Least privilege

Every human account, workflow token, and service integration should hold only
the permissions required for its current task.

### 3.2 Separation of duties

Source control, CI, deployment configuration, and runtime secrets are kept in
separate control planes where possible.

### 3.3 MFA for privileged accounts

Privileged access to GitHub, Cloudflare, registrars, and mail providers must
be protected by MFA or passkey-backed authentication.

### 3.4 Evidence over assumption

Controls should be documented from live configuration or current repository
state. When source and deployment diverge, the difference must be called out
explicitly.

---

## 4. Identity and Authentication Requirements

| Account / principal | MFA required | Notes |
|---|---|---|
| GitHub owner account | Yes | Administrative control over source and workflows |
| Cloudflare account access | Yes | Administrative control over zone and Pages |
| Domain registrar access | Yes | DNS ownership continuity |
| Mail provider access | Yes | Contact-path integrity |

An account without MFA should be treated as a critical issue and remediated as
quickly as practical.

---

## 5. GitHub Access Controls

### 5.1 Repository roles

| Principal | Access | Notes |
|---|---|---|
| `@zrlopez` | Admin | Primary maintainer |
| `GITHUB_TOKEN` in CI | Minimal per workflow | Default `contents: read`, elevated only where required |
| Dependabot automation | Limited automation scope | Used for dependency PR workflows |
| External contributors | Standard PR model | No implicit write access |

### 5.2 Current workflow posture

The primary CI workflow is
[`.github/workflows/secured_ci.yml`](.github/workflows/secured_ci.yml).
It currently includes:

- least-privilege default `permissions`
- TruffleHog secret scanning
- high-severity dependency audit with `pnpm audit`
- CodeQL analysis
- CycloneDX SBOM generation
- test, lint, and type-check gates

The repository also includes
[`.github/workflows/dependabot-auto-approve.yml`](.github/workflows/dependabot-auto-approve.yml),
which uses `pull_request_target` with write permissions for Dependabot-only
automation. Because `pull_request_target` is a higher-trust trigger, this
workflow should remain narrow and should never execute untrusted PR code.

### 5.3 Branch protection

Branch protection and required checks should be treated as preferred practice
for `main`, especially if write access expands beyond the current maintainer.

---

## 6. Cloudflare Access Controls

### 6.1 Zone and Pages state

Live Cloudflare configuration checked on August 30, 2026 shows:

| Control plane | Current state |
|---|---|
| Zone | `zrl.dev` active on account `duloup-domains` |
| Pages project | `zrl-dev` exists and tracks GitHub repo `zrlopez/zrl.dev` |
| Production branch | `main` |
| Preview deployments | Enabled for all branches |
| Functions | In use on the live Pages project |

### 6.2 Rate limiting

Rate limiting is still present in the live Cloudflare configuration, but the
implementation path is now split across deployment state and source history.

What is confirmed:

- the `zrl.dev` zone has an active `http_ratelimit` ruleset entrypoint
- the Cloudflare Pages project still carries production configuration related
  to `zrl-rate-limits`

What is not true in the revamp branch:

- the old `functions/api/contact.ts` implementation from `main` is not present
- the revamp source tree does not currently show the original KV-backed
  application handler end to end

For this reason, rate limiting should be documented as a live production
control, but not as a fully ported revamp-branch source control.

### 6.3 Firewall and DDoS protections

Live Cloudflare configuration also confirms:

- a custom firewall ruleset is active on the zone
- managed L7 DDoS protection is present

The exact bot-block expression should be treated as operational configuration
rather than hardcoded repository policy text, because it may change over time.

### 6.4 DNS access

DNS authority remains inside Cloudflare for `zrl.dev`. Any DNS change should be
treated as privileged infrastructure work.

---

## 7. Application and Mail Controls

### 7.1 Production path on `main`

The `main` branch includes a Pages Function at `functions/api/contact.ts` that
implements:

- strict JSON handling
- Turnstile verification
- request-size limits
- input sanitization and HTML escaping
- KV-backed contact rate limiting
- structured request logging with `requestId`

### 7.2 Current revamp branch

The current revamp branch handles contact form submission in
[app/routes/contact/contact.jsx](app/routes/contact/contact.jsx).
That code currently uses:

- a server action
- AWS SES delivery
- a honeypot field
- server-side length and pattern checks

It does **not** currently demonstrate the same Turnstile, KV, and structured
logging controls that existed in the legacy production handler.

---

## 8. Evidence References

| Claim | Evidence |
|---|---|
| CI uses least-privilege defaults | [secured_ci.yml](.github/workflows/secured_ci.yml) |
| Dependabot automation uses `pull_request_target` | [dependabot-auto-approve.yml](.github/workflows/dependabot-auto-approve.yml) |
| Revamp contact flow is Remix action based | [contact.jsx](app/routes/contact/contact.jsx) |
| Legacy production handler carried Turnstile and KV rate limiting | `main:functions/api/contact.ts` |
| RFC 9116 disclosure file exists | [public/.well-known/security.txt](public/.well-known/security.txt) |

---

## 9. Access Review and Revocation

| Trigger | Required action |
|---|---|
| Suspected credential compromise | Revoke, rotate, and verify dependent services |
| Maintainer or collaborator offboarding | Remove access promptly and review secret scope |
| Workflow privilege expansion | Re-review token permissions and trigger model |
| Material platform change | Update this policy and the incident runbook |

---

## 10. Exceptions

Exceptions must be time-bounded, documented, and revisited. Migration drift
between production and the revamp branch is a temporary state, not a permanent
exception to the underlying access-control model.

---

## 11. Related Documents

- [`docs/security/INCIDENT_RESPONSE_RUNBOOK.md`](./INCIDENT_RESPONSE_RUNBOOK.md)
- [`SECURITY.md`](../../SECURITY.md)
- [`public/.well-known/security.txt`](../../public/.well-known/security.txt)

---

*Policy Owner: Zachary Ryan Lopez · Next Review: August 2027*
