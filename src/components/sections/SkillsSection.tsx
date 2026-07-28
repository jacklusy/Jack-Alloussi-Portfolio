import Image from 'next/image';
import Link from 'next/link';
import { Code2, Database, Layers, Smartphone, Wrench } from 'lucide-react';
import { skillGroups } from '@/content/skills';
import { Section } from '@/components/layout/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import type { ReactNode } from 'react';

import reactIcon from '@/assets/img/icons/react.png';
import laravelIcon from '@/assets/img/icons/laravel.png';
import jsIcon from '@/assets/img/icons/js.png';
import phpIcon from '@/assets/img/icons/php.png';

const ICON_BY_NAME: Record<string, typeof reactIcon> = {
  React: reactIcon,
  'React Native (CLI & Expo)': reactIcon,
  Laravel: laravelIcon,
  'Laravel 9–12': laravelIcon,
  JavaScript: jsIcon,
  PHP: phpIcon,
};

type Band = {
  id: string;
  label: string;
  icon: ReactNode;
  groupIds: string[];
  direction: 'left' | 'right';
};

/** Rebalanced bands — chip clouds, not equal-height empty columns. */
const bands: Band[] = [
  {
    id: 'backend',
    label: 'Backend & languages',
    icon: <Database className="h-4 w-4" aria-hidden />,
    groupIds: ['languages', 'backend'],
    direction: 'left',
  },
  {
    id: 'clients',
    label: 'Frontend & mobile',
    icon: <Smartphone className="h-4 w-4" aria-hidden />,
    groupIds: ['frontend', 'mobile'],
    direction: 'right',
  },
  {
    id: 'platform',
    label: 'Data & infrastructure',
    icon: <Layers className="h-4 w-4" aria-hidden />,
    groupIds: ['data', 'infrastructure'],
    direction: 'left',
  },
  {
    id: 'practices',
    label: 'Engineering practices',
    icon: <Wrench className="h-4 w-4" aria-hidden />,
    groupIds: ['practices'],
    direction: 'right',
  },
];

function skillsForGroups(groupIds: string[]) {
  const seen = new Set<string>();
  const items: { name: string; projectSlugs?: string[] }[] = [];
  for (const group of skillGroups) {
    if (!groupIds.includes(group.id)) continue;
    for (const skill of group.skills) {
      if (seen.has(skill.name)) continue;
      seen.add(skill.name);
      items.push(
        skill.projectSlugs
          ? { name: skill.name, projectSlugs: skill.projectSlugs }
          : { name: skill.name },
      );
    }
  }
  return items;
}

function SkillChip({ name, href }: { name: string; href?: string }) {
  const icon = ICON_BY_NAME[name];
  const content = (
    <span className="inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--text-sm)] text-[var(--color-text)] transition-colors duration-[var(--duration-micro)]">
      {icon ? (
        <Image src={icon} alt="" width={14} height={14} className="opacity-85" />
      ) : (
        <Code2 className="h-3.5 w-3.5 text-[var(--color-text-subtle)]" aria-hidden />
      )}
      {name}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-[var(--radius-md)] hover:[&>span]:border-[var(--color-brand)] hover:[&>span]:text-[var(--color-brand)] focus-visible:outline-none"
        data-magnetic
      >
        {content}
      </Link>
    );
  }

  return content;
}

export function SkillsSection() {
  return (
    <Section
      id="skills"
      eyebrow="System.stack_02"
      title="Core technology matrix"
      description="How I ship — grouped by surface area, not vanity percentages."
    >
      <div className="space-y-8 md:space-y-10">
        {bands.map((band) => {
          const skills = skillsForGroups(band.groupIds);
          return (
            <Reveal key={band.id} direction={band.direction} distance={36}>
              <div className="border-t border-[var(--color-border)] pt-6">
                <div className="mb-4 flex items-center gap-2.5 text-[var(--color-brand)]">
                  {band.icon}
                  <h3 className="font-mono-label text-[var(--color-text)]">{band.label}</h3>
                </div>
                <Stagger className="flex flex-wrap gap-2" stagger={0.03}>
                  {skills.map((skill) => {
                    const href = skill.projectSlugs?.[0]
                      ? `/projects?tech=${encodeURIComponent(skill.name)}`
                      : undefined;
                    return (
                      <StaggerItem key={skill.name} direction={band.direction} distance={16}>
                        {href ? (
                          <SkillChip name={skill.name} href={href} />
                        ) : (
                          <SkillChip name={skill.name} />
                        )}
                      </StaggerItem>
                    );
                  })}
                </Stagger>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
