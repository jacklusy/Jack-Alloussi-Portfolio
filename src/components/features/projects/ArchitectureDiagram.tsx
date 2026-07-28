export type ArchitectureDiagramProps = {
  diagramId: string;
  altText: string;
};

export function ArchitectureDiagram({ diagramId, altText }: ArchitectureDiagramProps) {
  return (
    <figure className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-6">
      <svg
        viewBox="0 0 640 320"
        role="img"
        aria-label={altText}
        className="h-auto w-full text-[var(--color-text)]"
      >
        <title>{altText}</title>
        <rect width="640" height="320" fill="var(--color-surface-raised)" />
        <text x="24" y="36" className="fill-[var(--color-text-subtle)]" fontSize="12" fontFamily="monospace">
          {diagramId}
        </text>

        <rect x="40" y="60" width="170" height="70" rx="8" fill="var(--color-brand-subtle)" stroke="var(--color-brand)" />
        <text x="125" y="100" textAnchor="middle" fontSize="14" fill="var(--color-text)">
          Clients
        </text>
        <text x="125" y="118" textAnchor="middle" fontSize="11" fill="var(--color-text-muted)">
          Web · Mobile
        </text>

        <rect x="235" y="60" width="170" height="70" rx="8" fill="var(--color-surface)" stroke="var(--color-border-strong)" />
        <text x="320" y="100" textAnchor="middle" fontSize="14" fill="var(--color-text)">
          API layer
        </text>
        <text x="320" y="118" textAnchor="middle" fontSize="11" fill="var(--color-text-muted)">
          NestJS · Laravel
        </text>

        <rect x="430" y="60" width="170" height="70" rx="8" fill="var(--color-surface)" stroke="var(--color-border-strong)" />
        <text x="515" y="100" textAnchor="middle" fontSize="14" fill="var(--color-text)">
          Data
        </text>
        <text x="515" y="118" textAnchor="middle" fontSize="11" fill="var(--color-text-muted)">
          PostgreSQL · Redis
        </text>

        <path d="M210 95 H235" stroke="var(--color-border-strong)" strokeWidth="2" markerEnd="url(#arrow)" />
        <path d="M405 95 H430" stroke="var(--color-border-strong)" strokeWidth="2" />

        <rect x="120" y="190" width="400" height="80" rx="8" fill="var(--color-surface-sunken)" stroke="var(--color-border)" />
        <text x="320" y="225" textAnchor="middle" fontSize="14" fill="var(--color-text)">
          Delivery
        </text>
        <text x="320" y="245" textAnchor="middle" fontSize="11" fill="var(--color-text-muted)">
          Docker · CI/CD · Cloud hosts
        </text>

        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="var(--color-border-strong)" />
          </marker>
        </defs>
      </svg>
      <figcaption className="mt-3 text-[var(--text-sm)] text-[var(--color-text-subtle)]">
        {altText}
      </figcaption>
    </figure>
  );
}
