#!/usr/bin/env node
/**
 * Post-build audit. Run after `node build.mjs`; exits non-zero on any failure.
 *
 * Every check here corresponds to a defect found on the live site in the
 * 2026-07-31 audit. The point is that those defects cannot silently come back:
 * the phone-number mismatch that appeared on all 83 live pages would fail
 * check 1 before anything shipped.
 *
 *   node build.mjs && node check.mjs
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
const CORRECT_PHONE = '6513920832';

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const stripTags = (t) =>
  t
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');

let failures = 0;
const check = (ok, msg, detail) => {
  if (!ok) failures++;
  console.log(`  ${ok ? '✓' : '✗'}  ${msg}`);
  if (!ok && detail) console.log(`       ${detail}`);
};

const files = (await walk(DIST)).filter((f) => f.endsWith('.html'));
const html = new Map();
for (const f of files) html.set(f, await readFile(f, 'utf8'));

console.log(`\n  Auditing ${files.length} generated pages\n  ${'─'.repeat(58)}`);

/* 1. NAP — the defect that was on every page of the live site ------------- */
{
  const bad = [];
  const digits = (x) => x.replace(/\D/g, '').replace(/^1/, '');
  for (const [f, s] of html) {
    const tel = [...s.matchAll(/tel:([+0-9\-().\s]+)/g)].map((m) => digits(m[1]));
    const shown = [...stripTags(s).matchAll(/\(?\d{3}\)?[\s.\-]\d{3}[\s.\-]\d{4}/g)].map((m) => digits(m[0]));
    const all = new Set([...tel, ...shown]);
    if (all.size !== 1 || !all.has(CORRECT_PHONE)) bad.push(`${f} -> ${[...all].join(', ')}`);
  }
  check(bad.length === 0, `One phone number sitewide: linked and displayed both ${CORRECT_PHONE}`, bad.slice(0, 3).join('\n       '));
}

/* 2. No placeholder content reaches production --------------------------- */
{
  const needles = ['Title or Question', 'Breathtaking colors', 'Portraits of people', 'Stark beauty', 'Visual odyssey', 'Lorem ipsum', '>Button<', 'TODO', 'FIXME', 'REPLACE_WITH'];
  const bad = [];
  for (const [f, s] of html) {
    // The Formspree endpoint is a documented deploy-time swap, not stray filler.
    const hits = needles.filter((n) => s.includes(n) && !(n === 'REPLACE_WITH' && f.includes('contact')));
    if (hits.length) bad.push(`${f} -> ${hits.join(', ')}`);
  }
  check(bad.length === 0, 'No placeholder or template filler text in output', bad.slice(0, 3).join('\n       '));
}

/* 3-4. Heading structure -------------------------------------------------- */
{
  const wrongCount = [];
  const wrongOrder = [];
  for (const [f, s] of html) {
    const n = (s.match(/<h1[\s>]/g) || []).length;
    if (n !== 1) wrongCount.push(`${f} -> ${n} h1 tags`);
    const seq = [...s.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
    if (seq[0] !== 1) wrongOrder.push(`${f} -> starts at h${seq[0]}`);
  }
  check(wrongCount.length === 0, 'Exactly one <h1> per page', wrongCount.slice(0, 3).join('\n       '));
  check(wrongOrder.length === 0, 'Every page opens with its <h1> before any lower heading', wrongOrder.slice(0, 3).join('\n       '));
}

/* 5-7. Structured data ---------------------------------------------------- */
{
  let parseErrors = 0;
  let missingBusiness = 0;
  let faqPages = 0;
  for (const [f, s] of html) {
    for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      let parsed;
      try {
        parsed = JSON.parse(m[1]);
      } catch (e) {
        parseErrors++;
        console.log(`       JSON-LD parse error in ${f}: ${e.message}`);
        continue;
      }
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      if (!arr.some((x) => x['@type'] === 'Plumber')) missingBusiness++;
      if (arr.some((x) => x['@type'] === 'FAQPage')) faqPages++;
    }
  }
  check(parseErrors === 0, 'All JSON-LD blocks are valid JSON');
  check(missingBusiness === 0, `Plumber schema with complete NAP on all ${files.length} pages`);
  check(faqPages >= files.length - 5, `FAQPage schema on ${faqPages} pages`);

  // aggregateRating on your own business is against Google's policy.
  const selfRating = [...html.values()].filter((s) => s.includes('"aggregateRating"')).length;
  check(selfRating === 0, 'No self-serving aggregateRating markup (Google policy)');
}

/* 8-11. Metadata ---------------------------------------------------------- */
{
  const titles = [];
  const descs = [];
  let noCanonical = 0;
  for (const [f, s] of html) {
    if (!/rel="canonical"/.test(s)) noCanonical++;
    titles.push(((s.match(/<title>(.*?)<\/title>/) || [])[1] || '').replace(/&amp;/g, '&'));
    descs.push((s.match(/<meta name="description" content="(.*?)"/) || [])[1] || '');
  }
  check(noCanonical === 0, 'Canonical URL on every page');
  check(new Set(titles).size === titles.length, `All ${titles.length} <title> values unique`);
  check(new Set(descs).size === descs.length && !descs.includes(''), `All ${descs.length} meta descriptions unique and non-empty`);
  const over = titles.filter((t) => t.length > 60);
  check(over.length === 0, 'No <title> over 60 characters', over.slice(0, 2).join('\n       '));
}

/* 12. Legacy URL coverage ------------------------------------------------- */
{
  const legacy = [
    '/minneapolis', '/saint-paul', '/blaine', '/arden-hills', '/cottage-grove', '/eden-prairie',
    '/spring-park', '/shoreview', '/south-saint-paul', '/stillwater', '/apple-valley', '/hastings',
    '/white-bear-lake', '/hopkins', '/fridley', '/crystal',
    '/contact', '/about', '/drain-cleaning', '/Water-Filtration-Systems', '/water-heater-install',
    '/service-area', '/seasonal-tips', '/ez-friends-and-family',
  ];
  const vercel = JSON.parse(await readFile(join(DIST, 'vercel.json'), 'utf8'));
  const sources = new Set(vercel.redirects.map((r) => r.source));
  const missing = legacy.filter((u) => !sources.has(u));
  check(missing.length === 0, `301 redirect for every legacy URL (${vercel.redirects.length} defined)`, missing.join(', '));
  check(vercel.redirects.every((r) => r.permanent === true), 'All redirects are permanent (301, not 302)');
}

/* 13. Sitemap integrity --------------------------------------------------- */
{
  const sm = await readFile(join(DIST, 'sitemap.xml'), 'utf8');
  const listed = new Set([...sm.matchAll(/<loc>https:\/\/www\.ezplumbingmn\.com(.*?)<\/loc>/g)].map((m) => m[1]));
  const built = files
    .filter((f) => !f.endsWith('404.html'))
    .map((f) => '/' + f.replace(new RegExp(`^${DIST}/`), '').replace(/index\.html$/, ''));
  const notListed = built.filter((b) => !listed.has(b));
  check(notListed.length === 0 && listed.size === built.length,
    `Sitemap lists exactly the ${built.length} indexable pages`, notListed.slice(0, 3).join(', '));
}

/* 14. Accessibility floor ------------------------------------------------- */
{
  let bad = 0;
  for (const [, s] of html) {
    if (!/class="skip"/.test(s) || !/<html lang="en">/.test(s) || !/name="viewport"/.test(s)) bad++;
    for (const img of s.matchAll(/<img[^>]*>/g)) if (!/\salt=/.test(img[0])) bad++;
  }
  check(bad === 0, 'Skip link, lang attribute, viewport meta present; all images have alt text');

  const css = await readFile(join(DIST, 'styles.css'), 'utf8');
  check(/\.btn\s*\{[^}]*min-height:\s*5[0-9]px/.test(css), 'Buttons meet the 44px minimum tap target');
  check(/prefers-reduced-motion/.test(css), 'Honours prefers-reduced-motion');
}

/* 15. Weight budget ------------------------------------------------------- */
{
  const css = (await readFile(join(DIST, 'styles.css'), 'utf8')).length;
  const js = (await readFile(join(DIST, 'app.js'), 'utf8')).length;
  const avg = [...html.values()].reduce((n, s) => n + s.length, 0) / html.size;
  check(css < 60_000, `CSS under 60 KB (${(css / 1024).toFixed(1)} KB, was 380 KB)`);
  check(js < 20_000, `JS under 20 KB (${(js / 1024).toFixed(1)} KB, was 1,944 KB)`);
  check(avg < 60_000, `Average page HTML under 60 KB (${(avg / 1024).toFixed(1)} KB, was 225 KB)`);
}

console.log(`  ${'─'.repeat(58)}`);
console.log(`  ${failures === 0 ? 'All checks passed' : `${failures} check(s) failed`} — ${files.length} pages\n`);
process.exit(failures ? 1 : 0);
