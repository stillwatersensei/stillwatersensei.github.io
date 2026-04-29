# Stillwater Sensei v17

Open-source, browser-based Chair Tai Chi + Qigong guided practice led by Sage the Stillwater Sensei, a calm 2D panda guide.

## What changed in v17

- Added Sage sprite animation scaffold for every practice stage.
- Sprite animation now starts when the stage voice starts.
- Music continues steadily in the background and does not reset when changing sections.
- When a music track ends, the playlist advances to the next local MP3.
- Voice can use local MP3 files first, then falls back to the selected browser voice.
- If sprite frames are missing, the app safely falls back to the existing still Sage PNG pose.
- Cache-busting bumped to `v=17`.

## Drop-in files

Upload everything in this bundle to the root of the GitHub Pages repo:

```text
index.html
style.css
app.js
history.html
voicetest.html
README.md
assets/
```

## Music files

Place local music MP3 files here:

```text
assets/audio/breath.mp3
assets/audio/flow.mp3
assets/audio/stillness.mp3
assets/audio/closing.mp3
```

## Sage voice files

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

## Sage sprite folders

Place transparent PNG sprite frames here:

```text
assets/sage/sprites/awakening-breath/frame-01.png
assets/sage/sprites/awakening-breath/frame-02.png
assets/sage/sprites/lift-flow/frame-01.png
assets/sage/sprites/lift-flow/frame-02.png
assets/sage/sprites/flowing-arms/frame-01.png
assets/sage/sprites/gather-qi/frame-01.png
assets/sage/sprites/stillness/frame-01.png
assets/sage/sprites/closing/frame-01.png
assets/sage/sprites/final-bow/frame-01.png
```

Recommended frame counts in the current app:

```text
Awakening Breath: 8 frames
Lift & Flow: 8 frames
Flowing Arms: 8 frames
Gather Qi: 8 frames
Stillness: 6 frames
Closing: 8 frames
Final Bow: 6 frames
```

Use exact names like `frame-01.png`, `frame-02.png`, etc.
