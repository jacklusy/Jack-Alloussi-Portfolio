import type { Project } from '@/content/schemas';

import homeScreen from '@/assets/img/projects/cloudix/home_screen.png';
import services from '@/assets/img/projects/cloudix/sercives.png';
import ourProjects from '@/assets/img/projects/cloudix/ourprojects.png';
import about from '@/assets/img/projects/cloudix/about.png';
import contactUs from '@/assets/img/projects/cloudix/contactus.png';

export const cloudix = {
  slug: 'cloudix',
  title: 'Cloudix — bilingual corporate & lead-generation site',
  summary:
    'A seven-route Arabic-first marketing site for a boutique dev shop: ~45 composable section components, a grounded AI assistant, and backendless lead capture — built so three engineers can maintain a site that reads enterprise.',
  description:
    'A corporate website for a software services company targeting the Saudi and Jordanian market. Arabic is the default locale rather than a translation layer, lead capture runs without any backend infrastructure, and an AI assistant answers prospect questions from the same typed data the site renders — so the two cannot contradict each other on facts.',
  role: 'Frontend Developer',
  timeframe: '2025',
  year: 2025,
  status: 'shipped' as const,
  technologies: [
    'React 19',
    'TypeScript',
    'Vite 6',
    'React Router 7',
    'Tailwind CSS v4',
    'i18next',
    'Motion',
    'Gemini API',
    'EmailJS',
  ],
  categories: ['Frontend'],
  cover: { hue: 202, pattern: 'nodes' as const },
  metrics: [
    { label: 'Section components', value: '~45' },
    { label: 'Source size', value: '~7,300 lines' },
    { label: 'Routes', value: '7, fully bilingual' },
  ],
  thumbnail: {
    image: homeScreen,
    alt: 'The Cloudix home page: a dark navy hero reading “Building Smarter Connected Systems” over an office photograph, with an AR/EN language switch in the header and four capability cards beneath.',
  },
  gallery: [
    {
      image: services,
      alt: 'The Cloudix services mega-menu open over the page, showing cards for IT Solutions, Backend Engineering, and Cloud & Deployment.',
      caption:
        'The services mega-menu. Navigation depth like this is what makes a small shop read as a larger firm, and it is assembled from the same pool of roughly 45 composable section components as every other page rather than hand-built per route.',
    },
    {
      image: ourProjects,
      alt: 'The Cloudix projects page, headed “Driving innovation through successful projects”, with a delivery checklist and a photograph overlaid with a 150+ completed-projects figure.',
      caption:
        'The projects page leads with the number a prospect actually weighs. The AR/EN switch sitting in the header of every one of these screens flips writing direction and layout, not just strings — Arabic is the default locale here, not a translation bolted onto a Western design.',
    },
    {
      image: about,
      alt: 'The Cloudix about page hero: a “Smart Solutions” pill above the line “Cloudix delivering intelligent solutions for growth”, over a tinted office photograph.',
      caption:
        'Seven routes share one visual language — tinted photographic hero, eyebrow pill, single call to action — so a new page is a composition of existing parts instead of a new design.',
    },
    {
      image: contactUs,
      alt: 'The Cloudix contact page, with a photographic header and cards for phone, e-mail and location.',
      caption:
        'Lead capture with no backend behind it. A company that builds websites for other companies was never going to run a server just to receive a contact form, so submissions reach a real inbox without a database or an email service to operate.',
    },
  ],
  links: {
    live: 'https://cloudix.siqva.com',
    repo: 'https://github.com/jacklusy/Cloudix',
    caseStudy: '/projects/cloudix',
  },
  featured: true,
  kind: 'client' as const,
  confidential: false,
  sortWeight: 60,
  hasCaseStudy: true as const,
  caseStudy: {
    context:
      'A boutique development shop needed a site doing three jobs a typical agency template does not. It had to look enterprise while being run by a small team — the biggest sales obstacle for a shop this size is looking small, so the site needed the visual density of a large engineering firm while remaining maintainable by a handful of people. It had to work as a real bilingual product for an Arabic-primary market rather than a Western site with Arabic bolted on. And it had to generate qualified leads with no marketing-ops budget.',
    problem:
      'Two hard constraints shaped the architecture. A company that builds websites for other companies is sensibly not going to run its own backend just to receive contact-form submissions, so leads had to reach a real inbox without a server, a database, or an email service to operate. And prospective clients wanted to self-serve the questions that otherwise stall a sales conversation — what do you do, who is on the team, have you built this before — in both languages, without the site inventing facts about the company.',
    approach:
      'Compose pages from independently named, independently styled section components with no glue logic, so adding a section is one file and one import rather than a routing change. Make Arabic the fallback locale with an active browser-locale detector, so the market is designed for rather than retrofitted. Ground the AI assistant by generating its system prompt at render time from the same typed data modules the UI renders, and bound it with explicit rules — never name employees, stay in scope, reply in the language the visitor writes in. Route form submissions through a third-party delivery service directly from the browser, guarded by a honeypot rather than a CAPTCHA.',
    architecture: {
      diagramId: 'cloudix-composition',
      altText:
        'A React Router 7 single-page app across seven routes, each page composed from independently importable section components; typed data modules feed both the rendered UI and the generated system prompt for a browser-side AI assistant, while contact submissions route through a client-side email delivery service, with i18next resolving Arabic-default localisation throughout.',
    },
    decisions: [
      {
        decision: 'Arabic as the fallback locale, with an active browser-language detector',
        alternatives: 'English default with Arabic as a secondary translation layer',
        reasoning:
          'The target market is Arabic-primary. Making it the fallback rather than the alternate is the clearest signal in the codebase that the market was designed for from the start.',
        tradeoff:
          'Every visible string — including forty-plus FAQ entries, two legal documents, and the assistant’s error copy — needs a real parallel Arabic version, not a machine translation.',
      },
      {
        decision: 'A system-prompt-only AI assistant instead of retrieval or fine-tuning',
        alternatives: 'A vector database with a retrieval pipeline, or a fine-tuned model',
        reasoning:
          'Rebuilding the facts block at render time from the same service and project data the UI renders means the assistant and the website cannot contradict each other on facts — only on tone. For a corpus this size, retrieval would add infrastructure without adding accuracy.',
        tradeoff:
          'The prompt grows with the site and consumes context on every request, and the approach stops scaling once the corpus outgrows a single prompt.',
      },
      {
        decision: 'A honeypot field rather than a CAPTCHA',
        alternatives: 'A third-party CAPTCHA widget on the contact form',
        reasoning:
          'It cost nothing in user friction, added no third-party script, and was added because real spam submissions arrived — a durable fix to an actual failure rather than a precaution.',
        tradeoff:
          'It stops naive bots, not determined ones. A targeted submitter who reads the markup gets through.',
      },
      {
        decision: 'One generic legal-document renderer instead of two hand-authored pages',
        alternatives: 'Separate bespoke Privacy and Terms pages',
        reasoning:
          'Both documents are structurally identical in two languages, so a single renderer over structured content keeps four page variants consistent by construction.',
        tradeoff:
          'Any document that eventually needs a genuinely different structure has to break out of the shared renderer.',
      },
    ],
    challenges: [
      'Making a site feel like an enterprise engineering firm — mega-menus, case studies, industry pages, a why-choose-us narrative — while keeping it maintainable by three people.',
      'Keeping the assistant factually anchored to the site: a hard scope boundary that redirects off-topic questions rather than answering them, and a standing rule against naming individuals.',
      'Defending against a known model deprecation with an explicit fallback, after hitting the failure in production rather than anticipating it.',
    ],
    outcomes: [
      'Seven fully bilingual routes — home, services, portfolio, about, contact, privacy and terms — with deep-linkable service anchors from a hover mega-menu.',
      'Around forty-five section components across roughly 7,300 lines, each independently composable, so a new section is a file and an import.',
      'A grounded AI assistant with quick-prompt chips, auto-linkified replies, a typing indicator, and distinct copy for five separate failure modes.',
      'Lead capture, persisted light/dark theming that respects system preference until overridden, and complete SEO metadata including Open Graph, Twitter cards, organisation structured data, and a web manifest.',
    ],
    retrospective:
      'Section-per-file composition scaled exactly as intended, and Arabic-first localisation proved to be the decision that made the rest coherent. The assistant’s system prompt is the part I would point at: the scope boundary, the brevity rule, and the never-name-people rule are all products of testing it, catching it doing something wrong, and writing a durable rule — not a first draft. Three things I would change. A third-party API key held in the browser needs a thin server-side proxy that holds the real credential and enforces rate limiting; building the client-side integration first and deferring the proxy is the wrong order, because the graceful missing-key handling makes the gap look addressed when it is not. The i18n file-splitting pattern was started for three domains and abandoned for the rest, leaving an 854-line module that reads as a refactor that ran out of time rather than a considered exception. And a shared component library was built — buttons with four variants, cards, section headings — then imported by nothing, while every section hand-rolled its own equivalents; a design system nobody adopts is worse than none, because it implies a consistency the pages do not actually have. The broader lesson is about placeholder content: it is defensible during build-out and dangerous at launch, because the moment a page goes live, provisional material is read as fact. Anything standing in for real content needs an explicit removal gate before deploy, not a good intention.',
    stackDetail: [
      {
        category: 'Language & framework',
        items: ['TypeScript 5.8', 'React 19', 'React Router 7', 'Vite 6'],
      },
      {
        category: 'Styling',
        items: [
          'Tailwind CSS v4 (CSS-first @theme config)',
          'Custom dark-mode variant',
          'clsx + tailwind-merge',
          'Inter + Noto Sans Arabic with RTL body swap',
        ],
      },
      {
        category: 'Internationalisation',
        items: [
          'i18next + react-i18next',
          'i18next-browser-languagedetector',
          'Arabic fallback locale',
          'Per-domain translation modules for About, Legal, and Projects',
        ],
      },
      {
        category: 'Integrations',
        items: [
          '@google/genai (assistant, grounded on site data)',
          '@emailjs/browser (backendless lead delivery)',
          'Honeypot spam guard',
        ],
      },
      {
        category: 'Motion & icons',
        items: ['Motion', 'lucide-react', 'CSS-keyframe marquee'],
      },
    ],
  },
} satisfies Project;
