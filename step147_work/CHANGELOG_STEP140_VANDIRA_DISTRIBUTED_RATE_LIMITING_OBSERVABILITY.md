# STEP140 — Distributed Rate Limiting, Abuse Protection & Production Observability

## Scope
Production hardening built on STEP139 without modifying canonical election datasets.

## Changes
- Added Cloudflare KV best-effort distributed rate-limit backend with local-isolate enforcement retained as a safety fallback.
- Added explicit rate-limit backend metadata and `X-RateLimit-Policy` response header.
- Added request-level runtime events with request ID, route, method, status and duration only.
- Added slow/error event persistence to optional `VANDIRA_OBSERVABILITY_KV`; 2% success sampling avoids writing every request.
- Added `Server-Timing` latency header.
- Added sanitized `/api/observability` endpoint exposing backend configuration status only.
- Expanded `/api/security-qa` with distributed-limiter, observability and payload-redaction checks.
- Added Cloudflare KV binding placeholders to `wrangler.toml`; production namespace IDs are intentionally not invented.
- Kept existing audit KV (`VANDIRA_AUDIT_KV`) separate from observability KV.

## Important limitation
Cloudflare KV does not provide atomic counters. STEP140 therefore treats the distributed limiter as **best effort**, while local-isolate limiting remains active. For strict globally atomic enforcement at scale, configure Cloudflare Rate Limiting or a Durable Object before exposing sensitive POST APIs broadly.

## Data integrity
No canonical election data, warehouse records, party summaries, Form20 records, booth data, or source values were rewritten.
