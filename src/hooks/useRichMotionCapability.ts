'use client';

import { useSyncExternalStore } from 'react';

function subscribeMedia(query: string, onChange: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

/**
 * Desktop-quality motion: fine pointer + hover, and not reduced-motion.
 * SSR / first paint snapshot is always false.
 */
export function useRichMotionCapability(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const unsubFine = subscribeMedia('(hover: hover) and (pointer: fine)', onChange);
      const unsubReduce = subscribeMedia('(prefers-reduced-motion: reduce)', onChange);
      return () => {
        unsubFine();
        unsubReduce();
      };
    },
    () =>
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
}
