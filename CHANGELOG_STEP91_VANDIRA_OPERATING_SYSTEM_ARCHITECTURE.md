# STEP91 — VANDIRA UP Election 2027 Political Intelligence Operating System

## Objective
Transform the existing VANDIRA election-intelligence project into a professional operating-system architecture rather than a single chatbot endpoint.

## Architecture
L0 Runtime → L1 Canonical Election Data → L2 Normalized Warehouse → L3 Official Evidence → L4 Live Intelligence → L5 Multi-AI Reasoning → L6 Audit & Provenance.

## New capabilities
- Query classification and intelligence routing.
- Execution-plan generation before model synthesis.
- Election-aware temporal clock using India Standard Time.
- Explicit distinction between current house term and unconfirmed polling date.
- Domain routes for election results, constituency, candidate, booth/Form 20, party/alliance, government/policy, assembly proceedings, news, history and guarded scenario analysis.
- System health endpoint.
- Cloudflare Workers AI binding support in addition to account/API-token fallback.
- Multi-provider synthesis remains server-side; API keys are never exposed to the browser.
- Provider failure degrades to evidence-only mode instead of fabricated answers.
- Forecast/scenario route is explicitly guarded and must disclose uncertainty.

## Provider strategy
1. Cloudflare Workers AI binding when configured.
2. Google Gemini.
3. Groq.
4. OpenRouter Free router.
5. Custom OpenAI-compatible provider.

Free-tier availability, quotas and models are provider-controlled and can change. The provider is never treated as the authoritative source of election facts.

## New routes
- `POST /api/intelligence-router`
- `GET /api/system-health`

## Updated route
- `POST /api/ai` now uses the operating-system router and execution plan, while preserving the existing evidence-first retrieval pipeline.

## Data safety
- Existing canonical election JSON is not overwritten.
- STEP89 normalized warehouse remains additive.
- Production domain is not changed.
