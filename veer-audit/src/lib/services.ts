// ============================================================================
//  VEER SERVICE CATALOG
// ----------------------------------------------------------------------------
//  Real offerings + pricing, transcribed from "Veer Service Catalog & Terms".
//  Each service maps to the audit weaknesses it solves via `solvesCategories`,
//  so a low score in a category pulls the matching services into the proposal.
//
//  ⚠️ NOTE ON AI-SERVICE / COMMAND-CENTER PRICING: in the catalog these are
//  marked "Proposed pricing — approve before use." They're included here so the
//  tool is complete, but review them before they go out to real prospects.
// ============================================================================

import type { CategoryKey } from './types';

export interface Service {
  id: string;
  name: string;
  tagline: string;
  includes: string[];
  price: string;
  // Optional extra line (payment terms, comparable value, etc.).
  note?: string;
  solvesCategories: CategoryKey[];
  tags: Array<'website' | 'ai-automation' | 'workflow' | 'marketing'>;
}

const CONTACT_EMAIL = 'info@veersolutions.com';

// The call-to-action after an audit. Default is a warm "reply and we'll set up
// your free 15-minute call" mailto — zero setup, fits Veer's high-touch intake.
// To switch to a scheduling page later (Calendly, Cal.com, etc.), just set the
// BOOKING_URL env var — the button automatically becomes "Book a free call".
const CTA = process.env.BOOKING_URL
  ? { href: process.env.BOOKING_URL, label: 'Book a free call' }
  : {
      href:
        `mailto:${CONTACT_EMAIL}` +
        `?subject=${encodeURIComponent('My website audit — let’s set up my free call')}` +
        `&body=${encodeURIComponent(
          'Hi Veer,\n\nI just ran a free website audit and I’d like to set up my free 15-minute call.\n\nMy website: \nBest times to reach me: \n\nThanks!',
        )}`,
      label: 'Reply to set up my free call',
    };

export const COMPANY = {
  name: process.env.COMPANY_NAME || 'Veer',
  email: CONTACT_EMAIL,
  cta: CTA,
  // Veer's positioning, in its own voice.
  positioning:
    '"You talk. I build. You\'re live this week." Veer builds professional small-business websites — you write nothing, a 15-minute conversation becomes your copy — and puts AI automation and marketing to work so more visitors become customers.',
};

export const SERVICES: Service[] = [
  {
    id: 'website-build',
    name: 'The Website Build — $500 flat',
    tagline: 'A professional site, written and built for you, live in about a week.',
    includes: [
      'Custom design in your brand, all copy written for you ("you write nothing")',
      'Up to 5 pages, mobile-responsive on every device',
      'Contact form + basic on-page SEO setup',
      'SSL / HTTPS security + hosting on Veer’s server',
      'One consolidated round of revisions, then launch & go-live',
    ],
    price: '$500 flat (1-page site from $300)',
    note: 'Typical comparable value $1,200. Pay in full ($500, first 3 months of Care free) or $250 deposit then 3 × $85.',
    solvesCategories: ['performance', 'seo', 'security'],
    tags: ['website'],
  },
  {
    id: 'veer-care',
    name: 'Veer Care',
    tagline: 'Keeps your site online, secure, and current — a living website, cared for.',
    includes: [
      'Hosting on Veer’s server + SSL / HTTPS encryption',
      'Automated backups, uptime monitoring, security updates',
      'Up to 30 minutes of edits per month',
    ],
    price: '$25/mo · $250/yr',
    solvesCategories: ['security'],
    tags: ['website', 'workflow'],
  },
  {
    id: 'veer-care-plus',
    name: 'Veer Care Plus',
    tagline: 'Everything in Care, plus an AI chat assistant and priority changes.',
    includes: [
      'Everything in Veer Care',
      'AI chat assistant (Veer-run — you manage no keys)',
      'Up to 60 minutes of edits per month + priority changes',
    ],
    price: '$45/mo · $450/yr',
    note: 'AI setup ($149) waived for founding clients.',
    solvesCategories: ['security'],
    tags: ['website', 'ai-automation'],
  },
  {
    id: 'website-chat-ai',
    name: 'Website Chat — AI (Claude)',
    tagline: 'An AI assistant on your site that answers questions and captures leads.',
    includes: [
      'AI chat trained on your business, funnels visitors to contact',
      'Veer runs and maintains the backend — you manage no keys',
      'Sold through Care Plus',
    ],
    price: '+$149 setup, +$15/mo',
    note: 'Prefer no AI? Smart FAQ chat (scripted, ~15 topics) is a flat +$99, no monthly.',
    solvesCategories: ['performance', 'seo'],
    tags: ['ai-automation'],
  },
  {
    id: 'ai-audit-roadmap',
    name: 'AI Audit + Roadmap',
    tagline: 'A 30-minute review and a 1-page plan for where AI saves you time.',
    includes: [
      '30-minute review of your business and workflows',
      'A 1-page "where AI saves you time" roadmap',
    ],
    price: '$150 (free for warm leads)',
    solvesCategories: ['performance', 'seo', 'security'],
    tags: ['ai-automation', 'workflow'],
  },
  {
    id: 'automation',
    name: 'AI Automation',
    tagline: 'Put one high-value workflow on autopilot.',
    includes: [
      'One workflow live — e.g. invoice chasing, review requests, content drafts, or CRM cleanup',
      'Built, connected, and running for your business',
    ],
    price: '$200 each · 3 for $500',
    solvesCategories: ['seo', 'security'],
    tags: ['ai-automation', 'workflow'],
  },
  {
    id: 'content-engine',
    name: 'Content Engine',
    tagline: 'Monthly social + email content, done for you.',
    includes: [
      'Monthly social posts and email content',
      'Written and scheduled so your marketing stays consistent',
    ],
    price: '$250/mo',
    solvesCategories: ['seo'],
    tags: ['marketing', 'workflow'],
  },
  {
    id: 'ai-partner',
    name: 'AI Partner',
    tagline: '"Your AI department" — an ongoing retainer with priority on everything.',
    includes: [
      'Ongoing AI + automation work tailored to your business',
      'Priority turnaround across builds, tools, and workflows',
    ],
    price: '$500 / $1,000 / $1,500 per month by scope',
    solvesCategories: ['performance', 'seo', 'security'],
    tags: ['ai-automation', 'workflow', 'marketing'],
  },
];

// Pick the services most relevant to the weak categories, always including at
// least one growth (AI/automation/marketing) option to widen the conversation.
export function recommendedServices(weakest: CategoryKey[]): Service[] {
  const byRelevance = SERVICES.filter((s) =>
    s.solvesCategories.some((c) => weakest.includes(c)),
  );
  const picks = byRelevance.length > 0 ? [...byRelevance] : SERVICES.slice(0, 2);

  // If the site is broadly weak, the Website Build should lead — it fixes the
  // fundamentals. Make sure it's first when present.
  picks.sort((a, b) => (a.id === 'website-build' ? -1 : b.id === 'website-build' ? 1 : 0));

  const hasGrowth = picks.some((s) =>
    s.tags.some((t) => t === 'ai-automation' || t === 'marketing' || t === 'workflow'),
  );
  if (!hasGrowth) {
    const growth = SERVICES.find((s) =>
      s.tags.some((t) => t === 'ai-automation' || t === 'marketing'),
    );
    if (growth) picks.push(growth);
  }
  return picks.slice(0, 4);
}
