#!/usr/bin/env node
/**
 * Static site generator for ezplumbingmn.com.
 *
 * No dependencies, no framework, no build step beyond `node build.mjs`.
 * Writes a fully static `dist/` that can be dropped on Vercel, Netlify,
 * Cloudflare Pages or plain S3.
 *
 *   node build.mjs            build into ./dist
 *   node build.mjs --serve    build, then serve ./dist on :4321
 */

import { mkdir, writeFile, readFile, rm, readdir, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { business as B, services, cities } from './src/data.mjs';
import {
  homePage,
  servicePage,
  cityPage,
  serviceAreaPage,
  aboutPage,
  contactPage,
  notFoundPage,
} from './src/templates.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'dist');

/* --------------------------------------------------------------- helpers */

const written = [];

async function emit(relPath, contents) {
  const full = join(OUT, relPath);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, contents, 'utf8');
  written.push({ path: relPath, bytes: Buffer.byteLength(contents) });
}

/** A page at "/foo/" is written as dist/foo/index.html. */
const emitPage = (urlPath, html) =>
  emit(urlPath === '/' ? 'index.html' : `${urlPath.replace(/^\/|\/$/g, '')}/index.html`, html);

/* ------------------------------------------------------------- generated */

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#12395f"/>
<text x="32" y="43" font-family="Helvetica,Arial,sans-serif" font-size="30" font-weight="700"
      fill="#ffffff" text-anchor="middle" letter-spacing="-1">EZ</text>
</svg>`;

/**
 * Open Graph image, generated as SVG so there is no binary asset to keep in
 * sync with the phone number. Most scrapers accept SVG; if the client wants a
 * PNG, render this once with any SVG rasteriser and drop it in place.
 */
const OG_IMAGE = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#17456f"/><stop offset="1" stop-color="#0a2440"/>
</linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
<circle cx="1010" cy="120" r="260" fill="#2e86de" opacity=".22"/>
<text x="80" y="230" font-family="Helvetica,Arial,sans-serif" font-size="66" font-weight="700" fill="#ffffff">EZ Plumbing &amp; Drains</text>
<text x="80" y="320" font-family="Helvetica,Arial,sans-serif" font-size="40" fill="#bcd9f5">24/7 Twin Cities plumber &#183; ${B.city}, MN</text>
<text x="80" y="440" font-family="Helvetica,Arial,sans-serif" font-size="76" font-weight="700" fill="#ffffff">${B.phone}</text>
<text x="80" y="520" font-family="Helvetica,Arial,sans-serif" font-size="34" fill="#bcd9f5">${B.rating} &#9733; &#183; ${B.reviewCount} Google reviews &#183; Licensed &amp; insured</text>
</svg>`;

function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: '/', priority: '1.0', freq: 'weekly' },
    ...services.map((s) => ({ loc: `/${s.slug}/`, priority: '0.9', freq: 'monthly' })),
    { loc: '/service-area/', priority: '0.8', freq: 'monthly' },
    { loc: '/about/', priority: '0.6', freq: 'yearly' },
    { loc: '/contact/', priority: '0.8', freq: 'yearly' },
    ...cities.map((c) => ({ loc: `/plumber/${c.slug}/`, priority: '0.7', freq: 'monthly' })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${B.siteUrl}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
}

const robots = () => `User-agent: *
Allow: /

Sitemap: ${B.siteUrl}/sitemap.xml
`;

/**
 * 301s from the old URL structure. Every one of the 83 URLs the old site had
 * indexed resolves to its replacement — city pages move from /minneapolis to
 * /plumber/minneapolis/, and the mixed-case /Water-Filtration-Systems is
 * normalised. Without these the rebuild would drop every ranking the old site
 * has earned.
 */
function redirects() {
  const map = [
    ['/water-heater-install', '/water-heater-installation/'],
    ['/Water-Filtration-Systems', '/water-filtration/'],
    ['/water-filtration-systems', '/water-filtration/'],
    ['/drain-cleaning', '/drain-cleaning/'],
    ['/about', '/about/'],
    ['/contact', '/contact/'],
    ['/service-area', '/service-area/'],
    // Retired pages, pointed at the closest live equivalent rather than 404.
    ['/seasonal-tips', '/'],
    ['/ez-friends-and-family', '/contact/'],
    ...cities.map((c) => [`/${c.slug}`, `/plumber/${c.slug}/`]),
  ];
  return {
    // Vercel
    vercel: JSON.stringify(
      {
        cleanUrls: true,
        trailingSlash: true,
        redirects: map.map(([source, destination]) => ({ source, destination, permanent: true })),
        headers: [
          {
            // The live site scores 4/6 here (Duda sets HSTS, CSP frame-ancestors,
            // nosniff and X-Frame-Options but no Referrer-Policy or
            // Permissions-Policy). This set covers all six. The CSP is
            // deliberately tight because the rebuild loads no third-party
            // script, font or image — the only allowance is Google Analytics.
            source: '/(.*)',
            headers: [
              { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
              {
                key: 'Content-Security-Policy',
                value: [
                  "default-src 'self'",
                  "script-src 'self' https://www.googletagmanager.com",
                  "connect-src 'self' https://www.google-analytics.com",
                  "style-src 'self'",
                  "img-src 'self' data:",
                  "font-src 'self'",
                  "form-action 'self' https://formspree.io",
                  "frame-ancestors 'self'",
                  "base-uri 'self'",
                  "object-src 'none'",
                ].join('; '),
              },
              { key: 'X-Content-Type-Options', value: 'nosniff' },
              { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
              { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
              { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=(), interest-cohort=()' },
            ],
          },
          {
            source: '/(.*).(css|js|svg|png|jpg|woff2)',
            headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
          },
        ],
      },
      null,
      2
    ),
    // Netlify / Cloudflare Pages
    plain: map.map(([from, to]) => `${from}  ${to}  301`).join('\n') + '\n',
  };
}

/* ----------------------------------------------------------------- build */

async function build() {
  const t0 = Date.now();
  await rm(OUT, { recursive: true, force: true });

  await emitPage('/', homePage());
  for (const s of services) await emitPage(`/${s.slug}/`, servicePage(s));
  await emitPage('/service-area/', serviceAreaPage());
  await emitPage('/about/', aboutPage());
  await emitPage('/contact/', contactPage());
  for (const [i, c] of cities.entries()) await emitPage(`/plumber/${c.slug}/`, cityPage(c, i));

  await emit('404.html', notFoundPage());
  await emit('styles.css', await readFile(join(ROOT, 'src/styles.css'), 'utf8'));
  await emit('app.js', await readFile(join(ROOT, 'src/app.js'), 'utf8'));
  await emit('favicon.svg', FAVICON);
  await emit('og-image.png.svg', OG_IMAGE);
  await emit('og-image.png', OG_IMAGE); // served as-is; swap for a raster if preferred
  await emit('sitemap.xml', sitemap());
  await emit('robots.txt', robots());

  const r = redirects();
  await emit('vercel.json', r.vercel);
  await emit('_redirects', r.plain);

  const totalBytes = written.reduce((n, w) => n + w.bytes, 0);
  const html = written.filter((w) => w.path.endsWith('.html'));
  const avgHtml = Math.round(html.reduce((n, w) => n + w.bytes, 0) / html.length);

  console.log(`\n  EZ Plumbing & Drains — static build`);
  console.log(`  ${'─'.repeat(52)}`);
  console.log(`  pages            ${html.length}`);
  console.log(`     home           1`);
  console.log(`     services       ${services.length}`);
  console.log(`     cities         ${cities.length}`);
  console.log(`     other          ${html.length - 1 - services.length - cities.length}`);
  console.log(`  files written    ${written.length}`);
  console.log(`  avg page HTML    ${(avgHtml / 1024).toFixed(1)} KB   (old site: 225.0 KB)`);
  console.log(`  CSS              ${(written.find((w) => w.path === 'styles.css').bytes / 1024).toFixed(1)} KB   (old site: 380.0 KB across 26 files)`);
  console.log(`  JS               ${(written.find((w) => w.path === 'app.js').bytes / 1024).toFixed(1)} KB    (old site: 1944.0 KB across 25 files)`);
  console.log(`  total output     ${(totalBytes / 1024).toFixed(0)} KB`);
  console.log(`  built in         ${Date.now() - t0} ms\n`);
}

/* ---------------------------------------------------------------- server */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/svg+xml', // og-image.png is SVG content by design
};

async function serve(port = 4321) {
  createServer(async (req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    let file = join(OUT, p);
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    } catch {
      try {
        await stat(join(file, 'index.html'));
        file = join(file, 'index.html');
      } catch {
        file = join(OUT, '404.html');
        res.statusCode = 404;
      }
    }
    try {
      const buf = await readFile(file);
      res.setHeader('Content-Type', MIME[extname(file)] || 'application/octet-stream');
      res.end(buf);
    } catch {
      res.statusCode = 404;
      res.end('Not found');
    }
  }).listen(port, () => console.log(`  serving dist/ on http://localhost:${port}\n`));
}

await build();
if (process.argv.includes('--serve')) await serve();
