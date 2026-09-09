# STEP95 — VANDIRA Chat Message Actions

## Objective
Make every VANDIRA chat message independently actionable, following the familiar AI-assistant interaction pattern requested for the product.

## Added
- Per-message Copy action.
- Per-message Like / Dislike reaction state.
- Per-message Listen action using browser speech synthesis with Hindi-first language selection.
- Per-message Share action using the device Web Share API when available, with copy fallback.
- Per-message Feedback action with locally stored feedback metadata.
- Local message feedback storage is separate from canonical election data.
- Responsive mobile action bar with compact labels.

## Product rule
The action bar belongs to each message, not to the whole conversation. This makes every answer independently reusable, reviewable and shareable.

## Data integrity
- No canonical election, constituency, party, booth or Form-20 data was modified.
- No API keys or sensitive credentials are stored by these UI actions.
- Feedback remains local to the browser in `localStorage` until a future authenticated feedback service is introduced.

## Hindi-first
Listen defaults to `hi-IN` when VANDIRA is operating in Hindi. Other supported languages use their corresponding browser speech locale where available.
