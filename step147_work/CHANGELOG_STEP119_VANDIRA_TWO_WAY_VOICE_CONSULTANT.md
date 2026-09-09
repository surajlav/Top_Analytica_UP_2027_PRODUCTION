# STEP119 — VANDIRA Two-way Voice Consultant

## Purpose
Completes the two-way voice interaction layer on top of STEP117 voice input and STEP118 local browser TTS.

## Flow
1. User starts Two-way Voice.
2. Browser SpeechRecognition listens in the selected Indian-language locale (Hindi-first).
3. Final transcript is placed into the existing AI composer and submitted through the existing VANDIRA intelligence pipeline.
4. The AI answer event is handed to the existing browser-local TTS layer.
5. Recognition is stopped during speech output to reduce microphone echo.
6. After speech ends, recognition restarts for the next question.

## Privacy / security
- This layer does not upload microphone audio itself.
- Existing AI request behavior and provider boundary remain unchanged.
- No new server-side storage of voice audio.
- Voice session diagnostics are bounded to browser-local event metadata.
- Existing audit/security layer remains in force.

## Safety / reliability
- Unsupported browser is handled explicitly.
- Microphone permission failures stop the session instead of looping.
- TTS failure falls back to text and returns to listening state.
- Existing text chat remains fully usable without voice.
- No election outcome prediction or sensitive voter targeting is introduced.
