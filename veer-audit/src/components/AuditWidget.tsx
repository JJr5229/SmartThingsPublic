'use client';

import { useState } from 'react';
import type { AuditResult } from '@/lib/types';
import { COMPANY } from '@/lib/services';

function scoreClass(score: number): string {
  if (score >= 80) return 'var(--good)';
  if (score >= 50) return 'var(--warn)';
  return 'var(--bad)';
}

export default function AuditWidget({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AuditResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
      } else {
        setResult(data.audit as AuditResult);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div>
        <div className="card">
          <div className="score-hero">
            <div className="score-num" style={{ color: scoreClass(result.overallScore) }}>
              {result.overallScore}
              <small>/100</small>
            </div>
            <div className="score-label">Overall score for {result.normalizedUrl}</div>
          </div>
        </div>

        <div className="cats">
          {result.categories.map((cat) => (
            <div className="cat" key={cat.key}>
              <div className="cat-head">
                <h3>{cat.label}</h3>
                <span className="cat-score" style={{ color: scoreClass(cat.score) }}>
                  {cat.score}/100
                </span>
              </div>
              <div className="bar">
                <i style={{ width: `${cat.score}%`, background: scoreClass(cat.score) }} />
              </div>
              <ul className="checks">
                {cat.checks.map((c) => (
                  <li key={c.id} className={c.passed ? 'pass' : 'fail'}>
                    <span className="mark">{c.passed ? '✓' : '✕'}</span>
                    <span>
                      <strong>{c.label}.</strong> {c.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="next">
          <h3>We just emailed you a full plan</h3>
          <p>
            Check <strong>{email}</strong> for your detailed results and a tailored plan to fix
            what we found. Want to talk it through?
          </p>
          <a className="cta" style={{ textDecoration: 'none' }} href={COMPANY.bookingUrl}>
            Book a free call
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <form className="audit" onSubmit={onSubmit}>
        <div className="row">
          <label htmlFor="url">Your website</label>
          <input
            id="url"
            name="url"
            type="text"
            inputMode="url"
            placeholder="yourbusiness.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div className="row">
          <label htmlFor="email">Where should we send your results?</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@yourbusiness.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="cta" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" /> Auditing your site…
            </>
          ) : (
            'Get my free audit'
          )}
        </button>
        {error && <div className="error">{error}</div>}
        {!compact && (
          <div className="hint">
            Takes about 20 seconds. We’ll check performance, SEO, and security — no spam.
          </div>
        )}
      </form>
    </div>
  );
}
