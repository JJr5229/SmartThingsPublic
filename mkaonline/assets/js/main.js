/* ==========================================================================
   MKA Consulting — site behavior
   Vanilla ES2019+. No dependencies, no build step, no external requests.
   Every feature degrades to working HTML if this file fails to load.
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ----------------------------------------------------------------------
     Header: solid background + scroll progress, batched into one rAF
     ---------------------------------------------------------------------- */
  (function header() {
    var el = $(".site-header");
    var bar = $(".scroll-progress");
    var alwaysSolid = document.body.dataset.header === "solid";
    var ticking = false;

    function paint() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;

      if (el && !alwaysSolid) {
        el.classList.toggle("is-solid", y > 40);
      }

      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(paint);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    paint();
  })();

  /* ----------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */
  (function mobileNav() {
    var toggle = $(".nav-toggle");
    var nav = $("#primary-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 940) setOpen(false);
    });
  })();

  /* ----------------------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------------------- */
  (function reveal() {
    var items = $$("[data-reveal]");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    items.forEach(function (el, i) {
      // Stagger siblings within the same grid/row for a cascading entrance.
      var group = el.getAttribute("data-reveal");
      if (group === "stagger") {
        var sibs = $$('[data-reveal="stagger"]', el.parentElement);
        el.style.setProperty("--reveal-delay", sibs.indexOf(el) * 90 + "ms");
      } else if (group && !isNaN(parseInt(group, 10))) {
        el.style.setProperty("--reveal-delay", parseInt(group, 10) + "ms");
      }
      io.observe(el);
    });
  })();

  /* ----------------------------------------------------------------------
     Count-up numbers. The HTML always contains the final value, so the
     number is correct with JS off or when animation is suppressed.
     ---------------------------------------------------------------------- */
  (function counters() {
    var nums = $$("[data-count]");
    if (!nums.length || reduceMotion || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          io.unobserve(el);

          var target = parseFloat(el.getAttribute("data-count"));
          if (isNaN(target)) return;
          var suffix = el.getAttribute("data-suffix") || "";
          var prefix = el.getAttribute("data-prefix") || "";
          var start = performance.now();
          var dur = 1500;

          (function tick(now) {
            var p = Math.min((now - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          })(start);
        });
      },
      { threshold: 0.5 }
    );

    nums.forEach(function (el) {
      io.observe(el);
    });
  })();

  /* ----------------------------------------------------------------------
     Accordion — progressive enhancement over a plain heading + panel
     ---------------------------------------------------------------------- */
  (function accordion() {
    $$(".acc-trigger").forEach(function (trigger) {
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      if (!panel) return;

      trigger.addEventListener("click", function () {
        var open = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!open));
        panel.dataset.open = String(!open);
      });
    });
  })();

  /* ----------------------------------------------------------------------
     Store filter chips
     ---------------------------------------------------------------------- */
  (function storeFilter() {
    var chips = $$("[data-filter]");
    var items = $$("[data-category]");
    var status = $("#filter-status");
    if (!chips.length || !items.length) return;

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var value = chip.getAttribute("data-filter");
        chips.forEach(function (c) {
          c.setAttribute("aria-pressed", String(c === chip));
        });

        var shown = 0;
        items.forEach(function (item) {
          var cats = (item.getAttribute("data-category") || "").split(/\s+/);
          var match = value === "all" || cats.indexOf(value) !== -1;
          item.classList.toggle("is-hidden", !match);
          if (match) shown++;
        });

        if (status) {
          status.textContent =
            shown + (shown === 1 ? " resource" : " resources") + " shown.";
        }
      });
    });
  })();

  /* ----------------------------------------------------------------------
     License Finder
     A small decision graph. Answers route to a recommended MN license type
     and the MKA resource that matches it.

     NOTE FOR MAINTAINERS: the routing below reflects Minnesota's home care
     licensure structure at time of build. Verify against current MDH
     guidance before publishing, and keep the on-screen disclaimer.
     ---------------------------------------------------------------------- */
  (function licenseFinder() {
    var root = $("#license-finder");
    if (!root) return;

    var barFill = $(".finder__bar-fill", root);
    var stepsWrap = $(".finder__steps", root);

    var RESULTS = {
      basic: {
        badge: "Recommended path",
        title: "Minnesota Basic Home Care License",
        body:
          "Basic licensure covers home management and assistance with activities of daily living — homemaking, bathing and dressing assistance, and similar non-skilled support — delivered in a client’s own home.",
        needs: [
          "A policy manual covering administration, client care, personnel and infection control",
          "A complete client and personnel forms package",
          "Documented staff training and competency records",
        ],
        resource: "MN Basic License Forms Package + Basic Licensing Policy Manual",
        href: "store.html#basic",
      },
      comprehensive: {
        badge: "Recommended path",
        title: "Minnesota Comprehensive Home Care License",
        body:
          "Comprehensive licensure is required when you provide skilled nursing, assessments, delegation, medication administration or therapies in a client’s home — anything beyond basic assistance.",
        needs: [
          "A comprehensive policy manual meeting current Home Health requirements",
          "Assessment, care planning and nurse supervision forms",
          "Quality management and outcome measurement processes",
        ],
        resource:
          "Comprehensive License Tool Kit — policy manual paired with the full forms package",
        href: "store.html#comprehensive",
      },
      assisted: {
        badge: "Recommended path",
        title: "Minnesota Assisted Living Facility License",
        body:
          "If you operate the building where residents live and provide or arrange their services, you fall under assisted living facility licensure rather than home care licensure alone.",
        needs: [
          "An assisted living policy manual",
          "Resident contracts and the Bill of Rights, correctly executed",
          "Resident assessment, service plan and change-in-service documentation",
        ],
        resource:
          "MN Assisted Living License Policy Manual + Assisted Living Agreement Packet",
        href: "store.html#assisted-living",
      },
      pca: {
        badge: "Recommended path",
        title: "PCA / PCA Choice Provider Requirements",
        body:
          "Personal Care Assistance billed through Medical Assistance carries its own enrollment, documentation and supervision requirements on top of your license.",
        needs: [
          "PCA and PCA Choice service agreements and time documentation",
          "Qualified professional supervision records",
          "Enrollment and billing compliance documentation",
        ],
        resource: "PCA & PCA Choice Services Forms Package",
        href: "store.html#pca",
      },
      hcbs245d: {
        badge: "Recommended path",
        title: "245D Home and Community-Based Services License",
        body:
          "Services for people with disabilities delivered under a Medicaid waiver are governed by Minnesota Statutes chapter 245D, with its own policy, service-planning and reporting requirements.",
        needs: [
          "245D-specific policies and procedures",
          "Service planning, outcome and progress documentation",
          "Maltreatment reporting and staff orientation records",
        ],
        resource: "245D Licensing Policies and Forms",
        href: "store.html#245d",
      },
    };

    // step id -> { question, options: [{ label, next | result }] }
    var GRAPH = {
      q1: {
        q: "Where will your services be delivered?",
        options: [
          { label: "In the client’s own home or apartment", next: "q2" },
          {
            label: "In a facility we own or operate, where residents live",
            result: "assisted",
          },
          {
            label:
              "Community or day settings for people with disabilities, under a waiver",
            result: "hcbs245d",
          },
        ],
      },
      q2: {
        q: "What level of service will you provide?",
        options: [
          {
            label:
              "Homemaking and assistance with daily living — no skilled nursing",
            result: "basic",
          },
          {
            label:
              "Skilled nursing, assessments, delegation or medication administration",
            result: "comprehensive",
          },
          {
            label: "Personal care assistance billed to Medical Assistance",
            result: "pca",
          },
        ],
      },
    };

    var history = [];
    var TOTAL = 2; // longest path, used for the progress bar

    function esc(str) {
      return String(str).replace(/[&<>"']/g, function (c) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c];
      });
    }

    function progress(n) {
      if (barFill) barFill.style.width = Math.min((n / (TOTAL + 1)) * 100, 100) + "%";
    }

    function renderQuestion(id) {
      var step = GRAPH[id];
      var idx = history.length + 1;
      progress(idx - 1);

      var html =
        '<div class="finder__step is-active" role="group" aria-label="Question ' +
        idx +
        '">' +
        '<p class="finder__count">Question ' +
        idx +
        " of " +
        TOTAL +
        "</p>" +
        '<h3 class="finder__q">' +
        esc(step.q) +
        "</h3>" +
        '<div class="finder__options">';

      step.options.forEach(function (opt, i) {
        html +=
          '<button type="button" class="finder__option" data-index="' +
          i +
          '">' +
          '<span class="finder__option-key" aria-hidden="true">' +
          String.fromCharCode(65 + i) +
          "</span>" +
          "<span>" +
          esc(opt.label) +
          "</span>" +
          "</button>";
      });

      html += "</div>";

      if (history.length) {
        html +=
          '<div class="finder__foot"><button type="button" class="finder__back">← Back</button></div>';
      }

      html += "</div>";
      stepsWrap.innerHTML = html;

      $$(".finder__option", stepsWrap).forEach(function (btn) {
        btn.addEventListener("click", function () {
          var opt = step.options[parseInt(btn.getAttribute("data-index"), 10)];
          history.push(id);
          if (opt.result) renderResult(opt.result);
          else renderQuestion(opt.next);
        });
      });

      var back = $(".finder__back", stepsWrap);
      if (back) back.addEventListener("click", goBack);

      focusStep();
    }

    function renderResult(key) {
      var r = RESULTS[key];
      progress(TOTAL + 1);

      var needs = r.needs
        .map(function (n) {
          return "<li>" + esc(n) + "</li>";
        })
        .join("");

      stepsWrap.innerHTML =
        '<div class="finder__step is-active" role="group" aria-label="Your result">' +
        '<p class="finder__result-badge">' +
        esc(r.badge) +
        "</p>" +
        '<h3 class="finder__result-title">' +
        esc(r.title) +
        "</h3>" +
        '<p class="text-muted measure">' +
        esc(r.body) +
        "</p>" +
        '<h4 style="margin-top:var(--space-lg);margin-bottom:var(--space-sm)">What you will need in place</h4>' +
        '<ul class="ticks">' +
        needs +
        "</ul>" +
        '<div class="finder__foot">' +
        '<a class="btn" href="contact.html">Talk this through with MKA</a>' +
        '<a class="btn btn--ghost" href="' +
        esc(r.href) +
        '">See the matching resources</a>' +
        '<button type="button" class="finder__back">Start over</button>' +
        "</div>" +
        '<p class="finder__disclaimer">Guidance only — not a substitute for a licensing determination. ' +
        "Confirm your requirements with the Minnesota Department of Health, or ask us to review your situation.</p>" +
        "</div>";

      $(".finder__back", stepsWrap).addEventListener("click", restart);
      focusStep();
    }

    function focusStep() {
      var heading = $(".finder__q, .finder__result-title", stepsWrap);
      if (!heading) return;
      heading.setAttribute("tabindex", "-1");
      // Only steal focus once the user is actually interacting.
      if (history.length) heading.focus({ preventScroll: true });
    }

    function goBack() {
      var prev = history.pop();
      if (prev) renderQuestion(prev);
      else restart();
    }

    function restart() {
      history = [];
      renderQuestion("q1");
    }

    restart();
  })();

  /* ----------------------------------------------------------------------
     Contact form — client-side validation only.
     The form posts to whatever action the markup specifies; if none is set
     yet it falls back to a mailto: handoff so the site is never a dead end.
     ---------------------------------------------------------------------- */
  (function contactForm() {
    var form = $("#contact-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      if (!form.checkValidity()) return; // let the browser report

      if (form.dataset.transport === "mailto") {
        e.preventDefault();
        var data = new FormData(form);
        var lines = [];
        data.forEach(function (value, key) {
          if (key === "company_website") return; // honeypot
          lines.push(key.replace(/_/g, " ") + ": " + value);
        });
        var subject = "Website inquiry — " + (data.get("name") || "New contact");
        window.location.href =
          "mailto:" +
          form.dataset.mailto +
          "?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(lines.join("\n"));
      }
    });
  })();

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  $$("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
