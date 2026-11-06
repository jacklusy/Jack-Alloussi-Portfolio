import type { Locale } from '@/i18n/config';
import {
  certificationSchema,
  certificationsTextSchema,
  educationSchema,
  educationTextSchema,
  experienceTextSchema,
  profileSchema,
  profileTextSchema,
  projectSchema,
  projectTextSchema,
  roleSchema,
  skillGroupSchema,
  skillsTextSchema,
  type Certification,
  type Education,
  type Profile,
  type Project,
  type ProjectStructure,
  type Role,
  type SkillGroup,
} from '@/content/schemas';
import { profileStructure } from '@/content/profile';
import { experienceStructure } from '@/content/experience';
import { educationStructure } from '@/content/education';
import { certificationsStructure } from '@/content/certifications';
import { skillGroupsStructure } from '@/content/skills';
import { projectStructures } from '@/content/projects';

/**
 * Localised content.
 *
 * Structure (facts, URLs, images) is TypeScript in `src/content/**`; text is
 * JSON per language in `src/i18n/content/<locale>/**`. This module merges the
 * two and re-validates the result, so a missing or malformed translation fails
 * the build rather than rendering a hole in the page.
 *
 * Server-side only: never import it from a client component, or every
 * language's case-study prose would ship to the browser.
 */

export type LocalizedContent = {
  profile: Profile;
  experience: Role[];
  education: Education[];
  certifications: Certification[];
  skillGroups: SkillGroup[];
  projects: Project[];
};

async function readJson<T>(locale: Locale, file: string): Promise<T> {
  const mod = (await import(`../i18n/content/${locale}/${file}.json`)) as { default: T };
  return mod.default;
}

async function readProjectJson<T>(locale: Locale, slug: string): Promise<T> {
  const mod = (await import(`../i18n/content/${locale}/projects/${slug}.json`)) as { default: T };
  return mod.default;
}

function entry<T>(record: Record<string, T>, id: string, where: string): T {
  const value = record[id];
  if (!value) throw new Error(`Missing translation: ${where} → "${id}"`);
  return value;
}

function nth<T>(list: T[] | undefined, index: number, where: string): T {
  const value = list?.[index];
  if (value === undefined) throw new Error(`Missing translation: ${where}[${index}]`);
  return value;
}

function mergeProfile(locale: Locale, raw: unknown): Profile {
  const text = profileTextSchema.parse(raw);
  const s = profileStructure;
  return profileSchema.parse({
    name: s.name,
    role: text.role,
    tagline: text.tagline,
    location: text.location,
    timezone: s.timezone,
    email: s.email,
    phone: s.phone,
    bio: text.bio,
    portrait: { ...s.portrait, alt: text.portraitAlt },
    availability: text.availability,
    socials: s.socials.map((social) => ({
      ...social,
      label: entry(
        Object.fromEntries(text.socials.map((t) => [t.id, t.label])),
        social.id,
        `${locale}/profile socials`,
      ),
    })),
    ctas: s.ctas.map((cta) => ({
      ...cta,
      label: entry(
        Object.fromEntries(text.ctas.map((t) => [t.id, t.label])),
        cta.id,
        `${locale}/profile ctas`,
      ),
    })),
    cv: { ...s.cv, label: text.cvLabel },
    spokenLanguages: s.spokenLanguageCodes.map((code, i) => ({
      code,
      ...nth(text.spokenLanguages, i, `${locale}/profile spokenLanguages`),
    })),
    highlights: text.highlights,
  });
}

function mergeProject(locale: Locale, structure: ProjectStructure, raw: unknown): Project {
  const text = projectTextSchema.parse(raw);
  const where = `${locale}/projects/${structure.slug}`;
  const cs = text.caseStudy;

  return projectSchema.parse({
    slug: structure.slug,
    title: text.title,
    summary: text.summary,
    description: text.description,
    role: text.role,
    timeframe: text.timeframe,
    year: structure.year,
    status: structure.status,
    technologies: structure.technologies,
    categories: structure.categories,
    cover: structure.cover,
    ...(structure.group
      ? { group: { id: structure.group.id, label: nth([text.group?.label], 0, `${where} group`) } }
      : {}),
    ...(text.metrics ? { metrics: text.metrics } : {}),
    ...(structure.thumbnail
      ? {
          thumbnail: {
            image: structure.thumbnail.image,
            alt: nth([text.thumbnail?.alt], 0, `${where} thumbnail`),
          },
        }
      : {}),
    ...(structure.gallery
      ? {
          gallery: structure.gallery.map((g, i) => {
            const t = nth(text.gallery, i, `${where} gallery`);
            return { image: g.image, alt: t.alt, ...(t.caption ? { caption: t.caption } : {}) };
          }),
        }
      : {}),
    links: {
      ...(structure.links.live ? { live: structure.links.live } : {}),
      ...(structure.links.repo ? { repo: structure.links.repo } : {}),
      ...(structure.links.caseStudy ? { caseStudy: structure.links.caseStudy } : {}),
      ...(text.links?.liveNote ? { liveNote: text.links.liveNote } : {}),
      ...(structure.links.demoAccounts
        ? {
            demoAccounts: structure.links.demoAccounts.map((d, i) => ({
              role: nth(text.links?.demoAccounts, i, `${where} demoAccounts`).role,
              identifier: d.identifier,
              password: d.password,
            })),
          }
        : {}),
    },
    featured: structure.featured,
    kind: structure.kind,
    confidential: structure.confidential,
    ...(structure.sortWeight !== undefined ? { sortWeight: structure.sortWeight } : {}),
    hasCaseStudy: true,
    caseStudy: {
      context: cs.context,
      problem: cs.problem,
      approach: cs.approach,
      architecture: { diagramId: structure.diagramId, altText: cs.architecture.altText },
      decisions: cs.decisions,
      challenges: cs.challenges,
      outcomes: cs.outcomes,
      retrospective: cs.retrospective,
      ...(cs.stackDetail ? { stackDetail: cs.stackDetail } : {}),
    },
  });
}

async function load(locale: Locale): Promise<LocalizedContent> {
  const [profileRaw, experienceRaw, educationRaw, certificationsRaw, skillsRaw] = await Promise.all(
    [
      readJson<unknown>(locale, 'profile'),
      readJson<unknown>(locale, 'experience'),
      readJson<unknown>(locale, 'education'),
      readJson<unknown>(locale, 'certifications'),
      readJson<unknown>(locale, 'skills'),
    ],
  );

  const experienceText = experienceTextSchema.parse(experienceRaw);
  const educationText = educationTextSchema.parse(educationRaw);
  const certificationsText = certificationsTextSchema.parse(certificationsRaw);
  const skillsText = skillsTextSchema.parse(skillsRaw);

  const projects = await Promise.all(
    projectStructures.map(async (structure) =>
      mergeProject(locale, structure, await readProjectJson<unknown>(locale, structure.slug)),
    ),
  );

  return {
    profile: mergeProfile(locale, profileRaw),
    experience: experienceStructure.map((role) =>
      roleSchema.parse({
        ...role,
        ...entry(experienceText.roles, role.id, `${locale}/experience`),
      }),
    ),
    education: educationStructure.map((item) =>
      educationSchema.parse({
        ...item,
        ...entry(educationText.entries, item.id, `${locale}/education`),
      }),
    ),
    certifications: certificationsStructure.map((item) =>
      certificationSchema.parse({
        ...item,
        name: entry(certificationsText.entries, item.id, `${locale}/certifications`).name,
      }),
    ),
    skillGroups: skillGroupsStructure.map((group) =>
      skillGroupSchema.parse({
        id: group.id,
        label: entry(skillsText.groups, group.id, `${locale}/skills groups`).label,
        skills: group.skills.map((skill) => ({
          ...skill,
          // `name` stays the stable key (used in `?tech=` links); `label` is what
          // is shown. Products and languages keep their own name in every language.
          label: skillsText.skills[skill.name] ?? skill.name,
        })),
      }),
    ),
    projects,
  };
}

const cache = new Map<Locale, Promise<LocalizedContent>>();

/** Everything a page needs for one language. Memoised per locale per process. */
export function getContent(locale: Locale): Promise<LocalizedContent> {
  let hit = cache.get(locale);
  if (!hit) {
    hit = load(locale);
    cache.set(locale, hit);
  }
  return hit;
}

export async function getProfile(locale: Locale) {
  return (await getContent(locale)).profile;
}

export async function getProjects(locale: Locale) {
  return (await getContent(locale)).projects;
}

export async function getProject(locale: Locale, slug: string) {
  return (await getProjects(locale)).find((project) => project.slug === slug);
}

export async function getFeaturedProjects(locale: Locale) {
  return (await getProjects(locale)).filter((project) => project.featured);
}

export { getAllProjectSlugs, getProjectCategories, getTopTechnologies } from '@/content/projects';
