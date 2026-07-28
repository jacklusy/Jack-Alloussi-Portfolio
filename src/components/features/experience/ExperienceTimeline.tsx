'use client';

import { useState } from 'react';
import type { Role } from '@/content/schemas';
import { Badge } from '@/components/ui/Badge';
import { renderContentText } from '@/lib/content-text';
import { formatMonthYear } from '@/lib/utils';
import { cn } from '@/lib/utils';

export type ExperienceTimelineProps = {
  roles: Role[];
  initiallyExpandedId?: string;
};

export function ExperienceTimeline({ roles, initiallyExpandedId }: ExperienceTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(initiallyExpandedId ?? roles[0]?.id ?? null);

  return (
    <ol className="relative space-y-0 border-l border-[var(--color-border-strong)] pl-6 md:pl-8">
      {roles.map((role, index) => {
        const isExpanded = expandedId === role.id;
        const panelId = `${role.id}-panel`;

        return (
          <li key={role.id} id={role.id} className="relative pb-10 last:pb-0">
            <span
              className="absolute -left-[1.9rem] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-brand)] bg-[var(--color-bg)] font-mono text-[10px] text-[var(--color-brand)] shadow-[0_0_12px_rgb(var(--color-brand-rgb)/0.35)] md:-left-[2.4rem]"
              aria-hidden
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="w-full rounded-[var(--radius-md)] text-left transition-colors duration-[var(--duration-micro)] hover:bg-[var(--color-surface)] focus-visible:outline-none"
              aria-expanded={isExpanded}
              aria-controls={panelId}
              onClick={() => setExpandedId(isExpanded ? null : role.id)}
            >
              <p className="font-mono-label text-[var(--color-text-subtle)]">
                {formatMonthYear(role.startDate)} — {formatMonthYear(role.endDate)}
              </p>
              <h3 className="mt-2 text-[length:var(--text-h3)] text-[var(--color-text)]">
                {role.title}
              </h3>
              <p className="mt-1 text-[var(--color-text-muted)]">
                {role.company} · {role.employmentType} · {role.location}
              </p>
              <p className="mt-3 text-[var(--color-text-muted)]">{role.summary}</p>
            </button>
            <div
              id={panelId}
              className={cn('mt-4 space-y-4', !isExpanded && 'hidden')}
              hidden={!isExpanded}
            >
              {role.confidentialityNote ? (
                <p className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--text-sm)] text-[var(--color-text-muted)]">
                  {role.confidentialityNote}
                </p>
              ) : null}
              <ul className="list-disc space-y-2 pl-5 text-[var(--color-text-muted)]">
                {role.achievements.map((item) => (
                  <li key={item.slice(0, 48)}>{renderContentText(item)}</li>
                ))}
              </ul>
              <ul className="flex flex-wrap gap-2">
                {role.technologies.map((tech) => (
                  <li key={tech}>
                    <Badge>{tech}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
