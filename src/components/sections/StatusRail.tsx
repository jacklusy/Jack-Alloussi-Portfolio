import { profile } from '@/content/profile';
import { cn } from '@/lib/utils';

export type StatusRailProps = {
  orientation?: 'vertical' | 'horizontal';
  className?: string;
};

const items = [
  { key: 'STATUS', value: 'AVAILABLE' },
  { key: 'LOC', value: 'AMMAN · JO' },
  { key: 'VISA', value: 'EU BLUE CARD' },
  { key: 'GRAD', value: 'OCT 2026' },
] as const;

/**
 * Signature element: monospace work-authorisation / availability status panel.
 */
export function StatusRail({ orientation = 'vertical', className }: StatusRailProps) {
  return (
    <aside
      className={cn(
        'border-[var(--color-border)] bg-[var(--color-surface-sunken)] font-mono text-[var(--text-xs)] tracking-[0.08em]',
        orientation === 'vertical' &&
          'hidden w-[var(--status-rail-width)] shrink-0 flex-col justify-center gap-6 border-r px-4 py-8 lg:flex',
        orientation === 'horizontal' &&
          'flex w-full flex-wrap items-center gap-x-6 gap-y-3 border-b px-4 py-3 lg:hidden',
        className,
      )}
      aria-label="Availability and work authorisation status"
    >
      <p className="sr-only">
        {profile.availability.status}. {profile.availability.visaNote} Graduating{' '}
        {profile.availability.graduationDate}.
      </p>
      {items.map((item) => (
        <div key={item.key} className="flex flex-col gap-1">
          <span className="text-[var(--color-text-subtle)]">{item.key}</span>
          <span className="font-medium text-[var(--color-brand)]">{item.value}</span>
        </div>
      ))}
    </aside>
  );
}
