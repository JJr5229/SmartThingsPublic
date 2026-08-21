# Screenshots for Marketing

## Why Playwright, not the built-in preview tool

The built-in preview browser's screenshot tool has a confirmed bug at custom (non-preset) desktop
viewport sizes: content renders tiny and mis-positioned in the corner of the frame instead of
filling it. Its named presets (`mobile`, `tablet`) render correctly, but for marketing screenshots
you usually want a specific desktop resolution and full control over device pixel ratio — use a
standalone Playwright script instead. It's also what you need anyway for demo video recording, so
the setup is shared.

## The pattern

1. Start (or reuse) a static file server for the app.
2. Launch headless Chromium with a real fixed viewport and `device_scale_factor=2` for crisp,
   retina-quality output.
3. Populate `APP` with **realistic, fully-filled-in sample data** via `page.evaluate()` — call the
   app's own render functions afterward (`renderDashboard()`, `renderBudget()`, etc. — whatever the
   app names them) rather than trying to simulate every UI interaction that would normally produce
   that state.
4. Never screenshot the zero/empty state for marketing purposes — "$0 / 0 guests / 0%" reads as
   broken or unfinished, not aspirational. Use a believable persona (a named couple/host/family) and
   numbers that tell a good story (a budget that's partially spent with a live chart, a guest list
   with a realistic mix of confirmed/pending/declined, etc.).
5. Navigate to each section via a real click on its nav button (not just toggling a CSS class) so
   any section-specific render logic actually fires.
6. Screenshot at 2x scale, then downscale/compress only if the final marketing tool requires it —
   start from the highest-quality capture you can get.

See `scripts/screenshot_app.py` for a working template. Adapt the sample-data object and the
section names/selectors to the new niche's modules; keep the launch/capture logic as-is.

## Debugging: dynamically-created UI (e.g. "Add" modals)

When testing an interaction that appears to silently do nothing (a click that should open a modal
but the page looks unchanged), don't assume the selector you guessed is right and move on — check
what's actually in the DOM. A generic "quick add" modal helper commonly creates its dialog on the
fly with an id like `qa-modal` rather than using a pre-existing hidden element, so a selector like
`#modal-guest` (matching a different, static modal) or a guessed class won't find it. Verify with:

```js
[...document.body.children].map(c => ({tag: c.tagName, id: c.id, cls: c.className}))
```

This shows you every top-level element actually in the page, including anything created at runtime.
Once you see the real id/class, target it directly. Don't burn time re-trying the same wrong
selector — one query against `document.body.children` settles it immediately.

## Choosing which screens to capture

Pick 2-4 screens that make the "this isn't a spreadsheet" case as directly as possible for this
specific niche — a data visualization (chart, progress bar), a list-management view (search/filter,
status badges), and if the niche has one, a genuinely novel interaction (drag-and-drop, a visual
layout tool). Skip screens that look like generic forms — those don't sell.
