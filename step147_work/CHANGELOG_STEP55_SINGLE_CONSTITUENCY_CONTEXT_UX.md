# STEP55 — Single Constituency Context UX

## Purpose
Remove the duplicated selected-constituency strip from the TA AI workspace so the user sees one clear constituency selector.

## UI changes
- Replaced the label “CONSTITUENCY CONTEXT / विधानसभा संदर्भ” with “SELECT CONSTITUENCY / विधानसभा चुनें”.
- Removed the secondary `ai-context-card` that repeated AC number, constituency name and party.
- The selected constituency remains in the dropdown and continues to be stored/used internally as AI grounding context.
- Preserved the existing `ctx`, `ac`, `party`, `chooseSeat()` and AI request routing logic.
- Added responsive CSS overrides so legacy styles cannot reserve visual space for the removed card.

## Data policy
No files under `data/` were modified. Election/booth values and AI data sources remain unchanged.
