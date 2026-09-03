#!/usr/bin/env python3
"""Build the branded PDF for a guide in The Everyday Claude Guides line.

Renders a self-contained HTML document straight to PDF with headless Chromium
(--print-to-pdf). Unlike the screenshot-and-assemble technique used by the
Claude for Small Business line, this keeps the text selectable, which matters
here: this line is read by people using screen readers and text zoom, and the
large-print edition becomes a stylesheet change rather than a re-render.

Fonts are fetched once and inlined as data URIs, so the build is reproducible
offline and the PDF never depends on a font host.

Usage:  python3 build_guide.py
"""
import base64
import pathlib
import re
import subprocess
import urllib.request

HERE = pathlib.Path(__file__).parent
OUT_DIR = HERE.parent / "Guide"
TITLE = "Your First Ten Minutes With Claude"
OUT = OUT_DIR / f"{TITLE} - Free from Veer.pdf"

CHROME_CANDIDATES = [
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    "/usr/bin/chromium",
    "/usr/bin/google-chrome",
]

GOOGLE_FONTS = (
    "https://fonts.googleapis.com/css2"
    "?family=DM+Sans:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
)
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"


def chrome() -> str:
    for path in CHROME_CANDIDATES:
        if pathlib.Path(path).exists():
            return path
    raise SystemExit(f"No Chromium found. Tried: {', '.join(CHROME_CANDIDATES)}")


def fetch(url: str) -> bytes:
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": UA})
    ).read()


def font_css() -> str:
    """Google Fonts CSS with every woff2 inlined as a data URI."""
    cached = HERE / "fonts-embedded.css"
    if cached.exists():
        return cached.read_text()

    css = fetch(GOOGLE_FONTS).decode()
    cache_dir = HERE / ".fontcache"
    cache_dir.mkdir(exist_ok=True)

    for url in sorted(set(re.findall(r"https://fonts\.gstatic\.com[^)]+", css))):
        blob = cache_dir / url.rsplit("/", 1)[-1]
        if not blob.exists():
            blob.write_bytes(fetch(url))
        data = base64.b64encode(blob.read_bytes()).decode()
        css = css.replace(url, f"data:font/woff2;base64,{data}")

    cached.write_text(css)
    return css


def main() -> None:
    html = (
        "<!doctype html>\n"
        '<html lang="en"><head><meta charset="utf-8">\n'
        f"<title>{TITLE}</title>\n"
        f"<style>{font_css()}</style>\n"
        f"<style>{(HERE / 'style.css').read_text()}</style>\n"
        f"</head><body>{(HERE / 'body.html').read_text()}</body></html>"
    )
    src = HERE / "_build.html"
    src.write_text(html)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            chrome(), "--headless", "--disable-gpu", "--no-sandbox",
            "--no-pdf-header-footer", f"--print-to-pdf={OUT}", src.as_uri(),
        ],
        check=True,
        capture_output=True,
    )

    raw = OUT.read_bytes()
    pages = len(re.findall(rb"/Type\s*/Page[^s]", raw))
    box = re.search(rb"/MediaBox\s*\[([^\]]+)\]", raw)
    dims = [float(n) for n in box.group(1).split()] if box else [0, 0, 0, 0]
    w, h = (dims[2] - dims[0]) / 72, (dims[3] - dims[1]) / 72

    print(f"{OUT.name}")
    print(f"  {len(raw) / 1024:.0f} KB · {pages} pages · {w:.2f} x {h:.2f} in")
    if (pages, round(w, 2), round(h, 2)) != (6, 8.5, 11.0):
        raise SystemExit("FAIL: expected 6 pages at 8.50 x 11.00 in")
    print("  verified")


if __name__ == "__main__":
    main()
