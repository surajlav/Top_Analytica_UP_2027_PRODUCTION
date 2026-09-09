# STEP29 — Selected Party First Booth Comparison

## Purpose
Re-structure the public first-35-booth table so the selected party is the primary visual column and party symbols appear only in column headers.

## UI structure
1. Booth number
2. Selected Party — symbol, party name, selected candidate; each booth shows votes, vote-share %, and A/B/C category
3. Winner — symbol, party, candidate; booth-wise votes only
4. Runner-up — symbol, party, candidate; booth-wise votes only
5. 3rd Position — symbol, party, candidate; booth-wise votes only
6. 4th Position — symbol, party, candidate; booth-wise votes only
7. Total Electors
8. Total Votes

## Important rendering rule
No party symbols or candidate names are repeated inside booth rows. Booth rows are numeric/data-first.

## Category rule
Selected-party category is calculated from selected-party booth vote share:
- A: >50%
- B: 40–50%
- C: <40%

## Data binding
Winner and runner-up use the 2022 assembly master. The booth vote cells bind to the candidate/party vote records in the Form 20 first-35-booth layer.

If an explicit assembly-wide top-4 field is available, it is preferred for 3rd/4th. The current source package does not contain a dedicated assembly-wide 3rd/4th master field, so the renderer falls back to the verified Form 20 first-35 summary for those two header identities. This fallback must be replaced by an assembly-wide 2022 top-4 master before calling the 3rd/4th mapping final for all 403 ACs.

## Base preservation
No existing base data files were intentionally changed. Only constituency.html and this changelog were added/updated relative to STEP28.
