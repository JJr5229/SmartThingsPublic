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
  var token = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  };

  /* ----------------------------------------------------------------------
     Hero mesh — a triangulated field built from the MK triangle.
     Drawn to canvas rather than hand-authored SVG so it can respond to
     viewport size and drift slowly without a large static path payload.
     ---------------------------------------------------------------------- */
  (function heroMesh() {
    var host = $(".hero__mesh");
    if (!host) return;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var stroke = token("--blue-500") || "#4a46e0";
    var fill = token("--blue-600") || "#2e2ac4";
    var gold = token("--gold-500") || "#f2b01e";

    var pts = [];
    var cols = 0;
    var rows = 0;
    var w = 0;
    var h = 0;
    var running = true;
    var rafId = null;

    function build() {
      var rect = host.getBoundingClientRect();
      w = Math.max(rect.width, 1);
      h = Math.max(rect.height, 1);

      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var cell = w < 640 ? 118 : w < 1100 ? 150 : 178;
      cols = Math.ceil(w / cell) + 3;
      rows = Math.ceil(h / cell) + 3;

      pts = [];
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          // Deterministic jitter — no Math.random, so the field is stable
          // across resizes and repaints.
          var seed = x * 12.9898 + y * 78.233;
          var jx = (Math.sin(seed) * 43758.5453) % 1;
          var jy = (Math.sin(seed * 1.37) * 24634.6345) % 1;
          pts.push({
            bx: (x - 1) * cell,
            by: (y - 1) * cell,
            jx: jx * cell * 0.55,
            jy: jy * cell * 0.55,
            ph: (seed % 6.283),
            gold: (x * 5 + y * 9) % 17 === 0,
          });
        }
      }
    }

    function project(p, t) {
      return {
        x: p.bx + p.jx + Math.sin(t * 0.00012 + p.ph) * 12,
        y: p.by + p.jy + Math.cos(t * 0.0001 + p.ph) * 12,
      };
    }

    function tri(a, b, c, alpha) {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(c.x, c.y);
      ctx.closePath();
      ctx.globalAlpha = alpha;
      ctx.stroke();
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);

      var P = new Array(pts.length);
      for (var i = 0; i < pts.length; i++) P[i] = project(pts[i], t);

      ctx.lineWidth = 1;
      ctx.strokeStyle = stroke;
      ctx.fillStyle = fill;

      for (var y = 0; y < rows - 1; y++) {
        for (var x = 0; x < cols - 1; x++) {
          var i0 = y * cols + x;
          var a = P[i0];
          var b = P[i0 + 1];
          var c = P[i0 + cols];
          var d = P[i0 + cols + 1];

          // Fade the field out toward the left, where the headline sits.
          var depth = Math.min(1, Math.max(0, a.x / w));
          var alpha = 0.1 + depth * 0.5;

          // Occasional filled facet gives the mesh body without noise.
          if ((x * 3 + y * 7) % 11 === 0) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineTo(c.x, c.y);
            ctx.closePath();
            ctx.globalAlpha = 0.06 + depth * 0.16;
            ctx.fill();
          }

          tri(a, b, c, alpha);
          tri(b, d, c, alpha * 0.75);
        }
      }

      // Gold vertices — the survey points.
      ctx.fillStyle = gold;
      for (var k = 0; k < pts.length; k++) {
        if (!pts[k].gold) continue;
        var q = P[k];
        if (q.x < w * 0.24) continue;
        ctx.globalAlpha = 0.5 + Math.min(0.4, q.x / w) * 0.5;
        ctx.beginPath();
        ctx.arc(q.x, q.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    }

    function loop(t) {
      if (!running) return;
      draw(t);
      rafId = window.requestAnimationFrame(loop);
    }

    function start() {
      if (reduceMotion) {
        draw(0);
        return;
      }
      if (rafId !== null) return;
      running = true;
      rafId = window.requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    build();
    draw(0);
    start();

    // Don't burn frames when the hero is scrolled out of view.
    if ("IntersectionObserver" in window && !reduceMotion) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }).observe(host);
    }

    var resizeTimer;
    window.addEventListener(
      "resize",
      function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          build();
          draw(performance.now());
        }, 180);
      },
      { passive: true }
    );
  })();

  /* ----------------------------------------------------------------------
     Header: solid background + scroll progress, batched into one rAF
     ---------------------------------------------------------------------- */
  (function header() {
    var el = $(".site-header");
    var bar = $(".scroll-progress");
    var ticking = false;

    function paint() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;

      if (el) el.classList.toggle("is-solid", y > 40);

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

    items.forEach(function (el) {
      var group = el.getAttribute("data-reveal");
      if (group === "stagger") {
        var sibs = $$('[data-reveal="stagger"]', el.parentElement);
        el.style.setProperty("--reveal-delay", sibs.indexOf(el) * 70 + "ms");
      } else if (group && !isNaN(parseInt(group, 10))) {
        el.style.setProperty("--reveal-delay", parseInt(group, 10) + "ms");
      }
      io.observe(el);
    });
  })();

  /* ----------------------------------------------------------------------
     Hero load sequence
     ---------------------------------------------------------------------- */
  $$("[data-load]").forEach(function (el, i) {
    el.style.setProperty("--load-delay", 90 + i * 90 + "ms");
  });

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
          var start = performance.now();
          var dur = 1300;

          (function tick(now) {
            var p = Math.min((now - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
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
     Accordion
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
          "A registered nurse named on the application",
        ],
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
          "Waiver 101 training for an owner or managerial official",
        ],
        href: "store.html#245d",
      },
    };

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
            label: "Homemaking and assistance with daily living — no skilled nursing",
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
    var TOTAL = 2;

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
        '<div class="finder__step" role="group" aria-label="Question ' +
        idx +
        '">' +
        '<p class="finder__count">Question ' +
        idx +
        " / " +
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
        '<div class="finder__step" role="group" aria-label="Your result">' +
        '<p class="finder__result-badge">' +
        esc(r.badge) +
        "</p>" +
        '<h3 class="finder__result-title">' +
        esc(r.title) +
        "</h3>" +
        '<p class="text-muted measure">' +
        esc(r.body) +
        "</p>" +
        '<h4 class="finder__count mt-lg">What you will need in place</h4>' +
        '<ul class="ticks ticks--plain">' +
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
     Posts to whatever action the markup specifies; if none is set yet it
     falls back to a mailto: handoff so the site is never a dead end.
     ---------------------------------------------------------------------- */
  (function contactForm() {
    var form = $("#contact-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      if (!form.checkValidity()) return;

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
