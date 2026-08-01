# MKA Consulting — website rebuild

A rebuild of **mkaonline.com / mkaconsulting.com** for Mefford, Knutson & Associates, Inc.

Static HTML/CSS/JS. No build step, no framework, no external requests — every asset is
local, so it runs from a folder, a CDN, S3, Netlify, Vercel, or dropped straight into a
WordPress theme directory.

```
mkaonline/
├── index.html          Home — hero, services, license finder, checklists, catalog preview
├── about.html          Founding story, Jeanette Mefford & Sally Knutson, credentials
├── services.html       Six services in detail, process, FAQ accordion
├── store.html          Full 16-item catalog with license-type filtering
├── checklists.html     All five licensing checklists
├── contact.html        Contact form + details
├── terms.html          Legal placeholder (see "Before launch" below)
└── assets/
    ├── css/fonts.css   @font-face for the self-hosted typefaces
    ├── css/tokens.css  ← THE PALETTE LIVES HERE
    ├── css/main.css    Everything else. Contains zero raw hex values.
    ├── js/main.js      All behavior. Site degrades gracefully without it.
    ├── img/favicon.svg
    └── fonts/          Subset WOFF2 + OFL licenses
```

`vercel.json` at the repo root carries the production security headers.
`AUDIT-FINDINGS.md` records what was measured and what is still open.

Run locally:

```sh
cd mkaonline && python3 -m http.server 8899
# http://127.0.0.1:8899
```

---

## The color palette

Per the brief, the palette is the one thing carried over. It was sampled from screenshots
of the current site — the royal-blue logo triangle and section fields, the gold
"Schedule a Consultation" button and card borders.

| Token | Value | Role |
|---|---|---|
| `--blue-950` | `#05041a` | The ground — the site is dark throughout |
| `--blue-900` | `#0c0a3e` | Raised field |
| `--blue-800` | `#14115c` | Elevated field |
| `--blue-700` | `#221f9b` | **Primary — the MKA blue** |
| `--blue-600` | `#2e2ac4` | Logo triangle blue |
| `--blue-500` | `#4a46e0` | Luminous edge |
| `--gold-500` | `#f2b01e` | **Primary accent — spent sparingly** |
| `--gold-400` | `#ffc94d` | Highlight |
| `--gold-300` | `#ffdd8f` | Fine detail on dark |
| `--bone` | `#f4f1ea` | Warm off-white body text |

The blues and gold are eyedropper estimates from a phone screenshot, not the originals.
If MKA has the real brand hexes, edit the `BRAND PALETTE` block at the top of
`assets/css/tokens.css` — every color on every page resolves back to it, so the whole
site retunes from that one edit. Nothing else in the codebase contains a hex value.

---

## What's new versus the current site

- **License Finder** (home page) — a two-question wizard that routes a visitor to Basic,
  Comprehensive, Assisted Living, 245D or PCA and names the matching MKA resource. Built
  from a small declarative graph in `main.js`; add or reorder questions by editing `GRAPH`
  and `RESULTS`.
- **Filterable catalog** — all 16 products in one page, filtered by license type.
- **Real checklist content** — the five checklists as scannable step lists rather than
  empty cards.
- **Fully responsive** — the current site's mobile experience was the weakest part.
- **Accessibility** — skip link, keyboard-operable everything, visible focus rings,
  `aria-current` nav state, live regions on the finder and filters, `prefers-reduced-motion`
  honored throughout, semantic headings.
- **Performance** — no CDN, no JS libraries, no third-party requests at all. Typefaces
  (Instrument Serif + Lora) are self-hosted, subset to Latin and converted to WOFF2 at
  ~19KB per face. Average page: 9 requests, ~141KB uncompressed. Scroll handlers are
  rAF-batched.
- **SEO** — per-page titles and descriptions, Open Graph tags, `ProfessionalService`
  JSON-LD with founders and address.

Verified in headless Chromium at 1440×1000 and 390×844: no console errors, no failed
requests, finder and filters behave.

---

## ⚠️ Before launch — items needing MKA's confirmation

Research was done via web search only; the live site could not be fetched from the build
environment. The following are flagged rather than guessed at.

### 1. Claims I removed on purpose

An early research pass attributed **OASIS training, mock surveys / survey preparation,
quality improvement, and business development** to MKA as named services. A deeper pass
found **no evidence for any of them** on MKA's own site. They are not on this build. If
MKA does offer them, they should be added back — with their sign-off.

The services now listed are the ones that could be sourced to MKA's own copy: customized
consultation, policy development, licensure application support, training, forms &
documentation systems, and organizational development & redesign.

### 2. Address conflict

Site footer and terms say **6437 Lyndale Ave S, Richfield, MN 55423**. Third-party
directories (BBB, ZoomInfo, Yellow Pages) say **2950 Metro Dr Ste 114, Bloomington, MN
55425** — likely a former office. This build uses **Richfield**. Confirm.

### 3. Email address

`info@mkaconsulting.com` is used in the footer and as the contact-form target. One source
rendered it as `info@mkcconsulting.com`, almost certainly a typo — **but verify before
launch.** Phone `(612) 869-8011` is corroborated across several sources.

### 4. Contact form has no backend

The form validates client-side and currently hands off to the visitor's mail client
(`data-transport="mailto"`), so it is never a dead end. Point it at a real handler before
launch — any static-form service works without changing the markup. See the comment block
in `contact.html`.

### 5. Fees in the checklists

The current site's checklists carry specific dollar figures, and at least one pair is
internally inconsistent ($709 vs $4,200 on the same comprehensive checklist). Rather than
republish possibly-stale numbers, this build describes the fees and tells visitors to
confirm current amounts with MDH/DHS. Put exact figures back once MKA verifies them.

### 6. PCA → CFSS transition

Minnesota began transitioning PCA and PCA Choice to **CFSS (Community First Services and
Supports)** on October 1, 2024. Two MKA products and one checklist are built around PCA.
This build keeps them (MKA still sells them) but adds a "talk to us about the CFSS
transition" note on the PCA checklist rather than presenting PCA as evergreen. **MKA should
decide how to handle this** — it is arguably a product opportunity, not just a correction.

### 7. Prices

Only four are confirmed and shown: MN PCA Policy Manual ($200–$260), MN Basic License Forms
Package ($244.19–$304.19), PCA & PCA Choice Forms Package ($244.19–$319.19), Consultation
($180/hr). The rest show no price and link out to the live product pages. What the price
*ranges* represent (digital vs. printed?) is unknown.

### 8. Store checkout is intentionally untouched

Every "View & purchase" button links to the existing `mkaconsulting.com/product/...` page.
Payments keep working through launch. Migrating checkout is a separate decision.

### 9. Legal pages

`terms.html` is a structural placeholder carrying only the product/pricing and delivery
language that could be sourced. The operative terms and privacy text must be reviewed and
pasted in before launch.

### 10. No testimonials

None exist publicly — the Yelp page has zero reviews. Nothing was invented. The honest
trust signals used instead: founded 1990, Minnesota Home Care Association member, BBB
accredited since 2017, founder credentials (RN, BSN, MPH / Counseling, Health & Human
Services Administration).

### 11. Photography

The current site uses a black-and-white office photo behind the hero. This build uses a
generated gradient field instead, so there is no image dependency. If MKA has good
photography — the founders, the office, clients — it will lift the site further; the hero
is structured to accept a background image with a one-line CSS change.

---

## Domain note

**Corrected after measurement:** `mkaonline.com` already **301-redirects** to
`mkaconsulting.com`, so the two domains are not serving duplicate content and
authority is not being split. What remains is a branding decision — `mkaonline.com`
is the domain on their materials, `mkaconsulting.com` is the one that serves. Pick
one to lead with and keep the redirect pointing at it.

The existing site is WordPress + WooCommerce + Yoast, behind Cloudflare. See
`AUDIT-FINDINGS.md` for the full measured detail.
