import { siteConfig } from '@/config/site';
import { profile } from '@/content/profile';
import { experience } from '@/content/experience';
import { projects } from '@/content/projects';
import { isUsableHref } from '@/lib/content-text';
import type { Project } from '@/content/schemas';

/**
 * Stable `@id` anchors. Every node in the graph references these rather than
 * repeating the entity, so Google can resolve one Person across every page
 * instead of treating each page's blob as a separate thing.
 */
export const SCHEMA_IDS = {
  website: `${siteConfig.url}/#website`,
  person: `${siteConfig.url}/#person`,
  organisation: `${siteConfig.url}/#csc-beyond`,
} as const;

const personRef = { '@id': SCHEMA_IDS.person } as const;

function socialProfiles(): string[] {
  return profile.socials
    .filter((social) => social.external && isUsableHref(social.href))
    .map((social) => social.href);
}

function personNode() {
  const current = experience[0];

  return {
    '@type': 'Person',
    '@id': SCHEMA_IDS.person,
    name: profile.name,
    givenName: 'Jack',
    familyName: 'Alloussi',
    jobTitle: profile.role,
    description: siteConfig.description,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    url: siteConfig.url,
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
      name: 'Amman, Jordan',
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
      name: 'Software Engineer',
      occupationalCategory: '15-1252.00',
      skills: [
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
      ].join(', '),
    },
    knowsAbout: [
      'TypeScript',
      'Node.js',
      'NestJS',
      'Laravel',
      'React',
      'Next.js',
      'React Native',
      'PostgreSQL',
      'Redis',
      'Docker',
      'Clean Architecture',
      'Domain-Driven Design',
      'Multi-tenant systems',
      'Offline-first mobile',
    ],
    knowsLanguage: profile.spokenLanguages.map((language) => ({
      '@type': 'Language',
      name: language.language,
      alternateName: language.language === 'Arabic' ? 'ar' : language.language === 'English' ? 'en' : undefined,
    })),
    sameAs: socialProfiles(),
  };
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': SCHEMA_IDS.website,
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
    inLanguage: 'en',
    publisher: personRef,
    author: personRef,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/projects?tech={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** The site-wide graph, emitted once from the root layout. */
export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [websiteNode(), personNode()],
  };
}

/**
 * `ProfilePage` is the type Google uses to build a person knowledge panel, so
 * the about page carries it with the Person as its main entity.
 */
export function profilePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${siteConfig.url}/about/#profilepage`,
    url: `${siteConfig.url}/about`,
    name: `About ${profile.name}`,
    isPartOf: { '@id': SCHEMA_IDS.website },
    mainEntity: personRef,
    about: personRef,
  };
}

export function faqJsonLd(faqs: ReadonlyArray<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
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

export function breadcrumbJsonLd(trail: ReadonlyArray<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.path}`,
    })),
  };
}

/**
 * A project with a public repository is `SoftwareSourceCode`; everything else
 * stays a `CreativeWork`. Both link back to the Person by `@id`.
 */
export function projectJsonLd(project: Project) {
  const hasRepo = Boolean(project.links.repo && isUsableHref(project.links.repo));

  return {
    '@context': 'https://schema.org',
    '@type': hasRepo ? 'SoftwareSourceCode' : 'CreativeWork',
    '@id': `${siteConfig.url}/projects/${project.slug}/#project`,
    name: project.title,
    headline: project.title,
    description: project.summary,
    url: `${siteConfig.url}/projects/${project.slug}`,
    author: personRef,
    creator: personRef,
    isPartOf: { '@id': SCHEMA_IDS.website },
    inLanguage: 'en',
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

export function projectListJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${siteConfig.url}/projects/#list`,
    name: 'Engineering case studies',
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteConfig.url}/projects/${project.slug}`,
      name: project.title,
    })),
  };
}
