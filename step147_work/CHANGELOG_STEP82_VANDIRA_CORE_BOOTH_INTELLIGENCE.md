# STEP82 — VANDIRA Core Booth Intelligence

Base: STEP81 VANDIRA Saffron White Black Premium.

## Core work
- Extended the read-only AI context builder with full Form20 booth aggregation for the selected constituency when the complete AC booth list is present in the existing chunk.
- Added selected-party booth totals, recorded vote share, booth leads/non-leads, strongest recorded vote-share booths, weakest recorded vote-share booths, and closest booth margins.
- Upgraded the local VANDIRA booth answer path to use the full available booth layer instead of only the first-35 preview.
- Added explicit wording that these are descriptive 2022 Form20 signals and not a 2027 forecast.
- Kept source attribution and data-gap behavior.
- Updated AI script cache versions to v82.

## Data safety
- Existing JSON data files were not edited.
- Original TOP Analytica black-and-white logo was not edited.
- No election values were rewritten.
