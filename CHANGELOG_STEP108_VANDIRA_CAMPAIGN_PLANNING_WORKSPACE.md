# STEP108 — VANDIRA Campaign Planning Workspace

Built from STEP107 without altering canonical election datasets.

## Added
- `functions/api/campaign-planning.js`
- `data/vandira_campaign_planning_contract_step108.json`
- `campaign.html`
- AI campaign-planning retrieval integration
- VANDIRA OS campaign-planning route and execution plan
- AI workspace menu link

## Planning model
State → Region → District → Assembly → Objective → Workstreams → Timeline → Feedback → Review.

## Guardrails
- No sensitive voter profiling or sensitive-attribute targeting.
- No unsupported 2027 outcome forecasts.
- No invented ground reports.
- News frequency is not treated as public opinion.
- Material planning changes should carry evidence and date.

## QA
- JS syntax PASS
- JSON validation PASS
- Existing datasets preserved
- Production `up.topanalytica.in` untouched
