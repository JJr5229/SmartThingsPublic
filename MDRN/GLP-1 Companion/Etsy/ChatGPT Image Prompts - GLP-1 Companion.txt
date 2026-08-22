# ChatGPT Image Prompts — GLP-1 Companion Planner
### 7 feature-slide backdrops · Phase 3b · zero Higgsfield credits

---

## HOW TO USE THIS FILE

You are generating **backdrops only** — empty scenes with a device whose screen is a
flat green rectangle. **Do not ask ChatGPT to draw the app.** Image models garble
interface text and will invent fake, misspelled labels. The green screen gets replaced
with your real screenshot afterwards, which is why the hero image already in this folder
has a pixel-perfect dashboard on it.

**Steps:**

1. Open ChatGPT (any model with image generation).
2. Paste the **GLOBAL STYLE BLOCK** below, then the prompt for slide 04. Send as one message.
3. Download the result. Save it in `Etsy/backdrops/` with the filename given in that section.
4. Repeat for slides 05 through 10. Start a **new chat every 2–3 images** — long threads
   drift in style.
5. When all seven are saved, say so and they get composited automatically.

**Do not upload your screenshots to ChatGPT.** They are not needed for this step and
uploading them tends to make the model try to redraw the UI.

**If a green screen comes back with glare, a reflection, a gradient, or any text on it,
regenerate that one.** It must be a flat, solid, evenly lit green rectangle or the
compositing step cannot find its corners cleanly.

**Aspect ratio: square (1:1) for every image.** Ask for the largest size available —
2000×2000 or better. 1024 is too small; that mistake already cost this build a round.

---

## GLOBAL STYLE BLOCK
*Paste this at the top of every prompt.*

```
Square 1:1 premium product-marketing photograph, photorealistic.
Bright, soft, cool morning daylight from a window. Calm, clean, clinical-but-human mood.
Pale cool off-white and light grey surfaces with subtle fine texture.
Colour palette: cool off-white, pale grey, deep slate-indigo, one small warm amber note.
Shallow depth of field. Uncluttered. Absolutely NO people, NO hands, NO text, NO lettering,
NO logos, NO watermarks anywhere in the image.
The device screen must be a PERFECTLY FLAT, SOLID, EVENLY LIT BRIGHT CHROMA-KEY GREEN
RECTANGLE — pure saturated green, no glare, no reflections, no gradients, no icons,
no text, no screen content whatsoever, inset correctly within the bezel.
```

---

## SLIDE 04 — Daily Log
**Save as:** `backdrops/04_backdrop.png`
**Will receive:** `screenshots/03_daily_log_signature.png`

```
[GLOBAL STYLE BLOCK]

Scene: a modern slim silver laptop, open toward camera at a gentle three-quarter angle,
sitting on a pale cool off-white desk beside a window. A clear glass of water and a small
closed slate-blue notebook rest nearby. Morning light falls across the desk from the left.
The laptop screen is a perfectly flat solid bright chroma-key green rectangle.
```

---

## SLIDE 05 — How It Sat
**Save as:** `backdrops/05_backdrop.png`
**Will receive:** `screenshots/05_how_it_sat.png`

```
[GLOBAL STYLE BLOCK]

Scene: a modern slim silver laptop, open toward camera at a gentle three-quarter angle,
standing on a pale kitchen counter. Beside it a light wooden chopping board and a small
bunch of fresh green herbs. Clean, minimal, nothing cluttered or messy.
The laptop screen is a perfectly flat solid bright chroma-key green rectangle.
```

---

## SLIDE 06 — Symptoms
**Save as:** `backdrops/06_backdrop.png`
**Will receive:** `screenshots/04_symptoms.png`

```
[GLOBAL STYLE BLOCK]

Scene: a modern slim silver laptop, open toward camera at a gentle three-quarter angle,
resting on a pale bedside table. A small unlit ceramic lamp and a folded pale grey throw
sit beside it. Soft cool morning light, calm and quiet, not dark and not evening.
The laptop screen is a perfectly flat solid bright chroma-key green rectangle.
```

---

## SLIDE 07 — Dose Log
**Save as:** `backdrops/07_backdrop.png`
**Will receive:** `screenshots/06_dose_log.png`

```
[GLOBAL STYLE BLOCK]

Scene: a modern slim silver laptop, open toward camera at a gentle three-quarter angle,
on a clean pale open shelf. Extremely minimal — one small neutral ceramic dish beside it
and nothing else. Cool even light, very calm and orderly.
The laptop screen is a perfectly flat solid bright chroma-key green rectangle.
```

---

## SLIDE 08 — Strength
**Save as:** `backdrops/08_backdrop.png`
**Will receive:** `screenshots/12_strength.png`

```
[GLOBAL STYLE BLOCK]

Scene: a modern slim silver laptop, open toward camera at a gentle three-quarter angle,
resting on the corner of a pale wooden gym bench. Matte surfaces, a rolled light grey
towel nearby. Bright airy space, clean and uncrowded — no gym equipment clutter,
no weights in focus.
The laptop screen is a perfectly flat solid bright chroma-key green rectangle.
```

---

## SLIDE 09 — Welcome / Setup
**Save as:** `backdrops/09_backdrop.png`
**Will receive:** `screenshots/11_welcome_onboarding.png`

```
[GLOBAL STYLE BLOCK]

Scene: a modern slim silver laptop, open toward camera at a gentle three-quarter angle,
on a small pale side table next to a soft light-grey armchair. A single small green plant
in a neutral pot nearby. Soft daylight, warm and unhurried but still cool-toned.
The laptop screen is a perfectly flat solid bright chroma-key green rectangle.
```

---

## SLIDE 10 — Mobile Dashboard  ⚠️ PHONE, NOT LAPTOP
**Save as:** `backdrops/10_backdrop.png`
**Will receive:** `screenshots/10_mobile_dashboard.png`

```
[GLOBAL STYLE BLOCK]

Scene: a modern smartphone standing upright in a small wooden stand on a pale café table,
shown nearly head-on with only slight perspective. A white cup of coffee on a saucer sits
beside it. Softly blurred bright café interior behind. The phone is portrait orientation.
The phone screen is a perfectly flat solid bright chroma-key green rectangle filling the
whole display area inside the bezel.
```

---

## WHEN YOU ARE DONE

Save all seven into `MDRN/GLP-1 Companion/Etsy/backdrops/` and say so.

Compositing is automatic from there: each real screenshot is perspective-warped into
its green rectangle, then the slide headline is drawn locally in Hanken Grotesk with the
amber accent word — the same treatment as the hero and the three lifestyle images, so the
whole set reads as one shoot.

**Consistency check that runs before delivery:** mean brightness of every image in the set
must be within 1.5× of every other. If one backdrop comes back much darker or much brighter
than the rest, it gets flagged and should be regenerated rather than shipped.
