# STEP144 — VANDIRA Final UX & Readability QA

## Objective
Final readability and interaction pass before production release. This step is presentation-only and does not modify election datasets or calculations.

## Changes
- Raised base body typography for desktop readability.
- Increased Hindi/English/Hinglish line-height and answer text sizing.
- Enlarged navigation/dropdown touch targets and menu text.
- Increased AI answer, evidence, guard, security, intelligence brief and decision workspace readability.
- Preserved existing colour identity and layout hierarchy.
- Preserved mobile 16px form controls to avoid browser auto-zoom.
- Added responsive overrides for 760px and 430px widths.
- Preserved reduced-motion behaviour from STEP143.

## Data safety
No JSON election source files were rewritten. No election calculations were changed.

## QA targets
- HTML pages: 29
- Existing JavaScript source: syntax validation required
- JSON source: parse validation required
- Canonical election hashes must remain unchanged
- No wildcard CORS introduced
- No new external runtime dependency introduced

## Browser limitation
Pixel-perfect interactive browser validation remains subject to the sandbox Chromium administrator restriction documented in earlier QA. Static/runtime checks are therefore used where browser rendering is unavailable.
