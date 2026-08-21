# Getting Started Guide PDF

Every planner ships with a short branded PDF a buyer opens right after purchase — not a sales
document (that's the Etsy listing), an onboarding one. This is Phase 5c, right after Pinterest copy:
by this point the Etsy copy, Feature List, and brand identity kit already exist, so this phase is
almost entirely reuse and restyling, not new writing.

## Structure — cover + 5 numbered sections, ~7 pages

Mirror this section flow (validated against a real 7-page reference guide) rather than inventing a
different shape per niche — the numbered-section format itself is part of the house style:

1. **Cover** — brand badge + wordmark, a bordered title box with corner diamond ornaments holding
   "Getting Started Guide" / the niche product name, a small motif flourish, and a one-line tagline.
2. **01 — Getting Started** — a diamond-bulleted checklist of first-run steps: open the file,
   bookmark it, choose a palette, enter the core details (whatever drives the dashboard's headline
   stat), set the budget, add the primary list (guests/travelers/whatever the niche calls it), build
   out the signature feature once, save a backup. 7-8 items is the right length.
3. **02 — What's Inside** — every module from the confirmed Phase 0 list, in a two-column
   label/description format (label small-caps and right-aligned, description in a sentence or two).
   If the module count doesn't fit one page at a readable size, continue onto a second page headed
   "What's Inside — continued" rather than shrinking type to force-fit.
4. **03 — Using the [Signature Feature]** — a deep-dive, diamond-bulleted walkthrough of the ONE
   module chosen in Phase 0 as the signature feature (the one with real interactive depth — a
   drag-and-drop, a multi-step builder, a live chart). This is the same module the demo video
   centers on and the raw-screenshot set prioritizes — don't pick a different one here.
5. **04 — Saving, Restoring & Sharing** — the local-storage save/restore/share workflow, ending in a
   bordered tip callout box (icon + italic line) with one genuinely useful tip specific to the niche
   (e.g. "save a backup before and after every trip — it doubles as a travel record").
6. **05 — Frequently Asked Questions** — restate the Etsy listing's "Good to Know" Q&As plus a few
   more standard ones (browser support, printing, multi-use, resale policy) — 8-10 questions.

## Design — reuse the brand identity kit, don't invent new styling

Every element here should already exist from earlier phases:
- **Header** (every page): the Phase 0 badge + wordmark, centered, with a thin rule below.
- **Footer** (every page): a thin rule, then "MDRN MILESTONE CO. · [Niche] Planner" centered in
  small tracked caps. Page number top-right.
- **Section pages**: a large pale "ghost" numeral (01, 02, 03...) in the niche's primary color at
  very low opacity, sitting behind/beside the section title — same mechanism regardless of niche,
  just recolor it.
- **Bullets and dividers**: reuse the niche's own divider motif (the accent-colored small shape
  already established for hero-image dividers — a rotated-square diamond, drawn as a real shape per
  `marketing-imagery.md`'s glyph-coverage pitfall, not a font dingbat).
- **Guide accent color**: pick ONE consistent accent for numerals/bullets/section-eyebrow text,
  independent of which of the app's own N palettes a buyer eventually picks in-app — this mirrors
  how a validated reference guide used a neutral secondary color (not the app's primary blush) for
  this exact purpose. The app's own `--accent` custom property (the secondary/divider color, not
  `--primary`) is usually the right pick, since it's already established as "the accent that isn't
  trying to be the brand color."
- **Background**: a soft, low-saturation tint consistent with the app's own `--bg`, not stark white.

## Typography scale — size UP; small type on a big page reads as cheap and unfinished

**This is a direct, confirmed user correction, not a suggestion.** A first pass at a guide used
small body type (≈16–18px on the 1224px-wide canvas) with a section title around 46px, and the
result was flagged directly: the pages "look empty and cheap or not thought out." A getting-started
guide is a premium onboarding document a buyer opens right after paying — undersized text floating
in a sea of margin is the single fastest way to make it feel like an afterthought. **Every guide
from here on uses a larger, more confident type scale.** The failure mode to avoid is not "too much
text," it's "too-small text that doesn't fill the page and reads as unpolished."

These are **minimum** sizes at the standard `1224 × 1584` px page canvas (288 DPI / 8.5×11in). Scale
proportionally if you change the page dimensions. Bigger is fine; smaller is the bug:

| Role | Minimum size | Notes |
|------|-------------|-------|
| Section headline (`h1`) | **56–60px** | the big slab title per section |
| Cover title | **60–64px** | the boxed product-name line |
| Lead/intro paragraph | **24px** | the one-line section intro |
| Body copy (bullet descriptions, numbered-step text, module descriptions, FAQ answers) | **20–22px** | never below 20px — this is the line most often left too small |
| Emphasis labels (bullet titles, module labels, FAQ questions) | **24–28px** | the slab-serif sub-headings inside a section |
| Tip-box text | **21px** | italic callout |
| Eyebrow (section kicker) | **16px** | tracked caps |
| Footer / page number | **13–14px** | the only genuinely small text on the page |
| Ghost section numeral | **~270px** | the pale background 01/02/03 |

Pair the larger type with **generous vertical spacing** (≈28–34px between bullets/steps, ≈24px row
padding between module rows) so the content genuinely fills the page rather than clustering at the
top — large type with tight spacing just moves the empty band down instead of removing it. If a
section still leaves a large empty lower third after sizing up, that section is under-written: add a
tip-box callout, split a dense section across two pages, or fold in another genuinely useful
detail — don't shrink the type back down to "balance" the whitespace. As a rough target, each
section page's content should reach at least the lower-middle of the page; a page that stops at the
halfway line is a signal to enlarge or add, not to leave as-is.

## Build technique — HTML pages rendered to images, then assembled into one PDF

This reuses the exact same rendering approach as every other marketing asset in this skill (see
`references/feature-slides.md` and `scripts/render_html_canvas.py`) — write each page as a
self-contained HTML/CSS document, screenshot it with Playwright, then combine the page images into a
single PDF file:

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1224, "height": 1584}, device_scale_factor=2)
    for i, html_path in enumerate(page_html_files, start=1):
        page.goto(f"file:///{html_path}", wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        page.locator(".page").screenshot(path=f"page{i}.png")
    browser.close()
```

`1224x1584` at `device_scale_factor=2` renders at 288 DPI for a true 8.5x11in US Letter page (the
math: 1224/8.5 = 144, so the 2x scale factor gives 288 DPI — crisp at print resolution without
needing a separate upscale pass). Adjust the base viewport for a different physical page size, but
keep the `width/height_inches * 144` relationship so the DPI math holds.

Then assemble the page PNGs into one PDF with PIL, passing the *actual* rendered DPI so the PDF's
physical page size comes out correct (skip this and every reader will show the pages at 72 DPI's
worth of physical size — several times too large):

```python
from PIL import Image

imgs = [Image.open(f"page{i}.png").convert("RGB") for i in range(1, len(page_html_files) + 1)]
imgs[0].save("guide.pdf", save_all=True, append_images=imgs[1:], resolution=288.0)
```

Verify the result before delivering — open it back up (PyMuPDF/`fitz` is a reliable dependency-free
way to check page count and physical dimensions) and confirm every page reports `8.5 x 11.0` inches,
not some multiple of it:

```python
import fitz
doc = fitz.open("guide.pdf")
for i, pg in enumerate(doc):
    r = pg.rect
    print(i + 1, r.width / 72, r.height / 72)  # expect 8.5 11.0 on every page
```

## Reading an existing sibling guide as a structural reference

If another niche in the product line already has a Getting Started Guide, skim it first for section
flow and page count before writing a new one — but reference files like this tend to be flattened,
image-only PDFs (built the same way this skill builds them) with **no extractable text layer**.
`pdftotext`/`pypdf` text extraction will silently return empty strings; don't mistake that for the
PDF being blank. Render pages to images to actually see them:

```python
import fitz  # pip install pymupdf — no system/poppler dependency, unlike pdftoppm
doc = fitz.open("reference_guide.pdf")
for i, pg in enumerate(doc):
    pix = pg.get_pixmap(matrix=fitz.Matrix(2, 2))
    pix.save(f"ref_page{i+1}.png")
```

`pymupdf` is worth installing by default for this task — the built-in PDF-reading path in this
environment depends on `pdftoppm` (poppler-utils), which may not be present, while `pip install
pymupdf` has no external binary dependency and works immediately.

**Extract the structure, not the visual style.** Match the reference's section flow, page count, and
information density — but every color, font, glyph, and decorative element must come from the new
niche's own brand identity kit. Copying the reference's actual visual design (its specific serif
font, its specific green, its specific dragonfly icon) would be the same mistake as reusing another
niche's app CSS verbatim — see the layout-composition pitfall in `SKILL.md`'s Phase 0.

## Output

Save both files to `Getting Started/`, sibling to `HTML/`, `Etsy/`, and `Pinterest/`:
- `MDRN_<Niche>_Getting_Started_Guide.pdf`
- `Feature List.txt` — the plain-text source content the "What's Inside" section is built from; a
  useful standalone deliverable on its own, and worth writing before the PDF rather than after, since
  the PDF's page 2-3 content is a direct visual restatement of it.
