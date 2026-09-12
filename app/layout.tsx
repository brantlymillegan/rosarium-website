import type { Metadata } from 'next';
import './globals.css';
import { themeInitializationScript } from './theme';

export const metadata: Metadata = {
  metadataBase: new URL('https://rosariumprayer.com'),
  title: 'Rosarium — Pray at your own pace',
  description:
    'A private, offline Catholic prayer companion for the Rosary, traditional chaplets, novenas, Scripture, and familiar prayers.',
  applicationName: 'Rosarium',
  icons: {
    icon: [
      { url: '/favicon-circle.ico', type: 'image/x-icon', sizes: '16x16 32x32 48x48 64x64 128x128 256x256' },
      { url: '/favicon-circle.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon-circle.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    shortcut: '/favicon-circle.ico',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta id="theme-color" name="theme-color" content="#f6f4ef" />
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
