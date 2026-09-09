# STEP100 — VANDIRA Proactive Alerts & Monitoring

## Objective
Detect meaningful fresh political/intelligence changes, verify their provenance, suppress duplicate/noise signals, score importance, and return an audit-ready alert object.

## Added
- `data/vandira_proactive_monitoring_contract_step100.json`
- `functions/api/proactive-monitor.js`
- `assets/vandira-monitor.js`
- `monitoring.html`

## Updated
- `ai.html` — added Proactive Monitoring entry to the VANDIRA menu.

## Detection model
- Fresh UP politics feed + Google News discovery + official ECI/UP Government/UP Assembly connector surfaces.
- SHA-256 fingerprints where Web Crypto is available.
- Source tiering and deterministic severity scoring.
- Duplicate URL/title suppression.
- High/critical signals promoted to the alert list.
- Every alert retains source, tier, publication timestamp, verification state, reason and next check.

## Persistence
- Browser-local baseline is the default and requires no server database.
- Optional Cloudflare KV binding: `VANDIRA_MONITOR_KV` enables a server-side 14-day baseline.
- No persistent personal profile data is introduced.

## Safety
- Reported news remains attributed until verified.
- No invented events, alliances, motives, forecasts or probabilities.
- No sensitive personal attributes or targeted political persuasion logic.
- Historical election data is not converted into a live alert without fresh evidence.

## Delivery boundary
STEP100 is detection-ready. It does not falsely claim push/email/SMS delivery. Scheduled delivery requires an external scheduler or a separately configured scheduled runtime/channel.

## Data integrity
No canonical election, constituency, candidate, party, booth, Form 20, ECI warehouse or historical dataset was modified.
