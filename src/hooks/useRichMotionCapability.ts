'use client';

import { useSyncExternalStore } from 'react';

function subscribeMedia(query: string, onChange: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

/**
 * Devices reporting four or fewer logical cores are treated as unable to spare
 * a canvas simulation. `hardwareConcurrency` is a coarse signal and is absent
 * in some browsers, so an unknown value is taken as capable.
 */
function hasSpareCores(): boolean {
  const cores = navigator.hardwareConcurrency;
  return typeof cores !== 'number' || cores > 4;
}

/**
 * Desktop-quality motion: fine pointer + hover, enough CPU headroom, and not
 * reduced-motion. SSR / first paint snapshot is always false.
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
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      hasSpareCores(),
    () => false,
  );
}
