// The audit engine: fetch a URL and score it across performance, SEO, and
// security. Designed to run synchronously in ~a few seconds with no external
// dependencies beyond an optional Google PageSpeed key.

import type {
  AuditResult,
  CategoryKey,
  CategoryScore,
  CheckResult,
} from './types';

const CATEGORY_WEIGHTS: Record<CategoryKey, number> = {
  performance: 0.4,
  seo: 0.35,
  security: 0.25,
};

function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  // Throws if still invalid — caller handles it.
  const u = new URL(url);
  return u.toString();
}

function scoreChecks(checks: CheckResult[]): number {
  const total = checks.reduce((s, c) => s + c.weight, 0);
  if (total === 0) return 0;
  const earned = checks.reduce((s, c) => s + (c.passed ? c.weight : 0), 0);
  return Math.round((earned / total) * 100);
}

// --- SEO + security run off the fetched HTML + response headers ------------

function seoChecks(html: string, headers: Headers, finalUrl: string): CheckResult[] {
  const head = html.slice(0, 200_000); // enough to cover <head>
  const has = (re: RegExp) => re.test(head);

  const titleMatch = head.match(/<title[^>]*>([^<]*)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].trim() : '';

  const descMatch = head.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
  );
  const descText = descMatch ? descMatch[1].trim() : '';

  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  const imgsWithAlt = imgTags.filter((t) => /\balt\s*=/i.test(t)).length;
  const altOk = imgTags.length === 0 || imgsWithAlt / imgTags.length >= 0.8;

  return [
    {
      id: 'title',
      label: 'Page title',
      passed: titleText.length >= 10 && titleText.length <= 65,
      detail: titleText
        ? `Title is ${titleText.length} characters ("${titleText.slice(0, 60)}").`
        : 'No <title> tag found — search engines have nothing to show in results.',
      weight: 2,
    },
    {
      id: 'meta-description',
      label: 'Meta description',
      passed: descText.length >= 50 && descText.length <= 160,
      detail: descText
        ? `Description is ${descText.length} characters.`
        : 'No meta description — Google guesses your search snippet for you.',
      weight: 2,
    },
    {
      id: 'h1',
      label: 'Single clear H1 heading',
      passed: h1Count === 1,
      detail:
        h1Count === 1
          ? 'Exactly one H1 heading found.'
          : `Found ${h1Count} H1 headings (ideal is exactly 1).`,
      weight: 1,
    },
    {
      id: 'viewport',
      label: 'Mobile viewport tag',
      passed: has(/<meta[^>]+name=["']viewport["']/i),
      detail: has(/<meta[^>]+name=["']viewport["']/i)
        ? 'Mobile viewport is set.'
        : 'No viewport tag — the site likely renders poorly on phones.',
      weight: 2,
    },
    {
      id: 'og',
      label: 'Social sharing tags (Open Graph)',
      passed: has(/<meta[^>]+property=["']og:/i),
      detail: has(/<meta[^>]+property=["']og:/i)
        ? 'Open Graph tags present.'
        : 'No Open Graph tags — links shared on social look plain.',
      weight: 1,
    },
    {
      id: 'alt-text',
      label: 'Image alt text',
      passed: altOk,
      detail:
        imgTags.length === 0
          ? 'No images to check.'
          : `${imgsWithAlt}/${imgTags.length} images have alt text.`,
      weight: 1,
    },
    {
      id: 'canonical',
      label: 'Canonical URL',
      passed: has(/<link[^>]+rel=["']canonical["']/i),
      detail: has(/<link[^>]+rel=["']canonical["']/i)
        ? 'Canonical link present.'
        : 'No canonical tag — can cause duplicate-content issues.',
      weight: 1,
    },
  ];
}

function securityChecks(headers: Headers, finalUrl: string): CheckResult[] {
  const isHttps = finalUrl.startsWith('https://');
  const h = (name: string) => headers.get(name);

  return [
    {
      id: 'https',
      label: 'HTTPS / SSL',
      passed: isHttps,
      detail: isHttps
        ? 'Site is served over HTTPS.'
        : 'Site is not on HTTPS — browsers flag it as "Not Secure".',
      weight: 3,
    },
    {
      id: 'hsts',
      label: 'HSTS header',
      passed: !!h('strict-transport-security'),
      detail: h('strict-transport-security')
        ? 'Strict-Transport-Security is set.'
        : 'No HSTS header — repeat visits can be downgraded to HTTP.',
      weight: 1,
    },
    {
      id: 'xcto',
      label: 'X-Content-Type-Options',
      passed: (h('x-content-type-options') || '').toLowerCase() === 'nosniff',
      detail: h('x-content-type-options')
        ? 'nosniff protection enabled.'
        : 'Missing X-Content-Type-Options header.',
      weight: 1,
    },
    {
      id: 'csp',
      label: 'Content-Security-Policy',
      passed: !!h('content-security-policy'),
      detail: h('content-security-policy')
        ? 'CSP header present.'
        : 'No Content-Security-Policy — weaker protection against injection.',
      weight: 1,
    },
    {
      id: 'frame',
      label: 'Clickjacking protection',
      passed:
        !!h('x-frame-options') ||
        /frame-ancestors/i.test(h('content-security-policy') || ''),
      detail:
        h('x-frame-options') || /frame-ancestors/i.test(h('content-security-policy') || '')
          ? 'Framing protection present.'
          : 'No X-Frame-Options / frame-ancestors — vulnerable to clickjacking.',
      weight: 1,
    },
  ];
}

// --- Performance: prefer Google PageSpeed, fall back to a local heuristic ---

async function performanceChecks(
  normalizedUrl: string,
  html: string,
  loadMs: number,
  htmlBytes: number,
): Promise<CheckResult[]> {
  const key = process.env.PAGESPEED_API_KEY;
  if (key) {
    try {
      const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
      api.searchParams.set('url', normalizedUrl);
      api.searchParams.set('strategy', 'mobile');
      api.searchParams.set('category', 'performance');
      api.searchParams.set('key', key);
      const res = await fetch(api, { signal: AbortSignal.timeout(25_000) });
      if (res.ok) {
        const data = await res.json();
        const perf = data?.lighthouseResult?.categories?.performance?.score;
        const audits = data?.lighthouseResult?.audits || {};
        const lcp = audits['largest-contentful-paint']?.displayValue;
        const cls = audits['cumulative-layout-shift']?.displayValue;
        const tbt = audits['total-blocking-time']?.displayValue;
        if (typeof perf === 'number') {
          // Convert Lighthouse's 0–1 score into pass/fail buckets so it blends
          // with our other checks.
          return [
            {
              id: 'lighthouse',
              label: 'Google Lighthouse performance',
              passed: perf >= 0.9,
              detail: `Lighthouse mobile score ${Math.round(perf * 100)}/100.`,
              weight: 5,
            },
            {
              id: 'lcp',
              label: 'Largest Contentful Paint',
              passed: (audits['largest-contentful-paint']?.score ?? 0) >= 0.9,
              detail: lcp ? `LCP ${lcp} (good is < 2.5s).` : 'LCP unavailable.',
              weight: 2,
            },
            {
              id: 'cls',
              label: 'Layout stability (CLS)',
              passed: (audits['cumulative-layout-shift']?.score ?? 0) >= 0.9,
              detail: cls ? `CLS ${cls} (good is < 0.1).` : 'CLS unavailable.',
              weight: 1,
            },
            {
              id: 'tbt',
              label: 'Main-thread blocking (TBT)',
              passed: (audits['total-blocking-time']?.score ?? 0) >= 0.9,
              detail: tbt ? `TBT ${tbt} (good is < 200ms).` : 'TBT unavailable.',
              weight: 2,
            },
          ];
        }
      }
    } catch {
      // Fall through to the local heuristic below.
    }
  }

  // Local fallback: use our own fetch timing + basic page-weight signals.
  const scripts = (html.match(/<script\b/gi) || []).length;
  const inlineStyle = (html.match(/<style\b/gi) || []).length;
  return [
    {
      id: 'ttfb',
      label: 'Server response time',
      passed: loadMs < 1500,
      detail: `HTML returned in ${loadMs} ms (good is < 1500 ms).`,
      weight: 3,
    },
    {
      id: 'html-size',
      label: 'HTML document size',
      passed: htmlBytes < 150_000,
      detail: `HTML is ${(htmlBytes / 1024).toFixed(0)} KB (lean is < 150 KB).`,
      weight: 2,
    },
    {
      id: 'script-count',
      label: 'Script count',
      passed: scripts <= 15,
      detail: `${scripts} <script> tags found (fewer is faster).`,
      weight: 2,
    },
    {
      id: 'inline-style',
      label: 'Render-blocking inline styles',
      passed: inlineStyle <= 5,
      detail: `${inlineStyle} inline <style> blocks found.`,
      weight: 1,
    },
  ];
}

export async function runAudit(rawUrl: string): Promise<AuditResult> {
  let normalizedUrl: string;
  try {
    normalizedUrl = normalizeUrl(rawUrl);
  } catch {
    throw new Error('That does not look like a valid website address.');
  }

  const start = Date.now();
  let html = '';
  let headers = new Headers();
  let finalUrl = normalizedUrl;
  try {
    const res = await fetch(normalizedUrl, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
      headers: { 'User-Agent': 'VeerAuditBot/1.0 (+https://veer.example)' },
    });
    headers = res.headers;
    finalUrl = res.url || normalizedUrl;
    html = await res.text();
  } catch {
    throw new Error(
      'We could not load that website. Double-check the address and that the site is online.',
    );
  }
  const loadMs = Date.now() - start;
  const htmlBytes = Buffer.byteLength(html, 'utf8');

  const perf = await performanceChecks(normalizedUrl, html, loadMs, htmlBytes);
  const seo = seoChecks(html, headers, finalUrl);
  const security = securityChecks(headers, finalUrl);

  const categories: CategoryScore[] = [
    { key: 'performance', label: 'Performance & Speed', score: scoreChecks(perf), checks: perf },
    { key: 'seo', label: 'SEO & Discoverability', score: scoreChecks(seo), checks: seo },
    { key: 'security', label: 'Security & Trust', score: scoreChecks(security), checks: security },
  ];

  const overallScore = Math.round(
    categories.reduce((s, c) => s + c.score * CATEGORY_WEIGHTS[c.key], 0),
  );

  const weakestCategories = [...categories]
    .sort((a, b) => a.score - b.score)
    .filter((c) => c.score < 80)
    .map((c) => c.key);

  return {
    url: rawUrl,
    normalizedUrl: finalUrl,
    fetchedAt: new Date().toISOString(),
    overallScore,
    categories,
    weakestCategories: weakestCategories.length ? weakestCategories : [categories[0].key],
  };
}
