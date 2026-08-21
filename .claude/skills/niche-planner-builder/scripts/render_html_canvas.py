"""
Reusable: render any self-contained HTML/CSS "slide" to a crisp PNG via headless Chromium.

This is the shared rendering step behind every composited marketing image in this skill — the hero
image, the lifestyle photo's headline (once scrim+text are baked into HTML instead of PIL), and
every feature-slides.md slide (feature-icon grid, palette showcase, FAQ). Building slides as plain
HTML/CSS and screenshotting them is far more reliable than asking an image-generation model to
render UI, mockups, icons, or paragraphs of text — real vector text and real <img> screenshots are
always crisp and never mangled.

Usage pattern:
  1. Write an HTML file with a top-level element (e.g. <div class="canvas">) sized to your target
     output dimensions in CSS pixels (e.g. 2000x1500 for a square-ish Etsy image, 2000x2000 for a
     square one). Reference screenshots via file:/// URLs or a local static-server URL.
  2. Call render(html_path, out_path, selector=".canvas") below.

Requires: pip install playwright && playwright install chromium
"""

from playwright.sync_api import sync_playwright


def render(html_path, out_path, selector=None, width=2000, height=1500, wait_ms=300):
    """html_path: file path or file:// / http:// URL to the HTML to render.
    selector: CSS selector of the element to screenshot; if None, screenshots the full viewport.
    width/height: viewport size in CSS px — make this match the canvas element's own size so
    nothing is cropped or letterboxed."""
    url = html_path if html_path.startswith(("file://", "http://", "https://")) else f"file:///{html_path}"
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": width, "height": height}, device_scale_factor=1)
        page.goto(url, wait_until="networkidle")
        page.evaluate("document.fonts.ready")  # avoid a web-font swap (FOUT) showing in the capture
        page.wait_for_timeout(wait_ms)
        target = page.locator(selector) if selector else page
        target.screenshot(path=out_path)
        browser.close()
    print("saved", out_path)
    return out_path


if __name__ == "__main__":
    print(__doc__)
