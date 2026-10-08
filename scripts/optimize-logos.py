#!/usr/bin/env python3
"""
=====================================================================
  Normalise partner logos for the "Working with" strip.
=====================================================================

  Reads the client-supplied artwork in `assets/logos/` and writes
  web-ready files to `public/media/partners/`.

  Why this exists
  ---------------
  The supplied logos are a mixture of formats and shapes that cannot
  be dropped into a row and look deliberate:

    · seven are JPEGs on a flat pure-white background
    · WARMA is a transparent PNG whose wordmark is WHITE, so it is
      literally invisible on any light surface
    · Conservation Farming Unit is a JPEG scanned with a grey,
      uneven backdrop filling the whole tile
    · aspect ratios run from 1:1 to 3.6:1

  Two of those need more than a resize, and both are handled below by
  a named, per-asset rule rather than by a general heuristic. Each is
  a repair to make an asset usable as-supplied, NOT a redesign, and
  both are flagged in the output so they are easy to revisit if the
  client can provide proper vector or transparent originals.

  What every logo gets
  --------------------
  Trimmed to its content, so no logo carries dead margin that would
  make its neighbours look inconsistently sized when they are fitted
  into a shared box.

Usage:
    scripts/optimize-logos.py [--dry-run]
"""

import argparse
import pathlib
import sys

from PIL import Image, ImageChops

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets" / "logos"
OUT = ROOT / "public" / "media" / "partners"

# ---- Chip geometry -------------------------------------------------------
# Every logo is exported on an identical chip, so the strip is a row of
# matching tiles rather than a row of differently-shaped images. These are
# design pixels; SCALE multiplies them for high-density screens.
CHIP_W, CHIP_H = 200, 80
CHIP_PAD = 8
SCALE = 3

# 92, not the 88 used for photography.
#
# These are flat colour fields behind thin wordmarks, which is the worst case
# for a lossy codec and the one place where its artefacts are actually visible.
# Encoded from a pixel-perfect uniform fill, q88 was the only setting that
# introduced variation — a spread of 4 across the flat area, which is enough to
# read as faint mottling where the chip meets a perfectly flat CSS background.
# q92 holds that spread at 0 for 46 kB across all nine, against 217 kB for
# lossless. q92 does shift the fill by one unit in the green channel
# (245,242,232 -> 245,243,232); that is 0.4% luminance, well under the ~1%
# just-noticeable difference for a large flat area, and it is uniform rather
# than noise, so there is no edge to see.
WEBP_QUALITY = 92

# The colour the chip is filled with — which is the band the strip renders on.
#
# This must stay in step with `bg-cream-100` on the strip in SiteFooter.vue,
# which comes from `--color-cream-100` in src/style.css. The chip and the band
# being the same colour is the entire point: the logos then sit directly on
# the section with no tile behind them at all. Change one and every logo
# reappears inside a faint box.
#
# (Pure white was the previous value, while the strip sat on dark green. On
# the off-white band, white chips show as slightly cool rectangles — the hue
# gap is small but flat areas make it obvious.)
CHIP_BG = (245, 242, 232)   # --color-cream-100

# Logos are sized to a shared visual AREA rather than a shared height.
#
# Fitting by height alone is the obvious approach and it is wrong for this
# set: it makes the 1:1 emblems (MOF, ZARI, the National Assembly, CFU) look
# small and light while the wide wordmarks (Zambia Meteorological Department
# at 5.8:1, Food Reserve Agency at 3.2:1) dominate. Measured on the supplied
# artwork, height-fitting left a 3.7x spread in ink area between the smallest
# and largest logo. Equalising area brings that to about 1.1x, so no single
# partner reads as more important than the others.
#
# Expressed as a fraction of the content box rather than an absolute pixel
# area, so it stays correct if the chip is ever resized.
#
# The 0.30 -> 0.27 drop is not a reduction in size. The content box grew from
# 140x44 to 184x64 at the same time, so the actual target area went from 1848
# to 3180 and every logo renders about 30% larger. The fraction came down only
# because the box grew faster than the target did.
#
# The limit here is the square emblems (MOF, ZARI, the National Assembly,
# WARMA, CFU): they are bounded by the content box HEIGHT, so they cannot grow
# at all without a taller chip. Height-fitting them at 43px of a 44px box was
# already at the ceiling, which is why enlarging the logos needed a new chip
# rather than just a bigger CSS size.
CONTENT_FILL = 0.27

# How close to white a pixel must be to count as background when trimming.
WHITE_TOLERANCE = 12


# ---------------------------------------------------------------------
#  Per-asset rules
# ---------------------------------------------------------------------

def repair_conservation_farming_unit(im):
    """
    Remove the scanned grey backdrop.

    This logo was supplied as a photograph of a printed mark: a green
    circle sitting on a grey, unevenly-lit background. The backdrop is
    not part of the logo, and on a light chip it would show as a dirty
    grey square while its neighbours sit clean.

    The mark itself is only two colours — green, and the near-white of
    the leaf — so anything that is neither is backdrop. Green pixels are
    kept untouched; everything else is forced to pure white, which
    leaves the leaf white (as intended) and the backdrop gone.
    """
    im = im.convert("RGB")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            green = (g - r > 10) and (g - b > 10)
            if not green:
                px[x, y] = (255, 255, 255)
    return im.convert("RGBA")


def repair_warma(im):
    """
    Drop WARMA's wordmark, keeping the circular mark.

    The supplied PNG is white-on-transparent: its wordmark ("WATER
    RESOURCES MANAGEMENT AUTHORITY") is white text, which is invisible
    against the light chip every other logo needs. It cannot be shown
    as supplied on any surface that suits the rest of the set.

    Rather than recolour the client's wordmark — which would be
    redesigning their logo — this crops to the circular emblem at the
    left of the file. That mark is complete and recognisable on its
    own, and it matches the circular form of MOF, ZARI, the National
    Assembly and CFU, so the row reads as a set.

    The wordmark occupies the right-hand side of the canvas. Measuring the
    alpha channel, the opaque columns run 11..151 (the circle), then there is
    an empty gap at 152..162, then the wordmark from 163 outwards. Cutting in
    the middle of that gap separates the two cleanly — an earlier cut at x=200
    landed inside the wordmark and left a stray fragment of text beside the
    emblem.
    """
    im = im.convert("RGBA")
    w, h = im.size
    circle_region = im.crop((0, 0, min(157, w), h))
    return circle_region


# ---------------------------------------------------------------------
#  Shared steps
# ---------------------------------------------------------------------

def trim_flat_background(im):
    """Trim uniform (near-white) margins from an opaque logo."""
    rgb = im.convert("RGB")
    bg = Image.new("RGB", rgb.size, rgb.getpixel((0, 0)))
    diff = ImageChops.difference(rgb, bg).convert("L")
    box = diff.point(lambda p: 255 if p > WHITE_TOLERANCE else 0).getbbox()
    return im.crop(box) if box else im


def trim_transparency(im):
    """Trim fully transparent margins from a logo that has an alpha channel."""
    alpha = im.split()[3]
    box = alpha.getbbox()
    return im.crop(box) if box else im


def is_transparent(im):
    return im.mode in ("RGBA", "LA") and im.split()[-1].getextrema()[0] < 250


def flatten_onto_white(im):
    """Composite onto white so every logo shares one known background."""
    if im.mode != "RGBA":
        im = im.convert("RGBA")
    canvas = Image.new("RGBA", im.size, (255, 255, 255, 255))
    canvas.alpha_composite(im)
    return canvas.convert("RGB")


def retint_flat_white(im, target):
    """
    Move a logo off its white background and onto `target`.

    Every supplied logo sits on pure white. The band now wants cream, so the
    white has to go — otherwise each logo floats inside a faint white box,
    which is exactly the mismatch the chip was introduced to avoid.

    A threshold will not do. These are wordmarks, so almost every glyph edge
    is a blend of ink and white, and hard-keying those leaves grey halos
    against the cream. Instead this recovers how much ink covers each pixel
    and rebuilds the pixel against the new background:

        rendered = ink*a + white*(1-a)
        wanted   = ink*a + target*(1-a)

    Subtracting the first from the second gives

        wanted = rendered + (target - white) * (1 - a)

    `a` is estimated from the pixel's weakest channel, which is 0 for pure
    white and 1 for any saturated ink. So pure white lands exactly on
    `target`, opaque ink is untouched, and the glyph edges between them are
    recalculated rather than left behind as grey.

    Finally, pixels that are essentially all background are snapped to
    exactly `target`. The supplied JPEGs do not have a perfectly uniform
    white — they carry compression noise, so their "white" wanders over a
    small range. After retinting, that wander survives as a couple of units
    of variation in the chip. On a large flat area sitting directly against a
    flat CSS background, a few units is enough to read as faint mottling, so
    it is worth removing. Lossless encoding does not help: the variation is in
    the source, and measurement showed lossless still carried it.

    The snap only touches pixels with a weakest channel at or above 248,
    which is background at 97% or more. Anything with more ink than that is
    a genuine glyph edge and is left exactly as the retint computed it.
    """
    im = im.convert("RGB")
    px = im.load()
    w, h = im.size
    tr, tg, tb = target
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            weakest = min(r, g, b)
            if weakest >= 248:
                px[x, y] = target
                continue
            background = weakest / 255   # share of the pixel that is backdrop
            px[x, y] = (
                max(0, min(255, round(r + (tr - 255) * background))),
                max(0, min(255, round(g + (tg - 255) * background))),
                max(0, min(255, round(b + (tb - 255) * background))),
            )
    return im


def scale_to_area(im, fill_fraction, box_w, box_h):
    """
    Resize so every logo carries a similar amount of ink.

    Scales by sqrt(target / (w*h)) — the side of a square with the target
    area divided by the logo's own aspect — which preserves proportions
    exactly while equalising visual weight. Clamped to the content box so a
    very wide mark cannot overflow it.

    Never crops and never stretches: a distorted logo is far more noticeable
    than a logo that is simply wider than its neighbours.
    """
    target_area = box_w * box_h * fill_fraction
    w, h = im.size
    scale = (target_area / (w * h)) ** 0.5
    scale = min(scale, box_w / w, box_h / h)
    return im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)


def compose_chip(logo):
    """
    Centre a logo on an identical chip.

    The chip is baked into the asset rather than drawn in CSS so the
    proportions arranged here are exactly what renders — CSS cannot
    accidentally re-fit the logos and undo the area matching.
    """
    cw, ch = CHIP_W * SCALE, CHIP_H * SCALE
    chip = Image.new("RGB", (cw, ch), CHIP_BG)
    # No mask: the logo has already been retinted to CHIP_BG, so it is fully
    # opaque and its own background matches the chip it is being placed on.
    chip.paste(logo, ((cw - logo.width) // 2, (ch - logo.height) // 2))
    return chip


# ---------------------------------------------------------------------
#  The set
# ---------------------------------------------------------------------
# Explicit source -> output mapping. The supplied filenames are inconsistent
# (spaces, capitals, mixed extensions), so relying on them would be fragile.
# `rule` names the per-asset repair applied before the shared steps.
SET = [
    ("FRA.jpeg", "food-reserve-agency", None),
    ("MOF.jpeg", "ministry-of-finance", None),
    ("Ministry-of-Agriculture-and-Cooperatives.jpg", "ministry-of-agriculture", None),
    ("National Assembly.jpeg", "national-assembly", None),
    ("WARMA.png", "warma", repair_warma),
    ("ZARI.jpeg", "zari", None),
    ("ZMD.png", "zambia-meteorological-department", None),
    ("ZSA.jpg", "zambia-statistics-agency", None),
    ("conservation farming unit.jpeg", "conservation-farming-unit", repair_conservation_farming_unit),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not SOURCE.is_dir():
        sys.exit(f"missing logo folder: {SOURCE}")

    if not args.dry_run:
        OUT.mkdir(parents=True, exist_ok=True)

    print(f"  {'logo':<36}{'source':<26}{'exported'}")
    for src_name, out_name, rule in SET:
        src = SOURCE / src_name
        if not src.exists():
            print(f"  {out_name:<36}{'MISSING':<26}skipped")
            continue

        with Image.open(src) as raw:
            im = raw.convert("RGBA")

            if rule:
                im = rule(im)
                note = f"[{rule.__name__.replace('repair_', '')}]"
            else:
                note = ""

            # Trim dead margin, then flatten to a known white ground.
            im = trim_transparency(im) if is_transparent(im) else trim_flat_background(im)
            im = flatten_onto_white(im)
            # Size in DESIGN pixels, then upscale once for the export. Doing
            # the area maths after the upscale would need the target
            # multiplied by SCALE squared — an easy factor-of-nine mistake.
            im = scale_to_area(im, CONTENT_FILL,
                               CHIP_W - 2 * CHIP_PAD,
                               CHIP_H - 2 * CHIP_PAD)
            canvas_w, canvas_h = CHIP_W * SCALE, CHIP_H * SCALE
            im = im.resize((im.width * SCALE, im.height * SCALE), Image.LANCZOS)
            # Retint AFTER resampling: the glyph edges are then rebuilt once,
            # in the colour they will actually be displayed in.
            im = retint_flat_white(im, CHIP_BG)
            im = compose_chip(im)
            assert im.size == (canvas_w, canvas_h)

            dest = OUT / f"{out_name}.webp"
            if args.dry_run:
                print(f"  {out_name:<36}{src_name:<26}{im.size[0]}x{im.size[1]} (dry run) {note}")
            else:
                im.save(dest, "WEBP", quality=WEBP_QUALITY, method=6)
                kb = dest.stat().st_size / 1024
                print(f"  {out_name:<36}{src_name:<26}{im.size[0]}x{im.size[1]}  {kb:.0f} kB {note}")


if __name__ == "__main__":
    main()
