#!/usr/bin/env python3
"""
Phase 3b — build the seven feature slides.

Each slide = a unique styled backdrop whose device screen is a chroma-key green
rectangle + the real app screenshot perspective-warped into it + a headline drawn
locally in Hanken Grotesk with one amber accent word, matching the hero and the
three lifestyle images so the whole ten-image set reads as one shoot.

    python3 build_slides.py

Fails loudly rather than shipping something wrong: no green quad found, a headline
below the text floor, or residual green after compositing all stop the run.
"""
import os, sys
from PIL import Image, ImageDraw
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", ".claude", "skills",
                                "niche-planner-builder", "scripts"))
from composite_greenscreen_mockup import composite_screenshot_into_greenscreen  # noqa: E402
from finish_imagery import (CANVAS, HEAD_MIN, PAD, AMBER, INK,                  # noqa: E402
                            load, wrap, draw_accent_line)

# slide -> (backdrop, screenshot, headline, accent word, quad mode)
SLIDES = [
    ("04", "03_daily_log_signature.png", "Protein First, Every Meal",       "Protein", "tilted"),
    ("05", "05_how_it_sat.png",          "Every Food, Sorted By How It Sat","Sorted",  "tilted"),
    ("06", "04_symptoms.png",            "Charted By Day Since Dose",       "Dose",    "tilted"),
    ("07", "06_dose_log.png",            "Every Dose, Site And Step",       "Every",   "tilted"),
    ("08", "12_strength.png",            "Keep The Muscle You Have",        "Muscle",  "tilted"),
    ("09", "11_welcome_onboarding.png",  "Set Up In Under A Minute",        "Minute",  "tilted"),
    # phone is near head-on: bbox is more robust than diagonal extremes here
    ("10", "10_mobile_dashboard.png",    "On Your Phone, Wherever You Are", "Phone",   "bbox"),
]


def add_headline(path, headline, accent):
    im = Image.open(path).convert("RGB")
    scrim_h = int(CANVAS * 0.30)
    arr = np.zeros((scrim_h, CANVAS, 4), dtype=np.uint8)
    for y in range(scrim_h):
        arr[y, :, :3] = (247, 248, 250)
        arr[y, :, 3] = int(244 * (1 - y / scrim_h) ** 1.25)
    base = im.convert("RGBA")
    base.alpha_composite(Image.fromarray(arr, "RGBA"), (0, 0))
    d = ImageDraw.Draw(base)

    max_w = CANVAS - PAD * 2
    size = round(CANVAS * 0.082)
    while size >= HEAD_MIN:
        f = load(size, 700)
        lines = wrap(d, headline, f, max_w)
        if len(lines) * int(size * 1.12) + round(CANVAS * 0.05) <= scrim_h:
            break
        size -= 2
    if size < HEAD_MIN:
        raise SystemExit(f"{os.path.basename(path)}: headline {size}px below {HEAD_MIN}px floor")

    y = round(CANVAS * 0.028)
    for ln in lines:
        draw_accent_line(d, PAD, y, ln, f, accent, base=INK, accent=AMBER)
        y += int(size * 1.12)
    base.convert("RGB").save(path)
    return size


def main():
    shots = os.path.join(HERE, "screenshots")
    bds = os.path.join(HERE, "backdrops")
    means = {}
    for num, shot, headline, accent, mode in SLIDES:
        bd = os.path.join(bds, f"{num}_backdrop.png")
        out = os.path.join(HERE, f"{num}_slide.png")
        composite_screenshot_into_greenscreen(bd, os.path.join(shots, shot), out, mode=mode)

        im = Image.open(out).convert("RGB")
        if im.size != (CANVAS, CANVAS):
            im = im.resize((CANVAS, CANVAS), Image.LANCZOS)
            im.save(out)

        a = np.array(Image.open(out).convert("RGB")).astype(int)
        green = ((a[:, :, 1] - a[:, :, 0] > 60) & (a[:, :, 1] - a[:, :, 2] > 60)).sum()
        if green > 2000:
            raise SystemExit(f"{num}: {green} green pixels left after compositing — bad quad")

        px = add_headline(out, headline, accent)
        means[f"{num}_slide.png"] = np.array(Image.open(out).convert("RGB")).mean()
        print(f"  {num}: {shot:32} headline {px}px  green left {green}")

    lo, hi = min(means.values()), max(means.values())
    print("\nbrightness:", {k: round(v, 1) for k, v in means.items()})
    print(f"spread {hi/lo:.2f}x  {'OK' if hi/lo < 1.5 else '*** TOO WIDE ***'} (limit 1.5x)")


if __name__ == "__main__":
    main()
