import Link from 'next/link';
import { skillGroups } from '@/content/skills';
import { Section } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';

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
      className="bg-[var(--color-surface)]"
    >
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {skillGroups.map((group) => (
          <div key={group.id}>
            <h3 className="mb-4 text-[length:var(--text-h3)]">{group.label}</h3>
            <ul className="flex flex-wrap gap-2">
              {group.skills.map((skill) => {
                const slug = skill.projectSlugs?.[0];
                const chip = <Badge tone="default">{skill.name}</Badge>;
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
        ))}
      </div>
    </Section>
  );
}
