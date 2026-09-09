# STEP105 — VANDIRA Issue & Ground Intelligence

## Added
- `functions/api/issue-ground-intelligence.js`
- `data/vandira_issue_ground_intelligence_contract_step105.json`
- `issue-ground.html`
- AI retrieval integration in `functions/api/ai.js`

## Intelligence scope
- Issue signal extraction across infrastructure, employment, agriculture, education, health, governance, law & order, and prices/cost.
- Constituency-aware retrieval when AC/entity is resolved.
- Current political/news snapshot used only as an evidence lead.
- Ground/survey evidence status explicitly surfaced.

## Guardrails
- News mentions are not treated as constituency-wide public opinion.
- No sensitive demographic inference or voter profiling.
- No unsupported "top issue" claim without representative survey/ground evidence.
- Current claims require fresh retrieval.
- No 2027 outcome prediction.
- Existing canonical election data remains read-only.
