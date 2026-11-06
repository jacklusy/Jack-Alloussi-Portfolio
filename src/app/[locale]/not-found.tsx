import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/layout/Container';
import { ButtonLink } from '@/components/ui/ButtonLink';

export default async function NotFoundPage() {
  const [t, tNav] = await Promise.all([getTranslations('notFoundPage'), getTranslations('nav')]);

  return (
    <div className="py-24">
      <Container className="max-w-xl text-center">
        <p className="font-mono-label text-[var(--color-brand)]">{t('eyebrow')}</p>
        <h1 className="mt-3 text-[length:var(--text-h1)]">{t('title')}</h1>
        <p className="mt-4 text-[var(--color-text-muted)]">{t('description')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="primary">
            {tNav('home')}
          </ButtonLink>
          <ButtonLink href="/projects" variant="secondary">
            {tNav('projects')}
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            {tNav('contact')}
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
