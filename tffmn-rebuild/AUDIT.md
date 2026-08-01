# tffmn.org — Site & Google Business Profile Audit

**Subject:** Transforming Families MN (TFF) — 501(c)(3), EIN 99-4006633
**Date:** 31 July 2026
**Auditor:** Veer LLC

---

## 0. Method, and what this audit could not check

Direct HTTP access to `tffmn.org` was blocked by the network policy on the machine
this audit ran from (the egress proxy returned `403` on `CONNECT` for every host,
including control domains).

**Retried 1 Aug 2026 — still blocked.** `example.com`, `www.tffmn.org` and `tffmn.org`
all returned `403` on `CONNECT`, logged by the proxy as
`gateway answered 403 to CONNECT (policy denial or upstream failure)`. Because a control
domain fails identically, this is a blanket egress policy rather than anything specific to
the client's site, and it is not transient. It was not routed around.

The audit was therefore reconstructed from:

- Google's index of the site (11 distinct URLs recovered, with title tags and body snippets)
- Third-party listings: GiveMN, Givebutter, Benevity, GuideStar, CauseIQ, Twin Cities Pride
- Public references: City of Minneapolis, MN LGBTQIA2S+ Council, Children's Minnesota

**Not verified, and flagged as such throughout:**

| Cannot confirm without access | Needs |
|---|---|
| Core Web Vitals / Lighthouse scores | Live crawl or PageSpeed run |
| Actual HTML, heading structure, image alt text | Live crawl |
| Whether a Google Business Profile exists at all | GBP dashboard login |
| Current GBP categories, hours, photos, review count | GBP dashboard login |
| Analytics, traffic, conversion data | GA4 / Search Console access |

Everything below is either **[VERIFIED]** from indexed data or **[NEEDS CONFIRMATION]**.
Nothing is asserted from guesswork.

---

## 1. Platform

**Squarespace.** `[VERIFIED — high confidence]`

Evidence:
- `/our-history-1` — the trailing `-1` is Squarespace's automatic slug-collision suffix
- Title tags follow Squarespace's default `Page Name — Site Title` pattern with an em dash, site-wide
- Slug conventions (`/tffprograms`, `/mn-strong-4-trans-youth`) match Squarespace page-editor defaults

Implication: content is easy for staff to edit, but URLs, titles, schema, and page speed
are all constrained by the platform, and per-page SEO control is limited.

---

## 2. Page inventory

Eleven URLs are indexed:

| URL | Page title | Assessment |
|---|---|---|
| `/` | Transforming Families MN | Title carries no search terms |
| `/our-history-1` | About Us | **Broken slug** — see 3.1 |
| `/meetings` | Meetings | Good slug, thin targeting |
| `/tffprograms` | TFF Programs | **Unparseable slug** — see 3.2 |
| `/announcements` | Announcements | OK |
| `/mn-resources` | MN Resources | Good content, wrong slug priority |
| `/resources` | National Resources | **Slug/content mismatch** — see 3.3 |
| `/support-us` | Support Us | OK |
| `/contact-us` | Contact Us | OK |
| `/mn-strong-4-trans-youth` | MN Strong 4 Trans Youth | Campaign page, orphaned |
| `/pride-cultural-arts-center` | Pride Cultural Arts Center | See 5.3 |

---

## 3. Findings — information architecture & URLs

### 3.1 The About page lives at `/our-history-1` — **HIGH**
The page titled "About Us" is served from a URL ending in a collision suffix. This is the
second-most-visited page on almost every nonprofit site. The `-1` reads as broken to anyone
who sees the link, weakens the topical signal, and looks careless in a shared link — which
matters when the people sharing it are grant officers and journalists.

### 3.2 `/tffprograms` has no word separators — **MEDIUM**
Search engines tokenize on hyphens. `tffprograms` is one meaningless token; `/programs`
is a keyword. Free fix, real gain.

### 3.3 `/resources` is the *national* page; Minnesota is at `/mn-resources` — **MEDIUM**
The shorter, higher-authority, more guessable slug has been given to the page with the
*least* local relevance. For an organization whose entire value proposition is
"in Minnesota," this is backwards.

### 3.4 Missing conventional URLs — **LOW/MEDIUM**
No `/about`, `/donate`, or `/events`. These are the URLs humans type directly and that
AI assistants guess when citing an organization. Each should at minimum 301 to the right page.

---

## 4. Findings — search visibility

### 4.1 No title tag targets a real search — **HIGH**
Every title is `[Page] — Transforming Families MN`. The homepage title contains neither
"transgender," nor "support group," nor a searchable Minnesota phrase.

A parent in Rochester at 11pm is not searching "Transforming Families MN" — they don't know
the org exists yet. They are searching *"transgender support group Minnesota,"*
*"my child came out what do I do,"* *"parent support trans teen Rochester MN."* The site
currently gives Google almost nothing to match against those.

### 4.2 No city or region landing pages — **HIGH — biggest single opportunity**
TFF runs in-person groups in **seven named communities** — Minneapolis, Saint Paul,
Mahtomedi, Apple Valley, Rochester, Mankato, Duluth — plus two caregiver groups (Minneapolis,
Afton) and a statewide virtual group. All of that is collapsed onto one `/meetings` page.

There is nothing to rank for "transgender family support Rochester MN" or
"trans youth group Mankato." Those searches have low volume but extraordinarily high
intent — they are a family actively looking for help within driving distance.

This is fixable **without publishing a single address** (see 6.2).

### 4.3 No structured data evident — **HIGH**
No sign of `NGO`/`Organization`, `FAQPage`, or `Event` schema. For a nonprofit this costs
rich results, knowledge-panel accuracy, and — increasingly — correct citation by AI
assistants, which now mediate a growing share of "where do I get help" questions.

---

## 5. Findings — Google Business Profile

> **Access caveat:** this section is inferred from public search behaviour. It must be
> confirmed inside the GBP dashboard before acting.

### 5.1 No Business Profile surfaced in any search — **HIGH** `[NEEDS CONFIRMATION]`
Eleven targeted searches across two passes (brand + location, brand + reviews, brand + Maps,
address + "hours/directions", `site:` enumeration) returned the website, Facebook, GiveMN,
GuideStar, CauseIQ and Benevity — **but no Google Business Profile or Maps listing, and no
reviews on any platform.** The second pass, run specifically to try to disprove this finding,
surfaced nothing new.

This is strong but not conclusive evidence. Maps results are not reliably surfaced in web
search. The realistic possibilities, in order of likelihood:

1. No profile has ever been created
2. A profile exists but is unclaimed and unverified
3. A profile exists but is unoptimized and effectively invisible

All three have the same fix and the same first step: **log into the GBP dashboard and look.**

### 5.2 Zero reviews found anywhere — **HIGH**
For a peer-support organization, reviews are the single highest-leverage local ranking
factor *and* the thing that convinces a frightened parent this is safe. Fifteen to twenty
honest reviews from long-standing families would materially change both local pack
placement and first-contact conversion.

Worth naming plainly: soliciting reviews from families who attend a *confidential* support
group needs care. The right ask goes to board members, volunteers, partner clinicians, and
alumni families — people who have already chosen to be publicly associated with TFF — never
a blanket request to a current attendee list.

### 5.3 The address is a suite inside a shared building — **MEDIUM** `[NEEDS CONFIRMATION]`
`1201 Harmon Place #105` is an office inside the Pride Cultural Arts Center. Shared-building
addresses are the most common cause of GBP verification failures, duplicate listings, and
suspensions. The suite number must be present and consistent everywhere, and the listing
should almost certainly be configured as a **service-area business** given that the actual
programming happens in seven other cities.

### 5.4 The published hours are the *building's*, not TFF's — **MEDIUM** `[VERIFIED on site]`
The hours associated with the organization (Mon 12–8, Tue 9–4, Wed 12–8, Thu 9–4, Fri 9–1)
are the **Pride Cultural Arts Center's building hours**, published on TFF's own
`/pride-cultural-arts-center` page alongside entry directions ("enter on 12th between
Harmon & Yale") and the nearest bus stop (12th St S & Yale Place, stop 19333).

Two consequences:

1. **These are the hours Google has to work with.** They sit on tffmn.org, attached to the
   organization, and describe a building rather than a staffed office. Whether they have also
   been pulled onto a Business Profile is unconfirmed — but they are the most authoritative
   hours currently published, and they are misleading. A very small staff who spend evenings
   and Saturdays running groups in seven other cities are frequently not in that suite.
2. **The wayfinding content on that page is genuinely useful** and must survive any rebuild.
   Entry point, transit stop, and suite number are exactly what a first-time visitor needs.
   Carried into the rebuild's contact page, with the hours explicitly labelled as the
   building's.

### 5.5 NAP consistency — **MEDIUM**
The name appears as "Transforming Families," "Transforming Families MN," and
"Transforming Families Minnesota" across GiveMN, GuideStar, Benevity, CauseIQ and Facebook.
Pick one legal-name form, use it identically everywhere, and put the variants in GBP
alternate names only.

---

## 6. Findings — conversion & trust

### 6.1 No phone number published anywhere — **HIGH**
No public phone number was found on any page or listing. Email is the only channel.

For most nonprofits this is a minor conversion issue. For an organization whose audience
includes families in acute crisis, it is a safety design question. A parent whose kid is in
distress at 9pm does not want a contact form.

If a staffed phone line genuinely is not viable for an organization this size — a legitimate
constraint — then the site must at minimum surface crisis lines (988, Trevor Project, Trans
Lifeline) prominently, so nobody in an emergency lands on a page whose only option is "we
reply within two days."

### 6.2 Withholding meeting locations is correct — but the alternative path is weak — **MEDIUM/HIGH**
TFF deliberately does not publish meeting addresses. **This policy is right and should not
change.** It is a genuine safety control, not a marketing problem to be solved away.

The weakness is what replaces it. Today the answer is a bare "email info@tffmn.org," which
asks the most anxious person in the funnel to compose a cold email to a stranger with no
idea what happens next. The privacy policy and good conversion are not in conflict here —
they only look that way because the substitute path was never designed.

### 6.3 Donations are fragmented across three platforms — **HIGH**
Givebutter, GiveMN, and Benevity all carry TFF, with no single canonical `/donate` page
directing traffic. Every extra decision between "I want to give" and a completed gift costs
conversions, and split reporting makes it much harder to know what is actually working.

### 6.4 No quick-exit affordance — **MEDIUM/HIGH**
Standard practice for organizations serving people who may be browsing on a shared or
monitored device. Some of TFF's audience is a teenager researching on a family computer, or
a parent whose spouse is hostile to the whole subject.

---

## 7. What is working — do not break these

- **The privacy posture.** Not publishing locations is a correct, deliberate safety decision.
  Any redesign must preserve it.
- **The peer-led identity.** "Almost everyone who works or volunteers here is trans or
  parents someone who is" is a genuinely differentiated message. It is currently buried.
- **Real credibility.** Ten-plus years, seven communities, statewide reach, a decade of
  Day of the Transgender Child. Under-used on the site.
- **Third-party footprint.** GuideStar, GiveMN, Benevity and CauseIQ presence is solid and
  gives donors the verification they look for.

---

## 8. Priorities

| # | Action | Impact | Effort |
|---|---|---|---|
| 1 | Claim / audit / fully populate the Google Business Profile | High | Low |
| 2 | Correct GBP hours, categories, and service-area configuration | High | Low |
| 3 | Rewrite every title tag and meta description around real queries | High | Low |
| 4 | Add `NGO`, `FAQPage` and `ContactPoint` structured data | High | Low |
| 5 | Build seven city/region landing pages — no addresses published | High | Medium |
| 6 | Fix slugs, with 301s from every old URL | Medium | Low |
| 7 | Single canonical `/donate` path | High | Low |
| 8 | Design a real intake path to replace the bare mailto | High | Medium |
| 9 | Add quick exit + surface crisis lines site-wide | Medium/High | Low |
| 10 | Ethical review-generation programme (board, volunteers, alumni) | High | Medium |

Items 3, 4, 6, 7 and 9 are delivered in the rebuild in this repository.
Items 1, 2 and 10 require client dashboard access. Item 5 is scoped in the proposal.
