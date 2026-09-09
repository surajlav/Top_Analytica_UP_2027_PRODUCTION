# STEP99 — VANDIRA Daily Briefing Engine

## Objective
Add a state/constituency daily political intelligence briefing layer built on STEP96 research planning, STEP97 evidence assessment and STEP98 user-controlled consultant context.

## Added
- `functions/api/daily-briefing.js`
- `data/vandira_daily_briefing_contract_step99.json`
- `CHANGELOG_STEP99_VANDIRA_DAILY_BRIEFING_ENGINE.md`

## Runtime
- `GET /api/daily-briefing?ac=252` for a constituency-scoped briefing.
- `GET /api/daily-briefing` for state-wide briefing.
- `POST /api/daily-briefing` accepts `ac_no`, sanitized `personal_context`, language context and optional provider.
- Retrieves current UP politics feed, Google News discovery, official-source connectors and verified election warehouse context.
- Uses configured AI provider when available; otherwise emits a deterministic evidence-listed fallback.

## Briefing protocol
What changed → Why it matters → Election/seat context → Evidence quality → Data gaps → VANDIRA assessment → What needs attention today → Sources.

## Integrity
No canonical election, constituency, candidate, party, booth, Form 20, ECI warehouse or historical data was modified.
2024 Lok Sabha context remains explicitly separate from 2024 Assembly results.

## Privacy / safety
STEP98 personal context remains optional and sanitized. No profile PII is requested or sent. No sensitive personal targeting or invented political forecasts are produced.

## Deployment
Production `up.topanalytica.in` is untouched. The endpoint requires Cloudflare Pages deployment to become live.
