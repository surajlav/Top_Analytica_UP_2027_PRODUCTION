# STEP138 — VANDIRA Data Integrity & Provenance Hardening

## Objective
Additive, production-oriented provenance and integrity metadata without rewriting canonical election data.

## Changes
- Added `functions/lib/data-provenance.js` for immutable-source provenance loading and constituency-level trust labels.
- Added `functions/api/data-provenance.js` read-only provenance endpoint.
- Added `functions/api/provenance-qa.js` deterministic provenance regression endpoint.
- Added `data/vandira_data_provenance_step138.json` as an additive integrity registry.
- Integrated provenance labels into structured election evidence consumed by `/api/ai`.
- Preserved source values separately from derived arithmetic values.
- Explicitly recorded 13 source-vs-derived margin conflicts; canonical `margin_votes` values were not overwritten.
- Explicitly recorded Form20 source gaps AC55, AC56 and AC281; gaps are not treated as zero or fabricated.
- Reconciled party summary against 403 canonical winner records as additive metadata. Summary totals remain 397 while winner records total 403; JDL (+2) and NISHAD (+6) are the unresolved seat-count differences.
- Recorded duplicate party-name rows in the summary as a quality flag without modifying the summary.
- Kept 2024 Lok Sabha assembly-segment context explicitly separate from 2024 Assembly election context.

## Integrity Results
- Canonical assembly records checked: 403
- Margin mismatches: 13
- Verified Form20 ACs: 400/403
- Verified Form20 booth records: 14,000
- Form20 source gaps: 55, 56, 281
- Canonical SHA-256 (both canonical files): `195a68687e31981982f32850219907a929ac39d2dbf0a6649a6cf55884bc2944`

## Policy
Existing canonical source files are immutable. STEP138 adds provenance/reconciliation metadata only. Derived values must never silently replace source values.
