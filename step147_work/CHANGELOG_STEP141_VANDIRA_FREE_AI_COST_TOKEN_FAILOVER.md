# STEP141 — VANDIRA Free AI Cost, Token Abuse & Provider Failover

## Objective
Keep VANDIRA on no-cost AI access paths while protecting free quotas, limiting prompt size/output size, adding bounded timeout/retry, and failing over across configured free providers.

## Free-first policy
Default `VANDIRA_AI_FREE_ONLY=true`.
Allowed providers:
- Google Gemini API
- Groq API
- Cloudflare Workers AI free allocation
- OpenRouter free models

Custom OpenAI-compatible providers are blocked by the free-only policy unless the operator explicitly disables it.

## Runtime controls
- 12s provider timeout.
- One bounded retry only for 408/429/5xx-class transient errors.
- Max model output: 900 tokens.
- Max AI prompt payload: 24,000 characters.
- Default application-wide daily AI request budget: 100.
- Default daily AI input-character budget: 1,200,000 characters.
- KV-backed global budget when `VANDIRA_AI_BUDGET_KV` exists; local-isolate fallback otherwise.
- Provider order: Gemini → Groq → Cloudflare Workers AI → OpenRouter free → custom (only when free-only is disabled).

## Important
Provider free quotas are external and can change. The application budget is intentionally conservative and is not a claim about provider quota sizes.
No paid credits, billing automation, or paid-provider fallback was introduced.
