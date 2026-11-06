'use client';

import { useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query. The server snapshot is always `false`, so the
 * first client render matches the server HTML and the real value is applied on
 * the next commit — no hydration mismatch.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
