"""
Extract a planner's circular welcome-badge (or any circular icon-in-gradient
element) as a standalone transparent PNG, normalized to a fixed 1024x1024
canvas regardless of the badge's native on-screen CSS size.

Why isolate + re-render instead of just screenshotting the badge in place:
screenshotting the badge element inside the full app page
(element.screenshot(omit_background=True)) does NOT reliably produce a
transparent background around the circle in headless Chromium — in practice
the corners come back fully opaque, painted with the badge's own background
color, even though border-radius:50% renders correctly on screen. The fix is
to re-render the badge in total isolation: pull its *resolved* computed
styles (so CSS custom properties like var(--hero-grad) and
var(--primary-dark) are already baked into real rgb()/gradient values) into
a tiny standalone HTML snippet with a transparent body, then screenshot
that. A repro against a trivial <div style="border-radius:50%"> confirms
omit_background transparency works fine in isolation — something about the
full app page's stacking context is what breaks it.

Why normalize to a fixed canvas: a niche's on-screen badge CSS size varies
56-82px depending on that app's own welcome-card proportions. Exporting at
that native size (or a fixed device-scale multiple of it) produced PNGs
ranging ~460-660px square across a real 12-planner set — inconsistent, and
even at the larger end the circle read as small with a lot of dead space.
This script instead computes a per-badge scale factor so every export lands
on the SAME 1024x1024 canvas with the circle filling ~86% of the frame
(a small margin is kept so the soft drop shadow's blur isn't clipped at the
edge) — see references/architecture.md ("Export the badge as a standalone
icon file") for the full guideline this implements.

Text-glyph badges (a currency symbol, letter, etc. rendered as a <span>
rather than an <svg>) need their font resolved too, not just their color —
a real bug found on a first pass of this script: a <span> has no inline
style of its own, its font-family/weight/size all live in the app's
external stylesheet, so skipping that inlining silently drops the glyph to
the browser's DEFAULT serif font at a DEFAULT 16px/400-weight in the
isolated snippet — while still looking passably icon-shaped enough at a
glance to not immediately register as wrong. This script inlines the full
text style (font-family/weight/size/style/letter-spacing/line-height) on
every descendant and carries over the source page's Google Fonts <link>
tags so the real webfont actually loads before the screenshot is taken.

Usage:
    py extract_badge_icon.py <html_path> <css_selector> <output_png_path>

Example:
    py extract_badge_icon.py "Vacation Planner/HTML/vacation-planner-v1.html" \\
        "#welcome-overlay .welcome-badge" "Vacation Planner/Icon/vacation-planner-icon.png"

Notes:
- If the badge's icon glyph is a fully self-contained <svg> (its own
  <circle> + <defs><linearGradient> drawn inside the SVG, rather than a CSS
  div with border-radius + background), point the selector at the svg
  itself (e.g. "#welcome-overlay .welcome-badge svg") — the script detects
  the SVG case automatically and skips CSS-var/font resolution (nothing
  external to resolve), but still normalizes to the same 1024px/86%-fill
  canvas.
- The script force-shows #welcome-overlay in case a build auto-hides it
  behind sample-data seeding logic (some planners hide the welcome screen
  the instant initSampleDataIfEmpty() sees non-empty details).
"""

import os
import sys

from playwright.sync_api import sync_playwright

TARGET_SIZE = 1024    # every exported icon lands on this exact square canvas
PADDING_RATIO = 0.08  # margin per side, as a fraction of the badge's own diameter

EXTRACT_JS = """el => {
    const isSvg = el.tagName.toLowerCase() === 'svg';
    const cs = getComputedStyle(el);

    if (isSvg) {
        // self-contained badge (own <circle> + gradient <defs> drawn inside) —
        // no external CSS vars or fonts to resolve, just take it as-is
        const w = parseFloat(el.getAttribute('width')) || parseFloat(cs.width);
        const h = parseFloat(el.getAttribute('height')) || parseFloat(cs.height);
        return { isSvg: true, w, h, outer: el.outerHTML, fontLinks: '' };
    }

    // Inline every descendant's own resolved color, TEXT styling (font
    // family/weight/size/style/letter-spacing/line-height), and — for <svg>
    // children only — resolved width/height, so nothing depends on an
    // external stylesheet that won't exist in the isolated snippet. Font
    // properties matter even for badges that look purely vector-based: a
    // text-glyph badge (e.g. a "$" span) has no inline style of its own, so
    // skipping this drops it to the browser's default serif at 16px/400 in
    // the isolated snippet — see the module docstring. Width/height
    // inlining stays scoped to <svg> only — forcing it onto a <span> makes
    // it a sized flex item and shoves its text glyph into a top-left corner
    // instead of centering it.
    const origDescendants = el.querySelectorAll('*');
    const clone = el.cloneNode(true);
    const cloneDescendants = clone.querySelectorAll('*');
    origDescendants.forEach((orig, i) => {
        const c = getComputedStyle(orig);
        cloneDescendants[i].style.setProperty('color', c.color);
        cloneDescendants[i].style.setProperty('font-family', c.fontFamily);
        cloneDescendants[i].style.setProperty('font-weight', c.fontWeight);
        cloneDescendants[i].style.setProperty('font-size', c.fontSize);
        cloneDescendants[i].style.setProperty('font-style', c.fontStyle);
        cloneDescendants[i].style.setProperty('letter-spacing', c.letterSpacing);
        cloneDescendants[i].style.setProperty('line-height', c.lineHeight);
        if (orig.tagName.toLowerCase() === 'svg') {
            cloneDescendants[i].style.setProperty('width', c.width);
            cloneDescendants[i].style.setProperty('height', c.height);
        }
        if (orig.hasAttribute('fill') && orig.getAttribute('fill') !== 'none') {
            cloneDescendants[i].setAttribute('fill', c.fill);
        }
        if (orig.hasAttribute('stroke') && orig.getAttribute('stroke') !== 'none') {
            cloneDescendants[i].setAttribute('stroke', c.stroke);
        }
    });

    const resolveVars = (s) => s.replace(/var\\(--[a-zA-Z0-9-]+\\)/g, function(m) {
        const name = m.slice(4, -1);
        const val = getComputedStyle(document.body).getPropertyValue(name).trim();
        return val || m;
    });

    // carry over any Google Fonts <link> tags so a text-glyph badge's real
    // webfont (not a default fallback) actually loads in the isolated page
    const fontLinks = Array.from(document.querySelectorAll(
        "link[href*='fonts.googleapis.com'], link[href*='fonts.gstatic.com']"
    )).map(l => l.outerHTML).join('');

    return {
        isSvg: false,
        w: parseFloat(cs.width), h: parseFloat(cs.height), br: cs.borderRadius,
        bgImage: cs.backgroundImage, bgColor: cs.backgroundColor,
        shadow: cs.boxShadow, display: cs.display, color: cs.color,
        alignItems: cs.alignItems, justifyContent: cs.justifyContent,
        inner: resolveVars(clone.innerHTML),
        fontLinks
    };
}"""

DIV_SNIPPET_TMPL = """<!DOCTYPE html>
<html><head><meta charset="utf-8">{fontLinks}</head>
<body style="margin:0;padding:0;background:transparent;">
<div id="frame" style="width:{canvas}px;height:{canvas}px;display:flex;align-items:center;justify-content:center;box-sizing:border-box;">
<div id="badge" style="
  width:{w}px;height:{h}px;border-radius:{br};
  background-image:{bgImage};background-color:{bgColor};
  box-shadow:{shadow};display:{display};color:{color};
  align-items:{alignItems};justify-content:{justifyContent};
  box-sizing:border-box;
">{inner}</div>
</div>
</body></html>"""

SVG_SNIPPET_TMPL = """<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:transparent;">
<div id="frame" style="width:{canvas}px;height:{canvas}px;display:flex;align-items:center;justify-content:center;box-sizing:border-box;">
{outer}
</div>
</body></html>"""


def extract_badge_icon(html_path, selector, out_path, scratch_dir=None):
    scratch_dir = scratch_dir or os.path.dirname(out_path) or "."
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    os.makedirs(scratch_dir, exist_ok=True)

    file_url = "file:///" + os.path.abspath(html_path).replace("\\", "/")

    with sync_playwright() as p:
        browser = p.chromium.launch()

        # Pass 1: pull resolved styles + markup from the live app page.
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.goto(file_url, wait_until="domcontentloaded", timeout=20000)
        page.wait_for_selector(selector, timeout=10000, state="attached")
        page.wait_for_timeout(400)
        page.evaluate(
            """() => {
                const ov = document.getElementById('welcome-overlay');
                if (ov) { ov.classList.remove('hidden'); ov.style.display = 'flex'; }
            }"""
        )
        page.wait_for_timeout(150)
        info = page.eval_on_selector(selector, EXTRACT_JS)
        page.close()

        if info["w"] < 5 or info["h"] < 5:
            browser.close()
            raise RuntimeError(f"Badge element matched but has near-zero size ({info['w']}x{info['h']}) — check the selector or whether it's hidden.")

        # Pass 2: render an isolated, size-normalized snippet and screenshot
        # it with real transparency. Canvas is computed per-badge so every
        # export lands on the same TARGET_SIZE regardless of the badge's own
        # native CSS size.
        badge_size = max(info["w"], info["h"])
        canvas_css = badge_size * (1 + 2 * PADDING_RATIO)
        scale = TARGET_SIZE / canvas_css

        if info["isSvg"]:
            snippet = SVG_SNIPPET_TMPL.format(canvas=canvas_css, outer=info["outer"])
        else:
            snippet = DIV_SNIPPET_TMPL.format(canvas=canvas_css, **info)

        snippet_path = os.path.join(scratch_dir, "_badge_snippet.html")
        with open(snippet_path, "w", encoding="utf-8") as f:
            f.write(snippet)

        context = browser.new_context(
            device_scale_factor=scale,
            viewport={"width": int(canvas_css) + 10, "height": int(canvas_css) + 10},
        )
        page2 = context.new_page()
        page2.goto("file:///" + os.path.abspath(snippet_path).replace("\\", "/"), wait_until="domcontentloaded")
        # let any webfont referenced by fontLinks actually finish loading —
        # a text-glyph badge needs this or it silently renders in the
        # browser's default fallback font instead
        page2.evaluate("document.fonts.ready")
        page2.wait_for_timeout(150 if info["isSvg"] else 600)
        el = page2.query_selector("#frame")
        el.screenshot(path=out_path, omit_background=True)
        context.close()
        browser.close()

    os.remove(snippet_path)
    return out_path


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(__doc__)
        sys.exit(1)
    html_path, selector, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    result = extract_badge_icon(html_path, selector, out_path)
    print(f"OK: {result}")
