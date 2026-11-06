import type { MetadataRoute } from 'next';
import { getAllProjectSlugs, projectStructures } from '@/content/projects';
import { siteConfig } from '@/config/site';
import { defaultLocale, locales } from '@/i18n/config';
import { localizedPath } from '@/lib/seo';

/**
 * Real per-URL dates. Stamping `new Date()` on every build tells search
 * engines every page changed on every deploy, which they learn to ignore.
 */
const siteModified = new Date(siteConfig.lastModified);

const staticRoutes = [
  { path: '', priority: 1, changeFrequency: 'monthly' as const },
  { path: '/projects', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/about', priority: 0.9, changeFrequency: 'yearly' as const },
  { path: '/experience', priority: 0.8, changeFrequency: 'yearly' as const },
  { path: '/contact', priority: 0.7, changeFrequency: 'yearly' as const },
];

/** One sitemap entry per language version, each listing all its translations. */
function entry(
  path: string,
  lastModified: Date,
  changeFrequency: 'monthly' | 'yearly',
  priority: number,
): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}${localizedPath(l, path)}`])),
    'x-default': `${siteConfig.url}${localizedPath(defaultLocale, path)}`,
  };

  return locales.map((locale) => ({
    url: `${siteConfig.url}${localizedPath(locale, path)}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const featured = new Map(projectStructures.map((p) => [p.slug, p]));

  return [
    ...staticRoutes.flatMap((route) =>
      entry(route.path, siteModified, route.changeFrequency, route.priority),
    ),
    ...getAllProjectSlugs().flatMap((slug) => {
      const project = featured.get(slug)!;
      return entry(
        `/projects/${slug}`,
        // A case study's content is anchored to the year the work shipped.
        new Date(Math.min(Date.UTC(project.year, 11, 31), siteModified.getTime())),
        'yearly',
        project.featured ? 0.8 : 0.6,
      );
    }),
  ];
}
