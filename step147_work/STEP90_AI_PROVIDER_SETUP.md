# VANDIRA STEP90 — AI Provider Setup

VANDIRA is designed as a retrieval-first election intelligence engine. The model provider is interchangeable.

## Recommended development setup

Configure **one** provider first. You do not need to purchase multiple providers.

### Option A — Cloudflare Workers AI

Set:

- `CF_ACCOUNT_ID`
- `CF_API_TOKEN`
- `CF_AI_MODEL=@cf/openai/gpt-oss-20b`

This is the most infrastructure-aligned option for the current Cloudflare Pages deployment.

### Option B — Gemini

Set:

- `GEMINI_API_KEY`
- `GEMINI_MODEL=gemini-2.5-flash-lite`

### Option C — Groq

Set:

- `GROQ_API_KEY`
- `GROQ_MODEL=openai/gpt-oss-20b`

### Option D — OpenRouter

Set:

- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL=openrouter/free`

### Option E — custom OpenAI-compatible API

Set:

- `AI_BASE_URL`
- `AI_API_KEY`
- `AI_MODEL`

## Automatic fallback

If multiple providers are configured, VANDIRA tries them in this order:

`Cloudflare → Gemini → Groq → OpenRouter → Custom`

A failed provider does not destroy the user's request. The next configured provider is attempted.

## Election evidence flow

`User query`

→ intent/router

→ canonical local election context

→ ECI normalized warehouse

→ official ECI / UP Government connectors

→ current news/discovery when freshness is required

→ evidence scoring

→ AI provider

→ answer + sources + confidence + freshness + data gaps

## Free-tier warning

Provider free tiers, models, quotas and rate limits change. VANDIRA therefore treats them as runtime resources, not architectural guarantees. The application must continue to expose a data-gap response if all configured providers fail.

## Security

All keys remain server-side. Never add keys to:

- `index.html`
- `ai.html`
- browser JavaScript
- JSON datasets
- GitHub source
- localStorage

## Test endpoint

After deployment, check:

`/api/ai-status`

It should show configured provider names and models, but never the secret values.

Then test `/api/ai` with a normal election query.
