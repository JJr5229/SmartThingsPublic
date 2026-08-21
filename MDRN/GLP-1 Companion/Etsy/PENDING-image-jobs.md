# Pending Higgsfield image jobs — GLP-1 Companion

Submitted 2026-08-21 and accepted (status `pending`), but the Higgsfield MCP
token expired before the results could be polled. The jobs were charged on
submission (~1.5 credits each, ~6 total) and complete server-side regardless —
they are retrievable by job ID once the connector is re-authorised.

Model: `nano_banana_2` · aspect ratio 1:1 (square, per the unconditional rule)

| # | Job ID | Shot |
|---|--------|------|
| 1 | 5d63076d-95e9-45d5-b431-3204069a7c7b | Hero backdrop — laptop with flat chroma-key GREEN screen on a pale desk, clean empty left 40% for the composited headline |
| 2 | edb4df11-585d-4367-a531-f0f62b4de0bf | Lifestyle "before" — Black woman, late 30s, overwhelmed at kitchen table with paper notebook + scattered boxes |
| 3 | cbdd76da-21b3-4f2c-befc-ab1ecb9cfbdf | Lifestyle "after" — SAME woman, same kitchen, calm and unhurried (character-continuity rule) |
| 4 | afa89a6c-c2bc-4ce5-ba62-40e6708c22af | Lifestyle 3 — white man, early 50s, at an appointment holding a printed question list (different person, per the diversity rule) |

## To resume
1. Re-authorise the Higgsfield connector (claude.ai → Settings → Connectors).
2. `show_generation_by_ids` with the four indexed job IDs above to pull the URLs.
3. Composite per the plan below — do NOT regenerate; these are already paid for.

## Compositing plan (unchanged)
- **Headline is composited locally in Hanken Grotesk**, the app's own display font,
  not rendered by the image model — so every image in the set shares one font,
  one weight, one colour treatment and one divider style.
  - Hero headline: `The Weeks The Scale Won't Show You` (accent word: SCALE, amber)
  - Divider: thin slate rule broken by a small drawn ring (the dose-ring motif,
    drawn as a real PIL shape — never a font dingbat, per the tofu pitfall)
  - Subtitle: `Dose Log · Protein First · How It Sat · Symptoms · Non-Scale Victories`
- **Hero screen**: perspective-warp `Etsy/screenshots/02_dashboard.png` into the green
  quad with `scripts/composite_greenscreen_mockup.py`. Inspect the green quad's corners
  first — the laptop is at a three-quarter angle, so this needs `mode="tilted"`, not `bbox`.
- **Text floor**: minimum 70px headline / 22px subtitle on a 1254px canvas
  (~5.6% and ~1.75% of canvas width). Applies to the lifestyle photos too — that is
  the exact place this floor has been skipped on two previous builds.
- **Lighting check**: all four were prompted for the same bright, soft, cool morning
  daylight on pale surfaces. Before shipping, compute mean brightness of each
  (`np.array(img.convert('RGB')).mean()`) and confirm none is >1.5x another.
