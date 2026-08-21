"""
Template: populate a niche-planner app with realistic sample data and capture crisp,
high-resolution screenshots of its key screens for marketing use.

Adapt before running:
  - APP_URL: point at your local static server serving the app's HTML file.
  - SAMPLE_DATA_JS: rewrite for your app's actual APP.* schema and module names.
  - SECTIONS: the nav-button labels (exact visible text) you want to screenshot, in order.
  - OUT_DIR: where to write the PNGs.

Requires: pip install playwright && playwright install chromium
"""

from playwright.sync_api import sync_playwright
import time

APP_URL = "http://localhost:8934/your-app.html"
OUT_DIR = "screenshots"
SECTIONS = ["Budget", "Guests", "Seating Plan"]  # replace with your app's real section labels

# Replace with sample data matching your app's actual APP object shape. Keep it realistic and
# FULLY populated — never screenshot a zero/empty state, it looks broken rather than aspirational.
SAMPLE_DATA_JS = r"""
() => {
  document.body.className = 'your-default-theme';
  APP.palette = 'your-default-theme';
  APP.details = { p1: 'Emily', p2: 'James', date: '2027-08-10' /* ...etc, match your schema */ };
  // ...populate every module your app has (budget, list items, etc.) with believable, non-zero data...
  save();
  hideWelcome();
  renderDashboard();  // call every render function your app exposes so the populated state actually shows
  return 'ready';
}
"""


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=2)
        page.goto(APP_URL, wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        page.evaluate(SAMPLE_DATA_JS)
        time.sleep(0.3)

        for label in SECTIONS:
            page.evaluate(
                """(text) => {
                    var btns = [...document.querySelectorAll('.nav-btn')];
                    var b = btns.find(x => x.textContent.trim() === text);
                    if (b) b.click();
                }""",
                label,
            )
            time.sleep(0.3)
            fname = f"{OUT_DIR}/{label.lower().replace(' ', '_')}.png"
            page.screenshot(path=fname)
            print("saved", fname)

        browser.close()


def check_mobile_overflow(app_url=APP_URL):
    """Quick standalone check: any section that overflows a 375px viewport gets flagged.
    Run this after building the app, before spending time on marketing screenshots."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 375, "height": 812})
        page.goto(app_url, wait_until="networkidle")
        page.evaluate(SAMPLE_DATA_JS)
        results = page.evaluate("""() => {
            var out = [];
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.click();
                var overflow = document.body.scrollWidth > window.innerWidth + 2;
                out.push({label: btn.textContent.trim(), overflow});
            });
            return out.filter(r => r.overflow);
        }""")
        browser.close()
        if results:
            print("MOBILE OVERFLOW FOUND:", results)
        else:
            print("No mobile overflow detected across any section.")
        return results


if __name__ == "__main__":
    main()
