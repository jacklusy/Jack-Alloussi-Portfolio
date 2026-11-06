import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Code2, Database, Layers, Smartphone, Wrench } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getContent } from '@/content';
import type { Locale } from '@/i18n/config';
import { Section } from '@/components/layout/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import type { ReactNode } from 'react';
import type { SkillGroup } from '@/content/schemas';

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
  labelKey: 'backend' | 'clients' | 'platform' | 'practices';
  icon: ReactNode;
  groupIds: string[];
  direction: 'start' | 'end';
};

/** Rebalanced bands — chip clouds, not equal-height empty columns. */
const bands: Band[] = [
  {
    id: 'backend',
    labelKey: 'backend',
    icon: <Database className="h-4 w-4" aria-hidden />,
    groupIds: ['languages', 'backend'],
    direction: 'start',
  },
  {
    id: 'clients',
    labelKey: 'clients',
    icon: <Smartphone className="h-4 w-4" aria-hidden />,
    groupIds: ['frontend', 'mobile'],
    direction: 'end',
  },
  {
    id: 'platform',
    labelKey: 'platform',
    icon: <Layers className="h-4 w-4" aria-hidden />,
    groupIds: ['data', 'infrastructure'],
    direction: 'start',
  },
  {
    id: 'practices',
    labelKey: 'practices',
    icon: <Wrench className="h-4 w-4" aria-hidden />,
    groupIds: ['practices'],
    direction: 'end',
  },
];

function skillsForGroups(skillGroups: SkillGroup[], groupIds: string[]) {
  const seen = new Set<string>();
  const items: { name: string; label: string; projectSlugs?: string[] }[] = [];
  for (const group of skillGroups) {
    if (!groupIds.includes(group.id)) continue;
    for (const skill of group.skills) {
      if (seen.has(skill.name)) continue;
      seen.add(skill.name);
      items.push(
        skill.projectSlugs
          ? { name: skill.name, label: skill.label ?? skill.name, projectSlugs: skill.projectSlugs }
          : { name: skill.name, label: skill.label ?? skill.name },
      );
    }
  }
  return items;
}

function SkillChip({ name, label, href }: { name: string; label: string; href?: string }) {
  const icon = ICON_BY_NAME[name];
  const content = (
    <span className="inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-[var(--text-sm)] text-[var(--color-text)] transition-colors duration-[var(--duration-micro)]">
      {icon ? (
        <Image src={icon} alt="" width={14} height={14} className="opacity-85" />
      ) : (
        <Code2 className="h-3.5 w-3.5 text-[var(--color-text-subtle)]" aria-hidden />
      )}
      {label}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-[var(--radius-md)] hover:[&>span]:border-[var(--color-brand)] hover:[&>span]:text-[var(--color-brand)] focus-visible:outline-none"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export async function SkillsSection({ locale }: { locale: Locale }) {
  const [t, { skillGroups }] = await Promise.all([
    getTranslations({ locale, namespace: 'skills' }),
    getContent(locale),
  ]);
  return (
    <Section
      id="skills"
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
    >
      <div className="space-y-8 md:space-y-10">
        {bands.map((band) => {
          const skills = skillsForGroups(skillGroups, band.groupIds);
          return (
            <Reveal key={band.id} direction={band.direction} distance={36}>
              <div className="border-t border-[var(--color-border)] pt-6">
                <div className="mb-4 flex items-center gap-2.5 text-[var(--color-brand)]">
                  {band.icon}
                  <h3 className="font-mono-label text-[var(--color-text)]">{t(`bands.${band.labelKey}`)}</h3>
                </div>
                <Stagger className="flex flex-wrap gap-2" stagger={0.03}>
                  {skills.map((skill) => {
                    const href = skill.projectSlugs?.[0]
                      ? `/projects?tech=${encodeURIComponent(skill.name)}`
                      : undefined;
                    return (
                      <StaggerItem key={skill.name} direction={band.direction} distance={16}>
                        {href ? (
                          <SkillChip name={skill.name} label={skill.label} href={href} />
                        ) : (
                          <SkillChip name={skill.name} label={skill.label} />
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
