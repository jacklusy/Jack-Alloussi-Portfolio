import type { ProjectStructure } from '@/content/schemas';

export const biddingManagementSystem = {
  slug: 'bidding-management-system',
  year: 2025,
  status: 'shipped',
  technologies: [
    'C# 12',
    '.NET 8',
    'ASP.NET Core',
    'Entity Framework Core',
    'SQL Server',
    'MediatR',
    'FluentValidation',
    'AutoMapper',
    'JWT',
    'Clean Architecture',
    'DDD',
    'CQRS',
  ],
  categories: ['Backend', 'Architecture'],
  cover: {
    hue: 268,
    pattern: 'planes',
  },
  group: {
    id: 'sky-academy',
  },
  links: {
    caseStudy: '/projects/bidding-management-system',
  },
  featured: false,
  kind: 'training',
  confidential: false,
  sortWeight: 20,
  diagramId: 'bidding-clean-architecture',
} satisfies ProjectStructure;
