import Image from 'next/image';
import Link from 'next/link';
import { Database, Layers, Smartphone } from 'lucide-react';
import { skillGroups } from '@/content/skills';
import { Section } from '@/components/layout/Section';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { TiltCard } from '@/components/motion/TiltCard';
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

type MatrixColumn = {
  id: string;
  label: string;
  icon: ReactNode;
  groupIds: string[];
};

const columns: MatrixColumn[] = [
  {
    id: 'backend',
    label: 'Backend',
    icon: <Database className="h-5 w-5" aria-hidden />,
    groupIds: ['languages', 'backend', 'practices'],
  },
  {
    id: 'clients',
    label: 'Frontend & Mobile',
    icon: <Smartphone className="h-5 w-5" aria-hidden />,
    groupIds: ['frontend', 'mobile'],
  },
  {
    id: 'platform',
    label: 'Data & Infrastructure',
    icon: <Layers className="h-5 w-5" aria-hidden />,
    groupIds: ['data', 'infrastructure'],
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

export function SkillsSection() {
  return (
    <Section
      id="skills"
      eyebrow="System.stack_02"
      title="Core technology matrix"
      description="How I ship — grouped by surface area, not vanity percentages."
    >
      <Stagger className="grid gap-4 md:grid-cols-3 md:gap-5" stagger={0.06}>
        {columns.map((column) => {
          const skills = skillsForGroups(column.groupIds);
          return (
            <StaggerItem key={column.id} className="h-full">
              <TiltCard className="h-full">
                <div className="flex h-full min-h-[22rem] flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]/90 p-5 shadow-[var(--shadow-sm)] backdrop-blur-sm md:p-6">
                  <div className="mb-5 flex items-center gap-3 text-[var(--color-brand)]">
                    {column.icon}
                    <h3 className="text-[length:var(--text-h3)] text-[var(--color-text)]">
                      {column.label}
                    </h3>
                  </div>
                  <ul className="flex flex-1 flex-col gap-2.5">
                    {skills.map((skill) => {
                      const icon = ICON_BY_NAME[skill.name];
                      const slug = skill.projectSlugs?.[0];
                      const row = (
                        <span className="flex min-h-10 items-center justify-between gap-3 border-b border-[var(--color-border)]/70 py-2 last:border-0">
                          <span className="inline-flex items-center gap-2 text-[var(--color-text)]">
                            {icon ? (
                              <Image src={icon} alt="" width={16} height={16} className="opacity-80" />
                            ) : null}
                            {skill.name}
                          </span>
                        </span>
                      );
                      return (
                        <li key={skill.name}>
                          {slug ? (
                            <Link
                              href={`/projects?tech=${encodeURIComponent(skill.name)}`}
                              className="block transition-colors hover:text-[var(--color-brand)]"
                              data-magnetic
                            >
                              {row}
                            </Link>
                          ) : (
                            row
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </TiltCard>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
