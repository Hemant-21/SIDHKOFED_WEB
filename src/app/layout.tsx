import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { env } from '@/config/env';
import { getContactSettings } from '@/lib/contact-settings';
import { getSocialSettings } from '@/lib/social-settings';
import { AppProviders } from '@/providers/app-providers';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

// Self-hosted (vendored under src/fonts) rather than fetched from Google Fonts at build
// time via next/font/google - the production host has no outbound internet access, so a
// build-time dependency on fonts.gstatic.com would make every build there fail.
// Each file is a variable font (wght axis), so one file covers the whole weight range.
const notoSans = localFont({
  src: '../fonts/noto-sans-latin.woff2',
  variable: '--font-sans',
  display: 'swap',
  weight: '100 900',
});
const devanagari = localFont({
  src: '../fonts/noto-sans-devanagari.woff2',
  variable: '--font-hindi',
  display: 'swap',
  weight: '100 900',
});
const notoSerif = localFont({
  src: '../fonts/noto-serif-latin.woff2',
  variable: '--font-serif',
  display: 'swap',
  weight: '100 900',
});
const notoSerifDevanagari = localFont({
  src: '../fonts/noto-serif-devanagari.woff2',
  variable: '--font-serif-hindi',
  display: 'swap',
  weight: '100 900',
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: 'SIDHKOFED - Jharkhand State Cooperative Federation',
    template: '%s · SIDHKOFED',
  },
  description:
    "Official Website of SIDHKOFED, Jharkhand's state cooperative federation for agriculture and minor forest produce, programmes, tenders and public information.",
  applicationName: 'SIDHKOFED',
  openGraph: {
    type: 'website',
    siteName: 'SIDHKOFED',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
  other: { google: 'on' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Matches --heading/--hero navy (#083D5E) - the colour that frames every page.
  themeColor: '#083D5E',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetched once here (Next dedupes identical fetches within a request) and passed down -
  // the footer is a Client Component and can't call server-only data fetchers itself.
  const [contactSettings, socialSettings] = await Promise.all([getContactSettings(), getSocialSettings()]);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${notoSans.variable} ${devanagari.variable} ${notoSerif.variable} ${notoSerifDevanagari.variable}`}
    >
      <head>
        {/* Prevent dark-mode flash before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('sidhkofed.theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <AppProviders>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter contactSettings={contactSettings} socialSettings={socialSettings} />
        </AppProviders>
      </body>
    </html>
  );
}
