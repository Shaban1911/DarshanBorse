"""
Builds the identity files in this folder from the site's own fonts and
colours. Run:  python brand/build.py

The mark is the site's signature: the growth line with honest dips, ending in
the gold full stop, on the warm disc from the hero. The wordmark is the
letterhead: "Darshan" in Manrope 600, "Borse" in Manrope 400.
"""
from __future__ import annotations

import json
import os
import shutil
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "brand"
FONTS = ROOT / "public" / "fonts"

PAPER = "#f6f3ed"
CARD = "#fcfaf6"
INK = "#1b150d"
DEEP = "#061212"
SAND = "#ded2bf"
GOLD = "#b09367"
MINERAL = "#3c6669"
PAPER_ON_INK = "#f1eee8"


def load(name: str, wght: int) -> TTFont:
    font = TTFont(FONTS / name)
    if "fvar" in font:
        font = instantiateVariableFont(font, {"wght": wght})
    return font


def text_paths(font: TTFont, text: str, size: float, x: float, y: float, tracking: float = 0.0):
    """Returns (svg path data, advance width) for `text` at `size`, baseline at (x, y)."""
    cmap = font.getBestCmap()
    glyphs = font.getGlyphSet()
    upem = font["head"].unitsPerEm
    scale = size / upem
    hmtx = font["hmtx"]
    kern = _kerning(font)
    d = []
    cursor = x
    prev = None
    for ch in text:
        gname = cmap.get(ord(ch))
        if gname is None:
            cursor += size * 0.28
            prev = None
            continue
        if prev is not None:
            cursor += kern.get((prev, gname), 0) * scale
        pen = SVGPathPen(glyphs)
        glyphs[gname].draw(pen)
        path = pen.getCommands()
        if path:
            d.append(f'<path transform="translate({cursor:.2f} {y:.2f}) scale({scale:.5f} {-scale:.5f})" d="{path}"/>')
        cursor += hmtx[gname][0] * scale + tracking
        prev = gname
    return "\n".join(d), cursor - x


def _kerning(font: TTFont) -> dict:
    """Flat pair kerning from the GPOS pair-adjustment lookups, where present."""
    pairs: dict = {}
    if "GPOS" not in font:
        return pairs
    try:
        for lookup in font["GPOS"].table.LookupList.Lookup:
            for sub in lookup.SubTable:
                if getattr(sub, "LookupType", None) == 9:
                    sub = sub.ExtSubTable
                if getattr(sub, "LookupType", None) != 2:
                    continue
                if sub.Format == 1:
                    firsts = sub.Coverage.glyphs
                    for i, ps in enumerate(sub.PairSet):
                        for pvr in ps.PairValueRecord:
                            v = pvr.Value1.XAdvance if pvr.Value1 and hasattr(pvr.Value1, "XAdvance") else 0
                            if v:
                                pairs[(firsts[i], pvr.SecondGlyph)] = v
    except Exception:
        pass
    return pairs


# ── the mark ────────────────────────────────────────────────────────────────
# 200×200 canvas. Disc centred; the line rises, dips once, rises again and
# stops a breath before the full stop, the way a sentence ends.
LINE = "M 40 138 C 62 132 74 108 88 100 C 98 94 104 112 114 106 C 130 96 132 82 142 72"


def mark_svg(size: int = 200, simplified: bool = False, on_ink: bool = False) -> str:
    disc = SAND
    line = f'<path d="{LINE}" fill="none" stroke="{INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' if not simplified else ""
    dot = f'<rect x="{150 if not simplified else 92}" y="{54 if not simplified else 92}" width="{22 if not simplified else 38}" height="{22 if not simplified else 38}" rx="{5 if not simplified else 8}" fill="{GOLD}"/>'
    bg = f'<rect width="200" height="200" fill="{DEEP}"/>' if on_ink else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="{size}" height="{size}">'
        f"{bg}"
        f'<circle cx="100" cy="100" r="92" fill="{disc}"/>'
        f"{line}{dot}</svg>\n"
    )


def wordmark_svg(on_ink: bool = False, tagline: bool = False) -> str:
    manrope600 = load("Manrope.woff2", 600)
    manrope400 = load("Manrope.woff2", 400)
    dmsans = load("DMSans.woff2", 400)
    colour = PAPER_ON_INK if on_ink else INK
    muted = "#b9b3a8" if on_ink else "#675f55"
    size = 64
    d1, w1 = text_paths(manrope600, "Darshan", size, 0, 64, tracking=-0.4)
    d2, w2 = text_paths(manrope400, "Borse", size, w1 + size * 0.24, 64, tracking=-0.4)
    width = w1 + size * 0.24 + w2
    height = 84
    tag = ""
    if tagline:
        d3, _ = text_paths(dmsans, "Financial advisor", 20, 2, 100, tracking=0.2)
        tag = f'<g fill="{muted}">{d3}</g>'
        height = 116
    bg = f'<rect width="{width + 8:.0f}" height="{height}" fill="{DEEP}"/>' if on_ink else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width + 8:.0f} {height}" width="{width + 8:.0f}" height="{height}">'
        f"{bg}"
        f'<g fill="{colour}">{d1}</g><g fill="{colour}" opacity="{0.72 if not on_ink else 0.78}">{d2}</g>{tag}</svg>\n'
    )


def lockup_svg(on_ink: bool = False) -> str:
    """Mark at the left, wordmark and tagline beside it, on one baseline system."""
    manrope600 = load("Manrope.woff2", 600)
    manrope400 = load("Manrope.woff2", 400)
    dmsans = load("DMSans.woff2", 400)
    colour = PAPER_ON_INK if on_ink else INK
    muted = "#b9b3a8" if on_ink else "#675f55"
    size = 56
    x0 = 150
    d1, w1 = text_paths(manrope600, "Darshan", size, x0, 76, tracking=-0.4)
    d2, w2 = text_paths(manrope400, "Borse", size, x0 + w1 + size * 0.24, 76, tracking=-0.4)
    d3, _ = text_paths(dmsans, "Financial advisor", 18, x0 + 2, 104, tracking=0.2)
    width = x0 + w1 + size * 0.24 + w2 + 12
    bg = f'<rect width="{width:.0f}" height="132" fill="{DEEP}"/>' if on_ink else ""
    mark = mark_svg(120).replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="120" height="120">', "").replace("</svg>\n", "")
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.0f} 132" width="{width:.0f}" height="132">'
        f"{bg}"
        f'<g transform="translate(6 6) scale(0.6)">{mark}</g>'
        f'<g fill="{colour}">{d1}</g><g fill="{colour}" opacity="{0.72 if not on_ink else 0.78}">{d2}</g>'
        f'<g fill="{muted}">{d3}</g></svg>\n'
    )


def png_mark(size: int, simplified: bool, path: Path, bg: str | None = None) -> None:
    """Rasterises the mark geometrically (no SVG renderer needed) with 4× supersampling."""
    s = 4
    S = size * s
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0) if bg is None else bg)
    dr = ImageDraw.Draw(im)
    k = S / 200
    dr.ellipse([8 * k, 8 * k, 192 * k, 192 * k], fill=SAND)
    if not simplified:
        pts = _bezier_points(k)
        dr.line(pts, fill=INK, width=max(1, round(7 * k)), joint="curve")
        for p in (pts[0], pts[-1]):
            r = 3.5 * k
            dr.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=INK)
        dr.rounded_rectangle([150 * k, 54 * k, 172 * k, 76 * k], radius=5 * k, fill=GOLD)
    else:
        dr.rounded_rectangle([92 * k, 92 * k, 130 * k, 130 * k], radius=8 * k, fill=GOLD)
    im = im.resize((size, size), Image.LANCZOS)
    im.save(path)


def _bezier_points(k: float):
    """Samples the LINE path (three cubic segments) into points."""
    import re

    nums = [float(n) for n in re.findall(r"-?\d+(?:\.\d+)?", LINE)]
    p0 = (nums[0], nums[1])
    pts = [p0]
    i = 2
    while i + 5 < len(nums):
        c1, c2, p1 = (nums[i], nums[i + 1]), (nums[i + 2], nums[i + 3]), (nums[i + 4], nums[i + 5])
        for t in [j / 24 for j in range(1, 25)]:
            x = (1 - t) ** 3 * p0[0] + 3 * (1 - t) ** 2 * t * c1[0] + 3 * (1 - t) * t**2 * c2[0] + t**3 * p1[0]
            y = (1 - t) ** 3 * p0[1] + 3 * (1 - t) ** 2 * t * c1[1] + 3 * (1 - t) * t**2 * c2[1] + t**3 * p1[1]
            pts.append((x, y))
        p0 = p1
        i += 6
    return [(x * k, y * k) for x, y in pts]


def main() -> None:
    OUT.mkdir(exist_ok=True)
    (OUT / "mark.svg").write_text(mark_svg(), encoding="utf-8")
    (OUT / "mark-small.svg").write_text(mark_svg(simplified=True), encoding="utf-8")
    (OUT / "mark-on-ink.svg").write_text(mark_svg(on_ink=True), encoding="utf-8")
    (OUT / "wordmark.svg").write_text(wordmark_svg(), encoding="utf-8")
    (OUT / "wordmark-on-ink.svg").write_text(wordmark_svg(on_ink=True), encoding="utf-8")
    (OUT / "wordmark-tagline.svg").write_text(wordmark_svg(tagline=True), encoding="utf-8")
    (OUT / "lockup.svg").write_text(lockup_svg(), encoding="utf-8")
    (OUT / "lockup-on-ink.svg").write_text(lockup_svg(on_ink=True), encoding="utf-8")
    # raster set for favicons and app icons
    png_mark(512, False, OUT / "icon-512.png")
    png_mark(192, False, OUT / "icon-192.png")
    png_mark(180, False, OUT / "apple-touch-icon.png", bg=PAPER)
    png_mark(64, True, OUT / "icon-64.png")
    png_mark(32, True, OUT / "icon-32.png")
    png_mark(16, True, OUT / "icon-16.png")
    ico = [Image.open(OUT / f"icon-{s}.png") for s in (16, 32, 64)]
    ico[0].save(OUT / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (64, 64)], append_images=ico[1:])
    # the set the site serves
    public = ROOT / "public"
    for name in ("favicon.ico", "apple-touch-icon.png", "icon-192.png", "icon-512.png"):
        shutil.copyfile(OUT / name, public / name)
    (public / "icon.svg").write_text(mark_svg(simplified=True), encoding="utf-8")
    manifest = {
        "name": "Darshan Borse",
        "short_name": "Darshan",
        "description": "Financial advisor. One complete plan you can actually understand.",
        "start_url": "/",
        "display": "browser",
        "background_color": PAPER,
        "theme_color": "#121a1b",
        "icons": [
            {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
        ],
    }
    (public / "site.webmanifest").write_text(json.dumps(manifest, indent=2) + os.linesep.replace("\r", ""), encoding="utf-8")
    print("brand files written to", OUT, "and", public)


if __name__ == "__main__":
    main()
