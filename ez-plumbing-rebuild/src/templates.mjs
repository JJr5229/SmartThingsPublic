import {
  business as B,
  services,
  cities,
  vintageCopy,
  homeFaqs,
  differentiators,
} from './data.mjs';

/* ------------------------------------------------------------------ util */

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Build a title that fits the ~60 character SERP budget.
 *
 * Segments join with a pipe. Optional segments carry a drop rank and are shed
 * lowest-rank-first until the title fits, so the brand name survives longer
 * than a modifier like "24/7 Emergency". This matters because city names here
 * run from "Mound" (5 chars) to "Inver Grove Heights" (19); one fixed template
 * either truncates the long ones or wastes the budget on the short ones.
 *
 * @param {Array<string|[string, number]>} parts  "required" or [text, dropRank]
 */
export const fitTitle = (parts, max = 60) => {
  const segs = parts.map((p, i) =>
    Array.isArray(p) ? { text: p[0], rank: p[1], order: i } : { text: p, rank: Infinity, order: i }
  );
  const render = (list) => list.map((s) => s.text).join(' | ');

  const list = segs.slice();
  while (render(list).length > max) {
    let worst = -1;
    for (let i = 0; i < list.length; i++) {
      if (list[i].rank === Infinity) continue;
      if (worst === -1 || list[i].rank < list[worst].rank) worst = i;
    }
    if (worst === -1) break; // only required segments left — accept the overflow
    list.splice(worst, 1);
  }
  return render(list);
};

const addressLine = `${B.street}, ${B.city}, ${B.region} ${B.postal}`;

/* --------------------------------------------------------------- icons */

const ICONS = {
  siren: '<path d="M12 2a5 5 0 0 0-5 5v5h10V7a5 5 0 0 0-5-5Z"/><path d="M4 17h16v3H4z"/><path d="M12 2V0M3 7H1m22 0h-2M5 3 3.5 1.5M19 3l1.5-1.5"/>',
  drain: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  heater: '<rect x="6" y="3" width="12" height="18" rx="3"/><path d="M9 7h6M12 11v6"/>',
  pipe: '<path d="M3 8h7a4 4 0 0 1 4 4v9"/><rect x="1" y="5" width="4" height="6" rx="1"/><rect x="12" y="19" width="4" height="4" rx="1"/><path d="M18 3v6M15 6h6"/>',
  camera: '<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/>',
  drop: '<path d="M12 2.5S5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  tag: '<path d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  home: '<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-7h6v7"/>',
  shield: '<path d="M12 2 4 5.5v6c0 5 3.4 9.2 8 10.5 4.6-1.3 8-5.5 8-10.5v-6L12 2Z"/><path d="m9 12 2 2 4-4"/>',
  pin: '<path d="M12 22s7-6.2 7-11.5a7 7 0 1 0-14 0C5 15.8 12 22 12 22Z"/><circle cx="12" cy="10.5" r="2.5"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M17 11a3 3 0 1 0-1.5-5.6M18 20a6.5 6.5 0 0 0-2-4.6"/>',
};

// width/height are set as attributes, not left to CSS. An inline SVG with only
// a viewBox has no intrinsic size, so `max-width:100%; height:auto` will either
// collapse it to 0 inside a flex row or stretch it to the full container width
// — both of which happened before these attributes were added.
export const icon = (name, cls = '') =>
  `<svg class="${cls}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.drop}</svg>`;

const starSvg = () =>
  '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.6 7 .9-5.1 4.8 1.3 7L12 18l-6.2 3.3 1.3-7L2 9.5l7-.9L12 2Z"/></svg>';

/* ---------------------------------------------------------------- schema */

/**
 * LocalBusiness / Plumber. This did not exist anywhere on the old site — the
 * only JSON-LD it served was a four-line WebSite object with no NAP at all.
 *
 * Deliberately omits aggregateRating: Google's structured-data policy treats
 * self-serving review markup about your own business as ineligible, and it can
 * draw a manual action. The 4.9 / 216 rating is shown visually and linked to
 * the Google profile instead, which is both compliant and more persuasive.
 */
export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Plumber',
  '@id': `${B.siteUrl}/#business`,
  name: B.name,
  url: `${B.siteUrl}/`,
  telephone: B.phoneE164,
  email: B.email,
  image: `${B.siteUrl}/og-image.png`,
  priceRange: '$$',
  ...(B.licenseNumber ? { hasCredential: `MN Plumbing Contractor License ${B.licenseNumber}` } : {}),
  address: {
    '@type': 'PostalAddress',
    streetAddress: B.street,
    addressLocality: B.city,
    addressRegion: B.region,
    postalCode: B.postal,
    addressCountry: B.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: B.lat, longitude: B.lng },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  areaServed: cities.map((c) => ({
    '@type': 'City',
    name: c.name,
    address: { '@type': 'PostalAddress', addressRegion: 'MN', addressCountry: 'US' },
  })),
  makesOffer: services.map((s) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: s.name, serviceType: s.name },
  })),
  ...(B.social.facebook ? { sameAs: [B.social.facebook] } : {}),
});

export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const breadcrumbSchema = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: `${B.siteUrl}${t.href}`,
  })),
});

/* ------------------------------------------------------------ components */

const stars = () =>
  `<span class="stars" role="img" aria-label="${B.rating} out of 5 stars">${starSvg().repeat(5)}</span>`;

const header = (current = '') => `
<header class="site-header">
  <div class="wrap">
    <a class="logo" href="/">
      <span class="logo-mark" aria-hidden="true">EZ</span>
      <span class="logo-text">
        <span class="logo-name">EZ Plumbing &amp; Drains</span>
        <span class="logo-sub">Twin Cities &middot; 24/7</span>
      </span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">
      <span></span>
    </button>
    <nav class="nav" id="primary-nav" aria-label="Primary">
      <div class="has-sub">
        <button class="sub-toggle" type="button" aria-expanded="false" aria-controls="services-menu">
          Services <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <ul class="subnav" id="services-menu">
          ${services
            .map(
              (s) =>
                `<li><a href="/${s.slug}/"${current === s.slug ? ' aria-current="page"' : ''}>${esc(s.name)}</a></li>`
            )
            .join('\n          ')}
        </ul>
      </div>
      <a href="/service-area/"${current === 'service-area' ? ' aria-current="page"' : ''}>Service Area</a>
      <a href="/about/"${current === 'about' ? ' aria-current="page"' : ''}>About</a>
      <a href="/contact/"${current === 'contact' ? ' aria-current="page"' : ''}>Contact</a>
    </nav>
    <div class="header-cta">
      <a class="btn btn-outline" href="/contact/">Book online</a>
      <a class="btn btn-call" href="${B.phoneHref}" data-track="call-header">
        ${icon('phone')} ${B.phone}
      </a>
    </div>
  </div>
</header>`;

const topbar = () => `
<div class="topbar">
  <div class="wrap">
    <div class="topbar-left">
      <span class="live-dot" aria-hidden="true"></span>
      <span>Open now &mdash; ${esc(B.emergencyText)}</span>
    </div>
    <div><a href="${B.phoneHref}" data-track="call-topbar">${B.phone}</a></div>
  </div>
</div>`;

const callbar = () => `
<div class="callbar" role="group" aria-label="Quick contact">
  <a class="cb-call" href="${B.phoneHref}" data-track="call-sticky">${icon('phone')} Call now</a>
  <a class="cb-book" href="/contact/">${icon('calendar')} Book online</a>
</div>`;

const footer = () => {
  const byCounty = {};
  for (const c of cities) (byCounty[c.county] ||= []).push(c);
  const topCities = ['Minneapolis', 'Saint Paul', 'Blaine', 'Coon Rapids', 'Maple Grove', 'Plymouth', 'Eagan', 'Bloomington'];

  return `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <div class="footer-logo">
          <span class="logo-mark" aria-hidden="true">EZ</span>
          <span class="logo-name">EZ Plumbing &amp; Drains</span>
        </div>
        <address class="footer-nap">
          ${esc(B.street)}<br>
          ${esc(B.city)}, ${esc(B.region)} ${esc(B.postal)}<br>
          <a href="${B.phoneHref}" data-track="call-footer">${B.phone}</a><br>
          <a href="mailto:${B.email}">${B.email}</a>
        </address>
        <p style="margin-top:14px">${esc(B.hoursText)}</p>
        ${B.licenseNumber ? `<p class="small">MN Plumbing Contractor License ${esc(B.licenseNumber)}</p>` : ''}
      </div>
      <div>
        <h4>Services</h4>
        <ul class="footer-links">
          ${services.map((s) => `<li><a href="/${s.slug}/">${esc(s.name)}</a></li>`).join('\n          ')}
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul class="footer-links">
          <li><a href="/about/">About us</a></li>
          <li><a href="/service-area/">Service area</a></li>
          <li><a href="/contact/">Contact &amp; booking</a></li>
          <li><a href="${B.reviewsUrl}" rel="noopener">Google reviews</a></li>
          ${B.social.facebook ? `<li><a href="${B.social.facebook}" rel="noopener">Facebook</a></li>` : ''}
        </ul>
      </div>
      <div>
        <h4>Popular areas</h4>
        <ul class="footer-links">
          ${topCities
            .map((n) => {
              const c = cities.find((x) => x.name === n);
              return c ? `<li><a href="/plumber/${c.slug}/">Plumber in ${esc(c.name)}</a></li>` : '';
            })
            .join('\n          ')}
          <li><a href="/service-area/">All ${cities.length} cities &rarr;</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} ${esc(B.name)}. Licensed, bonded &amp; insured in Minnesota.</span>
      <span>${esc(B.badges.join(' &middot; ').replace(/&amp;/g, '&'))}</span>
    </div>
  </div>
</footer>`;
};

const ctaBand = (heading, body) => `
<section class="section">
  <div class="wrap">
    <div class="cta-band">
      <div>
        <h2>${heading}</h2>
        <p>${body}</p>
      </div>
      <div class="cta-actions">
        <a class="btn btn-call btn-lg" href="${B.phoneHref}" data-track="call-cta">${icon('phone')} ${B.phone}</a>
        <a class="btn btn-ghost" href="/contact/">Book online instead</a>
      </div>
    </div>
  </div>
</section>`;

export const faqBlock = (faqs, heading = 'Common questions') => `
<section class="section section-soft">
  <div class="wrap">
    <div class="section-head">
      <p class="kicker">FAQ</p>
      <h2>${heading}</h2>
    </div>
    <div class="faq">
      ${faqs
        .map(
          (f) => `<details>
        <summary>${esc(f.q)}</summary>
        <div class="faq-body"><p>${esc(f.a)}</p></div>
      </details>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------------ page */

/**
 * @param {object} o
 * @param {string} o.title        <title> and og:title
 * @param {string} o.description  meta description
 * @param {string} o.path         canonical path, e.g. "/drain-cleaning/"
 * @param {string} o.body         page HTML
 * @param {object[]} o.schemas    JSON-LD objects
 * @param {string} o.current      nav highlight key
 */
export const page = ({ title, description, path, body, schemas = [], current = '' }) => {
  const canonical = `${B.siteUrl}${path}`;
  const ld = [localBusinessSchema(), ...schemas];

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#12395f">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(B.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${B.siteUrl}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/styles.css">

<script type="application/ld+json">${JSON.stringify(ld.length === 1 ? ld[0] : ld)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${topbar()}
${header(current)}
<main id="main">
${body}
</main>
${footer()}
${callbar()}
<script src="/app.js" defer></script>
</body>
</html>
`;
};

/* ------------------------------------------------------------- home page */

export const homePage = () => {
  const byCounty = {};
  for (const c of cities) (byCounty[c.county] ||= []).push(c);

  const body = `
<section class="hero">
  <div class="wrap">
    <div>
      <p class="eyebrow"><span class="live-dot" aria-hidden="true"></span> Answered live, 24 hours a day</p>
      <h1>Twin Cities plumber for the problem you have right now</h1>
      <p class="hero-lede">Burst pipes, backed-up drains, dead water heaters and failed sewer lines &mdash; residential and commercial, across ${cities.length} metro cities. Flat price before we start.</p>
      <div class="hero-actions">
        <a class="btn btn-call btn-lg" href="${B.phoneHref}" data-track="call-hero">${icon('phone')} ${B.phone}</a>
        <a class="btn btn-ghost btn-lg" href="/contact/">Book online</a>
      </div>
      <p class="hero-assure">
        <span>${icon('shield')} Licensed, bonded &amp; insured</span>
        <span>${icon('pin')} Based in ${esc(B.city)}, MN</span>
        <span>${icon('clock')} No after-hours surprise fees</span>
      </p>
    </div>
    <aside class="rating-card">
      <div class="rating-top">
        <span class="rating-num">${B.rating}</span>
        <div>
          ${stars()}
          <div class="rating-meta">${B.reviewCount} Google reviews</div>
        </div>
      </div>
      <p style="margin-top:16px;font-size:.97rem;color:var(--ink-500)">
        ${B.reviewCount} neighbors across the metro have rated us ${B.rating} out of 5.
      </p>
      <a class="btn btn-outline btn-block" href="${B.reviewsUrl}" rel="noopener">Read the reviews</a>
      <div class="rating-badges">
        ${B.badges.map((b) => `<span class="pill">${esc(b)}</span>`).join('')}
        <span class="pill">${esc(B.yearsExperience)} in business</span>
      </div>
    </aside>
  </div>
</section>

<section class="trust">
  <div class="wrap">
    ${differentiators
      .map(
        (d) => `<div class="trust-item">
      ${icon(d.icon)}
      <div><strong>${esc(d.title)}</strong><span>${esc(d.body)}</span></div>
    </div>`
      )
      .join('\n    ')}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <p class="kicker">What we do</p>
      <h2>Plumbing and drain service for homes and businesses</h2>
      <p>Six things we do every day across the Twin Cities. Everything is quoted flat, in writing, before a wrench comes out of the truck.</p>
    </div>
    <div class="grid grid-3">
      ${services
        .map(
          (s) => `<a class="card" href="/${s.slug}/">
        <div class="card-icon">${icon(s.icon)}</div>
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.short)}</p>
        <span class="card-more">See ${esc(s.nav.toLowerCase())} details ${icon('arrow')}</span>
      </a>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>

<section class="section section-dark">
  <div class="wrap">
    <div class="section-head">
      <p class="kicker">How it works</p>
      <h2>You will know the price before we start</h2>
      <p>The part most people dread about calling a plumber is not the repair. It is not knowing what it is going to cost until it is already done.</p>
    </div>
    <div class="steps">
      <div class="step">
        <h3>You call, a person answers</h3>
        <p>Any hour, any day. We ask enough questions to bring the right truck and the right parts.</p>
      </div>
      <div class="step">
        <h3>We diagnose on site</h3>
        <p>Including a camera pass on any main-line or sewer job, so the diagnosis is something you can see rather than something you have to trust.</p>
      </div>
      <div class="step">
        <h3>You get a flat quote</h3>
        <p>In writing, before work begins. If the scope changes we stop and re-quote &mdash; we never discover the extra cost on the invoice.</p>
      </div>
      <div class="step">
        <h3>We fix it and clean up</h3>
        <p>Permits pulled where the city requires them, old equipment hauled away, and the footage is yours to keep.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="layout">
      <div class="prose">
        <p class="kicker">Why people call us back</p>
        <h2>Family owned, based in ${esc(B.city)}, nearly two decades in</h2>
        <p>EZ Plumbing &amp; Drains is a family-owned and operated shop working out of ${esc(B.city)}, and we have been doing this in the Twin Cities for ${esc(B.yearsExperience)}. We are also proudly Latino-owned and an LGBTQ+ friendly business &mdash; everyone gets the same straight answer and the same price.</p>
        <p>What that actually means for a service call:</p>
        <ul class="checklist">
          <li>The person who quotes your job is accountable for it. There is no sales department separate from the people doing the work.</li>
          <li>We will tell you when something does <em>not</em> need replacing. A weeping fitting is a repair; a weeping tank is not, and we will say which one you have.</li>
          <li>Camera footage on every main-line job goes to you, whether or not you hire us for the repair.</li>
          <li>We install Bradford White and Rheem tanks and Navien and Rinnai tankless, and we will walk you through why one fits your house and the other does not.</li>
        </ul>
        <div class="callout">
          <strong>Buying a home in this metro?</strong> A pre-purchase sewer camera inspection is the highest-value inspection add-on you can buy here. A standard home inspection does not look inside the sewer lateral, and a failed lateral on a pre-1980 house is a five-figure surprise.
          <a href="/camera-inspection/">See how a camera inspection works &rarr;</a>
        </div>
      </div>
      <aside class="sidebar">
        <div class="side-card">
          <h3>Emergency right now?</h3>
          <a class="side-phone" href="${B.phoneHref}" data-track="call-side">${B.phone}</a>
          <p>Answered live, 24 hours a day, every day of the year.</p>
          <a class="btn btn-call btn-block" href="${B.phoneHref}">${icon('phone')} Call now</a>
        </div>
        <div class="side-card">
          <h3>Not urgent?</h3>
          <p>Book a visit online and pick the window that works. We will confirm by phone.</p>
          <a class="btn btn-primary btn-block" href="/contact/">${icon('calendar')} Book online</a>
        </div>
      </aside>
    </div>
  </div>
</section>

<section class="section section-soft">
  <div class="wrap">
    <div class="section-head">
      <p class="kicker">Service area</p>
      <h2>${cities.length} cities across the Twin Cities metro</h2>
      <p>Based in ${esc(B.city)} and covering Anoka, Hennepin, Ramsey, Dakota, Washington, Carver and Scott counties. Each city has its own page with what we actually see in that housing stock.</p>
    </div>
    ${Object.entries(byCounty)
      .sort((a, b) => b[1].length - a[1].length)
      .map(
        ([county, list]) => `<div class="county-block">
      <h3>${esc(county)} County</h3>
      <div class="city-grid">
        ${list.map((c) => `<a href="/plumber/${c.slug}/">${esc(c.name)}</a>`).join('\n        ')}
      </div>
    </div>`
      )
      .join('\n    ')}
  </div>
</section>

${faqBlock(homeFaqs)}

${ctaBand(
  'Water where it should not be?',
  `Call ${B.phone} and talk to someone who can dispatch a truck tonight. Or book online and pick your window.`
)}
`;

  return page({
    title: '24/7 Twin Cities Plumber | EZ Plumbing & Drains, Blaine MN',
    description: `Family-owned Twin Cities plumber, rated ${B.rating} by ${B.reviewCount} Google reviewers. 24/7 emergency repair, drain cleaning, water heaters and sewer work across ${cities.length} metro cities. Flat pricing. Call ${B.phone}.`,
    path: '/',
    current: 'home',
    schemas: [
      faqSchema(homeFaqs),
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: B.name,
        url: `${B.siteUrl}/`,
      },
    ],
    body,
  });
};

/* --------------------------------------------------------- service pages */

export const servicePage = (s) => {
  const others = services.filter((x) => x.slug !== s.slug);
  const body = `
<section class="page-head">
  <div class="wrap">
    <p class="crumbs"><a href="/">Home</a><span>/</span>${esc(s.name)}</p>
    <h1>${esc(s.name)} in the Twin Cities</h1>
    <p class="lede">${esc(s.intro)}</p>
    <div class="hero-actions" style="margin-top:26px">
      <a class="btn btn-call" href="${B.phoneHref}" data-track="call-service">${icon('phone')} ${B.phone}</a>
      <a class="btn btn-outline" href="/contact/">Book online</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="layout">
      <div class="prose">
        <h2>When to call us</h2>
        <ul class="checklist">
          ${s.problems.map((p) => `<li>${esc(p)}</li>`).join('\n          ')}
        </ul>

        <h2>How we handle it</h2>
        ${s.body.map((p) => `<p>${esc(p)}</p>`).join('\n        ')}

        <div class="callout">
          <strong>Flat price, quoted first.</strong> Every job on this page is priced in writing before work starts, and the number does not move unless the scope does.
        </div>

        <h2>Where we do this work</h2>
        <p>${esc(s.name)} is available across all ${cities.length} cities we cover, from ${esc(B.city)} out through Hennepin, Ramsey, Dakota, Washington, Anoka, Carver and Scott counties. Common starting points:</p>
        <div class="city-grid" style="margin-bottom:1.4em">
          ${['Minneapolis', 'Saint Paul', 'Blaine', 'Coon Rapids', 'Maple Grove', 'Plymouth', 'Eagan', 'Bloomington', 'Edina', 'Woodbury']
            .map((n) => cities.find((c) => c.name === n))
            .filter(Boolean)
            .map((c) => `<a href="/plumber/${c.slug}/">${esc(c.name)}</a>`)
            .join('\n          ')}
        </div>
        <p><a href="/service-area/">See all ${cities.length} cities we serve &rarr;</a></p>

        <h2>Other services</h2>
        <div class="grid grid-2">
          ${others
            .slice(0, 4)
            .map(
              (o) => `<a class="card" href="/${o.slug}/">
            <div class="card-icon">${icon(o.icon)}</div>
            <h3>${esc(o.name)}</h3>
            <p>${esc(o.short)}</p>
          </a>`
            )
            .join('\n          ')}
        </div>
      </div>
      <aside class="sidebar">
        <div class="side-card">
          <h3>Need this today?</h3>
          <a class="side-phone" href="${B.phoneHref}" data-track="call-side">${B.phone}</a>
          <p>${esc(B.hoursText)}. A person answers, not a machine.</p>
          <a class="btn btn-call btn-block" href="${B.phoneHref}">${icon('phone')} Call now</a>
        </div>
        <div class="side-card">
          <div class="rating-top">
            <span class="rating-num" style="font-size:2.2rem">${B.rating}</span>
            <div>${stars()}<div class="rating-meta">${B.reviewCount} Google reviews</div></div>
          </div>
          <p style="margin-top:12px">${B.badges.map((b) => `<span class="pill">${esc(b)}</span>`).join(' ')}</p>
        </div>
      </aside>
    </div>
  </div>
</section>

${faqBlock(s.faqs, `${s.name}: common questions`)}

${ctaBand(
  `Get ${s.name.toLowerCase()} handled`,
  `Call ${B.phone} for same-day and emergency service, or book a window online.`
)}
`;

  return page({
    title: s.title,
    description: s.metaDescription,
    path: `/${s.slug}/`,
    current: s.slug,
    schemas: [
      faqSchema(s.faqs),
      breadcrumbSchema([
        { name: 'Home', href: '/' },
        { name: s.name, href: `/${s.slug}/` },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: s.name,
        serviceType: s.name,
        provider: { '@id': `${B.siteUrl}/#business` },
        areaServed: { '@type': 'AdministrativeArea', name: 'Twin Cities metro, Minnesota' },
      },
    ],
    body,
  });
};

/* ------------------------------------------------------------ city pages */

export const cityPage = (c, index) => {
  const v = vintageCopy[c.vintage];
  const fill = (t) => t.replace(/\{city\}/g, c.name);

  // Nearest neighbours by list position within the same county, so every page
  // links laterally to genuinely related pages rather than to a random block.
  const sameCounty = cities.filter((x) => x.county === c.county && x.slug !== c.slug);
  const near = sameCounty.slice(0, 6);

  const cityFaqs = [
    {
      q: `Do you charge extra to come out to ${c.name}?`,
      a: `No. ${c.name} is inside our standard service area and there is no travel surcharge. You get the same flat, up-front pricing as anywhere else in the metro.`,
    },
    {
      q: `How fast can you get to ${c.name}?`,
      a: `We dispatch out of ${B.city} and cover ${c.county} County continuously. For a genuine emergency we move as fast as a truck can reach you; for scheduled work we book an arrival window rather than a vague day.`,
    },
    {
      q: `What plumbing problems are most common in ${c.name}?`,
      a: `Given the ${v.label} here, most of what we see in ${c.name} comes down to ${v.lead}. That said, we handle the full range — emergency repair, drain cleaning, water heaters, sewer work, camera inspection and water treatment.`,
    },
    {
      q: `Are you licensed to work in ${c.name}?`,
      a: `Yes. We are licensed, bonded and insured in the State of Minnesota and pull permits with ${c.name} and ${c.county} County wherever the work requires them.`,
    },
  ];

  const body = `
<section class="page-head">
  <div class="wrap">
    <p class="crumbs"><a href="/">Home</a><span>/</span><a href="/service-area/">Service area</a><span>/</span>${esc(c.name)}</p>
    <h1>Plumber in ${esc(c.name)}, MN</h1>
    <p class="lede">24/7 emergency plumbing, drain cleaning, water heaters and sewer repair for ${esc(c.name)} homes and businesses. Rated ${B.rating} by ${B.reviewCount} Google reviewers. Flat pricing, quoted before we start.</p>
    <div class="hero-actions" style="margin-top:26px">
      <a class="btn btn-call" href="${B.phoneHref}" data-track="call-city">${icon('phone')} ${B.phone}</a>
      <a class="btn btn-outline" href="/contact/">Book online</a>
    </div>
  </div>
</section>

<section class="trust">
  <div class="wrap">
    <div class="trust-item">${icon('clock')}<div><strong>Answered live, 24/7</strong><span>Including holidays</span></div></div>
    <div class="trust-item">${icon('pin')}<div><strong>${esc(c.county)} County</strong><span>Dispatched from ${esc(B.city)}</span></div></div>
    <div class="trust-item">${icon('tag')}<div><strong>Flat pricing</strong><span>Approved before work starts</span></div></div>
    <div class="trust-item">${icon('shield')}<div><strong>Licensed &amp; insured</strong><span>State of Minnesota</span></div></div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="layout">
      <div class="prose">
        <h2>Plumbing service for ${esc(c.name)}</h2>
        <p>${esc(fill(v.paragraph))}</p>
        <p>We are a family-owned shop based in ${esc(B.city)}, ${esc(B.yearsExperience)} into this work, and ${esc(c.name)} is inside the area we cover every day &mdash; not a city we drive to occasionally. There is no travel surcharge and no different price list for ${esc(c.county)} County.</p>

        <h2>What we handle in ${esc(c.name)}</h2>
        <div class="grid grid-2">
          ${services
            .map(
              (s) => `<a class="card" href="/${s.slug}/">
            <div class="card-icon">${icon(s.icon)}</div>
            <h3>${esc(s.name)}</h3>
            <p>${esc(s.short)}</p>
          </a>`
            )
            .join('\n          ')}
        </div>

        <h2>What a ${esc(c.name)} service call looks like</h2>
        <ul class="checklist">
          <li>You call ${B.phone} and a person answers &mdash; at 2pm or 2am.</li>
          <li>We ask enough about the symptom to bring the right truck and parts the first time.</li>
          <li>We diagnose on site, including a camera pass on any main-line or sewer job.</li>
          <li>You approve a flat written price before any work begins.</li>
          <li>We pull permits with ${esc(c.name)} where the work requires them, and clean up after ourselves.</li>
        </ul>

        <div class="callout">
          <strong>${esc(c.name)} emergency?</strong> Shut the water off at the fixture or the main, then call
          <a href="${B.phoneHref}">${B.phone}</a>. We will talk you through stopping the damage while a truck is on the way.
        </div>

        ${
          near.length
            ? `<h2>Nearby cities we also serve</h2>
        <div class="city-grid">
          ${near.map((n) => `<a href="/plumber/${n.slug}/">Plumber in ${esc(n.name)}</a>`).join('\n          ')}
        </div>
        <p style="margin-top:1em"><a href="/service-area/">All ${cities.length} cities &rarr;</a></p>`
            : ''
        }
      </div>
      <aside class="sidebar">
        <div class="side-card">
          <h3>${esc(c.name)} emergency line</h3>
          <a class="side-phone" href="${B.phoneHref}" data-track="call-side">${B.phone}</a>
          <p>${esc(B.hoursText)}. Dispatched from ${esc(B.street)}, ${esc(B.city)}.</p>
          <a class="btn btn-call btn-block" href="${B.phoneHref}">${icon('phone')} Call now</a>
        </div>
        <div class="side-card">
          <div class="rating-top">
            <span class="rating-num" style="font-size:2.2rem">${B.rating}</span>
            <div>${stars()}<div class="rating-meta">${B.reviewCount} Google reviews</div></div>
          </div>
          <p style="margin-top:12px">${B.badges.map((b) => `<span class="pill">${esc(b)}</span>`).join(' ')}</p>
          <a class="btn btn-outline btn-block" href="${B.reviewsUrl}" rel="noopener">Read reviews</a>
        </div>
      </aside>
    </div>
  </div>
</section>

${faqBlock(cityFaqs, `Plumbing in ${c.name}: common questions`)}

${ctaBand(
  `Need a plumber in ${c.name} today?`,
  `Call ${B.phone} for 24/7 emergency service, or book a window online and we will confirm by phone.`
)}
`;

  return page({
    title: fitTitle([`Plumber in ${c.name}, MN`, ['24/7 Emergency', 1], ['EZ Plumbing & Drains', 2]]),
    description: `Licensed ${c.name}, MN plumber. 24/7 emergency repair, drain cleaning, water heaters and sewer service for ${c.county} County homes and businesses. ${B.rating}★ from ${B.reviewCount} reviews. Call ${B.phone}.`,
    path: `/plumber/${c.slug}/`,
    current: 'service-area',
    schemas: [
      faqSchema(cityFaqs),
      breadcrumbSchema([
        { name: 'Home', href: '/' },
        { name: 'Service area', href: '/service-area/' },
        { name: c.name, href: `/plumber/${c.slug}/` },
      ]),
    ],
    body,
  });
};

/* ------------------------------------------------------- other pages */

export const serviceAreaPage = () => {
  const byCounty = {};
  for (const c of cities) (byCounty[c.county] ||= []).push(c);

  const body = `
<section class="page-head">
  <div class="wrap">
    <p class="crumbs"><a href="/">Home</a><span>/</span>Service area</p>
    <h1>Where we work</h1>
    <p class="lede">${cities.length} cities across seven counties, dispatched from ${esc(B.street)} in ${esc(B.city)}. No travel surcharge anywhere on this list.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="prose narrow" style="margin-bottom:44px">
      <p>We cover the Twin Cities metro continuously rather than in zones, which means the same 24/7 line, the same flat pricing and the same crew whether you are in downtown Minneapolis or out past Stillwater.</p>
      <p>If your city is not on this list, call anyway &mdash; ${B.phone}. The list is where we go routinely, not a fence.</p>
    </div>
    ${Object.entries(byCounty)
      .sort((a, b) => b[1].length - a[1].length)
      .map(
        ([county, list]) => `<div class="county-block">
      <h3>${esc(county)} County &mdash; ${list.length} cities</h3>
      <div class="city-grid">
        ${list.map((c) => `<a href="/plumber/${c.slug}/">${esc(c.name)}</a>`).join('\n        ')}
      </div>
    </div>`
      )
      .join('\n    ')}
  </div>
</section>

${ctaBand('Not sure if we cover you?', `Call ${B.phone}. If we cannot get to you, we will tell you who can.`)}
`;

  return page({
    title: fitTitle(['Twin Cities Service Area', ['EZ Plumbing & Drains', 2]]),
    description: `EZ Plumbing & Drains serves ${cities.length} cities across Anoka, Hennepin, Ramsey, Dakota, Washington, Carver and Scott counties. 24/7 service, no travel surcharge. Call ${B.phone}.`,
    path: '/service-area/',
    current: 'service-area',
    schemas: [
      breadcrumbSchema([
        { name: 'Home', href: '/' },
        { name: 'Service area', href: '/service-area/' },
      ]),
    ],
    body,
  });
};

export const aboutPage = () => {
  const body = `
<section class="page-head">
  <div class="wrap">
    <p class="crumbs"><a href="/">Home</a><span>/</span>About</p>
    <h1>A family shop that answers the phone</h1>
    <p class="lede">EZ Plumbing &amp; Drains has been serving the Twin Cities for ${esc(B.yearsExperience)} out of ${esc(B.city)}, Minnesota.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="layout">
      <div class="prose">
        <h2>Who we are</h2>
        <p>We are family owned and operated, Latino-owned, and an LGBTQ+ friendly business. Everyone who calls gets the same straight answer and the same price &mdash; that is not a marketing line, it is the entire reason the shop exists in the shape it does.</p>
        <p>Nearly two decades in, ${B.reviewCount} customers across the metro have rated us ${B.rating} out of 5 on Google. We would rather you read those than take our word for anything on this page.</p>

        <h2>How we price work</h2>
        <p>Flat rate, quoted in writing, approved before anything starts. We do not bill residential service by the hour, which means a repair that takes longer than expected is our problem rather than yours, and it means nobody has an incentive to work slowly.</p>
        <p>If the scope changes mid-job &mdash; we open a wall and find something worse &mdash; we stop and re-quote. You will never learn about additional cost from the invoice.</p>

        <h2>What we will tell you that others might not</h2>
        <ul class="checklist">
          <li>When a repair is the right call instead of a replacement, and when it genuinely is not.</li>
          <li>When a tankless conversion does not make financial sense for your house.</li>
          <li>When a "full sewer replacement" quote you got elsewhere is really an eight-foot spot repair.</li>
          <li>When the problem is not actually plumbing.</li>
        </ul>

        <h2>What we work on</h2>
        <p>Residential and commercial: emergency repair, drain cleaning and hydro jetting, tank and tankless water heaters, sewer line repair, replacement and relining, high-resolution camera inspection, water softeners, iron filtration and reverse osmosis.</p>
        <p>We install ${esc(B.brandsCarried.join(', '))}.</p>

        <h2>Licensing and insurance</h2>
        <p>Licensed, bonded and insured in the State of Minnesota. We pull permits wherever the municipality requires them, and we are happy to send a certificate of insurance ahead of any commercial job &mdash; just ask when you call.</p>
      </div>
      <aside class="sidebar">
        <div class="side-card">
          <div class="rating-top">
            <span class="rating-num">${B.rating}</span>
            <div>${stars()}<div class="rating-meta">${B.reviewCount} Google reviews</div></div>
          </div>
          <a class="btn btn-outline btn-block" style="margin-top:16px" href="${B.reviewsUrl}" rel="noopener">Read them all</a>
          <div class="rating-badges">
            ${B.badges.map((b) => `<span class="pill">${esc(b)}</span>`).join('')}
          </div>
        </div>
        <div class="side-card">
          <h3>Talk to us</h3>
          <a class="side-phone" href="${B.phoneHref}">${B.phone}</a>
          <p>${esc(B.hoursText)}</p>
          <address class="small muted" style="font-style:normal">
            ${esc(B.street)}<br>${esc(B.city)}, ${esc(B.region)} ${esc(B.postal)}
          </address>
          <a class="btn btn-call btn-block" style="margin-top:14px" href="${B.phoneHref}">${icon('phone')} Call now</a>
        </div>
      </aside>
    </div>
  </div>
</section>

${ctaBand('Ready when you are', `Call ${B.phone} or book a visit online.`)}
`;

  return page({
    title: fitTitle(['About EZ Plumbing & Drains', ['Twin Cities Plumber', 1]]),
    description: `Family-owned, Latino-owned Twin Cities plumbing shop based in Blaine, MN. ${B.yearsExperience} in business, ${B.rating}★ from ${B.reviewCount} Google reviews. Flat pricing, licensed and insured.`,
    path: '/about/',
    current: 'about',
    schemas: [
      breadcrumbSchema([
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about/' },
      ]),
    ],
    body,
  });
};

export const contactPage = () => {
  const body = `
<section class="page-head">
  <div class="wrap">
    <p class="crumbs"><a href="/">Home</a><span>/</span>Contact</p>
    <h1>Book a visit or call us now</h1>
    <p class="lede">Emergencies go faster by phone &mdash; ${B.phone} is answered live, 24 hours a day. For everything else, this form reaches us just as reliably.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="layout">
      <div>
        <form class="contact-form" method="post" action="https://formspree.io/f/REPLACE_WITH_FORM_ID" novalidate>
          <div class="grid grid-2" style="gap:0 20px">
            <div class="field">
              <label for="name">Your name <span class="req" aria-hidden="true">*</span></label>
              <input id="name" name="name" type="text" autocomplete="name" required>
            </div>
            <div class="field">
              <label for="phone">Phone <span class="req" aria-hidden="true">*</span></label>
              <input id="phone" name="phone" type="tel" autocomplete="tel" required>
            </div>
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" autocomplete="email">
          </div>
          <div class="grid grid-2" style="gap:0 20px">
            <div class="field">
              <label for="city">City <span class="req" aria-hidden="true">*</span></label>
              <input id="city" name="city" type="text" list="city-list" autocomplete="address-level2" required>
              <datalist id="city-list">
                ${cities.map((c) => `<option value="${esc(c.name)}"></option>`).join('')}
              </datalist>
            </div>
            <div class="field">
              <label for="service">What do you need? <span class="req" aria-hidden="true">*</span></label>
              <select id="service" name="service" required>
                <option value="">Choose one&hellip;</option>
                ${services.map((s) => `<option>${esc(s.name)}</option>`).join('\n                ')}
                <option>Something else</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label for="urgency">How urgent is it?</label>
            <select id="urgency" name="urgency">
              <option>Emergency &mdash; happening right now</option>
              <option selected>Soon &mdash; within a day or two</option>
              <option>Scheduled &mdash; whenever works</option>
              <option>Just getting a quote</option>
            </select>
            <p class="field-hint">If it is an active emergency, please call ${B.phone} instead. A form is slower than a phone.</p>
          </div>
          <div class="field">
            <label for="message">Tell us what is going on</label>
            <textarea id="message" name="message" placeholder="What you are seeing, how long it has been happening, anything you have already tried."></textarea>
          </div>
          <div class="hp" aria-hidden="true">
            <label for="company">Company</label>
            <input id="company" name="_gotcha" type="text" tabindex="-1" autocomplete="off">
          </div>
          <button class="btn btn-primary btn-lg btn-block" type="submit">Send request</button>
          <p class="form-note">We reply to every request. For anything urgent, calling is always faster.</p>
        </form>
      </div>
      <aside class="sidebar">
        <div class="side-card">
          <h3>Call 24/7</h3>
          <a class="side-phone" href="${B.phoneHref}" data-track="call-contact">${B.phone}</a>
          <p>${esc(B.hoursText)}, including holidays. A person answers.</p>
          <a class="btn btn-call btn-block" href="${B.phoneHref}">${icon('phone')} Call now</a>
        </div>
        <div class="side-card">
          <h3>Where we are</h3>
          <address class="footer-nap" style="font-style:normal;color:var(--ink-700)">
            ${esc(B.street)}<br>
            ${esc(B.city)}, ${esc(B.region)} ${esc(B.postal)}<br>
            <a href="mailto:${B.email}">${B.email}</a>
          </address>
          <p class="small muted" style="margin-top:12px">We are a dispatch shop, not a showroom &mdash; all work is done at your property.</p>
        </div>
        <div class="side-card">
          <div class="rating-top">
            <span class="rating-num" style="font-size:2.2rem">${B.rating}</span>
            <div>${stars()}<div class="rating-meta">${B.reviewCount} Google reviews</div></div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>
`;

  return page({
    title: fitTitle(['Contact EZ Plumbing & Drains', ['24/7 Twin Cities Plumber', 1]]),
    description: `Call ${B.phone} any hour, or book a plumbing visit online. EZ Plumbing & Drains, ${addressLine}. Serving ${cities.length} Twin Cities metro cities.`,
    path: '/contact/',
    current: 'contact',
    schemas: [
      breadcrumbSchema([
        { name: 'Home', href: '/' },
        { name: 'Contact', href: '/contact/' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        url: `${B.siteUrl}/contact/`,
        mainEntity: { '@id': `${B.siteUrl}/#business` },
      },
    ],
    body,
  });
};

export const notFoundPage = () => {
  const body = `
<section class="section">
  <div class="wrap narrow center" style="padding-block:60px">
    <p class="kicker">404</p>
    <h1>That page moved</h1>
    <p class="muted" style="font-size:1.1rem">We reorganised the site. The plumbing still works &mdash; here is where to go.</p>
    <div class="hero-actions" style="justify-content:center;margin-top:28px">
      <a class="btn btn-call" href="${B.phoneHref}">${icon('phone')} ${B.phone}</a>
      <a class="btn btn-outline" href="/">Back to the homepage</a>
    </div>
    <div class="grid grid-3" style="margin-top:48px;text-align:left">
      ${services
        .slice(0, 3)
        .map(
          (s) => `<a class="card" href="/${s.slug}/">
        <div class="card-icon">${icon(s.icon)}</div>
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.short)}</p>
      </a>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>`;

  return page({
    title: 'Page not found | EZ Plumbing & Drains',
    description: 'That page has moved. Call (651) 392-0832 for 24/7 Twin Cities plumbing service.',
    path: '/404.html',
    body,
  });
};
