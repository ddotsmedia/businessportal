import type { Metadata } from 'next';
import '@businessportal/ui/css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ddotsmedia Business Portal',
  description: 'Business portal for Ddotsmedia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
