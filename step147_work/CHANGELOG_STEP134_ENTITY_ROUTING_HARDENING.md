# STEP134 — VANDIRA Entity Resolution & Intelligence Routing Hardening

## Objective
Harden deterministic query routing and constituency entity resolution without changing canonical election data.

## Changes
- Added Hindi/English constituency aliases: लखनऊ नॉर्थ, लखनऊ सेंट्रल, नोएडा.
- Added strict numeric constituency resolution for `AC 252`, `252 विधानसभा`, `252` and similar explicit forms.
- Preserved Devanagari combining marks during entity normalization (`L/M/N` Unicode categories).
- Added explicit `बनाम` comparison detection.
- Prioritized competitive intelligence for party-vs-party comparisons.
- Prioritized party/alliance intelligence for party seat/performance questions.
- Prioritized historical context when a historical year is explicitly present.
- Prioritized assembly proceedings for bills/questions/proceedings language.
- Prioritized system status for direct system-health/status queries over generic monitoring.
- Expanded deterministic QA coverage with the previously failing routing/entity examples.

## Data Safety
No canonical election data, calculations, or source values were modified.

## Known Limitation
This remains a deterministic routing/entity layer, not an independent fact-checker or semantic LLM evaluator.
