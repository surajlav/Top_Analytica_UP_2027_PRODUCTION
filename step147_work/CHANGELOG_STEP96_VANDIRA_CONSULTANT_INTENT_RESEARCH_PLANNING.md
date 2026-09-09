# STEP96 — VANDIRA Consultant Intent + Research Planning Engine

## Objective
Turn each user query into an explicit, deterministic consultant research plan before evidence synthesis.

## Added
- `data/vandira_consultant_planning_step96.json`
- `functions/lib/consultant-planner.js`

## Updated
- `functions/api/consultant-plan.js` now returns `research_plan` with intent, domains, source requirements, ordered research steps, temporal context and guardrails.
- `functions/api/ai.js` now resolves entities and builds the STEP96 research plan before retrieval/provider synthesis; the plan is included in the model grounding context and audit trace.

## Planning dimensions
- goal: inform / explain / compare / monitor / forecast / recommend
- time scope: current / 2027 / 2022 Assembly / 2024 Lok Sabha / historical
- geography and resolved entity scope
- analysis mode
- freshness requirement
- output requirement
- required domains and source tiers
- conflict checks, evidence assessment, gaps and next-action logic

## Safety / integrity
- Canonical election data remains read-only and unchanged.
- 2024 Lok Sabha data remains explicitly separate from 2022/2027 Assembly claims.
- Forecasts are scenario analysis, not certainty or invented probabilities.
- Sensitive-person political targeting is not introduced.
- Missing or conflicting evidence must be disclosed.

## Validation target
Deterministic planning is testable without external AI credentials. Provider-generated prose still requires the configured Cloudflare/Gemini/Groq/OpenRouter/custom provider runtime for end-to-end production QA.
