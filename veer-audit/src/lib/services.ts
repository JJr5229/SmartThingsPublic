// ============================================================================
//  VEER SERVICE CATALOG  —  ⚠️ PLACEHOLDER DATA ⚠️
// ----------------------------------------------------------------------------
//  This is the ONE file to replace with your real offerings from the
//  "Veer Service Catalog & Terms" doc. Everything downstream (the proposal
//  email + the on-screen recommendations) is generated from what's here, so
//  once these are real, the proposals quote real services and prices.
//
//  Each service maps to the audit weaknesses it solves via `solvesCategories`.
//  When a customer's site scores low in a category, the matching services are
//  pulled into their proposal.
// ============================================================================

import type { CategoryKey } from './types';

export interface Service {
  id: string;
  name: string;
  // One-line hook shown to the customer.
  tagline: string;
  // What's included — a few bullet points.
  includes: string[];
  // Pricing as a display string (keep it flexible: "from $X", "$X/mo", etc.).
  price: string;
  // Which audit categories this service helps fix. Drives proposal targeting.
  solvesCategories: CategoryKey[];
  // Broader value props beyond the audit (AI automation, workflow, marketing).
  tags: Array<'website' | 'ai-automation' | 'workflow' | 'marketing'>;
}

export const COMPANY = {
  name: process.env.COMPANY_NAME || 'Veer',
  bookingUrl: process.env.BOOKING_URL || 'https://calendly.com/your-veer-link',
  // Short positioning line used at the top of proposals.
  positioning:
    'We help businesses fix their websites and put AI automation, workflow, and marketing to work — so more visitors turn into customers.',
};

// TODO: Replace every entry below with the real Veer Service Catalog offerings.
export const SERVICES: Service[] = [
  {
    id: 'website-revamp',
    name: 'Website Revamp & Performance Tune-Up',
    tagline: 'A faster, cleaner site that loads in under 2 seconds and converts.',
    includes: [
      'Full performance optimization (images, scripts, Core Web Vitals)',
      'Modern, mobile-first redesign of key pages',
      'Conversion-focused layout and calls to action',
    ],
    price: 'from $2,500 (placeholder)',
    solvesCategories: ['performance', 'seo'],
    tags: ['website'],
  },
  {
    id: 'seo-foundations',
    name: 'SEO Foundations Package',
    tagline: 'Get found on Google with the technical + on-page basics done right.',
    includes: [
      'Metadata, headings, and structured data cleanup',
      'Sitemap, indexing, and mobile-friendliness fixes',
      'Keyword-targeted copy for your top pages',
    ],
    price: 'from $1,200 (placeholder)',
    solvesCategories: ['seo'],
    tags: ['website', 'marketing'],
  },
  {
    id: 'security-hardening',
    name: 'Security & Trust Hardening',
    tagline: 'HTTPS, security headers, and a site visitors (and Google) trust.',
    includes: [
      'HTTPS + security header configuration',
      'Broken link and mixed-content cleanup',
      'Basic monitoring so issues get caught early',
    ],
    price: 'from $800 (placeholder)',
    solvesCategories: ['security'],
    tags: ['website'],
  },
  {
    id: 'ai-automation',
    name: 'AI Automation Starter',
    tagline: 'Put AI to work on the repetitive tasks eating your team’s time.',
    includes: [
      'AI chat/assistant for lead capture and FAQs on your site',
      'Automated follow-up emails and lead routing',
      'Custom workflow built around one high-value process',
    ],
    price: 'from $1,500 + $250/mo (placeholder)',
    solvesCategories: ['performance', 'seo', 'security'],
    tags: ['ai-automation', 'workflow'],
  },
  {
    id: 'marketing-engine',
    name: 'Marketing Engine (Monthly)',
    tagline: 'A steady stream of content and campaigns that bring in leads.',
    includes: [
      'Monthly content + landing pages',
      'Email marketing and lead-nurture sequences',
      'Reporting so you can see what’s working',
    ],
    price: '$900/mo (placeholder)',
    solvesCategories: ['seo'],
    tags: ['marketing', 'workflow'],
  },
];

// Pick the services most relevant to a given set of weak categories, always
// including at least one automation/marketing option to widen the conversation.
export function recommendedServices(weakest: CategoryKey[]): Service[] {
  const byRelevance = SERVICES.filter((s) =>
    s.solvesCategories.some((c) => weakest.includes(c)),
  );
  const picks = byRelevance.length > 0 ? byRelevance : SERVICES.slice(0, 2);

  // Ensure at least one AI/automation or marketing service is present.
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
