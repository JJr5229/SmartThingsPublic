# tffmn.org — rebuild

A static rebuild of the Transforming Families MN website, addressing the findings in
[`AUDIT.md`](./AUDIT.md).

## Run it

```bash
python3 -m http.server 8080     # then open http://127.0.0.1:8080
```

No build step, no package manager, no dependencies.

## What is here

```
index.html        Home — mission, programmes, stats, FAQ
meetings.html     Meeting schedule (city + cadence, never addresses)
programs.html     Every programme, by audience
resources.html    Minnesota resources + #national anchor
about.html        Peer-led story, governance, privacy policy
support.html      Canonical donate page + volunteer paths
contact.html      Contact routes, newsletter, crisis lines
404.html
assets/css/style.css   One stylesheet, ~600 lines, custom properties
assets/js/site.js      ~1KB — mobile nav + quick exit, progressive enhancement only
vercel.json       301s from every old Squarespace URL, security headers, caching
sitemap.xml  robots.txt
```

## What the rebuild fixes

| Audit finding | Fix |
|---|---|
| 3.1–3.4 broken/unparseable slugs | Clean slugs; **301s from all 11 old URLs** in `vercel.json` |
| 4.1 no keyword targeting | Every title and description rewritten around real queries, all within SERP length limits |
| 4.3 no structured data | `NGO`, `WebSite`, `FAQPage`, `ContactPage`, `ContactPoint`, `DonateAction` JSON-LD |
| 6.2 weak intake path | Meetings page states *why* addresses are withheld, sets a reply expectation, and uses pre-filled per-city `mailto:` subjects |
| 6.3 fragmented donations | Single canonical `/support.html`, with Givebutter / GiveMN / Benevity / mail / DAF all routed from one page |
| 6.4 no quick exit | Persistent quick-exit button site-wide; also triggers on Escape ×3; uses `location.replace()` so the site leaves no back-button trace |
| 6.1 no crisis fallback | Crisis lines (988, Trevor Project, Trans Lifeline) on `contact.html` and in resources |

## Verified before commit

- **WCAG 2.1 AA contrast** — 1,134 text nodes across 9 pages × light and dark themes, all pass.
  Accent blue and pink were darkened to `#26688a` / `#a84660` to clear 4.5:1 on every
  background they appear on.
- **Structure** — no dead internal links; all JSON-LD parses; exactly one `<h1>` per page;
  skip link, `lang`, canonical, and meta description on every page.
- **SERP lengths** — titles 41–63 chars, descriptions 134–164 chars.
- **Keyboard** — first tab stop is the skip link; Escape closes the mobile nav.
- **Functional** — mobile nav toggle and quick exit tested in Chromium; zero console errors.
- **Themes** — light and dark both rendered and checked.

## Content accuracy — read before launch

Because the live site could not be crawled (see `AUDIT.md` §0), copy was reconstructed from
Google's index and third-party listings. It is factually grounded but **must be reviewed by
TFF before launch**. Specifically:

- **Meeting cadence** — the schedule table lists city and audience only. Day-of-month and
  times were deliberately left out rather than guessed; older cached listings conflict with
  current ones.
- **"Since 2013" / "10+ years"** — derived from "more than 10 years" in TFF's own copy and
  the tenth Day of the Transgender Child. Confirm the exact founding year.
- **Duluth** appears in one source but not others — confirm the group is active.
- **Resource links** — every link resolves to a real organization, but the Minnesota list is
  deliberately short. TFF should expand it from their own vetted list.
- **`og.png`** was generated for this build; swap in a photo-based card if TFF has approved
  imagery. No photographs of families were used, by design.

## Deploying

`vercel.json` is set up for Vercel. The redirect table is the important part — it preserves
a decade of accumulated links from clinics, school districts, and news coverage. Whatever
host is used, **those 301s must ship with it.**

Clean URLs (`/about` rather than `/about.html`) are one flag away: set `"cleanUrls": true`
and drop the `.html` from internal links.
