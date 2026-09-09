# STEP104 — VANDIRA Competitive Intelligence

Added constituency-level competitive baseline from the verified STEP89 2022 Assembly warehouse.

- New API: `/api/competitive-intelligence`
- New UI: `competitive.html`
- New contract: `data/vandira_competitive_intelligence_contract_step104.json`
- New routing: `competitive_intelligence` in `functions/lib/vandira-os.js`
- AI menu entry added in `ai.html`

Guardrails: no 2027 winner prediction, no invented probabilities, no sensitive demographic inference, no 2024 Assembly mislabeling, and no complete-candidate-universe claim.
