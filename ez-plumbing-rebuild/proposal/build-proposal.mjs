#!/usr/bin/env node
/**
 * Assembles proposal/index.html.
 *
 * The screenshots are spliced in as base64 data URIs rather than referenced as
 * files, so the finished proposal is a single self-contained page that survives
 * being emailed, texted, or opened from a thumb drive. Per the Veer skill: never
 * reference a local file:// path in a client-facing document.
 *
 *   node build-proposal.mjs [--shots <dir>]
 *
 * If the screenshot files are absent the page still builds, with the preview
 * frame replaced by a labelled placeholder — nothing silently renders broken.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const argIdx = process.argv.indexOf('--shots');
const SHOTS = argIdx > -1 ? process.argv[argIdx + 1] : join(HERE, 'shots');

async function shot(name) {
  try {
    return (await readFile(join(SHOTS, name), 'utf8')).trim();
  } catch {
    console.warn(`  ! ${name} not found in ${SHOTS} — using placeholder`);
    return null;
  }
}

const heroShot = await shot('hero.jpg.txt');
const mobileShot = await shot('mobile.jpg.txt');

const template = await readFile(join(HERE, 'template.html'), 'utf8');

const placeholder = (label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1180" height="640"><rect width="1180" height="640" fill="#f4f4f6"/><text x="590" y="320" font-family="sans-serif" font-size="22" fill="#8a8a93" text-anchor="middle">${label} — screenshot not embedded</text></svg>`
  )}`;

const out = template
  .replace('{{HERO_SHOT}}', heroShot || placeholder('Desktop preview'))
  .replace('{{MOBILE_SHOT}}', mobileShot || placeholder('Mobile preview'))
  .replace('{{DATE}}', '31 July 2026');

await writeFile(join(HERE, 'index.html'), out, 'utf8');
console.log(`  proposal/index.html written — ${(Buffer.byteLength(out) / 1024).toFixed(0)} KB, fully self-contained`);
