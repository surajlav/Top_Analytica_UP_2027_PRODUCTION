# STEP112 — VANDIRA State → Region → District → Assembly → Booth Intelligence

Built on STEP111 without modifying canonical election datasets.

## Added
- `hierarchy.html` — responsive hierarchical intelligence explorer.
- `functions/api/hierarchy-intelligence.js` — state/region/district/assembly/booth API.
- `data/vandira_hierarchy_intelligence_contract_step112.json` — contract and evidence boundaries.

## Hierarchy
Uttar Pradesh → 18 conventional administrative divisions → 75 districts → 403 Assembly constituencies → booth intelligence.

## API
`GET /api/hierarchy-intelligence?level=state|region|district|assembly|booth`
Optional filters: `q`, `region`, `district`, `ac`.

## Booth integrity
Verified Assembly booth totals remain available from the STEP89 warehouse. Detailed booth chunks are explicitly source-dependent and are not promoted to a complete booth universe when only preview records are available.

## AI integration
Added `hierarchy_intelligence` route and execution-plan steps to VANDIRA OS. Added the hierarchy workspace to the AI menu.

## Guardrails
No sensitive voter profiling/targeting, no unsupported 2027 forecast, no 2024 Lok Sabha/Assembly conflation, and no false completeness claims for booth detail.
