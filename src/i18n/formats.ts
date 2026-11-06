import type { Formats } from 'next-intl';

/**
 * Shared Intl presets. Arabic is rendered with Latin digits (`latn`) on purpose:
 * years, versions and metrics sit next to technical tokens (`NestJS 11`,
 * `50 → 1 + 49×409`), and mixing Arabic-Indic digits into those reads badly.
 */
export const formats = {
  dateTime: {
    monthYear: { month: 'short', year: 'numeric', numberingSystem: 'latn' },
    year: { year: 'numeric', numberingSystem: 'latn' },
  },
  number: {
    plain: { numberingSystem: 'latn' },
  },
} satisfies Formats;
