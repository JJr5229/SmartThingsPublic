// Generates the proposal that goes in the customer's email. Uses Claude when
// ANTHROPIC_API_KEY is set; otherwise builds a solid template from the audit
// results + service catalog so the tool works end-to-end with zero keys.

import type { AuditResult } from './types';
import { COMPANY, recommendedServices, type Service } from './services';

function auditBrief(audit: AuditResult): string {
  const lines: string[] = [];
  lines.push(`Overall score: ${audit.overallScore}/100`);
  for (const cat of audit.categories) {
    lines.push(`\n${cat.label}: ${cat.score}/100`);
    for (const c of cat.checks.filter((x) => !x.passed)) {
      lines.push(`  - ISSUE: ${c.label} — ${c.detail}`);
    }
  }
  return lines.join('\n');
}

function templateProposal(audit: AuditResult, services: Service[]): string {
  const weak = audit.categories
    .filter((c) => audit.weakestCategories.includes(c.key))
    .map((c) => c.label)
    .join(', ');

  const serviceBlocks = services
    .map(
      (s) =>
        `• ${s.name} — ${s.tagline}\n   Includes: ${s.includes.join('; ')}\n   Investment: ${s.price}` +
        (s.note ? `\n   Note: ${s.note}` : ''),
    )
    .join('\n\n');

  return [
    `Thanks for running a free audit on ${audit.normalizedUrl}.`,
    ``,
    `Your site scored ${audit.overallScore}/100. The biggest opportunities we found are in: ${weak}.`,
    ``,
    `Here's how ${COMPANY.name} can help:`,
    ``,
    serviceBlocks,
    ``,
    `Want to walk through the results? Grab a time here: ${COMPANY.bookingUrl}`,
  ].join('\n');
}

export async function generateProposal(audit: AuditResult): Promise<string> {
  const services = recommendedServices(audit.weakestCategories);
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return templateProposal(audit, services);

  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';
  const catalogText = services
    .map(
      (s) =>
        `- ${s.name}: ${s.tagline} Includes: ${s.includes.join('; ')}. Price: ${s.price}.` +
        (s.note ? ` ${s.note}` : '') +
        ` Helps with: ${s.solvesCategories.join(', ')}.`,
    )
    .join('\n');

  const prompt = [
    `You are a sales consultant for ${COMPANY.name}. ${COMPANY.positioning}`,
    ``,
    `A prospect just ran a free audit of their website (${audit.normalizedUrl}). Write a short, warm, personalized proposal email body (no subject line, ~180-260 words). Be specific about the concrete problems found, connect each to a business impact (lost customers, poor Google ranking, lost trust), then recommend ONLY the services below that fit. Quote the prices exactly as written. End by inviting them to book a call at ${COMPANY.bookingUrl}. Do not invent services or prices. Plain text, no markdown headers.`,
    ``,
    `AUDIT RESULTS:`,
    auditBrief(audit),
    ``,
    `SERVICES YOU MAY RECOMMEND (use only these, quote prices verbatim):`,
    catalogText,
  ].join('\n');

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) return templateProposal(audit, services);
    const data = await res.json();
    const text = data?.content?.[0]?.text;
    return typeof text === 'string' && text.trim()
      ? text.trim()
      : templateProposal(audit, services);
  } catch {
    return templateProposal(audit, services);
  }
}
