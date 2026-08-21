# Demo Videos

## Default to real screen-capture, not AI-generated video

This is a strong default, not a minor preference. AI image-to-video (tested with Kling and with
Higgsfield's Marketing Studio) animating a static screenshot reads as "the camera is panning around
a still picture" — it doesn't actually demonstrate that the software works, which is the entire
point of a demo video for a digital tool. Real Playwright screen-recording of genuine interactions
is both more convincing *and* free of AI-video's cost and artifact risk.

Specifically avoid Higgsfield Marketing Studio's `product_showcase` (or similar) pipeline when the
input is a software/UI screenshot rather than a physical product photo — that pipeline does a
product-isolation/background-segmentation step built for photos of physical objects, and reliably
failed with an HTTP 500 on a UI screenshot input while still charging credits for the attempt.

If the user specifically wants AI-generated video, that's a reasonable thing to build — just follow
the credit-safety note at the bottom of this file.

## Standing requirements — confirmed by the user, apply to every build

- **Produce exactly 2 videos per planner, each targeting the full 15-second Etsy cap** (not "1, or 2
  if there's enough content" — always 2). Budget distinct content across the two rather than
  repeating the same beat twice — e.g. video 1 can center on the opening flow + signature-feature
  interaction, video 2 can go deeper on a second module or a different interaction, but both must
  independently satisfy the required opening sequence below.
- **Every video opens the same way: welcome/onboarding screen → fill it out with real typed input →
  transition into the Dashboard.** This is the opposite of an earlier version of this doc, which said
  to hide the welcome screen and start straight on the dashboard — the user corrected this directly:
  they want every video to open on the welcome screen, show it being genuinely filled out (real
  `.type()` calls with a per-character delay into whatever fields the onboarding form has — event
  name, date, location, etc.), then a real submit/continue action that transitions into the Dashboard.
  Do not skip or hide the welcome screen anymore; it is now the mandatory opening beat, not something
  to route around.
- **Color palettes must cycle during the video** — at some point after the opening sequence, show a
  real, cursor-visible click on a palette/theme swatch (or several in sequence) so the viewer watches
  the whole UI re-color live. If the app has more than 2 palettes, cycling through 2-3 in the available
  time is better than just one swap, as long as it fits the duration budget — don't rush it so much
  that individual swaps aren't visible on screen for at least a beat.

## What else to show

Beyond the mandatory opening (welcome → fill out → dashboard) and the mandatory palette cycling, fill
the remaining time with genuine interactions that prove the product does something a spreadsheet/
paper list can't:
- Type a value into a field and watch a chart or total update live.
- Type into a search/filter box and watch a list narrow in real time.
- A real drag-and-drop (assigning something to a category, a seat, a slot) — center at least one of
  the two videos on this build's signature feature if it's a drag-and-drop interaction.

Each of these should be an **actual** interaction — real `.click()`, real `.type()` with a per-
character delay so typing is visible — not a instant `page.evaluate()` state change. A palette
switch triggered silently via JS in the background (with no visible click) reads as an unexplained,
buggy color change rather than a deliberate feature demo — always drive it through a real,
cursor-visible click.

## The synthetic cursor

Headless Playwright doesn't render a visible mouse pointer. Inject a small fixed-position element
and move it explicitly before each action so the recording reads as "someone using this":

```python
CURSOR_JS = """
() => {
  var c = document.createElement('div');
  c.id = 'fake-cursor';
  c.style.cssText = 'position:fixed;width:22px;height:22px;border-radius:50% 50% 50% 0;' +
    'background:rgba(40,20,20,0.85);border:2px solid white;' +
    'transform:translate(-4px,-4px) rotate(-45deg);z-index:999999;pointer-events:none;' +
    'left:-100px;top:-100px;' +
    'transition:left 0.55s cubic-bezier(.4,0,.2,1), top 0.55s cubic-bezier(.4,0,.2,1);' +
    'box-shadow:0 2px 6px rgba(0,0,0,0.35);';
  document.body.appendChild(c);
}
"""
def move_cursor(page, x, y, dur=0.6):
    page.evaluate("(a) => { var c=document.getElementById('fake-cursor'); "
                   "c.style.left=a.x+'px'; c.style.top=a.y+'px'; }", {"x": x, "y": y})
    time.sleep(dur)  # let the CSS transition actually play before the click fires
```

Add a click-ripple effect too, and make its color **theme-aware** rather than a fixed hex value —
sample the page's current `--primary` custom property at click time so the ripple never clashes
with whichever palette happens to be active:

```python
def click_ripple(page, x, y):
    page.evaluate("""(a) => {
        var primary = getComputedStyle(document.body).getPropertyValue('--primary').trim();
        var r = document.createElement('div');
        r.style.cssText = 'position:fixed;left:'+a.x+'px;top:'+a.y+'px;width:10px;height:10px;' +
          'margin:-5px;border-radius:50%;background:'+primary+';opacity:0.5;z-index:999998;' +
          'pointer-events:none;transition:all 0.5s ease-out;';
        document.body.appendChild(r);
        requestAnimationFrame(()=>{ r.style.width='60px'; r.style.height='60px'; r.style.margin='-30px'; r.style.opacity='0'; });
        setTimeout(()=>r.remove(), 600);
    }""", {"x": x, "y": y})
```

## Recording setup — avoid the zoom trap

Use a real 1:1 viewport equal to your desired output resolution. **Do not** apply a CSS `zoom` or
similar scaling trick to try to get "higher resolution" video by rendering at a scaled-up viewport
and zooming — this caused a genuinely hard-to-diagnose bug: the zoom, applied via a delayed
`page.evaluate()` call after page load, meant the page rendered at 1x for a moment before jumping to
the correct scale (a visible "starts small then jumps" artifact), and then applied inconsistently
across different in-app pages during the same recording. Just set `viewport` and
`record_video_size` to the same real numbers and record at that resolution directly.

```python
context = browser.new_context(
    viewport={"width": 1280, "height": 1150},
    record_video_dir="output/videos",
    record_video_size={"width": 1280, "height": 1150},
)
```

**Wait for fonts before recording anything meaningful.** Web font swap (FOUT — the browser shows a
fallback font immediately, then swaps to the real web font once it loads) causes a visible text
resize jump on camera if you don't wait for it:
```python
page.goto(url, wait_until="networkidle")
page.evaluate("document.fonts.ready")  # await this before any interaction/reveal
```

## The welcome screen is now always shown and filled out — don't hide it

An earlier version of this doc had a technique for hiding the welcome/onboarding overlay via response
interception, for a clip that should start straight on the dashboard. **That's no longer the default
— the user wants every video to open on the welcome screen and show it being filled out**, per the
standing requirement above. Keep the route-interception technique in mind only for the opposite,
narrower case: if the app's welcome screen has a distracting animation, autoplay video, or slow
transition you need to neutralize/speed up before recording the fill-out sequence, intercepting the
HTML response (before Chromium parses anything) is still the reliable way to inject a style/script
override — `page.add_init_script()` or a post-`domcontentloaded` `page.evaluate()` both lose the race
against first paint for anything that needs to apply before the very first frame renders:
```python
def patch_html_via_route(page, style_or_script_tag):
    def handler(route):
        response = route.fetch()
        body = response.text().replace("<head>", "<head>" + style_or_script_tag, 1)
        route.fulfill(response=response, body=body)
    page.route("**/your-app.html", handler)
```

## Duration budgeting for Etsy (15-second cap)

- Verify final duration with `ffprobe`/`ffmpeg` after muxing — don't trust your sleep-time math.
  This environment typically has no system ffmpeg; the `imageio-ffmpeg` PyPI package bundles a
  portable binary (`imageio_ffmpeg.get_ffmpeg_exe()`) that works well for webm→mp4 conversion and
  duration checks.
- Run-to-run timing has real variance from page-load/evaluate round trips — trimming 0.5s of sleep
  time doesn't reliably trim exactly 0.5s of output duration. Leave genuine margin (aim for ~14s,
  not 14.9s) and re-verify after each timing change rather than cutting it to the exact limit.
- Always producing 2 videos for one listing (see the standing requirement above) — budget distinct
  content across both rather than cramming everything into one or repeating the same beat twice.
  Both still need the mandatory welcome-fill-out → dashboard opening and palette cycling; vary the
  interaction(s) that fill the remaining time between the two (e.g. video 1 proving the signature
  drag-and-drop feature, video 2 showing a different module's live-updating field or filter).

See `scripts/record_demo.py` for the full working pattern combining all of the above.

## Vertical short-form video (Shorts / Reels / TikTok) — Phase 4b

One per planner, in addition to the two Etsy videos. Key differences from the Etsy videos:

- **Format: 9:16 vertical, 25 seconds** (aim ~24-25s and verify with ffprobe; the Etsy 15-second
  cap does not apply — this is a social asset, not a listing upload).
- **Ask the user which features to include before designing it** — this is a required checkpoint
  (see SKILL.md Phase 4b). Propose the signature feature + the 2-3 most niche-unique modules as a
  starting lineup; record only what they confirm.
- **Viewport:** record the app's own mobile-responsive layout in a true vertical frame. Two working
  options: `viewport={"width": 1080, "height": 1920}` with `device_scale_factor=1` if the app's
  breakpoints read well at 1080 CSS px wide, or a real mobile-width viewport (e.g. 390x694, the
  9:16 ratio at phone width) with `record_video_size={"width": 1080, "height": 1920}` so Playwright
  upscales the capture — pick whichever renders the mobile layout the app was actually verified at.
  Don't crop a desktop-width recording down to 9:16; that shows a broken-looking sliver of a
  desktop layout instead of the real mobile UI.
- **Pacing & structure — hook, beats, payoff.** Social viewers scroll fast, so the opening frame has
  to sell instantly. This four-part shape tested well and is the recommended default:
  - **Open on an ALIVE, pre-seeded dashboard — never an empty Day-1 state.** The Etsy videos build
    state live from the welcome fill-out, but this video skips that fill-out, so if you just load the
    app the "hook" is a zero-state dashboard (0 streak, empty chart, "—" stats) that sells nothing.
    Pre-populate a realistic saved session *before recording* with
    `context.add_init_script("try{localStorage.setItem('<appKey>', <json>)}catch(e){}")` setting the
    app's storage key to a rich `APP` object (a few days of history so the streak, average stats, and
    the signature chart all read full on frame one). It runs before first paint, so frame one is a
    premium, populated dashboard — and it's legitimate (the app's own saved-state, not a faked
    on-camera change). Compute any relative dates (start date, log dates) off the machine clock so
    "Day N" and streaks line up, and leave *today's* entries unfilled so the on-camera taps still add
    something visible.
  - **A 1-2s motion hook:** a real palette-swatch click that recolors the whole UI reads as "premium,
    customizable app" in under a second — a strong opener. (Still NOT the welcome-screen fill-out;
    that's the Etsy pair's requirement, not this one.)
  - **3-4 feature beats of ~5-6s each**, one per confirmed feature, each a real visible interaction,
    centered on the signature feature.
  - **A payoff end-card:** return to the branded dashboard *after* the interactions so the closing
    frame shows their effect (streak ticked up, completion % risen, the signature chart visibly grown
    against its baseline) — a satisfying, screenshot-able "look what you built" beat, far better than
    ending on an arbitrary screen.
- Everything else carries over unchanged: synthetic cursor + theme-aware click ripple, real
  `.click()`/`.type()` per-character interactions, `document.fonts.ready` before recording, no CSS
  zoom tricks, ffprobe duration verification, re-record after visual changes to shown sections.
- **Verify the final beat lands *before* the cap.** If you record longer than the target and trim
  with ffmpeg `-t 25`, an overrun silently cuts the LAST feature — the file still reports 25.00s, so
  duration alone won't catch it. After recording, extract a frame near the end (~23-24s) and confirm
  the closing feature is actually on screen before the cut; if not, drop a palette swap / a scroll /
  shorten typed text and re-record. Mobile hamburger nav (open drawer → tap item → drawer closes)
  plus smooth scrolls eat more wall-clock than the sleep math suggests, so this overrun is common on
  the first take. (A ≤700px-wide portrait viewport upscaled to 1080x1920 via ffmpeg
  `scale=1080:1920:flags=lanczos` is one reliable way to hit the mobile layout at output resolution.)

## Credit safety (if generating AI video/images instead of, or alongside, screen-capture)

Before any paid generation, check cost first (`get_cost: true` or the tool's cost-preflight option).
If a generation call errors, **do not immediately retry the identical call** — check the account
balance/transaction history first. A real incident this session: two failed "product_showcase"
generations against a UI screenshot both returned HTTP 500 with no output, but both were charged in
full (150 credits total, zero deliverables). If this happens: stop, don't retry the same broken
path, and write up a short plain-text incident report (timestamps, exact params sent, transaction
IDs, credit amounts) that the user can hand directly to support — this session's actual report is a
good template to reuse.
