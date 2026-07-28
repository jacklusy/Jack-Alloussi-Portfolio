import Link from 'next/link';
import { skillGroups } from '@/content/skills';
import { Section } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';
import { AmbientBackdrop } from '@/components/layout/AmbientBackdrop';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';

export type SkillsSectionProps = {
  enableProjectLinks?: boolean;
};

export function SkillsSection({ enableProjectLinks = true }: SkillsSectionProps) {
  return (
    <Section
      id="skills"
      eyebrow="Stack"
      title="Skills & technology"
      description="Grouped by how I actually work — not proficiency percentages."
      className="relative overflow-hidden"
      containerClassName="relative z-10"
    >
      <AmbientBackdrop variant="section" className="opacity-80" />
      <Stagger className="relative z-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3" stagger={0.05}>
        {skillGroups.map((group) => (
          <StaggerItem key={group.id} className="h-full">
            <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]/85 p-5 shadow-[var(--shadow-sm)] backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-[var(--duration-standard)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-[var(--color-brand)]/30 hover:shadow-[var(--shadow-md)]">
              <h3 className="mb-4 text-[length:var(--text-h3)]">{group.label}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => {
                  const slug = skill.projectSlugs?.[0];
                  const chip = (
                    <Badge
                      tone="default"
                      className="transition-[transform,border-color,color] duration-[var(--duration-micro)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                    >
                      {skill.name}
                    </Badge>
                  );
                  return (
                    <li key={skill.name}>
                      {enableProjectLinks && slug ? (
                        <Link
                          href={`/projects?tech=${encodeURIComponent(skill.name)}`}
                          className="inline-flex min-h-11 items-center"
                        >
                          {chip}
                        </Link>
                      ) : (
                        chip
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
