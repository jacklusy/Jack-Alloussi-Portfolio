import Link from 'next/link';
import { getFeaturedProjects } from '@/content/projects';
import { Section } from '@/components/layout/Section';
import { ProjectCard } from '@/components/features/projects/ProjectCard';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

export function ProjectsPreviewSection() {
  const projects = getFeaturedProjects().slice(0, 5);

  return (
    <Section
      id="projects"
      eyebrow="Evidence"
      title="Featured projects"
      description="Professional work described in architecture and outcomes — client identities stay confidential."
    >
      <Stagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" stagger={0.06}>
        {projects.map((project) => (
          <StaggerItem key={project.slug} className="h-full">
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </Stagger>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <ButtonLink href="/projects" variant="secondary">
          View all projects
        </ButtonLink>
        <p className="text-[var(--text-sm)] text-[var(--color-text-subtle)]">
          Or{' '}
          <Link href="/projects" className="text-[var(--color-brand)] underline-offset-2 hover:underline">
            filter by technology
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}
