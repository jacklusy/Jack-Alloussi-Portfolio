import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, Syne } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { FloatingHireButton } from '@/components/layout/FloatingHireButton';
import { MagneticCursor } from '@/components/motion/MagneticCursor';
import { AmbientBackdrop } from '@/components/layout/AmbientBackdrop';
import { ScrollDrivenPath } from '@/components/motion/ScrollDrivenPath';
import { siteConfig } from '@/config/site';
import { profile } from '@/content/profile';
import '@/styles/globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['600', '700'],
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex-sans',
  display: 'swap',
  weight: ['400', '500'],
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${profile.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  keywords: [...siteConfig.keywords],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: profile.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.role}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    // Dark-first: default to dark when no stored preference
    var theme = stored || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    email: profile.email,
    telephone: profile.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Amman',
      addressCountry: 'JO',
    },
    url: siteConfig.url,
    image: `${siteConfig.url}${profile.portrait.src}`,
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Al-Zaytoonah University of Jordan',
    },
    knowsAbout: [
      'TypeScript',
      'Node.js',
      'NestJS',
      'React',
      'React Native',
      'Clean Architecture',
      'Domain-Driven Design',
    ],
    sameAs: profile.socials
      .filter((s) => s.external && !s.href.includes('NEEDS_INPUT'))
      .map((s) => s.href),
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${plexSans.variable} ${plexMono.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-md)] focus:bg-[var(--color-brand)] focus:px-4 focus:py-2 focus:text-[var(--color-on-accent)]"
        >
          Skip to content
        </a>
        <Header />
        <ScrollDrivenPath />
        <main id="main-content" className="relative z-[2] flex-1 overflow-x-clip">
          <AmbientBackdrop variant="page" />
          <div className="relative z-10">{children}</div>
        </main>
        <Footer />
        <FloatingHireButton />
        <MagneticCursor />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
