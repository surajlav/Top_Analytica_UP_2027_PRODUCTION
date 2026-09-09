# STEP97 — VANDIRA Evidence & Recommendation Protocol

## Objective
Create the consultant layer between evidence retrieval and final answer generation.

## Added
- `data/vandira_evidence_recommendation_protocol_step97.json`
- `functions/lib/evidence-protocol.js`
- `functions/api/consultant-assessment.js`

## Protocol
`Evidence → Quality → Freshness → Conflict Check → Sufficiency → Assessment → Next Best Action → Guardrails → Audit`

## Evidence assessment
- Source tier, structured-data status, official connector status, recency and query overlap contribute to an evidence score.
- Evidence is deduplicated before assessment.
- Current/latest claims require fresh evidence.
- Missing primary evidence, narrow evidence breadth and stale evidence are explicit gaps.
- Basic numeric disagreement detection flags potentially conflicting source claims for review.

## Recommendation behavior
Recommendations are bounded next research/operational information steps. They do not assert an election outcome or invent probabilities. Forecast queries remain scenario-based.

## AI integration
STEP96's research plan remains the planning layer. STEP97 adds the assessment/recommendation layer to the AI grounding and audit trace. Provider-generated prose still depends on the configured AI runtime.

## Integrity
No canonical election, constituency, party, booth/Form20 or historical dataset values are rewritten.
Production `up.topanalytica.in` is untouched.
