# Landi Construction — Redesign

A second, visually distinct build of the Landi Construction & Handyman site.
The original (`landi-contractor-site` → `landi-contractor-site.vercel.app`) is
untouched and stays deployed — this is a parallel project so the two can be
compared side by side.

- **Client:** Landi Construction & Handyman, 5896 Jefferson Street NE, Fridley, MN 55432
- **License:** MN BC809633 · **Phone:** (612) 244-9041 · **Email:** landiconstruction57@gmail.com
- **Stack:** single-file static `index.html`, no build step, no dependencies
- **Languages:** English / Spanish toggle, persisted to `localStorage`

## What changed from v1

Same brand, same content, same gold-on-navy palette. The layout and motion were
rebuilt around visual concepts from the reference site
(`morningstar-remodeling.com`).

| | Original | This build |
| --- | --- | --- |
| Nav | Sticky bar, flat link row | Fixed transparent bar w/ blurred backdrop → solid on scroll; **hover dropdown menus** (Services / Company); pill "Call Now" CTA; animated burger → slide-down drawer with accordions |
| Hero | Left-aligned, fixed side gradient | Full-viewport (100dvh), centred display type, stacked dark gradients, slow Ken Burns drift + scroll parallax, "Scroll Down" cue |
| Trust | Static 4-up grid | Auto-scrolling credential marquee (pauses on hover) |
| About | — | New split intro section w/ clip-wipe image reveal and license badge |
| Services | 5-card grid | Alternating full-width image/copy bands, numbered 01–05, image un-zooms as each row enters |
| Why Us | 6 flat cards | **Sticky numbered benefits** — "Benefit .01" tags with an oversized outline keyword that swaps as you scroll |
| Process | 4 static cards | Timeline with a scroll-drawn connector line and dots that light up in sequence |
| Area | Map + tags | Map + tags + count-up stats |
| Global | Fade-up on some blocks | Scroll progress rail; staggered fade / slide / clip-wipe reveals throughout; `cubic-bezier(.19,1,.22,1)` easing everywhere |

Typography moved from Space Grotesk + Inter to **Sora + Manrope**, with a
**Great Vibes** script flourish — an echo of the reference's script accent, and
the fastest way to tell the two builds apart at a glance.

Also added: Open Graph / Twitter meta, `GeneralContractor` JSON-LD schema,
canonical URL, and real `alt` text on the service imagery.

## Imagery

Reuses the images already generated for the original build — nothing new was
generated. See `assets/README.md` for the seven files and how to pull them.
**They are not in this repo**; drop them in `assets/` before deploying.

## Accessibility & resilience

- Full `prefers-reduced-motion` path — every animation, parallax and marquee disables.
- Reveals are scoped to `.js`, so a blocked or failed script leaves the page fully
  visible rather than blank.
- `localStorage` is wrapped — blocked storage can't take the page down.
- Dropdowns work on hover, click, and keyboard; `Escape` closes them and the drawer.
- ARIA on the nav, drawer, dropdowns, language toggle, and burger.

## Deploy

Standard pipeline — copy the assets in first, then:

```powershell
& "C:\Users\jredm\.claude\skills\deploy-site\scripts\deploy-site.ps1" `
    -Path "<path>\landi-construction-redesign" `
    -Name "landi-construction-redesign"
```

Private repo + Vercel production, per the usual protocol. Do **not** deploy this
over the `landi-contractor-site` project.
