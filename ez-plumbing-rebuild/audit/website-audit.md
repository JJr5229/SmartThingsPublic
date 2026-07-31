# Website audit — ezplumbingmn.com

**Audited:** 31 July 2026
**Target:** https://www.ezplumbingmn.com/ (83 URLs, all crawled)
**Platform:** Duda (`cdn-website.com` asset origin, `d-css-runtime-flex` runtime)
**Method:** Full sitemap crawl, headless Chromium (Pixel 5 + 1440×900), response-header
inspection. Every number below was measured, not estimated.

---

## Summary

This is not a bad site. Somebody put real work into the 74 city pages and it shows —
they are individually written, roughly 1,870 words each, uniquely titled, and every one
carries FAQ structured data. That is better local-SEO groundwork than most plumbing
companies in this metro have.

The problems are concentrated in three places: **a wrong phone number on every page**,
**no business identity in the markup anywhere**, and **a page weight that punishes the
exact customer most likely to convert** — someone standing in a flooding basement on
mobile data.

| Severity | Count | Nature |
|---|---|---|
| Critical | 2 | Wrong phone number sitewide; visible placeholder UI on the homepage |
| High | 4 | No LocalBusiness schema; no NAP anywhere; 1.9 MB of JS; broken heading order |
| Medium | 5 | Card links point at wrong pages; dead markup on all 83 pages; mixed-case URL; two competing email addresses; no license number |
| Low | 3 | Two headers missing; robots.txt has no directives; homepage thinner than its own city pages |

---

## Critical

### C1 — Every page displays a phone number that is not the business's phone number

On all 83 pages, the header shows **`612.392.0832`** as text while the clickable link
behind it is **`tel:651-392-0832`**.

The Google Business Profile lists **(651) 392-0832**. The `tel:` link is right; the
number a customer reads and dials manually is wrong — wrong area code.

```
Page                        tel: link          displayed text
/                           651-392-0832       612.392.0832
/contact                    651-392-0832       612.392.0832
/about                      651-392-0832       612.392.0832
/minneapolis                651-392-0832       612.392.0832
… all 83 pages identical
```

Two consequences, and the second is worse than the first:

1. **Lost calls.** Anyone on a desktop, or anyone who reads the number and dials it from
   a different phone, reaches a wrong number. There is no way to know how many calls
   this has cost, because they never arrive.
2. **NAP inconsistency.** Google cross-references the phone number on your website
   against the one on your Business Profile as a ranking and trust signal. Publishing a
   conflicting number on 83 pages is a textbook local-SEO own-goal, and it is invisible
   from inside the business because the tap-to-call button works fine.

**Fix:** one character change, in one place, if the number lives in one place. It
currently does not.

### C2 — Four links on the homepage are labelled "Button"

Rendered and visible to every visitor, in the services card grid:

| Card heading | Link text | Destination |
|---|---|---|
| EMERGENCY PLUMBING REPAIRS | `Button` | `/about` |
| WATER HEATER INSTALLATION | `Button` | `/water-heater-install` |
| DRAIN CLEANING | `Button` | `/drain-cleaning` |
| CUSTOMIZED PLUMBING SOLUTIONS | `Button` | `/Water-Filtration-Systems` |

Two of the four also point somewhere unexpected: the emergency-repair card sends people
to the About page, and "Customized Plumbing Solutions" sends them to water filtration.

This is the single most damaging item on the site for trust, and it costs nothing to fix.
A homeowner deciding whether to let a stranger into their house at midnight is reading
this page for signals that you are careful. "Button" is the opposite signal.

---

## High

### H1 — No LocalBusiness schema anywhere on the site

The only JSON-LD served on the homepage is this:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "EZ Plumbing & Drains",
  "url": "https://www.ezplumbingmn.com/"
}
```

That is the whole thing. Across all 83 pages there is **no `LocalBusiness`, no `Plumber`,
no address, no phone, no opening hours, no service area and no geo-coordinates** in
machine-readable form. The city pages carry `FAQPage` markup — good — but nothing that
tells a search engine who the business is.

For a service-area business competing in local pack results, this is the highest-leverage
missing item on the site.

### H2 — The business's own contact details appear nowhere

Searched the full HTML of the homepage:

| Looking for | Found |
|---|---|
| Street address | not present |
| City / state of the business | not present |
| Business hours | not present |
| "Licensed" / "Bonded" / "Insured" | "Licensed Plumbers" once, in a bullet |
| MN contractor license number | not present |
| Google rating or review count | not present |

The Google profile says **1033 109th Ave NE, Blaine, MN 55434**, open 24 hours, rated
**4.9 from 216 reviews**. None of that appears on the website. The 216-review 4.9 rating
in particular is the strongest asset this business has and it is invisible to anyone who
lands on the site from anywhere other than Maps.

### H3 — 1.9 MB of JavaScript to render a brochure page

Measured on the homepage, emulating a Pixel 5:

| Resource type | Size | Files |
|---|---|---|
| **JavaScript** | **1,944 KB** | 25 |
| CSS | 380 KB | 26 |
| Images | 552 KB (mobile) / 1,797 KB (desktop) | 5 |
| Fonts | 187 KB | — |
| HTML | 205 KB | 1 |
| **Total** | **3,269 KB mobile / 4,538 KB desktop** | **50 requests** |

None of that JavaScript does anything a visitor would notice. It is the page-builder's
runtime. On a datacenter connection the page still loads in about 1.4 s, so this looks
fine when tested from an office — but your emergency traffic is on a phone, often in a
basement, often on a weak signal. That is where three-and-a-quarter megabytes and fifty
round trips actually costs you the call.

### H4 — Heading order is broken on every page

The homepage document outline begins:

```
h3   Get in touch
h5   skilled plumbers offering fast, reliable, and affordable solutions
h1   Your Trusted Twin Cities Plumber for Residential & Commercial
h3   24/7 Emergency Service
h2   Expert Technicians          ← h2 nested under an h3
h2   Quality Workmanship
h2   Our Services
h4   Emergency Plumbing Repairs
…
h3   Emergency Plumbing Repairs  ← same text again, different level
```

Two headings precede the `h1`, an `h2` sits inside an `h3` section, and the service names
appear twice at two different levels. This is a real accessibility problem for anyone
navigating by headings with a screen reader, and it muddies the topical signal for
crawlers.

---

## Medium

### M1 — Dead placeholder markup on all 83 pages

Present in the served HTML of **every page on the site**:

- `Title or Question` — three times, the untouched default of an unfilled FAQ widget
- `Breathtaking colors of our planet`, `Portraits of people from around the globe`,
  `Stark beauty of desolate dunes`, `Visual odyssey across continents` — stock template
  captions in the homepage service cards

**Important caveat, because it changes the severity:** I verified in a real browser that
none of this text is *visible* — it sits in markup the theme does not render. So no
customer sees "Breathtaking colors of our planet" on a plumbing site. It is shipped
weight and a sign of an unfinished build rather than an active embarrassment.

The four `Button` links in C2 *are* visible. Those are the ones that matter.

### M2 — Homepage has no FAQ content at all

The city pages carry six FAQs each with `FAQPage` schema. The homepage carries the
unfilled placeholder widget instead, so it has zero FAQ content and zero FAQ markup —
on the page that receives the most traffic and has the best chance of winning a rich
result.

### M3 — `/Water-Filtration-Systems` is the only mixed-case URL on the site

Every other URL is lowercase-hyphenated. Mixed-case paths are case-sensitive on most
servers and invite duplicate-content splits and broken inbound links.

### M4 — Two competing email addresses

`ezsewermn@gmail.com` is exposed in the header of every page, alongside
`info@ezplumbingmn.com` in the markup. The business already owns a branded address; a
gmail.com address in the header of a licensed contractor's site reads as less
established than the business actually is.

### M5 — No license number published

Minnesota licensed plumbing contractors are expected to identify themselves in
advertising, and the license number is one of the strongest trust signals available to a
trades business. It is not on the site.

---

## Low

### L1 — Two security headers missing

The site scores **4 of 6**, which is genuinely good and better than most small-business
sites:

| Header | Status |
|---|---|
| `strict-transport-security` | present (`max-age=31536000; preload`) |
| `content-security-policy` | present (`frame-ancestors 'self'`) |
| `x-content-type-options` | present (`nosniff`) |
| `x-frame-options` | present (`SAMEORIGIN`) |
| `referrer-policy` | **missing** |
| `permissions-policy` | **missing** |

Credit where it is due — Duda handles this well. This is not a problem worth paying to
fix on its own.

### L2 — `robots.txt` has a `User-agent: *` block with no directives under it

Harmless in practice, but it means the block does nothing.

### L3 — The homepage is thinner than its own city pages

| Page | Word count |
|---|---|
| Homepage | 1,276 |
| Typical city page | ~1,870 |
| `/contact` | 578 |
| `/seasonal-tips` | 529 |

The homepage should be the strongest page on the site. It is currently one of the
weaker ones.

---

## What is already working — do not rebuild these

An honest audit has to say what to leave alone. Four things here are done well:

1. **The 74 city pages are genuinely good.** Unique titles, unique meta descriptions,
   unique body copy (verified — I hashed the extracted text of all 83 pages and found
   zero duplicates), around 1,870 words each, all carrying FAQ schema. That content is
   an asset. It should be migrated, not rewritten.
2. **Zero broken links.** All 83 internal links return 200. Nav and sitemap agree
   exactly — no orphans, no dead ends.
3. **Titles and meta descriptions are all unique and well-sized.** Nothing truncated,
   nothing duplicated, nothing missing.
4. **Security headers are 4/6** and HSTS is preloaded.

---

## Priority order

| # | Item | Effort | Impact |
|---|---|---|---|
| 1 | Correct the displayed phone number to (651) 392-0832 | Minutes | Direct revenue |
| 2 | Replace the four "Button" links, fix their destinations | Minutes | Trust |
| 3 | Add `LocalBusiness`/`Plumber` schema with full NAP | Hours | Local ranking |
| 4 | Put address, hours, license and the 4.9/216 rating on every page | Hours | Conversion |
| 5 | Fix heading order sitewide | Hours | Accessibility, SEO |
| 6 | Cut page weight | Platform change | Mobile conversion |
| 7 | Write real homepage FAQs with schema | Hours | Rich results |
| 8 | Normalise the mixed-case URL, retire the gmail address | Minutes | Hygiene |

Items 1, 2 and 8 are worth doing this week regardless of any decision about a rebuild.
