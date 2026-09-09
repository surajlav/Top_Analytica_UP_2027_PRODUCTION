# STEP113 — VANDIRA Political War Room

## Added
- `war-room.html` — unified command workspace.
- `functions/api/war-room.js` — no-store aggregation API.
- `data/vandira_war_room_contract_step113.json` — contract, evidence rules and safety guardrails.
- VANDIRA OS `political_war_room` route and deterministic routing/planning support.
- AI workspace menu entry.

## War Room loop
Detect → Verify → Contextualize → Prioritize → Decide → Review.

## Aggregated layers
- STEP100 proactive monitoring and alerts
- STEP99 daily briefing
- STEP110 Political Situation Room
- STEP111 Executive / Leadership Briefing
- STEP112 State → Region → District → Assembly → Booth context
- System/provider health

## Guardrails
- Current claims require fresh retrieval and attribution.
- Reported news remains attributed until verified.
- 2024 Lok Sabha is separate from Assembly results.
- Partial booth detail is not represented as a complete booth universe.
- No unsupported 2027 winner prediction or probability.
- No sensitive voter profiling, microtargeting, demographic inference, or autonomous campaign decisions.

## QA target
- JS syntax validation
- JSON validation
- canonical election data hashes unchanged
- production domain untouched
