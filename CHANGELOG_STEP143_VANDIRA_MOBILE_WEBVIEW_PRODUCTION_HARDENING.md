# STEP143 — VANDIRA Mobile / WebView Production Hardening

## Objective
Prepare the existing web application for a low-cost Android WebView/PWA shell without changing election data or AI grounding data.

## Changes
- Added `manifest.webmanifest` for installable/standalone shell metadata.
- Added `sw.js` with conservative static-asset caching.
- API and `/data/` requests are explicitly excluded from service-worker caching.
- Added `assets/mobile-runtime.js` for network-state UX, safe external-link attributes and service-worker registration.
- Added safe-area support, mobile text-size handling, touch targets, focus visibility and overflow protections.
- Added mobile/WebView metadata to all 29 HTML pages.
- Preserved existing navigation, data and AI request behavior.

## Important WebView boundary
This step does not create an Android APK/AAB. It hardens the web layer so it can be wrapped by an Android WebView later. The native shell should configure back navigation, external URL handling, downloads/file chooser, secure HTTPS-only navigation, splash/icon/versioning and Android lifecycle behavior.

## Data safety
No election data files were edited.
