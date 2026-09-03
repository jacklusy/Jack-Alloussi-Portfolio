import { getFeaturedProjects, projects, getTopTechnologies } from '@/content/projects';
import { Section } from '@/components/layout/Section';
import { ProjectCard } from '@/components/features/projects/ProjectCard';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

function catalogStats() {
  const technologies = new Set(projects.flatMap((project) => project.technologies));
  const shipped = projects.filter((project) => project.status === 'shipped').length;
  const withCaseStudy = projects.filter((project) => project.hasCaseStudy).length;

  return [
    { value: String(projects.length), label: 'Documented systems' },
    { value: String(withCaseStudy), label: 'Full case studies' },
    { value: `${technologies.size}`, label: 'Technologies shipped' },
    { value: String(shipped), label: 'In production' },
  ];
}

export function ProjectsPreviewSection() {
  const featured = getFeaturedProjects().slice(0, 3);
  const stats = catalogStats();
  const topTechs = getTopTechnologies(6);

  return (
    <Section
      id="projects"
      eyebrow="System.work_03"
      title="Technical deployments"
      description="Each one argued in problem, architecture, decisions, and outcome — including what did not work. Client identities stay confidential; the engineering does not."
      headerAction={{ label: 'Explore all projects →', href: '/projects' }}
    >
      <Reveal>
        <dl className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[var(--color-surface)] px-5 py-6">
              <dd className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-[var(--tracking-display)] text-[var(--color-text)] tabular-nums">
                {stat.value}
              </dd>
              <dt className="mt-1.5 font-mono text-[10px] tracking-[var(--tracking-label)] text-[var(--color-text-subtle)] uppercase">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </Reveal>

      <Stagger
        className="grid auto-rows-fr gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3"
        stagger={0.06}
      >
        {featured.map((project, index) => (
          <StaggerItem
            key={project.slug}
            className="h-full min-w-0"
            direction={index % 2 === 0 ? 'left' : 'right'}
            distance={24}
          >
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.05}>
        <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.12em] text-[var(--color-text-subtle)] uppercase">
          <span className="text-[var(--color-text-muted)]">Most used</span>
          {topTechs.map((tech) => (
            <span key={tech} className="text-[var(--color-text-subtle)]">
              {tech}
            </span>
          ))}
        </p>
      </Reveal>
    </Section>
  );
}
