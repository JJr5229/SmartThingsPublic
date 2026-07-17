# Veer Audit

A free-website-audit **lead magnet**. A visitor enters their URL + email, gets an
instant scorecard (performance, SEO, security), and is emailed a tailored proposal
mapping their site's weaknesses to Veer's services. You get the lead.

```
Visitor → enters URL + email
        → live audit (Performance / SEO / Security) → score 0–100
        → on-screen scorecard
        → email to customer (scorecard + AI/template proposal from your services)
        → lead saved + notification email to you
```

## Quick start (local)

```bash
cd veer-audit
npm install
cp .env.example .env.local     # optional — works with no keys
npm run dev                     # http://localhost:3000
```

With **no API keys**, everything still works: the audit runs, the proposal uses a
built-in template, and emails are printed to your terminal instead of being sent.
Add keys in `.env.local` to turn on the real thing.

## What to configure

| Env var | What it unlocks | Without it |
| --- | --- | --- |
| `PAGESPEED_API_KEY` | Real Google Lighthouse performance scores | Falls back to a local speed heuristic |
| `ANTHROPIC_API_KEY` | AI-written proposal per lead (Claude) | Uses a solid template proposal |
| `RESEND_API_KEY` + `EMAIL_FROM` | Actually sends the emails | Emails logged to the console |
| `LEAD_NOTIFY_TO` | Where your lead alerts go | No notification email |
| `BOOKING_URL` | Your “book a call” link in emails/CTA | Placeholder link |

## ⚠️ Put in your real services & pricing

Open **`src/lib/services.ts`** and replace the placeholder `SERVICES` with the real
offerings from your *Veer Service Catalog*. Each service lists which audit
categories it fixes (`solvesCategories`), which is how proposals get targeted to
each lead's weak spots. This is the only file you need to touch for that.

## Embedding on your site / coming-soon page

The tool exposes a chrome-free widget at **`/embed`**. After deploying, drop this
onto any page:

```html
<iframe
  src="https://YOUR-DEPLOYED-URL/embed"
  style="width:100%;max-width:560px;height:640px;border:0;"
  title="Free Website Audit"
></iframe>
```

`next.config.mjs` allows framing on `/embed`. Once you know your real domains,
lock it down by replacing `frame-ancestors *` with your domains.

## Deploy

Easiest is **Vercel**: push this folder, import it, set the env vars in the
dashboard, deploy. Note: on serverless the local `data/leads.jsonl` file is
**not** persistent — your durable lead record there is the notification email.
For a queryable history on serverless, swap `saveLead()` in
`src/lib/storage.ts` for a hosted store (Postgres/Supabase/Airtable/Google Sheet).

## Leads

Locally (or on a VPS), captured leads append to `data/leads.jsonl` — one JSON
object per line. That file is git-ignored so you never commit customer data.

## Audit checks (current)

- **Performance:** Google Lighthouse (LCP, CLS, TBT) when a key is set, else
  server response time + page-weight heuristics.
- **SEO:** title, meta description, H1, mobile viewport, Open Graph, image alt
  text, canonical.
- **Security:** HTTPS, HSTS, X-Content-Type-Options, CSP, clickjacking protection.

Adjust weights and add checks in `src/lib/audit.ts`.
