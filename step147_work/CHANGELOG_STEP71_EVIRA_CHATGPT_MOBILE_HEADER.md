# STEP71 — EVIRA ChatGPT-like Mobile Header & Composer

- Replaced the text/Unicode new-chat glyph with a compact inline SVG pencil icon, angled in the familiar compose direction.
- Kept the three-dot overflow control and made its menu reliably visible outside the header bounds by removing the inherited overflow clipping and raising the menu stacking context.
- Kept Chat History inside the three-dot menu rather than adding another top-level mobile control.
- Raised the mobile composer into a floating ChatGPT-like bottom composer: rounded white input, compact suggestion chips above it, no footer clutter, safe-area aware spacing, and a small separation from the bottom edge.
- Added conversation bottom padding so the floating composer does not cover the latest chat content.
- Preserved Hindi-first UI and automatic conversation-language architecture from STEP69/70.
- No election/constituency/booth/Form 20 data values changed.
