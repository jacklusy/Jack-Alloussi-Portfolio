import { describe, expect, it } from 'vitest';
import { formatMonthYear, cn } from '@/lib/utils';
import { hasNeedsInput, isUsableHref } from '@/lib/content-text';
import { profileSchema } from '@/content/schemas';
import { profile } from '@/content/profile';
import { experience } from '@/content/experience';
import { education } from '@/content/education';
import { certifications } from '@/content/certifications';
import { skillGroups } from '@/content/skills';
import {
  projects,
  getAllProjectSlugs,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectCategories,
  getTopTechnologies,
} from '@/content/projects';

describe('formatMonthYear', () => {
  it('formats YYYY-MM', () => {
    expect(formatMonthYear('2024-09')).toMatch(/2024/);
  });

  it('handles present', () => {
    expect(formatMonthYear('present')).toBe('Present');
  });
});

describe('cn', () => {
  it('merges conflicting tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});

describe('content helpers', () => {
  it('detects needs-input tokens', () => {
    expect(hasNeedsInput('{{NEEDS_INPUT: foo}}')).toBe(true);
    expect(hasNeedsInput('plain')).toBe(false);
  });

  it('rejects placeholder hrefs', () => {
    expect(isUsableHref('https://github.com/{{NEEDS_INPUT: github-username}}')).toBe(false);
    expect(isUsableHref('https://linkedin.com/in/jackalloussi')).toBe(true);
    expect(isUsableHref('https://github.com/jacklusy')).toBe(true);
  });
});

describe('content validation', () => {
  it('parses profile', () => {
    expect(profileSchema.parse(profile).name).toBe('Jack Alloussi');
    expect(profile.socials.find((s) => s.id === 'github')?.href).toBe('https://github.com/jacklusy');
    expect(profile.cv.href).toBe('/pdf/CV_Jack_Alloussi.pdf');
  });

  it('keeps experience dates matching CV', () => {
    expect(experience[0]?.startDate).toBe('2024-09');
    expect(experience[1]?.startDate).toBe('2023-05');
    expect(experience[2]?.startDate).toBe('2023-03');
  });

  it('ships no NEEDS_INPUT tokens in public content', () => {
    const payloads = [profile, experience, education, certifications, projects, skillGroups];
    for (const payload of payloads) {
      expect(JSON.stringify(payload)).not.toMatch(/\{\{NEEDS_INPUT/);
    }
  });
});

const EXPECTED_SLUGS = [
  'us-client-platform',
  'stockwell',
  'stockwell-mobile',
  'pdf-nexus',
  'usns-backend',
  'usns-dashboard',
  'usns-student-app',
  'cloudix',
  'ammans-treasure',
  'master-laravel',
  'bidding-management-system',
  'angular-sky',
];

describe('project catalog', () => {
  it('exposes every project slug for static generation', () => {
    const slugs = getAllProjectSlugs();
    expect(slugs).toHaveLength(EXPECTED_SLUGS.length);
    for (const slug of EXPECTED_SLUGS) {
      expect(slugs).toContain(slug);
    }
  });

  it('has no duplicate slugs', () => {
    const slugs = getAllProjectSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('resolves every slug back to a project', () => {
    for (const slug of getAllProjectSlugs()) {
      expect(getProjectBySlug(slug)?.slug).toBe(slug);
    }
  });

  it('sorts by weight then year, strongest first', () => {
    const weights = projects.map((p) => p.sortWeight ?? 0);
    expect(weights).toEqual([...weights].sort((a, b) => b - a));
  });

  it('gives every project cover art data and a year', () => {
    for (const project of projects) {
      expect(project.cover.hue).toBeGreaterThanOrEqual(0);
      expect(project.cover.hue).toBeLessThanOrEqual(360);
      expect(project.cover.pattern).toBeTruthy();
      expect(project.year).toBeGreaterThan(2000);
    }
  });

  it('gives every case study substantive decisions and outcomes', () => {
    for (const project of projects) {
      if (!project.hasCaseStudy) continue;
      expect(project.caseStudy.decisions.length, project.slug).toBeGreaterThanOrEqual(2);
      expect(project.caseStudy.outcomes.length, project.slug).toBeGreaterThanOrEqual(3);
      expect(project.caseStudy.challenges.length, project.slug).toBeGreaterThanOrEqual(1);
      expect(project.caseStudy.retrospective.length, project.slug).toBeGreaterThan(120);
    }
  });

  it('keeps summaries short enough to scan', () => {
    for (const project of projects) {
      expect(project.summary.length, project.slug).toBeLessThanOrEqual(260);
    }
  });

  it('publishes only usable external links', () => {
    for (const project of projects) {
      for (const href of [project.links.live, project.links.repo]) {
        if (!href) continue;
        expect(isUsableHref(href), `${project.slug}: ${href}`).toBe(true);
        expect(href.startsWith('https://'), `${project.slug}: ${href}`).toBe(true);
      }
    }
  });

  it('never links confidential client work externally', () => {
    for (const project of projects.filter((p) => p.confidential)) {
      expect(project.links.live, project.slug).toBeUndefined();
      expect(project.links.repo, project.slug).toBeUndefined();
    }
  });

  it('features at least three projects for the homepage grid', () => {
    expect(getFeaturedProjects().length).toBeGreaterThanOrEqual(3);
  });

  it('derives categories and top technologies from the catalog', () => {
    expect(getProjectCategories()).toContain('Backend');
    expect(getProjectCategories()).toContain('Mobile');
    expect(getTopTechnologies(5)).toContain('TypeScript');
  });
});

describe('skill to project links', () => {
  it('only points at slugs that exist', () => {
    const slugs = new Set(getAllProjectSlugs());
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        for (const slug of skill.projectSlugs ?? []) {
          expect(slugs.has(slug), `${skill.name} → ${slug}`).toBe(true);
        }
      }
    }
  });
});
