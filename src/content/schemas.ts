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
  name: z.string(),
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

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(120),
  message: z.string().min(20, 'Message must be at least 20 characters').max(5000),
  website: z.string().max(0).optional(), // honeypot
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
