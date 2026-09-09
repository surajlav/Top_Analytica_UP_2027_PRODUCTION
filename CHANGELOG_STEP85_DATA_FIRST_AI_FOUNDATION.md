# STEP85 — VANDIRA Data-First AI Foundation

## Objective
Build the AI development foundation around data integrity, broad source coverage, retrieval, provenance and health checks before voice integration.

## Added
- `data/vandira_ai_data_contract_step85.json` — immutable data/answer contract.
- `data/vandira_source_registry_step85.json` — expanded primary, news, reference and discovery source registry.
- `data/vandira_ingestion_plan_step85.json` — discover → normalize → map → validate → deduplicate → rank → retrieve → generate → audit pipeline.
- `functions/api/ai.js` — retrieval-first AI endpoint. It discovers current UP election/politics material through Google News RSS and the Indian Express Political Pulse feed, preserves original publisher URLs, and can call an OpenAI-compatible provider when `AI_BASE_URL`, `AI_API_KEY` and optional `AI_MODEL` are configured.
- `functions/api/data-health.js` — deployment-time data availability/health endpoint.

## Data safety
- Existing canonical and booth JSON files are not modified.
- AI cannot write to canonical election data.
- Live content is additive and source-attributed.
- Missing/uncertain information is surfaced as a data gap.
- Voice integration is intentionally deferred until the retrieval and AI layers pass QA.

## Important scope note
No system can honestly guarantee that it has indexed "all data on the internet". STEP85 therefore establishes a broad, auditable source universe and a web-discovery layer, with primary-source priority. Additional source connectors can be added without changing canonical election files.

## Next development sequence
1. Connect the AI model provider securely through Cloudflare environment variables.
2. Add official-source connectors for ECI/CEO-UP, UP Assembly/NEVA and UP Government/PIB document retrieval.
3. Build AC/district/party/candidate entity mapping for incoming content.
4. Add source conflict resolution and corroboration scoring.
5. Add automated data QA dashboard and retrieval trace viewer.
6. Only after these pass, integrate voice input/output.
