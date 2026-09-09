# STEP137 — VANDIRA API Security & Production Hardening

## Objective
Harden the API/runtime boundary without changing canonical election data or existing intelligence content.

## Implemented
- Added `functions/_middleware.js` as the global Pages Functions security boundary.
- Added `functions/lib/api-security.js` with:
  - same-origin / explicit-origin CORS allowlisting
  - security headers
  - request IDs
  - method allowlist
  - per-isolate route/IP rate limiting
  - JSON/body-size validation
  - AI input schema limits
  - public retrieval-trace minimization
- Removed legacy wildcard `Access-Control-Allow-Origin: *` declarations from API modules.
- Added static `/_headers` security baseline including HSTS, CSP, clickjacking and MIME protections.
- `/api/ai` now rejects malformed JSON and overlong/invalid inputs before expensive retrieval/model work.
- `/api/ai` public retrieval trace no longer exposes provider model/attempt details by default.
- Added `/api/security-qa` deterministic regression endpoint.

## Data Integrity
No canonical election dataset was modified.

Canonical SHA-256:
`195a68687e31981982f32850219907a929ac39d2dbf0a6649a6cf55884bc2944`

## QA
- 51 JS files: 0 syntax failures
- 87 JSON files: 0 parse failures
- 29 HTML pages: 0 missing local references
- 0 wildcard CORS declarations remaining in API source

## Limitations / next hardening
- Current rate limiter is per Cloudflare isolate, not globally distributed.
- CSP still permits `unsafe-inline` for compatibility with the existing application; nonce/hash migration is a future hardening step.
- Durable API abuse controls can be strengthened with Cloudflare KV/Durable Objects and authenticated admin scopes.
