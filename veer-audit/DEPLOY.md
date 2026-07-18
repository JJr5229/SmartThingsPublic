# Deploying Veer Audit to Vercel

This app is **its own page/project**, separate from your coming-soon page. You'll
deploy it as a second Vercel project, give it a subdomain like
`audit.yourdomain.com`, and add a link/button to it from your coming-soon page.

---

## 1. Create the Vercel project

The audit app lives in the **`veer-audit/`** subfolder of this repo (the repo root
is an unrelated codebase), so you must point Vercel at that subfolder.

1. Vercel dashboard → **Add New… → Project**.
2. Import this same GitHub repo (`JJr5229/SmartThingsPublic`).
3. **Important:** set **Root Directory** to `veer-audit`.
   (Edit → select `veer-audit` → Continue.)
4. Framework preset auto-detects as **Next.js**. Leave build settings default.
5. Set the branch to deploy from: **`claude/website-audit-tool-up2d18`**
   (or merge it to `main` first and deploy `main`).
6. Add the environment variables below, then **Deploy**.

You'll get a URL like `veer-audit-xxxx.vercel.app`. Test it there first.

---

## 2. Environment variables (set in Vercel → Project → Settings → Environment Variables)

**To actually receive leads in production, the email vars are effectively required.**
On Vercel the local `data/leads.jsonl` file does **not** persist (serverless), so the
**lead-notification email is your record of every lead.** Without it, submissions
only land in ephemeral function logs.

| Variable | Required? | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | **Yes (for production)** | Sends the customer email + your lead alert. Sign up at resend.com, verify your domain. |
| `EMAIL_FROM` | **Yes** | e.g. `Veer <hello@veersolutions.com>` — must be on your Resend-verified domain. |
| `LEAD_NOTIFY_TO` | **Yes** | Where lead alerts go, e.g. `info@veersolutions.com`. |
| `ANTHROPIC_API_KEY` | Recommended | Turns on AI-written proposals (else a good template is used). |
| `ANTHROPIC_MODEL` | Optional | Defaults to `claude-sonnet-5`. |
| `PAGESPEED_API_KEY` | Recommended | Real Google Lighthouse performance scores. |
| `BOOKING_URL` | Optional | Leave blank for the "reply to set up your call" email CTA; set a Calendly/Cal.com link to switch to a "Book a free call" button. |
| `COMPANY_NAME` | Optional | Defaults to `Veer`. |
| `PUBLIC_BASE_URL` | Optional | Your final URL, e.g. `https://audit.yourdomain.com`. |

After adding/changing env vars, **redeploy** for them to take effect.

---

## 3. Point your domain at it

Your coming-soon page is a different Vercel project and already owns the apex
domain, so give the audit tool a **subdomain**:

1. Audit project → **Settings → Domains → Add** → `audit.yourdomain.com`.
2. Vercel shows a DNS record to add (usually a `CNAME` for `audit` →
   `cname.vercel-dns.com`). Add it at your DNS provider.
3. Wait for it to verify (usually minutes). Done.

(If you'd rather it live at `yourdomain.com/audit` instead of a subdomain, that
needs a rewrite/proxy from the coming-soon project — tell me and I'll set that up.
A subdomain is simpler and recommended.)

---

## 4. Link it from your coming-soon page

Add a button/link on the coming-soon page pointing at the audit tool:

```html
<a href="https://audit.yourdomain.com"
   style="display:inline-block;padding:14px 22px;border-radius:10px;
          background:#6d5efc;color:#fff;text-decoration:none;font-weight:600;">
  Get your free website audit →
</a>
```

That's it — visitors click through to the audit page, run their audit, and you get
the lead by email.

---

## 5. Going live checklist

- [ ] Root Directory set to `veer-audit` in Vercel
- [ ] `RESEND_API_KEY` + `EMAIL_FROM` + `LEAD_NOTIFY_TO` set (so you receive leads)
- [ ] Sent yourself a test audit and received both emails
- [ ] `audit.yourdomain.com` resolves
- [ ] Link added to the coming-soon page
- [ ] (Optional) `ANTHROPIC_API_KEY` + `PAGESPEED_API_KEY` added for AI proposals + real speed scores

## Notes

- **Function timeout:** the audit route is capped at 60s (`maxDuration`). A live
  PageSpeed call takes ~15–25s; well within budget.
- **Leads history:** to keep a queryable list (not just emails) on serverless, swap
  `saveLead()` in `src/lib/storage.ts` for a hosted store (Supabase/Postgres/
  Airtable/Google Sheet). Ask and I'll wire one in.
