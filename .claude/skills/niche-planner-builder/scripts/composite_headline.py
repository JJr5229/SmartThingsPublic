"""
Reusable: add a crisp, brand-consistent headline to a base image via real vector text (PIL),
instead of relying on an image-generation model to render text (unreliable — typos, warped
letterforms). Two modes:

  replace_headline_region(...)  — an existing image already has a headline you want to swap
                                   (e.g. re-running a hero image with new copy). Reconstructs the
                                   background behind the old text via gradient interpolation, then
                                   draws the new text in the same spot/size/color.

  add_scrim_headline(...)       — a full-bleed photo with NO existing text/negative space (e.g. a
                                   freshly generated lifestyle photo). Adds a soft gradient scrim
                                   band, then draws text on top of it, with a hard pixel-scanned
                                   safe-zone check so the text never overlaps a busy foreground
                                   subject.

Both default to Playfair Display (installed at
C:\\Windows\\Fonts\\PlayfairDisplay-VariableFont_wght.ttf on this machine) — that default is only
correct for a wedding-style niche. It exists purely as a fallback for quick standalone testing of
this module; it is NOT a suggestion to use for a real build.

**Always pass `font_path` explicitly, set to the CURRENT niche's own chosen display font (decided in
Phase 0), and reuse that exact same path/weight/color/shadow-or-no-shadow treatment across every
single compositing call in the build — hero, every lifestyle/pain-point photo, and every Phase 3b
feature slide.** A real bug this caused: on one build the hero image was composited with Bebas Neue
(the niche's actual chosen font, matching the app itself), but two separate lifestyle-photo fixes
run afterward each independently substituted "Arial Narrow Bold" instead — a different, wrong font —
because nothing forced the later calls to check what the earlier one had used. The user caught the
mismatch by eye. Don't let this happen again: before compositing ANY headline in a build, confirm the
exact font file path already in use elsewhere in that same build (check an earlier script invocation,
or just open one already-composited image and match it) rather than picking whatever system font
happens to be convenient in the moment. If the niche's chosen display font isn't a system font
already installed, locate and confirm its actual file path once at the start of Phase 3 and reuse
that same resolved path for every subsequent call — never substitute a "close enough" system font as
a stand-in partway through a build.
"""

from PIL import Image, ImageDraw, ImageFont
import numpy as np

REG_FONT = r"C:\Windows\Fonts\PlayfairDisplay-VariableFont_wght.ttf"
ITALIC_FONT = r"C:\Windows\Fonts\PlayfairDisplay-Italic-VariableFont_wght.ttf"

# Bebas Neue (a common non-wedding display-font choice, e.g. for bolder/masculine niches) is
# installed at C:\Windows\Fonts\BebasNeue-Regular.ttf, and also available as a fallback at
# C:\Users\jredm\Downloads\Bebas_Neue\BebasNeue-Regular.ttf if an agent's environment can't read
# C:\Windows\Fonts directly. Check both before substituting a different font.


def _get_font(path, size, weight=500):
    f = ImageFont.truetype(path, size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass  # non-variable font fallback
    return f


def find_darkest_color(im, box):
    """Sample the darkest pixels within a region — use this to match a new headline's color to
    an existing one exactly, rather than guessing."""
    crop = np.array(im.convert("RGB").crop(box))
    flat = crop.reshape(-1, 3)
    darkest = sorted(flat.tolist(), key=sum)[:20]
    r = sum(p[0] for p in darkest) // len(darkest)
    g = sum(p[1] for p in darkest) // len(darkest)
    b = sum(p[2] for p in darkest) // len(darkest)
    return (r, g, b)


def replace_headline_region(
    src_path, out_path, old_text_bbox, new_lines, text_color=None, font_path=REG_FONT,
    italic_font_path=ITALIC_FONT, italic_line_indices=(), start_size=118, weight=500,
):
    """old_text_bbox: (x0, y0, x1, y1) around the existing headline, with margin.
    Reconstructs the background via a vertical gradient sampled from just above/below the box."""
    im = Image.open(src_path).convert("RGB")
    x0, y0, x1, y1 = old_text_bbox
    W = im.size[0]

    if text_color is None:
        text_color = find_darkest_color(im, old_text_bbox)

    top_row = np.array(im)[max(0, y0 - 14):y0 - 2, x0:x1, :].mean(axis=0)
    bot_row = np.array(im)[y1 + 2:y1 + 14, x0:x1, :].mean(axis=0)
    box_h, box_w = y1 - y0, x1 - x0
    fill = np.zeros((box_h, box_w, 3), dtype=np.float64)
    for row in range(box_h):
        t = row / max(1, box_h - 1)
        fill[row] = top_row * (1 - t) + bot_row * t
    im.paste(Image.fromarray(fill.astype(np.uint8)), (x0, y0))

    draw = ImageDraw.Draw(im)
    center_x = W / 2
    size = start_size
    fonts = []
    while size > 40:
        fonts = [
            _get_font(italic_font_path if i in italic_line_indices else font_path, size, weight)
            for i in range(len(new_lines))
        ]
        widths = [draw.textbbox((0, 0), line, font=f)[2] for line, f in zip(new_lines, fonts)]
        if max(widths) <= box_w:
            break
        size -= 2

    y = y0
    for line, f in zip(new_lines, fonts):
        bbox = draw.textbbox((0, 0), line, font=f)
        w = bbox[2] - bbox[0]
        draw.text((center_x - w / 2 - bbox[0], y - bbox[1]), line, font=f, fill=text_color)
        y += (bbox[3] - bbox[1]) + int(size * 0.15)

    im.save(out_path)
    return out_path


def find_safe_text_bottom(src_path, sample_xs=None, darkness_threshold=120):
    """Scan the photo for the highest point any busy/dark subject reaches, so a scrim + headline
    can be sized to never overlap it. Returns a hard pixel y-value — use it directly, don't derive
    a 'safe zone' as a proportion of image height (that can silently overlap a subject that sits
    higher in frame than assumed)."""
    im = Image.open(src_path).convert("RGB")
    arr = np.array(im)
    W = im.size[0]
    if sample_xs is None:
        sample_xs = list(range(int(W * 0.1), int(W * 0.9), int(W * 0.08)))
    firsts = []
    for x in sample_xs:
        col = arr[:, x, :]
        dark_ys = np.where(col.sum(axis=1) < darkness_threshold)[0]
        if len(dark_ys):
            firsts.append(int(dark_ys[0]))
    return min(firsts) if firsts else im.size[1]  # if nothing dark found, whole height is safe


def add_scrim_headline(
    src_path, out_path, lines, text_color=(95, 45, 50), font_path=REG_FONT,
    max_width_frac=0.88, top_margin=28, safe_bottom_px=None, scrim_frac=0.32, weight=500,
):
    """safe_bottom_px: pass the result of find_safe_text_bottom() (minus a margin) to guarantee
    the text block never overlaps a busy foreground subject. If None, uses scrim_frac * height,
    which is only safe for photos with genuinely clear negative space at the top."""
    im = Image.open(src_path).convert("RGB")
    W, H = im.size
    scrim_h = int(H * scrim_frac)
    if safe_bottom_px is None:
        safe_bottom_px = scrim_h

    cream = (250, 244, 237)
    arr = np.zeros((scrim_h, W, 4), dtype=np.uint8)
    for y in range(scrim_h):
        t = y / scrim_h
        alpha = int(245 * (1 - t) ** 1.3)
        arr[y, :, 0], arr[y, :, 1], arr[y, :, 2], arr[y, :, 3] = cream[0], cream[1], cream[2], alpha
    scrim = Image.fromarray(arr, "RGBA")
    base = im.convert("RGBA")
    base.alpha_composite(scrim, (0, 0))
    draw = ImageDraw.Draw(base)

    max_width = int(W * max_width_frac)
    size = 200
    while size > 50:
        f = _get_font(font_path, size, weight)
        bboxes = [draw.textbbox((0, 0), line, font=f) for line in lines]
        widths = [b[2] - b[0] for b in bboxes]
        heights = [b[3] - b[1] for b in bboxes]
        line_gap = int(size * 0.12)
        total_h = sum(heights) + line_gap * (len(lines) - 1)
        if max(widths) <= max_width and (top_margin + total_h) <= safe_bottom_px:
            break
        size -= 2

    y = top_margin
    for line, bbox, h in zip(lines, bboxes, heights):
        w = bbox[2] - bbox[0]
        draw.text((W / 2 - w / 2 - bbox[0], y - bbox[1]), line, font=f, fill=text_color)
        y += h + line_gap

    base.convert("RGB").save(out_path)
    return out_path


if __name__ == "__main__":
    print(__doc__)
