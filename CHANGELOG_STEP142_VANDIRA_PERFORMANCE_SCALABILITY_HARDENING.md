# STEP142 — VANDIRA Performance & Scalability Hardening

## Scope
Improve repeated data loading and request-time scalability without changing canonical election data.

## Changes
- Candidate 360 now memoizes booth-chunk loads per request. Winner/runner-up candidates in the same AC chunk no longer trigger duplicate fetches.
- Hierarchy Intelligence now loads its nine booth chunks in parallel rather than serially.
- Candidate/Constituency static data fetches allow short edge caching (`public, max-age=300`) because the underlying packaged datasets are immutable within a release.
- Added a small reusable performance memoization helper for future hot paths.
- No election data, canonical JSON records, margins, party values, or Form20 values were rewritten.

## Guardrails
- Current/live political claims remain fresh-retrieval dependent.
- Booth data remains source-dependent and descriptive.
- Caching is short-lived and release-scoped; no user-specific AI response is cached.

## Expected effect
- Candidate 360: repeated booth-chunk fetches collapse to at most one fetch per relevant 50-AC chunk per request.
- Hierarchy: nine independent booth chunks can be fetched concurrently.
- Reduced latency and origin I/O for repeated static dataset access.
