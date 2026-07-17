import { NextResponse } from 'next/server';
import { runAudit } from '@/lib/audit';
import { generateProposal } from '@/lib/proposal';
import { sendCustomerEmail, sendLeadNotification } from '@/lib/email';
import { saveLead } from '@/lib/storage';

export const runtime = 'nodejs';
export const maxDuration = 60;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { url?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const url = (body.url || '').trim();
  const email = (body.email || '').trim();

  if (!url) {
    return NextResponse.json({ error: 'Please enter a website address.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  let audit;
  try {
    audit = await runAudit(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Audit failed.';
    return NextResponse.json({ error: message }, { status: 422 });
  }

  // Persist the lead and fire the emails. Do these in the background-ish: we
  // still await so serverless doesn't kill them, but failures never block the
  // scorecard the visitor is waiting on.
  try {
    const proposal = await generateProposal(audit);
    await saveLead(email, audit);
    await Promise.allSettled([
      sendCustomerEmail(email, audit, proposal),
      sendLeadNotification(email, audit),
    ]);
  } catch (err) {
    console.error('Post-audit follow-up failed (continuing):', err);
  }

  return NextResponse.json({ audit });
}
