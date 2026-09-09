# TOP ANALYTICA — VANDIRA
# STEP122 Production Release Runbook

## 1. Artifact
Release artifact: `STEP122_VANDIRA_PRODUCTION_RELEASE_FRESH.zip`

Target Cloudflare Pages project: `top-analytica-up-2027`
Framework preset: None
Build command: `exit 0`
Build output directory: `.`
Root directory: repository root

## 2. Pre-deployment gates
- [ ] STEP121 QA report reviewed
- [ ] Canonical data hashes match the release manifest
- [ ] AI provider secrets/bindings are configured in the target environment if live model synthesis is required
- [ ] No provider secret is present in client-side HTML/JS
- [ ] ECI/CEO UP live feeds are treated as unavailable until officially configured
- [ ] 2027 polling date is not hard-coded or invented
- [ ] Form-20/booth coverage language remains source-dependent

## 3. Cloudflare Pages deployment
Use the existing `top-analytica-up-2027` Pages project and deploy the repository root from this artifact.

Do not change the production custom domain configuration as part of the code artifact. If the deployment target is the existing production branch, verify the deployment preview first and then promote according to the operator's normal Cloudflare workflow.

## 4. Post-deployment smoke tests
Check:
1. `/`
2. `/ai.html`
3. `/api/system-health`
4. `/api/data-health`
5. `/api/ai-status`
6. `/api/ai-integration`
7. `/api/intelligence-router`
8. `/api/constituency-360`
9. `/api/candidate-360`
10. `/api/war-room`
11. `/api/election-day-intelligence`
12. `/security.html`

On `/ai.html` verify:
- text question works
- constituency context remains internal grounding context
- Hindi input works where browser SpeechRecognition is supported
- TTS works where browser speech synthesis is available
- two-way voice starts/stops cleanly where both browser APIs are supported
- sources/confidence/data-gap presentation remains intact

## 5. Provider verification
`/api/ai-status` must show only configured providers as configured. Never paste API keys into client files or localStorage.

If no provider is configured, the application must honestly remain in retrieval/deterministic fallback mode rather than displaying a false live-AI status.

## 6. Rollback
If smoke tests fail, roll back to the immediately preceding known-good Pages deployment. Do not rewrite canonical election datasets as a deployment fix.

## 7. Production data safety
No migration or mutation of canonical election JSON is part of STEP122.
