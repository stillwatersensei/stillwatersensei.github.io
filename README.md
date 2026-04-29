# Stillwater v18.1

Corrected full replacement bundle.

## Fixes
- Restores minimal opening screen with idle Sage.
- Uses idle Sage breathing/ripple animation on the opening screen.
- Removes broken sprite display strip from the bottom.
- Uses safe fallback to `assets/sage/idle.png` when stage images are missing.
- Consolidates layout to fit standard browser windows better.
- Keeps the right Resources panel colored to balance the left panel.
- Audio defaults: Voice + Music, Google UK English Male preference, speed 0.95, pitch 0.90, voice 0.78, music 0.22.

## Optional image assets
Add these later when ready:
- assets/sage/breath.png
- assets/sage/lift-flow.png
- assets/sage/flowing-arms.png
- assets/sage/gather-qi.png
- assets/sage/stillness.png
- assets/sage/closing.png
- assets/sage/bow.png

If they are missing, the app falls back to idle.png instead of showing a broken image.
