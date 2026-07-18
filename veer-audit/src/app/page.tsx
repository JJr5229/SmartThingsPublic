import AuditWidget from '@/components/AuditWidget';
import { COMPANY } from '@/lib/services';

export default function Home() {
  return (
    <main className="wrap">
      <header className="brandbar">
        <span className="brand">{COMPANY.name}</span>
        <span className="brand-sub">Free Website Audit</span>
      </header>
      <section className="hero">
        <h1>How healthy is your website?</h1>
        <p className="sub">
          Get a free, instant audit of your site’s speed, SEO, and security — plus a tailored
          plan showing exactly how to improve it and turn more visitors into customers.
        </p>
      </section>
      <AuditWidget />
    </main>
  );
}
