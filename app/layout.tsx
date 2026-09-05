import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://rosariumprayer.com'),
  title: 'Rosarium — Pray at your own pace',
  description:
    'A private, offline Catholic prayer companion for the Rosary, traditional chaplets, novenas, Scripture, and familiar prayers.',
  applicationName: 'Rosarium',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '64x64' },
      { url: '/images/rosarium-icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: '/images/rosarium-icon.png',
  },
  openGraph: {
    title: 'Rosarium — Pray at your own pace',
    description:
      'A private, offline Catholic prayer companion for the Rosary, chaplets, novenas, and familiar prayers.',
    type: 'website',
    url: '/',
    siteName: 'Rosarium',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Rosarium — Pray at your own pace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rosarium — Pray at your own pace',
    description:
      'A private, offline Catholic prayer companion for the Rosary, chaplets, novenas, and familiar prayers.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
