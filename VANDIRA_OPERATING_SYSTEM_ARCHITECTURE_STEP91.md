# VANDIRA — UP Election 2027 Political Intelligence Operating System

## Mission
Provide evidence-grounded political intelligence for Uttar Pradesh Assembly Election 2027 using immutable election data, normalized historical results, official government/election sources, live political information and multi-provider AI reasoning.

## Operating rule
AI is a reasoning layer, not the source of truth.

## Request lifecycle
1. Receive query + optional constituency context.
2. Classify the intelligence domain.
3. Build an execution plan.
4. Retrieve structured election evidence.
5. Retrieve official primary sources.
6. Retrieve fresh news/current evidence when required.
7. Normalize and deduplicate evidence.
8. Rank evidence by authority, relevance and freshness.
9. Resolve or disclose conflicts.
10. Select an available AI provider.
11. Generate an answer constrained to supplied evidence.
12. Return sources, confidence, freshness and data gaps.
13. Emit an audit trace.

## Intelligence domains
- Election results and history
- Constituency intelligence
- Candidate intelligence
- Booth/Form 20 intelligence
- Party and alliance intelligence
- Government and policy intelligence
- Assembly proceedings
- Current UP political news
- Historical context
- Scenario analysis with explicit uncertainty

## Temporal rules
- Current claims require fresh retrieval.
- India Standard Time is the system clock for election context.
- UP Assembly current house term ends 22 May 2027.
- Exact 2027 polling date is not treated as confirmed until an authoritative source establishes it.

## Source hierarchy
Tier 1: ECI, CEO UP, UP Assembly/NEVA, UP Government IPR, UP SEC, PIB and other authoritative primary sources.
Tier 2: established news organizations.
Tier 3: reference/discovery material.

## Safety and integrity
- Never fabricate missing election facts.
- Never relabel 2024 Lok Sabha assembly-segment data as a 2024 Assembly election.
- Never overwrite canonical datasets with live retrieval.
- Keep provider secrets server-side.
- Political analysis remains aggregate/evidence-based and avoids sensitive-person targeting.
