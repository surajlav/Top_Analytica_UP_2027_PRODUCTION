# STEP36 — Architecture + Content Intelligence Layer

## Base
This package is built DIRECTLY from:
`Top_Analytica_UP_2027_STEP29_SELECTED_PARTY_FIRST_BOOTH_TABLE.zip`

## Data protection
- Existing `data/` files were preserved byte-for-byte.
- `data/DATA_FREEZE_MANIFEST_STEP36.json` records SHA-256 checksums of the pre-existing data files.
- No canonical election/booth data was replaced, normalized, renamed, or deleted.
- Future datasets must be additive and source-attributed.

## Added
- `data/ai_content_intelligence_architecture.json`
- `data/content_intelligence_registry_schema.json`
- `data/DATA_FREEZE_MANIFEST_STEP36.json`
- `assets/data-integrity-guard.js`
- `assets/content-intelligence-context.js`

## Important
This step deliberately does NOT ingest live news yet and does NOT alter the working STEP29 data-binding/rendering path. The next layer can add ingestion/retrieval on top of this frozen base.
