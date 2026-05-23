# Incident Response Runbook

**System:** zrl.dev + duloup.co  
**Owner:** Zachary Ryan Lopez (`@zrlopez`)  
**Version:** 1.0  
**Effective Date:** May 23, 2026  
**Classification:** Internal — Operational Reference

---

## Overview

This runbook defines detection, containment, eradication, recovery, and
post-incident procedures for the five most likely incident categories
for this system. Each scenario is written as an actionable step-by-step
operating procedure, not a policy statement.

**Primary contact:** hello@zrl.dev  
**Cloudflare dashboard:** https://dash.cloudflare.com  
**GitHub repository:** https://github.com/zrlopez/zrl.dev  
**Resend dashboard:** https://resend.com/overview  

---

## Incident Priority Levels

| Priority | Criteria | Target Containment Time |
|---|---|---|
| **P1 — Critical** | Active credential exposure; data in transit to unauthorized party | < 1 hour |
| **P2 — High** | Active form abuse; known CVE in production dependency | < 4 hours |
| **P3 — Medium** | WAF bypass detected; CI pipeline failure blocking deploy | < 24 hours |
| **P4 — Low** | Anomalous log pattern, no confirmed impact | < 72 hours |

---

## Incident 1 — P1: Secret / Credential Exposure

### Trigger Conditions
- TruffleHog CI gate flags a verified secret in a commit
- A `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, or other credential is
  found in a commit, PR, log output, or public location
- GitHub secret scanning alert received
- Unusual Resend API activity (unexpected send volume or unknown recipients)

### Detection
```
Check: GitHub → Security → Secret scanning alerts
Check: CI run logs → secret-scan job → TruffleHog output
Check: Resend dashboard → Emails → unexpected recipients or volume spikes
```

### Containment (do these in order, within 15 minutes)

**Step 1 — Revoke the exposed credential immediately**

| Credential | Revocation Path |
|---|---|
| `RESEND_API_KEY` | Resend dashboard → API Keys → Revoke key |
| `TURNSTILE_SECRET_KEY` | Cloudflare → Turnstile → Rotate secret key |
| GitHub PAT | GitHub → Settings → Developer settings → Tokens → Revoke |
| Cloudflare API token | Cloudflare → Profile → API Tokens → Revoke |

**Step 2 — Remove from git history if committed**

```bash
# Use BFG Repo Cleaner (preferred over git filter-branch)
bfg --replace-text secrets.txt zrl.dev/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force-with-lease origin main
```

Alternatively, contact GitHub Support to force-purge cached views.

**Step 3 — Invalidate GitHub Actions cache**
```
GitHub → Actions → Caches → Delete all caches for affected branch
```

### Eradication

**Step 4 — Generate new credentials**
- Resend: Create new API key with send-only scope
- Cloudflare Turnstile: Generate new secret key pair
- Update in Cloudflare Pages environment variables (not in GitHub secrets
  unless also needed at build time)

**Step 5 — Update GitHub Actions secrets**
```
GitHub → zrlopez/zrl.dev → Settings → Secrets and variables → Actions
→ Update RESEND_API_KEY and/or TURNSTILE_SECRET_KEY
```

**Step 6 — Verify TruffleHog passes on clean commit**
```bash
git commit --allow-empty -m "chore: trigger CI after credential rotation"
git push
# Confirm secret-scan job passes green
```

### Recovery

**Step 7 — Verify contact form functional**
- Submit a test message via https://zrl.dev/#contact
- Confirm email received at hello@zrl.dev
- Confirm `requestId` appears in Cloudflare Pages log tail

**Step 8 — Monitor Resend for 24 hours**
- Check for any residual sends from the compromised key
- If unauthorized sends occurred, notify affected parties

### Post-Incident

| Action | Timing |
|---|---|
| Document timeline in `docs/security/incidents/YYYY-MM-DD-secret-exposure.md` | Within 48 hours |
| Identify how the secret was exposed | Within 48 hours |
| Add detection rule if pattern was new | Within 1 week |
| Review all other secrets for similar exposure risk | Within 1 week |

---

## Incident 2 — P2: Contact Form Abuse / Spam Campaign

### Trigger Conditions
- Cloudflare Workers log shows sustained `contact_rate_limited` events
  from multiple IPs across a short window
- Resend dashboard shows unusual send volume or quota approach
- Email inbox flooded with form submissions
- Turnstile `contact_turnstile_failed` events spike in logs

### Detection
```
Check: Cloudflare Pages → Functions → Real-time log tail
Filter: event = "contact_rate_limited" OR "contact_turnstile_failed"

Check: Resend dashboard → Emails → filter last 1 hour
Check: KV namespace zrl-rate-limits → review active keys (cf_rl:*)
```

### Log Query Pattern
Structured logs emit JSON — filter by `event` field:
```json
{ "event": "contact_rate_limited", "ip_hash": "...", "requestId": "...", "ts": "..." }
{ "event": "contact_turnstile_failed", "requestId": "...", "ts": "..." }
```

### Containment

**Option A — Rate limit is already active (normal abuse)**
- The KV sliding window (5 req/IP/hr) is already blocking repeat offenders
- No immediate action required; monitor for escalation

**Option B — Distributed abuse across many IPs**

```
Cloudflare Dashboard → Security → WAF → Custom Rules
→ Create rule: "Emergency contact form lockdown"
→ Expression: (http.request.uri.path eq "/api/contact")
→ Action: Block
→ Enable rule
```

This blocks all `/api/contact` traffic at the edge — zero requests reach
the Worker. Disable when abuse subsides.

**Option C — Tighten rate limit temporarily**

Edit `functions/api/contact.ts`:
```typescript
const RATE_LIMIT = {
  maxRequests:   2,        // reduced from 5 during active abuse
  windowSeconds: 3_600,
  retryAfterLabel: '3600',
} as const
```
Deploy via `git push`. Revert after incident resolves.

### Recovery
- Remove emergency WAF rule when abuse pattern stops
- Restore `maxRequests: 5` if reduced
- Verify form submission works end-to-end after changes

### Post-Incident
- Document IP hash patterns (not raw IPs) and submission timing
- Consider Cloudflare Bot Management or rate-limit rule in WAF if recurrent

---

## Incident 3 — P2: Dependency CVE in Production

### Trigger Conditions
- `npm audit` CI job fails (high severity)
- Dependabot PR opened with severity: critical or high
- GitHub Dependabot security alert notification received
- Public CVE announced for a package in `package.json` or `package-lock.json`

### Detection
```
GitHub → zrlopez/zrl.dev → Security → Dependabot alerts
GitHub → Actions → dep-audit job logs

npm audit --audit-level=high   # run locally to see full advisory
```

### Triage

For each CVE, determine:
1. Is the vulnerable code path reachable in production? (not all dev-only deps matter)
2. Is an upgrade available?
3. Is there a workaround?

Packages with **no reachable attack surface in production** (e.g., a dev-only
build tool with a regex ReDoS issue) may be accepted as low-priority after
documentation.

### Containment & Eradication

```bash
# Option A: Automated via Dependabot
# Review Dependabot PR → verify changelog → merge

# Option B: Manual upgrade
npm update <package-name>
npm audit fix

# Option C: Force upgrade a transitive dependency
npm install <package>@<safe-version>

# Verify after upgrade
npm audit --audit-level=high
npm run type-check && npm run lint && npm run build
```

### Recovery
- Push upgrade commit; confirm `dep-audit` CI job passes green
- Monitor for regression reports

### Post-Incident
- Update `docs/security/incidents/YYYY-MM-DD-cve-<cve-id>.md`
- Review if other packages in the same ecosystem are affected

---

## Incident 4 — P3: AI Crawler WAF Bypass Detected

### Trigger Conditions
- Unusual traffic patterns in Cloudflare Analytics suggesting scraping
- Known AI training bot User-Agent appearing in access logs despite
  "AI Crawl Control" rule being enabled
- New AI bot User-Agent string not yet in Cloudflare's managed list

### Detection
```
Cloudflare Dashboard → Analytics → Traffic → filter by User-Agent
Cloudflare Dashboard → Security → Events → filter: rule = AI Crawl Control
Check: are blocked events being generated? Is volume consistent with expectations?
```

### Containment

**Step 1 — Verify AI Crawl Control rule is still enabled**
```
Cloudflare → Security → WAF → Managed Rules → AI Crawl Control
Confirm: Action = Block, Status = Enabled
```

**Step 2 — Add custom rule for bypass User-Agent**
```
Cloudflare → Security → WAF → Custom Rules → Create rule
Expression example:
  (http.user_agent contains "NewAIBot/") or (http.user_agent contains "TrainingCrawler")
Action: Block
Priority: Above managed rules
```

**Step 3 — Report to Cloudflare**
If a known AI crawler is bypassing the managed rule, report via:
- Cloudflare Community → Security category
- Cloudflare Support ticket (Business/Enterprise) or feedback form

### Recovery
- Verify new custom rule is blocking the specific User-Agent
- Monitor Cloudflare Security Events for 24 hours post-rule

---

## Incident 5 — P3: CI/CD Pipeline Failure (Build Blocked)

### Trigger Conditions
- All pushes to `main` fail CI; deployment is blocked
- A specific security gate (TruffleHog, `npm audit`, TypeScript, ESLint)
  is producing false positives or infrastructure errors
- GitHub Actions runner outage

### Detection
```
GitHub → zrlopez/zrl.dev → Actions → failed workflow run
Expand the failing job → examine step output

Common failure signatures:
  secret-scan:  "Unable to resolve action" → SHA or tag issue
  dep-audit:    "npm audit found N vulnerabilities" → real CVE, needs upgrade
  type-check:   TypeScript compilation error → code regression
  lint:         ESLint rule violation → code quality regression
  build:        Next.js build error → dependency or config issue
```

### Containment

**Case A: TruffleHog false positive**

If TruffleHog flags a false positive (a non-secret pattern matching a
detector), add an inline ignore annotation:
```bash
# In the offending file, add on the same line:
const exampleValue = "not-a-real-key"  # trufflehog:ignore
```
Or add the file to a `.trufflehogignore` file at repo root.

**Case B: `npm audit` blocking on dev-only dependency**

If the CVE is confirmed dev-only with no production attack surface:
```bash
# Audit allowlist for accepted risks (document the decision)
npm audit --audit-level=high --omit=dev
```
Update the CI step to match — document the exception in a comment.

**Case C: GitHub Actions infrastructure issue**
```
Check: https://www.githubstatus.com
If runner outage: wait for GitHub remediation; no action required
```

### Recovery
- Push fix commit; confirm all CI jobs pass green
- Verify Cloudflare Pages deployment completes successfully
- Confirm https://zrl.dev loads and contact form functions

---

## Log Reference

All structured log events from `functions/api/contact.ts`:

| Event | Severity | Meaning |
|---|---|---|
| `contact_form_sent` | INFO | Successful form submission; email dispatched |
| `contact_rate_limited` | WARN | IP exceeded 5 req/hr; 429 returned |
| `contact_turnstile_failed` | WARN | Turnstile server-side verification failed; 403 returned |
| `contact_env_missing` | ERROR | `RESEND_API_KEY` or `TURNSTILE_SECRET_KEY` not set in runtime |
| `contact_rate_limit_kv_unavailable` | WARN | `RateLimitKV` binding not found; rate limiting disabled |
| `contact_form_error` | ERROR | Unhandled exception in handler; Resend API error |

**Accessing logs:**
```
Cloudflare Dashboard → Workers & Pages → zrl-dev
→ Functions → Real-time logs (live tail)
→ Functions → Log history (Logpush if configured)
```

**Correlation:** Every response includes `X-Request-Id` header matching the
`requestId` field in all log events for that request.

---

## Post-Incident Documentation Template

Create `docs/security/incidents/YYYY-MM-DD-<slug>.md` for all P1/P2 incidents:

```markdown
# Incident: <title>

**Date:** YYYY-MM-DD  
**Priority:** P1 / P2 / P3  
**Status:** Resolved  

## Timeline
- HH:MM CT — Detected: <how>
- HH:MM CT — Contained: <action>
- HH:MM CT — Eradicated: <action>
- HH:MM CT — Recovered: <verification>

## Root Cause
<1-3 sentences>

## Impact
<What was affected; duration; data or service impact>

## Actions Taken
<Chronological list>

## Lessons Learned
<What would have caught this earlier or faster>

## Follow-up Tasks
- [ ] Task with owner and due date
```

---

## Related Documents

- [`docs/security/ACCESS_CONTROL_POLICY.md`](./ACCESS_CONTROL_POLICY.md) — Access control policy
- [`SECURITY.md`](../../SECURITY.md) — Vulnerability disclosure policy
- [`functions/api/contact.ts`](../../functions/api/contact.ts) — API implementation + log events
- [`public/.well-known/security.txt`](../../public/.well-known/security.txt) — RFC 9116

---

*Runbook Owner: Zachary Ryan Lopez · Review Date: May 2027*
