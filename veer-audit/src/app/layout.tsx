import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Free Website Audit — Veer',
  description:
    'Get a free, instant audit of your website’s performance, SEO, and security — plus a tailored plan to improve it.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
