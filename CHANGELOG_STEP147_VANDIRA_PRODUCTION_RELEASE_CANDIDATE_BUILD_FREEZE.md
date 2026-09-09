# STEP147 — Production Release Candidate / Build Freeze

## Objective
Freeze the post-STEP146 ECI-reconciled VANDIRA build as the production release candidate before deployment.

## Release decisions
- 2022 Assembly result layer is frozen after STEP146 official ECI reconciliation.
- `assembly_canonical_master.json` and `assembly_2022_master.json` both use the reconciled SHA-256:
  `2f103d2a3ecbc8c26661908a8acd699c01942bebfad4ed30eb80bc751fce07ed`
- Booth/Form20 source data is unchanged in STEP147.
- Existing Form20/booth source-quality flags remain explicit and are not silently corrected.
- 2024 data remains explicitly Lok Sabha Assembly-segment context.
- AI server-authoritative routing, answer guard, data-conflict guard, prompt-injection controls and red-team controls are retained.
- Fixed an unreachable/dead duplicate provider invocation fragment in `functions/api/ai.js`; no behavior change intended.
- Cloudflare deployment bindings remain configuration placeholders; no production deployment is claimed in STEP147.

## QA gate
- JSON parse: PASS
- JavaScript syntax: PASS
- 403/403 canonical result coverage and canonical↔warehouse audited fields: PASS
- Derived margin reconciliation: PASS (0 remaining mismatches)
- 2024 semantic separation: PASS
- Booth/Form20 immutable manifest: PASS
- Secret-pattern scan: PASS
- Wildcard CORS static scan: PASS
- CSP/HSTS presence: PASS
- Wrangler deployment config: PASS
- AI runtime cleanliness: PASS
- HTML inventory: 29 pages

## Known data-quality flags retained by design
- Form20 source coverage: 400/403 ACs; source gaps 55, 56, 281.
- Form20 candidate-sum mismatch flags and voter/elector anomalies remain source-quality findings.
- Booth source availability gaps remain documented.
- Party summary source file remains preserved; canonical winner reconciliation is additive.

## Status
**RELEASE CANDIDATE — FROZEN / READY FOR STEP148 DEPLOYMENT**

Live deployment has not been performed as part of STEP147.
