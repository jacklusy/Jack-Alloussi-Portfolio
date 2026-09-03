import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
import { siteConfig } from '@/config/site';

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

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route.path || '/'}`,
      lastModified: siteModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...projects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      // A case study's content is anchored to the year the work shipped.
      lastModified: new Date(Math.min(Date.UTC(project.year, 11, 31), siteModified.getTime())),
      changeFrequency: 'yearly' as const,
      priority: project.featured ? 0.8 : 0.6,
    })),
  ];
}
