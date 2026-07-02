# Organizing Dashboard — iOS Import Spike

A 10-minute spike that answers one question before the real PWA gets built:
**can an iOS standalone web app (added to the Home Screen) import a JSON file
from OneDrive via the Files picker — and if not, does clipboard paste work?**

This repo hosts **no data**. The page is a data-free shell; the test file it
imports (`spike-test-data.json`) lives in the owner's OneDrive and contains
only dummy fields (`schemaVersion`, `snapshotDate`, `probe`). Member data is
never hosted, committed, or transmitted — that is a hard rule carried forward
from the build plan.

## Run the spike (on the iPhone)

1. Open the GitHub Pages URL for this repo in Safari.
2. Share → **Add to Home Screen** → Add.
3. Launch from the new Home Screen icon. The page must show
   **"Standalone mode ✓"** — results earned in a normal Safari tab don't count.
4. **Test 1 — Picker:** tap *Pick spike-test-data.json* → Browse → OneDrive →
   Documents → Cowork OS → dashboard → `spike-test-data.json`.
   If the file is greyed out, use the second button (no type filter) — that
   distinguishes "picker broken" from "type filter broken."
5. **Test 2 — Clipboard:** in the OneDrive app, open the same file, select all,
   Copy. Return and tap *Read clipboard & import* (allow the Paste prompt),
   or paste into the box manually.
6. **Test 3 — Persistence:** after any successful import, swipe the app fully
   closed, relaunch from the icon. The Persistence chip flips to PASS by itself
   if localStorage survived.
7. Tap **Copy results summary** and paste it back into Cowork.

## Reading the result

| Outcome | Meaning for the build |
| --- | --- |
| Picker PASS (standalone) | Go — build Step 2 (shell split) with picker as the primary import. |
| Picker FAIL, clipboard PASS | Go, but clipboard paste becomes the primary import path. |
| Both FAIL in standalone | Stop — rethink import before building anything. |
| Persistence FAIL | Stop — localStorage model needs a rethink (IndexedDB / re-import per launch). |

## Files

- `index.html` — the whole spike (inline CSS/JS, no dependencies, error trap on page).
- `manifest.webmanifest` — makes Add-to-Home-Screen launch standalone.

This page gets replaced by the real app shell in Step 2 of the build plan.
