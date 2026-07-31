/* EZ Plumbing & Drains — the entire client-side runtime.
 *
 * Mobile nav, FAQ single-open behaviour, and call-click reporting.
 * That is the whole list. The site it replaces shipped 1.9 MB of JavaScript
 * across 25 files to render the same brochure content.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------- mobile nav */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    // Close on Escape, and return focus to the button.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    // Close when a link inside is followed.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------- services dropdown */

  // CSS handles hover and :focus-within on desktop, which covers mouse and
  // keyboard. This adds click, so the menu also works on a touch device that
  // reports hover capability (Surface, iPad with trackpad, etc).
  var subToggle = document.querySelector('.sub-toggle');
  var subMenu = document.getElementById('services-menu');

  if (subToggle && subMenu) {
    subToggle.addEventListener('click', function (e) {
      e.preventDefault();
      var open = subToggle.getAttribute('aria-expanded') === 'true';
      subToggle.setAttribute('aria-expanded', String(!open));
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.has-sub')) subToggle.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (subToggle.getAttribute('aria-expanded') === 'true') {
        subToggle.setAttribute('aria-expanded', 'false');
        subToggle.focus();
      }
    });
  }

  /* ---------------------------------------------------------------- FAQ */

  // Only one answer open at a time within a group — keeps long FAQ lists from
  // turning into a wall of text. <details> still works with JS off.
  document.querySelectorAll('.faq').forEach(function (group) {
    var items = group.querySelectorAll('details');
    items.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        items.forEach(function (other) {
          if (other !== d) other.open = false;
        });
      });
    });
  });

  /* -------------------------------------------------- conversion tracking */

  // Every phone link carries data-track so call intent is measurable per
  // placement (hero / sticky bar / footer / city page). The old site had no
  // way to tell which CTA produced a call.
  document.addEventListener('click', function (e) {
    var el = e.target.closest('a[href^="tel:"]');
    if (!el) return;
    var label = el.getAttribute('data-track') || 'call-other';
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'click_to_call', {
        event_category: 'conversion',
        event_label: label,
        page_path: location.pathname,
      });
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: 'click_to_call', placement: label, page: location.pathname });
    }
  });

  /* -------------------------------------------------------- form guardrail */

  // If someone picks "Emergency" on the contact form, push them to the phone.
  // A form is a slow way to report a flooding basement.
  var urgency = document.getElementById('urgency');
  var form = document.querySelector('.contact-form');
  if (urgency && form) {
    urgency.addEventListener('change', function () {
      var existing = form.querySelector('.urgent-note');
      if (existing) existing.remove();
      if (urgency.value.indexOf('Emergency') !== 0) return;

      var note = document.createElement('div');
      note.className = 'callout urgent-note';
      note.setAttribute('role', 'status');
      note.innerHTML =
        '<strong>Please call instead.</strong> For an active emergency, ' +
        '<a href="tel:+16513920832" data-track="call-form-nudge">(651) 392-0832</a> ' +
        'is answered live right now and is much faster than this form.';
      urgency.closest('.field').appendChild(note);
    });
  }
})();
