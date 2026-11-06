import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Arabic, Syne } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { FloatingHireButton } from '@/components/layout/FloatingHireButton';
import { AmbientBackdrop } from '@/components/layout/AmbientBackdrop';
import { ScrollDrivenPath } from '@/components/motion/ScrollDrivenPath';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { siteConfig } from '@/config/site';
import { getContent } from '@/content';
import { localeMeta, locales } from '@/i18n/config';
import { routing } from '@/i18n/routing';
import { localizedAlternates, openGraphLocales } from '@/lib/seo';
import { siteJsonLd } from '@/lib/schema';
import '@/styles/globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['600', '700', '800'],
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

// Syne and IBM Plex have no Arabic glyphs. On Arabic pages every font variable
// resolves to this family (see globals.css). It is only referenced there, and
// `preload: false` keeps German/English/French visitors from downloading it.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  variable: '--font-plex-arabic',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: false,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t('siteTitle'),
      template: `%s · ${siteConfig.name}`,
    },
    description: t('siteDescription'),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.name,
    keywords: t.raw('keywords') as string[],
    alternates: localizedAlternates(locale),
    openGraph: {
      type: 'website',
      ...openGraphLocales(locale),
      url: `${siteConfig.url}/${locale}`,
      title: t('siteTitle'),
      description: t('siteDescription'),
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('siteTitle'),
      description: t('siteDescription'),
    },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
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
}

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

/** Namespaces that client components read. Server-only copy (page prose, FAQ, …) stays on the server. */
const CLIENT_NAMESPACES = [
  'nav',
  'actions',
  'theme',
  'language',
  'labels',
  'categories',
  'projectsFilter',
  'contactForm',
  'errorPage',
  'rail',
] as const;

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Opt the whole tree into static rendering for this locale.
  setRequestLocale(locale);

  const [messages, t, tMeta, content] = await Promise.all([
    getMessages(),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'meta' }),
    getContent(locale),
  ]);
  const { profile, experience } = content;

  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]),
  );

  const { dir } = localeMeta[locale];

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${syne.variable} ${plexSans.variable} ${plexMono.variable} ${plexArabic.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-md)] focus:bg-[var(--color-brand)] focus:px-4 focus:py-2 focus:text-[var(--color-on-accent)]"
          >
            {t('skipToContent')}
          </a>
          <ScrollProgress />
          <Header
            name={profile.name}
            cv={{ href: profile.cv.href, filename: profile.cv.filename }}
            socials={profile.socials.map(({ id, label, href, external }) => ({
              id,
              label,
              href,
              external,
            }))}
          />
          <ScrollDrivenPath />
          <main id="main-content" className="relative z-[2] flex-1 overflow-x-clip">
            <AmbientBackdrop variant="page" />
            <div className="relative z-10">{children}</div>
          </main>
          <Footer locale={locale} />
          <FloatingHireButton />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              siteJsonLd({
                locale,
                profile,
                experience,
                title: tMeta('siteTitle'),
                description: tMeta('siteDescription'),
              }),
            ),
          }}
        />
      </body>
    </html>
  );
}
