# STEP70 — EVIRA Intelligence Router

Implemented the first real intelligence-routing layer for EVIRA.

## What changed
- Added a deterministic question router in `assets/ai-copilot.js`.
- Routes questions into: Seat, Booth, History, Election Movement, Campaign, Constituency Issues, and Current Politics.
- Passes structured `route` metadata to `/api/ai` so the future Worker can use the correct intelligence pipeline.
- Current/live questions are explicitly marked as requiring fresh sources.
- Local fallback now preserves route metadata while continuing to use only verified local data.
- Added `data/evira_intelligence_router_step70.json` as the architecture registry.
- No canonical election data was changed.
- Response language remains independent from the Hindi-first UI default.
