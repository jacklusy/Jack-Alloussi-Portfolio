import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { isLocale, LOCALE_COOKIE } from '@/i18n/config';
import { routing } from '@/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

/**
 * Locale routing for every page request.
 *
 * - `/` goes to `/de` for a first-time visitor (German is the default and the
 *   browser's Accept-Language is deliberately ignored — see `routing.ts`).
 * - A returning visitor who picked a language with the switcher has a
 *   `NEXT_LOCALE` cookie, so `/` goes to their language instead.
 * - Any other path without a locale prefix (`/projects`) is redirected to the
 *   prefixed one by next-intl.
 */
export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    const saved = request.cookies.get(LOCALE_COOKIE)?.value;
    if (isLocale(saved)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${saved}`;
      return NextResponse.redirect(url);
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  // Skip API routes, Next internals and anything with a file extension
  // (images, pdf, sitemap.xml, robots.txt, manifest.webmanifest, favicons).
  // The extension-less icon routes are listed explicitly.
  matcher: ['/((?!api|_next|_vercel|icon|apple-icon|.*\\..*).*)'],
};
