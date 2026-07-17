// Email delivery. Uses Resend when RESEND_API_KEY is set; otherwise logs the
// message to the server console so the flow is fully testable without an
// account. Sends two emails per audit: one to the customer, one to you.

import type { AuditResult } from './types';
import { COMPANY } from './services';

interface SendArgs {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

async function send({ to, subject, text, html }: SendArgs): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Veer <onboarding@resend.dev>';

  if (!apiKey) {
    console.log(
      `\n----- EMAIL (not sent — set RESEND_API_KEY to enable) -----\nFrom: ${from}\nTo: ${to}\nSubject: ${subject}\n\n${text}\n-----------------------------------------------------------\n`,
    );
    return false;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, text, html: html || undefined }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.error('Resend send failed:', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('Resend send error:', err);
    return false;
  }
}

function scorecardHtml(audit: AuditResult, proposal: string): string {
  const rows = audit.categories
    .map(
      (c) =>
        `<tr><td style="padding:6px 12px;">${c.label}</td><td style="padding:6px 12px;font-weight:600;">${c.score}/100</td></tr>`,
    )
    .join('');
  const proposalHtml = proposal
    .split('\n')
    .map((l) => (l.trim() ? `<p style="margin:0 0 10px;">${escapeHtml(l)}</p>` : ''))
    .join('');
  return `
  <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:600px;margin:0 auto;color:#111;">
    <h2 style="margin:0 0 4px;">Your website audit is ready</h2>
    <p style="color:#555;margin:0 0 16px;">${escapeHtml(audit.normalizedUrl)}</p>
    <div style="font-size:40px;font-weight:800;color:${scoreColor(audit.overallScore)};">${audit.overallScore}<span style="font-size:20px;color:#888;">/100</span></div>
    <table style="border-collapse:collapse;margin:12px 0 20px;width:100%;background:#f7f7f9;border-radius:8px;">${rows}</table>
    ${proposalHtml}
    <a href="${COMPANY.bookingUrl}" style="display:inline-block;margin-top:12px;background:#111;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;">Book a free call</a>
  </div>`;
}

function scoreColor(score: number): string {
  if (score >= 80) return '#1a7f37';
  if (score >= 50) return '#b7791f';
  return '#c02626';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendCustomerEmail(
  toEmail: string,
  audit: AuditResult,
  proposal: string,
): Promise<boolean> {
  return send({
    to: toEmail,
    subject: `Your website audit: ${audit.overallScore}/100 — and how to improve it`,
    text: `Your website audit for ${audit.normalizedUrl} scored ${audit.overallScore}/100.\n\n${proposal}\n\nBook a call: ${COMPANY.bookingUrl}`,
    html: scorecardHtml(audit, proposal),
  });
}

export async function sendLeadNotification(
  leadEmail: string,
  audit: AuditResult,
): Promise<boolean> {
  const to = process.env.LEAD_NOTIFY_TO;
  if (!to) return false;
  const breakdown = audit.categories.map((c) => `${c.label}: ${c.score}/100`).join('\n');
  return send({
    to,
    subject: `New audit lead: ${leadEmail} (${audit.overallScore}/100)`,
    text: `New lead from the website audit tool.\n\nEmail: ${leadEmail}\nSite: ${audit.normalizedUrl}\nOverall: ${audit.overallScore}/100\n\n${breakdown}`,
  });
}
