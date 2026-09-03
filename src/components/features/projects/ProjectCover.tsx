import type { Project } from '@/content/schemas';
import { cn } from '@/lib/utils';

export type ProjectCoverProps = {
  project: Project;
  className?: string;
  /** Rendered decoratively beside real text; keep it out of the a11y tree. */
  priority?: boolean;
};

const VIEW_W = 1200;
const VIEW_H = 750;

/**
 * Deterministic SVG cover art, derived entirely from project data.
 *
 * No network request, no image weight, identical output on server and client,
 * and it adapts to both themes because the hue is layered over theme surface
 * tokens rather than baked into opaque fills.
 */
export function ProjectCover({ project, className }: ProjectCoverProps) {
  const { hue, pattern } = project.cover;
  const id = project.slug;

  // Two related hues give the gradient depth without a second palette.
  const h1 = hue;
  const h2 = (hue + 34) % 360;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={cn('h-full w-full', className)}
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={`cover-grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${h1} 62% 52%)`} stopOpacity="0.34" />
          <stop offset="55%" stopColor={`hsl(${h2} 58% 48%)`} stopOpacity="0.16" />
          <stop offset="100%" stopColor={`hsl(${h2} 50% 42%)`} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id={`cover-sheen-${id}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={`hsl(${h1} 70% 60%)`} stopOpacity="0.22" />
          <stop offset="100%" stopColor={`hsl(${h1} 70% 60%)`} stopOpacity="0" />
        </linearGradient>
        <clipPath id={`cover-clip-${id}`}>
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} />
        </clipPath>
      </defs>

      {/* Theme-aware ground; the hue rides on top of it. */}
      <rect width={VIEW_W} height={VIEW_H} fill="var(--color-surface-sunken)" />
      <rect width={VIEW_W} height={VIEW_H} fill={`url(#cover-grad-${id})`} />

      <g clipPath={`url(#cover-clip-${id})`}>
        <Pattern pattern={pattern} hue={h1} id={id} />
      </g>

      <rect width={VIEW_W} height={VIEW_H} fill={`url(#cover-sheen-${id})`} />

      {/* Spec-sheet corner marks, matching the site's monospace language. */}
      <text
        x="48"
        y="676"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="26"
        letterSpacing="3"
        fill="var(--color-text-muted)"
        opacity="0.75"
      >
        {`/${project.slug}`}
      </text>
      <text
        x={VIEW_W - 48}
        y="676"
        textAnchor="end"
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize="26"
        letterSpacing="3"
        fill="var(--color-text-muted)"
        opacity="0.75"
      >
        {String(project.year)}
      </text>
      <line
        x1="48"
        y1="700"
        x2={VIEW_W - 48}
        y2="700"
        stroke="var(--color-text-muted)"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />
    </svg>
  );
}

type PatternProps = {
  pattern: Project['cover']['pattern'];
  hue: number;
  id: string;
};

function Pattern({ pattern, hue, id }: PatternProps) {
  const stroke = `hsl(${hue} 65% 55%)`;

  switch (pattern) {
    /** Data and API surfaces — a measured field. */
    case 'grid': {
      const step = 60;
      const cols = Math.floor(VIEW_W / step);
      const rows = Math.floor(VIEW_H / step);
      return (
        <g stroke={stroke} strokeOpacity="0.22" strokeWidth="1.5">
          {Array.from({ length: cols + 1 }, (_, i) => (
            <line key={`v${i}`} x1={i * step} y1="0" x2={i * step} y2={VIEW_H} />
          ))}
          {Array.from({ length: rows + 1 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * step} x2={VIEW_W} y2={i * step} />
          ))}
          <rect
            x={step * 3}
            y={step * 2}
            width={step * 5}
            height={step * 3}
            fill={stroke}
            fillOpacity="0.14"
            strokeOpacity="0.5"
          />
        </g>
      );
    }

    /** Mobile and client surfaces — signal radiating to a device. */
    case 'arcs': {
      return (
        <g stroke={stroke} fill="none" strokeWidth="2">
          {[140, 240, 340, 440, 540].map((r, i) => (
            <circle
              key={r}
              cx={VIEW_W - 210}
              cy={VIEW_H - 120}
              r={r}
              strokeOpacity={0.3 - i * 0.045}
            />
          ))}
          <rect
            x={VIEW_W - 268}
            y={VIEW_H - 300}
            width="116"
            height="200"
            rx="18"
            fill={stroke}
            fillOpacity="0.16"
            strokeOpacity="0.5"
          />
        </g>
      );
    }

    /** Layered architecture — stacked planes seen in perspective. */
    case 'planes': {
      return (
        <g>
          {[0, 1, 2, 3].map((i) => {
            const y = 190 + i * 108;
            const inset = i * 46;
            return (
              <path
                key={i}
                d={`M${180 + inset} ${y} L${760 + inset} ${y - 92} L${1040 - inset} ${y + 16} L${460 - inset} ${y + 108} Z`}
                fill={stroke}
                fillOpacity={0.16 - i * 0.03}
                stroke={stroke}
                strokeOpacity={0.42 - i * 0.07}
                strokeWidth="2"
              />
            );
          })}
        </g>
      );
    }

    /** Document tooling — text lines on a page. */
    case 'glyphs': {
      const rows = 9;
      const widths = [520, 640, 430, 700, 380, 610, 480, 660, 340];
      return (
        <g>
          <rect
            x="150"
            y="110"
            width="760"
            height="540"
            rx="14"
            fill={stroke}
            fillOpacity="0.08"
            stroke={stroke}
            strokeOpacity="0.34"
            strokeWidth="2"
          />
          {Array.from({ length: rows }, (_, i) => (
            <rect
              key={i}
              x="200"
              y={168 + i * 52}
              width={widths[i]}
              height="16"
              rx="8"
              fill={stroke}
              fillOpacity={i === 3 ? 0.4 : 0.2}
            />
          ))}
        </g>
      );
    }

    /** Distributed systems — a connected mesh. */
    case 'nodes': {
      const points = [
        [200, 200],
        [470, 130],
        [730, 250],
        [980, 170],
        [320, 430],
        [620, 480],
        [900, 420],
        [480, 620],
      ] as const;
      const edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [0, 4],
        [1, 5],
        [2, 6],
        [4, 5],
        [5, 6],
        [4, 7],
        [5, 7],
      ] as const;
      return (
        <g>
          <g stroke={stroke} strokeOpacity="0.3" strokeWidth="2">
            {edges.map(([a, b]) => (
              <line
                key={`${id}-${a}-${b}`}
                x1={points[a]![0]}
                y1={points[a]![1]}
                x2={points[b]![0]}
                y2={points[b]![1]}
              />
            ))}
          </g>
          {points.map(([cx, cy], i) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r={i % 3 === 0 ? 16 : 10}
              fill={stroke}
              fillOpacity="0.5"
            />
          ))}
        </g>
      );
    }

    /** Streams and delivery — flowing signal. */
    case 'waves':
    default: {
      return (
        <g stroke={stroke} fill="none" strokeWidth="2.5">
          {[0, 1, 2, 3, 4].map((i) => {
            const y = 190 + i * 82;
            return (
              <path
                key={i}
                d={`M-40 ${y} C 220 ${y - 82}, 420 ${y + 82}, 640 ${y} S 1060 ${y - 82}, 1260 ${y}`}
                strokeOpacity={0.36 - i * 0.05}
              />
            );
          })}
        </g>
      );
    }
  }
}
