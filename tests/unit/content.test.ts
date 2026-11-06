import { beforeAll, describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';
import { hasNeedsInput, isUsableHref } from '@/lib/content-text';
import { profileSchema } from '@/content/schemas';
import {
  getAllProjectSlugs,
  getContent,
  getProjectCategories,
  getTopTechnologies,
  type LocalizedContent,
} from '@/content';
import { locales } from '@/i18n/config';

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

describe('project slugs', () => {
  it('exposes every project slug for static generation', () => {
    const slugs = getAllProjectSlugs();
    expect(slugs).toHaveLength(EXPECTED_SLUGS.length);
    for (const slug of EXPECTED_SLUGS) expect(slugs).toContain(slug);
  });

  it('has no duplicate slugs', () => {
    const slugs = getAllProjectSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('derives categories and top technologies from the catalog', () => {
    expect(getProjectCategories()).toContain('Backend');
    expect(getProjectCategories()).toContain('Mobile');
    expect(getTopTechnologies(5)).toContain('TypeScript');
  });
});

// The same invariants must hold in every language, so each locale is validated.
describe.each(locales)('content (%s)', (locale) => {
  let content: LocalizedContent;

  beforeAll(async () => {
    content = await getContent(locale);
  });

  it('parses the profile', () => {
    expect(profileSchema.parse(content.profile).name).toBe('Jack Alloussi');
    expect(content.profile.socials.find((s) => s.id === 'github')?.href).toBe(
      'https://github.com/jacklusy',
    );
    // German gets its own native CV; every other language falls back to the English one.
    expect(content.profile.cv.href).toBe(
      locale === 'de'
        ? '/pdf/Jack_Alloussi_Lebenslauf_Software_Engineer.pdf'
        : '/pdf/CV_Jack_Alloussi.pdf',
    );
    expect(content.profile.spokenLanguages.map((l) => l.code)).toEqual(['ar', 'en', 'de']);
  });

  it('keeps experience dates matching the CV', () => {
    expect(content.experience[0]?.startDate).toBe('2024-09');
    expect(content.experience[1]?.startDate).toBe('2023-05');
    expect(content.experience[2]?.startDate).toBe('2023-03');
  });

  it('ships no NEEDS_INPUT tokens in public content', () => {
    expect(JSON.stringify(content)).not.toMatch(/\{\{NEEDS_INPUT/);
  });

  it('lists every project, strongest first', () => {
    expect(content.projects.map((p) => p.slug).sort()).toEqual([...EXPECTED_SLUGS].sort());
    const weights = content.projects.map((p) => p.sortWeight ?? 0);
    expect(weights).toEqual([...weights].sort((a, b) => b - a));
  });

  it('gives every case study substantive decisions and outcomes', () => {
    for (const project of content.projects) {
      if (!project.hasCaseStudy) continue;
      expect(project.caseStudy.decisions.length, project.slug).toBeGreaterThanOrEqual(2);
      expect(project.caseStudy.outcomes.length, project.slug).toBeGreaterThanOrEqual(3);
      expect(project.caseStudy.challenges.length, project.slug).toBeGreaterThanOrEqual(1);
      expect(project.caseStudy.retrospective.length, project.slug).toBeGreaterThan(120);
    }
  });

  it('keeps summaries short enough to scan', () => {
    for (const project of content.projects) {
      expect(project.summary.length, project.slug).toBeLessThanOrEqual(260);
    }
  });

  it('publishes only usable external links', () => {
    for (const project of content.projects) {
      for (const href of [project.links.live, project.links.repo]) {
        if (!href) continue;
        expect(isUsableHref(href), `${project.slug}: ${href}`).toBe(true);
        expect(href.startsWith('https://'), `${project.slug}: ${href}`).toBe(true);
      }
    }
  });

  it('never links confidential client work externally', () => {
    for (const project of content.projects.filter((p) => p.confidential)) {
      expect(project.links.live, project.slug).toBeUndefined();
      expect(project.links.repo, project.slug).toBeUndefined();
    }
  });

  it('features at least three projects for the homepage', () => {
    expect(content.projects.filter((p) => p.featured).length).toBeGreaterThanOrEqual(3);
  });

  it('only links skills to projects that exist', () => {
    const slugs = new Set(getAllProjectSlugs());
    for (const group of content.skillGroups) {
      for (const skill of group.skills) {
        for (const slug of skill.projectSlugs ?? []) {
          expect(slugs.has(slug), `${skill.name} → ${slug}`).toBe(true);
        }
      }
    }
  });
});
