# STEP129 — VANDIRA AI Answer → Recommended Action Layer

## Objective
Extend the STEP128 Evidence & Confidence layer so every constituency-aware AI answer can guide the user to the most relevant next intelligence module without turning VANDIRA into a generic chatbot.

## Changes
- Added a contextual `RECOMMENDED NEXT STEP` block beneath AI confidence metadata.
- Recommendation is derived from the returned intelligence intent (candidate, competitive, issue, party/alliance, research/survey, historical, booth, or general constituency context).
- Added evidence-verification action when the response is low-confidence or contains data gaps.
- Preserved the existing `NEXT INTELLIGENCE` rail for broader exploration.
- Preserved AC and party context in all generated links.
- No election/canonical data, calculations, or source values were modified.
- Existing colour system retained; typography remains Poppins + Noto Sans Devanagari.

## Product direction
AI response → Evidence → Recommended next intelligence → Decision support.
