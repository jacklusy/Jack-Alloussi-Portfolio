import type { StaticImageData } from 'next/image';
import { z } from 'zod';

export const socialLinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  /** May contain {{NEEDS_INPUT}} tokens until real URLs are supplied. */
  href: z.string().min(1),
  external: z.boolean().default(true),
});

export const availabilitySchema = z.object({
  status: z.string(),
  visaNote: z.string(),
  graduationDate: z.string(),
  relocationNote: z.string(),
});

export const ctaSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
  variant: z.enum(['primary', 'secondary', 'ghost']),
  external: z.boolean().optional(),
  download: z.boolean().optional(),
});

export const profileSchema = z.object({
  name: z.string(),
  role: z.string(),
  tagline: z.string(),
  location: z.string(),
  timezone: z.string(),
  email: z.string().email(),
  phone: z.string(),
  bio: z.array(z.string()).min(1),
  portrait: z.object({
    src: z.string(),
    alt: z.string(),
    width: z.number(),
    height: z.number(),
  }),
  availability: availabilitySchema,
  socials: z.array(socialLinkSchema),
  ctas: z.array(ctaSchema),
  cv: z.object({
    href: z.string(),
    label: z.string(),
    filename: z.string(),
  }),
  spokenLanguages: z.array(
    z.object({
      /** ISO 639-1 code (JSON-LD `knowsLanguage`); language-neutral. */
      code: z.string(),
      language: z.string(),
      level: z.string(),
    }),
  ),
  highlights: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
});

export type Profile = z.infer<typeof profileSchema>;

export const skillSchema = z.object({
  /** Stable key; also the `?tech=` filter value. */
  name: z.string(),
  /** Display text in the current language (falls back to `name`). */
  label: z.string().optional(),
  projectSlugs: z.array(z.string()).optional(),
});

export const skillGroupSchema = z.object({
  id: z.string(),
  label: z.string(),
  skills: z.array(skillSchema),
});

export type SkillGroup = z.infer<typeof skillGroupSchema>;

export const roleSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  companyUrl: z.string().url().optional(),
  employmentType: z.string(),
  location: z.string(),
  locationType: z.enum(['onsite', 'hybrid', 'remote']),
  startDate: z.string(),
  endDate: z.union([z.string(), z.literal('present')]),
  summary: z.string(),
  achievements: z.array(z.string()),
  technologies: z.array(z.string()),
  confidentialityNote: z.string().optional(),
});

export type Role = z.infer<typeof roleSchema>;

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(['completed', 'expected', 'paused']),
  note: z.string().optional(),
});

export type Education = z.infer<typeof educationSchema>;

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional(),
  skills: z.array(z.string()),
  status: z.enum(['earned', 'in-progress']),
});

export type Certification = z.infer<typeof certificationSchema>;

export const decisionSchema = z.object({
  decision: z.string(),
  alternatives: z.string(),
  reasoning: z.string(),
  tradeoff: z.string(),
});

/** Rich per-category stack breakdown, preserved from the project docs so the
 *  detail page can show more than a flat tag list. */
export const stackGroupSchema = z.object({
  category: z.string(),
  items: z.array(z.string()),
});

export const caseStudySchema = z.object({
  context: z.string(),
  problem: z.string(),
  approach: z.string(),
  architecture: z.object({
    diagramId: z.string(),
    altText: z.string(),
  }),
  decisions: z.array(decisionSchema),
  challenges: z.array(z.string()),
  outcomes: z.array(z.string()),
  retrospective: z.string(),
  stackDetail: z.array(stackGroupSchema).optional(),
});

/** Drives the generated SVG cover. `hue` keeps the 13 covers distinguishable
 *  without inventing a colour token per project. */
export const projectCoverSchema = z.object({
  hue: z.number().min(0).max(360),
  pattern: z.enum(['grid', 'arcs', 'planes', 'glyphs', 'nodes', 'waves']),
});

/** Projects that are one system across several repos share a group, so the
 *  grid reads as a handful of systems rather than many look-alike cards. */
export const projectGroupSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const projectMetricSchema = z.object({
  label: z.string(),
  value: z.string(),
});

/** A statically imported image. Screenshots live under `src/assets/img/projects`,
 *  so the dimensions and blur placeholder come from the import rather than being
 *  restated by hand next to a path that can drift away from them.
 *
 *  `z.custom` rather than `z.object` on purpose: it passes the import through
 *  untouched — an object schema would strip the blur fields it did not declare —
 *  and it types as Next's own `StaticImageData` instead of a lookalike. */
export const staticImageSchema = z.custom<StaticImageData>(
  (value) =>
    typeof value === 'object' &&
    value !== null &&
    typeof (value as StaticImageData).src === 'string' &&
    typeof (value as StaticImageData).width === 'number' &&
    typeof (value as StaticImageData).height === 'number',
  { message: 'Expected a statically imported image' },
);

export const projectImageSchema = z.object({
  image: staticImageSchema,
  alt: z.string(),
  /** Says what the screen is doing, not just what it is. */
  caption: z.string().optional(),
});

export type ProjectImage = z.infer<typeof projectImageSchema>;

export const projectBaseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  role: z.string(),
  timeframe: z.string(),
  status: z.enum(['shipped', 'in-progress', 'archived']),
  technologies: z.array(z.string()),
  categories: z.array(z.string()),
  /** Optional real screenshot leading the card and the detail hero; the
   *  generated cover is used when absent. */
  thumbnail: projectImageSchema.optional(),
  /** Supporting screenshots, shown as a captioned grid on the detail page. */
  gallery: z.array(projectImageSchema).optional(),
  links: z.object({
    live: z.string().optional(),
    repo: z.string().optional(),
    caseStudy: z.string().optional(),
    /** Short caveat rendered beside the live-site button — for a demo that
     *  needs a login the page can't hand out, or any other "before you click"
     *  context a bare link can't carry. */
    liveNote: z.string().optional(),
    /** Working credentials for a live, auth-gated demo. Only ever a project's
     *  own seeded staging data — never a real user's account. */
    demoAccounts: z
      .array(
        z.object({
          role: z.string(),
          identifier: z.string(),
          password: z.string(),
        }),
      )
      .optional(),
  }),
  featured: z.boolean(),
  kind: z.enum(['personal', 'professional', 'client', 'training']),
  confidential: z.boolean(),
  year: z.number().int(),
  cover: projectCoverSchema,
  group: projectGroupSchema.optional(),
  metrics: z.array(projectMetricSchema).optional(),
  /** Higher sorts earlier; ties fall back to `year`. */
  sortWeight: z.number().optional(),
});

export const projectSchema = z.discriminatedUnion('hasCaseStudy', [
  projectBaseSchema.extend({
    hasCaseStudy: z.literal(true),
    caseStudy: caseStudySchema,
  }),
  projectBaseSchema.extend({
    hasCaseStudy: z.literal(false),
  }),
]);

export type Project = z.infer<typeof projectSchema>;

/* -------------------------------------------------------------------------- *
 * Structure / text split
 *
 * A project (and every other content entity) is stored in two halves:
 *
 *  - STRUCTURE — language-neutral facts that live in `src/content/**.ts`:
 *    slug, year, technologies, URLs, imported images, cover art, flags.
 *  - TEXT — everything a visitor reads, one JSON file per language in
 *    `src/i18n/content/<locale>/…`.
 *
 * `src/content/index.ts` merges the two for a locale and re-parses the result
 * with the schemas above, so a missing or mistyped translation fails the build
 * instead of rendering a hole in the page.
 * -------------------------------------------------------------------------- */

export const projectStructureSchema = z.object({
  slug: z.string(),
  status: z.enum(['shipped', 'in-progress', 'archived']),
  technologies: z.array(z.string()),
  /** Stable English keys: used in `?category=` URLs and translated for display
   *  through the `categories` messages. */
  categories: z.array(z.string()),
  thumbnail: z.object({ image: staticImageSchema }).optional(),
  gallery: z.array(z.object({ image: staticImageSchema })).optional(),
  links: z.object({
    live: z.string().optional(),
    repo: z.string().optional(),
    caseStudy: z.string().optional(),
    demoAccounts: z.array(z.object({ identifier: z.string(), password: z.string() })).optional(),
  }),
  featured: z.boolean(),
  kind: z.enum(['personal', 'professional', 'client', 'training']),
  confidential: z.boolean(),
  year: z.number().int(),
  cover: projectCoverSchema,
  group: z.object({ id: z.string() }).optional(),
  sortWeight: z.number().optional(),
  diagramId: z.string(),
});

export type ProjectStructure = z.infer<typeof projectStructureSchema>;

export const projectTextSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  role: z.string().min(1),
  timeframe: z.string().min(1),
  metrics: z.array(projectMetricSchema).optional(),
  thumbnail: z.object({ alt: z.string().min(1) }).optional(),
  gallery: z.array(z.object({ alt: z.string().min(1), caption: z.string().optional() })).optional(),
  group: z.object({ label: z.string().min(1) }).optional(),
  links: z
    .object({
      liveNote: z.string().optional(),
      demoAccounts: z.array(z.object({ role: z.string().min(1) })).optional(),
    })
    .optional(),
  caseStudy: z.object({
    context: z.string().min(1),
    problem: z.string().min(1),
    approach: z.string().min(1),
    architecture: z.object({ altText: z.string().min(1) }),
    decisions: z.array(decisionSchema),
    challenges: z.array(z.string().min(1)),
    outcomes: z.array(z.string().min(1)),
    retrospective: z.string().min(1),
    stackDetail: z.array(stackGroupSchema).optional(),
  }),
});

export type ProjectText = z.infer<typeof projectTextSchema>;

export const profileStructureSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  timezone: z.string(),
  portrait: z.object({ src: z.string(), width: z.number(), height: z.number() }),
  socials: z.array(
    z.object({ id: z.string(), href: z.string().min(1), external: z.boolean().default(true) }),
  ),
  /**
   * CV file per language, keyed by locale code (plus a required `default`
   * fallback for any locale without its own PDF). Keyed by plain string
   * rather than typed against `Locale` to keep this schema decoupled from
   * `@/i18n/config`.
   */
  cv: z
    .record(z.string(), z.object({ href: z.string(), filename: z.string() }))
    .refine((map) => 'default' in map, { message: 'cv map must include a "default" entry' }),
  spokenLanguageCodes: z.array(z.string()),
  ctas: z.array(
    z.object({
      id: z.string(),
      href: z.string(),
      variant: z.enum(['primary', 'secondary', 'ghost']),
      external: z.boolean().optional(),
      download: z.boolean().optional(),
    }),
  ),
});

export type ProfileStructure = z.infer<typeof profileStructureSchema>;

export const profileTextSchema = z.object({
  role: z.string().min(1),
  tagline: z.string().min(1),
  location: z.string().min(1),
  bio: z.array(z.string().min(1)).min(1),
  portraitAlt: z.string().min(1),
  availability: availabilitySchema,
  socials: z.array(z.object({ id: z.string(), label: z.string().min(1) })),
  ctas: z.array(z.object({ id: z.string(), label: z.string().min(1) })),
  cvLabel: z.string().min(1),
  spokenLanguages: z.array(z.object({ language: z.string().min(1), level: z.string().min(1) })),
  highlights: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })),
});

export type ProfileText = z.infer<typeof profileTextSchema>;

export const roleTextSchema = z.object({
  title: z.string().min(1),
  employmentType: z.string().min(1),
  location: z.string().min(1),
  summary: z.string().min(1),
  achievements: z.array(z.string().min(1)),
  confidentialityNote: z.string().optional(),
});

export const experienceTextSchema = z.object({ roles: z.record(z.string(), roleTextSchema) });

export const educationTextSchema = z.object({
  entries: z.record(
    z.string(),
    z.object({
      degree: z.string().min(1),
      field: z.string().optional(),
      location: z.string().min(1),
      note: z.string().optional(),
    }),
  ),
});

export const certificationsTextSchema = z.object({
  entries: z.record(z.string(), z.object({ name: z.string().min(1) })),
});

export const skillsTextSchema = z.object({
  groups: z.record(z.string(), z.object({ label: z.string().min(1) })),
  /** Display names for skills that are practices rather than product names
   *  ("Code review"). Product/language names are never listed here and are
   *  shown as-is in every language. */
  skills: z.record(z.string(), z.string().min(1)),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(120),
  message: z.string().min(20, 'Message must be at least 20 characters').max(5000),
  website: z.string().max(0).optional(), // honeypot
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
