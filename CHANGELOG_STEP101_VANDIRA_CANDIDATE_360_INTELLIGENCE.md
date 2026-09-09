# STEP101 — VANDIRA Candidate 360 Intelligence

## Objective
Create a source-grounded candidate intelligence layer that unifies verified 2022 candidate identity/performance with constituency, booth/Form20 context and explicit current-data gaps.

## Added
- `functions/api/candidate-360.js`
- `data/vandira_candidate_360_contract_step101.json`
- `candidate.html`

## Updated
- `functions/api/ai.js`
  - candidate-intelligence route now grounds candidate queries through `/api/candidate-360`
  - retrieval trace advances to STEP101
- `ai.html`
  - adds Candidate 360 to the VANDIRA workspace menu

## Candidate 360 scope
- 403 Uttar Pradesh Assembly constituencies
- 2022 normalized winner and runner-up candidate entities
- 806 normalized candidate appearances/entities
- verified votes, vote share, role, rank and winning margin where applicable
- constituency and district context
- seat turnout and booth count
- additive Form20 candidate-name presence where available
- current intelligence explicitly marked as requiring fresh retrieval
- historical trend is not inferred from a single election

## Data integrity
- Canonical election data remains read-only.
- `assembly_canonical_master.json` and `assembly_2022_master.json` unchanged.
- `candidate_party_mapping_2022.json` unchanged.
- `form20_candidate_map_2022.json` unchanged.
- `eci_assembly_2022_warehouse_step89.json` unchanged.
- No 2024 Lok Sabha data is represented as a 2024 Assembly result.

## Important coverage boundary
This is **not** a claim of complete ECI all-candidate 2022 coverage. The primary candidate entity layer is normalized winner/runner-up coverage. Form20 names are additive and are not promoted to verified party/vote facts when the source map does not establish them reliably.

## Current-data rule
Candidate biographies, current office-holding status, party changes, current candidacy, current political activity and news are not invented by this endpoint. They must be retrieved from fresh official or reputable sources before being presented as current/latest facts.

## Political safety
The feature provides evidence-based public political intelligence. It does not infer sensitive personal attributes or create targeted persuasion based on sensitive data.
