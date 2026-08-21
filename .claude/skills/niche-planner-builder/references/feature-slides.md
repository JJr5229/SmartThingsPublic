# Feature Showcase Slides (FAQ, Palette Grid, Feature Icons, Value Comparison)

Beyond the hero image and lifestyle "before" photo (see `marketing-imagery.md`), a full Etsy image
set needs slides that walk a browsing buyer through *why this is software, not a form*: a palette
showcase, a feature-icon grid, an FAQ slide, and optionally a value/price-comparison slide. This is
a **standard deliverable for every niche build**, not an optional extra — treat it as Phase 3b,
immediately after the hero/lifestyle images.

## Why these are built the same way as the hero image

Every one of these slides is layout + real screenshots + short text — never a photo that also needs
to render UI or paragraphs of text. Do not ask an image-generation model to invent UI or render
paragraphs of text from scratch — it will mangle the text and the mockup won't show your actual UI.

## Photorealistic device mockup is MANDATORY for every slide — not just the hero

**This is a direct, confirmed user correction, not a style preference to weigh against cost.** On a
real build, the hero and one module slide used the photorealistic green-screen technique, but the
rest of the Phase 3b set (a feature-icon grid with no device mockup at all, other module slides using
a flat CSS bezel, an FAQ slide with a flat CSS phone bezel on a plain dark background) came back
looking, in the user's own words, "cheap" next to the hero — even though every slide shared the same
font, badge, and accent. The fix is not more polish on the flat version; it's using the same
photorealistic technique everywhere:

- **Every single slide in the Phase 3b set must show a real screenshot inside a photorealistic
  device mockup (laptop or phone) on a styled lifestyle backdrop** — the same green-screen + PIL
  composite technique from `marketing-imagery.md`'s hero section (generate a styled photographic
  scene with the screen as a flat chroma-key green rectangle, then perspective-warp the real
  screenshot into it with `scripts/composite_greenscreen_mockup.py`). This applies to the module
  slides, the feature-icon grid, the "works anywhere" slide, the "how it works" slide, and the FAQ
  slide — not just the hero and one "signature" slide.
- **There is no acceptable slide with icons/text floating on a plain flat-color background and no
  device mockup at all.** Every slide follows the same left-column-text + right-column-device-mockup
  composition as the reference set (see `marketing-imagery.md`'s reference-template section and the
  actual files at `MDRN/Wedding Planner/Etsy/ChatGPT Image *.png`) — pick whichever real screenshot
  best fits that slide's theme (e.g. the "works anywhere" slide can still mock in the Dashboard or
  whatever section reads well small; the FAQ slide mocks in a real mobile-viewport screenshot) and
  pair it with that slide's icon row / Q&A text / headline on the other side of the frame.
- **The flat CSS bezel below is deprecated for final delivered feature slides.** It still has a
  narrow legitimate use — a quick internal draft/preview before spending generation budget, or a
  genuinely low-budget build where the user has explicitly said to minimize generation cost over
  polish — but never ship it as one of the final Etsy listing images without saying so explicitly and
  getting confirmation first.
- **Neither the screenshot NOR the backdrop photo may repeat across slides — both need to be unique
  per slide.** An earlier version of this doc said the empty green-screen backdrop photo (the styled
  desk/lamp/props scene the device sits on) was fine and "encouraged" to reuse across every slide for
  cost and cohesion, with only the screenshot required to vary. **The user directly overruled this**
  after noticing that 8 different module slides all shared the literal same wooden-table/lamp/low-light
  backdrop photo — varying only the on-screen content wasn't enough; the repeated background itself
  read as duplicated imagery. Treat backdrop photos with the same one-shot-per-slide discipline as
  screenshots: generate a genuinely distinct styled scene for each slide that needs a device mockup
  (vary the desk/table styling, angle, prop arrangement, and framing — while keeping the same overall
  low-light/warm mood and color grade established by the hero, so the set still reads as cohesive, not
  mismatched). A shared backdrop is only acceptable within a single slide that legitimately needs to
  show the identical scene twice for a real reason (e.g. the palette-showcase slide's intentional
  same-screen-different-palette comparison) — never as a cost-saving default across the whole
  numbered feature-slide set. Also make sure the ACTUAL SCREENSHOT composited into each backdrop is
  different app content on every single slide; the user directly flagged it as a problem when a
  "works anywhere" slide and a dedicated module slide both showed the literal same Itinerary
  screenshot, and a feature-grid slide reused the same Dashboard screenshot as its own dedicated
  module slide. Plan BOTH the backdrop assignment and the screenshot assignment across the WHOLE
  slide set before generating or compositing anything: list every slide that needs a device mockup,
  decide a distinct backdrop scene and a distinct module/state for each, and only then start
  generating — don't generate one backdrop early and reuse it by default because it's already there.

  **This is an absolute rule with no fallback exception — the user has said so directly, twice.** An
  earlier version of this doc allowed "falling back to repeating a module, varied by palette" if the
  app had fewer modules than slides needing a screenshot; the user rejected that outright. If the
  app's primary modules run out before the slides do, use a genuinely different SCREEN of the app
  instead of a different palette/crop of an already-shown module — e.g. the welcome/onboarding
  screen, an "add item" modal/dialog (Add Guest, Add Event, Add Dare), a print-preview view, or the
  save/restore file-export flow. These are real, distinct screens most of these apps already have
  (see `architecture.md`) and none of them have appeared in any other slide, so they cost nothing in
  variety. Do not ship a slide whose screenshot is the same module already shown elsewhere, even at a
  different palette or cropped differently — that still reads as reused imagery to the user.

  **One confirmed exception: the hero image may show the same flagship module (typically Dashboard)
  that also gets its own dedicated numbered feature slide.** Checked directly with the user on a real
  build — hero showing Dashboard while `04_dashboard_mockup.png` also shows Dashboard was flagged
  during an audit, and the user's call was to leave it, since a hero leading with the flagship screen
  and a later slide explaining it in depth is standard, expected product-marketing practice, not the
  lazy reuse the no-duplication rule targets. This exception is narrow: it covers only the
  hero-vs-its-own-dedicated-slide pairing, and only for the flagship module. It does not extend to any
  pairing among the numbered feature slides themselves (04-13), and it's separate from the
  palette-showcase slide's intentional repeated screen (a deliberate same-screen-different-palette
  comparison, not a "duplicate" in the sense this rule is about).
- **Devices alone are sufficient — hands are not required in these device-mockup shots**, per direct
  user feedback. Default to the device sitting on its own (propped on a desk/stand) rather than held
  in a hand; this also sidesteps the hand/finger-artifact risk that photorealistic generation is most
  prone to. Hands are only worth including in the separate lifestyle/pain-point photos (see
  `marketing-imagery.md`), where a person is the actual subject of the shot — not in these
  device-and-screenshot feature slides.

The flat CSS bezel (kept below for the narrow draft/low-budget use case only):

```css
.phone { width: 320px; }
.phone-body {
  background: linear-gradient(160deg, #2b2b2b, #141414);
  border-radius: 46px; padding: 14px;
  box-shadow: 0 40px 80px rgba(60,20,20,0.24);
  position: relative;
}
.phone-notch { position:absolute; top:14px; left:50%; transform:translateX(-50%); width:110px; height:26px; background:#141414; border-radius:0 0 16px 16px; z-index:2; }
.phone-screen { border-radius:32px; overflow:hidden; aspect-ratio: 9/19.5; background:#fff; }
.phone-screen img { width:100%; height:100%; object-fit:cover; object-position:top; display:block; }
```

Crop the source screenshot to a narrower aspect before inserting (or just let `object-fit:cover`
handle it) — you don't need a separate "mobile" screenshot pass unless the app's mobile layout is
meaningfully different and you want to show that off specifically.

### Feature-icon grid

A 2x2 or 4-across grid of `{icon, label}` pairs — the fastest way to say "here's what you get"
without another paragraph of copy. Use simple inline SVG line icons (stroke-based, matching the
app's own accent color) or Unicode glyphs consistent with the app's chosen motif set (see
`architecture.md`'s Motifs section — reuse the SAME glyphs here that the app uses internally, don't
introduce a third icon language). Four features is the right number: enough to look substantial,
few enough to stay readable at thumbnail size in Etsy search results.

```css
.feature-grid { display:grid; grid-template-columns:1fr 1fr; gap:36px; }
.feature { text-align:center; }
.feature .icon-circle { width:74px; height:74px; border-radius:50%; background:var(--surface2); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; font-size:30px; color:var(--accent); }
.feature .label { font-family:'<display-font>', serif; font-size:19px; font-weight:600; color:var(--text); }
```

### Palette showcase grid

Screenshot the **same section** of the app once per palette (loop `switchPalette(name)` +
re-screenshot in your Playwright script — don't hand-tint one screenshot N times in an image editor,
the real render is more accurate and just as fast to automate). Arrange 3-over-2 or however many
palettes you have, each labeled with its real palette name. This is the single most convincing
"this is a real customizable app" slide — always include it.

```python
for name in PALETTE_NAMES:
    page.evaluate(f"switchPalette('{name}')")
    page.wait_for_timeout(150)
    page.locator("#sec-<some-section>").screenshot(path=f"palette_{name}.png")
```
Composite the resulting N screenshots into a grid in the same HTML-canvas approach as everything
else — each cell is just a small laptop/browser-chrome frame around the screenshot.

### FAQ / Q&A rows

Two to four Q&A pairs, each with a small icon or "Q"/"A" badge. Pick the questions from the
Etsy-copy "Good to Know" section (`etsy-copy.md`) you already wrote — this slide is a visual restate
of that FAQ, not new copy to invent:

```css
.qa-row { display:flex; gap:20px; padding:22px 0; border-bottom:1px solid var(--border); }
.qa-badge { width:44px; height:44px; border-radius:50%; background:var(--primary); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'<display-font>',serif; font-weight:700; flex-shrink:0; }
```

### Value / price-comparison slide (optional — needs a real price)

The "$19/month vs. $32 once" framing is effective but **requires the buyer's actual price and a
believable comparison figure** — never invent either. If the user hasn't given you a price for this
listing, skip this slide rather than guessing, and say so explicitly when you deliver the rest of
the set. If they have, this is the same laptop-mockup + icon-row technique as the others.

## Every slide needs a consistent brand header and real icon language

A slide set that's just a headline plus content, with no shared framing, reads as a set of one-off
fragments rather than a cohesive product ad — this was a real complaint after a first pass produced
slides with plenty of empty canvas and generic decorative glyphs standing in for actual information.
Two fixes, applied to every slide in the set:

1. **A repeated brand header at the top of every slide**, built from the brand identity kit (badge +
   wordmark) SKILL.md's Phase 0 has you define — don't invent a new badge design here. Reuse its
   exact markup/SVG, the same one already sitting in the app's own header and welcome screen, so the
   product and its own ads visually match. Follow the badge with the same headline/divider/subtitle
   composition described in `marketing-imagery.md`'s hero section. Reusing this exact header on every
   slide is what makes a 5-10 image set read as one coherent listing rather than five disconnected
   screenshots.
2. **Real, meaningful icons, not just the app's own decorative motif repeated.** The app's motif
   glyphs (e.g. a plane, a diamond) are right for the *divider* and small in-app accents, but a
   feature grid or a "how it works" slide needs icons that actually communicate the specific concept
   — a calendar for an itinerary feature, a pie chart for a budget feature, a lock for privacy, a
   download/send/upload arrow sequence for a save-and-restore workflow, a monitor/laptop/tablet/phone
   row for cross-device compatibility. Hand-write these as simple inline stroke-style SVGs (24x24
   viewBox, `stroke="white"`, `stroke-width="2"`, `stroke-linecap="round"`) sized inside the same
   gradient icon-circle used elsewhere — this is standard, low-risk SVG (rects, lines, simple paths)
   that renders reliably and needs no external asset. Avoid real browser/OS logos (Chrome, Safari,
   Windows, Apple) for a "works everywhere" slide — those are trademarked; use generic device-shape
   icons plus a plain-text line naming the actual browsers/platforms instead.

**Canvas is square (1:1), unconditionally** — see `marketing-imagery.md`'s reference-template section
(the user's confirmed quality-bar example set is uniformly 1254x1254 or 2048x2048, never landscape).
The user has stated this as a flat rule for every image in the set: "all images should be square" —
not a default to deviate from even when a slide's content feels sparse. Fit each slide's content to
the square frame (larger type/spacing for a sparse slide) rather than shrinking the canvas to a
landscape strip.

## One reusable decorative accent, generated once

The reference slide set reuses the same corner floral/botanical photo across every slide for visual
cohesion — that consistency reads as a matched set, not five one-off images. Generate **one**
decorative accent appropriate to the niche's aesthetic (soft botanical for a wedding/shower, could be
something else entirely for a graduation or milestone-birthday niche — pick what actually fits),
then run it through `remove_background` once to get a transparent PNG, and composite that same
cutout into the corner of every slide in the set via a plain `<img style="position:absolute">`. Don't
regenerate a fresh decorative photo per slide — it won't match, and it's wasted generation cost for
an element that's supposed to be a quiet, consistent accent, not a focal point.

**Get this specific accent approved before propagating it across the whole set — a wrong choice here
means re-touching every slide, not just one.** On a real build, a "2 dice + 3 fanned playing cards"
cutout was composited into the same corner of all 10 slides (04-13) as this niche's chosen accent,
and only after the full set shipped did the user say directly: "i do not like the cards and dice
icon... in the bottom left of each image" (it was actually bottom-right on every slide, but the point
stands — it read as clutter, not a subtle accent). Because the exact same cutout is pasted onto every
single slide, an unwanted accent choice is not a one-file fix — removing it means patching that same
corner region on every affected file. Cheaper to avoid than to fix: show the decorative-accent choice
to the user at the same Phase 3 hero/lifestyle checkpoint where the headline font and photo style are
already being approved, before it gets composited onto the full slide set. If it's already shipped and
gets rejected, patch each slide's accent-covered region using the clean (accent-free) version of that
slide's own background/base photo — don't just paint a flat rectangle over it, since the region needs
to keep matching the surrounding photo (wood grain, lighting gradient, etc).

## Standard slide set for every build

The image-set target (see SKILL.md) is 10 images total: at least 7 features, at most 3
lifestyle/pain-point. These slides plus the hero and the raw Phase 2 screenshots are all "feature"
images (no people) and count toward the 7-minimum together — the lifestyle/pain-point images from
`marketing-imagery.md` are the only ones that count against the separate 3-image lifestyle cap.

Unless the user asks for something different, produce this full set as Phase 3b, every slide
carrying the brand header described above AND a photorealistic device mockup with a real screenshot
(per the mandatory-mockup rule above — none of these are icons-on-flat-background slides):
1. Feature-icon grid ("Not a spreadsheet. An app." style) — feature image, real per-feature icons in
   the left/text column, a photorealistic laptop or phone mockup showing a real (e.g. Dashboard)
   screenshot on the other side — not icons alone on a flat background.
2. **"Works anywhere" slide** — a device-icon row (desktop/laptop/tablet/phone) plus a plain-text
   line naming compatible browsers, proving the product isn't locked to one platform, PLUS a
   photorealistic device mockup with a real screenshot alongside it. This is new information the
   rest of the set doesn't otherwise convey — don't skip it as redundant with the feature grid's
   "private & backed up" bullet, it's a distinct buyer question (device compatibility, not privacy).
3. **"How it works" slide** — a 3-step icon row for the app's actual save/restore (or equivalent
   core) workflow, with a dotted connector between steps, PLUS a photorealistic device mockup with a
   real screenshot. Also new information: the feature grid *names* the backup feature, this slide
   *shows how it's used*.
4. Palette showcase grid (all N palettes, same section) — feature image; this one is already a grid
   of small device-style frames per palette per the pattern below, which is the one place a lighter
   framing than a full photorealistic scene per cell is acceptable (confirmed working well by the
   user on a real build) — don't over-engineer this one into 5 separate full photorealistic scenes.
5. FAQ slide — feature image. Dock a **photorealistic** phone mockup (not the flat CSS bezel) holding
   a real mobile-viewport screenshot beside the Q&A list, on the same styled lifestyle backdrop as
   every other slide — a flat CSS phone bezel on a plain dark background was specifically called out
   as looking cheap on a real build; don't repeat that.
6. Value/price-comparison slide — feature image, **only if a real price is known**; otherwise skip
   and flag it. If built, same photorealistic-mockup treatment as the rest.

Combined with the hero image and raw Phase 2 screenshots (also features), this reaches 7 features
comfortably in most builds — the two new slides above mean it usually clears that bar without
needing extra raw screenshots, though add more if a particular build still falls short. The
lifestyle "before" photo (and any additional lifestyle images, up to the 3-image cap) are covered in
`marketing-imagery.md` and are tracked separately from this feature count.

Screenshot filenames should sort into a sensible Etsy image order (buyers see them in upload order):
`01_hero`, `02_dashboard`, `03_budget`, ... `0N_lifestyle`, `0N+1_features`, `0N+2_palettes`,
`0N+3_faq`. Keep the raw app screenshots (Phase 2) and these composited slides in the same output
folder so the full listing image set is in one place.
