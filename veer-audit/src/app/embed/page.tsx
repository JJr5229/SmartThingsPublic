import AuditWidget from '@/components/AuditWidget';

// Minimal, chrome-free version meant to be dropped into an <iframe> on your
// marketing site or coming-soon page. See README → "Embedding".
export default function EmbedPage() {
  return (
    <main className="embed-wrap">
      <AuditWidget compact />
    </main>
  );
}
