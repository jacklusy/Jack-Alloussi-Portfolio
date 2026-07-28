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
  field: z.string(),
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
});

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
  thumbnail: z.object({
    src: z.string(),
    alt: z.string(),
    width: z.number(),
    height: z.number(),
  }),
  links: z.object({
    live: z.string().optional(),
    repo: z.string().optional(),
    caseStudy: z.string().optional(),
  }),
  featured: z.boolean(),
  kind: z.enum(['personal', 'professional']),
  confidential: z.boolean(),
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
