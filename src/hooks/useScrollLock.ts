'use client';

import { useEffect } from 'react';

/**
 * Locks background scroll while an overlay is open.
 *
 * `overflow: hidden` on its own is not enough — iOS Safari still rubber-bands
 * the document behind a fixed overlay — so the body is pinned with
 * `position: fixed` at the current offset and restored on release. The
 * scrollbar width is compensated with padding so locking does not shift the
 * layout underneath.
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { body, documentElement } = document;
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
      // Restore the exact offset; `position: fixed` discarded it.
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
