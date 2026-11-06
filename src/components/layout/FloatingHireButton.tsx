'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Always-visible hire CTA — satisfies persistent contact access.
 */
export function FloatingHireButton() {
  const t = useTranslations('actions');
  const pathname = usePathname();
  const isContact = pathname === '/contact';
  const [contactInView, setContactInView] = useState(false);
  // Mirrors Header's `menuPath` pattern: resetting derived state on a prop
  // change happens during render, not as a `setState` call inside an effect.
  const [observedPath, setObservedPath] = useState(pathname);
  if (pathname !== observedPath) {
    setObservedPath(pathname);
    setContactInView(false);
  }

  // On the home page the closing section already carries the same CTA.
  useEffect(() => {
    const target = document.getElementById('contact');
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setContactInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.35,
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  if (isContact || contactInView) return null;

  return (
    <Link
      href="/contact"
      className={cn(
        'fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] end-[max(1.25rem,env(safe-area-inset-right))] z-[45]',
        'btn-cta inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3',
        'font-medium shadow-[var(--shadow-md)]',
        'transition-[transform,box-shadow] duration-[var(--duration-micro)] ease-[var(--ease-out)]',
        'hover:scale-[1.03] hover:shadow-[var(--shadow-lg)] active:scale-[0.97]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
      )}
      aria-label={t('hireMeAria')}
    >
      <MessageCircle className="h-4 w-4" aria-hidden />
      <span className="hidden sm:inline">{t('hireMe')}</span>
      <span className="sm:hidden">{t('contactShort')}</span>
    </Link>
  );
}
