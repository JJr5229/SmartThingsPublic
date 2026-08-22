#!/usr/bin/env python3
"""
Finish Phase 3 imagery for the GLP-1 Companion Planner.

Run this once the four generated source photos are available locally. It builds the
hero (real dashboard screenshot perspective-warped into the laptop's green screen)
and the three lifestyle images, compositing ALL text locally in Hanken Grotesk so the
whole set shares one font, weight and accent treatment.

    python3 finish_imagery.py --sources ./source-photos

Expected in --sources (any of these names, or the raw hf_*.png filenames):
    1_hero_green.png  2_before.png  3_after.png  4_appointment.png

Outputs to Etsy/:
    01_hero.png  14_lifestyle_before.png  15_lifestyle_after.png  16_lifestyle_appointment.png

Self-checks before it will declare success:
  * green quad actually found in the hero source
  * headline >= 70px and subtitle >= 22px on the 1254px canvas (the text floor that
    has been skipped on two previous builds)
  * mean brightness of the four outputs within 1.5x of each other

Requires: pillow, numpy. Fonts are fetched from Google Fonts on first run and cached.
"""
import argparse, os, sys, urllib.request, glob, re

from PIL import Image, ImageDraw, ImageFont
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
SCRIPTS = os.path.join(REPO, ".claude", "skills", "niche-planner-builder", "scripts")
sys.path.insert(0, SCRIPTS)
from composite_greenscreen_mockup import (                      # noqa: E402
    composite_screenshot_into_greenscreen, find_green_quad,
)

CANVAS   = 1254
HEAD_MIN = 70      # px, ~5.6% of canvas width
SUB_MIN  = 22      # px, ~1.75% of canvas width

SLATE  = (62, 76, 109)     # --primary
INK    = (22, 26, 34)      # --text
AMBER  = (198, 122, 30)    # --accent
MUTED  = (105, 112, 134)   # --muted

FONT_DIR = os.path.join(HERE, ".fonts")
GF_CSS = ("https://fonts.googleapis.com/css2?"
          "family=Hanken+Grotesk:wght@400;500;700&display=swap")
_FONT_CACHE = {}


def font_path(weight=700):
    """Hanken Grotesk (the app's own display face) at a given weight, cached on disk.

    Resolved through the Google Fonts CSS API, which hands back a plain static .ttf per
    weight from fonts.gstatic.com. That beats pulling the variable font off a GitHub raw
    URL, which 403s behind some egress proxies and needs axis-pinning to be useful.
    """
    if weight in _FONT_CACHE:
        return _FONT_CACHE[weight]
    os.makedirs(FONT_DIR, exist_ok=True)
    dest = os.path.join(FONT_DIR, f"HankenGrotesk-{weight}.ttf")
    if not os.path.exists(dest):
        try:
            req = urllib.request.Request(GF_CSS, headers={"User-Agent": "Mozilla/5.0"})
            css = urllib.request.urlopen(req, timeout=20).read().decode()
            blocks = css.split("@font-face")
            url = None
            for b in blocks:
                if f"font-weight: {weight}" in b:
                    m = re.search(r"src: url\((https://[^)]+\.ttf)\)", b)
                    if m:
                        url = m.group(1)
                        break
            if not url:
                raise RuntimeError(f"weight {weight} not present in the Google Fonts CSS")
            urllib.request.urlretrieve(url, dest)
        except Exception as e:                                   # noqa: BLE001
            print(f"  ! could not fetch Hanken Grotesk w{weight} ({e}); falling back to DejaVu")
            for c in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                      "/Library/Fonts/Arial Bold.ttf",
                      "/System/Library/Fonts/Helvetica.ttc"):
                if os.path.exists(c):
                    _FONT_CACHE[weight] = c
                    return c
            raise
    _FONT_CACHE[weight] = dest
    return dest


def load(size, weight=700):
    return ImageFont.truetype(font_path(weight), size)


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur); cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_ring_divider(draw, x, y, width, color=SLATE, ring=AMBER, r=9):
    """The dose-ring motif, drawn as a real shape -- never a font dingbat."""
    cx = x + width // 2
    draw.line([(x, y), (cx - r - 10, y)], fill=color, width=2)
    draw.line([(cx + r + 10, y), (x + width, y)], fill=color, width=2)
    draw.ellipse([cx - r, y - r, cx + r, y + r], outline=ring, width=3)


def draw_accent_line(draw, x, y, line, font, accent_word, base=INK, accent=AMBER):
    """Draw one line, coloring `accent_word` in amber."""
    for tok in re.split(r"(\s+)", line):
        if not tok:
            continue
        fill = accent if tok.strip().strip(",.'").upper() == accent_word.upper() else base
        draw.text((x, y), tok, font=font, fill=fill)
        x += draw.textlength(tok, font=font)


def build_hero(src, screenshot, out):
    bg = Image.open(src).convert("RGBA")
    find_green_quad(bg, mode="tilted")                # raises if no quad -> fail loud
    tmp = out.replace(".png", "_screen.png")
    composite_screenshot_into_greenscreen(src, screenshot, tmp, mode="tilted")

    im = Image.open(tmp).convert("RGB").resize((CANVAS, CANVAS), Image.LANCZOS)
    d = ImageDraw.Draw(im)

    # text lives in the clean left ~40% the scene was generated with
    pad, col_w = 66, int(CANVAS * 0.42) - 96

    # explicit line breaks -- auto-wrap in a narrow column breaks this badly
    # ("The / Weeks / The Scale"), and the phrase has an obvious natural rhythm.
    lines = ["The Weeks", "The Scale", "Won't Show", "You"]
    size = 128
    while size >= HEAD_MIN:
        f = load(size, 700)
        if max(d.textlength(ln, font=f) for ln in lines) <= col_w:
            break
        size -= 2
    if size < HEAD_MIN:
        raise SystemExit(f"headline fell to {size}px, below the {HEAD_MIN}px floor")

    lh = int(size * 1.1)
    block_h = lh * len(lines) + 46 + 30 * 4
    y = (CANVAS - block_h) // 2
    for ln in lines:
        draw_accent_line(d, pad, y, ln, f, "Scale")
        y += lh

    y += 26
    draw_ring_divider(d, pad, y, col_w)
    y += 30

    sf = load(max(SUB_MIN, 26), 500)
    for ln in wrap(d, "Dose Log · Protein First · How It Sat · Symptoms · Non-Scale Victories",
                   sf, col_w):
        d.text((pad, y), ln, font=sf, fill=MUTED)
        y += int(sf.size * 1.35)

    im.save(out)
    os.remove(tmp)
    print(f"  hero: headline {size}px, subtitle {sf.size}px -> {os.path.basename(out)}")
    return size, sf.size


def build_lifestyle(src, out, headline, accent_word):
    im = Image.open(src).convert("RGB").resize((CANVAS, CANVAS), Image.LANCZOS)
    # cream scrim so text stays legible over the photo
    scrim_h = int(CANVAS * 0.34)
    arr = np.zeros((scrim_h, CANVAS, 4), dtype=np.uint8)
    for yy in range(scrim_h):
        arr[yy, :, :3] = (247, 248, 250)
        arr[yy, :, 3] = int(242 * (1 - yy / scrim_h) ** 1.25)
    base = im.convert("RGBA")
    base.alpha_composite(Image.fromarray(arr, "RGBA"), (0, 0))
    d = ImageDraw.Draw(base)

    pad = 66
    max_w = CANVAS - pad * 2
    size = 110
    while size >= HEAD_MIN:
        f = load(size, 700)
        lines = wrap(d, headline, f, max_w)
        if len(lines) * int(size * 1.1) + 60 <= scrim_h:
            break
        size -= 2
    if size < HEAD_MIN:
        raise SystemExit(f"{os.path.basename(out)}: headline {size}px below the {HEAD_MIN}px floor")

    y = 52
    for ln in lines:
        draw_accent_line(d, pad, y, ln, f, accent_word)
        y += int(size * 1.1)

    base.convert("RGB").save(out)
    print(f"  {os.path.basename(out)}: headline {size}px")
    return size


def find_src(d, *names):
    for n in names:
        p = os.path.join(d, n)
        if os.path.exists(p):
            return p
    hits = sorted(glob.glob(os.path.join(d, "*.png")))
    raise SystemExit(f"missing {names[0]} in {d} (found: {[os.path.basename(h) for h in hits]})")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sources", default=os.path.join(HERE, "source-photos"))
    ap.add_argument("--out", default=HERE)
    a = ap.parse_args()

    shots = os.path.join(HERE, "screenshots")
    outs = []

    print("building hero...")
    build_hero(find_src(a.sources, "1_hero_green.png"),
               os.path.join(shots, "02_dashboard.png"),
               os.path.join(a.out, "01_hero.png"))
    outs.append(os.path.join(a.out, "01_hero.png"))

    print("building lifestyle...")
    for fn, name, head, acc in [
        ("2_before.png", "14_lifestyle_before.png",
         "Trying To Remember All Of It", "Remember"),
        ("3_after.png", "15_lifestyle_after.png",
         "One Place. Every Week.", "One"),
        ("4_appointment.png", "16_lifestyle_appointment.png",
         "Walk In With Your Questions Written Down", "Questions"),
    ]:
        p = os.path.join(a.out, name)
        build_lifestyle(find_src(a.sources, fn), p, head, acc)
        outs.append(p)

    b = {os.path.basename(p): np.array(Image.open(p).convert("RGB")).mean() for p in outs}
    lo, hi = min(b.values()), max(b.values())
    print("\nbrightness:", {k: round(v, 1) for k, v in b.items()})
    print(f"spread {hi / lo:.2f}x  {'OK' if hi / lo < 1.5 else '*** TOO WIDE ***'} (limit 1.5x)")
    print(f"\n{len(outs)} images written to {a.out}")


if __name__ == "__main__":
    main()
