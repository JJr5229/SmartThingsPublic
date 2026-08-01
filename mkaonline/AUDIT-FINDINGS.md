# MKA Consulting — Audit findings

Collected for Veer, August 2026. Everything below is either measured or sourced;
nothing is asserted. Items that could not be measured are marked as such rather
than estimated.

---

## 0. What could and could not be run

**Skills that were asked for but are not installed in this environment:**

| Skill | Owns | Status |
|---|---|---|
| `rebuild-pitch` | `audit-sites.py`, resource-timing snippet | **Not installed** |
| `gbp-audit-fix` | Veer Local Score, GBP findings | **Not installed** |
| `gbp-fix-engine` | GBP remediation | **Not installed** |
| onboarding skill | — | **Not installed / not found** |

Only `veer-proposal` (which references the three above) and `deploy-site` are
present. `veer-proposal` documents how the audits feed a proposal, but the tools
themselves live elsewhere.

**Network:** this container cannot reach `mkaonline.com`, `mkaconsulting.com`, or
Google — outbound HTTP is blocked by the environment's network policy. So even
with the scripts installed, the **existing** site and the **live GBP** cannot be
measured from this session. Only `WebSearch` works.

**Consequence:** there is no "before" column. The measured numbers below describe
the **new build only**. The comparison table `veer-proposal` expects for a rebuild
cannot be produced until the website audit is run somewhere with network access.

---

## 1. Website audit — the new build (measured)

Measured with headless Chromium; page weight is decoded resource bytes plus
document size, uncompressed.

| Page | Requests | Weight (KB) | DOM ready | Load |
|---|---|---|---|---|
| index | 9 | 166 | 220 ms | 474 ms |
| about | 8 | 129 | 56 ms | 61 ms |
| services | 10 | 156 | 52 ms | 179 ms |
| store | 8 | 138 | 65 ms | 70 ms |
| checklists | 9 | 150 | 56 ms | 64 ms |
| contact | 8 | 127 | 57 ms | 156 ms |
| terms | 8 | 121 | 35 ms | 144 ms |
| **Average** | **9** | **141** | — | — |

Served over Brotli in production, so transferred bytes are well below these
figures. Nine requests is: the document, three stylesheets, one script, and four
font files. There are no third-party requests, no trackers, and no CDN
dependencies of any kind.

### Security headers

Production was sending **1 of 6** common security headers (HSTS only).
**Now fixed** — verified live on the deployment:

| Header | Before | After |
|---|---|---|
| Strict-Transport-Security | ✅ | ✅ |
| Content-Security-Policy | ❌ | ✅ strict, no `unsafe-inline` |
| X-Content-Type-Options | ❌ | ✅ `nosniff` |
| X-Frame-Options | ❌ | ✅ `DENY` |
| Referrer-Policy | ❌ | ✅ `strict-origin-when-cross-origin` |
| Permissions-Policy | ❌ | ✅ camera/mic/geo/payment denied |
| Cross-Origin-Opener-Policy | ❌ | ✅ `same-origin` |
| Cross-Origin-Resource-Policy | ❌ | ✅ `same-origin` |

The CSP is genuinely strict — no `unsafe-inline` for scripts or styles — which
the site can afford only because it has no inline styles, no inline scripts and
no external requests. The last three inline `style` attributes were removed to
make that possible. Verified under the real policy: fonts load, the license
finder runs, catalog filters work, zero violations.

### SEO / accessibility

| Check | Result |
|---|---|
| `lang` attribute | ✅ all 7 pages |
| Exactly one `<h1>` | ✅ all 7 pages |
| Images missing `alt` | 0 (no raster images; all SVG, `aria-hidden`) |
| Empty / unlabelled links | 0 |
| Title length | 35–70 chars, all within range |
| Meta description | ✅ all pages, now 98–169 chars |
| Canonical tag | ❌ index only → ✅ **fixed**, all 7 pages |
| Open Graph tags | ❌ index only → ✅ **fixed**, all 7 pages |
| JSON-LD structured data | index only (ProfessionalService) |
| Heading-level skips | 1–2 per page — **open, minor** |

**Still open:** a small number of heading-level jumps (an `h2` followed by an
`h4`). Cosmetic for sighted users, mildly annoying for screen-reader navigation.
Worth a pass before launch.

---

## 1b. Existing site — what the build-machine probe established

This session has no network, so the probe ran on a Vercel build machine and the
results were read out of the build log. Two runs, plain GETs against public
pages.

**The page-level audit did not succeed.** Every HTML URL on both domains returned
**HTTP 403 with a Cloudflare "Just a moment..." challenge** from a datacenter IP.
The measurements those responses produced (5.6 KB, "5/6 security headers", no h1,
no meta description) describe *Cloudflare's challenge page*, not MKA's site, and
must not be quoted as findings. Solving the challenge would mean working around a
security control, so the probe was stopped.

**What was confirmed anyway:**

| Finding | Evidence | Confidence |
|---|---|---|
| `mkaonline.com` **301-redirects to** `mkaconsulting.com` | redirect chain: `mkaonline.com/ -> 301 \| mkaconsulting.com/ -> 403` | **Confirmed** |
| Site runs **WordPress** | `robots.txt` disallows `/wp-admin/`, `/wp-content/uploads/` | **Confirmed** |
| Store runs **WooCommerce** | `robots.txt` disallows `woocommerce_uploads`, `wc-logs`, `*?add-to-cart=` | **Confirmed** |
| **Yoast SEO** installed | `# START YOAST BLOCK` in `robots.txt` | **Confirmed** |
| **WP-Optimize** installed | `wpo-plugins-tables-list.json` entry | **Confirmed** |
| Behind **Cloudflare**, Brotli enabled | `server: cloudflare`, `content-encoding: br` | **Confirmed** |
| Sitemap at `/sitemap_index.xml` | declared in `robots.txt` | **Confirmed** |

**This corrects an earlier assumption.** The site README said the two domains
"both serve the same site," which implied duplicate content. They do not —
`mkaonline.com` already redirects. Domain consolidation is therefore *already
handled*; what remains is deciding which domain the brand leads with, since
`mkaonline.com` is the one on their printed materials while `mkaconsulting.com`
is the one that actually serves.

### Two new findings from this

**A. `robots.txt` has three separate `User-agent: *` groups.** One from
WooCommerce, one from WP-Optimize, one from Yoast. The specification says a
crawler should obey only the *first* matching group; behaviour across crawlers is
inconsistent when groups are duplicated. The Yoast block ends with a bare
`Disallow:` (allow everything), which may or may not override the WooCommerce
rules above it depending on the crawler. Worth consolidating into a single group.

**B. Cloudflare bot protection is challenging non-browser traffic aggressively.**
That is good for scrapers and bad for tooling — it is why no third-party audit
tool, including Veer's, will be able to scan the site from a server. Googlebot is
normally allowlisted by Cloudflare, so ranking is probably unaffected, **but this
should be verified in Search Console** rather than assumed. If the setting is
"Bot Fight Mode," it is known to catch legitimate crawlers.

### What this means for the audit

The website audit has to run **from a residential connection** — i.e. your
machine, which is where `rebuild-pitch` lives anyway. A datacenter IP cannot get
past the challenge, so no amount of cleverness in this session will produce the
"before" numbers.

---

## 2. Google Business Profile — public signals only

**This is not the Veer Local Score.** `gbp-audit-fix` is not installed and Google
is unreachable from here, so the profile itself was never opened. What follows is
inferred from public directory data via search, and every item needs confirming
against the actual dashboard.

### Finding 1 — NAP inconsistency (material)

The business address is published two different ways:

- **6437 Lyndale Ave S, Richfield, MN 55423** — MKA's own site footer/terms, and
  the Richfield Chamber of Commerce listing
- **2950 Metro Dr Ste 114, Bloomington, MN 55425** — BBB, ZoomInfo, Yellow Pages,
  Datanyze

Name/Address/Phone consistency is one of the heaviest local-ranking signals
Google uses. Two addresses across authoritative citations actively suppresses
local visibility, and one of them is almost certainly a former office. **This is
the highest-value fix available and it costs nothing but time.** Confirm which is
current, then correct the citations that are wrong.

Phone is consistent everywhere: **(612) 869-8011**.

### Finding 2 — no review presence

No customer reviews surfaced on any public source. The Yelp listing exists and
explicitly shows *"no reviews yet."* No Google star rating appeared in any search
result. For a 35-year-old firm this is a striking gap — reviews are both a ranking
factor and the first thing a prospective buyer of the business would look at.

### Finding 3 — category ambiguity

Third-party categorisation is inconsistent and unhelpful: BBB lists them under
**"Business Coach"**, the Richfield Chamber under **"Other Healthcare Business."**
Neither describes home care regulatory consulting. If the GBP primary category is
similarly off, the profile will not surface for the queries their buyers actually
type. **Needs checking in the dashboard.**

### Finding 4 — split domains

`mkaonline.com` and `mkaconsulting.com` both resolve to the same site. A GBP
listing can point at only one, and inbound links and authority are divided across
two hosts. Consolidating behind one canonical domain with 301s consolidates 35
years of accumulated authority.

### Finding 5 — no published hours

No business hours were found on any public source. An incomplete profile ranks
below a complete one, and hours are among the fields Google weights for
completeness.

### Not verifiable from here

Profile ownership/claim status · primary and secondary categories · photo count
and recency · Google review count and average · Q&A · Products/Services sections ·
posts · messaging · service-area configuration. All require the dashboard or a
live Google fetch.

---

## 3. Fixes already applied

1. Strict CSP plus seven other security headers, live and verified.
2. Inline styles removed so the CSP needs no `unsafe-inline` escape hatch.
3. Canonical tags added to six interior pages.
4. Open Graph tags added to six interior pages.
5. Home page meta description trimmed 219 → 153 characters.
6. Immutable cache headers on the self-hosted fonts.

## 4. To finish the job

- **Run `rebuild-pitch` against the live `mkaonline.com`** from a machine with
  network access — this produces the "before" numbers for the comparison table.
- **Run `gbp-audit-fix`** for the actual Veer Local Score and dashboard-level
  findings.
- **Confirm the current address** with the owners. Everything in Finding 1
  depends on it, and it is also flagged as unresolved in the site README.
