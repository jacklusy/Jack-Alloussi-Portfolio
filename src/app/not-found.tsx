import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { ButtonLink } from '@/components/ui/ButtonLink';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFoundPage() {
  return (
    <div className="py-24">
      <Container className="max-w-xl text-center">
        <p className="font-mono-label text-[var(--color-brand)]">404</p>
        <h1 className="mt-3 text-[length:var(--text-h1)]">This route does not exist</h1>
        <p className="mt-4 text-[var(--color-text-muted)]">
          The page may have moved. Try projects, experience, or contact.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="primary">
            Home
          </ButtonLink>
          <ButtonLink href="/projects" variant="secondary">
            Projects
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost">
            Contact
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
