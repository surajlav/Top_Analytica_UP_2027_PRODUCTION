# STEP121 — VANDIRA Full System QA

Built from STEP120 Full AI Integration.

## QA gates
- 14 deterministic Hindi/English/Hinglish routing cases: PASS
- 77 JSON files: PASS
- 61 JavaScript files: Node syntax PASS
- HTML local asset/script reference scan: PASS
- Canonical `assembly_canonical_master.json` and `assembly_2022_master.json`: byte-identical
- Production `up.topanalytica.in`: untouched

## Reliability findings intentionally preserved
- 13 known 2022 warehouse margin inconsistencies remain surfaced as QA findings; canonical data was not rewritten.
- Form-20 verified coverage remains 400/403; AC55, AC56 and AC281 remain unresolved.
- Detailed booth source availability remains 394/403.
- Live provider synthesis is not claimed unless a provider secret/binding is configured.
- Deployed Cloudflare latency/authentication and real browser voice support are not claimed by local QA.

## STEP121 routing hardening
The central router now recognizes common comparison/result formulations more reliably and deduplicates competing route scores by retaining the highest score for each route.

## QA artifact
`data/vandira_step121_qa_report.json`
`tests/step121-system-qa.mjs`
