import { notFound } from 'next/navigation';

/**
 * Catch-all so that any unknown URL under a valid language (`/de/nope`)
 * renders the localised `not-found.tsx` inside the locale layout.
 */
export default function CatchAllPage() {
  notFound();
}
