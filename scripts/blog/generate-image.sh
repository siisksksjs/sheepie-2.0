#!/usr/bin/env bash
# Generate a blog illustration with Codex, always attaching the product reference sheets.
#
# Usage: scripts/blog/generate-image.sh <output-name> <scene-file> [product ...]
#   product: cervicloud | lumicloud-blue | lumicloud-apricot | calmicloud
# Example: scripts/blog/generate-image.sh posisi-tidur-yang-benar docs/seo/hero-prompts/01-posisi-tidur-yang-benar.md cervicloud
#
# Writes .superpowers/blog-art/<output-name>.png and public/images/blog/<output-name>.webp (use a new name when replacing an image: the image optimizer caches by path) (1920 wide).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NAME="$1"; SCENE="$2"; shift 2
REFS="$ROOT/docs/brand/product-refs"
OUT="$ROOT/.superpowers/blog-art"
mkdir -p "$OUT" "$ROOT/public/images/blog"

images=(-i "$REFS/mendung.png")
for product in "$@"; do
  ref="$REFS/$product.jpg"
  [[ -f "$ref" ]] || { echo "Missing reference sheet: $ref" >&2; exit 1; }
  images+=(-i "$ref")
done

prompt="$(cat "$ROOT/docs/seo/hero-style.md" "$ROOT/$SCENE")

Products shown in this image: ${*:-none}. Their reference sheets are attached.
Save the final image in this folder as: $NAME.png"

rm -f "$OUT/$NAME.png"
codex exec --skip-git-repo-check -C "$OUT" --sandbox workspace-write "$prompt" "${images[@]}" > "$OUT/$NAME.log" 2>&1
[[ -f "$OUT/$NAME.png" ]] || { echo "Codex did not save $NAME.png; see $OUT/$NAME.log" >&2; exit 1; }

node -e '
const sharp = require("sharp");
const [src, dst] = process.argv.slice(1);
sharp(src).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 84 }).toFile(dst).then((i) => console.log(`${dst} ${i.width}x${i.height} ${Math.round(i.size / 1024)}KB`));
' "$OUT/$NAME.png" "$ROOT/public/images/blog/$NAME.webp"
