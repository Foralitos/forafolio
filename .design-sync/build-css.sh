#!/usr/bin/env bash
# Compiles the app's Tailwind stylesheet into a static sheet design-sync can ship.
# Run from the repo root. Output: .design-sync/_compiled.css (gitignored, regenerated).
set -euo pipefail
cd "$(dirname "$0")/.."
./node_modules/.bin/tailwindcss -i app/tailwind.css -o .design-sync/_compiled.css --minify
# `font-pixel` (NPCDialogBox) uses "Press Start 2P", an OFL Google font the app
# loads at runtime — prepend its webfont @import so cards render it too.
tmp="$(mktemp)"
printf "@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');\n" > "$tmp"
cat .design-sync/_compiled.css >> "$tmp"
mv "$tmp" .design-sync/_compiled.css
echo "compiled .design-sync/_compiled.css ($(wc -c < .design-sync/_compiled.css) bytes)"
