// Minimal, dependency-free lead storage: appends each lead as one JSON line to
// data/leads.jsonl. Perfect for low volume and local/VPS hosting.
//
// NOTE: On serverless platforms (Vercel) the filesystem is ephemeral, so this
// file won't persist there — the lead-notification EMAIL is your durable record
// in that case. To keep a queryable history on serverless, swap the body of
// saveLead() for a hosted store (Postgres, Supabase, Airtable, a Google Sheet).

import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { AuditResult, CategoryKey, Lead } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.jsonl');

export async function saveLead(email: string, audit: AuditResult): Promise<Lead> {
  const categoryScores = Object.fromEntries(
    audit.categories.map((c) => [c.key, c.score]),
  ) as Record<CategoryKey, number>;

  const lead: Lead = {
    id: cryptoRandomId(),
    email,
    url: audit.normalizedUrl,
    createdAt: audit.fetchedAt,
    overallScore: audit.overallScore,
    categoryScores,
  };

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.appendFile(LEADS_FILE, JSON.stringify(lead) + '\n', 'utf8');
  } catch (err) {
    // Never let a storage hiccup break the customer's audit experience.
    console.error('saveLead failed (continuing):', err);
  }
  return lead;
}

function cryptoRandomId(): string {
  // Available in Node 18+ / edge runtimes.
  return globalThis.crypto?.randomUUID?.() ?? `lead_${Date.now()}`;
}
