# EZ Plumbing & Drains — audit, rebuild and proposal

Work product for **ezplumbingmn.com** (EZ Plumbing & Drains, Blaine MN), produced
31 July 2026.

Three deliverables:

| | What it is |
|---|---|
| [`audit/website-audit.md`](audit/website-audit.md) | Full audit of the live site — all 83 URLs crawled, measured in a real browser |
| [`audit/google-business-profile-audit.md`](audit/google-business-profile-audit.md) | Google Business Profile audit, scored against the 16 publicly verifiable factors |
| [`proposal/index.html`](proposal/index.html) | Client-facing Veer proposal, self-contained single page |
| `src/`, `build.mjs` | The rebuilt website — 85 static pages |

---

## The two findings that matter most

1. **All 83 pages of the live site display `612.392.0832`** as text, while the
   tap-to-call link underneath is `tel:651-392-0832`. The Google Business Profile says
   **(651) 392-0832** — so the link is correct and the number a human reads is wrong.
2. **Four links on the homepage are labelled `Button`**, and two of them point at the
   wrong page.

Both are reproducible from a clean checkout — see "Reproducing the audit" below.

---

## The rebuild

```bash
node build.mjs          # writes dist/ (85 pages, ~90 ms)
node build.mjs --serve  # build, then serve dist/ on :4321
node check.mjs          # 21-point audit of the built output; non-zero exit on failure
```

No dependencies. No install step. Node 18+.

### Structure

```
src/data.mjs        every fact on the site — NAP, services, 74 cities, FAQs
src/templates.mjs   page templates + JSON-LD builders
src/styles.css      24 KB, hand-written, no framework
src/app.js          5 KB — mobile nav, services dropdown, FAQ, call tracking
build.mjs           generator: pages, sitemap, robots, redirects, favicon, OG image
check.mjs           post-build regression audit
```

`src/data.mjs` is the point of the whole design. The phone number appears **once**, in
one file, and is generated into all 85 pages. `check.mjs` fails the build if any page
disagrees with any other — so the defect the live site currently has cannot recur.

### Measured against the live site

Homepage, headless Chromium, Pixel 5 emulation:

| | Live site | Rebuild |
|---|---:|---:|
| Requests | 50 | **4** |
| Page weight | 3,269 KB | **71 KB** |
| JavaScript | 1,944 KB (25 files) | **4.7 KB** (1 file) |
| CSS | 380 KB (26 files) | **23.7 KB** (1 file) |
| HTML per page (avg) | 225 KB | **31.7 KB** |
| Security headers | 4 / 6 | **6 / 6** |
| Pages with LocalBusiness schema | 0 / 83 | **85 / 85** |
| Pages showing a wrong phone number | 83 / 83 | **0** |

The rebuild currently ships **without photography** — that accounts for part of the
weight difference and is called out in the proposal rather than glossed over. Adding
ten optimised job photos would land the homepage around 300–400 KB, still an order of
magnitude below the current site.

### What was verified, not assumed

`check.mjs` runs 21 checks over the built output; all pass. Separately, the site was
driven in headless Chromium across five viewports (320, 393, 768, 1280, 1440) checking
for horizontal overflow, layout shift, tap-target size, JS errors, and correct
behaviour of the mobile nav, services dropdown, FAQ accordion and the contact form's
emergency nudge.

Three defects were found and fixed this way rather than shipped:

- the nine-item top nav overflowed the viewport at every width (restructured into a
  services dropdown);
- the mobile header overflowed by 65 px below 430 px wide;
- inline SVG icons had no intrinsic size, so they collapsed to 0×0 inside flex buttons
  and stretched to 158 px inside block buttons.

### Migration safety

`dist/vercel.json` and `dist/_redirects` carry **83 permanent redirects** — one for
every URL the live site currently has indexed. City pages move from `/minneapolis` to
`/plumber/minneapolis/`; the mixed-case `/Water-Filtration-Systems` is normalised;
retired pages point at their closest live equivalent rather than 404ing. `check.mjs`
verifies the coverage.

---

## Things deliberately left blank

Neither is an oversight, and both are flagged in the proposal:

- **`business.licenseNumber` in `src/data.mjs` is empty.** Minnesota licensed plumbing
  contractors should identify themselves in advertising and it is a strong trust
  signal, but inventing a license number would be worse than omitting one. Fill it in
  and it renders in the header, footer and `Plumber` schema automatically.
- **The contact form posts to `https://formspree.io/f/REPLACE_WITH_FORM_ID`.** Swap for
  a real endpoint (or any form handler) at deploy time.

Also note: the `Plumber` schema **intentionally omits `aggregateRating`**. Google treats
self-serving review markup about your own business as ineligible and it can attract a
manual action. The 4.9 / 216 rating is displayed visually and linked to the real Google
profile instead.

---

## Reproducing the audit

Every figure in the audit documents came from these, run 31 July 2026:

```bash
# Phone number mismatch across the live site
curl -s https://www.ezplumbingmn.com/ | grep -oE 'tel:[0-9-]+|[0-9]{3}\.[0-9]{3}\.[0-9]{4}'

# Response headers / security header score
curl -sI https://www.ezplumbingmn.com/

# Page weight and request count were measured in headless Chromium with
# Pixel 5 emulation, summing response body sizes by resource type.
```

The Google Business Profile figures (4.9 / 216 reviews, the Blaine address, hours,
attributes, last post date) were read from the public Maps listing while signed out.
Everything only visible to the profile owner is listed as "not assessed" in that
document rather than estimated.
