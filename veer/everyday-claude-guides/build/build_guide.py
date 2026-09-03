#!/usr/bin/env python3
"""Render a manuscript into a branded PDF for The Everyday Claude Guides.

The manuscript is the product; this turns it into pages. Keeping the source in
markdown means a quarterly refresh is a text edit, not a layout edit — which is
the whole point of quarantining version-specific facts onto one page.

Manuscript format
-----------------
    ## PAGE cover                     title / subtitle / series line
    ## PAGE plain | Title
    ## PAGE lesson 07 | Title         "07" sets the ghost numeral
    ## PAGE lesson 07b | Title        letter suffix = continuation page
    ## PAGE card | Title
    ## PAGE current | Title           tinted band, the update-pack page
    ## PAGE disclaimer

Inside a page: markdown paragraphs, `- ` list items, **bold**, *italic*, plus

    ```ask | Label ...```        a copy-paste block
    ```asks | Label ...```       one ask per line, each in its own box
    ```letter | Label ...```     a finished piece of writing, set at reading size
    ```callout | Label ...```    a tip box
    ```warn | Label ...```       a warning box

Renders straight to PDF with headless Chromium so text stays selectable — this
line is read with screen readers and text zoom, and the large-print edition is
then a stylesheet change rather than a re-render.

Usage:  python3 build_guide.py "guides/<Guide Name>"

Each guide folder holds build.json (title, footer, out) and Guide/manuscript.md.
The stylesheet and this script are shared by every book in the line, so a design
change lands everywhere at once rather than drifting book by book.
"""
from __future__ import annotations

import base64
import html
import json
import pathlib
import re
import subprocess
import sys
import urllib.request

HERE = pathlib.Path(__file__).parent
LINE = "The Everyday Claude Guides"

if len(sys.argv) < 2:
    raise SystemExit(
        "usage: build_guide.py <guide folder>\n"
        "  e.g. build_guide.py \"guides/Is This Safe\"\n"
        "  The folder needs build.json and Guide/manuscript.md."
    )

BOOK_DIR = pathlib.Path(sys.argv[1]).resolve()
CONFIG = json.loads((BOOK_DIR / "build.json").read_text())
GUIDE_DIR = BOOK_DIR / "Guide"
MANUSCRIPT = GUIDE_DIR / "manuscript.md"

TITLE = CONFIG["title"]
SERIES = f"{LINE} · {CONFIG.get('footer', TITLE)}"
OUT = GUIDE_DIR / CONFIG["out"]

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


# ---------------------------------------------------------------- environment

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
    """Google Fonts CSS with every woff2 inlined, so builds work offline."""
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


# -------------------------------------------------------------------- parsing

def inline(text: str) -> str:
    """Markdown emphasis to HTML. Escapes first, so the manuscript stays plain."""
    out = html.escape(text, quote=False)
    out = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", out)
    out = re.sub(r"(?<!\*)\*(?!\s)(.+?)(?<!\s)\*(?!\*)", r"<i>\1</i>", out)
    return out


def split_pages(src: str) -> list[tuple[str, str, str]]:
    """-> [(kind, heading, body)] where kind is cover/plain/lesson/card/..."""
    pages = []
    for block in re.split(r"^## PAGE ", src, flags=re.M)[1:]:
        head, _, body = block.partition("\n")
        head = head.strip()
        if "|" in head:
            spec, _, heading = head.partition("|")
        else:
            spec, heading = head, ""
        parts = spec.split()
        kind = parts[0]
        num = parts[1] if len(parts) > 1 else ""
        pages.append((kind, num, heading.strip(), body.split("\n---")[0].strip()))
    return pages


def render_blocks(body: str) -> str:
    """Paragraphs, list items and fenced boxes -> HTML."""
    out: list[str] = []
    items: list[str] = []

    def flush_items() -> None:
        if items:
            out.append('<div class="items">')
            out.extend(f'<div class="item">{inline(i)}</div>' for i in items)
            out.append("</div>")
            items.clear()

    i = 0
    lines = body.split("\n")
    while i < len(lines):
        line = lines[i].rstrip()

        if line.startswith("```"):
            spec = line[3:].strip()
            kind, _, label = (spec.partition("|") + ("",))[:3] if "|" in spec else (spec, "", "")
            kind, label = kind.strip(), label.strip()
            i += 1
            buf = []
            while i < len(lines) and not lines[i].startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            flush_items()
            tag = f'<span class="tag">{inline(label)}</span>' if label else ""
            if kind == "asks":
                # one ask per line, each its own box — for the browse-and-flip book
                lines_ = [l.strip() for l in buf if l.strip()]
                text = "".join(f"<p>{inline(l)}</p>" for l in lines_)
                out.append(f'<div class="asks">{tag}{text}</div>')
                continue
            css = {"ask": "prompt", "callout": "callout",
                   "warn": "callout warn", "letter": "letter"}.get(kind, "callout")
            text = "".join(f"<p>{inline(p)}</p>" for p in _paras(buf))
            out.append(f'<div class="{css}">{tag}{text}</div>')
            continue

        if line.startswith("- "):
            items.append(line[2:].strip())
            i += 1
            continue

        if not line:
            flush_items()
            i += 1
            continue

        buf = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not lines[i].startswith(("- ", "```")):
            buf.append(lines[i].rstrip())
            i += 1
        flush_items()
        out.append(f"<p>{inline(' '.join(buf))}</p>")

    flush_items()
    return "\n".join(out)


def _paras(lines: list[str]) -> list[str]:
    text = "\n".join(lines).strip()
    return [" ".join(p.split()) for p in re.split(r"\n\s*\n", text) if p.strip()]


def build_page(kind: str, num: str, heading: str, body: str, page_no: int) -> str:
    if kind == "cover":
        paras = _paras(body.split("\n"))
        title = re.sub(r"\*\*(.*?)\*\*", r"\1", paras[0]) if paras else TITLE
        sub = paras[1] if len(paras) > 1 else ""
        series = paras[2] if len(paras) > 2 else ""
        return f"""<div class="page cover">
  <div class="cover-top"><span class="wordmark white">VEER</span></div>
  <div class="cover-mid">
    <h1 class="cover-title">{html.escape(title)}</h1>
    <div class="rule-accent"></div>
    <p class="cover-lede">{html.escape(sub)}</p>
  </div>
  <div class="cover-foot">{html.escape(series)}</div>
</div>"""

    if kind == "disclaimer":
        return f"""<div class="page">
  <div class="head"><span class="wordmark sm">VEER</span></div>
  <div class="body disclaimer-page">
    <p class="lead-label">Disclaimer</p>
    {render_blocks(body)}
  </div>
  <div class="foot"><span>{html.escape(SERIES)}</span><span>{page_no}</span></div>
</div>"""

    ghost = ""
    if kind == "lesson" and num:
        digits = re.match(r"\d+", num)
        if digits:
            ghost = f'<div class="step">{digits.group()}</div>'

    classes = "body"
    if kind == "current":
        classes += " current-page"
    if kind == "card":
        classes += " card-page"

    head_html = f"<h2>{inline(heading)}</h2>" if heading else ""
    return f"""<div class="page">
  <div class="head"><span class="wordmark sm">VEER</span></div>
  <div class="{classes}">
    {ghost}{head_html}
    {render_blocks(body)}
  </div>
  <div class="foot"><span>{html.escape(SERIES)}</span><span>{page_no}</span></div>
</div>"""


# ------------------------------------------------------------------ overflow

# Measured on .page, not on .body: .body is a flex item with no fixed height, so
# it grows to fit its content and never reports overflow against itself. .page is
# pinned to 11in with overflow:hidden, so its scrollHeight is what actually
# exceeds the sheet — and the footer's position confirms it.
OVERFLOW_PROBE = """
<script>
var bad = [], thin = [];
document.querySelectorAll('.page').forEach(function (p, i) {
  var over = p.scrollHeight - p.clientHeight;
  var foot = p.querySelector('.foot');
  if (foot) {
    var gap = foot.getBoundingClientRect().bottom - p.getBoundingClientRect().bottom;
    if (gap > over) { over = gap; }
  }
  if (over > 2) { bad.push((i + 1) + ':' + Math.round(over) + 'px'); }
  var inner = p.querySelector('.body');
  if (inner && inner.lastElementChild && over <= 2) {
    var used = inner.lastElementChild.getBoundingClientRect().bottom
             - inner.getBoundingClientRect().top;
    var pct = Math.round(100 * used / inner.clientHeight);
    if (pct < 50) { thin.push((i + 1) + ':' + pct + '%'); }
  }
});
document.title = 'OVERFLOW ' + (bad.length ? bad.join(',') : 'none')
              + ' THIN ' + (thin.length ? thin.join(',') : 'none');
</script>
"""


def check_overflow(html_doc: str) -> tuple[list[str], list[str]]:
    probe = HERE / f"_probe_{BOOK_DIR.name}.html"
    probe.write_text(html_doc.replace("</body>", OVERFLOW_PROBE + "</body>"))
    dom = subprocess.run(
        [chrome(), "--headless", "--disable-gpu", "--no-sandbox",
         "--virtual-time-budget=4000", "--dump-dom", probe.as_uri()],
        capture_output=True, text=True,
    ).stdout
    probe.unlink(missing_ok=True)
    over = re.search(r"<title>OVERFLOW ([^ ]*) THIN ([^<]*)</title>", dom)
    if not over:
        return [], []
    full = [] if over.group(1) == "none" else over.group(1).split(",")
    thin = [] if over.group(2) == "none" else over.group(2).split(",")
    return full, thin


# ---------------------------------------------------------------------- main

def main() -> None:
    pages = split_pages(MANUSCRIPT.read_text())
    body = "\n".join(
        build_page(kind, num, heading, text, n)
        for n, (kind, num, heading, text) in enumerate(pages, start=1)
    )
    doc = (
        "<!doctype html>\n"
        '<html lang="en"><head><meta charset="utf-8">\n'
        f"<title>{TITLE}</title>\n"
        f"<style>{font_css()}</style>\n"
        f"<style>{(HERE / 'style.css').read_text()}</style>\n"
        f"</head><body>{body}</body></html>"
    )
    (HERE / f"_build_{BOOK_DIR.name}.html").write_text(doc)

    overflowing, underfull = check_overflow(doc)
    if overflowing:
        print(f"{TITLE}")
        print(f"  FAIL: {len(overflowing)} page(s) overflow and would be clipped:")
        for entry in overflowing:
            page, amount = entry.split(":")
            print(f"    page {page} is over by {amount}")
        print("  Split the page in the manuscript, or trim it.")
        sys.exit(1)

    GUIDE_DIR.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [chrome(), "--headless", "--disable-gpu", "--no-sandbox",
         "--no-pdf-header-footer", f"--print-to-pdf={OUT}",
         (HERE / f"_build_{BOOK_DIR.name}.html").as_uri()],
        check=True, capture_output=True,
    )

    raw = OUT.read_bytes()
    count = len(re.findall(rb"/Type\s*/Page[^s]", raw))
    box = re.search(rb"/MediaBox\s*\[([^\]]+)\]", raw)
    dims = [float(n) for n in box.group(1).split()] if box else [0, 0, 0, 0]
    w, h = (dims[2] - dims[0]) / 72, (dims[3] - dims[1]) / 72

    print(f"{OUT.name}")
    print(f"  {len(raw) / 1024:.0f} KB · {count} pages · {w:.2f} x {h:.2f} in")
    if underfull:
        print(f"  note: {len(underfull)} page(s) less than half full — "
              f"consider merging: {', '.join(underfull)}")
    if count != len(pages) or (round(w, 2), round(h, 2)) != (8.5, 11.0):
        raise SystemExit(f"FAIL: expected {len(pages)} pages at 8.50 x 11.00 in")
    print("  no overflow · verified")


if __name__ == "__main__":
    main()
