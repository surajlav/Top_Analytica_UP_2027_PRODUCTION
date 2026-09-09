# STEP90 — VANDIRA Multi-Provider AI Runtime + Election Grounding

## Objective

Connect VANDIRA's retrieval-first Uttar Pradesh election intelligence stack to multiple AI model providers without making the AI provider itself the source of election truth.

## Added

- `functions/api/ai-providers.js`
  - Cloudflare Workers AI adapter
  - Google Gemini adapter
  - Groq OpenAI-compatible adapter
  - OpenRouter OpenAI-compatible adapter
  - legacy custom OpenAI-compatible adapter
  - automatic provider cascade/fallback
  - provider attempt trace without exposing credentials
- `functions/api/ai-status.js`
  - server-side provider configuration health endpoint
  - never returns API keys
- `data/vandira_ai_provider_registry_step90.json`
  - provider metadata, environment variables, defaults and routing policy
- Hardened `functions/api/eci-result-parser.js`
  - table/schema detection instead of fixed column assumptions
  - candidate vote-sum validation
  - vote-share validation
  - rank validation
  - parse diagnostics
- Updated `functions/api/ai.js`
  - STEP90 provider cascade
  - India-time temporal grounding
  - freshness-aware evidence ranking
  - structured election warehouse remains upstream of model synthesis
  - provider/model/attempt telemetry in retrieval trace
  - no-evidence and no-provider data gaps are explicit

## Provider strategy

Default automatic order:

1. Cloudflare Workers AI
2. Google Gemini
3. Groq
4. OpenRouter free router
5. Custom OpenAI-compatible provider

The first configured provider that returns a usable answer is selected. A provider error or quota failure falls through to the next configured provider.

## Election-specific safety / grounding

- Canonical local election data is read-only.
- Official ECI evidence is preferred for election/result facts.
- Current political claims require fresh retrieval when the route requests freshness.
- 2024 Lok Sabha assembly-segment information is never relabeled as a 2024 Assembly election.
- The model is instructed to disclose conflicts and data gaps rather than inventing facts.
- Current India time is supplied to the model for temporal interpretation.
- No voter-level sensitive targeting or persuasion logic is added.

## Environment variables

### Cloudflare Workers AI

- `CF_ACCOUNT_ID`
- `CF_API_TOKEN`
- `CF_AI_MODEL` (optional; default `@cf/openai/gpt-oss-20b`)

### Google Gemini

- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional; default `gemini-2.5-flash-lite`)

### Groq

- `GROQ_API_KEY`
- `GROQ_MODEL` (optional; default `openai/gpt-oss-20b`)

### OpenRouter

- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` (optional; default `openrouter/free`)

### Custom OpenAI-compatible provider

- `AI_API_KEY`
- `AI_BASE_URL`
- `AI_MODEL`

## Deployment rule

Secrets must be configured as Cloudflare Pages/Functions server-side environment variables. Never put provider keys in HTML, browser JavaScript, JSON data files, GitHub source, or client localStorage.

## What STEP90 does NOT do

- It does not replace canonical election data.
- It does not claim that free API tiers are unlimited or permanent.
- It does not make every web page an authoritative source.
- It does not enable voice yet.
- It does not change `up.topanalytica.in` production deployment.

## Validation

- All JSON files parse successfully.
- All JavaScript files pass `node --check`.
- STEP89 common-file comparison: only the intended `ai.js` and `eci-result-parser.js` files changed.
- Three additive files were added.
- 403/403 warehouse coverage remains intact with AC keys 1–403 and no duplicates/missing AC numbers.
