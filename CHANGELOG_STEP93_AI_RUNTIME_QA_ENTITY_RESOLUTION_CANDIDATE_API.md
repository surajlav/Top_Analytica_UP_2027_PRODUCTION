# STEP93 — VANDIRA AI Runtime QA + Entity Resolution + Candidate Intelligence API

## Objective
Close the STEP92 audit gaps before expanding the Political Intelligence Operating System.

## Changes
- Added deterministic entity resolver for UP Assembly constituencies and candidate references.
- Added `/api/candidate-intelligence`.
- Added `/api/ai-qa` deterministic QA suite covering Hindi, Marathi, election results, candidates, booths, current politics, government and forecast routing.
- Integrated candidate evidence into `/api/ai` before general evidence ranking.
- Preserved the distinction between normalized winner/runner-up records and incomplete Form20 candidate maps.
- Added STEP93 runtime QA contract JSON.

## Safety / data integrity
- No canonical election JSON was rewritten.
- Candidate facts are not inferred from caste, religion, gender, or other sensitive attributes.
- Forecast routes remain guarded and are not presented as facts.
- API credentials remain server-side.

## Known limitation
The local test environment cannot authenticate against external LLM providers. Therefore QA validates deterministic routing, entity resolution, API/data paths, and fallback behavior; actual provider-generated prose must be tested after a provider binding/API key is configured in the Cloudflare Pages environment.
