'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { ButtonLink } from '@/components/ui/ButtonLink';

export type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Surface digest for support without leaking stacks to the UI
    void error.digest;
  }, [error]);

  return (
    <div className="py-24">
      <Container className="max-w-xl text-center">
        <p className="font-mono-label text-[var(--color-danger)]">Error</p>
        <h1 className="mt-3 text-[length:var(--text-h1)]">Something went wrong</h1>
        <p className="mt-4 text-[var(--color-text-muted)]">
          The page failed to render. You can try again, or jump to a known-good route.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <ButtonLink href="/" variant="secondary">
            Home
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Contact
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
