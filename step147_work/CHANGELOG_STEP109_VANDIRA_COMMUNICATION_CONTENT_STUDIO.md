# STEP109 — VANDIRA Communication / Content Studio

Built from STEP108 without altering canonical election datasets.

## Added
- `functions/api/content-studio.js`
- `data/vandira_content_studio_contract_step109.json`
- `content-studio.html`
- AI route + retrieval integration for `content_studio`
- AI workspace menu link

## Capabilities
- Briefing
- Press Note
- Social Post
- Public Statement
- FAQ
- Issue Explainer
- Constituency Update
- Hindi-first multilingual output
- Evidence/source attachment
- Fact-check checklist
- Draft → fact-check-required → approved → publish-ready workflow

## Guardrails
- Public/non-targeted communication only.
- No sensitive voter profiling or microtargeting.
- No invented statistics, poll results or endorsements.
- No unsupported 2027 outcome claims.
- News frequency is not treated as public opinion.
- Human approval required before publishing.

## QA
- JavaScript syntax validation required.
- JSON validation required.
- Canonical election datasets must remain byte-identical.
- Production `up.topanalytica.in` untouched.
