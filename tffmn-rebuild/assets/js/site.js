/* Transforming Families MN — progressive enhancement only.
   Every page works with JS disabled. ~1KB, no dependencies, no tracking. */
(function () {
  'use strict';

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('nav.primary');
  if (toggle && nav) {
    toggle.hidden = false;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Quick exit: replaces the current history entry so the site does not appear
  // in the back button, then navigates away. Also bound to the Escape key
  // pressed three times in a row.
  function quickExit() {
    try { window.location.replace('https://www.google.com/search?q=weather'); }
    catch (err) { window.location.href = 'https://www.google.com'; }
  }

  var exitBtn = document.querySelector('.exit');
  if (exitBtn) exitBtn.addEventListener('click', quickExit);

  var taps = 0, timer = null;
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    taps += 1;
    clearTimeout(timer);
    timer = setTimeout(function () { taps = 0; }, 1200);
    if (taps >= 3) quickExit();
  });
})();
