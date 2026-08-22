# Marketing Imagery

**Gate check first: this file's generation techniques only run if the user chose automated
generation at the Phase 3 checkpoint (see SKILL.md).** The standing default is the opposite — a
ChatGPT image-prompt document (`Etsy/ChatGPT Image Prompts - <Niche>.md`) covering every AI-photo
shot plus each shot's accompanying overlay text, with no Higgsfield calls at all. Never start
generating without having asked. Everything below (model choice, compositing, lighting rules)
still applies in prompt-document mode as *content for the prompts and text blocks* — the prompts
you write should encode the same square-1:1 canvas, diversity, character-continuity, and
lighting-consistency requirements the generation path enforces.

Two distinct image types, two distinct techniques. Both rely on the same core idea: **don't ask an
image model to render both a photo and crisp headline text in one shot** — text rendering in
diffusion/image models is unreliable (typos, warped letterforms, wrong kerning), even when the rest
of the image is excellent. Generate the photo, then composite real vector text as a separate step.

## Handing off image generation as a ChatGPT prompt list (when the user opts out of in-chat generation)

Some users prefer to generate the marketing images themselves (e.g. in ChatGPT / GPT Image) rather
than have them generated in-session — a confirmed, reasonable choice. When the user asks for this,
**do not generate the AI photos**; instead produce a **shot-list document** they can execute prompt
by prompt, covering the same set you'd otherwise build (hero, feature slides, palette grid, FAQ, and
the lifestyle photos). For each shot include: **which real screenshot to upload**, the **exact
overlay text** (headline, the accent word, the feature-list line of real module names), and a
**paste-ready prompt** — plus a single **"global style block"** at the top (palette, fonts, accent
hex, mood) reused across every prompt to keep the set consistent. Because a diffusion/GPT-image model
can't perfectly reproduce the real app UI, tell the user to upload the screenshot and instruct the
model "place this exactly on the screen, do not redraw the interface."

**Save the shot list in BOTH `.md` and `.txt`** in the niche's `Etsy/` folder, and lead it with a
short "How to use this" header. This is not optional polish: on a real build the user opened the
`.md` and asked "what am I supposed to do with this file?" — a plain-text copy that opens in any
editor, plus explicit step-by-step usage instructions at the top, is required. This handoff replaces
only the AI-photo generation — real Playwright **screenshots and the demo videos are still produced
normally** (they're screen captures, not image generation), unless the user says otherwise.

## Standard image-generation model: `nano_banana_2`

Use Higgsfield's `generate_image` with model `nano_banana_2` for every photorealistic photo in this
skill's workflow (hero scene, lifestyle/pain-point photos, device-mockup backdrop scenes) — this is a
direct, confirmed user decision after finding a real build had drifted between `nano_banana_2` and
`nano_banana_flash` inconsistently because different subagents each independently picked one or the
other per generation call with no shared standard. Don't let this drift happen again: every agent
generating a photo for this skill should default to `nano_banana_2` specifically, not "whichever of
the nano-banana variants seems fine in the moment." `nano_banana_pro` exists and produces higher
quality (better text/diagram rendering) at higher cost — only reach for it if the user explicitly
asks for higher quality or better text rendering in a generated image for a specific build.

### ALWAYS pass `resolution` explicitly — the default is 1k and it is silently wrong

`nano_banana_2` takes an optional `resolution` parameter with options `1k` / `2k` / `4k`, and its
**default is `1k`** (1024x1024 on a square aspect ratio). Omit the parameter and every photo in the
build comes back at 1024px — which is *smaller than the 1254px compositing canvas this skill uses*,
so the hero and every lifestyle image get upscaled during compositing before a buyer ever sees them.
Etsy's own guidance asks for ~2000px on the long edge; 1024 misses it outright.

This is not hypothetical. A real build (GLP-1 Companion) submitted its whole four-image set without
the parameter, and nobody chose 1024 — it was just what came back. Caught only when the numbers were
questioned directly, after the images were already generated.

**Pass `resolution: "2k"` on every generation in this skill's workflow.** 2048px clears both the
1254px canvas and Etsy's 2000px guidance with room to crop. Reach for `4k` only when the user asks
for it — the files get large fast, and large files are painful to move between environments.

If a set has *already* been generated at 1k, prefer `upscale_image` (2 credits each, `resolution:
"2k"`) over regenerating. Regenerating re-rolls the image: any character-continuity pair (a "before"
and "after" shot of the same person, per the continuity rule below) breaks, and that continuity is
more expensive to rebuild than the upscale is to run.

## One headline font and treatment for the ENTIRE image set — decide once, reuse everywhere

The user has directly flagged a real bug: the hero image used the niche's actual display font
(Bebas Neue, matching the app itself) with a clean flat-color treatment, but the lifestyle-photo
fixes done afterward each independently substituted a different font ("Arial Narrow Bold") with a
drop shadow — because each compositing call picked its own font rather than checking what earlier
calls in the same build had already used. The user's rule going forward: **the font style and design
must always match across every image in a build.**

Before compositing the first headline in Phase 3, lock in and write down (in your own working notes
for that build, not just in your head) four things, then reuse them identically for every remaining
headline in that build — hero, every lifestyle/pain-point photo, and every Phase 3b feature slide:
1. **Exact font file path** — the niche's own chosen display font from Phase 0 (e.g.
   `C:\Windows\Fonts\BebasNeue-Regular.ttf`). Confirm the file actually exists at that path before
   using it (see `composite_headline.py`'s guidance) — don't fall back to a "similar" system font
   like Arial Narrow Bold if the real one is temporarily inconvenient to load. Bebas Neue specifically
   is also available at `C:\Users\jredm\Downloads\Bebas_Neue\BebasNeue-Regular.ttf` if an agent's
   environment can't read `C:\Windows\Fonts` for some reason — check both locations before
   substituting a different font.
2. **Weight/style** (e.g. bold, no italic).
3. **Color treatment** — exact fill color, and whether there's a drop shadow/outline or a flat fill
   (pick one and use it everywhere; don't let some images get a shadow and others not).
4. **Divider style**, if the composition includes one (per the headline-composition section below) —
   same shape, same size, same color, every time.

If you're fixing or regenerating just one image from an already-approved set (as opposed to building
the whole set fresh), open one of the other already-composited images first and match its exact
treatment — don't re-decide the font/style from scratch for a single fix.

## Reference template — the confirmed quality bar

The user has directly confirmed a specific reference image set as "very good" and wants it treated as
the standing default template for the hero image and every Phase 3b feature slide, across every
niche this skill builds. Before starting a new niche's marketing set, look at 2-3 of these to
recalibrate:
`C:\Users\jredm\Documents\Claude Cowork\MDRN\Wedding Planner\Etsy\ChatGPT Image *.png`,
`Hero - Everything your spreadsheet couldnt do.png`, and the `Lifestyle - *.png` files in that same
folder.

The recurring structure across that set, confirmed via direct pixel inspection (all are square, either
1254x1254 or 2048x2048 — never landscape):
- **Square (1:1) canvas.** This is now the default aspect ratio for the hero image and every Phase 3b
  feature slide, replacing any wider/shorter canvas defaults elsewhere in these reference docs.
  Pinterest pins remain the one deliberately-vertical (2:3) exception — see `pinterest-copy.md`.
- **A softly-styled lifestyle backdrop** behind the whole composition — a desk/table surface, warm
  ambient light, a couple of small on-brand props at the edges (a coffee cup, a plant leaf, or
  niche-appropriate props) — never a flat, plain-color background.
- **A left-side text column** (roughly 40% of the width): a large headline in the app's own display
  font (often one word/phrase in the accent color), a thin colored divider rule directly beneath it,
  a one-line subhead, and a row of 3-4 small icon-in-circle + label callouts underneath (e.g.
  "Countdown / Budget / RSVPs") — reuse the app's own real icon glyphs and module names here, don't
  invent new ones.
- **A right-side device mockup** (roughly 60% of the width): a laptop or phone showing the REAL app
  screenshot, composited in via the green-screen technique below — never an invented/redrawn UI.
- **The brand header is legible inside the mockup itself** — badge/wordmark, palette swatches, and
  toolbar buttons should all be visible in the composited screenshot, exactly as the reference set
  shows the wordmark and palette dots rendered inside the laptop screen.

Reuse this same template shell across the whole Phase 3b slide set — swap only the headline text, the
icon labels, and which module's screenshot is mocked in — for a cohesive, repeatable look. This
consistency is what makes a slide set read as one professional product line rather than several
one-off images; see `feature-slides.md` for how this template threads through the rest of that set.

## Hero image (device mockup + lifestyle styling + headline)

This is the compositing *mechanism* behind the device mockup inside the reference template above —
the square canvas, left-text-column, and right-mockup-panel composition described there is the
default *layout* to build this into, not a separate widescreen full-bleed alternative.

**Default technique: green-screen the device, then composite the real screenshot in yourself.**
This was arrived at after direct comparison — see the decision record below — and produces
results that are both photographically premium AND textually accurate, which no single AI
generation call reliably achieves on its own:

1. Generate the full scene in one call: styled desk/props, soft lighting, the headline text and
   icon-grid labels as literal quoted strings in the prompt, and the device's screen described as
   "a perfectly flat, solid, evenly lit bright chroma-key green rectangle, no glare, no
   reflections, no text, no gradients." Large freshly-authored text (headlines, icon labels, brand
   marks) renders reliably from a model when given as an exact quoted string — this is not the part
   that fails.
2. Use `scripts/composite_greenscreen_mockup.py` to find the green quadrilateral's corners via a
   color mask and perspective-warp your REAL app screenshot into it with PIL. This gives
   pixel-perfect, guaranteed-accurate on-screen text, because it IS the real screenshot rather than
   a model's redrawn approximation of one.
3. If the composite shows a thin bright green fringe around the pasted screenshot, that's
   anti-aliased edge pixels the color mask missed — nudge `edge_fix` more negative (expand the quad
   outward slightly) rather than more positive (shrinking it only exposes MORE of the original
   green border around a now-smaller pasted image, the opposite of what you want).
3c. **Any edit that touches a slide's headline/layout is at risk of silently regressing an already
   -correct screenshot composite if it re-does the compositing from scratch.** This happened on a
   real build: five slides had their perspective-warped screenshots fixed and confirmed correct, then
   a later "just make the text bigger" pass re-generated all five slides and reverted the screenshot
   compositing back to a flat, unwarped paste — because that pass treated the whole slide as
   disposable and rebuilt it, rather than only touching the text layer. When any task's scope is
   "resize/reflow text" or similar, the instructions must be explicit that the existing screenshot
   composite is not to be regenerated — reuse the already-correct warped/composited image and only
   redraw text on top of it — and whoever verifies the result afterward must re-check perspective
   alignment on every touched file, not just trust that an unrelated fix "shouldn't have" affected it.
3b. **The opposite failure is just as real and was missed across an entire slide set on one build:**
   the pasted screenshot can overhang PAST the laptop's physical screen bezel — visible as the
   screenshot's content bleeding above/beside the black bezel edge into the background, rather than
   sitting inset within it. This happens when the AI-generated base photo's flat green rectangle was
   itself drawn slightly larger than where a real laptop screen would sit inset from the lid edge
   (common at the top edge especially), so the detected color-mask quad faithfully reproduces that
   oversized boundary — `edge_fix` tuning alone won't catch this, because the mask is accurately
   finding the green as drawn, the green itself is just in the wrong place relative to the bezel.
   **Fix:** after detecting the quad, apply a small inward safety inset (a few percent of the quad's
   own width/height, weighted toward whichever edge shows the overhang — often the top) before
   warping the screenshot in, so the final paste sits fully inside the visible bezel with margin to
   spare. Verify by zooming into every edge of the composited result against the bezel — don't just
   check for green fringe and assume the opposite failure (overhang) isn't present. If this base
   photo is being reused across multiple slides (per the cost-saving reuse pattern in
   `feature-slides.md`), this defect propagates identically into every slide built from it — fix the
   base compositing approach once, then redo every slide that already used the broken version, not
   just the one where it was first noticed.

3e. **Know when to stop and hand the imagery back to the user entirely.** On a real build, the
   green-screen device-mockup pipeline (photo generation → quad detection → perspective warp → text
   compositing) went through many rounds of fixes across the same handful of files — bezel overhang,
   flat/unwarped pastes, screenshot duplication, backdrop duplication, then a stubborn green-fringe
   defect that survived two dedicated fix attempts — and the user ultimately said "stop all image
   processing... i will generate the images myself." This is a legitimate outcome, not a failure to
   avoid at all costs: this compositing pipeline is genuinely fragile (many distinct failure modes
   that look similar but need different fixes, each costing real generation credits to iterate on),
   and a user who's watched several rounds of "fixed" turn out not to be may reasonably decide their
   own tools (e.g. ChatGPT image generation) or manual review are more reliable than continued
   automated iteration. If a user says something like this, stop immediately — don't dispatch "one
   more fix" even if you think you know the answer — and pivot cleanly to whatever phase comes next
   (e.g. Phase 4 demo video, listing copy) using the app/screenshots/copy that don't depend on the
   contested imagery. Don't relitigate the decision or keep offering to retry.

3d. **If a sweep of `edge_fix` values plateaus — fringe stops shrinking well before it disappears, and
   pushing further just starts eating the bezel instead — stop tuning and regenerate the base photo.**
   This happened on a real build: a phone-in-stand green-screen photo had its green rectangle drawn
   with a slight geometry mismatch against the bezel (not just anti-aliased edges), so no single
   `edge_fix` value could be both fringe-free and bezel-preserving — an agent swept from -0.005 to
   -0.19 and reported the best achievable result as "faint residual sliver, same order of magnitude as
   other slides," which the user immediately caught as a clearly visible green line at normal viewing
   size, not an acceptable hairline. **A plateau like this is a signal the defect is baked into the
   source photo's own pixels, not something compositing math can route around — spend at most one
   focused tuning attempt, and if it doesn't clear cleanly, regenerate the backdrop photo instead of
   continuing to iterate `edge_fix`.** The user explicitly flagged the cost of this: repeated
   generation/compositing/verification cycles on the same flawed source burn real money for no
   improvement, and a fresh backdrop photo is often cheaper than three more rounds of tuning. Also
   don't self-grade a visible defect as "acceptable" by comparing it to another slide's similarly
   flawed residual — "as good as an already-imperfect slide" is not the bar; verify against a full-size
   normal view of the image (not just a tight algorithmic pixel-count on a cropped corner), since a
   defect invisible in a 200x200 diagnostic crop can be obviously wrong at the size a buyer actually
   views the listing image.
4. If the fringe persists on only ONE edge no matter how far `edge_fix` is pushed, that's not a
   uniform-margin problem — a uniform expand/shrink can't fix an error that's concentrated on one
   side. This happened with a phone mockup shot close to head-on: the default "tilted quad" corner
   detection (extremes of x+y and x-y, correct for a laptop shown at an angle) landed short on one
   edge because the phone screen's rounded corners plus an asymmetric reflection made that edge's
   green mask boundary inconsistent with the others. Fix: pass `mode="bbox"` to use a plain
   axis-aligned bounding box instead — each edge is measured independently from wherever the mask
   reaches furthest in that direction, which is more robust for a near head-on shot with rounded
   screen corners. Reserve the default tilted-quad mode for genuinely tilted shots (e.g. a laptop
   at a three-quarter angle), where it's the correct choice and worked perfectly on the first try.
5. **`mode="bbox"` on a genuinely tilted device produces the opposite, more obvious failure: a
   perfectly flat, straight-on screenshot paste inside a device that is visibly angled in the photo.**
   This happened on a real build — a phone propped in a stand at a clear three-quarter lean (the
   green quad's own four corners formed an obvious trapezoid, not a rectangle) was composited with
   `mode="bbox"` anyway, because that mode had fixed a different slide's fringe problem earlier in
   the same session. The result looked wrong at a glance: "the screen doesn't look like it belongs
   on the phone" / "it's straight on and the phone itself is angled." **`bbox` and `tilted` are not
   interchangeable defaults to try until one looks okay — inspect the base photo's own green quad
   corners first.** If the four corners of the green region are visibly NOT a rectangle (top edge
   narrower/shifted vs. the bottom, or left edge a clearly different length than the right), the
   device is tilted and the paste MUST be homography-warped into that exact trapezoid (`mode="tilted"`
   with corner detection robust enough to find the true corners — filter stray green pixels with a
   largest-connected-component mask first, per the pitfall above, rather than switching modes to
   dodge a noisy detection). Only reach for `bbox` when the device itself is genuinely near
   head-on/axis-aligned in the source photo. When redoing a previously-broken composite, don't reuse
   whatever mode fixed the last file without re-checking this — each base photo's device angle is
   independent.

### Text must stay legible at mobile thumbnail size — hard floor, applies to EVERY headline in EVERY build

Etsy listing images are mostly viewed on mobile — as a small thumbnail in search results and at
maybe 375-414px wide even when a buyer opens the full image on a phone. This has been flagged by the
user as too small **on two separate niche builds now** (Meal Prep Planner, then again on Teacher
Planner even after the Meal Prep fix) — a first "downscale to 400px and eyeball it" pass wasn't
aggressive enough, so eyeballing alone is not a reliable check, and neither is "go measure the hero
and match it," because that step is easy to skip entirely when you're heads-down compositing a
lifestyle photo and not thinking about the hero at all. **This is exactly what happened on Teacher
Planner: the lifestyle/pain-point photos (`10_lifestyle_before.png`, `11_lifestyle_after.png`,
`12_classroom.png`) were composited with a 52px headline on a 1254px canvas — never checked against
the hero or against the Meal Prep build's own already-corrected sizing — and shipped visibly smaller
than the rest of the set.** This rule exists specifically so that never happens a third time.

**Use a hard numeric floor, not a "go measure something else first" step:**
- **Headline text: minimum 90px cap-height on a 1600px-wide canvas, or minimum 70px on a 1254px-wide
  canvas** (scale proportionally for any other canvas width — floor is ~5.6% of canvas width).
- **Subtitle / feature-list / body text: minimum 28px on a 1600px-wide canvas, or minimum 22px on a
  1254px-wide canvas** (~1.75% of canvas width).
- These are floors, not targets — round up when unsure, never down. A slide with more competing
  content (an icon grid, Q&A rows, a device mockup) gets a smaller device mockup or tighter layout
  around the text, not smaller text.
- Apply this floor to literally every text-bearing image the skill produces in a build: the hero, every
  Phase 3b feature/module slide, AND every lifestyle/pain-point photo — there is no "this one's just a
  caption, it can be smaller" exception. See the Lifestyle section below, which restates this floor
  directly at the point where it's most often skipped.
- If the niche already has some slides built (e.g. you're only adding lifestyle photos to an
  already-existing image set, or fixing one image), open one of the ALREADY-CORRECT slides and
  measure its actual pixel size as a sanity cross-check against the floor above — but do this in
  addition to hitting the numeric floor, not instead of it. The floor is what makes this checkable
  without needing to remember to go measure something else first.
- After sizing, still downscale a copy to ~400px wide as a final sanity check, but treat the numeric
  floor as the primary method — the eyeball check alone has already missed undersized text twice.

### Headline composition — more than one bold line

A single bold headline over the photo, on its own, reads as plain and generic — it was flagged as
"cheap-looking" and uninformative on a real build even though the underlying photo and screenshot
compositing were both technically correct. The fix is a composed text block, not a bigger font:

1. **Headline** — the emotional hook (e.g. "Everything Your Spreadsheet Couldn't Do"), 1-2 lines.
2. **A thin decorative divider** directly beneath it — a short horizontal rule broken by a small
   accent shape, echoing the app's own motif.
3. **A feature-list subtitle** beneath the divider — smaller, muted-color text naming 4-6 of the
   app's real module names separated by middot·characters (e.g. "Itinerary · Budget · Bookings ·
   Bucket List · Packing List"). This is what actually answers "what do I get" for a buyer scanning
   search results — the headline alone never does. Reuse the exact module names from the app's own
   nav, not a paraphrase.

Render all three with the same PIL text-compositing approach as the headline itself (see
`scripts/composite_headline.py` for the pattern — measure-and-shrink-to-fit, centered or
left-aligned depending on available safe space).

**Divider glyph pitfall:** if the divider's accent shape is a Unicode dingbat character (e.g. ❖, ✦)
rendered through the same font file as the headline, verify that glyph is actually present in that
specific font's charset before shipping — a missing glyph renders as a visible "tofu" placeholder
box in the output, not invisible space, and it's easy to miss at a glance. This happened with Space
Grotesk Bold's variable-font TTF, which doesn't include ❖. The robust fix: draw the accent as a real
PIL shape (`ImageDraw.polygon` for a small rotated-square diamond, a filled rectangle for a dash)
instead of depending on any font's dingbat coverage — it always renders correctly and it's barely
more code than a `draw.text()` call.

### Decision record: why not a single AI generation call

Three things were tried, in order, against the same laptop-hero use case:
- **Blind text-to-image** (describe the on-screen dashboard in the prompt, no reference image):
  produced a plausible-looking but entirely fabricated UI — invented labels, garbled words
  ("Dapember", "Eosionacies poted progress") that don't correspond to anything in the real app.
  Unusable; a buyer or the seller would immediately notice the screen doesn't match the product.
- **Image-to-image with the real screenshot as a reference** (`medias` param, role `image`):
  dramatically better — nav structure, stat cards, and checklist items were highly faithful to the
  real app — but still had small, persistent spelling errors in fine print ("Vendors" ->
  "Venders", "Print" -> "Point") that survived even at 4k resolution and with an explicit
  correct-spellings list added to the prompt. This confirmed the errors are a fundamental
  read-and-redraw limitation, not a prompt-wording or resolution problem — more iteration on the
  prompt has diminishing returns here.
- **Green-screen + PIL perspective composite** (this section's technique): fully resolved it. The
  model never has to "read" the screenshot at all, so there's nothing for it to misspell.

If a hero image already exists (e.g. a laptop-on-a-desk lifestyle shot with the product on screen)
and only the headline needs to change: **do not regenerate the whole image.** Keep the photo/mockup
exactly as-is and only replace the headline text region:

1. Find the exact pixel bounding box of the existing headline text (scan for pixels matching the
   text's known color range within the general area, then take the min/max x/y with a margin).
2. Reconstruct the background behind it: sample a clean row of pixels just *above* the text block
   and another just *below* it, then build a smooth vertical gradient between the two, painted over
   the old text's bounding box. This matches subtle photo lighting/gradients far better than a flat
   fill.
3. Render the new headline as real text with PIL/`ImageFont` (Playfair Display is installed locally
   and reads as an on-brand elegant serif; pair a regular weight for the first line with an italic
   weight for a punchy second line if the headline has an emotional beat).
4. Sample the *existing* headline's actual color from the image (find the darkest pixels within its
   bounding box) rather than guessing a color — this guarantees the new text matches the old
   exactly, which matters more than it sounds like it should.
5. Match font size to the original: measure the original text's pixel height/width and size the new
   font to occupy roughly the same footprint, rather than picking an arbitrary size.

If building a hero image from scratch, generate the base photo (or composite one from existing
brand assets) first with plenty of open negative space where the headline will go, *then* run the
same text-compositing step. Don't try to get the image model to leave "the right" empty space AND
render clean text in the same generation.

## Character continuity between the "before" and "after" lifestyle photos

If the lifestyle set includes both a pain-point ("before") photo and a genuine-enjoyment ("after")
photo, **the same person should appear in both** — this was a direct user request. The narrative is
"this specific person's problem got solved," not two unrelated stock-photo people; a buyer should be
able to recognize the stressed guy from the before-shot as one of the people genuinely enjoying the
after-shot. Generate the "before" photo first, then use it (or a cropped close-up of that person's
face) as a reference image input when generating the "after" scene, prompting the model to preserve
that person's identifiable likeness (face shape, hair, skin tone, build) while changing their pose,
expression, and outfit to fit the new scene. The rest of any group in the "after" shot can and should
still vary in demographic per the diversity requirement below — it's specifically the before/after
individual who needs to match, not the whole cast. Visually confirm the match after generating (crop
both faces side by side) rather than assuming the reference conditioning worked — identity-consistent
generation is not perfectly reliable, and a near-miss (right general look, wrong specific person)
should be treated as a failed attempt to retry, not shipped.

## Lifestyle and pain-point photos (up to 3 images total, the only ones with visible people)

These are square (1:1), no exceptions — matching the reference set's `Lifestyle - *.png` files
(2048x2048). The user has confirmed this as an unconditional rule for every image in the set, not a
default: generate (or, if fixing an existing shot, regenerate) at a square resolution rather than
cropping a tall portrait or wide landscape frame down after the fact — cropping after the fact risks
losing the subject, the headline safe-zone, or both when the aspect change is large.

A photo of someone overwhelmed by the old way of handling this (a cluttered spreadsheet, a messy
paper list, an unwieldy group chat) pairs naturally with the hero's "after" framing, and is a
proven pattern in template/planner shops generally. This is the "before" pain-point shot; a second
or third lifestyle image (still within the 3-image cap — see SKILL.md's image-set target) can show
genuine after-the-fact enjoyment of the planned event, or a different angle on the pain point.

**Generation:** Higgsfield's `generate_image` with `nano_banana_2` (see the standard-model rule at
the top of this file) — produces strong, artifact-free results for this use case.

**Diversity is a requirement, not a nice-to-have, whenever a person's face is shown.** Image models
default to a narrow demographic range unless a prompt says otherwise, and this product line sells to
a broad range of buyers. If the build includes more than one photo with a visible face, explicitly
state a different race/ethnicity, age, and gender in each prompt, and confirm after generation that
the depicted people actually read as different from each other — don't assume stating it in the
prompt was enough without checking the result. This applies across the whole image set for a given
niche build, not per-image in isolation.

**Framing choice — face-visible vs. hands-only/face-away:**
- A visible face reads as more relatable and is generally worth it for at least one lifestyle image,
  as long as the diversity requirement above is followed and the generation is inspected for
  artifacts (faces are where photorealistic generation is most likely to show subtle tells — extra
  fingers, uncanny expressions, asymmetric features).
- Hands-only or over-the-shoulder framing with the face turned away or out of frame remains a valid,
  lower-risk option when it fits the shot (it was the original default for this reason) — de-risks
  the generation without sacrificing the emotional beat. If using this framing across multiple
  images, vary visible skin tone rather than defaulting to the same appearance each time.
Pick per-image based on what the specific shot calls for; don't default to one or the other for the
whole set.

**Adding a headline to a full-bleed photo:** unlike a purpose-built hero image, a generated lifestyle
photo has no built-in negative space. Composite a soft gradient scrim (a solid brand color, high
alpha near the text, fading to fully transparent) over the top or bottom portion of the photo —
never a solid opaque band, which crops into the photo itself (a real defect on a real build: a solid
cream band across the bottom of a "meal containers" lifestyle photo hid the very containers the shot
existed to show off; a graduated scrim fixed it without losing any of the photo) — then render text
on top of the scrim, same PIL technique as above.

**This text is held to the exact same mobile-legibility floor as every other slide — see "Text must
stay legible at mobile thumbnail size" above (minimum 90px headline / 28px subtitle on a 1600px
canvas, or 70px / 22px on a 1254px canvas).** This is called out again here, specifically, because on
a real build the lifestyle photos were the ONE place in the set that floor got skipped — they were
composited with a 52px headline while every other slide in the same build used 90px+, and it shipped
that way until the user caught it after publishing. Sizing a lifestyle-photo headline is not a
different, more-casual step than sizing a feature-slide headline; use the same numeric floor, not a
smaller "it's just a caption over a photo" instinct.

**Critical: verify text placement against the actual photo, don't eyeball it.** A busy photo (a
laptop, a person's shoulder, furniture) can intrude into the "safe" text zone at some horizontal
positions but not others, especially in a photo with any perspective/diagonal lines. Scan the actual
pixel data to find where a dark/busy subject starts, rather than assuming a fixed-fraction scrim
height is safe everywhere:

```python
import numpy as np
arr = np.array(photo.convert('RGB'))
for x in [200, 400, 600, 800, 1000, 1200]:  # sample across the width
    col = arr[:, x, :]
    dark_ys = np.where(col.sum(axis=1) < 120)[0]  # near-black pixels = likely subject edge
    print(x, dark_ys[0] if len(dark_ys) else None)
```
Use the *minimum* safe-y across all sampled columns (with margin) as a hard pixel budget for where
text must end — not a proportional fraction of image height, which can silently overlap a subject
that happens to sit higher in frame than assumed. Two attempts at "make the scrim a bit taller" both
still overlapped the laptop in testing; scanning actual pixels and computing a hard boundary fixed
it on the first try.

**Lighting and mood must match the rest of the image set — check this numerically, not by eye.**
The lifestyle photos are generated separately from the hero/feature-slide photos, and nothing forces
the same lighting mood unless you explicitly carry it over. This caused a real defect: a hero image
built around a dim, warm whiskey-bar interior (mean pixel brightness ~50/255) shipped alongside
lifestyle photos of a bright daylight kitchen and a sunny rooftop (mean brightness ~130-150/255) —
visually jarring next to each other in the same listing, flagged directly by the user as "very
bright" compared to "the others." Before considering a lifestyle photo done, compute its mean
brightness (`np.array(img.convert('RGB')).mean()`) and compare it to the hero image's — if it's more
than roughly 1.5x brighter, the scene's own lighting setup needs to change in the generation prompt
(e.g. "evening kitchen, single warm lamp on, blinds closed" instead of "bright daylight kitchen"; "a
rooftop at dusk with string lights as the dominant light source" instead of "sunny rooftop
afternoon"), not just darkened in post — a natural daylight photo pushed 3x darker in post looks
muddy and flat rather than moody. Match the color temperature too (warm amber, not neutral/cool)
since that's as much a part of the set's visual identity as the brightness level.

**Scrim banding — a visible hard-edged rectangle is a different bug from "no scrim at all."** A scrim
that renders as a flat gray gradient block with a visible straight-line seam where it ends and the
unaltered photo resumes reads as a cheap overlay, not a natural vignette — this happened when a
fixed-height gradient was drawn independent of the photo's own tones and cut off abruptly rather than
easing out. Render the scrim so its bottom edge fades its alpha all the way to fully transparent over
a wide margin (no hard stop), and sample the scrim's dark end from a color that's actually present in
that photo (e.g. its own darkest corner) rather than a generic black/gray, so it reads as the photo
getting moodier near the text rather than a rectangle stamped on top of it. Check by looking at the
full image at normal size, not just a cropped view of the text itself — banding is obvious in context
and easy to miss in a tight crop.
