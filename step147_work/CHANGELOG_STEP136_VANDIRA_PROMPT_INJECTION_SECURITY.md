# STEP136 — VANDIRA Prompt Injection & Untrusted Evidence Security Layer

## Objective
Harden the AI retrieval-to-model boundary so retrieved news/RSS, summaries, URLs, user context, and query content are treated as data/task content rather than privileged instructions.

## Changes
- Added `functions/lib/untrusted-evidence.js`.
- Added deterministic pattern-based prompt-injection scanning.
- Added source trust metadata separate from source authority/tier.
- Added strict evidence delimiters before model submission.
- Added redaction of detected instruction-like source text from model evidence payloads.
- Added explicit system-policy language forbidding evidence/user-content instruction override.
- Added structured `evidence_security` metadata to `/api/ai` and retrieval trace.
- Added STEP136 evidence-security panel to `ai.html`.
- Added regression tests for hostile RSS/title and clean structured evidence.

## Security model
1. System/developer policy remains highest authority.
2. Server-selected route and execution plan are control data, not evidence instructions.
3. User query is task content and cannot override system/developer policy.
4. Retrieved content is untrusted data even when sourced from an official or structured connector.
5. Source tier/official status describes provenance; it does not grant instruction authority.
6. Suspicious source text is flagged and redacted from the model evidence payload while remaining represented in security metadata.

## Limitations
This is a deterministic structural security layer, not a complete semantic prompt-injection detector. Human/source review remains necessary for suspicious or ambiguous evidence.

## Data preservation
No election dataset was modified. Canonical assembly files remain byte/hash identical to STEP135.
