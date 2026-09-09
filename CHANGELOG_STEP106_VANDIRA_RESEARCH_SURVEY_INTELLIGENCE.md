# STEP106 — VANDIRA Research & Survey Intelligence

## Objective
Add a research/survey evidence layer that separates official electoral facts, scientific surveys, field reports, media signals, discovery leads and AI analysis, and assesses survey metadata before it is used as evidence.

## Added
- `functions/api/research-survey-intelligence.js`
- `data/vandira_research_survey_intelligence_contract_step106.json`
- `research.html`

## Runtime
- GET endpoint exposes research framework and explicit data-gap status.
- POST endpoint performs deterministic metadata quality assessment.
- Quality checks: sample size, constituency coverage, fieldwork date, methodology, weighting, questionnaire availability, margin of error and sponsor disclosure.
- Grades: high / medium / low / insufficient.
- Missing methodology is surfaced as a gap rather than guessed.
- No fabricated survey responses are embedded.

## AI integration
- Added `research_survey_intelligence` route to VANDIRA OS.
- Added survey metadata validation execution step.
- Added Research & Survey evidence retrieval to `/api/ai` and audit trace.
- Survey evidence is explicitly separated from election results and forecasts.

## Guardrails
- Survey result is not an election result.
- No representativeness claim without sampling-frame evidence.
- No sensitive demographic inference.
- No voter profiling.
- No 2027 outcome prediction from survey metadata alone.

## Integrity
- Existing canonical election data is preserved byte-for-byte.
- Existing 403-seat warehouse and prior intelligence layers are additive only.
- Production `up.topanalytica.in` is untouched.
