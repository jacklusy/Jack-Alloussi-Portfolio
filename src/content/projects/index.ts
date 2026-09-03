import { projectSchema, type Project } from '@/content/schemas';

import { usClientPlatform } from '@/content/projects/us-client-platform';
import { stockwell } from '@/content/projects/stockwell';
import { pdfNexus } from '@/content/projects/pdf-nexus';
import { stockwellMobile } from '@/content/projects/stockwell-mobile';
import { usnsBackend } from '@/content/projects/usns-backend';
import { usnsDashboard } from '@/content/projects/usns-dashboard';
import { usnsStudentApp } from '@/content/projects/usns-student-app';
import { cloudix } from '@/content/projects/cloudix';
import { ammansTreasure } from '@/content/projects/ammans-treasure';
import { masterLaravel } from '@/content/projects/master-laravel';
import { biddingManagementSystem } from '@/content/projects/bidding-management-system';
import { angularSky } from '@/content/projects/angular-sky';

/**
 * One module per project. Ordered by `sortWeight` (descending), then `year`,
 * so the strongest and most recent work leads the catalog.
 */
const projectsData = [
  usClientPlatform,
  stockwell,
  pdfNexus,
  stockwellMobile,
  usnsBackend,
  usnsDashboard,
  usnsStudentApp,
  cloudix,
  ammansTreasure,
  masterLaravel,
  biddingManagementSystem,
  angularSky,
] satisfies Project[];

export const projects: Project[] = projectsData
  .map((project) => projectSchema.parse(project))
  .sort((a, b) => (b.sortWeight ?? 0) - (a.sortWeight ?? 0) || b.year - a.year);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}

export function getProjectsByTechnology(tech: string): Project[] {
  const normalised = tech.toLowerCase();
  return projects.filter((project) =>
    project.technologies.some((item) => item.toLowerCase() === normalised),
  );
}

/** All categories present in the catalog, most-used first. */
export function getProjectCategories(): string[] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const category of project.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([category]) => category);
}

/** Technologies ranked by how many projects use them. */
export function getTopTechnologies(limit = 8): string[] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const tech of project.technologies) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tech]) => tech);
}

export function getProjectsByCategory(category: string): Project[] {
  const normalised = category.toLowerCase();
  return projects.filter((project) =>
    project.categories.some((item) => item.toLowerCase() === normalised),
  );
}
