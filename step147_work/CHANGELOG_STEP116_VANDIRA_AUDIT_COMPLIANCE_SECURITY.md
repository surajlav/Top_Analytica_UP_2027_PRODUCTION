# STEP116 — VANDIRA Audit / Compliance / Security Intelligence

## Purpose
Adds the L6 audit, compliance and security control layer without changing canonical election data.

## Added
- `functions/lib/audit-security.js`
  - bounded runtime audit event schema
  - sanitized metadata
  - security response headers
  - audit summary
- `functions/api/audit-security.js`
  - GET security/compliance status
  - POST bounded audit event endpoint
  - optional 30-day Cloudflare KV persistence via `VANDIRA_AUDIT_KV`
- `data/vandira_audit_compliance_security_contract_step116.json`
- `security.html`
- VANDIRA OS route: `audit_security`
- AI retrieval/evidence integration for audit/security queries
- AI workspace menu entry for Audit / Compliance / Security

## Controls
- No provider secrets exposed to browser responses.
- No profile PII or sensitive voter attributes in audit events.
- `Cache-Control: no-store` on the security API.
- CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy and Permissions-Policy headers.
- Durable audit is explicitly reported as configured/not configured; no tamper-proof claim without the KV binding.
- Compliance page is engineering status, not legal certification.
- Production `up.topanalytica.in` is not touched.

## QA
- JS syntax validation: PASS
- JSON validation: PASS
- Canonical election data hashes: unchanged
- AI route integration: PASS
- Security menu integration: PASS
