---
name: niche-planner-builder
description: Builds a complete, sellable digital-product package for a single-file HTML life-event planner web app (wedding, baby shower, graduation, retirement, family reunion, quinceañera, bar/bat mitzvah, etc.) — the app itself, a planned feature shot list, marketing imagery (or a ChatGPT image-prompt document, per the Phase 3 checkpoint), Etsy demo videos, a vertical 25-second social/Shorts video, Etsy listing copy, Pinterest-ready pin copy, and a branded Getting Started Guide PDF — from just a niche name. Use this whenever the user wants to create a new planner app for a life event or milestone, wants to extend the MDRN Milestone Co. planner product line, mentions building "another one of these" planners, or asks for a new niche/theme variant of an existing planner app in this project. Also use it for any sub-task that's part of this pipeline even if asked in isolation — e.g. "take screenshots of this planner for the Etsy listing," "make a hero image for this," "record a demo video under 15 seconds," or "write the Etsy listing for this app" — since those map directly to steps in this skill's workflow and should follow its patterns rather than improvising from scratch.
---

# Niche Planner Builder

Turns a single word (the niche) into a full Etsy-ready digital product: a polished single-file
planner web app plus everything needed to sell it — marketing images, demo videos, and listing
copy. This captures a full working session's worth of hard-won lessons (mobile CSS bugs, AI-video
pitfalls, a real credit-loss incident) so you don't have to rediscover them.

**Core principle: minimal input, maximum inference — except the feature list.** The user should be
able to say "build a baby shower planner" and get a finished package without answering an essay's
worth of questions. But the module/feature list is the one thing worth a quick confirm before
building: propose your own inferred list (per Phase 0 below) as a starting point, then ask the user
to confirm it or name what to add/cut/rename before writing any code — a single short question, not
an open-ended prompt. This is a deliberate exception to "don't ask": a wrong guess here means
rebuilding real app structure later, and the user is the actual authority on what they need tracked
for their own trip/event. Everything else — palette names, brand tone, tagline, typography, shape
language — stays your call; only ask about those if something is genuinely ambiguous and would
change the output materially (e.g. target buyer if the niche spans very different audiences, or
price point if it affects copy).

## Workflow

Work through these phases in order. Each phase has a reference file with the deep technical
detail — read it when you reach that phase, don't front-load everything into context at once.

### Phase 0 — Define the product concept

From the niche name alone, decide:
- **Feature/module list.** Every planner needs a Dashboard (countdown + stat cards), a Budget
  Tracker, a Checklist, and a save/restore backup mechanism — those are universal. Beyond that,
  infer niche-specific modules the way a real planner for that event would need them (a wedding
  needs a Seating Chart; a baby shower needs a Registry Tracker instead; a graduation needs a
  Guest List but probably not a seating chart; a reunion might need a Lodging/Travel tracker).
  Don't just clone the wedding planner's exact module list onto a different niche — think about
  what someone planning *this specific* event actually needs to track. A validated example: the
  wedding planner's "Music" section (ceremony/reception song planning) became a baby shower
  planner's "Games & Activities" tracker (planned games, prize log, activity notes) — a genuinely
  different data model and UI, not a relabeled form. Its "Honeymoon" section (travel/flights/hotel)
  became "Thank You Notes" — a gift-and-note tracker that syncs from the guest list, addressing a
  real baby-shower-specific need that has no wedding-planner analog at all. Its "Packing List" had
  no baby-shower equivalent worth keeping and was removed outright, folded into the checklist
  instead. Also reconsider the *timescale*, not just the modules — the wedding checklist's 9 phases
  run in months (weddings are planned a year-plus out); a baby shower checklist should run in weeks
  (8 weeks out → day-of) since that matches how far out people actually plan one. Apply this same
  "would someone planning this actually need it, structured the way they'd actually use it" test to
  every module, not just the obviously wedding-specific ones.
  **Before writing any code, present this inferred module list to the user in one short message
  (e.g. a bulleted list of section names with a one-line reason each) and ask them to confirm it or
  tell you what to add, cut, or rename.** This is the one required question in an otherwise
  low-question workflow — see the Core Principle above for why.
- **Palette system.** 4-5 named palettes appropriate to the niche's aesthetic range (a baby shower
  might want softer pastels and a "gender-neutral" option; a milestone-birthday planner might want
  bolder, more festive options). See `references/architecture.md` for the CSS custom-property
  pattern — the *mechanism* is reusable, the actual colors are not.
- **Visual identity — typography, shape language, and motifs.** This is not optional and not the
  same thing as the palette. A known failure mode (this is not hypothetical — it happened on the
  first real run of this skill) is producing a planner that is visually *identical* to the wedding
  planner apart from swapped color hex values and relabeled text — same font pairing, same card
  corner-radius and shadow depth, same heart/diamond glyphs, just repainted. That is not "adjustable
  design system per niche," it's a skin — and it keeps happening *because the model has a strong
  default attractor* (tasteful high-contrast serif + humanist sans, cream background, one soft
  diagonal gradient, gently-rounded low-contrast cards, a gold accent). Telling yourself "be
  distinct" in the abstract loses to that attractor every single time — more adjectives don't help,
  because the problem isn't a lack of description, it's the absence of a forcing function. The only
  things that reliably work are a menu of far-apart starting points, a forced look at what already
  exists, and a distinctiveness check you can fail. Do all three, in order, before writing any CSS:

  1. **Survey the siblings first — you cannot diverge from what you never looked at.** Open 2-3
     *existing* planner apps in the product line (their `HTML/*.html`, or just their Etsy hero
     images) and write one line each capturing the design territory they already occupy: type
     pairing, corner/shadow feel, color temperature, layout skeleton, motif. This is the list of
     places you may NOT land again.
  2. **Pick a named aesthetic archetype from the menu in `references/architecture.md` ("Aesthetic
     archetypes") that no living sibling already occupies.** The menu exists precisely to hand you
     anchors that are far apart in design space, so "make it different" can't quietly collapse into a
     recolor of the same safe center. Choose the archetype whose emotional register fits the niche
     AND is still unclaimed — then customize it (don't treat the menu entry as a second default to
     copy verbatim). Declared **sibling** planners (e.g. Bachelor/Bachelorette, or an explicit
     "matching set") are the one exception: they may deliberately share an archetype. A genuinely
     new, unrelated niche may not reuse one a sibling already holds.
  3. **Express the chosen archetype as concrete values for EACH axis below — all of them, and make
     them your own, not the last build's:**
  - A **typographic voice** distinct from a default "elegant serif + clean sans" unless the niche
    genuinely calls for that exact mood. A graduation planner might want something bold and
    geometric-sans to feel achievement-forward rather than romantic. A kid's birthday planner might
    want a rounder, friendlier display face. A retirement planner might want a warm, classic
    (not necessarily italic-script) serif. See `references/architecture.md` Typography for concrete
    per-niche starting points.
  - A **shape language** — corner radius scale, shadow depth/softness, gradient angle and contrast —
    that matches the niche's emotional register. Soft, rounded, low-contrast pastel gradients read
    differently from sharp corners and high-contrast gradients; pick deliberately, don't inherit the
    wedding planner's specific values by default.
  - **Motifs and decorative glyphs.** The wedding planner uses hearts and diamonds throughout (hero
    background glyph, section icons). Carrying those into a baby shower or graduation planner
    unchanged is the same mistake as an unrenamed "Honeymoon" tab — pick glyphs that actually belong
    to the new niche (stars/clouds for a baby shower, a cap/tassel motif for graduation, etc.).
  - **Layout composition — this is a real gap found across multiple builds, not a hypothetical.**
    Typography, palette, and motifs alone were not enough: a build that changed all three still read
    as "almost a mirror image" of the wedding planner once real users compared them side by side,
    because every niche used the identical dashboard arrangement — countdown hero, then exactly 4
    stat cards in a row, then a 2x2 card grid, sidebar nav grouped the same way. Vary the actual
    composition per niche, not just its colors: the number and arrangement of dashboard stat cards
    (3 across vs. 4 vs. an asymmetric hero+2 layout), whether the primary hero is a countdown at all
    or something else the niche calls for more (a progress bar, a map-like visual, a stat headline),
    how nav groups are labeled and ordered, and whether every section uses the same card treatment or
    some sections warrant a genuinely different visual pattern (a timeline instead of a grid, a board
    instead of a list). Sketch the dashboard's specific composition as part of Phase 0, the same way
    you sketch the module list — don't let it default to copying the last build's arrangement.
  - **Color temperature & saturation — not just hue.** The convergence trap is that every build keeps
    the *same* low-saturation, warm, cream-and-one-gradient recipe and only rotates the hue. Set this
    axis deliberately: warm vs. cool, muted vs. saturated, tonal (one family) vs. contrasting
    (complementary), light-ground vs. dark-ground. Two planners can both be "green" and still look
    like different products if one is a muted warm sage on cream and the other a saturated cool
    emerald on charcoal.
  - **Background & texture.** Cream flat fill is the default that makes everything look like the same
    product. The archetype should decide this too: flat off-white, a subtle paper/linen grain, a soft
    tonal gradient field, color-blocked bands, a dark ground, or a faint motif watermark. This one
    change does more to break the "same product" read than any single font swap.
  - **Information density & rhythm.** Airy-and-spacious vs. dense-and-utilitarian is a real identity
    axis, not just a size setting — a calm nursery planner and a technical gradebook should not have
    the same row heights, card padding, and type scale. Pick a density that matches the archetype.
  What *should* carry over unchanged is the underlying mechanism, not its visible shape: single-file
  structure, the CSS-custom-property palette-switching approach, the save/restore backup workflow,
  and the general principle that a dashboard should show live gradient-card stats rather than a plain
  table (a real differentiator vs. a spreadsheet look, worth keeping as a *concept*). The specific
  typefaces, corner radii, shadow values, iconography, and dashboard composition that express that
  concept should not carry over by default — that's *this* niche's job to define fresh.

  **Commit the choice as a one-line "Design Signature" and fold it into the same Phase 0 confirmation
  message as the module list.** Write it out concretely — archetype name + the specific
  type / corner-and-shadow / color-temperature-and-ground / layout-skeleton / motif choices, e.g.
  *"Archetype: Technical Utility — IBM Plex Mono + Inter, square 3px cards with hairline borders (no
  shadow), near-monochrome slate on off-white with one signal-amber accent, dense table-forward
  dashboard, plus/tick grid motif."* Making it an explicit, reviewable line up front (alongside the
  modules the user already confirms) is what stops the identity from quietly drifting back to the
  default while you're heads-down writing CSS — and it lets the user redirect it in the same breath.
  A build that reaches Phase 1 without a written Design Signature has almost certainly defaulted.

  **Then make distinctiveness a gate you can actually fail — check it at the Phase 1 build-check and
  again at Phase 6.** Put the new dashboard screenshot side by side with a sibling's and score them
  on the concrete axes: type pairing, corner radius, shadow depth, color temperature, background/
  ground, layout skeleton, motif. If they match on most of those — i.e. they'd read as "the same
  product recolored" to someone seeing them next to each other — that is a **failed** gate: go back
  and change real structure (ground, skeleton, type class, shape language), not one more hex value.
  Convergence that nobody checks for is convergence that ships; this is the check.
- **Brand name and tagline.** Reuse the "MDRN Milestone Co." house brand (matches the sibling
  files already in this product line — `Digital tools for life's next big step.`) unless the user
  asks for something else.
- **Per-niche brand identity kit — define once, reuse literally everywhere.** Beyond the house
  brand above, each niche product needs its own small, consistent mark: a **badge** (a circular
  icon-in-gradient using the niche's own accent glyph, e.g. a plane for a vacation planner, sized
  small for UI chrome and larger for a hero moment) plus a **wordmark lockup** (the product name in
  letter-spaced caps, set in the niche's own display font, placed next to the badge). Design this as
  part of Phase 0, then use the *exact same* badge markup/SVG in five places without redesigning it
  each time: the app's header, the app's welcome screen, the brand-header row of every Phase 3b
  marketing slide, the cover and every interior page of the Phase 5c Getting Started Guide, and (as
  a plain-text mention) the product name as it appears in the Etsy/Pinterest copy. This was a real
  gap found after a first build — the marketing slides invented a badge+wordmark treatment that the
  app itself never used, so the finished product and its own ads didn't visually match. Retrofit is
  expensive; defining the kit in Phase 0 and threading it through every later phase is not.
  Separately from this per-niche mark, the app's **welcome screen also leads with the shared MDRN
  house wordmark** (embedded as a base64 data URI so the file stays single-file), sitting above the
  per-niche badge and product title — see `references/architecture.md` ("Welcome-screen MDRN logo")
  for the exact asset, embed technique, and CSS.
  **Design the badge glyph itself as part of a collection, not just its container.** Matching circles
  across niches isn't enough if the glyphs inside vary wildly in scale and treatment — a real gap
  found once several niches had already shipped side by side. See `references/architecture.md`
  ("Badge icon design spec") for the concrete rules (single centered glyph never a scattered
  composition, ~50% icon-to-badge diameter ratio for vector icons but 60-65% font-size for text
  glyphs like "$", flat single-color rendering, no decorative rings) and apply them from the first
  draft of the badge, not as a later cleanup pass. Once the badge is finalized, export it as a
  transparent PNG to the niche's `Icon/` folder using `scripts/extract_badge_icon.py` (see that file's
  docstring — screenshotting the badge in place inside the app does not reliably yield real
  transparency; the script works around a headless-Chromium isolation quirk).
- **Feature shot list — plan every module's imagery before touching a camera.** For each module in
  the confirmed list, decide in one line: is this screenshot-worthy (visually distinctive, proves
  "not a spreadsheet"), and if so, what sample state/data best shows it off (a live chart with real
  numbers, a populated multi-day list, a card grid with a realistic mix of statuses — never an empty
  state). Then name exactly **one module as the signature feature** — the one with genuine depth or
  a novel interaction (a multi-step builder, drag-and-drop, a live-updating chart) — because that
  single choice drives three later decisions at once: which module gets the deepest beat in the
  Phase 4 demo video, which module gets its own numbered deep-dive page in the Phase 5c Getting
  Started Guide, and which raw screenshot gets priority placement in the Phase 2 image set. Deciding
  this once in Phase 0 replaces three separate ad-hoc judgment calls later with one planned choice
  applied consistently.
- **Target buyer and tone.** Infer from the niche (a wedding planner's buyer is usually the couple
  or a friend/family member helping; a baby shower planner's buyer is often the host, not the
  parent). Keep the tone editorial/elegant to match the house style unless the niche calls for
  something else (e.g. a kid's birthday planner probably wants a more playful voice) — and let that
  tone decision actually inform the visual identity above, not just the copy.
- **Data sensitivity & backup encryption — a required question whenever the niche's modules would
  plausibly hold real financial, medical, legal, or account/password information** (a legacy binder,
  a funeral/estate planner, anything with an accounts-and-passwords or medical-history module — not
  a wedding budget or a birthday guest list, where the stakes of a leaked backup file are low). For
  these niches, ask in the same Phase 0 confirmation message whether Save/Restore backups should
  require a passphrase, alongside a one-line explanation: *"Backups download as a plain file today —
  I can make them passphrase-encrypted (AES-256, browser-native, no server) so a lost or shared
  backup file is unreadable without it. Want this?"* Default the recommendation to **yes** for
  sensitive-data niches (pre-select it as the suggested option) but let the user decline — some
  buyers may prefer the simplicity of a plain file for a lower-stakes niche even if one of its
  modules technically qualifies. For niches with no sensitive modules, don't ask at all; plain
  Save/Restore per `architecture.md`'s standard pattern is the right default. If the user confirms
  encryption, implement the passphrase-protected Save/Restore pattern in `architecture.md` (built and
  validated on the Legacy Binder) rather than re-deriving a scheme from scratch.

Beyond the required module-list confirmation above, if anything else here feels genuinely ambiguous
(not just "one of several reasonable choices" — those you should just pick), fold it into the same
confirmation message rather than a separate round-trip. Once the user confirms the module list (or
doesn't respond with changes), proceed.

### Phase 1 — Build the app

**Give the niche its own top-level folder before writing anything.** Each niche is a distinct
product and gets its own folder directly under the product line root (e.g. `MDRN/Baby Shower/`,
sibling to `MDRN/Wedding Planner/`) — never build a new niche's files inside an existing niche's
folder, even if that's where the conversation happens to be working. Mirror the established
sub-structure inside that folder:
- `HTML/` — the planner app file(s) (`<niche>-planner-v1.html`, etc.)
- `Etsy/` — every marketing/listing asset from Phases 2-5 (screenshots, hero image, lifestyle
  photo, feature-slides set, demo video, Etsy listing copy) — all of it, in one place, not
  scattered across temp locations or left in another niche's folder
- `Pinterest/` — Pinterest pin copy from Phase 5b, kept separate from the Etsy listing text since
  it's a distinct deliverable with its own format
- `Getting Started/` — the Phase 5c Getting Started Guide PDF plus the plain-text Feature List its
  "What's Inside" section is built from, kept separate from `Etsy/` since it's a buyer-facing
  onboarding document, not a listing/marketing asset
- `Icon/` — the per-niche circular badge exported as a standalone transparent PNG
  (`<niche>-icon.png`), per the brand identity kit spec in Phase 0
Check the product line root for how existing niches are laid out (e.g. `Wedding Planner/HTML` +
`Wedding Planner/Etsy`) and match it exactly, including a `.claude/launch.json` static-server
config copied into the new `HTML/` folder so the app can be previewed from its own location.

**Once an app has been delivered, a later update never overwrites its file in place — it ships as
a new, higher-numbered version file instead.** `<niche>-planner-v1.html` stays exactly as it was;
a feature addition, security change, redesign, or bug fix made after delivery goes into
`<niche>-planner-v2.html` (then `v3`, `v4`, ...), sitting alongside the earlier version(s) in the
same `HTML/` folder rather than replacing them. This is a direct, standing user preference — "for
ease of viewing," i.e. being able to open two versions side by side or roll back to an older one —
and it matches the versioning convention already visible across this product line (e.g. the Baby
Shower and Family Reunion planners both have `v1`/`v2`/`v3` files, Wellness Reset runs to `v12`).
After bumping the version:
- Update every reference to the old filename in that niche's other deliverables — most often the
  Getting Started Guide's "double-click `<niche>-planner-v1.html`" line — so buyer-facing copy
  never points at a stale filename.
- Re-run the mobile-overflow and skip-path verification from this phase's build-check section
  against the *new* file, not just the old one — a version bump is exactly the kind of change that
  can introduce a fresh regression.
- Don't re-shoot marketing assets (screenshots, videos) just because the version number changed —
  only re-shoot the specific sections whose *visuals* actually changed, per the existing
  re-record-after-visual-change guidance in `references/demo-videos.md`.
This rule is about **post-delivery updates only**. While actively building the very first version
in this same session (before it's been delivered), keep iterating on `v1` directly — don't bump the
version number for every edit made before the app has actually shipped once.

Read `references/architecture.md` for the full HTML/CSS/JS pattern (single-file structure, the
`APP` global state object, the palette-switcher mechanism, save/restore, print views).

**Bake in mobile-responsive CSS from the start** — don't write it, ship it, and fix it later.
`references/mobile-responsive.md` lists the specific anti-patterns that caused real bugs last time
(stat-grid overflow, two-column layouts breaking on narrow screens, un-wrapped toolbars, fixed-width
sidebars) and the fix for each. Apply these preemptively while writing the CSS.

**Then verify it.** After the app is built, drive a real browser at a 375px-wide viewport and check
`document.body.scrollWidth <= window.innerWidth` across every single section/page of the app — not
just the ones you think might be risky. This is fast (a short Playwright loop) and catches overflow
bugs that are easy to miss by eye. See `references/mobile-responsive.md` for the verification
script pattern.

**Also verify the skip path has a permanent home.** Drive the "I'll fill in details later"
(`skipWelcome()`) flow and confirm the details the buyer skipped live in a **dedicated, always-present
sidebar section** (a "Details"/"Our Wedding"/"Service Details" page with an auto-saving form covering
every welcome field), carrying a subtle incomplete-indicator dot that clears once the key fields are
set — NOT a dismissable reminder bar across the dashboard, which reads as nag-ware. The welcome screen
never comes back after launch, so a permanent settings-style home is the right model. See
`references/architecture.md` ("Build check — the skip path must have a permanent home").

**Also run the distinctiveness gate (per Phase 0's Design Signature step).** Screenshot the finished
dashboard and place it beside a sibling planner's dashboard. Score them on type pairing, corner
radius, shadow depth, color temperature, background/ground, layout skeleton, and motif. If they'd
read as "the same product recolored" — matching on most of those axes — the gate has **failed**: this
is the cheapest moment to change real structure (swap the ground, the card treatment, the type class,
the layout skeleton), before marketing assets are shot against a look that's about to change. A build
that sailed through function checks but looks like its siblings is not done.

### Image set target: 10 images minimum, always — at least 7 features, up to 3 lifestyle/pain-point

**This is a standing requirement for every niche build, confirmed directly by the user — not a
default that can be quietly undershot.** Every planner this skill produces ships with **at least 10
images**, split:
- **At least 7 "feature" images** — anything that shows the product itself (a screenshot, a device
  mockup, an icon/benefit grid, a palette comparison, an FAQ slide). No people required in these.
- **Up to 3 "lifestyle" or "pain-point" images** — photos of a person or people, either
  overwhelmed by the old way of doing this (pain-point) or genuinely using/enjoying the finished
  plan (lifestyle). These are the only images where people appear.

If a build ends up with more than 10 total, that's fine — 10 is a floor for feature coverage and a
ceiling for lifestyle images, not a hard total cap. Never cut into the 7-feature minimum to make
room for more lifestyle images; the product itself is what sells this, the lifestyle shots are
supporting color. Count the final set explicitly at Phase 6 before delivering — don't assume it
cleared 10 just because a lot of generation happened.

**Every image in the Etsy image set is square (1:1) — this is an unconditional rule, not a default to
weigh against other options.** The user has said this explicitly and directly: "all images should be
square." It applies to the hero image, every lifestyle/pain-point photo, and every Phase 3b feature
slide, across every niche, with no "unless it genuinely calls for something else" exception — that
hedge existed in an earlier version of this doc and was overridden by the user's explicit correction.
The one deliberate exception is Pinterest pins, which are their own separate deliverable and are
supposed to be vertical 2:3 instead (see `references/pinterest-copy.md`) — don't confuse the two.
Raw Phase 2 app screenshots are native-viewport landscape and are NOT square on their own — they are
source material to be composited into a square frame (a device mockup, per `feature-slides.md`)
before they count as a finished image in the delivered set; don't ship a bare landscape screenshot
as one of the 10 listing images.

### Phase 2 — Populate sample data and take screenshots

Marketing assets need the app to look *alive*, never empty. Read `references/screenshots.md` for
the Playwright-based screenshot pattern: populate `APP.*` with realistic, fully-filled-in sample
data via `page.evaluate()`, call the app's own render functions, then screenshot at a real fixed
viewport (not the built-in preview tool, which has a confirmed scaling bug at custom desktop
widths). `scripts/screenshot_app.py` is a ready-to-adapt template — change the sample data and
selectors for the new niche's modules, keep the capture logic as-is.

Capture the modules your Phase 0 shot list marked as screenshot-worthy, using the sample state you
already decided on there — don't re-judge this in the moment. These raw screenshots count toward the
7-feature minimum alongside the hero/feature-grid/palette-grid/FAQ images from Phases 3 and 3b, so
the exact number to capture here depends on how many of those you're also producing (see the count
target above). For a wedding planner that was Budget + Guest List + Seating. The shot list's
signature-feature pick should be among these, captured with your richest sample data — it's about to
be reused as the priority image, the Phase 4 video's main beat, and the Phase 5c guide's deep-dive
subject.

**Rotate through the available palettes across these screenshots — don't capture every module in the
same single default palette.** Call `switchPalette(name)` before each module's capture and vary which
named palette is active from screenshot to screenshot (e.g. Dashboard in the default palette, Guest
List in a second palette, Budget in a third). This is in addition to — not a replacement for — the
dedicated palette-showcase grid in Phase 3b (which screenshots one section across *all* palettes
side-by-side); the point here is that the feature screenshots used throughout the rest of the image
set should themselves organically demonstrate the palette range, rather than every non-showcase image
in the listing looking like a single-color-scheme product.

### Phase 3 — Marketing imagery

**CHECKPOINT — ask before generating any AI image. The default is a prompt document, not
generation.** This is a direct, standing user instruction: do NOT start Higgsfield (or any other
AI image) generation for this phase on your own initiative. At the start of Phase 3, ask the user
one short question with two options:

1. **Prompt document (the default)** — produce the shot list as **BOTH**
   `Etsy/ChatGPT Image Prompts - <Niche>.md` **and** `Etsy/ChatGPT Image Prompts - <Niche>.txt`
   (same content, two formats), each led with a short **"How to use this"** header spelling out the
   step-by-step workflow (upload screenshot X → paste prompt → save result). The dual format and the
   usage header are required, not optional: on a real build the user opened the `.md` alone and asked
   "what am I supposed to do with this file?" — a plain-text copy that opens in any editor plus
   explicit instructions is the fix. The document contains a copy-paste-ready ChatGPT
   image-generation prompt for **every AI-photo shot the build calls for** — the hero scene, every
   lifestyle/pain-point photo, any device-mockup backdrop the Phase 3b slides need, and the
   reusable decorative accent — **plus, for each shot, the exact accompanying text** (headline,
   divider description, and the feature-list subtitle naming real module names) written out
   separately so the user can verify it or composite it themselves. Each entry states the shot's
   name and purpose, that the canvas is square 1:1, the full prompt (with the overlay text embedded
   as exact quoted strings, since ChatGPT renders quoted text well), and the accompanying-text
   block. Preserve in the prompts everything the generation path would have enforced: the
   demographic-diversity requirement across lifestyle shots, the before/after character continuity
   rule, the consistent lighting/mood rule, and the green-screen-display option for device mockups
   (so a real screenshot can still be composited in afterward).
2. **Automated generation** — the user sometimes wants this; if they pick it, follow
   `references/marketing-imagery.md` exactly as before (Higgsfield `nano_banana_2`, green-screen
   composites, the show-and-pause checkpoint below).

In prompt-document mode: deliver the document, then continue the pipeline with everything that
does not depend on AI photos — Phase 2 screenshots, any Phase 3b slides buildable from pure
HTML/CSS + real screenshots (palette grid, FAQ slide, icon grid), Phases 4-5c. If the user later
supplies their ChatGPT-generated images, composite the real screenshots and text onto them using
the standard techniques and fold them into the image set. Real Playwright screenshots (Phase 2)
and screen-capture videos (Phases 4/4b) are NOT affected by this checkpoint — those are always
produced; only AI *photo generation* is gated here.

Read `references/marketing-imagery.md` for two distinct techniques:

1. **Hero image** (device mockup + styled photo + bold headline) — counts as a feature image.
   Generate the scene (or source an existing photo) first, then composite the headline as a
   *separate* step — never rely on an image model to render both a photo and crisp text in one
   shot. Prefer the green-screen + real-screenshot composite technique in that file for the device
   mockup; `scripts/composite_headline.py` has the gradient-reconstruction + text-overlay code for
   cases where you're only swapping a headline on an existing image instead.
   **The headline is not just a bold line of text — it's a small composed block:** headline, then a
   thin decorative divider (a drawn shape, not a Unicode dingbat glyph — see the pitfall below), then
   a smaller feature-list subtitle line naming 4-6 real module names (e.g. "Itinerary · Budget ·
   Bookings · Bucket List · Packing List"). A bare headline with no supporting subtitle reads as
   plain/generic and tells a browsing buyer nothing about what's actually in the product — this was a
   real complaint after the first pass at a build skipped the subtitle, and adding it (matching the
   pattern the wedding planner's reference images already used) was the fix. Don't skip this even
   though it's an extra compositing step.
   **Pitfall:** if the divider uses a Unicode dingbat character (e.g. ❖) rendered via the same
   headline font file, confirm that glyph actually exists in that font's charset before shipping — a
   missing glyph renders as a visible "tofu" placeholder box, not blank space. Space Grotesk Bold's
   downloaded TTF hit exactly this. Safer default: draw the divider as real PIL shapes (a thin
   rectangle, a small rotated-square diamond) instead of depending on a font's dingbat coverage.
2. **Lifestyle/pain-point photo(s)** — up to 3 total across the whole set, and the only place people
   appear. At least one should be the "before" pain-point (someone overwhelmed by the old way of
   doing this — a spreadsheet, a paper list, a group chat); additional ones can show genuine
   after-the-fact enjoyment of the event, or a second angle on the pain point. **If a person's face
   is shown, deliberately vary who's depicted across the set** — race/ethnicity, age, gender, body
   type — rather than letting every generation default to the same look, which is a real bias in
   image models when prompts don't specify. State the demographic explicitly in each prompt, and
   make sure the choices differ from image to image within the same build. Hands-only/face-turned-
   away framing (see the reference file) remains a valid, lower-risk option when a face isn't
   needed for the shot; diversity still applies to visible skin tone across images if you use it.
   Add a headline with a gradient scrim using the same compositing approach as the hero, but **scan
   the actual photo for a safe text zone programmatically** (find where the busy foreground subject
   starts) rather than eyeballing it — see the reference file for why this matters and how to do it
   reliably.

**Checkpoint (automated-generation mode only) — show the hero and lifestyle images before
continuing.** These are AI-generated
photos plus a composited text layer, and both the photo generation and the text treatment are places
taste can miss even when nothing is technically broken. Send the hero and every lifestyle/pain-point
image to the user and pause for explicit approval (or corrections) before spending more generation
budget on Phase 3b's feature slides, which reuse the same decorative accent and visual language —
better to catch a polish problem here than propagate it across the whole set. If the user wants to
supply or finish these images themselves instead of continuing the automated generation, that's a
reasonable call for them to make at this checkpoint; don't treat it as a fallback to avoid, just
adapt (skip straight to Phase 3b using their images, or stop here if they'll handle 3b too).

### Phase 3b — Feature showcase slides

Produce enough of these to reach the 7-feature minimum together with the hero and any raw
screenshots from Phase 2 — read `references/feature-slides.md`. The standard set: a feature-icon
grid ("not a spreadsheet, an app"), a palette showcase grid (the same section screenshotted once
per palette), and an FAQ slide restating the Etsy "Good to Know" Q&As visually. All of these use the
same techniques as the hero image — plain HTML/CSS with real screenshots dropped in (rendered via
Playwright), or the green-screen + real-screenshot composite for a photorealistic device mockup —
never an image model asked to render UI or paragraphs of text from scratch. Generate one reusable
decorative accent image (background removed via `remove_background`) and reuse it across the whole
slide set for a cohesive look, rather than a fresh generation per slide. A value/price-comparison
slide is part of the standard set only if the user has given you a real price to compare against —
skip it and flag the gap otherwise, don't invent a price.

### Phase 4 — Demo videos

Read `references/demo-videos.md`. **Default to real Playwright screen-capture, not AI-generated
video** — this is a strong preference, not a minor style note; AI video reliably under-delivers here
(reads as "panning a static image," doesn't prove the product works, and one specific AI pipeline
lost real money on a failed generation last time).

**Produce exactly 2 videos per planner, each targeting the full 15-second Etsy cap.** Both videos
open the same confirmed way: the welcome/onboarding screen, genuinely filled out with real typed
input (event name, date, location, etc.), then a real submit/continue transition into the Dashboard
— do not skip or hide the welcome screen. After that opening, both videos must also show the color
palettes cycling via real, cursor-visible swatch clicks (2-3 palette swaps if time allows). Fill the
remaining time in each video with a genuine interaction that fits — center at least one of the two on
the Phase 0 shot list's signature feature (don't pick a different module here than the one already
anchoring the screenshot set and the guide's deep-dive page); the other can showcase a different
module's live-updating field, a search/filter box narrowing a list, or a real drag-and-drop. Every
interaction must be a real `.click()`/`.type()`, never a silent `page.evaluate()` state change.
`scripts/record_demo.py` has the full working pattern including the synthetic cursor/click-ripple
helpers and the timing/duration-budgeting approach for Etsy's 15-second cap.

**Re-record after any later visual change to the sections the video shows.** A video is a snapshot
of specific UI at the moment it was captured — a dashboard redesign, a palette-color change, or a
copy edit to any screen the video visits makes it stale even though nothing about the video's own
code is wrong. Check which sections a given change touches against what the current video actually
shows before assuming it's still accurate.

If the user specifically asks for AI-generated video, that's fine to do — just check `get_cost`
before spending credits and don't blindly retry a failed generation (see the credit-safety note in
the reference file).

### Phase 4b — Vertical short-form video (Shorts / Instagram Reels / TikTok)

In addition to the two Etsy videos, every planner gets **one vertical 9:16 video, 25 seconds long**
(target ~24-25s, verified with ffprobe — this is a social asset, NOT bound by Etsy's 15-second
cap), touring the app's core or most unique features.

**CHECKPOINT — required question before designing this video.** This is a direct, standing user
instruction, same weight as the Phase 0 module-list confirmation: before storyboarding or
recording anything, ask the user **which features they want included** in the vertical video.
Propose a candidate lineup as a starting point (the Phase 0 signature feature plus the 2-3 modules
most unique to this niche — the things a spreadsheet can't do), and let them confirm, swap, or
reorder. Don't design the beat sequence until they've answered. When other checkpoints are being
asked around the same time (e.g. the Phase 3 prompt-doc-vs-generation question), fold this into
the same message rather than a separate round-trip.

Production notes (details in `references/demo-videos.md`, "Vertical short-form video"):
- Same real-interaction discipline as Phase 4: real `.click()`/`.type()` with visible per-character
  typing, the synthetic cursor and click ripple, fonts awaited before recording. Never a silent
  `page.evaluate()` state change on camera.
- Record at a true vertical viewport (1080x1920, or a mobile-width viewport scaled to it) — the
  app's mobile-responsive layout is what belongs in a vertical frame, not a cropped desktop view.
- Structure: open on an **alive, pre-seeded dashboard** (populate the app's `localStorage` via
  `context.add_init_script` *before* recording so frame one shows a full streak/chart, not an empty
  Day-1 state — the fill-out that would otherwise build that state is skipped here), lead with a 1-2s
  motion hook (a real palette recolor), then 3-4 feature beats of ~5-6s each covering exactly the
  features the user picked, and end on a **payoff dashboard end-card** whose stats/chart visibly
  reflect the interactions just shown. Not the full Etsy-style fill-out opening — social viewers
  scroll away during slow intros. See `references/demo-videos.md` "Pacing & structure" for the detail.
- Save it alongside the other videos in `Etsy/` unless the user asks for a separate social folder,
  and name it so the format is obvious (e.g. `<niche>-vertical-25s.mp4`).
- Re-record it after any later visual change to sections it shows, same as the Phase 4 videos.

### Phase 5 — Etsy listing copy

Read `references/etsy-copy.md`. Same structural discipline as the shop's physical-product listings
(front-loaded title, 13 distinct tags, structured description) but with the physical-product
sections (materials, care, size/quantity/stacking) swapped for digital-product equivalents (how it
works, what's included as a download, no-account/local-data messaging, digital refund policy).

### Phase 5b — Pinterest-ready pin copy

Read `references/pinterest-copy.md`. This is a distinct, shorter deliverable from the Etsy listing
copy, not a trimmed-down copy-paste of it — Pinterest is a discovery/search platform with its own
title-length, description-length, and hashtag conventions. Produce 2-3 pins, each angled at a
different buyer motivation (overview, a standout feature, gift-giving), reusing the feature list and
buyer framing already established in Phase 5 rather than re-deriving it. Flag the vertical-image
gap explicitly (Pinterest favors 2:3 images; this skill's images are 4:3) rather than silently
recommending a landscape image with no caveat.

### Phase 5c — Getting Started Guide PDF

Read `references/getting-started-guide.md`. Every planner ships with a short, branded onboarding PDF
that a buyer opens right after purchase — a cover page plus 5 numbered sections (Getting Started
steps, What's Inside, a deep-dive on the Phase 0 signature feature, Saving/Restoring/Sharing, and
FAQ), built as HTML/CSS pages rendered to images and assembled into one PDF, using the exact same
brand identity kit badge/wordmark as everything else. Content is adapted from — not copy-pasted
from — the Etsy copy and Feature List already written in Phase 5; this phase is a restyle-and-
reformat of material you've already produced, not new research. Save both the PDF and the plain-text
Feature List it's built from to `Getting Started/`.

### Phase 6 — Deliver

Before summarizing, run the **distinctiveness gate one final time** (per Phase 0 / the Phase 1
build-check): the delivered dashboard, beside a sibling's, must diverge on most of the concrete axes
(type, corners, shadow, color temperature, ground, layout skeleton, motif) — not just hue. If it
still reads as "the same product recolored," say so plainly in the delivery summary rather than
shipping silently, and name what would need to change. A build is not done just because it functions.

Then check the image set against the count target: at least 7 feature images, at
most 3 lifestyle/pain-point images, 10 total. If a person appears in more than one lifestyle image,
confirm they're visibly different people (not the same demographic repeated) before delivering —
this is a real check to make, not just a reminder to hold in mind while generating. Also confirm the
Phase 5c Getting Started Guide PDF and its Feature List exist in `Getting Started/`, that all three
videos exist (the two 15s Etsy videos plus the Phase 4b 25s vertical video), that the badge icon PNG
exists in `Icon/` and follows the design spec (single centered glyph, ~50% ratio, no rings — see
`references/architecture.md`), and — if the build ran
in prompt-document mode — that `Etsy/ChatGPT Image Prompts - <Niche>.md` exists and covers every
AI-photo shot with its accompanying text. In prompt-document mode the 10-image count target is
evaluated against feature images buildable without AI photos plus the documented prompts; note in
the delivery summary which images are pending the user's own generation.

Summarize what was built and where every file landed — anchor this to the niche's own folder
(`MDRN/<Niche>/HTML/`, `MDRN/<Niche>/Etsy/`, `MDRN/<Niche>/Pinterest/`,
`MDRN/<Niche>/Getting Started/`, and `MDRN/<Niche>/Icon/`), not a flat list of paths, so it's obvious
the whole product line stays organized one folder per niche. Don't make the user hunt for outputs across a long
conversation. Flag anything you filled in with a reasonable guess rather than firm information
(price, license terms) so they know what to double-check before publishing.

## Reference files

- `references/architecture.md` — HTML/CSS/JS structure, APP state pattern, palette CSS template
- `references/mobile-responsive.md` — anti-patterns to avoid + the verification script pattern
- `references/screenshots.md` — Playwright screenshot capture pattern
- `references/marketing-imagery.md` — hero image and lifestyle photo compositing technique
- `references/feature-slides.md` — feature-icon grid, palette showcase, and FAQ slide patterns
- `references/demo-videos.md` — real screen-capture recording pattern, AI-video pitfalls, credit safety
- `references/etsy-copy.md` — digital-product-adapted listing structure
- `references/pinterest-copy.md` — shorter pin title/description/hashtag structure, distinct from
  the Etsy listing copy, plus the vertical-image-format gap to flag
- `references/getting-started-guide.md` — branded onboarding PDF structure and the
  HTML-pages-to-PDF build technique

## Scripts

- `scripts/screenshot_app.py` — template: populate sample data, capture crisp screenshots
- `scripts/record_demo.py` — template: real-interaction screen-capture video with synthetic cursor
- `scripts/composite_headline.py` — reusable: add a brand-consistent headline to any base image
- `scripts/render_html_canvas.py` — reusable: render any HTML/CSS "slide" (hero, feature grid,
  palette showcase, FAQ) to a PNG via Playwright — the shared rendering step behind every composited
  marketing image in this skill
- `scripts/composite_greenscreen_mockup.py` — reusable: perspective-warp a real app screenshot into
  an AI-generated device mockup's green-screen display, for photorealistic hero/feature images with
  guaranteed-accurate on-screen text (see `references/marketing-imagery.md` for why this beats a
  single AI generation call)
- `scripts/extract_badge_icon.py` — reusable: export a planner's circular welcome-badge as a
  standalone transparent PNG for `Icon/`, working around a headless-Chromium quirk where
  screenshotting the badge in place inside the full app page doesn't yield real transparency
