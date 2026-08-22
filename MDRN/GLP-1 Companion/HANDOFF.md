# GLP-1 Companion Planner — build status and handoff

Branch: `claude/weight-loss-planner-habits-8zjn7w`
Last session: 2026-08-21

---

## Delivered and verified

| Phase | Deliverable | Where | Verified |
|---|---|---|---|
| 0 | Concept, 12 modules, Design Signature | — | Archetype: **Quiet Clinical**. Hanken Grotesk + IBM Plex Mono, near-square 2–4px corners, hairline borders and no card shadow, cool slate on cool grey, week-strip dashboard, dose-ring motif |
| 1 | Planner app | `HTML/glp1-companion-planner-v1.html` | No JS errors; no horizontal overflow in any of 12 sections at 375px; full encrypt/decrypt round-trip with zero plaintext leakage |
| 1 | Badge icon | `Icon/glp1-companion-icon.png` | Exactly 1024×1024, real transparency, 86% circle fill |
| 2 | Screenshots ×12 | `Etsy/screenshots/` | Palettes rotated across the set; all 12 slide-plan screens now captured |
| 4 | Etsy demo videos ×2 | `Etsy/video/` | 13.28s and 13.56s, 1280×920 — both under the 15s cap |
| 4b | Vertical social cut | `Etsy/video/glp1-companion-vertical.mp4` | 24.12s, 1080×1920 (exact 9:16) |
| 5 | Etsy listing copy | `Etsy/Etsy Listing Copy.txt` | Title 121 chars, keyword in first 32; exactly 13 tags, all ≤19 chars, zero repeated root words |
| 5b | Pinterest pins ×3 | `Pinterest/Pinterest Pin Copy.txt` | Titles 50–58 chars, descriptions 269–281 — all inside platform ranges |
| 5c | Getting Started Guide | `Getting Started/` | 7 pages, every page confirmed 8.50 × 11.00 in at 288 DPI |
| 6 | Distinctiveness gate | — | **Passes.** See below |

### Distinctiveness gate (re-run at Phase 6)

Scored against the three living siblings — Fortis Mindset Reset, Meal Prep, Renew 30-Day Reset:

| Axis | GLP-1 Companion | Siblings |
|---|---|---|
| Type pairing | Hanken Grotesk + **IBM Plex Mono** | Fraunces/Inter · Space Grotesk/Work Sans · Quicksand/Work Sans — none use a mono face |
| Corner radius | 2–4px (max 14) | 5–20px |
| Shadow depth | 2 declarations, `--card-shadow:none` | 9–12 declarations |
| Color temperature | cool slate #3E4C6D | Meal Prep warm sage #4A7C59 |
| Ground | cool near-white #F7F8FA | Meal Prep warm cream #F6F5EE |
| Layout skeleton | 7-day dose-anchored week strip + ring panel | 4-stat-card row |
| Motif | dose ring (circle + dot) | — |

Distinct on all seven axes.

---

## What is left: Phases 3 and 3b (imagery only)

Everything else is done. The blocker is **network access, not the connector and not credits.**

The four generated source photos are complete and paid for. The Higgsfield connector is
authorised and `show_generation_by_ids` returns `all_found: true`, `status: completed`
for all four. They just cannot be downloaded from inside a Claude Code Web session,
because the environment's network policy denies their CDN host:

```
connect_rejected  d8j0ntlcm91z4.cloudfront.net:443
```

Reachable from that environment: github.com, raw.githubusercontent.com, api.github.com,
s3.amazonaws.com, storage.googleapis.com, fonts.gstatic.com, package registries.
Everything else is denied — it is an allowlist, and network policy is fixed when the
environment is created.

**Do not regenerate these four. They exist.**

### Step 1 — get the four photos

Download these and put them in `MDRN/GLP-1 Companion/Etsy/source-photos/`
(that folder is gitignored — the sources do not belong in the repo):

Base: `https://d8j0ntlcm91z4.cloudfront.net/user_3FcBTDEZMCROpBK3unX0E1xh16T/`

| Save as | File |
|---|---|
| `1_hero_green.png` | `hf_20260821_210038_5d63076d-95e9-45d5-b431-3204069a7c7b.png` |
| `2_before.png` | `hf_20260821_210038_edb4df11-585d-4367-a531-f0f62b4de0bf.png` |
| `3_after.png` | `hf_20260821_210038_cbdd76da-21b3-4f2c-befc-ab1ecb9cfbdf.png` |
| `4_appointment.png` | `hf_20260821_210038_afa89a6c-c2bc-4ce5-ba62-40e6708c22af.png` |

All four are 1024×1024 PNG. Their mean brightnesses are 181.9 / 146.0 / 166.1 / 165.4 —
a 1.25× spread, inside the 1.5× consistency limit. The set is cohesive as generated.

### Step 2 — run the finisher

```bash
cd "MDRN/GLP-1 Companion/Etsy"
python3 finish_imagery.py --sources ./source-photos
```

Writes `01_hero.png`, `14_lifestyle_before.png`, `15_lifestyle_after.png`,
`16_lifestyle_appointment.png` at 1254×1254.

This script has been **tested end to end** against a synthetic green-screen fixture:
green-quad detection, the tilted perspective warp, Hanken Grotesk loading from Google
Fonts, the amber accent word, the drawn ring divider, the text floor and the brightness
check all confirmed working. The only untested variable is the real photography.

It fails loudly rather than shipping something wrong — if no green quad is found, or if
a headline would fall below the 70px floor, it stops.

If the hero's warped screenshot shows a green fringe or overhangs the bezel, pass a
safety inset — see the docstring in
`.claude/skills/niche-planner-builder/scripts/composite_greenscreen_mockup.py`.

### Step 3 — Phase 3b, the seven feature slides

`references/feature-slides.md` makes a photorealistic device mockup **mandatory** on every
feature slide, each with a **unique** backdrop scene. Flat CSS bezels are explicitly
deprecated for final listing images. So this needs seven more backdrop generations
(~11 credits; balance was 614 at last check).

Backdrop and screenshot assignment, decided up front per the no-duplication rule:

| Slide | Screenshot | Backdrop scene |
|---|---|---|
| 04 | `03_daily_log_signature.png` | pale desk, morning window light, glass of water |
| 05 | `05_how_it_sat.png` | kitchen counter, wooden board, herbs |
| 06 | `04_symptoms.png` | bedside table, evening lamp, dark palette on screen |
| 07 | `06_dose_log.png` | clean shelf, minimal, cool light |
| 08 | `12_strength.png` | gym bench corner, matte surfaces |
| 09 | `11_welcome_onboarding.png` | armchair side table, soft daylight |
| 10 | `10_mobile_dashboard.png` (phone) | café table, phone propped |

Slides 09 and 08 deliberately use the welcome screen and Strength rather than repeating a
module already shown — per the rule that running out of modules means using a genuinely
different *screen*, never a recolored repeat. `13_encrypted_backup.png` is held in
reserve as an eighth slide if one is wanted; it proves the encryption claim the listing
leans on.

Every backdrop prompt should specify the screen as **a perfectly flat, solid, evenly lit
bright chroma-key green rectangle, no glare, no reflections, no text**, and should keep the
same bright soft cool daylight and pale surfaces as the hero so the set reads as one shoot.
No hands — devices sitting on their own, per the device-mockup rule.

### Step 4 — close out Phase 6

Image-count gate: **≥7 feature, ≤3 lifestyle, 10 total.**
After steps 2 and 3 that lands at 1 hero + 7 feature slides + 3 lifestyle = 11. Passes.

---

## Decisions now settled from house precedent

| Item | Value | Source |
|---|---|---|
| License | "Licensed for single-user personal use." | House wording — `license` appears 24× across sibling listings, `licence` 0× |
| Refund | "As with all digital downloads, this item is non-refundable once the file has been downloaded." | Verbatim from the Renew listing |
| Price | **Premium** — $36 anchor / $28 Etsy sale / $21 web | `mdrn_pricing_strategy.md`; the ranking doc already assigned this planner Premium |

The three numbers in the ladder are **Etsy anchor / Etsy sale / website price** —
not three product tiers. An earlier draft of this listing had that wrong, and had
the tier wrong too (Flagship). Both are corrected, and `Etsy/Pricing.txt` now
records the per-listing detail per house convention.

Spelling was normalized to US English across every deliverable **including the app
itself** — the house line uses `color`/`license`/`organize` exclusively, and this
planner had been drafted in British spelling in 16 places (`Fibre` and
`prior-authorisation` were visible in the app's own UI).

## Still open

1. **One license edge case.** "Single-user personal use" is the house default and
   is what ships. This niche raises two cases the other planners do not: a couple
   or household where both people are on a GLP-1, and a health coach or dietitian
   using it with clients. The current wording excludes both. That may be exactly
   right — flagged only because it is likely to come up as a buyer question here
   first.

~~2. Brand-name search terms.~~ **Settled.** The owner confirmed directly: no
   brands of GLP-1 are to be named. Every reference is to the drug class. This is
   policy for this listing and any future copy in this niche — not a hedge to be
   revisited for search volume.

Separately, the Pinterest copy flags that every image in the set is square or
landscape, while Pinterest ranks 2:3 verticals (1000×1500). Re-crop before pinning,
or commission dedicated pin graphics. The 24s vertical video can be posted as an
Idea Pin as-is.
