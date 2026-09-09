# STEP40 — AI Command Screen & Flexible Political Copilot

## UX
- Replaced the small floating chatbot experience with a dedicated `ai.html` AI Political Intelligence screen.
- Homepage Ask AI CTA now opens the dedicated AI screen.
- Existing constituency floating Ask AI action routes to the dedicated screen while preserving AC/party context in the URL.
- Added professional chat interface with conversation thread, typing state, quick prompts, constituency context selector, current-politics prompt and bilingual controls.
- Kept existing website theme and data presentation unchanged.

## AI behavior
- Added query-mode routing: seat, booth, history, live, general.
- Seat/booth/history queries remain grounded in the verified local data context.
- Current/general questions are routed to the Worker in `live/general` mode.
- Worker now uses the OpenAI Responses API and can use web search for live/current questions when deployed and configured.
- Current web facts are separated from verified election data and source URLs are surfaced when returned by the runtime.

## Data lock
- No files under `data/` were changed from STEP39.
- Canonical/derived election data remains read-only and additive-only.
- `OPENAI_API_KEY` remains server-side in Cloudflare Worker Secrets; it is not embedded in HTML/JS.
