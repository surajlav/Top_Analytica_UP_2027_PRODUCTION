# STEP118 — VANDIRA Voice Output / Text-to-Speech

Adds a local browser Text-to-Speech layer for assistant messages.

## Included
- `assets/vandira-voice-output.js`
- AI assistant Listen action now uses the VANDIRA TTS layer.
- Hindi-first locale (`hi-IN`) with supported Indian-language locale mapping.
- Best available browser voice selection with language-prefix fallback.
- Start/end/error lifecycle events.
- Stop button in the AI composer.
- Pause/resume API exposed for future two-way voice integration.
- No audio upload or server-side audio persistence.

## Guardrails
- Browser/device voice availability is not guaranteed.
- TTS is presentation-only and does not alter AI evidence, provenance, or answer content.
- No voice identity or biometric inference.
- Production domain remains untouched.
