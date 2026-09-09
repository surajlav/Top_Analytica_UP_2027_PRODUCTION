# STEP68 — EVIRA Compact Header + Auto Multilingual UX

- Removed the visible Hindi/English segmented language bar from the EVIRA header.
- Removed the dedicated Home icon/button from the header.
- Added a compact three-dot command menu containing Home and a multilingual language selector.
- Added Auto language mode so EVIRA can follow the user's language; manual language selection remains available.
- Added Indian regional language choices: Hindi, English, Marathi, Telugu, Tamil, Bengali, Gujarati, Kannada, Malayalam, Punjabi, Odia and Assamese.
- Kept Chat History and New Chat visible in the header, with tighter mobile positioning.
- Renamed the visible AI wordmark in the header to EVIRA while retaining TOP ANALYTICA branding.
- Passed the selected/detected language code to `/api/ai` instead of limiting the Worker payload to English/Hindi.
- No election, constituency, booth, Form20 or historical data files were modified.
