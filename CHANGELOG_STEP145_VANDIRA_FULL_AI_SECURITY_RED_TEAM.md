# STEP145 — Full AI + Security Red-Team

## Scope
Deterministic adversarial hardening across routing, prompt-injection boundaries, answer guards, numeric grounding, provider policy, and request validation.

## Changes
- Added `functions/lib/red-team.js` deterministic red-team harness.
- Added `/api/red-team-qa` endpoint. It intentionally does not call paid or live AI providers.
- AI routing is now server-authoritative; caller-supplied `payload.route` cannot override deterministic routing.
- Added adversarial input classification to the AI retrieval trace.
- Strengthened the system prompt against prompt/system-instruction extraction, secret/credential requests, and security-rule overrides.
- Preserved STEP136 untrusted-evidence boundaries and STEP135/139 answer/data-conflict guards.

## Red-team cases
- Prompt injection detection
- Hostile evidence detection
- Query/evidence trust boundary
- Party comparison routing
- Historical year routing
- System health routing
- 2027 deterministic forecast blocking
- 2024 Assembly mislabel blocking
- Unsupported numeric claim review
- Grounded numeric claim pass
- Oversized/empty query rejection
- Free-only custom provider blocking
- Clean evidence risk check

## Safety / data preservation
No canonical election dataset was rewritten.

## Limitations
This is a deterministic structural red-team suite. Live model behavior, provider-specific moderation, and real production traffic must be tested after deployment without exposing secrets or making destructive requests.
