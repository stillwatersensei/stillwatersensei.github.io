# Stillwater Sensei v16.3

Open-source, browser-based Chair Tai Chi + Qigong guided practice led by Sage the Stillwater Sensei, a calm 2D panda guide.

## What changed in v16.3

- Added remembered audio preferences using `localStorage`.
- Default audio mode is now **Play Voice + Music**.
- Music now flows steadily across practice stages instead of changing automatically when a section changes.
- Music playlist advances to the next local MP3 only when the current song ends.
- Added Browser Voice selector to the main app and history page.
- Default browser voice target is Microsoft Zira when available.
- Default levels match the preferred test settings: slower voice, raised pitch, medium voice volume, low music volume.
- Sound & Voice settings are collapsed on entry and open only when clicked.
- Added calming Sage breathing scale animation and soft water ripple effect.
- Tightened layout so the opening screen fits better inside a browser window.
- Top-left Stillwater logo now links back to the opening screen.
- Cache-busting bumped to `v=16.3`.

## Expected audio files

Place local music MP3 files here:

```text
assets/audio/breath.mp3
assets/audio/flow.mp3
assets/audio/stillness.mp3
assets/audio/closing.mp3
```

Place optional local Sage voice MP3 files here:

```text
assets/voice/01-awakening-breath.mp3
assets/voice/02-lift-flow.mp3
assets/voice/03-flowing-arms.mp3
assets/voice/04-gather-qi.mp3
assets/voice/05-stillness.mp3
assets/voice/06-closing.mp3
assets/voice/07-final-bow.mp3
```

If voice MP3 files are missing, the app falls back to the selected built-in browser voice.

## Upload to GitHub Pages

Replace the repository files with this bundle, keeping the same folder structure.

Test with:

```text
https://stillwatersensei.github.io/?v=16.3
https://stillwatersensei.github.io/app.js?v=16.3
https://stillwatersensei.github.io/style.css?v=16.3
```

Created by David Fliesen in 2026.
