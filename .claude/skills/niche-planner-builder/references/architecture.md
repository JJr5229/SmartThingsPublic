# App Architecture

Single HTML file, no build step, no external backend. Everything — markup, styles, and logic —
lives in one `.html` file so it can be sold and delivered as a single download.

## Document structure

```html
<div class="welcome-overlay" id="welcome-overlay">
  <!-- First-run onboarding. Top of the welcome card, in order:
       1. The MDRN house wordmark (see "Welcome-screen MDRN logo" below) — establishes the
          house brand before anything else.
       2. A thin hairline rule separating house brand from product.
       3. The per-niche badge (candle, tree, star, etc. — the Phase 0 brand-kit mark).
       4. The product title (e.g. "Celebration of Life Planner") + tagline.
       5. The names/date/basics form, then "Begin Planning" + "I'll fill in details later"
          (skipWelcome()). Always give both paths — some buyers want to explore before
          committing data. -->
</div>
```

**Welcome-overlay background — locked, universal treatment, not a per-niche style choice.** The
backdrop behind the welcome card uses a soft radial vignette built from the active palette's own
variables, confirmed by the user as the standard look after seeing it on the Engagement Planner:

```css
.welcome-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: radial-gradient(ellipse at 50% 25%, var(--surface2) 0%, var(--primary-dark) 130%);
  display: flex; align-items: center; justify-content: center;
  padding: 2rem;
  overflow-y: auto;
}
.welcome-card {
  background: var(--surface); border-radius: 14px; padding: 40px 42px;
  max-width: 520px; width: 100%; box-shadow: 0 30px 80px rgba(0,0,0,.3); text-align: center;
}
.welcome-brand { display: block; width: 150px; height: auto; margin: 0 auto 14px; }
.welcome-brand-rule { width: 190px; height: 1px; background: var(--border); margin: 0 auto 20px; }
.welcome-badge {
  width: 56px; height: 56px; border-radius: 50%; background: var(--hero-grad);
  display: flex; align-items: center; justify-content: center; color: #fff; font-size: 26px;
  margin: 0 auto 14px; box-shadow: 0 6px 18px rgba(0,0,0,.15);
}
```

Because the gradient references `--surface2`/`--primary-dark` rather than hardcoded colors, it
automatically re-tints per palette (a soft rose vignette on a blush-toned palette, a dramatic
near-black one on a noir-toned palette, etc.) — this is the intended behavior, not a bug to fix. If
a build reports "the background is [some color]" during review, that's virtually always just the
currently-active palette showing through this same formula, not an accidental hardcoded value —
confirm which palette is active before changing anything.

Keep the card's own shape (14px radius, generous 40/42px padding, a soft deep shadow well beyond a
normal card's shadow to make it feel like it's floating above the vignette) and the brand-stacking
order (house wordmark → hairline rule → per-niche badge → title → tagline → form) consistent across
every niche — only the palette values and the per-niche badge glyph should change build to build.

**Badge icon design spec — the glyph itself must also look like part of a collection, not just the
CSS container around it.** This was a real gap found after several niches had already shipped: the
badge *containers* all matched (circle, gradient, centered), but the glyphs inside varied so much in
scale, color treatment, and composition that side-by-side they read as different products, not one
line. Apply this spec to every new badge, and when touching an existing one, bring it in line:
- **One centered glyph, never a scattered composition.** A single icon occupying the visual center of
  the circle — not two+ elements arranged off-center (two dice at diagonal corners), not a main glyph
  plus stray decorative accents drifting outside its silhouette (bubbles floating beside a cocktail
  glass). If the niche motif naturally suggests multiples (dice, playing cards, confetti), pick ONE
  representative instance and center it (a single die face showing five pips), not a loose arrangement.
- **Icon-to-badge ratio ≈ 50% of the badge's diameter**, for vector glyphs (a 64px badge gets a
  ~32px icon). Whether the badge sizes its icon via an explicit `width`/`height` on the `<svg>` or via
  a relative rule (`.badge svg { width: 50%; height: 50%; }`), converge on this ratio — it's what makes
  icons feel like one family instead of some "shy and small" and others "oversized."
- **Text glyphs need MORE than 50%, not the same ratio.** A single character (e.g. "$") has far more
  internal whitespace/side-bearing than a custom-drawn icon shape at the same font-size, so it reads
  visibly smaller than a vector icon sized to the same percentage. Size currency/letter glyphs to
  roughly **60–65% of the badge diameter in font-size** to match the vector icons' visual weight — a
  34px "$" on a 72px badge reads as noticeably tinier than a 32px vector icon on a 64px badge even
  though the ratios look close on paper; 46px on that same 72px badge is the corrected size.
- **Flat single-color icon, not two-tone.** Render the glyph as one solid color (white, or a warm
  cream like `#F6EDD8` on darker/richer gradients) — either solid `fill` or a clean `stroke` outline.
  Avoid mixing techniques within one glyph (e.g. white background chips with separately-colored dots
  punched out) even if the motif tempts it (dice); redraw it as a single-color outline + solid pips
  instead so it matches the flat-icon language every other badge in the set uses.
- **No decorative rings, halos, or borders around the circle.** A plain gradient circle plus one soft
  drop shadow (`box-shadow: 0 6px 16px rgba(0,0,0,.15)`) is the standard treatment. Multi-layer
  box-shadow rings (`0 0 0 1.5px var(--surface), 0 0 0 3px var(--primary), ...`) look like a deliberate
  premium detail in isolation but read as an unexplained inconsistency once other niches in the same
  product line don't have it — skip the ring treatment entirely rather than applying it selectively.

**Export the badge as a standalone icon file — at a fixed, consistent resolution.** Every niche needs
its circular badge available as a transparent PNG outside the app itself (for storefront use,
favicons, etc.) — save it to the niche's own `Icon/` folder (sibling to `HTML/`, `Etsy/`, etc. — see
Phase 1's folder structure) as `<niche>-icon.png`.

The on-screen badge's CSS size varies by niche (56–82px, whatever fits that app's own welcome-card
proportions) — **never export at that native CSS size or a fixed device-scale multiple of it.** Doing
so was a real gap found after the first full set shipped: a naive `device_scale_factor=8` on each
badge's own CSS box produced PNGs ranging ~460px to ~660px square across the 12 niches, and even at
the larger end the circle looked small and thin next to a proper app-icon crop. Standardize instead:
- **Export canvas: 1024×1024px, every niche, no exceptions.** This is the sizing guideline — pick a
  fixed target resolution once and hold every niche to it, rather than letting each badge's native
  size leak into the output.
- **Circle fill: ~86% of the canvas** (8% margin on each side, i.e. canvas = badge diameter ×
  1.16, then scaled up to fill 1024px). This margin exists only to keep the soft drop shadow's blur
  from being clipped at the frame edge — the badge itself should read as bold and edge-filling, not
  small-and-centered with a lot of dead space around it.
- Compute the export scale **dynamically per badge**: `scale = 1024 / (badge_css_size * 1.16)`. A
  56px badge and an 82px badge both end up at the same 1024px final canvas with the same ~86% circle
  fill — the whole point is that nobody can tell from the exported PNG alone which niche's on-screen
  badge happened to be bigger or smaller.

Screenshotting the badge element in place inside the full app page does **not** reliably produce real
alpha transparency in headless Chromium (the corners come back opaque even though border-radius
renders correctly on screen) — `scripts/extract_badge_icon.py` works around this by re-rendering the
badge in an isolated snippet (computed styles resolved, wrapped in a sized `#frame` div, screenshotted
via `page.screenshot(clip=..., omit_background=True)` rather than `element.screenshot()`) and already
implements the 1024px/86%-fill standard above. Run it once per niche after the badge markup is
finalized:
```
py scripts/extract_badge_icon.py "<Niche>/HTML/<file>.html" "#welcome-overlay .welcome-badge" "<Niche>/Icon/<niche>-icon.png"
```
If a build's badge is a fully self-contained `<svg>` (its own `<circle>` + gradient `<defs>` drawn
inside the SVG, rather than a CSS div with `border-radius` + `background`), point the selector at the
svg itself (append ` svg` to the selector) — the script detects the SVG case automatically and skips
the CSS-var-resolution step, but still normalizes to the same 1024px/86%-fill canvas.

**Text-glyph badges (a "$", a single letter, etc.) need their font resolved too — this was a real,
easy-to-miss bug.** A badge rendered as a `<span>$</span>` has no inline style of its own; its
font-family/weight/size live entirely in the app's external stylesheet. The first version of this
script only inlined `color` onto the clone, so the isolated snippet (which has no stylesheet at all)
silently rendered the "$" in the browser's *default* serif font at a *default* 16px/400-weight — it
still looked passably icon-shaped at a glance, so this shipped once before anyone noticed the export
didn't match the app's real bold Archivo glyph at all. The script now inlines the full text style
(font-family/weight/size/style/letter-spacing/line-height) on every descendant and copies the source
page's Google Fonts `<link>` tags into the snippet, then waits on `document.fonts.ready` before
screenshotting. If a future edit to this script (or a bespoke one-off variant) drops that inlining
again, a text-glyph badge is the one case where the bug won't be visually obvious in a quick glance —
compare the exported PNG's glyph weight against the real app's rendered badge, not just its rough
silhouette.

**Build check — the skip path must have a permanent home.** Because "I'll fill in details later"
(`skipWelcome()`) is a first-class path, every field the welcome form captures (name, date, venue,
etc.) MUST be editable later from inside the app — the welcome screen is gone after launch and never
returns. Give this a **permanent home as its own sidebar section**, not a dismissable prompt:

1. A dedicated **"Details" section in the sidebar** (the wedding planner calls it "Our Wedding"; a
   funeral planner "Service Details" — name it for the niche), placed right after Dashboard in the
   Overview/Planning group. It renders a normal form containing *every* welcome field plus a few
   natural extras (time, address, organizer), and **auto-saves on every `oninput`** — no Save button,
   with a small "✓ saves automatically" note. This is the canonical pattern; mirror it per niche.
2. A **subtle incomplete-indicator** on that sidebar item — a small accent dot shown only while key
   details are still empty (`!name || !date || !venue`) that disappears once they're filled. This is
   a *quiet nudge*, not a nag.

Deliberately DO NOT use a big dismissable "setup call-to-action" bar across the top of the dashboard.
An earlier build tried that; the owner's feedback was that it "feels like a reminder bar" they just
want gone once they've entered the info — a persistent, always-available sidebar home is the right
mental model (it's *settings*, not an *alert*), and the dot carries the gentle nudge without nagging.
Point the dashboard's own "Edit Details" affordance at this section (`showSection('details')`) rather
than duplicating the form in a modal, so there's one canonical place.

One implementation note: the auto-save handler re-renders the sidebar (to refresh the indicator dot),
so make sure that re-render does **not** steal focus from the form input the user is typing in — keep
the form in the main content area (not the sidebar) so re-rendering the sidebar leaves the focused
field untouched. Verify by driving the skip path: call `skipWelcome()`, confirm the sidebar shows the
Details item with its dot; open it, type into the fields, and confirm (a) focus is retained while
typing, (b) values persist to `APP.details`, and (c) the dot clears once name/date/venue are set.
This was a real gap found in a build where the only affordance was an easy-to-miss "Edit Details"
link, then refined away from a top reminder bar to this sidebar-section pattern.

```html
<!-- (document structure continues) -->

<div class="app-shell">
  <header class="app-header">
    <!-- brand mark + name, palette switcher, Save / Restore / Share / Print buttons -->
  </header>
  <div class="app-body">
    <nav class="app-sidebar">
      <!-- .sb-group per category, each with a collapsible .sb-group-head and a list of
           .nav-btn buttons, one per section. Mirrors how a real planning binder is organized:
           group by phase/theme, not alphabetically. -->
    </nav>
    <main class="app-main">
      <section id="sec-dashboard" class="section active">...</section>
      <section id="sec-budget" class="section">...</section>
      <!-- one section per module, toggled by showSection() -->
    </main>
  </div>
</div>
```

## State: the `APP` object

```js
let APP = {
  palette: 'default-theme-name',
  details: { /* names/date/basics captured on the welcome screen */ },
  budget: { total: 0, categories: [ {name, estimated, actual}, ... ] },
  // ...one key per module, e.g. guests, checklist, registry, timeline, vendors...
};
```

Important: `let APP = {...}` at the top level of a `<script>` tag does **not** attach to `window`.
Reference `APP` directly everywhere (including from an external automation script's
`page.evaluate()` calls) — `window.APP` will be `undefined`.

Persistence:
```js
function save() { localStorage.setItem('appState', JSON.stringify(APP)); }
function load() { const raw = localStorage.getItem('appState'); if (raw) APP = JSON.parse(raw); }
```

Plus explicit **Save**/**Restore** buttons that export/import a JSON file — this is a genuine
selling point ("your data never leaves your device, and you can back it up or move it to a new
device with one click"), not just a nice-to-have. Keep the copy about this prominent in both the
app's own UI and later in the Etsy listing.

**Standardize the exact copy, not just the mechanism — this is a cross-niche convention, not a
per-build wording choice.** Every niche's Save/Restore controls should use this language verbatim,
so a buyer who owns two MDRN planners (e.g. this one and the Wedding Planner) recognizes the feature
instantly instead of re-learning it per product:
- Button labels: **"Save"** and **"Restore"** (short, in the header toolbar).
- Tooltip/title text: `"Download a backup of your planner"` for Save, `"Restore from a saved
  backup"` for Restore. Don't drift into synonyms like "backup file" or "saved file" — a build did
  this once and it read as a different, unrelated feature next to the sibling app until corrected.
- The exported filename may vary per niche (e.g. `wedding-planner-2026-06-14.json`), but the button
  copy and tooltip text should not.

## Optional: passphrase-encrypted Save/Restore (sensitive-data niches only)

**Only build this when the user confirms it at the Phase 0 checkpoint** (SKILL.md's "Data
sensitivity & backup encryption" question — asked whenever a niche's modules plausibly hold real
financial, medical, legal, or account/password data, e.g. a legacy binder or estate planner; skipped
for low-stakes niches like a wedding budget). This is the validated pattern from the Legacy Binder
build — reuse it rather than re-deriving a scheme:

- **Mechanism: AES-256-GCM via the browser's native Web Crypto API**, key-derived from the buyer's
  passphrase with PBKDF2 (300,000 iterations, SHA-256). No external library, no server — `crypto.
  subtle` is available in every modern desktop and mobile browser. This is real encryption, not
  obfuscation: a stolen/shared backup file is unreadable without the passphrase.
- **Encryption is mandatory, not a toggle.** Remove the plain-JSON export path entirely — Save always
  opens a "Protect Your Backup" modal, so there is no way to produce an unencrypted backup by
  accident. Restore auto-detects an encrypted payload (a `mdrnEncrypted:true` flag in the parsed
  JSON) and prompts for the passphrase; a payload without that flag falls back to the old plaintext
  restore path so backups saved before this feature shipped still work.
- **Auto-suggest a 4-word passphrase, pre-filled in both fields.** A phone user typing a random
  strong password twice is a real friction/typo-lockout risk; a memorable multi-word phrase (e.g.
  `heron-gateway-needle-southern`) drawn from a curated ~400-word list of simple, unambiguous English
  nouns/adjectives (no proper nouns, no homophone-confusable pairs) is easier to type correctly, read
  back, and write down, while still carrying real entropy under 300k PBKDF2 iterations. Give a "New
  Phrase" button to regenerate, and let the buyer overwrite either field with their own phrase instead
  — don't force the generated one.
- **Validate before allowing the download**: block on an empty/under-8-character passphrase and on a
  mismatched confirm field, with an inline error message (not a native `alert()`).
- **An optional hint field**, stored *unencrypted* alongside the ciphertext (e.g. "Ask Marcus, or
  check the safe") and shown automatically at Restore time before the passphrase is entered — this
  targets the specific succession problem these niches have: the person who needs to restore the
  binder is often not the person who encrypted it.
- **A visible, non-alarmist warning** in the Save modal: if the passphrase is lost, the backup cannot
  be recovered by anyone, including the seller — say so plainly and tell them to write it down
  somewhere separate from the device.
- **Default fields to plain text, not `type="password"`,** with a Show/Hide toggle. Verifying the
  passphrase was typed correctly matters more here than concealing it from a shoulder-surfer, and
  masked fields make the two-field confirm step nearly impossible to visually check on a phone.
- **What stays out of scope by default:** encrypting the live in-app `localStorage` (a "vault mode"
  requiring the passphrase on every app open) was considered and deliberately not built — it adds
  friction on every visit and turns "forgot the passphrase" into "lost the entire binder," a worse
  failure mode than the leaked-backup-file risk it would defend against, for a product whose job is
  surviving the owner's own incapacity. Treat it as a future opt-in toggle if a user specifically asks
  for it, not a default.

Verify with the same Playwright discipline as every other feature in this skill: a full
encrypt→download→wrong-passphrase-rejected→correct-passphrase-restore round trip, confirming the
plaintext data does not appear anywhere in the exported ciphertext file, that empty/mismatched
passphrases are blocked, that an old-format plaintext backup still restores, and that the modal fits
without horizontal overflow at a 375px mobile viewport.

## Seed structured modules — never open to an empty screen

The checklist is always seeded from a `CHECKLIST_SEED` array on a fresh start (both "Begin Planning"
and "I'll fill in later" paths), so the buyer never lands on a blank checklist. Apply the same
treatment to **any module that represents a known, mostly-standard sequence** — an order of service,
a day-of itinerary, an event agenda, a run-of-show. These have a conventional structure the buyer
will recognize and lightly edit, and an empty one makes the product feel like work rather than a
head start. Define a `PROGRAM_SEED` (or `ITINERARY_SEED`, etc.) of `[type, title, person]`-style
tuples and map it into the module's state array in *both* welcome paths, exactly as the checklist is.
Leave genuinely per-event values (times, names) blank in the seed and render a muted placeholder
(e.g. a "—") for the blank field so the row reads as intentional-and-fillable, not broken. Modules
that are inherently personal and have no standard starting set (guest list, memory/tribute wall,
budget line items beyond a few obvious categories) are the exception — those legitimately start
empty with a warm empty-state, and are where CSV import (above) earns its keep instead.

One layout note learned the hard way: a helper hint line (e.g. the CSV-import instructions) belongs
*outside* the `.sec-head` block, as a sibling before the content — placing it inside the header, or
pulling it up with a negative margin, crowds it against the toolbar buttons and the header's
border-bottom. Give it normal margins and let it breathe.

## Palette system

Each theme is a `body.<name>` block defining the same set of CSS custom properties. Switching
themes is just adding/removing a class on `<body>`:

```css
body.<theme-name> {
  --bg: ...;           /* page background */
  --surface: ...;       /* card/panel background */
  --surface2: ...;       /* secondary surface, e.g. sidebar group headers */
  --primary: ...;         /* brand accent — buttons, active states, hero gradient base */
  --primary-light: ...;
  --primary-dark: ...;
  --accent: ...;            /* secondary accent, e.g. gold dividers */
  --text: ...;
  --muted: ...;
  --border: ...;
  --success: ...; --danger: ...; --warning: ...;
  --hero-grad: linear-gradient(135deg, ... , ...);
  --card-shadow: ...;
  --hero-shadow: ...;
}
```

```js
function switchPalette(name) {
  document.body.className = name;
  APP.palette = name;
  save();
}
```

**Placement is universal, not a per-niche layout choice: the palette dots live in a dedicated
section at the bottom of the sidebar, never in the header.** This was found as a real inconsistency
between builds — one niche put the dots in the header toolbar (crowding it against Save/Restore/
Share/Print until buttons started truncating), while the sibling app kept them in the sidebar. A
buyer switching between two MDRN planners should find the palette control in the same place every
time. The canonical markup, placed as the last child of `.app-sidebar`, after every `.sb-group`:

```html
<div class="sb-palette-section">
  <div class="sb-palette-label">Palette</div>
  <div class="sb-palette-dots" id="pal-row"><!-- dot buttons rendered here --></div>
</div>
```

```css
.sb-palette-section { margin:18px 12px 0; padding:14px 12px 4px; border-top:1px solid var(--border); }
.sb-palette-label { font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:9px; }
.sb-palette-dots { display:flex; gap:8px; align-items:center; }
```

A thin `border-top` divider separates it from the last nav group, and the small uppercase "Palette"
label — not just bare dots — makes the control self-explanatory without a tooltip. The header
toolbar stays reserved for the app-level actions (Save, Restore, Share, Print, and any niche-to-
niche handoff button) with no palette UI competing for that space.

Pick 4-5 palette names and color stories that fit the niche's real aesthetic range — don't just
reuse "Blush & Ivory / Sage & Cream / Dusty Blue & Gold / Lavender & Champagne / Noir & Gold"
verbatim unless the niche is close enough to a wedding that it genuinely fits. A baby shower
product line, for example, might want something like "Blush & Cream / Sage & Cream / Sky & Cream /
Butter & Cream / Lavender & Cream" — softer, more gender-neutral-friendly, still cohesive.

## Cards and stat tiles

The dashboard's signature visual is a row of gradient stat cards (`--hero-grad` background, a large
number + small label). Reuse the *concept* — it's what reads as "premium software" rather than
"spreadsheet" in a screenshot — but re-derive the actual values (corner radius, shadow, gradient
angle/contrast, text color) to match this niche's shape language rather than copying the wedding
planner's numbers wholesale:

```css
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.stat-card { background: var(--hero-grad); border-radius: 14px; padding: 1.75rem; color: white; }
```

`14px` corner radius and a subtle 135deg gradient is the wedding planner's specific choice — elegant,
understated. A baby shower version might use a larger radius (18-20px) for a softer, rounder feel; a
graduation planner might use a smaller radius (6-8px) with a bolder, higher-contrast gradient for an
achievement-forward mood. Pick deliberately per niche; don't paste these exact numbers by default.

See `references/mobile-responsive.md` before you ship this — the `auto-fit`/`minmax` pattern above
is the *correct* form; a hardcoded `repeat(4, 1fr)` on the same class is the bug that caused real
mobile overflow last time.

## Aesthetic archetypes — pick a far-apart starting point (do this BEFORE Typography)

Per SKILL.md Phase 0, each new niche (that isn't a declared sibling of an existing one) must pick a
**named archetype no living sibling already occupies**, then customize it. This menu is the whole
point of the exercise: it hands you starting points that are genuinely far apart in design space, so
"make it different" has somewhere concrete to go instead of collapsing into a recolor of the same
tasteful center. Each entry is a *coordinated set* across the axes SKILL.md lists (type / shape &
shadow / color-temp & ground / layout skeleton / motif) — that coordination is what makes an
archetype read as a distinct product rather than a random pile of choices. Treat these as launch
points to push further from, not a second set of defaults to copy verbatim.

1. **Editorial Romantic** — high-contrast serif display (Cormorant/Playfair) + humanist sans; soft
   14px cards, deep diffuse shadows; low-sat warm neutrals on cream + one metallic accent; countdown
   hero → stat row → 2×2 grid; heart/diamond motifs. *(This IS the wedding-planner default — usually
   already claimed. Don't reach for it unless the niche genuinely earns romance and no sibling has it.)*
2. **Achievement Geometric** — bold geometric grotesque (Archivo, Space Grotesk), tight tracking;
   sharp 4–6px corners, crisp high-contrast shadows; saturated duotone, high-contrast gradients;
   asymmetric hero + a progress bar as the headline; chevron / bar / uppercase motifs. *(graduation,
   fitness goal, sports, career milestone.)*
3. **Warm Retro / 70s** — rounded slab or groovy display (Fraunces soft opsz, Clash) at generous
   size; pill / 22px+ corners, flat or minimal shadow; mustard-rust-avocado, color-blocked bands;
   full-width stacked sections with oversized numerals; arches / sunbursts. *(reunion, milestone
   birthday, anniversary.)*
4. **Soft Pastel Nursery** — friendly rounded sans (Quicksand, Nunito, Baloo 2); very round 22px+
   corners, tiny diffuse shadows; low-sat gender-neutral pastels; airy 3-card layout, cloud/arc hero;
   stars / clouds / moons. *(baby shower, gender reveal, christening.)*
5. **Technical / Monospace Utility** — mono display (IBM Plex Mono, Space Mono) + a plain grotesque UI
   sans; square 2–4px corners, hairline borders instead of shadows; near-monochrome + one signal
   color; dense data-grid dashboard, table-forward, tight rows; plus / tick / grid motifs. *(budget,
   gradebook, inventory, project/wedding logistics for a data-minded buyer.)*
6. **Botanical Naturalist** — humanist serif (Lora, Newsreader) + organic sans; medium 10–12px
   corners, soft layered shadows; earthy greens/terracotta, muted, tonal; content column with
   illustrated margins; pressed-leaf / line-botanical motifs. *(wellness, garden, retirement,
   memorial.)*
7. **Art Deco / Formal** — high-contrast Deco display (or a strong didone) + refined sans; sharp
   corners framed by gold hairline rules; deep jewel tones, dark-leaning ground, brass accent;
   symmetric framed panels; fans / sunbursts / chevron inlays. *(gala, quinceañera, formal
   anniversary, NYE.)*
8. **Playful Maximalist** — chunky rounded display (Fredoka, Baloo) with color in the type; big
   rounded cards with *colored* (not gray) shadows; multiple bright hues, no single accent; sticker-
   like tiles in varied card colors; confetti / balloon / emoji-scale glyphs. *(kids' birthday, party,
   game night.)*
9. **Quiet Minimal / Scandi** — one light grotesque only, no serif; near-square 6px corners, NO
   shadow (borders and whitespace only); off-white + charcoal + one muted accent; lots of negative
   space, thin rules, left-aligned; a single simple line glyph. *(minimalist planners, capsule/
   declutter, modern couple.)*
10. **Vintage Newsprint / Almanac** — condensed serif headlines + a classic body serif; rule-and-
    border driven, no shadow; sepia/ink on aged cream, two-tone; masthead + column layout, ledger-
    style tables; ornaments / dropcaps / printer's rules. *(estate/legacy, genealogy, farm/homestead.)*
11. **Nocturne / Dark Premium** — sleek sans + a tight display face; dark surfaces, a glowing accent,
    soft glow shadows; deep navy/near-black + neon or gold; luminous stat cards on dark ground;
    constellation / spark motifs. *(NYE, milestone, anything premium/evening; also the natural home
    for a sensitive-data niche that wants a "vault" feel.)*

None of these is mandatory and the list isn't exhaustive — if a niche suggests something not here
(newspaper-classified, blueprint/schematic, watercolor, risograph, Bauhaus primary), build it. The
rule is only: **coordinated, committed, and not already worn by a sibling.** Whatever you pick,
record it as the Design Signature line SKILL.md's Phase 0 requires.

## Typography

The archetype you chose above dictates the type pairing — the mood-based starting points below are a
*supplement* to the menu, not a replacement for it, and the wedding planner's own serif pairing is
just one deliberately-non-default point in that space, not the baseline to drift toward.

Don't default to "elegant serif display + clean sans body" (`Cormorant Garamond`/`Playfair Display`
+ `Inter`) just because that's what the wedding planner uses and it's already proven to work — that
pairing is *this* niche's specific expression of "elevated planning tool," not a universal one. The
architecture is what's reusable (a display font for headings/hero, a workhorse sans for UI chrome);
the actual typefaces should be reconsidered per niche. Some starting points, not a prescriptive list:

- **Wedding** — elegant serif (Cormorant Garamond, Playfair Display), romantic, editorial.
- **Baby shower** — a softer/rounder serif or a friendly humanist sans for headings (e.g. Fraunces at
  a lighter weight, or Quicksand/Nunito for a more playful register) — less "bridal magazine," more
  "warm and welcoming."
- **Graduation** — a bold geometric or grotesque sans for headings (e.g. Archivo, Space Grotesk) —
  achievement-forward and confident rather than romantic.
- **Retirement / milestone birthday** — a warm, classic (non-script) serif for headings (e.g. Lora,
  Libre Baskerville) paired with a clean sans — dignified without being somber.
- **Kid's birthday / more playful niches** — a rounded display face (e.g. Baloo 2, Fredoka) — this is
  where deviating furthest from the wedding planner's mood is most obviously correct.

Google Fonts covers all of these via the same `<link>` pattern already in use. `Playfair Display` is
also installed locally as a system font, independent of what's chosen for the app's own CSS — useful
for compositing marketing headline text later regardless of which font the app itself uses.

## Motifs and decorative glyphs

The wedding planner uses hearts (♡) and diamonds (◆) as recurring decorative glyphs — the countdown
hero's large background watermark, small icons scattered through section headers. These are wedding
-specific symbols, not generic "elegant planner" symbols, and carrying them into another niche
unchanged reads the same as leaving "Honeymoon" in a baby shower planner's nav bar: technically
present, contextually wrong. Choose glyphs that actually belong to the new niche — stars or clouds
for a baby shower, a graduation cap or tassel for graduation, balloons or confetti for a birthday,
a compass or luggage tag for a travel-themed reunion. Simple Unicode symbols or small inline SVGs
both work fine; the point is intentionality, not production complexity.

## Welcome-screen MDRN logo

Every planner's welcome card leads with the **MDRN house wordmark** — the "MDRN Milestone Co."
lockup — sitting above the per-niche badge and product title, so the buyer sees the house brand the
moment the app opens. This is the *house* mark (shared across the whole product line), distinct from
the per-niche badge (candle, tree, star…) defined in Phase 0; show both, house brand first.

Because these apps ship as a single `.html` file, **do not link the logo as an external image** —
that would break the moment the file is moved or sold on its own. Instead **embed it as a base64
`data:` URI** so the file stays fully self-contained:

```
Source asset:  MDRN/Branding/Logos/MDRN_wordmark_transparent.png   (dark wordmark, transparent bg)
```

The transparent/dark wordmark is the right choice: the welcome *card* is always a light surface
across every palette (only the overlay *behind* it is the dark `--primary-dark`), so a dark wordmark
reads correctly on all five palettes without needing a per-palette swap.

Build the data URI once with a short script (downscale to ~480px wide first — it displays at ~155px,
so 480px keeps it retina-crisp while staying ~35–40 KB of base64, a non-issue for a single file):

```python
from PIL import Image; import base64, io
im = Image.open('MDRN_wordmark_transparent.png').convert('RGBA')
w = 480; im = im.resize((w, round(im.height*w/im.width)), Image.LANCZOS)
buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
uri = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()
```

Then inject `uri` into the welcome card markup (a placeholder like `__MDRN_WORDMARK__` swapped via a
tiny Python pass avoids pasting ~37 KB of base64 through an editor). Markup + CSS:

```html
<img class="welcome-brand" src="data:image/png;base64,…" alt="MDRN Milestone Co.">
<div class="welcome-brand-rule"></div>
```
```css
.welcome-brand{display:block;width:158px;height:auto;margin:0 auto 14px;}
.welcome-brand-rule{width:200px;height:1px;background:var(--border);margin:0 auto 22px;}
```

Verify after building: reload the welcome screen and check the `<img>` actually decoded
(`img.complete === true && img.naturalWidth > 0`) rather than trusting that the data URI is
well-formed — a truncated or mis-escaped base64 string fails silently as a broken-image icon.

## CSV import for list modules

Any module that holds a flat list of people or line items — the guest/attendee/RSVP list above all,
but also potentially a vendor directory or gift registry — should offer **CSV import**, alongside a
one-click **blank-template download** so the buyer knows the exact column format. This is a real
selling point: people usually already have their guest list in a spreadsheet, and retyping it is the
single most tedious part of setup. Ship three affordances in the module's toolbar: a *Template*
button (downloads a small sample CSV), an *Import CSV* button (triggers a hidden
`<input type="file" accept=".csv">`), and the normal *Add* button.

Two rules that make the difference between "works in the demo" and "works on a real buyer's file":

1. **Use a real CSV parser, not `line.split(',')`.** Real exported spreadsheets contain quoted
   fields with commas ("Halloway, Michael"), escaped `""` quotes, and newlines inside quoted cells.
   A naive split corrupts all three. Reuse this small state-machine parser — it's ~25 lines and
   handles every case, and was validated against quoted commas, `""` escapes, and embedded newlines:

   ```js
   function parseCSV(text){
     var rows=[], row=[], field='', i=0, inQ=false;
     text = text.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
     while (i < text.length){
       var c = text[i];
       if (inQ){
         if (c === '"'){ if (text[i+1] === '"'){ field+='"'; i+=2; continue; } inQ=false; i++; continue; }
         field += c; i++; continue;
       }
       if (c === '"'){ inQ=true; i++; continue; }
       if (c === ','){ row.push(field); field=''; i++; continue; }
       if (c === '\n'){ row.push(field); rows.push(row); row=[]; field=''; i++; continue; }
       field += c; i++;
     }
     if (field.length || row.length){ row.push(field); rows.push(row); }
     return rows.filter(function(r){ return r.some(function(v){ return String(v).trim()!==''; }); });
   }
   ```

2. **Map headers tolerantly and normalize values.** Match column headers case-insensitively and
   accept common aliases (`name`/`guest`/`full name`; `relation`/`relationship`/`role`;
   `rsvp`/`status`/`attending`; etc.), so the import doesn't fail just because someone titled a
   column "Guest Name" instead of "Name". Normalize free-text values into the app's enums —
   `Y`/`yes`/`attending`/`confirmed` → `'yes'`, `no`/`declined`/`regrets` → `'no'`, else `'pending'`;
   a blank boolean column falls back to a sensible default. Skip rows with no name (count and report
   them in the toast) and **append rather than overwrite** — importing adds to the list, it never
   clears existing entries. State that in a one-line hint under the toolbar so it's not scary.

## Print views

Every section that a buyer would plausibly want a physical copy of (checklist, guest/attendee list,
seating or layout plan, budget) should get a working `window.print()` path with the app chrome
(header, sidebar, buttons) hidden via `@media print`. This is a real, differentiating feature versus
a plain spreadsheet — mention it in the app UI and keep it working.
