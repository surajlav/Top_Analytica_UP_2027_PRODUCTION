# STEP117 — VANDIRA Hindi Voice Input

## Added
- Hindi-first browser voice-to-text control in the main VANDIRA AI composer.
- Uses the browser SpeechRecognition / webkitSpeechRecognition API when available.
- Default recognition locale is `hi-IN`; the active VANDIRA language maps to its Indian locale when supported.
- Interim transcript appears in the existing composer and final transcript remains editable before sending.
- Start/stop state, permission/service errors and no-speech feedback are surfaced in the UI.
- Voice interaction metadata is kept locally in a bounded browser log for UX diagnostics.
- No microphone audio is uploaded to a VANDIRA API by this feature.
- Security Permissions-Policy updated to permit microphone use for the same origin, required for browser voice input.

## Guardrails
- This is input transcription, not autonomous voice conversation.
- Browser/device permissions remain under the user's control.
- If SpeechRecognition is unavailable, VANDIRA clearly reports the limitation and normal text input remains available.
- No claim is made that every browser supports Hindi or every listed Indian language.
- No political inference is derived from voice audio or transcript metadata.

## QA target
- Preserve all canonical election datasets unchanged.
- Validate JS syntax and ZIP integrity.
- Production `up.topanalytica.in` remains untouched.
