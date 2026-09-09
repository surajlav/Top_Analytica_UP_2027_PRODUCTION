# STEP132 — VANDIRA Decision Workspace

## Objective
Turn the STEP131 Decision Snapshot into a compact decision workspace that keeps the answer, evidence state, guardrail and next action together.

## Changes
- Added `decisionWorkspace()` to `ai.html` and rendered it after the Decision Snapshot.
- Workspace uses existing AI response fields only: answer, route, confidence, freshness, key_points and data_gaps.
- Added context-aware next action for booth, historical and default seat intelligence.
- Added evidence-verification action when confidence is low or data gaps exist.
- Added responsive styling in `assets/style.css`.
- No election data, calculations, canonical records or source values were changed.

## Guardrails
- Does not generate new electoral facts.
- Does not present the workspace as a 2027 forecast.
- Existing STEP128 Evidence, STEP129 Recommended Action, STEP130 Intelligence Brief and STEP131 Decision Snapshot remain intact.
