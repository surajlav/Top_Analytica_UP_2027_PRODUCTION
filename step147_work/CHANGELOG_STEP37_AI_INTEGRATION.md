# STEP37 — AI Integration

Base: STEP29_SELECTED_PARTY_FIRST_BOOTH_TABLE.

- Added `assets/ai-copilot.js` with provider-agnostic `/api/ai` integration and grounded local fallback.
- Added constituency AI Copilot UI with focused prompts: seat position, booth strength, 2022→2024, opposition.
- AI receives structured context from `TopAnalyticaContext`.
- Canonical `data/` files were not modified; SHA-256 manifest added.
- No claim of live news or 2027 prediction is made without a source-backed API/content feed.
