# STEP98 — VANDIRA Personal Political Context

## Objective
Add a local-first, user-controlled consultant context layer so VANDIRA can preserve working continuity across questions without inferring sensitive personal attributes.

## Added
- `data/vandira_personal_context_contract_step98.json`
- `functions/lib/personal-context.js`
- `functions/api/personal-context.js`
- `assets/vandira-personal-context.js`

## Updated
- `functions/api/ai.js`
  - accepts sanitized `personal_context`
  - injects bounded consultant context into provider grounding
  - emits non-PII context metadata in retrieval trace
  - runtime trace advances to STEP98
- `assets/ai-copilot.js`
  - sends saved local context + selected constituency + bounded recent turns
- `ai.html`
  - adds Consultant Context menu
  - adds context editor for objective, focus areas, working notes, established facts and pending questions
  - response-depth preference
  - explicit privacy notice
- `assets/ai-screen.css`
  - responsive context panel styling

## Privacy / Safety
- Existing profile fields remain separate and are not sent to `/api/ai`.
- No server-side personal-profile persistence was introduced.
- Context is user-controlled and stored locally in the browser.
- Recent conversation continuity is bounded to the last six turns and sanitized.
- User notes are treated as context, not authoritative election facts.
- Sensitive personal attributes are not inferred.

## Data integrity
No canonical election, constituency, party, candidate, booth, Form 20, ECI warehouse, or historical dataset was modified.

## Runtime behavior
The AI provider receives:
1. current query
2. verified election/official/live evidence
3. STEP96 research plan
4. STEP97 evidence assessment/recommendation
5. STEP98 user-controlled consultant context

STEP98 does not claim that an AI provider is configured; provider availability remains environment-dependent.
