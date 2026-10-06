#!/usr/bin/env bash
#
# =====================================================================
#  ZNFU media pipeline
# =====================================================================
#
#  Masters in  →  assets/media-source/     (full-quality sources, tracked)
#  Web assets out → public/media/          (what actually ships)
#
#  Why it exists
#  -------------
#  The first build shipped ~6.1 MB of media, 4.26 MB of it video, and a
#  phone pulled 2.75 MB of hero video before a single word of copy had
#  rendered. Half of that was a second, "foreground" clip that no longer
#  exists; the rest was simply encoded larger than a decorative
#  background layer needs to be.
#
#  What it does
#  ------------
#   1. hero montage  → 1280×720 desktop + 540×720 (3:4) phone, with the
#      loop seam crossfaded so the montage repeats without a visible cut.
#   2. field footage → re-encoded at its native size.
#   3. Poster frames → WebP, taken from the *freshly encoded* video so the
#      poster matches what the visitor actually sees first.
#   4. Every photo in the master folder → WebP, longest edge capped,
#      EXIF (including GPS) stripped.
#
#  It is deliberately non-destructive: nothing in assets/media-source is
#  ever modified, so it can be re-run freely. Re-encoding an already
#  re-encoded file is how video quality quietly disappears, which is why
#  the videos read from the master folder too.
#
#  Requirements
#  ------------
#   · ffmpeg + ffprobe
#   · python3 with Pillow built against libwebp:
#       python3 -c "from PIL import features; print(features.check('webp'))"
#     Stills go through Pillow rather than ffmpeg because current ffmpeg
#     builds for macOS ship without the libwebp encoder.
#
#  Usage
#  -----
#   scripts/optimize-media.sh             # optimise in place
#   scripts/optimize-media.sh --dry-run   # report, write nothing
#
#  Adding photography: drop the full-size file in assets/media-source/,
#  run this script, and reference /media/<name>.webp in src/data/home.js.
#
# =====================================================================

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE="$ROOT/assets/media-source"
MEDIA="$ROOT/public/media"
FFMPEG="${FFMPEG:-ffmpeg}"
FFPROBE="${FFPROBE:-ffprobe}"

# ---- tuning ---------------------------------------------------------------
HERO_MASTER="$SOURCE/hero-background-master.mp4"
HERO_DESKTOP_W=1280
HERO_DESKTOP_H=720
HERO_DESKTOP_CRF=28
# The phone encode is cropped to 3:4 before it is scaled, rather than being a
# shrunken landscape frame. A hero on a 390×760 phone occupies a portrait
# slot, so a 16:9 source is cropped to ~27% of its width and *then* upscaled
# ~2.8×; a 3:4 crop is sharper, better framed, and fewer pixels to encode.
HERO_MOBILE_CROP="crop=ih*3/4:ih"
HERO_MOBILE_W=540
HERO_MOBILE_H=720
HERO_MOBILE_CRF=30

FIELD_MASTER="$SOURCE/field-footage-master.mp4"
FIELD_W=848
FIELD_H=480
FIELD_CRF=31

# Seconds of crossfade used to hide the montage's loop seam.
LOOP_BLEND=1

# WebP settings.
#
# 64 is not as low as it looks. WebP's quality scale is far less aggressive
# than JPEG's: measured on this project's own photography, q64 + a 1280px cap
# landed at roughly -50% versus the source JPEGs and was indistinguishable
# from them at the sizes they are actually displayed (verified against the
# largest, most detailed image at 2× display size and at 1:1).
WEBP_QUALITY=64
WEBP_MAX_EDGE=1280

# Where in the encoded hero the poster frame is taken from. The encoded loop
# starts 1s into the master, so 3.5s here is the cattle-by-water frame — the
# most legible of the three sequences and free of the watermark.
HERO_POSTER_AT=3.5
FIELD_POSTER_AT=1.0
# ---------------------------------------------------------------------------

DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

section() { printf '\n\033[1m%s\033[0m\n' "$*"; }
note() { printf '  \033[2m%s\033[0m\n' "$*"; }
step() { printf '  %s\n' "$*"; }

bytes() { wc -c < "$1" 2>/dev/null | tr -d ' ' || echo 0; }

human() {
  awk -v b="$1" 'BEGIN {
    if (b >= 1048576) printf "%.2f MB", b / 1048576
    else if (b >= 1024) printf "%.0f kB", b / 1024
    else printf "%d B", b
  }'
}

duration_of() { "$FFPROBE" -v error -show_entries format=duration -of csv=p=0 "$1"; }

# ---------------------------------------------------------------------------
# encode_video <src> <out> <w> <h> <crf> <blend-seam: yes|no> [pre-filter]
#
# `pre-filter` runs first (used to crop the phone encode to portrait). The
# scale/pad pair then guarantees the output is exactly w×h for any input, so a
# future source with a different aspect ratio is letterboxed rather than
# stretched. `blend-seam` joins the clip's head onto its own tail, which makes
# the first and last frame identical and the loop point invisible.
# ---------------------------------------------------------------------------
encode_video() {
  local src="$1" out="$2" w="$3" h="$4" crf="$5" blend="$6" pre="${7:-}"
  [ -n "$pre" ] && pre="${pre},"

  local scale="scale=${w}:${h}:force_original_aspect_ratio=decrease:flags=lanczos"
  scale+=",pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p"

  local graph="[0:v]${pre}${scale}[v]"

  if [ "$blend" = "yes" ]; then
    local d offset
    d="$(duration_of "$src")"
    offset="$(awk -v d="$d" -v n="$LOOP_BLEND" 'BEGIN { printf "%.3f", d - 2 * n }')"
    if awk -v o="$offset" 'BEGIN { exit !(o > 0) }'; then
      # Split after the crop: blending a smaller frame is cheaper.
      local body="trim=start=${LOOP_BLEND},setpts=PTS-STARTPTS[body]"
      local head="trim=start=0:end=${LOOP_BLEND},setpts=PTS-STARTPTS[head]"
      local join="[body][head]xfade=transition=fade:duration=${LOOP_BLEND}:offset=${offset}"
      graph="[0:v]${pre}split=2[bsrc][hsrc];[bsrc]${body};[hsrc]${head};${join},${scale}[v]"
    else
      note "clip too short to blend its loop seam — encoding as-is"
    fi
  fi

  "$FFMPEG" -nostdin -y -v error -i "$src" \
    -filter_complex "$graph" -map "[v]" -an \
    -c:v libx264 -profile:v high -level 4.0 -preset slow -crf "$crf" \
    -pix_fmt yuv420p -movflags +faststart \
    "$out"
}

# encode_to <src> <out> <w> <h> <crf> <blend> [pre-filter]
# Encodes to a temp file first, so a failed run can never leave a half-written
# file in public/media.
encode_to() {
  local src="$1" out="$2" w="$3" h="$4" crf="$5" blend="$6" pre="${7:-}"
  local before after tmp
  before="$(bytes "$src")"
  tmp="$(mktemp -t znfu-media).mp4"
  encode_video "$src" "$tmp" "$w" "$h" "$crf" "$blend" "$pre"
  after="$(bytes "$tmp")"
  if [ "$DRY_RUN" = "1" ]; then
    rm -f "$tmp"
    step "$(printf '%-28s' "$(basename "$out")") $(human "$before") → $(human "$after")  (dry run)"
  else
    mv "$tmp" "$out"
    step "$(printf '%-28s' "$(basename "$out")") $(human "$before") → $(human "$after")"
  fi
}

# extract_poster <encoded-video> <at-seconds> <out.png>
extract_poster() {
  local src="$1" at="$2" out="$3"
  if [ "$DRY_RUN" = "1" ]; then
    step "$(printf '%-28s' "$(basename "$out")") (dry run)"
    return
  fi
  "$FFMPEG" -nostdin -y -v error -ss "$at" -i "$src" -frames:v 1 -c:v png "$out"
}

# ---------------------------------------------------------------------------
section "Video"
note "hero montage → desktop 1280×720"
encode_to "$HERO_MASTER" "$MEDIA/hero-background.mp4" \
  "$HERO_DESKTOP_W" "$HERO_DESKTOP_H" "$HERO_DESKTOP_CRF" yes
note "hero montage → phone 540×720 (3:4 crop)"
encode_to "$HERO_MASTER" "$MEDIA/hero-background-mobile.mp4" \
  "$HERO_MOBILE_W" "$HERO_MOBILE_H" "$HERO_MOBILE_CRF" yes "$HERO_MOBILE_CROP"
note "field footage (${FIELD_W}×${FIELD_H})"
encode_to "$FIELD_MASTER" "$MEDIA/field-footage.mp4" \
  "$FIELD_W" "$FIELD_H" "$FIELD_CRF" no

section "Poster frames"
extract_poster "$MEDIA/hero-background.mp4" "$HERO_POSTER_AT" \
  "$MEDIA/hero-background-poster.png"
extract_poster "$MEDIA/field-footage.mp4" "$FIELD_POSTER_AT" \
  "$MEDIA/field-footage-poster.png"

# ---------------------------------------------------------------------------
section "Stills → WebP (q$WEBP_QUALITY, ${WEBP_MAX_EDGE}px cap)"
python3 - "$SOURCE" "$MEDIA" "$WEBP_QUALITY" "$WEBP_MAX_EDGE" "$DRY_RUN" <<'PY'
import pathlib
import sys

from PIL import Image, ImageOps, features

if not features.check("webp"):
    sys.exit("Pillow was built without WebP support — cannot continue.")

source = pathlib.Path(sys.argv[1])
media = pathlib.Path(sys.argv[2])
quality = int(sys.argv[3])
max_edge = int(sys.argv[4])
dry_run = sys.argv[5] == "1"

IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png"}


def human(n: int) -> str:
    if n >= 1048576:
        return f"{n / 1048576:.2f} MB"
    if n >= 1024:
        return f"{n / 1024:.0f} kB"
    return f"{n} B"


def encode_webp(src: pathlib.Path, dest: pathlib.Path) -> None:
    """Write `dest` as WebP, capped and stripped of all metadata."""
    with Image.open(src) as im:
        # Bake in camera orientation before the metadata is discarded.
        im = ImageOps.exif_transpose(im)
        if im.mode != "RGB":
            im = im.convert("RGB")

        w, h = im.size
        longest = max(w, h)
        if longest > max_edge:
            ratio = max_edge / longest
            im = im.resize((round(w * ratio), round(h * ratio)), Image.LANCZOS)

        # No exif= argument: metadata, GPS included, is dropped rather than
        # copied. Saving is delayed to the end of the block, while the file
        # handle is still open.
        im.save(dest, "WEBP", quality=quality, method=6)


def report(src: pathlib.Path, dest: pathlib.Path, label=None) -> None:
    before = src.stat().st_size
    after = dest.stat().st_size
    saved = 100 * (1 - after / before) if before else 0
    print(f"  {label or dest.name:<40} {human(before):>8} → {human(after):>8}  −{saved:.0f}%")


# 1. Photography: masters → public/media.
if not source.is_dir():
    sys.exit(f"missing master folder: {source}")

for src in sorted(source.iterdir()):
    if src.suffix.lower() not in IMAGE_SUFFIXES:
        continue
    dest = media / f"{src.stem}.webp"
    if dry_run:
        print(f"  {dest.name:<40} (dry run)")
        continue
    encode_webp(src, dest)
    report(src, dest)

# 2. Posters, freshly extracted from the encoded video this run.
for png in sorted(media.glob("*-poster.png")):
    if dry_run:
        print(f"  {png.with_suffix('.webp').name:<40} (dry run)")
        continue
    dest = png.with_suffix(".webp")
    encode_webp(png, dest)
    report(png, dest)
    png.unlink()

# 3. Prune anything in public/media that a WebP has superseded. This is what
#    removes the JPEG posters the extraction step replaced, and any loose
#    source photography that was previously copied in by hand.
if not dry_run:
    for old in sorted(media.iterdir()):
        if old.suffix.lower() in IMAGE_SUFFIXES and old.with_suffix(".webp").exists():
            print(f"  removed superseded {old.name}")
            old.unlink()

# 4. Social card for og:image. This one deliberately stays a JPEG: it is
#    fetched by link scrapers rather than browsers, and several of them still
#    cannot read WebP, so it is the one image that must not be converted. It is
#    never requested by a visitor, so its size does not affect the page.
poster = media / "hero-background-poster.webp"
if poster.exists():
    dest = media / "og-image.jpg"
    if dry_run:
        print(f"  {dest.name:<40} (dry run)")
    else:
        with Image.open(poster) as im:
            im = im.convert("RGB")
            scaled = im.resize(
                (1200, round(im.height * 1200 / im.width)), Image.LANCZOS
            )
            scaled.save(dest, "JPEG", quality=82, optimize=True, progressive=True)
        print(f"  {dest.name:<40} {human(dest.stat().st_size):>8}")
PY

# ---------------------------------------------------------------------------
section "public/media (shipped)"
if [ "$DRY_RUN" = "1" ]; then
  note "dry run — nothing written"
else
  total=0
  while IFS= read -r f; do
    size="$(bytes "$f")"
    total=$((total + size))
    printf '  %-40s %8s\n' "$(basename "$f")" "$(human "$size")"
  done < <(find "$MEDIA" -type f | sort)
  printf '  %-40s %8s\n' "TOTAL" "$(human "$total")"

  masters=0
  while IFS= read -r f; do
    masters=$((masters + $(bytes "$f")))
  done < <(find "$SOURCE" -type f)
  printf '\n  masters kept in assets/media-source: %s\n' "$(human "$masters")"
fi
