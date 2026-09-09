# STEP39 — AI Context + API Integration

Base: STEP29 data, locked/read-only.

Added:
- compact verified constituency context builder v2
- 2022 Assembly + 2012/2017 history + 2024 Lok Sabha Assembly Segment + Form20 first-35 booth summary
- selected party/candidate context
- homepage constituency selector inside AI chatbot
- structured AI answer rendering: answer, key points, sources, freshness, confidence, data gaps
- Cloudflare Worker `/api/ai` integration using a server-side OPENAI_API_KEY secret
- default model `gpt-5.6-luna`
- explicit anti-hallucination/data-gap rules

No canonical `data/` file is intentionally modified.
