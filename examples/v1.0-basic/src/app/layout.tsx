// Root layout - provides HTML shell and global styles
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | LABS',
    default: 'LABS - Learn Advanced Business Skills',
  },
  description: 'Enterprise learning platform built with Next.js 15 + FSD',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
