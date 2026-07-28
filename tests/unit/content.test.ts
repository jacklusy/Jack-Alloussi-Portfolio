import { describe, expect, it } from 'vitest';
import { formatMonthYear, cn } from '@/lib/utils';
import { hasNeedsInput, isUsableHref } from '@/lib/content-text';
import { profileSchema } from '@/content/schemas';
import { profile } from '@/content/profile';
import { experience } from '@/content/experience';
import { projects } from '@/content/projects';

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

  it('exposes project slugs for static generation', () => {
    expect(projects.map((p) => p.slug)).toContain('us-client-platform');
  });
});
