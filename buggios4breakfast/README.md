# Buggios4Breakfast — No. 1

A kid's-art portfolio built as a comic book issue. Four comic pages assemble
themselves from panels flying in as you scroll, each page comes to rest at its
own angle in 3D perspective, and any panel opens the full artwork.

**All artwork is placeholder** — the bugs are drawn live on canvas at load. When
real scans arrive, replace each panel's `<canvas>` with an `<img>` and drop the
file into `PIECES[n]` for the full-size view. Nothing else needs to change.

## Files

- `index.html` — the page source, published as a Claude artifact (no `<head>`;
  the artifact wrapper supplies the document scaffold).
- `site/index.html` — the same page as a standalone document (doctype, head,
  meta, favicon) for hosting. Generated from `index.html`; do not edit directly.

## Regenerating the standalone build

`site/index.html` is `index.html` wrapped in a document scaffold. Rebuild it
after editing the source rather than hand-editing both.
