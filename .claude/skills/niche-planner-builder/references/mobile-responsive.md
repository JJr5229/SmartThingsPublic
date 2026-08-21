# Mobile Responsiveness

Every one of these was a real bug found by testing the wedding planner at mobile widths, not a
theoretical concern. Write the CSS to avoid them the first time — it's much cheaper than discovering
them later.

## Anti-patterns and fixes

**1. Hardcoded grid columns on stat cards.**
Bad: `<div class="stat-grid" style="grid-template-columns: repeat(4, 1fr);">` — forces 4 equal
columns at every viewport width, so on a 375px phone each column becomes ~70px wide and text
truncates illegibly ("Confirmed" → "Confir").
Good: let the CSS class handle it with `repeat(auto-fit, minmax(140px, 1fr))` and never override
`grid-template-columns` inline per-instance. This collapses naturally to 2 columns, then 1, as the
viewport shrinks — no media query needed.

**2. Two-column layouts with a fixed-size child (e.g. a chart).**
A donut chart canvas or similar fixed-dimension element inside a `1fr 1fr` grid won't shrink below
its own minimum content size, so the grid track expands past its fair share and pushes its sibling
off-screen. Add an explicit override:
```css
@media (max-width: 700px) {
  .two-col-panel { grid-template-columns: 1fr !important; }
}
```

**3. Toolbars with several buttons in a row.**
`display: flex` without `flex-wrap: wrap` on a row of 4-5 buttons (search box, filter dropdown,
action buttons) will force horizontal overflow on narrow screens. Add `flex-wrap: wrap` to the row
**and** to any nested flex container within it — a wrapper div around just the action buttons needs
its own `flex-wrap: wrap` too, since wrapping doesn't cascade into nested flex contexts.

**4. Fixed-width sidebar-style layouts** (e.g. an "unassigned items" panel next to a main grid, like
a seating chart's unassigned-guest list beside the table grid).
```css
@media (max-width: 700px) {
  .split-layout { flex-wrap: wrap; }
  .split-layout .fixed-sidebar { width: 100% !important; }
}
```

**5. Wide data tables.** Wrap in a scrollable container so the table scrolls *within its card*
instead of breaking the page layout:
```css
.table-wrap { overflow-x: auto; border-radius: 10px; border: 1px solid var(--border); }
```

**6. Sidebar navigation itself.** At `max-width: 700px`, the sidebar should become an off-canvas
drawer (fixed position, slid off-screen, toggled by a hamburger button) with a dimming overlay —
not just squeeze down in place.

## Verification

Don't eyeball this — check it programmatically. After the app is built, drive a real browser at
375px width and click through every single nav item, checking for horizontal overflow on each:

```python
# Playwright pattern — see scripts/screenshot_app.py for the full setup
overflow_report = page.evaluate("""() => {
    var results = [];
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.click();
        var overflow = document.body.scrollWidth > window.innerWidth + 2;
        results.push({label: btn.textContent.trim(), overflow});
    });
    return results.filter(r => r.overflow);
}""")
# overflow_report should be an empty list. Anything in it is a real bug — go fix that section's CSS.
```

This single check (comparing `document.body.scrollWidth` to `window.innerWidth` after clicking into
every section) caught three separate real bugs in one pass last time, in about the time it takes to
write the loop. It's much faster and more reliable than screenshotting every page and eyeballing it.

If you're using the built-in preview/browser tool instead of a standalone Playwright script for a
quick spot-check, prefer its named presets (`mobile`, `tablet`, `desktop`) over custom
width/height values — custom desktop-ish widths have a confirmed rendering bug where content
renders at a fraction of its correct size in the corner of the viewport. The presets render
correctly; arbitrary custom sizes may not.
