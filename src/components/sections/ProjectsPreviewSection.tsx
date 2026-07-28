import Link from 'next/link';
import { getFeaturedProjects } from '@/content/projects';
import { Section } from '@/components/layout/Section';
import { ProjectCard } from '@/components/features/projects/ProjectCard';
import { ButtonLink } from '@/components/ui/ButtonLink';

export function ProjectsPreviewSection() {
  const projects = getFeaturedProjects();

  return (
    <Section
      id="projects"
      eyebrow="Evidence"
      title="Featured projects"
      description="Professional work described in architecture and outcomes — client identities stay confidential. Personal repos use placeholders until published."
    >
      <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <li key={project.slug} className="h-full">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <ButtonLink href="/projects" variant="secondary">
          View all projects
        </ButtonLink>
      </div>
      <p className="mt-4 text-[var(--text-sm)] text-[var(--color-text-subtle)]">
        Prefer the index? <Link href="/projects" className="text-[var(--color-brand)] underline-offset-2 hover:underline">Browse and filter by technology</Link>.
      </p>
    </Section>
  );
}
