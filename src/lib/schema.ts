import { siteConfig } from '@/config/site';
import { localeMeta, type Locale } from '@/i18n/config';
import { localizedPath } from '@/lib/seo';
import { isUsableHref } from '@/lib/content-text';
import type { Profile, Project, Role } from '@/content/schemas';

/**
 * Stable `@id` anchors. Every node in the graph references these rather than
 * repeating the entity, so Google can resolve one Person across every page
 * and every language instead of treating each page's blob as a separate thing.
 */
export const SCHEMA_IDS = {
  website: `${siteConfig.url}/#website`,
  person: `${siteConfig.url}/#person`,
  organisation: `${siteConfig.url}/#csc-beyond`,
} as const;

const personRef = { '@id': SCHEMA_IDS.person } as const;

const url = (locale: Locale, path = '') => `${siteConfig.url}${localizedPath(locale, path)}`;

const SKILLS = [
  'TypeScript',
  'Node.js',
  'NestJS',
  'Laravel',
  'React',
  'Next.js',
  'React Native',
  'PostgreSQL',
  'Docker',
  'Clean Architecture',
  'Domain-Driven Design',
];

export type SiteJsonLdInput = {
  locale: Locale;
  profile: Profile;
  experience: Role[];
  title: string;
  description: string;
};

function personNode({ locale, profile, experience, description }: SiteJsonLdInput) {
  const current = experience[0];

  return {
    '@type': 'Person',
    '@id': SCHEMA_IDS.person,
    name: profile.name,
    givenName: 'Jack',
    familyName: 'Alloussi',
    jobTitle: profile.role,
    description,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    url: url(locale),
    image: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}${profile.portrait.src}`,
      caption: `${profile.name} — ${profile.role}`,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Amman',
      addressCountry: 'JO',
    },
    homeLocation: {
      '@type': 'Place',
      name: profile.location,
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Al-Zaytoonah University of Jordan',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Amman',
        addressCountry: 'JO',
      },
    },
    worksFor: current
      ? {
          '@type': 'Organization',
          '@id': SCHEMA_IDS.organisation,
          name: current.company,
        }
      : undefined,
    hasOccupation: {
      '@type': 'Occupation',
      name: profile.role,
      occupationalCategory: '15-1252.00',
      skills: SKILLS.join(', '),
    },
    knowsAbout: [...SKILLS.slice(0, 8), 'Redis', ...SKILLS.slice(8), 'Multi-tenant systems', 'Offline-first mobile'],
    knowsLanguage: profile.spokenLanguages.map((language) => ({
      '@type': 'Language',
      name: language.language,
      alternateName: language.code,
    })),
    sameAs: profile.socials
      .filter((social) => social.external && isUsableHref(social.href))
      .map((social) => social.href),
  };
}

function websiteNode({ locale, title, description }: SiteJsonLdInput) {
  return {
    '@type': 'WebSite',
    '@id': SCHEMA_IDS.website,
    url: siteConfig.url,
    name: title,
    description,
    inLanguage: Object.values(localeMeta).map((meta) => meta.ogLocale.replace('_', '-')),
    publisher: personRef,
    author: personRef,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url(locale, '/projects')}?tech={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** The site-wide graph, emitted once from the locale layout. */
export function siteJsonLd(input: SiteJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@graph': [websiteNode(input), personNode(input)],
  };
}

/**
 * `ProfilePage` is the type Google uses to build a person knowledge panel, so
 * the about page carries it with the Person as its main entity.
 */
export function profilePageJsonLd(locale: Locale, name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${url(locale, '/about')}/#profilepage`,
    url: url(locale, '/about'),
    inLanguage: localeMeta[locale].ogLocale.replace('_', '-'),
    name,
    isPartOf: { '@id': SCHEMA_IDS.website },
    mainEntity: personRef,
    about: personRef,
  };
}

export function faqJsonLd(locale: Locale, faqs: ReadonlyArray<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: localeMeta[locale].ogLocale.replace('_', '-'),
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/** `path` values are language-neutral (`/projects`); the locale prefix is added here. */
export function breadcrumbJsonLd(
  locale: Locale,
  trail: ReadonlyArray<{ name: string; path: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: url(locale, crumb.path),
    })),
  };
}

/**
 * A project with a public repository is `SoftwareSourceCode`; everything else
 * stays a `CreativeWork`. Both link back to the Person by `@id`.
 */
export function projectJsonLd(locale: Locale, project: Project) {
  const hasRepo = Boolean(project.links.repo && isUsableHref(project.links.repo));

  return {
    '@context': 'https://schema.org',
    '@type': hasRepo ? 'SoftwareSourceCode' : 'CreativeWork',
    '@id': `${url(locale, `/projects/${project.slug}`)}/#project`,
    name: project.title,
    headline: project.title,
    description: project.summary,
    url: url(locale, `/projects/${project.slug}`),
    author: personRef,
    creator: personRef,
    isPartOf: { '@id': SCHEMA_IDS.website },
    inLanguage: localeMeta[locale].ogLocale.replace('_', '-'),
    keywords: project.technologies.join(', '),
    about: project.categories,
    datePublished: `${project.year}-01-01`,
    ...(hasRepo
      ? {
          codeRepository: project.links.repo,
          programmingLanguage: project.technologies.slice(0, 5),
        }
      : {}),
  };
}

export function projectListJsonLd(locale: Locale, name: string, projects: Project[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${url(locale, '/projects')}/#list`,
    name,
    inLanguage: localeMeta[locale].ogLocale.replace('_', '-'),
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: url(locale, `/projects/${project.slug}`),
      name: project.title,
    })),
  };
}
