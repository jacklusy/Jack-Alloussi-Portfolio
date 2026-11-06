'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { ButtonLink } from '@/components/ui/ButtonLink';

export type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  const t = useTranslations('errorPage');
  const tNav = useTranslations('nav');
  const tActions = useTranslations('actions');

  useEffect(() => {
    // Surface digest for support without leaking stacks to the UI
    void error.digest;
  }, [error]);

  return (
    <div className="py-24">
      <Container className="max-w-xl text-center">
        <p className="font-mono-label text-[var(--color-danger)]">{t('eyebrow')}</p>
        <h1 className="mt-3 text-[length:var(--text-h1)]">{t('title')}</h1>
        <p className="mt-4 text-[var(--color-text-muted)]">{t('description')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={reset}>
            {tActions('tryAgain')}
          </Button>
          <ButtonLink href="/" variant="secondary">
            {tNav('home')}
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            {tNav('contact')}
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
