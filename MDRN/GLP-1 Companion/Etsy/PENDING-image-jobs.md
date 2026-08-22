# Pending imagery — GLP-1 Companion (Phases 3 and 3b)

## Status: images GENERATED and PAID FOR. Blocked only on network access.

The four Higgsfield jobs submitted 2026-08-21 have **completed**. The connector is
re-authorised and the jobs were retrieved successfully — `show_generation_by_ids`
returns `all_found: true`, `status: completed` for all four.

**Do not regenerate these. They exist and are paid for.**

The remaining blocker is different from the original one: this session's network
policy denies the Higgsfield CDN host, so the bytes cannot be downloaded here.

```
$ curl https://d8j0ntlcm91z4.cloudfront.net/...
curl: (56) CONNECT tunnel failed, response 403
```

The proxy relay log confirms a policy denial, not a transient failure:
`connect_rejected  d8j0ntlcm91z4.cloudfront.net:443`

Reachable from this environment: github.com, raw.githubusercontent.com,
api.github.com, s3.amazonaws.com, storage.googleapis.com, fonts.gstatic.com,
package registries. Everything else is denied — it is an allowlist.

## Resolved image URLs (no need to re-query Higgsfield)

Base: `https://d8j0ntlcm91z4.cloudfront.net/user_3FcBTDEZMCROpBK3unX0E1xh16T/`

| # | File | Shot |
|---|------|------|
| 1 | `hf_20260821_210038_5d63076d-95e9-45d5-b431-3204069a7c7b.png` | Hero backdrop — laptop with flat chroma-key GREEN screen, pale desk, clean empty left 40% |
| 2 | `hf_20260821_210038_edb4df11-585d-4367-a531-f0f62b4de0bf.png` | Lifestyle "before" — Black woman, late 30s, overwhelmed at kitchen table |
| 3 | `hf_20260821_210038_cbdd76da-21b3-4f2c-befc-ab1ecb9cfbdf.png` | Lifestyle "after" — SAME woman, same kitchen, calm |
| 4 | `hf_20260821_210038_afa89a6c-c2bc-4ce5-ba62-40e6708c22af.png` | Lifestyle 3 — white man, early 50s, at an appointment with a printed question list |

All four are 1024x1024 PNG. Verified server-side while they were reachable from a
remote sandbox:

- Mean brightness: 181.9 / 146.0 / 166.1 / 165.4 → spread **1.25x**, inside the
  1.5x lighting-consistency limit. The set is cohesive; no reshoot needed.

## To resume

1. Add `d8j0ntlcm91z4.cloudfront.net` to the environment's network policy allowlist.
   (Network policy is chosen when the environment is created — see
   https://code.claude.com/docs/en/claude-code-on-the-web — so this may need the
   environment config updated and a fresh session, not a live toggle.)
   Alternative with no policy change: download the four URLs in a browser and
   attach the PNGs to the session.
2. Verify with `curl -sS -o /dev/null -w "%{http_code}"` on image 1. Expect 200.
3. Composite per the plan below.

## Compositing plan (unchanged)

- **Headline is composited locally in Hanken Grotesk**, the app's own display font,
  not rendered by the image model — so every image in the set shares one font,
  one weight, one color treatment and one divider style.
  - Hero headline: `The Weeks The Scale Won't Show You` (accent word: SCALE, amber #C67A1E)
  - Divider: thin slate rule broken by a small drawn ring (the dose-ring motif,
    drawn as a real PIL shape — never a font dingbat, per the tofu pitfall)
  - Subtitle: `Dose Log · Protein First · How It Sat · Symptoms · Non-Scale Victories`
- **Hero screen**: perspective-warp `Etsy/screenshots/02_dashboard.png` into the green
  quad with `scripts/composite_greenscreen_mockup.py`. Inspect the green quad's corners
  first — the laptop is at a three-quarter angle, so this needs `mode="tilted"`, not `bbox`.
- **Text floor**: minimum 70px headline / 22px subtitle on a 1254px canvas
  (~5.6% and ~1.75% of canvas width). Applies to the lifestyle photos too — that is
  the exact place this floor has been skipped on two previous builds.

## Phase 3b is blocked by the same thing

`references/feature-slides.md` makes a photorealistic device mockup **mandatory** on
every feature slide, each with a **unique** backdrop scene — flat CSS bezels are
explicitly deprecated for final listing images and need explicit user sign-off to
ship. So the 7 feature slides need ~7 more generated backdrops, which needs the same
network access. Budget roughly 7 more generations (~11 credits; balance was 614).

Slide plan — distinct screenshot AND distinct backdrop per slide, decided up front
per the no-duplication rule:

| Slide | Screenshot | Backdrop scene |
|-------|-----------|----------------|
| 04 | Daily Log (signature) | pale desk, morning window light, glass of water |
| 05 | How It Sat | kitchen counter, wooden board, herbs |
| 06 | Symptoms chart | bedside table, evening lamp, dark palette on screen |
| 07 | Dose Log | clean shelf, minimal, cool light |
| 08 | Measurements + Strength | gym bench corner, matte surfaces |
| 09 | Welcome / onboarding screen | armchair side table, soft daylight |
| 10 | Mobile dashboard (phone) | café table, phone propped |

Note slide 09 deliberately uses the welcome screen rather than repeating a module —
per the rule that running out of modules means using a genuinely different SCREEN,
never a recolored repeat.
