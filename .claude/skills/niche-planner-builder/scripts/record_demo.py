"""
Template: record a real screen-capture demo video of genuine interaction in a niche-planner app —
typing a value and watching something update live, filtering a list, a real drag-and-drop, or a
palette-swatch click. No AI video generation involved; see references/demo-videos.md for why.

Adapt before running:
  - APP_URL, OUT_DIR
  - SAMPLE_DATA_JS: your app's real schema (see screenshot_app.py's copy of this same note)
  - The interaction sequence in main() — this file demos a "type a number, watch a chart update"
    beat as a worked example; swap in whatever proves YOUR app's value fastest.

Requires: pip install playwright imageio-ffmpeg && playwright install chromium
"""

from playwright.sync_api import sync_playwright
import imageio_ffmpeg
import subprocess
import time

APP_URL = "http://localhost:8934/your-app.html"
VIDEO_DIR = "video_raw"
OUT_MP4 = "demo.mp4"

SAMPLE_DATA_JS = r"""
() => {
  document.body.className = 'your-default-theme';
  APP.palette = 'your-default-theme';
  // ...populate realistic sample data, matching your app's schema...
  save();
  hideWelcome();
  renderDashboard();
  return 'ready';
}
"""

CURSOR_JS = r"""
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
    page.evaluate(
        "(a) => { var c=document.getElementById('fake-cursor'); c.style.left=a.x+'px'; c.style.top=a.y+'px'; }",
        {"x": x, "y": y},
    )
    time.sleep(dur)  # let the CSS transition actually play before the click fires


def click_ripple(page, x, y):
    # Theme-aware: samples the page's own --primary color so the ripple never clashes with
    # whichever palette happens to be active.
    page.evaluate(
        """(a) => {
        var primary = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#B08080';
        var r = document.createElement('div');
        r.style.cssText = 'position:fixed;left:'+a.x+'px;top:'+a.y+'px;width:10px;height:10px;' +
          'margin:-5px;border-radius:50%;background:'+primary+';opacity:0.5;z-index:999998;' +
          'pointer-events:none;transition:all 0.5s ease-out;';
        document.body.appendChild(r);
        requestAnimationFrame(()=>{ r.style.width='60px'; r.style.height='60px'; r.style.margin='-30px'; r.style.opacity='0'; });
        setTimeout(()=>r.remove(), 600);
    }""",
        {"x": x, "y": y},
    )


def center(box):
    return box["x"] + box["width"] / 2, box["y"] + box["height"] / 2


def hide_welcome_via_route(page, app_filename_glob):
    """Reliable FOUC-free way to start a clip on the dashboard instead of the welcome screen —
    intercepts the HTML response and injects the hide-style before Chromium parses anything.
    Both add_init_script and a post-load evaluate() call lose the race against first paint."""

    def handler(route):
        response = route.fetch()
        body = response.text().replace(
            "<head>", "<head><style>#welcome-overlay{display:none !important;}</style>", 1
        )
        route.fulfill(response=response, body=body)

    page.route(app_filename_glob, handler)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            # Real 1:1 viewport = record size. Do NOT apply a CSS zoom trick to fake higher
            # resolution — it caused a real "starts small then jumps" bug and inconsistent
            # scaling across pages in testing. See references/demo-videos.md.
            viewport={"width": 1280, "height": 1000},
            record_video_dir=VIDEO_DIR,
            record_video_size={"width": 1280, "height": 1000},
        )
        page = context.new_page()
        page.goto(APP_URL, wait_until="networkidle")
        page.evaluate("document.fonts.ready")  # avoid a visible text-size jump from web-font swap
        page.evaluate(SAMPLE_DATA_JS)
        page.evaluate(CURSOR_JS)
        time.sleep(0.5)

        # ---- Worked example: navigate to a module, type a value, watch something update live ----
        # Replace this whole block with whatever interaction best proves YOUR app's value.
        nav_btn = page.locator(".nav-btn", has_text="Budget")
        box = nav_btn.bounding_box()
        cx, cy = center(box)
        move_cursor(page, cx, cy, 0.55)
        click_ripple(page, cx, cy)
        nav_btn.click()
        time.sleep(1.0)

        target_input = page.locator("#some-live-updating-field")  # replace selector
        box = target_input.bounding_box()
        cx, cy = center(box)
        move_cursor(page, cx, cy, 0.6)
        click_ripple(page, cx, cy)
        target_input.click()
        target_input.fill("")
        target_input.type("2500", delay=190)  # visible, legible per-character typing
        page.keyboard.press("Tab")
        time.sleep(2.0)  # hold on the updated result so the viewer can register it

        context.close()  # finalizes the .webm file
        browser.close()

    # ---- Convert to mp4 and verify duration against Etsy's 15s cap ----
    import glob

    webm = sorted(glob.glob(f"{VIDEO_DIR}/*.webm"))[-1]
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    subprocess.run(
        [
            ffmpeg, "-y", "-i", webm,
            "-c:v", "libx264", "-preset", "medium", "-crf", "18",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT_MP4,
        ],
        check=True,
    )
    probe = subprocess.run([ffmpeg, "-i", OUT_MP4], capture_output=True, text=True)
    print(probe.stderr)  # duration line is in stderr — read it, don't assume your sleep math was right


if __name__ == "__main__":
    main()
