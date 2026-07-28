import type { ReactNode } from 'react';

const NEEDS_INPUT_PATTERN = /\{\{NEEDS_INPUT:\s*([^}]+)\}\}/g;

/**
 * Renders content strings, highlighting {{NEEDS_INPUT}} tokens in development style.
 */
export function renderContentText(value: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const pattern = new RegExp(NEEDS_INPUT_PATTERN.source, 'g');

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) {
      parts.push(value.slice(lastIndex, match.index));
    }
    parts.push(
      <mark
        key={`${match.index}-${match[1]}`}
        className="rounded-sm bg-[var(--color-warning)]/20 px-1 text-[var(--color-warning)]"
        title="Content gap — see docs/CONTENT-GAPS.md"
      >
        [needs input: {match[1]?.trim()}]
      </mark>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex === 0) return value;
  if (lastIndex < value.length) parts.push(value.slice(lastIndex));
  return parts;
}

export function hasNeedsInput(value: string): boolean {
  return /\{\{NEEDS_INPUT:/.test(value);
}

export function isUsableHref(href: string): boolean {
  return Boolean(href) && !hasNeedsInput(href) && href !== '#';
}
