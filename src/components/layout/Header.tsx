'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { mainNav } from '@/config/navigation';
import { profile } from '@/content/profile';
import { Container } from '@/components/layout/Container';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);
  const menuId = useId();

  useEffect(() => {
    function onScroll() {
      setIsCondensed(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-[var(--z-header)] border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md transition-[height,box-shadow] duration-[var(--duration-standard)]',
        isCondensed && 'shadow-[var(--shadow-sm)]',
      )}
    >
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-syne)] text-lg font-semibold tracking-tight text-[var(--color-text)]"
        >
          {profile.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {mainNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'min-h-11 rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] transition-colors duration-[var(--duration-micro)]',
                  isActive
                    ? 'bg-[var(--color-brand-subtle)] text-[var(--color-brand)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]" />
          <ButtonLink
            href={profile.cv.href}
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex"
            download={profile.cv.filename}
          >
            CV
          </ButtonLink>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text)] md:hidden"
            aria-expanded={isOpen}
            aria-controls={menuId}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </Container>

      {isOpen ? (
        <div
          id={menuId}
          className="fixed inset-0 top-[var(--header-height)] z-[var(--z-overlay)] bg-[var(--color-bg)] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col gap-2 p-6" aria-label="Mobile primary">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="min-h-11 rounded-[var(--radius-md)] px-4 py-3 text-lg text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)]"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href={profile.cv.href} variant="primary" download={profile.cv.filename}>
              {profile.cv.label}
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
