# STEP122 — VANDIRA Production Release

Built from STEP121 — VANDIRA Full System QA.

## Release objective
Prepare the audited VANDIRA / TOP ANALYTICA UP 2027 application as the production-release artifact without changing canonical election data or claiming unverified live infrastructure capabilities.

## Release gates (audited revision)
- STEP121 deterministic QA rerun after remediation: PASS
- 14/14 Hindi/English/Hinglish routing cases: PASS
- 78/78 data JSON files parse: PASS
- 61/61 JavaScript files pass ESM-aware Node syntax checks: PASS
- 29/29 HTML pages pass script-tag and inline-JS checks: PASS
- 46/46 API modules import successfully
- Canonical Assembly and 2022 master datasets preserved byte-for-byte
- `wrangler.toml` remains Pages-compatible at repository root
- Production domain `up.topanalytica.in` is not modified by this artifact

## Canonical data lock
`data/assembly_canonical_master.json` SHA-256:
`195a68687e31981982f32850219907a929ac39d2dbf0a6649a6cf55884bc2944`

`data/assembly_2022_master.json` SHA-256:
`195a68687e31981982f32850219907a929ac39d2dbf0a6649a6cf55884bc2944`

Both files are 246,640 bytes and have identical hashes in the release workspace.

## Production-readiness boundary
This package is release-ready, but it does not fabricate or silently assume:
- live AI provider credentials
- live production latency or uptime
- live ECI/CEO UP turnout feeds
- an official 2027 polling schedule before ECI/CEO UP publication
- complete Form-20 coverage beyond the verified source state
- complete detailed booth-source coverage beyond the verified source state
- female browser voice availability on every device

Provider secrets remain server-side. The browser receives provider status, not credentials.

## Deployment boundary
Deploy this ZIP to the Cloudflare Pages project `top-analytica-up-2027` only after the operator has verified the production secret/binding configuration and completed the smoke-test checklist in `PRODUCTION_RELEASE_STEP122.md`.

The existing `up.topanalytica.in` production environment is intentionally not modified by the build process.


## Pre-upload audit remediation
An end-to-end static/runtime audit of the supplied STEP122 artifact found and corrected four release blockers before GitHub upload:

1. Three API modules contained numeric-leading object keys that are invalid under ESM parsing.
2. `ai.html` contained a malformed inline script boundary around the TTS stop hook.

Canonical election datasets were not changed. The audited package should be used instead of the original STEP122 ZIP.
