"""
Reusable: composite a REAL app screenshot into a photorealistic AI-generated device mockup scene,
with pixel-perfect on-screen text (zero AI-hallucinated or misspelled UI).

Why this exists: an AI image model asked to render "a laptop showing this baby shower app" from
a text prompt alone will invent plausible-but-fake UI (garbled labels, wrong numbers). Feeding the
real screenshot in as an image-to-image reference improves this a lot but still introduces small
typos in fine print on repeated testing (e.g. "Vendors" -> "Venders", "Print" -> "Point") — the
model is reading-and-redrawing the text, not copying it, and that step has a real, unavoidable
error rate no matter how the prompt is worded or how high the output resolution is.

The fix: generate the scene with the screen as a solid, flat chroma-key GREEN rectangle instead of
any UI at all (trivial for the model to render perfectly — it's just a flat color, no text to get
wrong), then perspective-warp the REAL screenshot into that green quad yourself with plain PIL. You
get full photographic polish (lighting, props, headline text, icon labels all render great from a
model since those are either large freshly-authored text or a flat color) AND guaranteed-accurate
on-screen content, because it's your actual screenshot, not a redrawn approximation of it.

Steps:
  1. Generate the scene with a prompt describing the full desired composition (headline, icon grid,
     brand mark, styled desk/props) but specifying the device screen as "a perfectly flat, solid,
     evenly lit bright chroma-key green rectangle, no glare, no reflections, no text" — model text
     item generation for the headline/icons is reliable, only the "read this screenshot" step isn't.
  2. Run this script: it finds the green quadrilateral's 4 corners via a color mask, computes a
     perspective transform, and warps your real screenshot into exactly that quad.

Requires: pip install pillow numpy
"""

from PIL import Image
import numpy as np


def find_green_quad(bg, green_threshold=140, margin=40, mode="auto"):
    """Returns (tl, tr, br, bl) corners of the largest green-screen region in `bg` (a PIL Image).

    mode="tilted" (e.g. a laptop shown at a three-quarter angle): takes the extremes of x+y and
    x-y — the standard trick for finding a rotated quadrilateral's corners from a pixel mask.

    mode="bbox" (e.g. a phone shown near head-on, minimal perspective): uses a plain axis-aligned
    bounding box of the mask instead. This is MORE robust than the tilted method when the screen
    has rounded corners and/or an asymmetric reflection/highlight reduces green saturation on one
    specific edge — the tilted method's diagonal-extreme picks can land short on that one edge
    (visible as a green fringe on only one side, that a uniform inset/outset can't fix since the
    error isn't uniform), whereas each side of a bbox is measured independently from wherever the
    mask reaches furthest in that direction, unaffected by a local dip elsewhere.

    mode="auto" (default): uses "tilted" — pass "bbox" explicitly for a near head-on shot if you
    see a fringe confined to one edge that persists across different edge_fix values."""
    arr = np.array(bg.convert("RGB"))
    r, g, b = arr[:, :, 0].astype(int), arr[:, :, 1].astype(int), arr[:, :, 2].astype(int)
    mask = (g > green_threshold) & (g > r + margin) & (g > b + margin)
    ys, xs = np.where(mask)
    if len(xs) == 0:
        raise ValueError("No green-screen pixels found — check the threshold or that the source image actually has a flat green region.")

    if mode == "bbox":
        x0, x1, y0, y1 = int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max())
        return (x0, y0), (x1, y0), (x1, y1), (x0, y1)

    x_plus_y = xs + ys
    x_minus_y = xs.astype(int) - ys.astype(int)
    tl = (int(xs[np.argmin(x_plus_y)]), int(ys[np.argmin(x_plus_y)]))
    br = (int(xs[np.argmax(x_plus_y)]), int(ys[np.argmax(x_plus_y)]))
    tr = (int(xs[np.argmax(x_minus_y)]), int(ys[np.argmax(x_minus_y)]))
    bl = (int(xs[np.argmin(x_minus_y)]), int(ys[np.argmin(x_minus_y)]))
    return tl, tr, br, bl


def _inset_quad(quad, frac):
    """frac > 0 shrinks the quad toward its centroid; frac < 0 expands it outward. A small negative
    value (e.g. -0.015) is usually needed to fully cover anti-aliased edge pixels the color mask
    misses, which otherwise show up as a thin bright green fringe around the pasted screenshot."""
    cx = sum(p[0] for p in quad) / 4
    cy = sum(p[1] for p in quad) / 4
    return [(x + (cx - x) * frac, y + (cy - y) * frac) for x, y in quad]


def _inset_quad_per_edge(quad, top=0.0, bottom=0.0, left=0.0, right=0.0):
    """Shrink each of the quad's 4 edges independently inward by a fraction of the quad's own
    width/height, instead of uniformly toward the centroid like `_inset_quad`.

    Why this exists: a uniform inset (or `edge_fix`) only corrects a green-fringe problem (the
    color mask missing a few anti-aliased border pixels) — it can't correct the OPPOSITE failure,
    where the AI-generated base photo drew its flat green rectangle itself slightly larger than
    where a real device screen would sit inset from the physical bezel. That oversized boundary is
    reproduced faithfully by the mask (nothing wrong with the detection), so the paste overhangs
    PAST the visible bezel edge (most often at the top). The fix is a safety margin pulled in from
    whichever edge(s) show the overhang, expressed as a fraction of the quad's width (for left/
    right) or height (for top/bottom) — e.g. top=0.05 pulls the top edge down by 5% of the quad's
    height, giving the paste headroom to sit safely inside the bezel with margin to spare.

    quad is (tl, tr, br, bl) as returned by find_green_quad. Assumes a roughly axis-aligned or
    mildly-tilted quad (true for these laptop/phone mockup shots); for a severely tilted quad the
    top/bottom/left/right labels are still applied to the tl/tr/br/bl corners directly rather than
    to true screen-space up/down/left/right, which is fine for the mild tilts seen in practice."""
    tl, tr, br, bl = quad
    height_l = ((bl[0] - tl[0]) ** 2 + (bl[1] - tl[1]) ** 2) ** 0.5
    height_r = ((br[0] - tr[0]) ** 2 + (br[1] - tr[1]) ** 2) ** 0.5
    width_t = ((tr[0] - tl[0]) ** 2 + (tr[1] - tl[1]) ** 2) ** 0.5
    width_b = ((br[0] - bl[0]) ** 2 + (br[1] - bl[1]) ** 2) ** 0.5

    def _lerp(p0, p1, t):
        return (p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t)

    # Pull each corner in along its two adjacent edges by the requested per-edge fraction.
    new_tl = _lerp(tl, bl, top * (height_l / max(height_l, 1e-6)))
    new_tl = _lerp(new_tl, tr, left * (width_t / max(width_t, 1e-6)))
    new_tr = _lerp(tr, br, top * (height_r / max(height_r, 1e-6)))
    new_tr = _lerp(new_tr, tl, right * (width_t / max(width_t, 1e-6)))
    new_br = _lerp(br, tr, bottom * (height_r / max(height_r, 1e-6)))
    new_br = _lerp(new_br, bl, right * (width_b / max(width_b, 1e-6)))
    new_bl = _lerp(bl, tl, bottom * (height_l / max(height_l, 1e-6)))
    new_bl = _lerp(new_bl, br, left * (width_b / max(width_b, 1e-6)))

    return [new_tl, new_tr, new_br, new_bl]


def _find_perspective_coeffs(from_pts, to_pts):
    """Solves for PIL PERSPECTIVE-transform coefficients such that formula(from_pts[i]) == to_pts[i].
    PIL evaluates the formula AT OUTPUT/canvas coordinates and expects the SOURCE-image coordinate
    back — so from_pts must be the destination quad (in canvas space) and to_pts must be the source
    image's own rectangle corners. Getting this backwards (a real bug hit while building this) makes
    the whole canvas fill with a wildly mis-scaled fragment of the source image instead of confining
    it to the quad — if that happens, you've swapped from_pts/to_pts."""
    matrix = []
    for (X, Y), (x, y) in zip(from_pts, to_pts):
        matrix.append([X, Y, 1, 0, 0, 0, -x * X, -x * Y])
        matrix.append([0, 0, 0, X, Y, 1, -y * X, -y * Y])
    A = np.array(matrix, dtype=float)
    Bv = np.array(to_pts, dtype=float).reshape(8)
    return np.linalg.solve(A, Bv)


def composite_screenshot_into_greenscreen(bg_path, screenshot_path, out_path, edge_fix=-0.015, mode="auto",
                                           safety_inset=None):
    """safety_inset: optional dict with any of 'top'/'bottom'/'left'/'right' (fractions of the
    quad's own height/width) to pull the paste in from the bezel-overhang failure mode (see
    `_inset_quad_per_edge`'s docstring) -- applied AFTER the fringe-fixing `edge_fix`. Start with
    top=0.05 if the paste overhangs the top bezel edge, and increase if a margin is still visible
    against the bezel after zooming into the result."""
    bg = Image.open(bg_path).convert("RGBA")
    quad = find_green_quad(bg, mode=mode)
    quad = _inset_quad(quad, edge_fix)
    if safety_inset:
        quad = _inset_quad_per_edge(quad, **safety_inset)

    screenshot = Image.open(screenshot_path).convert("RGBA")
    W, H = screenshot.size
    src_rect = [(0, 0), (W, 0), (W, H), (0, H)]

    coeffs = _find_perspective_coeffs(quad, src_rect)
    warped = screenshot.transform(bg.size, Image.PERSPECTIVE, coeffs, resample=Image.BICUBIC, fillcolor=(0, 0, 0, 0))

    out = Image.alpha_composite(bg, warped)
    out.convert("RGB").save(out_path)
    print("saved", out_path)
    return out_path


if __name__ == "__main__":
    print(__doc__)
