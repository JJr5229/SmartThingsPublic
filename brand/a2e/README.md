# A2E — logo, round 1

Exploration of an **A2E** lettermark with a phoenix worked into the negative
space between the characters.

## The idea

Three moves carry the phoenix, none of which break the letters:

1. **The `2` is the head.** Its bowl terminal is cut to a point (a beak) and an
   eye is knocked out of the bowl. The glyph still reads as a 2; with the eye it
   also reads as a firebird looking left.
2. **The gaps are the wings.** The `2`'s base bar is splayed left and right so
   both inter-letter gaps close to a point at the baseline and open upward —
   two tapered flame/wing shapes flanking the head.
3. **Everything else stays quiet.** Heavy geometric letterforms, no ornament, so
   the mark survives being shrunk.

## Files

| File | Use |
|---|---|
| `a2e-wordmark-phoenix.svg` | **Primary.** Mono, `currentColor`. |
| `a2e-wordmark-phoenix-ember.svg` | Ember gradient on dark. |
| `a2e-wordmark-phoenix-long.svg` | Longer beak — more bird, slightly less `2`. |
| `a2e-wordmark-plain.svg` | Quiet variant: no eye or beak, wing gaps only. |
| `a2e-emblem-phoenix.svg` | Standalone firebird for icons/avatars. |
| `a2e-emblem-phoenix-ember.svg` | Emblem, ember on dark. |

Mono files use `fill="currentColor"` — set `color` on the parent to recolor.

## Construction

Geometry is generated, not hand-drawn, so proportions stay adjustable:
cap height 360, stroke weight 84, A width 430. The wordmark is a single
`fill-rule="evenodd"` path (the eye and the A's counter are subpath holes).

## Known limits / next steps

- A *fully literal* phoenix hidden only in the gaps does not work at wordmark
  scale — the gaps are open to the background at top and bottom, so a silhouette
  has nothing to bound it. Earlier attempts at this degraded the letterforms
  badly. The head-plus-wings reading above is the version that survives.
- The emblem's feather splits go muddy below ~64px; it needs a simplified
  solid-wing variant for favicons.
- Colour is a placeholder ember gradient. Not yet a palette.
- Not yet done: wordmark/emblem lockups, clear-space and min-size rules,
  a horizontal one-colour reversed test, real optical kerning review.
