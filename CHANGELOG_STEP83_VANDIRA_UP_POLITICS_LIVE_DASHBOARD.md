# STEP83 — VANDIRA UP Politics Live Dashboard

Base: STEP82 VANDIRA Core Booth Intelligence

## Objective
Create a dedicated Uttar Pradesh political intelligence dashboard focused on current politics, government updates, election history, Chief Ministers and source-backed reference material.

## Added
- `dashboard.html` — dedicated UP Politics Live Dashboard.
- `data/up_politics_live_feed_2026-09-08.json` — current-source snapshot captured 08 Sep 2026.
- `data/up_politics_history.json` — election-history and political-history references.
- `data/up_chief_ministers_history.json` — grouped Chief Minister history from 1950 to present.
- `data/up_election_dashboard_summary.json` — 2022 Assembly, 2024 Lok Sabha and current-house-term reference.
- `data/up_politics_source_registry.json` — primary/secondary/news source registry and source policy.

## Sources
Primary: Election Commission of India, Government of Uttar Pradesh Information & Public Relations Department, Uttar Pradesh Legislative Assembly.
Secondary: Wikipedia pages for Uttar Pradesh, election history, legislative assembly history and Chief Ministers.
News: The Indian Express, The New Indian Express and Moneycontrol.

## Design / UX
- Clean VANDIRA Saffron / White / Black identity retained from STEP81.
- Dashboard is separate from the AI workspace.
- Mobile-responsive.
- Current items show publication date, category, source, source type/confidence and source link.
- Historical data is visually separated from current news.

## Data integrity
- Existing STEP82 JSON data files are preserved unchanged.
- New dashboard datasets are additive only.
- No existing election, booth, Form-20 or constituency values were edited.

## Live architecture note
This release contains a source-backed current snapshot plus a local no-cache refresh mechanism. A true continuously refreshed server feed should be connected through a backend/Cloudflare Worker in the next deployment stage; the UI is already structured to separate current web information from verified election datasets.
