# STEP94 — VANDIRA Intelligence Graph + Consultant Knowledge Model

## Objective
Begin the transition from a retrieval-first AI engine into **VANDIRA = A Personal Political Intelligence Consultant**.

## Added
- `data/vandira_intelligence_graph_step94.json` — additive relationship graph across UP 2022 Assembly constituencies, districts, winner/runner-up candidate entities, parties, election context, booth/Form20 intelligence and official sources.
- `data/vandira_consultant_knowledge_model_step94.json` — consultant identity, reasoning loop, answer protocol, relationship rules and data-safety contract.
- `functions/api/intelligence-graph.js` — read-only graph query API with summary, entity search and bounded neighborhood traversal.
- `functions/api/consultant-plan.js` — deterministic consultant planning API connecting intent classification, entity resolution and execution planning.

## Consultant model
Question → Intent → Entity Resolution → Research Plan → Evidence → Graph Relationships → Assessment → Risk/Gaps → Recommendation → Sources → Audit.

## Integrity
- Canonical election/booth/Form20 data is not rewritten.
- Graph is additive/derived.
- 2024 Lok Sabha segment context remains separate from 2024 Assembly claims.
- Historical evidence is not treated as a 2027 forecast.
- No sensitive voter-level targeting is introduced.
- Hindi is the primary VANDIRA consultant language.

## Validation
- Graph coverage built from the STEP89 403-record warehouse.
- API JavaScript passes `node --check`.
- JSON parses successfully.
- Existing canonical JSON files are compared byte-for-byte before packaging.
