# Lead-magnet checklist — the free printable that earns the email

Every planner ships with a **free printable checklist PDF** plus a **companion guide
page** on the MDRN website. Together they are the top of the funnel: the guide is
what a stranger finds, the checklist is what they trade an email address for, and
the planner is what they eventually buy.

This is a different deliverable from the Phase 5c Getting Started Guide. Don't
conflate them:

| | Getting Started Guide (5c) | Lead-magnet checklist (5d) |
| --- | --- | --- |
| Audience | someone who already **bought** | a **stranger** who has never heard of us |
| Job | get them using the app | earn an email, create the pain the app solves |
| Palette | the **planner's** own palette | the **website** brand (Playfair/Montserrat, site tokens) |
| Lives in | `MDRN/<Niche>/Getting Started/` | `MDRN/Website/downloads/` |
| Ships via | the Etsy/Payhip digital file | Kit, after signup |

The website brand is used deliberately: every guide on the site has to read as one
publication. A checklist wearing the planner's palette would look like a stray
asset from a different brand.

---

## The rule: give away the *what*, sell the *how*

This is the whole design constraint, and it decides every judgement call below.

**The product's value was never the information.** A 12-month wedding timeline is
on a hundred blogs already. Withholding it protects nothing and just forfeits the
traffic.

**The product's value is the mechanism** — the budget that totals itself, the RSVPs
that update the headcount, the seating chart that redraws.

So:

- **A printable checklist gives away information.** It cannot total, update, or
  recalculate. Someone prints it, starts ticking, and within a week is running a
  paper list *plus* a budget in their head *plus* RSVPs in their texts. The
  checklist **creates** the pain the app resolves. It is an ad people say thank you for.
- **A spreadsheet gives away the mechanism.** It is a functional substitute for a
  large part of the product, and it directly contradicts the line's own "no
  spreadsheet" positioning. We would be handing out the exact thing we tell people
  to escape, with our logo on it.

**Never ship a spreadsheet, a fillable form-field PDF, or anything that calculates,
as a lead magnet** — no matter how much more generous it looks. Static and
printable, always.

The same reasoning rules out a free "lite" version of the app itself. That gives
away the mechanism too. Don't propose one.

---

## What to build, per planner

**1. A companion guide page** at `Website/guides/<slug>.html`

- 1,200–1,800 words, genuinely useful standalone
- Answers the question the buyer is *already searching for* — not "why buy our app."
  Nobody searches "MDRN wedding planner app"; they search "wedding planning checklist."
- Table of contents with jump links (deep-linkable for Pinterest, and it's what
  makes a long page scannable)
- One inline email capture roughly a third of the way down
- Closing CTA to the product page, with the price stated plainly
- `Article` JSON-LD, canonical URL, and an entry added to `sitemap.xml`
- Add it to the `guides/index.html` listing and cross-link from the product page

**2. The printable checklist PDF** at `Website/downloads/MDRN_<Name>_Checklist.pdf`

Built with `scripts/build_checklist_pdf.py`. **The guide is the checklist** — this
is a reformat of content already written, not new research. Structure:

- Cover — title in the bordered diamond-cornered frame, one-line promise
- 4–6 content pages, two phases each, every item with a real tickbox
- A closing page naming **what paper cannot do**, then the product

---

## Copy rules that matter

**The opt-in must not imply the planner is free.** A "FREE" eyebrow over "want this
as a checklist that tracks itself?" reads as *join the list, get the app free*. It
isn't, and that earns angry unsubscribes. Say what the email actually gets them:
more guides. The only price on the page belongs in the closing CTA.

**Write items as `<b>the action.</b> then the reason.`** The bold half is what gets
scanned on paper; the reason is why the item survives being skipped.

**US English.** This line sells to a US market. `license` not licence, `finalize`
not finalise, `parking lot` not car park, `pantyhose` not tights. Sweep for
Britishisms before shipping — a single "car park" quietly costs trust on the exact
page trying to earn it.

**Ration the callouts.** At most one `callout=` per checklist. More than one and
none of them read as important.

---

## The layout trap this script exists to catch

Content pages naturally end around 55–65% of page height, leaving a **dead bottom
band** — the same defect the shop's listing audit rejected the Engagement Planner
slides for. Two wrong fixes: padding with decoration, or cramming more items in.

The right fix is the **ruled Notes block**, which has `flex:1` and absorbs whatever
slack is left. It fills the page *and* is genuinely more useful on paper.

`build_checklist(...)` verifies every page automatically and refuses to call a build
clean when:

- **content > 100% of usable height** — overflow; move a phase to its own page
- **note lines < 120px** — page is too full to be writable on
- **content < 42% of usable height** — page is too thin; merge it rather than
  padding it with rules

**Note for anyone editing that verifier:** measure the `.phase` elements, *not* the
last child. `.notes` has `flex:1` and always stretches to the footer, so measuring
the last child reports ~98% fill on every page and the check silently never fails.
That bug was in the first version of this script.

When the guard flags a thin page, the fix is usually that a section is genuinely
under-written — add real items, don't lower the threshold.

---

## Delivery wiring

- **Tag each download separately in Kit.** Someone who takes the wedding checklist
  should get wedding email, not meal-prep email. The segmentation is worth more
  than the signup — it's the difference between a list and an audience.
- Kit's confirmation email links to the PDF at `mdrnmilestone.com/downloads/<file>.pdf`.
- The PDF's own footer and closing page carry the site URL, because PDFs get
  forwarded and that's free distribution.

---

## Usage

```python
import sys
sys.path.insert(0, r"G:\My Drive\ClaudeConfig\skills\niche-planner-builder\scripts")
from build_checklist_pdf import build_checklist, Phase

build_checklist(
    title="The 12-Month<br/>Wedding Planning<br/>Timeline",
    subtitle="Everything that has a deadline, in the order it needs to happen.",
    footer_label="Wedding Planning Timeline",
    phases=[
        Phase("12+ months out", "optional italic note",
              ["<b>Book the venue.</b> The most time-sensitive booking you have."],
              callout="<b>Worth checking now:</b> ..."),   # optional, max one per PDF
    ],
    closing={"headline": "This checklist can't add itself up.",
             "body": "...", "product": "The MDRN Wedding Planner",
             "product_body": "...", "url": "mdrnmilestone.com/planners/wedding.html",
             "price_line": "$24, once. Yours forever."},
    out_pdf=r"G:\My Drive\Claude\MDRN\Website\downloads\MDRN_Wedding_..._Checklist.pdf",
    scratch=r"<scratchpad>\checklist_build",
)
```

Worked reference implementation:
`MDRN/Marketing/lead-magnets/build_wedding_checklist.py`.
