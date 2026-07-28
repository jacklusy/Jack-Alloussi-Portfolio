import { getFeaturedProjects } from '@/content/projects';
import { Section } from '@/components/layout/Section';
import { ProjectCard } from '@/components/features/projects/ProjectCard';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

export function ProjectsPreviewSection() {
  const projects = getFeaturedProjects().slice(0, 3);

  return (
    <Section
      id="projects"
      eyebrow="System.work_03"
      title="Technical deployments"
      description="Professional work argued in architecture and outcomes. Client identities stay confidential."
      headerAction={{ label: 'Explore all projects →', href: '/projects' }}
    >
      <Stagger className="grid auto-rows-fr gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3" stagger={0.06}>
        {projects.map((project) => (
          <StaggerItem key={project.slug} className="h-full min-w-0">
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
