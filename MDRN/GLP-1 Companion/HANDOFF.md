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

## Imagery: COMPLETE

All 11 listing images are built and committed, every one 2000x2000.

| Set | Count | Files |
|---|---|---|
| Hero | 1 | `01_hero.png` |
| Feature slides | 7 | `04_slide.png` .. `10_slide.png` |
| Lifestyle | 3 | `14/15/16_lifestyle_*.png` |

**Phase 6 image gate: PASS** — 7 feature (min 7), 3 lifestyle (max 3), 11 total (min 10).

Every slide has a unique backdrop and a unique screenshot, per the no-duplication
rule. Each device screen is a real app screenshot perspective-warped into a
chroma-key green rectangle, so no UI text was ever drawn by an image model.
Residual-green check passes on all 11 (slide 05 retains 647 green pixels, which
are the real herbs in the scene at x1534-1711/y1343-1457, not a screen fringe).

Brightness spread: hero+lifestyle 1.30x, feature slides 1.29x — both inside the
1.5x consistency limit, so the set reads as one shoot.

Sources are kept out of git: `Etsy/source-photos/` and `Etsy/backdrops/` are
gitignored. Regenerate the composites at any time with:

```bash
cd "MDRN/GLP-1 Companion/Etsy"
python3 finish_imagery.py --sources ./source-photos   # hero + 3 lifestyle
python3 build_slides.py                               # 7 feature slides
```

Two bugs were found and fixed while doing this, both now guarded:

1. `finish_imagery.py` hard-coded a 1254px canvas, which would have downsized the
   2K masters and silently thrown the upscale away. Canvas is now 2000px with every
   geometry constant expressed as a fraction of it.
2. `find_green_quad` documented itself as using "the largest green-screen region"
   but actually fed every green pixel in the frame into the corner maths. The kitchen
   backdrop's herbs would have dragged a corner off the screen. Now filtered to the
   largest connected component — fixed in the shared skill, so every future planner
   benefits.

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
