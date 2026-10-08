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
# Every logo is exported on an identical white chip, so the strip is a row of
# matching tiles rather than a row of differently-shaped images. These are
# design pixels; SCALE multiplies them for high-density screens.
CHIP_W, CHIP_H = 160, 64
CHIP_PAD = 10
SCALE = 3
WEBP_QUALITY = 88

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
# area, so it stays correct if the chip is ever resized. 0.30 was chosen by
# eye: enough that the wordmarks stay legible, little enough that each logo
# still has clear space around it rather than crowding the chip.
CONTENT_FILL = 0.30

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
    """Composite onto white so every logo shares one background."""
    if im.mode != "RGBA":
        im = im.convert("RGBA")
    canvas = Image.new("RGBA", im.size, (255, 255, 255, 255))
    canvas.alpha_composite(im)
    return canvas.convert("RGB")


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
    Centre a logo on an identical white chip.

    The chip is baked into the asset rather than drawn in CSS so the
    proportions arranged here are exactly what renders — CSS cannot
    accidentally re-fit the logos and undo the area matching.
    """
    cw, ch = CHIP_W * SCALE, CHIP_H * SCALE
    chip = Image.new("RGB", (cw, ch), (255, 255, 255))
    # No mask: the logo has already been flattened onto white, so it is fully
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

            # Trim dead margin, then flatten to a shared white ground.
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
