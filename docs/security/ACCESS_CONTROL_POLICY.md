# Access Control Policy

**System:** zrl.dev + duloup.co  
**Owner:** Zachary Ryan Lopez (`@zrlopez`)  
**Version:** 1.0  
**Effective Date:** May 23, 2026  
**Review Cycle:** Annual or upon material infrastructure change  
**Classification:** Internal — Engineering & Compliance Reference

---

## 1. Purpose

This policy defines how access to all systems, services, credentials, and
infrastructure components supporting `zrl.dev` and `duloup.co` is granted,
controlled, reviewed, and revoked. It implements the principle of least
privilege across every control plane and data plane touchpoint.

This document satisfies:
- **NIST CSF PR.AC** — Identity Management and Access Control
- **SOC 2 CC6.1** — Logical and Physical Access Controls
- **GDPR Art. 32** — Security of Processing
- **ISO 27001 A.9** — Access Control

---

## 2. Scope

This policy applies to:

| System | Role |
|---|---|
| Cloudflare Pages (`zrl-dev`) | Deployment runtime + edge network |
| Cloudflare WAF | Network threat mitigation |
| Cloudflare KV (`zrl-rate-limits`) | Rate-limit counter store |
| GitHub (`zrlopez/zrl.dev`) | Source code + CI/CD |
| GitHub Actions | Automated build + security gates |
| Resend | Transactional email delivery |
| Domain registrar | DNS + domain ownership |

---

## 3. Access Control Principles

### 3.1 Least Privilege

Every principal (human, service account, CI job) is granted the minimum
permissions required to perform its defined function. Permissions are never
granted speculatively or "just in case."

### 3.2 Separation of Concerns

CI/CD secrets are never exposed to the build artifact. Runtime secrets exist
only in Cloudflare Pages environment variables — never in source code,
`.env` files committed to the repository, or GitHub Actions logs.

### 3.3 No Standing Privileged Access

There are no persistent admin sessions. All privileged operations (deploy,
credential rotation, WAF rule change) are performed via dashboard or API
with MFA-protected accounts.

### 3.4 Audit by Default

All access-relevant events are logged with a `requestId` correlation
identifier. No personally identifiable data (raw IPs) is written to logs.

---

## 4. Identity & Authentication Requirements

| Account | MFA Required | Credential Type | Review Cadence |
|---|---|---|---|
| Cloudflare account | ✅ Yes | Password + TOTP | Annual |
| GitHub account (`@zrlopez`) | ✅ Yes | Password + TOTP/passkey | Annual |
| Resend account | ✅ Yes | Password + TOTP | Annual |
| Domain registrar | ✅ Yes | Password + TOTP | Annual |

**All accounts must have MFA enabled.** An account without MFA is a critical
security finding and must be remediated within 24 hours of discovery.

---

## 5. GitHub Access Controls

### 5.1 Repository Permissions

| Principal | Permission Level | Justification |
|---|---|---|
| `@zrlopez` (owner) | Admin | Sole maintainer |
| GitHub Actions (`GITHUB_TOKEN`) | `contents: read` (default) | Least-privilege; no write needed for CI |
| Dependabot | PR creation only | Automated dependency updates |
| External collaborators | None (public repo, read-only fork) | No write access granted |

### 5.2 Branch Protection (Recommended — not yet enforced)

The following branch protection rules are recommended for `main`:
- Require status checks to pass before merging (all CI jobs)
- Require at least 1 approving review for non-owner PRs
- Disallow force pushes
- Disallow branch deletion

> **Note:** As a solo project, branch protection is not currently enforced.
> If collaborators are added, this must be activated immediately.

### 5.3 CI/CD Secret Scope

All secrets are stored as **GitHub Actions repository secrets**, not
environment or organization secrets. Scope is limited to this repository.

| Secret Name | Purpose | Rotation Cadence |
|---|---|---|
| `RESEND_API_KEY` | Resend email API authentication | Every 90 days or on suspected compromise |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile server-side verification | Every 90 days or on suspected compromise |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile public site key (not secret, but scoped) | On site key rotation |

CI build stubs (`ci-stub-*-not-real`) are hardcoded non-functional placeholders
used only to satisfy build-time environment validation. They are not credentials.

---

## 6. Cloudflare Access Controls

### 6.1 Pages Deployment

| Control | State |
|---|---|
| Deployment trigger | Git push to `main` via GitHub integration |
| Manual deploy access | Owner account only (MFA required) |
| Preview deployments | Disabled for production (`zrl.dev`) |
| Environment variable access | Owner account only; not exposed in build logs |

### 6.2 KV Namespace — `zrl-rate-limits` (RateLimitKV)

**Status: ✅ Configured and bound**

| Control | Value |
|---|---|
| Binding name | `RateLimitKV` |
| Namespace | `zrl-rate-limits` |
| Access | Cloudflare Worker runtime only (no public API access) |
| Key schema | `cf_rl:{ip}` (IP is hashed at log time; raw IP used only as KV key within Cloudflare infrastructure) |
| TTL | 3,600 seconds (1-hour sliding window) |
| Fail behavior | Fail-open with structured warning log — never breaks form |
| Data classification | Transient operational counters; no PII stored at rest |

### 6.3 WAF Rules — Confirmed Active

| Rule | Status | Scope |
|---|---|---|
| **AI Crawl Control** — Block AI bots by User-Agent | ✅ **Enabled** | Zone-wide; blocks known AI training crawlers (GPTBot, ClaudeBot, CCBot, etc.) |
| **SSL/TLS DDoS Attack Protection** | ✅ **Enabled** | Protects TLS handshake layer against volumetric SSL exhaustion attacks |
| **Network-layer DDoS Attack Protection** | ✅ **Enabled** | L3/L4 volumetric and protocol attack mitigation; automatic adaptive thresholds |

**AI Crawl Control scope:** Cloudflare's managed "AI Crawl Control" ruleset
matches User-Agent strings associated with AI training data collection
(including but not limited to GPTBot, ClaudeBot, CCBot, Bytespider,
Diffbot, ImgProxyBot). The rule action is **Block** — requests matching
these patterns receive a 403 response and are not forwarded to the origin.
This protects content from being used for model training without consent.

### 6.4 DNS Access

- DNS records managed exclusively within Cloudflare dashboard
- Cloudflare Proxy (orange cloud) enabled on `zrl.dev` A/AAAA records — origin IP is not exposed
- No third-party DNS access granted

---

## 7. Resend Access Controls

| Control | Value |
|---|---|
| API key scope | Send-only (no read/list access to message history) |
| Key storage | Cloudflare Pages environment variable (`RESEND_API_KEY`) |
| Key never in | Source code, `.env` files, CI logs, git history |
| Authorized sender domain | `zrl.dev` (verified) |
| Recipient whitelist | `hello@zrl.dev` only (hardcoded in `contact.ts`) |
| `reply_to` field | User-supplied email — RFC 5321 sanitized, not HTML-encoded |

The hardcoded `to: ['hello@zrl.dev']` in `contact.ts` ensures the Resend API
can never be abused to forward mail to arbitrary addresses, even if input
validation were bypassed.

---

## 8. Principle of Least Privilege — Verification Evidence

| Claim | Evidence Location |
|---|---|
| CI jobs use `permissions: contents: read` | `.github/workflows/ci.yml` — per-job `permissions` block |
| No secrets in build artifact | CI artifact scoped to `.next/BUILD_ID` only |
| No raw IP in logs | `contact.ts` — `hashIp()` SHA-256 before any log write |
| Resend `to` hardcoded | `contact.ts` — `to: ['hello@zrl.dev']` literal |
| KV data is transient | TTL = 3,600s; no persistence beyond rate window |
| WAF blocks AI crawlers | Cloudflare dashboard — AI Crawl Control: Enabled |

---

## 9. Access Review & Revocation

| Trigger | Action Required |
|---|---|
| Annual review | Audit all account permissions; rotate credentials older than 90 days |
| Suspected credential compromise | Follow Incident Response Runbook — P1 Secret Exposure |
| Collaborator offboarding | Remove GitHub collaborator access within 24 hours; rotate any shared secrets |
| Third-party service breach | Rotate all credentials for affected service within 4 hours |
| MFA device lost/replaced | Immediately revoke old MFA; re-enroll new device; verify access |

---

## 10. Exceptions

No exceptions to this policy are currently granted. Any proposed exception
must be documented with:
- Business justification
- Risk acceptance statement
- Compensating control
- Expiry date (maximum 90 days)

---

## 11. Related Documents

- [`docs/security/INCIDENT_RESPONSE_RUNBOOK.md`](./INCIDENT_RESPONSE_RUNBOOK.md) — Operational response procedures
- [`SECURITY.md`](../../SECURITY.md) — Vulnerability disclosure policy
- [`public/.well-known/security.txt`](../../public/.well-known/security.txt) — RFC 9116 disclosure
- [`functions/api/contact.ts`](../../functions/api/contact.ts) — API security implementation
- [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) — CI security gates

---

*Policy Owner: Zachary Ryan Lopez · Review Date: May 2027*
