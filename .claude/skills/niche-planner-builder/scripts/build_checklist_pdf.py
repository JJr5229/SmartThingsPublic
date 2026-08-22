# -*- coding: utf-8 -*-
"""Reusable: build a branded, printable CHECKLIST PDF — the free lead magnet that
sits on a planner's companion guide page and trades a genuinely useful printable
for an email address.

This is NOT the Getting Started Guide (Phase 5c). That one ships to a buyer AFTER
purchase and uses the planner's own palette. This one goes to a STRANGER BEFORE
purchase and uses the MDRN website brand, because every guide on the site has to
read as one publication.

THE RULE THIS SCRIPT EXISTS TO ENFORCE — give away the what, sell the how:
  * A checklist delivers INFORMATION. It cannot total a budget, update a headcount,
    or redo a seating chart. It creates the pain the app resolves.
  * A spreadsheet delivers MECHANISM. It is a functional substitute for the product
    and contradicts the line's own "no spreadsheet" positioning.
  * So: printable checklists, always. Spreadsheets or fillable/calculating PDFs,
    never — no matter how much more "generous" they look.

Usage:
    from build_checklist_pdf import build_checklist, Phase
    build_checklist(
        title="The 12-Month<br/>Wedding Planning<br/>Timeline",
        subtitle="Everything that has a deadline, in the order it needs to happen.",
        footer_label="Wedding Planning Timeline",
        phases=[Phase("12+ months out", "optional italic note", ["<b>Item.</b> Why."]), ...],
        closing={"headline": "This checklist can't add itself up.",
                 "body": "...", "product": "The MDRN Wedding Planner",
                 "product_body": "...", "url": "mdrnmilestone.com/planners/wedding.html",
                 "price_line": "$24, once. Yours forever."},
        out_pdf=r"G:\\My Drive\\Claude\\MDRN\\Website\\downloads\\MDRN_..._Checklist.pdf",
        scratch=r"<scratchpad>\\checklist_build",
    )

Pages are laid out two phases at a time. Any vertical slack left on a content page
is absorbed by a ruled "Notes" block that grows to fill it — this is deliberate.
A content page that ends at 55% height reads as unfinished; the same page with
writing space reads as designed, and is more useful on paper besides.
"""
import os

# ---- MDRN website brand tokens (Website/assets/styles.css) -----------------
CHARCOAL, TAUPE, GREIGE = "#1F1F1F", "#A89F94", "#D9D4CB"
SAGE, SAGE_DEEP = "#A8B5A1", "#8A9A82"
IVORY, BG_ALT, CARD = "#FAF8F3", "#F4F0E8", "#FFFFFF"
INK_SOFT, MUTED = "#4A4744", "#7C766E"

PAGE_W, PAGE_H = 1224, 1584          # 8.5x11 at 144dpi
MIN_CONTENT = 0.42                    # below this a page should be merged, not padded
MIN_NOTE_LINES_PX = 120               # keep at least ~3 writable lines per page

FONT_LINK = ('<link href="https://fonts.googleapis.com/css2?'
             'family=Playfair+Display:ital,wght@0,500;0,600;1,500&'
             'family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">')


class Phase(object):
    """One timeline/section block: a heading, an optional italic note, and items.

    Item strings may contain inline HTML; lead with <b>the action.</b> then the
    reason. Aim for 4-7 items — more than 7 and two phases stop fitting on a page.
    """
    def __init__(self, title, note, items, callout=None):
        self.title, self.note, self.items = title, note, items
        self.callout = callout   # optional pull-out box rendered after the items


def _css():
    return f"""
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:'Montserrat',sans-serif;-webkit-font-smoothing:antialiased}}
.page{{width:{PAGE_W}px;height:{PAGE_H}px;background:{IVORY};position:relative;
      padding:86px 96px 108px;display:flex;flex-direction:column;color:{CHARCOAL}}}
.hdr{{display:flex;align-items:center;justify-content:space-between;
     padding-bottom:20px;border-bottom:1px solid {GREIGE};margin-bottom:44px}}
.hdr .word{{font-family:'Playfair Display',serif;font-size:21px;letter-spacing:.16em;
          text-transform:uppercase;color:{CHARCOAL}}}
.hdr .word span{{color:{SAGE_DEEP}}}
.hdr .pg{{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:{MUTED}}}
.ftr{{position:absolute;bottom:52px;left:96px;right:96px;display:flex;
     align-items:center;justify-content:space-between;border-top:1px solid {GREIGE};padding-top:16px}}
.ftr .line{{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:{MUTED}}}
.diamond{{width:8px;height:8px;background:{SAGE};transform:rotate(45deg);flex-shrink:0}}
.eyebrow{{font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;
        color:{SAGE_DEEP};margin-bottom:14px}}
.phase{{margin-bottom:40px}}
.phase:last-of-type{{margin-bottom:0}}
.phase-head{{display:flex;align-items:baseline;gap:14px;margin-bottom:6px}}
.phase-head h2{{font-family:'Playfair Display',serif;font-size:31px;font-weight:500}}
.phase-head .rule{{flex:1;height:1px;background:{GREIGE}}}
.phase-note{{font-size:14px;color:{MUTED};font-style:italic;margin-bottom:20px;max-width:78ch}}
.row{{display:flex;gap:17px;align-items:flex-start;margin-bottom:15px}}
.box{{width:21px;height:21px;border:1.6px solid {TAUPE};border-radius:3px;
     flex-shrink:0;margin-top:2px;background:{CARD}}}
.row .txt{{font-size:16.5px;line-height:1.5;color:{INK_SOFT}}}
.row .txt b{{color:{CHARCOAL};font-weight:600}}
.notes{{margin-top:34px;flex:1;display:flex;flex-direction:column;min-height:0}}
.notes .lbl{{font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;
           color:{MUTED};margin-bottom:12px;display:flex;align-items:center;gap:10px}}
.notes .lbl .rule{{flex:1;height:1px;background:{GREIGE}}}
.notes .lines{{flex:1;min-height:0;background:repeating-linear-gradient(
           to bottom,transparent 0,transparent 40px,{GREIGE} 40px,{GREIGE} 41px)}}
.note{{background:{BG_ALT};border-left:3px solid {SAGE};border-radius:6px;
     padding:20px 24px;margin-top:26px}}
.note .txt{{font-size:15px;line-height:1.55;color:{INK_SOFT}}}
.note .txt b{{color:{CHARCOAL}}}
"""


NOTES_BLOCK = ('<div class="notes"><div class="lbl">Notes <div class="rule"></div></div>'
               '<div class="lines"></div></div>')


def _shell(body, pg_label, footer):
    return f"""<!DOCTYPE html><html><head><meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
{FONT_LINK}<style>{_css()}</style></head><body>
<div class="page">
  <div class="hdr"><div class="word">MDRN <span>&#9670;</span> MILESTONE CO.</div>
  <div class="pg">{pg_label}</div></div>
  {body}
  <div class="ftr"><div class="line">{footer}</div>
  <div class="line">mdrnmilestone.com</div></div>
</div></body></html>"""


def _phase_html(ph):
    rows = "".join('<div class="row"><div class="box"></div>'
                   f'<div class="txt">{t}</div></div>' for t in ph.items)
    note = f'<div class="phase-note">{ph.note}</div>' if ph.note else ''
    call = (f'<div class="note"><div class="txt">{ph.callout}</div></div>'
            if ph.callout else '')
    return (f'<div class="phase"><div class="phase-head"><h2>{ph.title}</h2>'
            f'<div class="rule"></div></div>{note}{rows}{call}</div>')


def _cover(title, subtitle):
    corners = "".join(
        f'<div style="position:absolute;{v};width:15px;height:15px;'
        f'background:{SAGE};transform:rotate(45deg)"></div>'
        for v in ("top:-8px;left:-8px", "top:-8px;right:-8px",
                  "bottom:-8px;left:-8px", "bottom:-8px;right:-8px"))
    return f"""
<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
  <div class="eyebrow">Printable Checklist</div>
  <div style="border:1.5px solid {TAUPE};padding:58px 76px;position:relative;margin-bottom:38px">
    {corners}
    <div style="font-family:'Playfair Display',serif;font-size:56px;font-weight:500;
                line-height:1.14;color:{CHARCOAL}">{title}</div>
  </div>
  <div style="font-size:18px;color:{INK_SOFT};max-width:560px;line-height:1.6">{subtitle}</div>
  <div style="display:flex;align-items:center;gap:12px;margin-top:44px">
    <div class="diamond"></div>
    <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:{MUTED}">
      Print it &nbsp;&middot;&nbsp; Tick it off &nbsp;&middot;&nbsp; Breathe</div>
    <div class="diamond"></div>
  </div>
</div>"""


def _closing(c):
    """The page that converts. Names what paper CANNOT do, then the product."""
    return f"""
<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
  <div class="eyebrow">When paper stops being enough</div>
  <div style="font-family:'Playfair Display',serif;font-size:42px;font-weight:500;
              line-height:1.2;max-width:20ch;margin-bottom:26px">{c['headline']}</div>
  <div style="font-size:17px;color:{INK_SOFT};max-width:60ch;line-height:1.7;margin-bottom:36px">{c['body']}</div>
  <div style="background:{CARD};border:1px solid {GREIGE};border-radius:14px;padding:34px 44px;max-width:760px">
    <div style="font-family:'Playfair Display',serif;font-size:27px;font-weight:500;margin-bottom:16px">{c['product']}</div>
    <div style="font-size:15.5px;color:{INK_SOFT};line-height:1.65">{c['product_body']}</div>
    <div style="margin-top:22px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:{SAGE_DEEP}">{c['url']}</div>
  </div>
  <div style="display:flex;align-items:center;gap:12px;margin-top:40px">
    <div class="diamond"></div>
    <div style="font-size:13px;color:{MUTED}">{c['price_line']}</div>
    <div class="diamond"></div>
  </div>
</div>"""


def build_checklist(title, subtitle, footer_label, phases, closing,
                    out_pdf, scratch, per_page=2, verify=True):
    """Render cover + content pages + closing page into one PDF. Returns out_pdf."""
    from playwright.sync_api import sync_playwright
    from PIL import Image

    os.makedirs(scratch, exist_ok=True)
    os.makedirs(os.path.dirname(out_pdf), exist_ok=True)

    groups = [phases[i:i + per_page] for i in range(0, len(phases), per_page)]
    total = len(groups)
    foot = "MDRN Milestone Co.  &middot;  " + footer_label

    specs = [(_cover(title, subtitle), "", "MDRN Milestone Co.  &middot;  Free Printable Checklist")]
    for i, grp in enumerate(groups, start=1):
        body = "".join(_phase_html(p) for p in grp) + NOTES_BLOCK
        specs.append((body, "%02d / %02d" % (i, total), foot))
    specs.append((_closing(closing), "", foot))

    paths = []
    for i, (body, label, f) in enumerate(specs, start=1):
        p = os.path.join(scratch, "page%d.html" % i)
        open(p, "w", encoding="utf-8").write(_shell(body, label, f))
        paths.append(p)

    pngs, problems = [], []
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        pg = br.new_page(viewport={"width": PAGE_W, "height": PAGE_H}, device_scale_factor=2)
        for i, hp in enumerate(paths, start=1):
            pg.goto("file:///" + os.path.abspath(hp).replace("\\", "/"), wait_until="networkidle")
            pg.evaluate("document.fonts.ready")
            if verify:
                # Measure the PHASE content, not the last child. The .notes block
                # has flex:1 and always stretches to the footer, so measuring the
                # last child reports ~98% fill on every page and can never fail.
                m = pg.evaluate("""() => {
                  const ftr = document.querySelector('.ftr');
                  const hdr = document.querySelector('.hdr');
                  const ph  = [...document.querySelectorAll('.phase')];
                  const top = hdr.getBoundingClientRect().bottom;
                  const bot = ftr.getBoundingClientRect().top;
                  const usable = bot - top;
                  if (!ph.length) return {kind:'nonphase'};
                  const end = ph[ph.length-1].getBoundingClientRect().bottom;
                  const lines = document.querySelector('.notes .lines');
                  return {kind:'phase', usable,
                          used: end - top,
                          ratio: (end - top) / usable,
                          linesH: lines ? lines.getBoundingClientRect().height : 0};
                }""")
                if m["kind"] == "phase":
                    if m["ratio"] > 1.0:
                        problems.append("page %d OVERFLOWS (content %d%% of usable "
                                        "height) — move a phase to its own page or cut items"
                                        % (i, round(m["ratio"] * 100)))
                    elif m["linesH"] < 120:
                        problems.append("page %d leaves under 3 note lines (%dpx) — "
                                        "the page is too full to be useful on paper"
                                        % (i, round(m["linesH"])))
                    elif m["ratio"] < 0.42:
                        problems.append("page %d is only %d%% content — merge it with "
                                        "another page rather than padding with rules"
                                        % (i, round(m["ratio"] * 100)))
            out = os.path.join(scratch, "page%d.png" % i)
            pg.locator(".page").screenshot(path=out)
            pngs.append(out)
        br.close()

    imgs = [Image.open(p).convert("RGB") for p in pngs]
    imgs[0].save(out_pdf, save_all=True, append_images=imgs[1:], resolution=288.0)

    if problems:
        print("LAYOUT PROBLEMS — fix before shipping:")
        for pr in problems:
            print("  !", pr)
    else:
        print("layout ok: %d pages, content density and note space both within range" % len(imgs))
    print("saved:", out_pdf, "(%.2f MB)" % (os.path.getsize(out_pdf) / 1048576.0))
    return out_pdf
